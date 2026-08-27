param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean",
  [Parameter(Mandatory=$true)]
  [string]$BackupFolder
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$backup = (Resolve-Path -LiteralPath $BackupFolder).Path

Write-Host ""
Write-Host "Restoring P1 Lint Pass 2 backup..." -ForegroundColor Yellow

Get-ChildItem -LiteralPath $backup -File -Recurse | ForEach-Object {
  $relative = $_.FullName.Substring($backup.Length).TrimStart("\")
  $destination = Join-Path $root $relative
  $parent = Split-Path -Parent $destination

  if ($parent) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
  Write-Host "Restored: $relative"
}

Write-Host ""
Write-Host "Pass 2 rollback complete." -ForegroundColor Green