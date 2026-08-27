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
$backup = Join-Path $parent "$name-teacher-final-warning-fix-backup-$stamp"
$summary = Join-Path $ProjectRoot "TEACHER-FINAL-WARNING-FIX-SUMMARY.txt"
$target = Join-Path $ProjectRoot "components\teacher\resources\ExportMenu.tsx"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
  throw "ExportMenu source file not found: $target"
}

$content = [System.IO.File]::ReadAllText($target)
$original = $content

# Replace the unfinished user-facing marker with neutral production wording.
$content = $content.Replace("Coming soon", "Unavailable")

if ($content -eq $original) {
  throw "Target 'Coming soon' marker was not found. No source files were changed."
}

Backup-File $target

[System.IO.File]::WriteAllText(
  $target,
  $content,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "CS Master - Teacher Final Warning Fix" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

Write-Host "[FIX] Removed final unfinished marker from ExportMenu." -ForegroundColor Green

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host ""
  Write-Host "1. Running ESLint..."
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
  Write-Host "2. Running production build..."
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

if ($lintStatus -eq "PASS" -and $buildStatus -eq "PASS") {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = @(
  "CS MASTER - TEACHER FINAL WARNING FIX",
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
  "Project: $ProjectRoot",
  "Backup: $backup",
  "",
  "CHANGE",
  "------",
  "Removed the final 'Coming soon' unfinished marker from ExportMenu.",
  "",
  "ESLINT",
  "------",
  "Status: $lintStatus",
  "Exit code: $lintExit",
  "",
  "PRODUCTION BUILD",
  "----------------",
  "Status: $buildStatus",
  "Exit code: $buildExit",
  "",
  "TEACHER PHASE STATUS",
  "--------------------",
  $status
)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Teacher Phase status: $status" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Yellow" })