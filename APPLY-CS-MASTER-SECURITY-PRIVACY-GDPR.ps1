param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"

# ------------------------------------------------------------
# CS MASTER
# Security / Privacy / GDPR Batch Installer
# ------------------------------------------------------------

$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Resolve both paths so comparisons are reliable.
$PackageRootResolved = [System.IO.Path]::GetFullPath(
    (Resolve-Path -LiteralPath $PackageRoot).Path
).TrimEnd('\')

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
    throw "Project root not found: $ProjectRoot"
}

$ProjectRootResolved = [System.IO.Path]::GetFullPath(
    (Resolve-Path -LiteralPath $ProjectRoot).Path
).TrimEnd('\')

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " CS MASTER - SECURITY / PRIVACY / GDPR" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package root : $PackageRootResolved" -ForegroundColor DarkGray
Write-Host "Project root : $ProjectRootResolved" -ForegroundColor DarkGray
Write-Host ""

# ------------------------------------------------------------
# SAFETY CHECK
# ------------------------------------------------------------
#
# The installer package and the destination project must not be
# the same directory. Otherwise PowerShell would attempt to copy
# files onto themselves.
# ------------------------------------------------------------

if (
    [string]::Equals(
        $PackageRootResolved,
        $ProjectRootResolved,
        [System.StringComparison]::OrdinalIgnoreCase
    )
) {
    Write-Host "INSTALLATION NOT REQUIRED / INVALID PACKAGE LOCATION" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The installer package is currently inside the same folder" -ForegroundColor Yellow
    Write-Host "as the CS Master project:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  $ProjectRootResolved" -ForegroundColor White
    Write-Host ""
    Write-Host "This would cause the installer to copy files onto themselves." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "No project files have been changed by this run." -ForegroundColor Green
    Write-Host ""

    throw "PackageRoot and ProjectRoot cannot be the same directory."
}

# ------------------------------------------------------------
# BACKUP DIRECTORY
# ------------------------------------------------------------

$backupRoot = Join-Path $env:TEMP (
    "CS-MASTER-SECURITY-PRIVACY-BACKUP-" +
    (Get-Date -Format "yyyyMMdd-HHmmss")
)

New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

Write-Host "Backup directory:" -ForegroundColor Cyan
Write-Host "  $backupRoot" -ForegroundColor DarkGray
Write-Host ""

# ------------------------------------------------------------
# FILE MANIFEST
# ------------------------------------------------------------

$files = @(
    "SECURITY_PRIVACY_RELEASE_TESTS.md",
    "firestore.rules",
    "README_SECURITY_PRIVACY_BATCH.md",
    "next.config.js",

    "docs\privacy\CS_MASTER_DPIA.md",
    "docs\privacy\SUBPROCESSOR_REGISTER.md",
    "docs\privacy\DATA_MAP.md",
    "docs\privacy\SECURITY_AND_INCIDENT_RESPONSE.md",
    "docs\privacy\RETENTION_SCHEDULE.md",
    "docs\privacy\SCHOOL_DATA_PROCESSING_TERMS_TEMPLATE.md",
    "docs\privacy\GDPR_READINESS_CHECKLIST.md",

    "app\security\page.tsx",
    "app\cookies\page.tsx",
    "app\data-rights\page.tsx",
    "app\privacy\page.tsx",
    "app\admin\privacy-requests\page.tsx",

    "app\api\privacy\requests\route.ts",
    "app\api\admin\privacy-requests\route.ts",

    "components\legal\PublicInformationPage.tsx",

    "components\layout\AppShell.tsx",
    "components\layout\Sidebar.tsx",

    "lib\auth\requireUser.ts",
    "lib\admin\requirePlatformAdmin.ts"
)

# ------------------------------------------------------------
# VALIDATE PACKAGE BEFORE TOUCHING PROJECT
# ------------------------------------------------------------

Write-Host "Validating package..." -ForegroundColor Cyan

$missingFiles = @()

foreach ($relative in $files) {

    $source = Join-Path $PackageRootResolved $relative

    if (-not (Test-Path -LiteralPath $source)) {
        $missingFiles += $relative
    }
}

if ($missingFiles.Count -gt 0) {

    Write-Host ""
    Write-Host "Package validation failed." -ForegroundColor Red
    Write-Host "The following package files are missing:" -ForegroundColor Red
    Write-Host ""

    foreach ($missing in $missingFiles) {
        Write-Host "  - $missing" -ForegroundColor Yellow
    }

    Write-Host ""

    throw "Security / Privacy package is incomplete."
}

Write-Host "Package validation passed." -ForegroundColor Green
Write-Host ""

# ------------------------------------------------------------
# APPLY FILES
# ------------------------------------------------------------

$updatedCount = 0
$backedUpCount = 0

foreach ($relative in $files) {

    $source = Join-Path $PackageRootResolved $relative
    $destination = Join-Path $ProjectRootResolved $relative

    # --------------------------------------------------------
    # Extra protection against accidental self-copy.
    # --------------------------------------------------------

    $sourceFull = [System.IO.Path]::GetFullPath($source)
    $destinationFull = [System.IO.Path]::GetFullPath($destination)

    if (
        [string]::Equals(
            $sourceFull,
            $destinationFull,
            [System.StringComparison]::OrdinalIgnoreCase
        )
    ) {
        throw "Safety stop: source and destination are identical: $relative"
    }

    # --------------------------------------------------------
    # Backup existing project file.
    # --------------------------------------------------------

    if (Test-Path -LiteralPath $destination) {

        $backup = Join-Path $backupRoot $relative
        $backupDir = Split-Path -Parent $backup

        if (-not (Test-Path -LiteralPath $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }

        Copy-Item `
            -LiteralPath $destination `
            -Destination $backup `
            -Force

        $backedUpCount++
    }

    # --------------------------------------------------------
    # Ensure destination directory exists.
    # --------------------------------------------------------

    $destinationDir = Split-Path -Parent $destination

    if (-not (Test-Path -LiteralPath $destinationDir)) {
        New-Item `
            -ItemType Directory `
            -Path $destinationDir `
            -Force |
        Out-Null
    }

    # --------------------------------------------------------
    # Copy package file.
    # --------------------------------------------------------

    Copy-Item `
        -LiteralPath $source `
        -Destination $destination `
        -Force

    $updatedCount++

    Write-Host "Updated: $relative" -ForegroundColor Green
}

# ------------------------------------------------------------
# COMPLETE
# ------------------------------------------------------------

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " SECURITY / PRIVACY / GDPR BATCH COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files applied : $updatedCount" -ForegroundColor Cyan
Write-Host "Files backed up: $backedUpCount" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup:" -ForegroundColor Cyan
Write-Host "  $backupRoot" -ForegroundColor White
Write-Host ""
Write-Host "Next validation command:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  npm run verify" -ForegroundColor White
Write-Host ""