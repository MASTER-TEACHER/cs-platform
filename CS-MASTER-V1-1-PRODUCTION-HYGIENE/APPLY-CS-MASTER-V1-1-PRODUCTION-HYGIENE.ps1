param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"

$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "Project root not found: $ProjectRoot"
}

$backupRoot = Join-Path $env:TEMP ("CS-MASTER-V1-1-PRODUCTION-HYGIENE-BACKUP-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$files = @(
  "components\layout\Sidebar.tsx",
  "scripts\encoding-audit.mjs",
  ".editorconfig"
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

    if ($backupDir) {
      New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }

    Copy-Item -LiteralPath $destination -Destination $backup -Force
  }

  $destinationDir = Split-Path -Parent $destination

  if ($destinationDir) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }

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

$packageJson = Join-Path $ProjectRoot "package.json"

if (-not (Test-Path -LiteralPath $packageJson)) {
  throw "package.json not found: $packageJson"
}

Copy-Item -LiteralPath $packageJson -Destination (Join-Path $backupRoot "package.json") -Force

node (Join-Path $PackageRoot "PATCH-PACKAGE-JSON.mjs") $ProjectRoot

Write-Host ""
Write-Host "CS Master v1.1 production hygiene batch applied." -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sidebar navigation is now text-only." -ForegroundColor Cyan
Write-Host "UTF-8 editor settings added." -ForegroundColor Cyan
Write-Host "Encoding/mojibake audit added to npm run verify." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: npm run encoding:audit" -ForegroundColor Yellow
Write-Host "Then: npm run verify" -ForegroundColor Yellow
