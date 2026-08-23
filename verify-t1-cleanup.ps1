param(
    [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $ProjectRoot).Path

Write-Host ""
Write-Host "CS Master - T1 cleanup verification" -ForegroundColor Cyan
Write-Host ""

$failures = @()

$forbiddenPaths = @(
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

foreach ($relative in $forbiddenPaths) {
    if (Test-Path (Join-Path $root $relative)) {
        $failures += "Temporary path still exists: $relative"
    }
}

# Search project source for references to the temporary routes/services.
$searchRoots = @(
    (Join-Path $root "app"),
    (Join-Path $root "components"),
    (Join-Path $root "hooks"),
    (Join-Path $root "services")
) | Where-Object { Test-Path $_ }

$patterns = @(
    "/teacher/dev/t1g",
    "/teacher/dev/t1h",
    "/teacher/dev/t1i",
    "/teacher/dev/t1j",
    "/teacher/dev/t1k",
    "/teacher/dev/t1l",
    "legacySchoolMigrationService",
    "t1iSchoolIntegrityService",
    "t1jMembershipLifecycleService",
    "t1kInvitationIntegrityService",
    "t1lFinalTeacherAuditService"
)

foreach ($searchRoot in $searchRoots) {
    $files = Get-ChildItem $searchRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue

    foreach ($pattern in $patterns) {
        $matches = $files | Select-String -SimpleMatch $pattern -ErrorAction SilentlyContinue
        foreach ($match in $matches) {
            $relative = $match.Path.Substring($root.Length + 1)
            $failures += "Reference remains: $relative:$($match.LineNumber) -> $pattern"
        }
    }
}

# IMPORTANT: inspect local Firestore rules for the temporary T1H migration rule.
$rulesPath = Join-Path $root "firestore.rules"
$legacyRuleFound = $false

if (Test-Path $rulesPath) {
    $legacyMarkers = @(
        "legacy_roster",
        "migrationClassId",
        "migratedBy",
        "T1H LEGACY ROSTER",
        "LEGACY ROSTER -> SCHOOL TENANCY"
    )

    $rulesText = Get-Content -LiteralPath $rulesPath -Raw

    foreach ($marker in $legacyMarkers) {
        if ($rulesText.Contains($marker)) {
            $legacyRuleFound = $true
            Write-Host "TEMP FIRESTORE MARKER FOUND: $marker" -ForegroundColor Red
        }
    }

    if (-not $legacyRuleFound) {
        Write-Host "Firestore rules: no T1H legacy migration marker found locally." -ForegroundColor Green
    }
} else {
    Write-Host "firestore.rules not found locally; verify your Firebase Console rules separately." -ForegroundColor Yellow
}

Write-Host ""

if ($failures.Count -gt 0) {
    Write-Host "CLEANUP VERIFICATION FAILED:" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

if ($legacyRuleFound) {
    Write-Host "Source cleanup passed, BUT the temporary T1H Firestore migration rule still appears to exist." -ForegroundColor Yellow
    Write-Host "Follow FIRESTORE-T1H-RULE-CLEANUP.txt before deploying rules."
    exit 2
}

Write-Host "T1 temporary source cleanup verified." -ForegroundColor Green
Write-Host "Now run npm run build."
