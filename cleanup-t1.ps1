param(
    [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path $ProjectRoot).Path

Write-Host ""
Write-Host "CS Master - T1 production cleanup" -ForegroundColor Cyan
Write-Host "Project root: $root"
Write-Host ""

# Only temporary T1 development artifacts are included here.
# Real production services/pages are deliberately NOT touched.
$targets = @(
    "app\teacher\dev\t1g",
    "app\teacher\dev\t1h",
    "app\teacher\dev\t1h-migrate",
    "app\teacher\dev\t1i",
    "app\teacher\dev\t1j",
    "app\teacher\dev\t1k",
    "app\teacher\dev\t1l",

    "services\legacySchoolMigrationService.ts",

    "services\dev\t1iSchoolIntegrityService.ts",
    "services\dev\t1jMembershipLifecycleService.ts",
    "services\dev\t1kInvitationIntegrityService.ts",
    "services\dev\t1lFinalTeacherAuditService.ts"
)

# T1G/T1H service names changed during development, so these are removed
# only when they are clearly regression/dev harness files.
$optionalPatterns = @(
    "services\dev\*t1g*.ts",
    "services\dev\*T1G*.ts",
    "services\dev\*t1h*.ts",
    "services\dev\*T1H*.ts"
)

Write-Host "The following temporary paths will be removed when present:" -ForegroundColor Yellow
foreach ($relative in $targets) {
    $full = Join-Path $root $relative
    if (Test-Path $full) {
        Write-Host "  DELETE  $relative"
    }
}

foreach ($pattern in $optionalPatterns) {
    Get-ChildItem -Path (Join-Path $root $pattern) -ErrorAction SilentlyContinue |
        ForEach-Object {
            Write-Host "  DELETE  $($_.FullName.Substring($root.Length + 1))"
        }
}

Write-Host ""
$answer = Read-Host "Type CLEANUP to continue"

if ($answer -ne "CLEANUP") {
    Write-Host "Cancelled. Nothing was deleted." -ForegroundColor Yellow
    exit 0
}

foreach ($relative in $targets) {
    $full = Join-Path $root $relative
    if (Test-Path $full) {
        Remove-Item -LiteralPath $full -Recurse -Force
        Write-Host "Removed $relative" -ForegroundColor Green
    }
}

foreach ($pattern in $optionalPatterns) {
    Get-ChildItem -Path (Join-Path $root $pattern) -ErrorAction SilentlyContinue |
        ForEach-Object {
            $relative = $_.FullName.Substring($root.Length + 1)
            Remove-Item -LiteralPath $_.FullName -Force
            Write-Host "Removed $relative" -ForegroundColor Green
        }
}

# Remove empty dev service directory only; never remove it if unrelated files remain.
$servicesDev = Join-Path $root "services\dev"
if (Test-Path $servicesDev) {
    $remaining = @(Get-ChildItem -LiteralPath $servicesDev -Force)
    if ($remaining.Count -eq 0) {
        Remove-Item -LiteralPath $servicesDev -Force
        Write-Host "Removed empty services\dev folder." -ForegroundColor Green
    } else {
        Write-Host "Kept services\dev because unrelated files remain:" -ForegroundColor Yellow
        $remaining | ForEach-Object { Write-Host "  $($_.Name)" }
    }
}

# Remove empty app/teacher/dev only if nothing else remains.
$teacherDev = Join-Path $root "app\teacher\dev"
if (Test-Path $teacherDev) {
    $remaining = @(Get-ChildItem -LiteralPath $teacherDev -Force)
    if ($remaining.Count -eq 0) {
        Remove-Item -LiteralPath $teacherDev -Force
        Write-Host "Removed empty app\teacher\dev folder." -ForegroundColor Green
    } else {
        Write-Host "Kept app\teacher\dev because unrelated development routes remain:" -ForegroundColor Yellow
        $remaining | ForEach-Object { Write-Host "  $($_.Name)" }
    }
}

Write-Host ""
Write-Host "File cleanup complete." -ForegroundColor Green
Write-Host "Next run: powershell -ExecutionPolicy Bypass -File .\verify-t1-cleanup.ps1"
