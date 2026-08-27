param(
  [Parameter(Mandatory=$true)][string]$BackupFolder,
  [string]$ProjectRoot = "."
)
$ErrorActionPreference = "Stop"
$project = (Resolve-Path $ProjectRoot).Path
$backup = (Resolve-Path $BackupFolder).Path
Get-ChildItem $backup -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($backup.Length).TrimStart('\','/')
  $target = Join-Path $project $relative
  New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
  Copy-Item $_.FullName $target -Force
  Write-Host "[RESTORED] $relative" -ForegroundColor Yellow
}
Write-Host "Rollback complete. Files created by P1 that had no pre-P1 copy may be removed manually after review."
