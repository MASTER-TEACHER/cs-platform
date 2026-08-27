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

$backup = Join-Path $parent "$name-programming-final-remediation-backup-$stamp"
$summary = Join-Path $ProjectRoot "PROGRAMMING-FINAL-REMEDIATION-SUMMARY.txt"
$servicePath = Join-Path $ProjectRoot "services\programmingAssignmentService.ts"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function Read-Text {
  param([Parameter(Mandatory = $true)][string]$Path)
  return [System.IO.File]::ReadAllText($Path)
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - LIVE PROGRAMMING FINAL REMEDIATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# ------------------------------------------------------------
# 1. Required production programming architecture
# ------------------------------------------------------------

$required = @(
  "app\programming\page.tsx",
  "app\assignments\programming\page.tsx",
  "app\assignments\programming\[assignmentId]\page.tsx",
  "app\teacher\programming-assignments\page.tsx",
  "app\teacher\programming-assignments\[assignmentId]\page.tsx",
  "components\programming\ProgrammingWorkspace.tsx",
  "components\programming\ProgrammingConsole.tsx",
  "services\programmingAssignmentService.ts",
  "services\programmingChallengeService.ts",
  "services\pythonRunnerService.ts",
  "lib\programming\evaluator.ts",
  "hooks\useProgrammingProgress.ts",
  "data\programming\challenges.ts"
)

$missing = New-Object System.Collections.Generic.List[string]

foreach ($relative in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf)) {
    $missing.Add($relative)
  }
}

Write-Host "Required programming files present: $($required.Count - $missing.Count)/$($required.Count)"

# ------------------------------------------------------------
# 2. Harden programming assignment lifecycle
# ------------------------------------------------------------

$changed = $false

if (Test-Path -LiteralPath $servicePath -PathType Leaf) {
  $service = Read-Text -Path $servicePath
  $original = $service

  $old = @'
  if (!assignment.studentIds.includes(studentId)) {
    throw new Error(
      "You are not enrolled in this programming assignment.",
    );
  }

  const id = progressId(assignmentId, studentId);
'@

  $new = @'
  if (!assignment.studentIds.includes(studentId)) {
    throw new Error(
      "You are not enrolled in this programming assignment.",
    );
  }

  if (assignment.status !== "active") {
    throw new Error(
      "This programming assignment is no longer accepting attempts.",
    );
  }

  if (!code.trim()) {
    throw new Error(
      "Enter some Python code before checking the assignment.",
    );
  }

  if (
    !Number.isFinite(passedCount) ||
    !Number.isFinite(totalTests) ||
    passedCount < 0 ||
    totalTests <= 0 ||
    passedCount > totalTests
  ) {
    throw new Error(
      "The programming test result is invalid.",
    );
  }

  if (passed && passedCount !== totalTests) {
    throw new Error(
      "A programming assignment can only complete when every test passes.",
    );
  }

  const id = progressId(assignmentId, studentId);
'@

  if ($service.Contains($old)) {
    Backup-File -Path $servicePath
    $service = $service.Replace($old, $new)

    [System.IO.File]::WriteAllText(
      $servicePath,
      $service,
      [System.Text.UTF8Encoding]::new($false)
    )

    $changed = $true
    Write-Host "[FIX] Hardened programming attempt validation." -ForegroundColor Green
  }
  elseif ($service.Contains("This programming assignment is no longer accepting attempts.")) {
    Write-Host "[OK] Programming attempt validation already hardened." -ForegroundColor Green
  }
  else {
    throw "Could not locate the audited programming attempt block. No safe replacement was made."
  }
}

# ------------------------------------------------------------
# 3. Static integration gates
# ------------------------------------------------------------

$checks = New-Object System.Collections.Generic.List[string]
$failedChecks = New-Object System.Collections.Generic.List[string]

function Add-ContentCheck {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string]$RelativePath,
    [Parameter(Mandatory = $true)][string[]]$Needles
  )

  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    $failedChecks.Add("$Label - file missing: $RelativePath")
    return
  }

  $text = Read-Text -Path $path
  $missingNeedles = @(
    $Needles | Where-Object {
      -not $text.Contains($_)
    }
  )

  if ($missingNeedles.Count -eq 0) {
    $checks.Add("[OK] $Label")
  }
  else {
    $failedChecks.Add(
      "$Label - missing signal(s): $($missingNeedles -join ', ')"
    )
  }
}

Add-ContentCheck `
  -Label "Browser Python runner" `
  -RelativePath "services\pythonRunnerService.ts" `
  -Needles @("timeoutMs", "stdout", "stderr")

Add-ContentCheck `
  -Label "Programming evaluator" `
  -RelativePath "lib\programming\evaluator.ts" `
  -Needles @("visibleTests", "hiddenTests")

Add-ContentCheck `
  -Label "Programming workspace execution" `
  -RelativePath "components\programming\ProgrammingWorkspace.tsx" `
  -Needles @("runPython", "evaluateProgrammingChallenge", "recordProgrammingAssignmentAttempt")

Add-ContentCheck `
  -Label "Student assignment completion" `
  -RelativePath "app\assignments\programming\[assignmentId]\page.tsx" `
  -Needles @("ProgrammingWorkspace", "studentIds.includes", "Passing all tests completes this assignment automatically")

Add-ContentCheck `
  -Label "Teacher results workflow" `
  -RelativePath "app\teacher\programming-assignments\[assignmentId]\page.tsx" `
  -Needles @("getProgrammingAssignmentResults", "teacherId")

Add-ContentCheck `
  -Label "Curriculum-aware challenge selection" `
  -RelativePath "services\programmingChallengeService.ts" `
  -Needles @("qualification", "examBoard", "preferredWeakSkills")

# ------------------------------------------------------------
# 4. Genuine unfinished marker scan
# ------------------------------------------------------------

$scanTargets = @(
  "app\programming",
  "app\assignments\programming",
  "app\teacher\programming-assignments",
  "components\programming",
  "services\programmingAssignmentService.ts",
  "services\programmingChallengeService.ts",
  "services\pythonRunnerService.ts",
  "lib\programming",
  "hooks\useProgrammingProgress.ts",
  "data\programming"
)

$patterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "disabled={true}"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($relativeTarget in $scanTargets) {
  $path = Join-Path $ProjectRoot $relativeTarget

  if (-not (Test-Path -LiteralPath $path)) {
    continue
  }

  $targetFiles =
    if (Test-Path -LiteralPath $path -PathType Container) {
      @(Get-ChildItem -LiteralPath $path -Recurse -File -Include *.ts,*.tsx)
    }
    else {
      @(Get-Item -LiteralPath $path)
    }

  foreach ($file in $targetFiles) {
    foreach ($pattern in $patterns) {
      $matches = Select-String `
        -LiteralPath $file.FullName `
        -SimpleMatch `
        -Pattern $pattern `
        -ErrorAction SilentlyContinue

      foreach ($match in $matches) {
        $relative =
          $file.FullName.Substring(
            $ProjectRoot.Length
          ).TrimStart("\")

        $markers.Add(
          "${relative}:$($match.LineNumber): $($match.Line.Trim())"
        )
      }
    }
  }
}

# ------------------------------------------------------------
# 5. ESLint + production build
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
  $lintStatus = if ($lintExit -eq 0) { "PASS" } else { "FAIL" }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE
  $buildStatus = if ($buildExit -eq 0) { "PASS" } else { "FAIL" }
}
finally {
  Pop-Location
}

if (
  $missing.Count -eq 0 -and
  $failedChecks.Count -eq 0 -and
  $markers.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

# ------------------------------------------------------------
# 6. Summary
# ------------------------------------------------------------

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - LIVE PROGRAMMING FINAL REMEDIATION")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add(
  $(if ($changed) {
    "Hardened programming assignment attempt validation."
  } else {
    "Programming attempt validation was already hardened."
  })
)
$lines.Add("Archived assignments cannot accept new checks.")
$lines.Add("Empty code and impossible test-result combinations are rejected.")
$lines.Add("Completion requires every reported test to pass.")
$lines.Add("")
$lines.Add("REQUIRED ARCHITECTURE")
$lines.Add("---------------------")
$lines.Add("Present: $($required.Count - $missing.Count)/$($required.Count)")
foreach ($item in $missing) {
  $lines.Add("[MISSING] $item")
}
$lines.Add("")
$lines.Add("INTEGRATION CHECKS")
$lines.Add("------------------")
foreach ($item in $checks) {
  $lines.Add($item)
}
foreach ($item in $failedChecks) {
  $lines.Add("[FAIL] $item")
}
$lines.Add("")
$lines.Add("GENUINE UNFINISHED MARKERS")
$lines.Add("--------------------------")
$lines.Add("Count: $($markers.Count)")
foreach ($item in $markers) {
  $lines.Add($item)
}
$lines.Add("")
$lines.Add("ESLINT")
$lines.Add("------")
$lines.Add("Status: $lintStatus")
$lines.Add("Exit code: $lintExit")
$lines.Add("")
$lines.Add("PRODUCTION BUILD")
$lines.Add("----------------")
$lines.Add("Status: $buildStatus")
$lines.Add("Exit code: $buildExit")
$lines.Add("")
$lines.Add("LIVE PROGRAMMING PHASE STATUS")
$lines.Add("-----------------------------")
$lines.Add($status)
$lines.Add("")
$lines.Add("BOUNDARY")
$lines.Add("--------")
$lines.Add("Programming execution remains an educational browser-side Python runner.")
$lines.Add("It is not treated as a hostile-code security sandbox or high-stakes secure judge.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " LIVE PROGRAMMING FINAL REMEDIATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Live Programming status: $status" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Yellow" })