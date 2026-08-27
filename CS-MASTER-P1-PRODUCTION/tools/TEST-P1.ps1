param(
    [string]$ProjectRoot = ".",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $ProjectRoot).Path
$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Pass($m) { Write-Host "[PASS] $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; $script:failures.Add($m) }
function Warn($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow; $script:warnings.Add($m) }

Write-Host "`nCS Master P1 Production Acceptance" -ForegroundColor Cyan
Write-Host "Project: $root`n"

$required = @(
  "package.json",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "lib/firebaseAdmin.ts",
  "app/api/health/route.ts",
  ".env.production.example"
)
foreach ($f in $required) {
  if (Test-Path (Join-Path $root $f)) { Pass "$f exists" } else { Fail "$f is missing" }
}

$gitignorePath = Join-Path $root ".gitignore"
if (Test-Path $gitignorePath) {
  $g = Get-Content $gitignorePath -Raw
  if ($g -match '(?m)^\.env\*$') { Pass ".env* is ignored" } else { Fail ".env* is not ignored" }
  if ($g -match '(?m)^\*\.pem$') { Pass "*.pem is ignored" } else { Fail "*.pem is not ignored" }
  if ($g -match '(?m)^\*\.key$') { Pass "*.key is ignored" } else { Fail "*.key is not ignored" }
  if ($g -match 'service-account') { Pass "service-account JSON patterns are ignored" } else { Fail "service-account JSON ignore pattern missing" }
}

$firebasePath = Join-Path $root "firebase.json"
if (Test-Path $firebasePath) {
  $fb = Get-Content $firebasePath -Raw | ConvertFrom-Json
  if ($fb.firestore.rules -eq "firestore.rules") { Pass "Firestore rules deployment configured" } else { Fail "Firestore rules deployment not configured" }
  if ($fb.firestore.indexes -eq "firestore.indexes.json") { Pass "Firestore indexes deployment configured" } else { Fail "Firestore indexes deployment not configured" }
}

# Scan tracked source/config files for obvious private-key material.
$scanExt = @("*.ts","*.tsx","*.js","*.json","*.md","*.txt","*.env*")
$privateKeyHit = $false
foreach ($pattern in $scanExt) {
  Get-ChildItem $root -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\.next\\|\\P1-BACKUPS\\' } |
    ForEach-Object {
      try {
        $c = Get-Content $_.FullName -Raw -ErrorAction Stop
        if ($c -match '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----') {
          Fail "Private key material detected in $($_.FullName)"
          $script:privateKeyHit = $true
        }
      } catch {}
    }
}
if (-not $privateKeyHit) { Pass "No obvious embedded private-key block detected" }

if (-not $SkipBuild) {
  Push-Location $root
  try {
    Write-Host "`nRunning npm run build..." -ForegroundColor Cyan
    & npm run build
    if ($LASTEXITCODE -ne 0) { Fail "npm run build failed" } else { Pass "npm run build succeeded" }

    Write-Host "`nRunning npm run lint..." -ForegroundColor Cyan
    & npm run lint
    if ($LASTEXITCODE -ne 0) { Fail "npm run lint failed" } else { Pass "npm run lint succeeded" }
  }
  finally { Pop-Location }
} else {
  Warn "Build/lint skipped by request"
}

Write-Host "`nP1 acceptance summary" -ForegroundColor Cyan
Write-Host "Failures: $($failures.Count)"
Write-Host "Warnings: $($warnings.Count)"

if ($failures.Count -gt 0) {
  Write-Host "`nP1 STATUS: NOT SIGNED OFF" -ForegroundColor Red
  exit 1
}

Write-Host "`nP1 AUTOMATED GATE: PASSED" -ForegroundColor Green
Write-Host "Complete the manual production smoke tests in P1-SIGN-OFF.md before final release."
exit 0
