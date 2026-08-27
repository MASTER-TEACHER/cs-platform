param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$report = Join-Path $env:TEMP "cs-master-p1-pass5i-inventory-$timestamp.json"
$output = Join-Path $ProjectRoot "P1-LINT-PASS5I-INVENTORY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Pass 5I Inventory" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""
Write-Host "No source files will be changed." -ForegroundColor Green
Write-Host ""

Push-Location $ProjectRoot
try {
  & npx.cmd eslint . --format json --output-file "$report"
  $null = $LASTEXITCODE
}
finally {
  Pop-Location
}

if (-not (Test-Path -LiteralPath $report -PathType Leaf)) {
  throw "ESLint did not create the inventory report."
}

$results = Get-Content -LiteralPath $report -Raw | ConvertFrom-Json

$targetRules = @(
  "react-hooks/set-state-in-effect",
  "react-hooks/exhaustive-deps",
  "@typescript-eslint/no-unused-vars"
)

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT PASS 5I INVENTORY")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("Purpose: exact source-aware inventory for final remaining P1 lint findings.")
$lines.Add("No source files were changed.")
$lines.Add("")

$total = 0

foreach ($result in $results) {
  $messages = @(
    $result.messages |
      Where-Object {
        $_.ruleId -and
        ($targetRules -contains [string]$_.ruleId)
      }
  )

  if ($messages.Count -eq 0) { continue }

  $total += $messages.Count

  $fullPath = [string]$result.filePath
  $relative =
    if ($fullPath.StartsWith(
      $ProjectRoot,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
      $fullPath.Substring($ProjectRoot.Length).TrimStart("\")
    }
    else {
      $fullPath
    }

  $sourceLines =
    if (Test-Path -LiteralPath $fullPath -PathType Leaf) {
      @(Get-Content -LiteralPath $fullPath)
    }
    else {
      @()
    }

  $lines.Add("=" * 110)
  $lines.Add("FILE: $relative")
  $lines.Add("=" * 110)
  $lines.Add("")

  foreach ($message in $messages) {
    $rule = [string]$message.ruleId
    $lineNumber = [int]$message.line
    $column = [int]$message.column
    $messageText = [string]$message.message

    $lines.Add("RULE: $rule")
    $lines.Add("LOCATION: ${relative}:$lineNumber`:$column")
    $lines.Add("MESSAGE: $messageText")

    $propertyNames = @($message.PSObject.Properties.Name)

    if (
      $propertyNames -contains "suggestions" -and
      $null -ne $message.suggestions
    ) {
      foreach ($suggestion in @($message.suggestions)) {
        if ($null -eq $suggestion) { continue }

        $suggestionProperties = @($suggestion.PSObject.Properties.Name)

        if (
          $suggestionProperties -contains "desc" -and
          $suggestion.desc
        ) {
          $lines.Add("SUGGESTION: $($suggestion.desc)")
        }
      }
    }

    if (
      $propertyNames -contains "fix" -and
      $null -ne $message.fix
    ) {
      $lines.Add("AUTO_FIX_AVAILABLE: yes")
    }
    else {
      $lines.Add("AUTO_FIX_AVAILABLE: no")
    }

    if ($sourceLines.Count -gt 0) {
      $start = [Math]::Max(1, $lineNumber - 25)
      $end = [Math]::Min($sourceLines.Count, $lineNumber + 35)

      $lines.Add("")
      $lines.Add("CONTEXT:")

      for ($i = $start; $i -le $end; $i++) {
        $marker = if ($i -eq $lineNumber) { ">>" } else { "  " }
        $lines.Add(
          ("{0} {1,5}: {2}" -f $marker, $i, [string]$sourceLines[$i - 1])
        )
      }
    }

    $lines.Add("")
  }
}

$lines.Add("=" * 110)
$lines.Add("SUMMARY")
$lines.Add("=" * 110)
$lines.Add("")
$lines.Add("Target findings captured: $total")
$lines.Add("")

foreach ($rule in $targetRules) {
  $count = 0

  foreach ($result in $results) {
    foreach ($message in $result.messages) {
      if ([string]$message.ruleId -eq $rule) { $count++ }
    }
  }

  $lines.Add("${rule}: $count")
}

[System.IO.File]::WriteAllLines(
  $output,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue

Write-Host "Pass 5I inventory complete." -ForegroundColor Green
Write-Host "No source files were changed." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $output -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS5I-INVENTORY.txt next."