param(
    [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"
$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$payload = Join-Path $packageRoot "payload"
$project = (Resolve-Path $ProjectRoot).Path
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $project "P1-BACKUPS\$stamp"

$files = @(
  ".gitignore",
  "firebase.json",
  "firestore.indexes.json",
  ".env.production.example",
  "app\api\health\route.ts"
)

Write-Host "`nCS Master P1 Production Hardening" -ForegroundColor Cyan
Write-Host "Project: $project"
Write-Host "Backup:  $backup`n"

New-Item -ItemType Directory -Force -Path $backup | Out-Null

foreach ($relative in $files) {
  $target = Join-Path $project $relative
  if (Test-Path $target) {
    $backupTarget = Join-Path $backup $relative
    New-Item -ItemType Directory -Force -Path (Split-Path $backupTarget -Parent) | Out-Null
    Copy-Item $target $backupTarget -Force
  }
}

Get-ChildItem $payload -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($payload.Length).TrimStart('\','/')
  $target = Join-Path $project $relative
  New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
  Copy-Item $_.FullName $target -Force
  Write-Host "[APPLIED] $relative" -ForegroundColor Green
}

Write-Host "`nP1 files applied. Existing files were backed up before replacement." -ForegroundColor Green
Write-Host "NEXT:"
Write-Host "  1. Configure production environment values in your hosting provider."
Write-Host "  2. Configure Firebase Admin credentials using one supported server-only method."
Write-Host "  3. Run: powershell -ExecutionPolicy Bypass -File `"$packageRoot\tools\TEST-P1.ps1`" -ProjectRoot `"$project`""
