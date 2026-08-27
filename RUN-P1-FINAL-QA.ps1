param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$report=Join-Path $ProjectRoot "P1-FINAL-LINT-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-FINAL-QA-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Final QA" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

Push-Location $ProjectRoot
try {
  Write-Host "1. Running final ESLint verification..."
  & npx.cmd eslint . --format json --output-file "$report"
  $lintExit=$LASTEXITCODE

  if(-not(Test-Path -LiteralPath $report -PathType Leaf)){
    throw "ESLint did not create the final report."
  }

  $results=Get-Content -LiteralPath $report -Raw|ConvertFrom-Json
  $problemFiles=0
  $errors=0
  $warnings=0
  $rules=@{}

  foreach($result in $results){
    if($result.messages.Count -gt 0){$problemFiles++}

    foreach($message in $result.messages){
      if($message.severity -eq 2){$errors++}
      elseif($message.severity -eq 1){$warnings++}

      $rule=if($message.ruleId){[string]$message.ruleId}else{"(parser)"}
      if(-not $rules.ContainsKey($rule)){$rules[$rule]=0}
      $rules[$rule]++
    }
  }

  $buildStatus="NOT RUN"
  $buildExit=$null

  if($errors -eq 0 -and $warnings -eq 0){
    Write-Host ""
    Write-Host "2. ESLint is clean. Running production build..." -ForegroundColor Green

    & npm.cmd run build
    $buildExit=$LASTEXITCODE

    if($buildExit -eq 0){
      $buildStatus="PASS"
    }
    else{
      $buildStatus="FAIL"
    }
  }
  else{
    Write-Host ""
    Write-Host "2. Build skipped because lint findings remain." -ForegroundColor Yellow
  }

  $lines=New-Object Collections.Generic.List[string]
  $lines.Add("CS MASTER - P1 FINAL QA")
  $lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
  $lines.Add("Project: $ProjectRoot")
  $lines.Add("")
  $lines.Add("ESLINT")
  $lines.Add("------")
  $lines.Add("Problem files: $problemFiles")
  $lines.Add("Errors: $errors")
  $lines.Add("Warnings: $warnings")
  $lines.Add("ESLint exit code: $lintExit")
  $lines.Add("")
  $lines.Add("RULE COUNTS")
  $lines.Add("-----------")

  if($rules.Count -eq 0){
    $lines.Add("None")
  }
  else{
    foreach($entry in ($rules.GetEnumerator()|Sort-Object Value -Descending)){
      $lines.Add("$($entry.Key): $($entry.Value)")
    }
  }

  $lines.Add("")
  $lines.Add("PRODUCTION BUILD")
  $lines.Add("----------------")
  $lines.Add("Status: $buildStatus")

  if($null -ne $buildExit){
    $lines.Add("Exit code: $buildExit")
  }

  $phaseStatus=
    if($errors -eq 0 -and $warnings -eq 0 -and $buildStatus -eq "PASS"){
      "PASS"
    }
    else{
      "NOT YET PASSED"
    }

  $lines.Add("")
  $lines.Add("P1 PHASE STATUS")
  $lines.Add("---------------")
  $lines.Add($phaseStatus)

  [IO.File]::WriteAllLines(
    $summary,
    $lines,
    [Text.UTF8Encoding]::new($false)
  )

  Write-Host ""
  Write-Host "Final QA summary:" -ForegroundColor Cyan
  Write-Host $summary -ForegroundColor Yellow
  Write-Host ""
  Write-Host "P1 phase status: $phaseStatus" -ForegroundColor $(if($phaseStatus -eq "PASS"){"Green"}else{"Yellow"})
}
finally{
  Pop-Location
}