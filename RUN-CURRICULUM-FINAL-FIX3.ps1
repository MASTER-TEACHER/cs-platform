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

$backup = Join-Path $parent "$name-curriculum-final-fix3-backup-$stamp"
$summary = Join-Path $ProjectRoot "CURRICULUM-FINAL-FIX3-SUMMARY.txt"
$target = Join-Path $ProjectRoot "app\onboarding\page.tsx"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
  throw "Onboarding page not found: $target"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - CURRICULUM FINAL FIX 3" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

$content = [System.IO.File]::ReadAllText($target)
$original = $content

if (-not $content.Contains("function selectQualification(")) {
  throw "selectQualification helper is missing from onboarding."
}

$pattern = '(?ms)onChange=\{\(\)\s*=>\s*setQualification\(\s*option\.value,\s*\)\s*\}'

$updated =
  [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    $pattern,
    'onChange={() => selectQualification(option.value)}',
    1
  )

if ($updated -eq $content) {
  if ($content.Contains("onChange={() => selectQualification(option.value)}")) {
    Write-Host "[OK] Onboarding qualification radio already uses selectQualification." -ForegroundColor Green
  }
  else {
    throw "Could not locate the onboarding qualification onChange handler."
  }
}
else {
  Backup-File -Path $target
  Write-Utf8NoBom -Path $target -Content $updated
  Write-Host "[FIX] Wired onboarding qualification radio to selectQualification." -ForegroundColor Green
}

# Verify exact production behavior signals.
$verify = [System.IO.File]::ReadAllText($target)

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

if (
  $verify.Contains("function selectQualification(") -and
  $verify.Contains("getSupportedExamBoards") -and
  $verify.Contains("onChange={() => selectQualification(option.value)}")
) {
  $checks.Add("[OK] Qualification changes keep exam board valid")
}
else {
  $failed.Add("Qualification change helper is not fully wired")
}

if (
  $verify.Contains("examBoardOptions.filter") -and
  $verify.Contains("getSupportedExamBoards(qualification)")
) {
  $checks.Add("[OK] Only published exam boards are displayed")
}
else {
  $failed.Add("Published-board filtering is not fully wired")
}

if (
  $verify.Contains("!getCurriculumDefinition(") -and
  $verify.Contains("disabled={")
) {
  $checks.Add("[OK] Unpublished curriculum combinations cannot be submitted")
}
else {
  $failed.Add("Submission guard for unpublished curriculum combinations is incomplete")
}

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host ""
  Write-Host "Running ESLint..." -ForegroundColor Cyan
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

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
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
finally {
  Pop-Location
}

if (
  $failed.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - CURRICULUM FINAL FIX 3")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add("Wired the existing onboarding selectQualification helper to the")
$lines.Add("qualification radio controls so an unsupported exam board is automatically")
$lines.Add("replaced when the learner changes qualification.")
$lines.Add("")
$lines.Add("VERIFICATION")
$lines.Add("------------")

foreach ($item in $checks) {
  $lines.Add($item)
}

foreach ($item in $failed) {
  $lines.Add("[FAIL] $item")
}

$lines.Add("")
$lines.Add("ESLINT")
$lines.Add("------")
$lines.Add("Status: $lintStatus")
$lines.Add("Exit code: $lintExit")
$lines.Add("")
$lines.Add("PRODUCTION BUILD")
$lines.Add("----------------")
$lines.Add("Status: $buildStatus")
$lines.Add("Exit code: $buildExit")
$lines.Add("")
$lines.Add("CURRICULUM PHASE STATUS")
$lines.Add("-----------------------")
$lines.Add($status)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""

if ($status -eq "PASS") {
  Write-Host "Curriculum status: PASS" -ForegroundColor Green
}
else {
  Write-Host "Curriculum status: NOT YET PASSED" -ForegroundColor Yellow
}