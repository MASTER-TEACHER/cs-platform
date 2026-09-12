param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"

$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "Project root not found: $ProjectRoot"
}

$backupRoot = Join-Path $env:TEMP ("CS-MASTER-BETA-JOIN-FIXES-BACKUP-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$files = @(
  "components\layout\AppShell.tsx",
  "app\join-school\page.tsx",
  "app\api\classes\join\route.ts",
  "services\classService.ts",
  "components\teacher\classes\ClassSettingsPanel.tsx",
  "app\teacher\classes\[classId]\page.tsx",
  "app\teacher\school\page.tsx"
)

foreach ($relative in $files) {
  $source = Join-Path $PackageRoot $relative
  $destination = Join-Path $ProjectRoot $relative

  if (-not (Test-Path -LiteralPath $source)) {
    throw "Package file missing: $source"
  }

  if (Test-Path -LiteralPath $destination) {
    $backup = Join-Path $backupRoot $relative
    $backupDir = Split-Path -Parent $backup
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -LiteralPath $destination -Destination $backup -Force
  }

  $destinationDir = Split-Path -Parent $destination
  New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null

  $sourceFull = [System.IO.Path]::GetFullPath($source)
  $destinationFull = [System.IO.Path]::GetFullPath($destination)

  if ($sourceFull -ne $destinationFull) {
    Copy-Item -LiteralPath $source -Destination $destination -Force
    Write-Host "Updated $relative" -ForegroundColor Green
  }
  else {
    Write-Host "Skipping copy - source and destination are the same file: $source" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "CS Master beta join fixes applied." -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fix 1: approved teachers can access /join-school without StudentAccessGate redirect." -ForegroundColor Cyan
Write-Host "Fix 2: classes now have reusable permanent join codes for student self-enrolment." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: npm run verify" -ForegroundColor Yellow
