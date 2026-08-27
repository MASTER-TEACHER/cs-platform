param(
    [string]$ProjectRoot = ".",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Pass([string]$m) {
  Write-Host "[PASS] $m" -ForegroundColor Green
}

function Fail([string]$m) {
  Write-Host "[FAIL] $m" -ForegroundColor Red
  $script:failures.Add($m)
}

function Warn([string]$m) {
  Write-Host "[WARN] $m" -ForegroundColor Yellow
  $script:warnings.Add($m)
}

Write-Host ""
Write-Host "CS Master P1 Production Acceptance v2" -ForegroundColor Cyan
Write-Host "Project: $root"
Write-Host ""

$required = @(
  "package.json",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "lib\firebaseAdmin.ts",
  "app\api\health\route.ts",
  ".env.production.example"
)

foreach ($relative in $required) {
  $path = Join-Path $root $relative

  if (Test-Path -LiteralPath $path -PathType Leaf) {
    Pass "$relative exists"
  }
  else {
    Fail "$relative is missing"
  }
}

$gitignorePath = Join-Path $root ".gitignore"

if (Test-Path -LiteralPath $gitignorePath -PathType Leaf) {
  $gitignore = Get-Content -LiteralPath $gitignorePath -Raw

  if ($gitignore -match '(?m)^\.env\*$') {
    Pass ".env* is ignored"
  }
  else {
    Fail ".env* is not ignored"
  }

  if ($gitignore -match '(?m)^\*\.pem$') {
    Pass "*.pem is ignored"
  }
  else {
    Fail "*.pem is not ignored"
  }

  if ($gitignore -match '(?m)^\*\.key$') {
    Pass "*.key is ignored"
  }
  else {
    Fail "*.key is not ignored"
  }

  if ($gitignore -match 'service-account') {
    Pass "service-account JSON patterns are ignored"
  }
  else {
    Fail "service-account JSON ignore pattern missing"
  }
}

$firebasePath = Join-Path $root "firebase.json"

if (Test-Path -LiteralPath $firebasePath -PathType Leaf) {
  try {
    $firebase = Get-Content -LiteralPath $firebasePath -Raw | ConvertFrom-Json

    if ($firebase.firestore.rules -eq "firestore.rules") {
      Pass "Firestore rules deployment configured"
    }
    else {
      Fail "Firestore rules deployment not configured"
    }

    if ($firebase.firestore.indexes -eq "firestore.indexes.json") {
      Pass "Firestore indexes deployment configured"
    }
    else {
      Fail "Firestore indexes deployment not configured"
    }
  }
  catch {
    Fail "firebase.json could not be parsed"
  }
}

# ------------------------------------------------------------------
# Private-key safety scan
# ------------------------------------------------------------------
# v1 incorrectly failed on source code that merely CONTAINS the text
# "-----BEGIN PRIVATE KEY-----" as a validation string, and on the audit
# report which contains copied source text.
#
# v2 detects an actual PEM block only when a BEGIN marker is followed by
# key-looking base64 material and then an END marker.
# ------------------------------------------------------------------

$privateKeyRegex =
  '(?ms)-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----\s*' +
  '[A-Za-z0-9+/=\r\n]{80,}' +
  '\s*-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'

$scanFiles = Get-ChildItem `
  -LiteralPath $root `
  -Recurse `
  -File `
  -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\.next\\' -and
    $_.FullName -notmatch '\\P1-BACKUPS\\' -and
    $_.Name -ne "P1-PRODUCTION-DEPLOYMENT-AUDIT.txt" -and
    $_.Name -notlike "CREATE-P1-*" -and
    $_.Name -notlike "TEST-P1*"
  }

$privateKeyHit = $false

foreach ($file in $scanFiles) {
  try {
    $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop

    if ($content -match $privateKeyRegex) {
      $relative = $file.FullName.Substring($root.Length).TrimStart("\")
      Fail "Actual private-key PEM block detected in $relative"
      $privateKeyHit = $true
    }
  }
  catch {
    # Binary/unreadable files are ignored by this text-only safety check.
  }
}

if (-not $privateKeyHit) {
  Pass "No actual embedded private-key PEM block detected"
}

# ------------------------------------------------------------------
# Environment contract safety
# ------------------------------------------------------------------

$examplePath = Join-Path $root ".env.production.example"

if (Test-Path -LiteralPath $examplePath -PathType Leaf) {
  $example = Get-Content -LiteralPath $examplePath -Raw

  if (
    $example -match '(?m)^OPENAI_API_KEY=\s*$' -and
    $example -match '(?m)^FIREBASE_ADMIN_PRIVATE_KEY_BASE64=\s*$'
  ) {
    Pass "Production environment template contains no committed secret values"
  }
  else {
    Fail "Production environment template appears to contain populated secrets"
  }
}

# ------------------------------------------------------------------
# Build/lint
# ------------------------------------------------------------------

if (-not $SkipBuild) {
  Push-Location $root

  try {
    Write-Host ""
    Write-Host "Running npm run build..." -ForegroundColor Cyan
    & npm run build

    if ($LASTEXITCODE -ne 0) {
      Fail "npm run build failed"
    }
    else {
      Pass "npm run build succeeded"
    }

    Write-Host ""
    Write-Host "Running npm run lint..." -ForegroundColor Cyan
    & npm run lint

    if ($LASTEXITCODE -ne 0) {
      Fail "npm run lint failed"
    }
    else {
      Pass "npm run lint succeeded"
    }
  }
  finally {
    Pop-Location
  }
}
else {
  Warn "Build/lint skipped by request"
}

Write-Host ""
Write-Host "P1 acceptance summary" -ForegroundColor Cyan
Write-Host "Failures: $($failures.Count)"
Write-Host "Warnings: $($warnings.Count)"

if ($failures.Count -gt 0) {
  Write-Host ""
  Write-Host "P1 STATUS: NOT SIGNED OFF" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "P1 AUTOMATED GATE: PASSED" -ForegroundColor Green
Write-Host "Continue with the manual production smoke tests before final sign-off." -ForegroundColor Cyan
exit 0