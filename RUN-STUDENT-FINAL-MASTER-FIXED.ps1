param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"

$summary = Join-Path $ProjectRoot "STUDENT-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "STUDENT-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - STUDENT PHASE FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

# ------------------------------------------------------------
# 1. Student-facing route inventory
# ------------------------------------------------------------

$expectedRoutes = @(
  "app\dashboard\page.tsx",
  "app\learn\page.tsx",
  "app\learn\[topicId]\page.tsx",
  "app\quiz\page.tsx",
  "app\assignments\page.tsx",
  "app\assignments\[assignmentId]\page.tsx",
  "app\exam\page.tsx",
  "app\exam-trainer\page.tsx",
  "app\programming\page.tsx",
  "app\visualisers\page.tsx"
)

$routeResults = New-Object System.Collections.Generic.List[string]
$presentRoutes = 0

foreach ($relative in $expectedRoutes) {
  $full = Join-Path $ProjectRoot $relative

  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $presentRoutes++
    $routeResults.Add("[OK] $relative")
  }
  else {
    $routeResults.Add("[MISSING] $relative")
  }
}

# ------------------------------------------------------------
# 2. Discover student-related files dynamically
# ------------------------------------------------------------

$roots = @(
  "app\dashboard",
  "app\learn",
  "app\quiz",
  "app\assignments",
  "app\exam",
  "app\exam-trainer",
  "app\programming",
  "app\visualisers",
  "components\dashboard",
  "components\lesson",
  "components\quiz",
  "components\exam",
  "components\exam-trainer",
  "components\programming",
  "components\adaptive",
  "services"
)

$studentFiles = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $roots) {
  $root = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx |
    ForEach-Object {
      $relative = $_.FullName.Substring($ProjectRoot.Length).TrimStart("\")
      if (-not $studentFiles.Contains($relative)) {
        $studentFiles.Add($relative)
      }
    }
}

$studentFiles = @($studentFiles | Sort-Object)

# ------------------------------------------------------------
# 3. Scan for obvious unfinished / disconnected markers
# ------------------------------------------------------------

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "temporary",
  "placeholder",
  "next wiring step",
  "mock data",
  "hardcoded",
  "disabled={true}"
)

$markerFindings = New-Object System.Collections.Generic.List[string]

foreach ($relative in $studentFiles) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $markerPatterns) {
    $matches = Select-String `
      -LiteralPath $full `
      -SimpleMatch `
      -Pattern $pattern `
      -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $markerFindings.Add(
        "${relative}:$($match.LineNumber): $($match.Line.Trim())"
      )
    }
  }
}

# ------------------------------------------------------------
# 4. Check high-value student workflow signals
# ------------------------------------------------------------

$workflowChecks = [ordered]@{
  "Student dashboard" = @(
    "app\dashboard\page.tsx"
  )
  "Curriculum learning" = @(
    "app\learn\page.tsx",
    "app\learn\[topicId]\page.tsx"
  )
  "Assignments" = @(
    "services\unifiedAssignmentService.ts"
  )
  "Quiz assignments" = @(
    "services\quizAssignmentService.ts"
  )
  "Exam assignments" = @(
    "services\examAssignmentService.ts",
    "services\examSubmissionService.ts"
  )
  "Programming assignments" = @(
    "services\programmingAssignmentService.ts"
  )
  "Adaptive learning" = @(
    "services\adaptiveLearningService.ts"
  )
}

$workflowResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $workflowChecks.GetEnumerator()) {
  $missing = @()

  foreach ($relative in $entry.Value) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf)) {
      $missing += $relative
    }
  }

  if ($missing.Count -eq 0) {
    $workflowResults.Add("[OK] $($entry.Key)")
  }
  else {
    $workflowResults.Add("[PARTIAL] $($entry.Key) - missing: $($missing -join ', ')")
  }
}

# ------------------------------------------------------------
# 5. Create one consolidated source bundle
# ------------------------------------------------------------

$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add("CS MASTER - STUDENT PHASE FINAL MASTER SOURCE BUNDLE")
$bundleLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$bundleLines.Add("Project: $ProjectRoot")
$bundleLines.Add("")
$bundleLines.Add("DISCOVERED STUDENT-SCOPE FILES: $($studentFiles.Count)")

foreach ($relative in $studentFiles) {
  $full = Join-Path $ProjectRoot $relative

  $bundleLines.Add("")
  $bundleLines.Add("=" * 110)
  $bundleLines.Add("FILE: $relative")
  $bundleLines.Add("=" * 110)
  $bundleLines.Add("")

  $lineNumber = 1

  foreach ($line in Get-Content -LiteralPath $full) {
    $bundleLines.Add(("{0,5}: {1}" -f $lineNumber, $line))
    $lineNumber++
  }
}

[System.IO.File]::WriteAllLines(
  $bundle,
  $bundleLines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Student source bundle created." -ForegroundColor Green
Write-Host "Discovered files: $($studentFiles.Count)"
Write-Host ""

# ------------------------------------------------------------
# 6. ESLint + production build
# ------------------------------------------------------------

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
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
# 7. Consolidated phase status
# ------------------------------------------------------------

$missingRouteCount = @(
  $routeResults |
    Where-Object {
      $_.StartsWith("[MISSING]")
    }
).Count

$partialWorkflowCount = @(
  $workflowResults |
    Where-Object {
      $_.StartsWith("[PARTIAL]")
    }
).Count

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $markerFindings.Count -eq 0 -and
  $missingRouteCount -eq 0 -and
  $partialWorkflowCount -eq 0
) {
  $studentStatus = "PASS CANDIDATE"
}
elseif (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $studentStatus = "TECHNICALLY PASSING - REMEDIATION REQUIRED"
}
else {
  $studentStatus = "NOT YET PASSING"
}

# ------------------------------------------------------------
# 8. Summary
# ------------------------------------------------------------

$summaryLines = New-Object System.Collections.Generic.List[string]

$summaryLines.Add("CS MASTER - STUDENT PHASE FINAL MASTER AUDIT")
$summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$summaryLines.Add("Project: $ProjectRoot")
$summaryLines.Add("")

$summaryLines.Add("STUDENT ROUTES")
$summaryLines.Add("--------------")
$summaryLines.Add("Present: $presentRoutes/$($expectedRoutes.Count)")

foreach ($item in $routeResults) {
  $summaryLines.Add($item)
}

$summaryLines.Add("")
$summaryLines.Add("WORKFLOW SIGNALS")
$summaryLines.Add("----------------")

foreach ($item in $workflowResults) {
  $summaryLines.Add($item)
}

$summaryLines.Add("")
$summaryLines.Add("UNFINISHED / DISCONNECTED MARKERS")
$summaryLines.Add("---------------------------------")

if ($markerFindings.Count -eq 0) {
  $summaryLines.Add("None")
}
else {
  $summaryLines.Add("Count: $($markerFindings.Count)")

  foreach ($item in $markerFindings) {
    $summaryLines.Add($item)
  }
}

$summaryLines.Add("")
$summaryLines.Add("DISCOVERED SOURCE FILES")
$summaryLines.Add("-----------------------")
$summaryLines.Add("$($studentFiles.Count)")

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
$summaryLines.Add("STUDENT PHASE STATUS")
$summaryLines.Add("--------------------")
$summaryLines.Add($studentStatus)

$summaryLines.Add("")
$summaryLines.Add("SOURCE BUNDLE")
$summaryLines.Add("-------------")
$summaryLines.Add($bundle)

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " STUDENT MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Student Phase status: $studentStatus" -ForegroundColor $(if ($studentStatus -eq "PASS CANDIDATE") { "Green" } elseif ($studentStatus -like "TECHNICALLY*") { "Yellow" } else { "Red" })