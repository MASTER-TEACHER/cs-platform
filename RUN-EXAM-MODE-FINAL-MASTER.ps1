param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$summary = Join-Path $ProjectRoot "EXAM-MODE-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "EXAM-MODE-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - EXAM MODE + INTEGRITY FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

$expected = @(
  "app\exam\page.tsx",
  "app\assignments\exam\page.tsx",
  "app\assignments\exam\[assignmentId]\page.tsx",
  "app\teacher\exam-assignments\page.tsx",
  "app\teacher\exam-assignments\[assignmentId]\page.tsx",
  "app\teacher\exam-assignments\[assignmentId]\submissions\[studentId]\page.tsx",
  "services\examAssignmentService.ts",
  "services\examSubmissionService.ts",
  "services\assignmentResultService.ts",
  "components\teacher\exam-assignments\ExamIntegrityPolicyCard.tsx"
)

$inventory = New-Object System.Collections.Generic.List[string]
$missing = New-Object System.Collections.Generic.List[string]

foreach ($relative in $expected) {
  if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
    $inventory.Add("[OK] $relative")
  }
  else {
    $inventory.Add("[MISSING] $relative")
    $missing.Add($relative)
  }
}

$roots = @(
  "app\exam",
  "app\assignments\exam",
  "app\teacher\exam-assignments",
  "components\exam",
  "components\quiz",
  "components\teacher\exam-assignments",
  "services"
)

$files = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $roots) {
  $root = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx |
    ForEach-Object {
      $relative = $_.FullName.Substring($ProjectRoot.Length).TrimStart("\")

      if (
        $relative -like "*exam*" -or
        $relative -like "*Exam*" -or
        $relative -like "*quiz*" -or
        $relative -like "*integrity*" -or
        $relative -like "*submission*"
      ) {
        if (-not $files.Contains($relative)) {
          $files.Add($relative)
        }
      }
    }
}

$files = @($files | Sort-Object)

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "disabled={true}"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $markerPatterns) {
    $matches = Select-String `
      -LiteralPath $full `
      -SimpleMatch `
      -Pattern $pattern `
      -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $markers.Add(
        "${relative}:$($match.LineNumber): $($match.Line.Trim())"
      )
    }
  }
}

$signalPatterns = [ordered]@{
  "Fullscreen entry / monitoring" = @(
    "requestFullscreen",
    "fullscreenchange"
  )
  "Visibility monitoring" = @(
    "visibilitychange",
    "document.hidden"
  )
  "Integrity incident logging" = @(
    "incident",
    "integrity"
  )
  "Five-second return countdown" = @(
    "5",
    "countdown"
  )
  "Automatic submission / termination" = @(
    "auto_submit",
    "submit"
  )
  "Teacher integrity policy" = @(
    "warning",
    "pause",
    "auto_submit"
  )
  "Exam autosave" = @(
    "autosave",
    "save"
  )
  "Exam timer" = @(
    "timer",
    "remaining"
  )
}

$signalResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $signalPatterns.GetEnumerator()) {
  $found = New-Object System.Collections.Generic.List[string]

  foreach ($relative in $files) {
    $full = Join-Path $ProjectRoot $relative
    $content = [System.IO.File]::ReadAllText($full)

    $allPresent = $true

    foreach ($needle in $entry.Value) {
      if (-not $content.ToLowerInvariant().Contains($needle.ToLowerInvariant())) {
        $allPresent = $false
        break
      }
    }

    if ($allPresent) {
      $found.Add($relative)
    }
  }

  if ($found.Count -gt 0) {
    $signalResults.Add(
      "[OK] $($entry.Key) - detected in: $($found[0])"
    )
  }
  else {
    $signalResults.Add(
      "[MISSING SIGNAL] $($entry.Key)"
    )
  }
}

$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add("CS MASTER - EXAM MODE + INTEGRITY FINAL MASTER SOURCE BUNDLE")
$bundleLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$bundleLines.Add("Project: $ProjectRoot")
$bundleLines.Add("Files: $($files.Count)")

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  $bundleLines.Add("")
  $bundleLines.Add("=" * 110)
  $bundleLines.Add("FILE: $relative")
  $bundleLines.Add("=" * 110)

  $n = 1

  foreach ($line in Get-Content -LiteralPath $full) {
    $bundleLines.Add(("{0,5}: {1}" -f $n, $line))
    $n++
  }
}

[System.IO.File]::WriteAllLines(
  $bundle,
  $bundleLines,
  [System.Text.UTF8Encoding]::new($false)
)

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

$missingSignals = @(
  $signalResults |
    Where-Object {
      $_.StartsWith("[MISSING SIGNAL]")
    }
).Count

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $missing.Count -eq 0 -and
  $markers.Count -eq 0 -and
  $missingSignals -eq 0
) {
  $status = "PASS CANDIDATE - SOURCE REVIEW REQUIRED"
}
elseif (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "TECHNICALLY PASSING - REMEDIATION REQUIRED"
}
else {
  $status = "NOT YET PASSING"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - EXAM MODE + INTEGRITY FINAL MASTER AUDIT")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("CORE INVENTORY")
$lines.Add("--------------")

foreach ($item in $inventory) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("INTEGRITY / EXAM SIGNALS")
$lines.Add("------------------------")

foreach ($item in $signalResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("DISCOVERED EXAM / INTEGRITY FILES")
$lines.Add("---------------------------------")
$lines.Add("$($files.Count)")
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
$lines.Add("SOURCE BUNDLE")
$lines.Add("-------------")
$lines.Add($bundle)
$lines.Add("")
$lines.Add("BOUNDARY")
$lines.Add("--------")
$lines.Add("Exam Mode is integrity monitoring, not a guaranteed lockdown browser.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " EXAM MODE MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"