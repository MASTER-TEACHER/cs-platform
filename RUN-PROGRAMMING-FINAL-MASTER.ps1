param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$summary = Join-Path $ProjectRoot "PROGRAMMING-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "PROGRAMMING-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - LIVE PROGRAMMING FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

$expected = @(
  "app\programming\page.tsx",
  "app\assignments\programming\page.tsx",
  "app\assignments\programming\[assignmentId]\page.tsx",
  "app\teacher\programming-assignments\page.tsx",
  "app\teacher\programming-assignments\[assignmentId]\page.tsx",
  "services\programmingAssignmentService.ts"
)

$inventory = New-Object System.Collections.Generic.List[string]
$missing = New-Object System.Collections.Generic.List[string]

foreach ($relative in $expected) {
  if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
    $inventory.Add("[OK] $relative")
  } else {
    $inventory.Add("[MISSING] $relative")
    $missing.Add($relative)
  }
}

$roots = @(
  "app\programming",
  "app\assignments\programming",
  "app\teacher\programming-assignments",
  "components\programming",
  "components\teacher",
  "services"
)

$files = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $roots) {
  $root = Join-Path $ProjectRoot $relativeRoot
  if (-not (Test-Path -LiteralPath $root)) { continue }

  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx |
    ForEach-Object {
      $relative = $_.FullName.Substring($ProjectRoot.Length).TrimStart("\")
      if (
        $relative -like "*program*" -or
        $relative -like "*Programming*" -or
        $relative -like "*assignment*"
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
  "disabled={true}",
  "Run Code",
  "Submit",
  "test case",
  "stdin",
  "stdout",
  "execution",
  "Pyodide",
  "Skulpt",
  "Monaco",
  "CodeMirror"
)

$signals = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $patterns) {
    $matches = Select-String -LiteralPath $full -SimpleMatch -Pattern $pattern -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $signals.Add("${relative}:$($match.LineNumber): $($match.Line.Trim())")
    }
  }
}

$bundleLines = New-Object System.Collections.Generic.List[string]
$bundleLines.Add("CS MASTER - LIVE PROGRAMMING FINAL MASTER SOURCE BUNDLE")
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

if ($lintStatus -eq "PASS" -and $buildStatus -eq "PASS" -and $missing.Count -eq 0) {
  $status = "AUDIT COMPLETE - REMEDIATION DECISION REQUIRED"
} else {
  $status = "NOT YET PASSING"
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("CS MASTER - LIVE PROGRAMMING FINAL MASTER AUDIT")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("CORE INVENTORY")
$lines.Add("--------------")
foreach ($item in $inventory) { $lines.Add($item) }
$lines.Add("")
$lines.Add("DISCOVERED PROGRAMMING-SCOPE FILES")
$lines.Add("----------------------------------")
$lines.Add("$($files.Count)")
$lines.Add("")
$lines.Add("IMPLEMENTATION SIGNALS")
$lines.Add("----------------------")
$lines.Add("Count: $($signals.Count)")
foreach ($item in $signals) { $lines.Add($item) }
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
$lines.Add("PROGRAMMING PHASE STATUS")
$lines.Add("------------------------")
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
Write-Host "Summary: $summary" -ForegroundColor Yellow
Write-Host "Bundle:  $bundle" -ForegroundColor Yellow
Write-Host "Status:  $status"