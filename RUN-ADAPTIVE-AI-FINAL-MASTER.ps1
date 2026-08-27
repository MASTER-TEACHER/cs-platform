param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$summary = Join-Path $ProjectRoot "ADAPTIVE-AI-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "ADAPTIVE-AI-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - ADAPTIVE LEARNING + AI TUTOR FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

$expected = @(
  "app\adaptive-learning\page.tsx",
  "app\tutor\page.tsx",
  "app\api\ai\student-tutor\route.ts",
  "services\adaptiveLearningService.ts",
  "components\adaptive\ReviewSchedule.tsx"
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
  "app\adaptive-learning",
  "app\tutor",
  "app\api\ai",
  "components\adaptive",
  "components\tutor",
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
        $relative -like "*adaptive*" -or
        $relative -like "*tutor*" -or
        $relative -like "*ai*" -or
        $relative -like "*mastery*" -or
        $relative -like "*review*"
      ) {
        if (-not $files.Contains($relative)) {
          $files.Add($relative)
        }
      }
    }
}

$files = @($files | Sort-Object)

$patterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "temporary",
  "disabled={true}",
  "placeholder response",
  "hardcoded response"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $patterns) {
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

$signalChecks = [ordered]@{
  "Adaptive dashboard/page" = @(
    "app\adaptive-learning\page.tsx"
  )
  "Student tutor page" = @(
    "app\tutor\page.tsx"
  )
  "Student tutor API" = @(
    "app\api\ai\student-tutor\route.ts"
  )
  "Adaptive learning service" = @(
    "services\adaptiveLearningService.ts"
  )
  "Review scheduling" = @(
    "components\adaptive\ReviewSchedule.tsx"
  )
}

$workflowResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $signalChecks.GetEnumerator()) {
  $missingForCheck = @()

  foreach ($relative in $entry.Value) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf)) {
      $missingForCheck += $relative
    }
  }

  if ($missingForCheck.Count -eq 0) {
    $workflowResults.Add("[OK] $($entry.Key)")
  }
  else {
    $workflowResults.Add(
      "[PARTIAL] $($entry.Key) - missing: $($missingForCheck -join ', ')"
    )
  }
}

# Create a readable source bundle for one-shot remediation.
$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add("CS MASTER - ADAPTIVE LEARNING + AI TUTOR FINAL MASTER SOURCE BUNDLE")
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

$partialWorkflowCount = @(
  $workflowResults |
    Where-Object {
      $_.StartsWith("[PARTIAL]")
    }
).Count

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $missing.Count -eq 0 -and
  $partialWorkflowCount -eq 0 -and
  $markers.Count -eq 0
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

$lines.Add("CS MASTER - ADAPTIVE LEARNING + AI TUTOR FINAL MASTER AUDIT")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("CORE INVENTORY")
$lines.Add("--------------")

foreach ($item in $inventory) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("WORKFLOW SIGNALS")
$lines.Add("----------------")

foreach ($item in $workflowResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("DISCOVERED ADAPTIVE / AI FILES")
$lines.Add("------------------------------")
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
$lines.Add("ADAPTIVE + AI PHASE STATUS")
$lines.Add("--------------------------")
$lines.Add($status)
$lines.Add("")
$lines.Add("SOURCE BUNDLE")
$lines.Add("-------------")
$lines.Add($bundle)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ADAPTIVE + AI MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"