param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean"
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$outPath = Join-Path $root "P1-LINT-REMEDIATION-AUDIT.txt"
$jsonPath = Join-Path $root "P1-LINT-REPORT.json"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Audit" -ForegroundColor Cyan
Write-Host "Project: $root"
Write-Host ""

Push-Location $root

try {
  Write-Host "Running ESLint JSON report..." -ForegroundColor Cyan

  & npx eslint . --format json --output-file $jsonPath

  # ESLint exits non-zero when lint errors exist. That is expected here.
  $eslintExit = $LASTEXITCODE

  if (-not (Test-Path -LiteralPath $jsonPath -PathType Leaf)) {
    throw "ESLint did not create P1-LINT-REPORT.json."
  }

  $results = Get-Content -LiteralPath $jsonPath -Raw | ConvertFrom-Json

  $problemFiles = @(
    $results |
      Where-Object {
        $_.errorCount -gt 0 -or $_.warningCount -gt 0
      } |
      Sort-Object filePath
  )

  $builder = New-Object System.Text.StringBuilder

  [void]$builder.AppendLine("CS MASTER - P1 LINT REMEDIATION AUDIT")
  [void]$builder.AppendLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
  [void]$builder.AppendLine("Project: $root")
  [void]$builder.AppendLine("")
  [void]$builder.AppendLine("PURPOSE")
  [void]$builder.AppendLine("-------")
  [void]$builder.AppendLine("This file contains the exact current source for every file with an ESLint")
  [void]$builder.AppendLine("error or warning, followed by that file's ESLint findings.")
  [void]$builder.AppendLine("It is read-only. No project files are changed.")
  [void]$builder.AppendLine("")

  $totalErrors = 0
  $totalWarnings = 0

  foreach ($item in $problemFiles) {
    $totalErrors += [int]$item.errorCount
    $totalWarnings += [int]$item.warningCount
  }

  [void]$builder.AppendLine("SUMMARY")
  [void]$builder.AppendLine("-------")
  [void]$builder.AppendLine("Problem files: $($problemFiles.Count)")
  [void]$builder.AppendLine("Errors: $totalErrors")
  [void]$builder.AppendLine("Warnings: $totalWarnings")
  [void]$builder.AppendLine("")

  foreach ($item in $problemFiles) {
    $fullPath = [string]$item.filePath

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
      continue
    }

    $relative = $fullPath.Substring($root.Length).TrimStart("\")
    $content = Get-Content -LiteralPath $fullPath -Raw

    if ($null -eq $content) {
      $content = ""
    }

    [void]$builder.AppendLine(("=" * 100))
    [void]$builder.AppendLine("FILE: $relative")
    [void]$builder.AppendLine(("=" * 100))
    [void]$builder.AppendLine("")
    [void]$builder.AppendLine("ESLINT FINDINGS")
    [void]$builder.AppendLine("----------------")

    foreach ($message in $item.messages) {
      $severity =
        if ([int]$message.severity -eq 2) {
          "ERROR"
        }
        else {
          "WARNING"
        }

      $rule =
        if ($message.ruleId) {
          [string]$message.ruleId
        }
        else {
          "(no rule id)"
        }

      [void]$builder.AppendLine(
        ("{0} L{1}:C{2} [{3}] {4}" -f
          $severity,
          $message.line,
          $message.column,
          $rule,
          $message.message
        )
      )
    }

    [void]$builder.AppendLine("")
    [void]$builder.AppendLine("SOURCE")
    [void]$builder.AppendLine("------")
    [void]$builder.AppendLine($content)
    [void]$builder.AppendLine("")
  }

  [System.IO.File]::WriteAllText(
    $outPath,
    $builder.ToString(),
    [System.Text.UTF8Encoding]::new($false)
  )

  Remove-Item -LiteralPath $jsonPath -Force -ErrorAction SilentlyContinue

  Write-Host ""
  Write-Host "P1 lint remediation audit created successfully:" -ForegroundColor Green
  Write-Host $outPath -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Problem files: $($problemFiles.Count)" -ForegroundColor Cyan
  Write-Host "Errors: $totalErrors" -ForegroundColor Cyan
  Write-Host "Warnings: $totalWarnings" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Send me P1-LINT-REMEDIATION-AUDIT.txt" -ForegroundColor Cyan
}
finally {
  Pop-Location
}