param([string]$ProjectRoot=".")
$root=(Resolve-Path $ProjectRoot).Path
$backup=Join-Path $root "P1-BACKUPS"
if(Test-Path $backup){
  Remove-Item $backup -Recurse -Force
  Write-Host "Removed local P1 backup folder." -ForegroundColor Green
}else{
  Write-Host "No P1 backup folder found."
}
