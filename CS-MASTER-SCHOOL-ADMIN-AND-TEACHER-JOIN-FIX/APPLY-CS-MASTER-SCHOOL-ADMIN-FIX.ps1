param(
    [Parameter(Mandatory = $false)]
    [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean"
)

$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$payloadRoot = Join-Path $packageRoot "payload"

if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
    throw "ProjectRoot does not look like the CS Master project: $ProjectRoot"
}

$targets = @(
    "app\admin\schools\page.tsx",
    "app\api\admin\schools\[schoolId]\route.ts",
    "app\api\schools\join\route.ts",
    "app\join-school\page.tsx",
    "app\teacher\school\page.tsx"
)

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $env:TEMP "CS-MASTER-SCHOOL-FIX-BACKUP-$stamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

foreach ($relative in $targets) {
    $source = Join-Path $payloadRoot $relative
    $destination = Join-Path $ProjectRoot $relative

    if (-not (Test-Path -LiteralPath $source)) {
        throw "Missing payload file: $relative"
    }

    if (Test-Path -LiteralPath $destination) {
        $backup = Join-Path $backupRoot $relative
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
        Copy-Item -LiteralPath $destination -Destination $backup -Force
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
    Write-Host "Updated: $relative" -ForegroundColor Green
}

Write-Host ""
Write-Host "CS Master school/admin fix applied." -ForegroundColor Cyan
Write-Host "Backup of replaced files: $backupRoot" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next command:" -ForegroundColor Cyan
Write-Host "  cd `"$ProjectRoot`"; npm run verify" -ForegroundColor White
