param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parent = Split-Path -Parent $ProjectRoot
$name = Split-Path -Leaf $ProjectRoot
$backup = Join-Path $parent "$name-t-final-1b-backup-$stamp"
$summary = Join-Path $ProjectRoot "T-FINAL-1B-SUMMARY.txt"

$targets = @(
  "components\teacher\classes\ClassStudentsManager.tsx",
  "components\teacher\AssignmentResourceStep.tsx",
  "components\teacher\AssignmentReviewStep.tsx",
  "app\teacher\interventions\[interventionId]\page.tsx",
  "components\teacher\resources\AssignResourceModal.tsx"
)

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function U([int[]]$Codes) {
  return -join ($Codes | ForEach-Object { [char]$_ })
}

# Build every non-ASCII token at runtime so this script remains ASCII-only.
$badMiddleDot = U @(0x00C2, 0x00B7)
$goodMiddleDot = U @(0x00B7)

$badRightArrow = U @(0x00E2, 0x2020, 0x2019)
$goodRightArrow = U @(0x2192)

$badLeftArrow = U @(0x00E2, 0x2020, 0x0090)
$goodLeftArrow = U @(0x2190)

$badCheck = U @(0x00E2, 0x0153, 0x201C)
$goodCheck = U @(0x2713)

# UTF-8 multiplication sign decoded incorrectly through Windows-1252.
$badClose = U @(0x00C3, 0x2014)
$goodClose = U @(0x00D7)

$badEmDash = U @(0x00E2, 0x20AC, 0x201D)
$goodEmDash = U @(0x2014)

$replacementPairs = @(
  @($badMiddleDot, $goodMiddleDot),
  @($badRightArrow, $goodRightArrow),
  @($badLeftArrow, $goodLeftArrow),
  @($badCheck, $goodCheck),
  @($badClose, $goodClose),
  @($badEmDash, $goodEmDash)
)

Write-Host ""
Write-Host "CS Master - T-FINAL-1B Teacher UI Encoding Polish" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

$changedFiles = 0
$replacementCount = 0

foreach ($relative in $targets) {
  $path = Join-Path $ProjectRoot $relative

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Required T-FINAL-1B source file was not found: $relative"
  }

  $content = [System.IO.File]::ReadAllText($path)
  $updated = $content
  $fileReplacements = 0

  foreach ($pair in $replacementPairs) {
    $before = [string]$pair[0]
    $after = [string]$pair[1]

    if ($before -and $updated.Contains($before)) {
      $count = ([regex]::Matches(
        $updated,
        [regex]::Escape($before)
      )).Count

      $updated = $updated.Replace($before, $after)
      $fileReplacements += $count
      $replacementCount += $count
    }
  }

  if ($updated -ne $content) {
    Backup-File $path

    [System.IO.File]::WriteAllText(
      $path,
      $updated,
      [System.Text.UTF8Encoding]::new($false)
    )

    $changedFiles++
    Write-Host "[T-FINAL-1B] Normalised $fileReplacements character sequence(s): $relative" -ForegroundColor Green
  }
  else {
    Write-Host "[T-FINAL-1B] No targeted encoding issues found: $relative"
  }
}

Write-Host ""
Write-Host "Changed files: $changedFiles"
Write-Host "Normalised sequences: $replacementCount"
Write-Host ""

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host "1. Running ESLint..."
  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE

  if ($lintExit -eq 0) {
    $lintStatus = "PASS"
    Write-Host "ESLint: PASS" -ForegroundColor Green
  }
  else {
    $lintStatus = "FAIL"
    Write-Host "ESLint: FAIL" -ForegroundColor Red
  }

  if ($lintStatus -eq "PASS") {
    Write-Host ""
    Write-Host "2. Running production build..."
    & npm.cmd run build
    $buildExit = $LASTEXITCODE

    if ($buildExit -eq 0) {
      $buildStatus = "PASS"
      Write-Host "Production build: PASS" -ForegroundColor Green
    }
    else {
      $buildStatus = "FAIL"
      Write-Host "Production build: FAIL" -ForegroundColor Red
    }
  }
  else {
    Write-Host ""
    Write-Host "2. Production build skipped because ESLint failed." -ForegroundColor Yellow
  }
}
finally {
  Pop-Location
}

if ($lintStatus -eq "PASS" -and $buildStatus -eq "PASS") {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = @(
  "CS MASTER - T-FINAL-1B TEACHER UI ENCODING POLISH",
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
  "Project: $ProjectRoot",
  "Backup: $backup",
  "",
  "CHANGE",
  "------",
  "Normalised targeted corrupted teacher-facing UTF-8 character sequences.",
  "This pass changes display text only.",
  "No Firestore schema, tenancy, assignment, intervention or enrolment logic changed.",
  "",
  "Changed files: $changedFiles",
  "Normalised sequences: $replacementCount",
  "",
  "ESLINT",
  "------",
  "Status: $lintStatus",
  "Exit code: $lintExit",
  "",
  "PRODUCTION BUILD",
  "----------------",
  "Status: $buildStatus",
  "Exit code: $buildExit",
  "",
  "T-FINAL-1B STATUS",
  "-----------------",
  $status
)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""

if ($status -eq "PASS") {
  Write-Host "T-FINAL-1B status: PASS" -ForegroundColor Green
}
else {
  Write-Host "T-FINAL-1B status: NOT YET PASSED" -ForegroundColor Yellow
}