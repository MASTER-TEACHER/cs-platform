param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean",
  [Parameter(Mandatory=$true)]
  [string]$BackupFolder
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$backup = (Resolve-Path -LiteralPath $BackupFolder).Path

Write-Host "Restoring P1 lint Pass 1 backup..." -ForegroundColor Yellow

Get-ChildItem -LiteralPath $backup -File -Recurse | ForEach-Object {
  $relative = $_.FullName.Substring($backup.Length).TrimStart("\")
  $destination = Join-Path $root $relative
  $parent = Split-Path -Parent $destination
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
  Write-Host "Restored: $relative"
}

Write-Host "Rollback complete." -ForegroundColor Green