param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parent = Split-Path -Parent $ProjectRoot
$name = Split-Path -Leaf $ProjectRoot

$backup = Join-Path $parent "$name-teacher-final-master-backup-$stamp"
$summary = Join-Path $ProjectRoot "TEACHER-FINAL-MASTER-SUMMARY.txt"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - TEACHER PHASE FINAL MASTER RUN" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    return
  }

  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

$changeLog = New-Object System.Collections.Generic.List[string]
$warningLog = New-Object System.Collections.Generic.List[string]

# ------------------------------------------------------------
# 1. Preserve already completed teacher-final milestones
# ------------------------------------------------------------

$passedMilestones = @()

foreach ($item in @(
  "T-FINAL-1A-SUMMARY.txt",
  "T-FINAL-1B-SUMMARY.txt",
  "T-FINAL-1C-SUMMARY.txt"
)) {
  $path = Join-Path $ProjectRoot $item

  if (Test-Path -LiteralPath $path) {
    $text = [System.IO.File]::ReadAllText($path)

    if ($text -match "(?m)^PASS\s*$") {
      $passedMilestones += $item
    }
  }
}

Write-Host "Already-passed teacher milestones: $($passedMilestones.Count)" -ForegroundColor Green

# ------------------------------------------------------------
# 2. Assignment Wizard production integration checks/fixes
# ------------------------------------------------------------

$wizardPath = Join-Path $ProjectRoot "app\teacher\assignment-wizard\page.tsx"

if (Test-Path -LiteralPath $wizardPath) {
  $wizard = [System.IO.File]::ReadAllText($wizardPath)
  $originalWizard = $wizard

  # Ensure intervention reassessment context is retained.
  if (
    $wizard.Contains('searchParams.get("source")') -and
    $wizard.Contains('searchParams.get("interventionId")')
  ) {
    $changeLog.Add("Verified intervention reassessment context in Assignment Wizard.")
  }
  else {
    $warningLog.Add("Assignment Wizard intervention reassessment context was not detected.")
  }

  # Remove stale copy that says Exam Mode wiring is still a future step.
  $oldExamCopy = @'
                  This assignment will be stored as an assessment quiz. The next
                  wiring step will route assessment quizzes through the existing
                  Exam Mode integrity shell; practice quizzes remain unchanged.
'@

  $newExamCopy = @'
                  This assignment is stored as an assessment quiz for monitored
                  Exam Mode delivery. Practice quizzes remain unchanged.
'@

  if ($wizard.Contains($oldExamCopy)) {
    $wizard = $wizard.Replace($oldExamCopy, $newExamCopy)
    $changeLog.Add("Updated stale assessment-quiz Exam Mode workflow copy.")
  }

  if ($wizard -ne $originalWizard) {
    Backup-File -Path $wizardPath
    Write-Utf8NoBom -Path $wizardPath -Content $wizard
  }
}
else {
  $warningLog.Add("Assignment Wizard page was not found.")
}

# ------------------------------------------------------------
# 3. Teacher route / workflow inventory
# ------------------------------------------------------------

$requiredTeacherRoutes = @(
  "app\teacher\page.tsx",
  "app\teacher\classes\page.tsx",
  "app\teacher\assignments\page.tsx",
  "app\teacher\assignment-wizard\page.tsx",
  "app\teacher\interventions\page.tsx",
  "app\teacher\content\page.tsx",
  "app\teacher\resources\page.tsx",
  "app\teacher\analytics\page.tsx",
  "app\teacher\reports\page.tsx"
)

$presentRoutes = 0

foreach ($relative in $requiredTeacherRoutes) {
  $full = Join-Path $ProjectRoot $relative

  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $presentRoutes++
  }
  else {
    $warningLog.Add("Missing expected teacher route: $relative")
  }
}

$changeLog.Add("Teacher route inventory: $presentRoutes/$($requiredTeacherRoutes.Count) expected routes present.")

# ------------------------------------------------------------
# 4. Detect obvious unfinished production markers
# ------------------------------------------------------------

$teacherRoots = @(
  (Join-Path $ProjectRoot "app\teacher"),
  (Join-Path $ProjectRoot "components\teacher"),
  (Join-Path $ProjectRoot "services")
)

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "temporary placeholder",
  "next wiring step"
)

$markerFindings = New-Object System.Collections.Generic.List[string]

foreach ($root in $teacherRoots) {
  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx |
    ForEach-Object {
      $file = $_

      foreach ($pattern in $markerPatterns) {
        $matches = Select-String `
          -LiteralPath $file.FullName `
          -SimpleMatch `
          -Pattern $pattern `
          -ErrorAction SilentlyContinue

        foreach ($match in $matches) {
          $relative = $file.FullName.Substring($ProjectRoot.Length).TrimStart("\")
          $markerFindings.Add(
            "${relative}:$($match.LineNumber): $($match.Line.Trim())"
          )
        }
      }
    }
}

if ($markerFindings.Count -gt 0) {
  $warningLog.Add("Detected $($markerFindings.Count) unfinished-marker occurrence(s); see summary.")
}
else {
  $changeLog.Add("No obvious TODO/FIXME/coming-soon/not-implemented markers detected in teacher production scope.")
}

# ------------------------------------------------------------
# 5. Check teacher workflow services are present
# ------------------------------------------------------------

$requiredServices = @(
  "services\classService.ts",
  "services\assignmentService.ts",
  "services\resourceAssignmentService.ts",
  "services\programmingAssignmentService.ts",
  "services\interventionService.ts",
  "services\interventionAnalyticsService.ts",
  "services\teacherResourceService.ts",
  "services\teacherContentLibraryService.ts"
)

$presentServices = 0

foreach ($relative in $requiredServices) {
  if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
    $presentServices++
  }
  else {
    $warningLog.Add("Missing expected teacher workflow service: $relative")
  }
}

$changeLog.Add("Teacher workflow service inventory: $presentServices/$($requiredServices.Count) present.")

# ------------------------------------------------------------
# 6. Run ESLint
# ------------------------------------------------------------

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot

try {
  Write-Host ""
  Write-Host "Running ESLint..." -ForegroundColor Cyan

  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE

  if ($lintExit -eq 0) {
    $lintStatus = "PASS"
    Write-Host "ESLint: PASS" -ForegroundColor Green
  }
  else {
    $lintStatus = "FAIL"
    Write-Host "ESLint: FAIL" -ForegroundColor Red
  }

  # ----------------------------------------------------------
  # 7. Run production build
  # ----------------------------------------------------------

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan

  & npm.cmd run build
  $buildExit = $LASTEXITCODE

  if ($buildExit -eq 0) {
    $buildStatus = "PASS"
    Write-Host "Production build: PASS" -ForegroundColor Green
  }
  else {
    $buildStatus = "FAIL"
    Write-Host "Production build: FAIL" -ForegroundColor Red
  }
}
finally {
  Pop-Location
}

# ------------------------------------------------------------
# 8. Final status
# ------------------------------------------------------------

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $warningLog.Count -eq 0
) {
  $teacherStatus = "PASS"
}
elseif (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $teacherStatus = "TECHNICALLY PASSING - REVIEW WARNINGS"
}
else {
  $teacherStatus = "NOT YET PASSED"
}

$summaryLines = New-Object System.Collections.Generic.List[string]

$summaryLines.Add("CS MASTER - TEACHER PHASE FINAL MASTER RUN")
$summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$summaryLines.Add("Project: $ProjectRoot")
$summaryLines.Add("Backup: $backup")
$summaryLines.Add("")

$summaryLines.Add("COMPLETED MILESTONES")
$summaryLines.Add("--------------------")

if ($passedMilestones.Count -eq 0) {
  $summaryLines.Add("None detected")
}
else {
  foreach ($item in $passedMilestones) {
    $summaryLines.Add($item)
  }
}

$summaryLines.Add("")
$summaryLines.Add("MASTER RUN ACTIONS")
$summaryLines.Add("------------------")

foreach ($item in $changeLog) {
  $summaryLines.Add("[OK] $item")
}

$summaryLines.Add("")
$summaryLines.Add("WARNINGS / FOLLOW-UP")
$summaryLines.Add("--------------------")

if ($warningLog.Count -eq 0) {
  $summaryLines.Add("None")
}
else {
  foreach ($item in $warningLog) {
    $summaryLines.Add("[WARN] $item")
  }
}

if ($markerFindings.Count -gt 0) {
  $summaryLines.Add("")
  $summaryLines.Add("UNFINISHED MARKERS")
  $summaryLines.Add("------------------")

  foreach ($item in $markerFindings) {
    $summaryLines.Add($item)
  }
}

$summaryLines.Add("")
$summaryLines.Add("ESLINT")
$summaryLines.Add("------")
$summaryLines.Add("Status: $lintStatus")
$summaryLines.Add("Exit code: $lintExit")

$summaryLines.Add("")
$summaryLines.Add("PRODUCTION BUILD")
$summaryLines.Add("----------------")
$summaryLines.Add("Status: $buildStatus")
$summaryLines.Add("Exit code: $buildExit")

$summaryLines.Add("")
$summaryLines.Add("TEACHER PHASE STATUS")
$summaryLines.Add("--------------------")
$summaryLines.Add($teacherStatus)

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " MASTER RUN COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Teacher Phase status: $teacherStatus" -ForegroundColor $(if ($teacherStatus -eq "PASS") { "Green" } elseif ($teacherStatus -like "TECHNICALLY*") { "Yellow" } else { "Red" })