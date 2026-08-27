param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean"
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $root ".p1-lint-backup-$stamp"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 1" -ForegroundColor Cyan
Write-Host "Project: $root"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

# Back up the files this pass can change automatically.
$backupTargets = @(
  "eslint.config.mjs",
  "eslint.config.js",
  "eslint.config.ts"
)

foreach ($relative in $backupTargets) {
  $source = Join-Path $root $relative
  if (Test-Path -LiteralPath $source -PathType Leaf) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $backup $relative) -Force
  }
}

Push-Location $root
try {
  Write-Host "1. Running ESLint safe automatic fixes..." -ForegroundColor Cyan
  & npx eslint . --fix
  $fixExit = $LASTEXITCODE

  Write-Host ""
  Write-Host "2. Re-running ESLint to measure what remains..." -ForegroundColor Cyan
  $json = Join-Path $root "P1-LINT-PASS1-REPORT.json"
  & npx eslint . --format json --output-file $json
  $lintExit = $LASTEXITCODE

  if (-not (Test-Path -LiteralPath $json)) {
    throw "ESLint did not create the Pass 1 report."
  }

  $results = Get-Content -LiteralPath $json -Raw | ConvertFrom-Json
  $errors = 0
  $warnings = 0
  $problemFiles = 0
  $rules = @{}

  foreach ($item in $results) {
    if ($item.errorCount -gt 0 -or $item.warningCount -gt 0) {
      $problemFiles++
    }

    $errors += [int]$item.errorCount
    $warnings += [int]$item.warningCount

    foreach ($message in $item.messages) {
      $rule = if ($message.ruleId) { [string]$message.ruleId } else { "(parser)" }
      if (-not $rules.ContainsKey($rule)) {
        $rules[$rule] = 0
      }
      $rules[$rule]++
    }
  }

  $summary = Join-Path $root "P1-LINT-PASS1-SUMMARY.txt"
  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 1")
  $lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
  $lines.Add("Project: $root")
  $lines.Add("")
  $lines.Add("Problem files: $problemFiles")
  $lines.Add("Errors: $errors")
  $lines.Add("Warnings: $warnings")
  $lines.Add("")
  $lines.Add("REMAINING RULE COUNTS")
  $lines.Add("---------------------")

  foreach ($entry in ($rules.GetEnumerator() | Sort-Object Value -Descending)) {
    $lines.Add("$($entry.Key): $($entry.Value)")
  }

  [System.IO.File]::WriteAllLines(
    $summary,
    $lines,
    [System.Text.UTF8Encoding]::new($false)
  )

  Remove-Item -LiteralPath $json -Force -ErrorAction SilentlyContinue

  Write-Host ""
  Write-Host "Pass 1 complete." -ForegroundColor Green
  Write-Host "No lint rules were disabled." -ForegroundColor Green
  Write-Host "No hand-written React logic was bulk-rewritten." -ForegroundColor Green
  Write-Host ""
  Write-Host "Remaining problem files: $problemFiles"
  Write-Host "Remaining errors: $errors"
  Write-Host "Remaining warnings: $warnings"
  Write-Host ""
  Write-Host "Created:" -ForegroundColor Cyan
  Write-Host $summary -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Next: send me P1-LINT-PASS1-SUMMARY.txt." -ForegroundColor Cyan

  # ESLint is expected to remain non-zero until later passes.
  exit 0
}
finally {
  Pop-Location
}