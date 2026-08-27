param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$summary = Join-Path $ProjectRoot "EXAM-MODE-FINAL-VERIFICATION-SUMMARY.txt"
$target = Join-Path $ProjectRoot "app\assignments\exam\[assignmentId]\page.tsx"
$policyCard = Join-Path $ProjectRoot "components\teacher\exam-assignments\ExamIntegrityPolicyCard.tsx"
$assignmentService = Join-Path $ProjectRoot "services\examAssignmentService.ts"
$submissionService = Join-Path $ProjectRoot "services\examSubmissionService.ts"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - EXAM MODE FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

function Check-FileSignals {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string[]]$Signals
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    $failed.Add("$Label - file missing")
    return
  }

  $text = [System.IO.File]::ReadAllText($Path)

  $missingSignals = @(
    $Signals | Where-Object {
      -not $text.Contains($_)
    }
  )

  if ($missingSignals.Count -eq 0) {
    $checks.Add("[OK] $Label")
  }
  else {
    $failed.Add(
      "$Label - missing: $($missingSignals -join ', ')"
    )
  }
}

Check-FileSignals `
  -Label "Fullscreen entry and monitoring" `
  -Path $target `
  -Signals @(
    "requestFullscreen",
    "fullscreenchange",
    "document.fullscreenElement"
  )

Check-FileSignals `
  -Label "Page visibility monitoring" `
  -Path $target `
  -Signals @(
    "visibilitychange",
    "document.visibilityState",
    '"hidden"',
    '"page_hidden"',
    '"page_visible"'
  )

Check-FileSignals `
  -Label "Five-second fullscreen exit enforcement" `
  -Path $target `
  -Signals @(
    "fullscreenExitCountdownSeconds",
    "beginFullscreenCountdown",
    "terminateForIntegrity",
    "did not return within 5 seconds"
  )

Check-FileSignals `
  -Label "Integrity pause/warn/auto-submit actions" `
  -Path $target `
  -Signals @(
    '"auto_submit"',
    '"pause"',
    "setIntegrityWarning",
    "setIntegrityPaused"
  )

Check-FileSignals `
  -Label "Autosave and manual submission" `
  -Path $target `
  -Signals @(
    "autosaveExamAnswers",
    "submitExamSubmission"
  )

Check-FileSignals `
  -Label "Integrity incident persistence" `
  -Path $submissionService `
  -Signals @(
    "recordExamIntegrityIncident",
    "terminateExamForIntegrity",
    "integrity"
  )

Check-FileSignals `
  -Label "Teacher integrity configuration" `
  -Path $policyCard `
  -Signals @(
    'value="warn"',
    'value="pause"',
    'value="auto_submit"',
    "monitorPageVisibility"
  )

Check-FileSignals `
  -Label "Fixed five-second integrity policy" `
  -Path $assignmentService `
  -Signals @(
    "fullscreenExitCountdownSeconds: 5",
    "monitorPageVisibility",
    "visibilityAction"
  )

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step"
)

$markers = New-Object System.Collections.Generic.List[string]

$scanRoots = @(
  "app\assignments\exam",
  "app\teacher\exam-assignments",
  "components\teacher\exam-assignments",
  "services\examAssignmentService.ts",
  "services\examSubmissionService.ts"
)

foreach ($relativeRoot in $scanRoots) {
  $path = Join-Path $ProjectRoot $relativeRoot

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
    foreach ($pattern in $markerPatterns) {
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

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host "Running ESLint..." -ForegroundColor Cyan
  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE
  $lintStatus =
    if ($lintExit -eq 0) {
      "PASS"
    }
    else {
      "FAIL"
    }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE
  $buildStatus =
    if ($buildExit -eq 0) {
      "PASS"
    }
    else {
      "FAIL"
    }
}
finally {
  Pop-Location
}

if (
  $failed.Count -eq 0 -and
  $markers.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - EXAM MODE FINAL VERIFICATION")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("INTEGRITY VERIFICATION")
$lines.Add("----------------------")

foreach ($item in $checks) {
  $lines.Add($item)
}

foreach ($item in $failed) {
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
$lines.Add("EXAM MODE PHASE STATUS")
$lines.Add("----------------------")
$lines.Add($status)
$lines.Add("")
$lines.Add("BOUNDARY")
$lines.Add("--------")
$lines.Add("Exam Mode provides integrity monitoring and enforcement signals.")
$lines.Add("It is not represented as a guaranteed lockdown browser.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
if ($status -eq "PASS") {
  Write-Host "Exam Mode status: $status" -ForegroundColor Green
}
else {
  Write-Host "Exam Mode status: $status" -ForegroundColor Yellow
}

Write-Host ""
