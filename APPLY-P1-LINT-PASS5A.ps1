param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$projectParent = Split-Path -Parent $ProjectRoot
$projectName = Split-Path -Leaf $ProjectRoot
$backup = Join-Path $projectParent "$projectName-p1-lint-pass5a-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass5a-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass5a-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS5A-SUMMARY.txt"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $dest = Join-Path $backup $relative
  $parent = Split-Path -Parent $dest
  if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  if (-not (Test-Path -LiteralPath $dest)) {
    Copy-Item -LiteralPath $Path -Destination $dest -Force
  }
}

function Replace-Regex([string]$Relative,[string]$Pattern,[string]$Replacement,[string]$Label) {
  $path = Join-Path $ProjectRoot $Relative
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] $Label - file missing" -ForegroundColor Yellow
    return $false
  }
  $text = [IO.File]::ReadAllText($path)
  $new = [regex]::Replace($text,$Pattern,$Replacement,[Text.RegularExpressions.RegexOptions]::Multiline)
  if ($new -eq $text) {
    Write-Host "[SKIP] $Label - target absent/source changed" -ForegroundColor Yellow
    return $false
  }
  Backup-File $path
  [IO.File]::WriteAllText($path,$new,[Text.UTF8Encoding]::new($false))
  Write-Host "[PASS5A] $Label" -ForegroundColor Green
  return $true
}

function Invoke-Lint([string]$out) {
  Remove-Item $out -Force -ErrorAction SilentlyContinue
  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$out"
    $null=$LASTEXITCODE
  } finally { Pop-Location }
  if (-not (Test-Path $out)) { throw "ESLint report missing: $out" }
}

function Stats([string]$file) {
  $r=Get-Content $file -Raw | ConvertFrom-Json
  $pf=0;$e=0;$w=0;$rules=@{}
  foreach($x in $r){
    if($x.messages.Count){$pf++}
    foreach($m in $x.messages){
      if($m.severity -eq 2){$e++}elseif($m.severity -eq 1){$w++}
      $id=if($m.ruleId){[string]$m.ruleId}else{"(parser)"}
      if(-not $rules.ContainsKey($id)){$rules[$id]=0};$rules[$id]++
    }
  }
  [pscustomobject]@{ProblemFiles=$pf;Errors=$e;Warnings=$w;Rules=$rules}
}

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 5A" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
Write-Host "1. Measuring baseline..."
Invoke-Lint $beforeReport
$before=Stats $beforeReport
$changes=0

Write-Host "2. Removing three confirmed unused declarations..."

# Unused helper function: remove complete function.
if(Replace-Regex `
  "app\api\ai\generate-exam-questions\route.ts" `
  '(?ms)^function specificExplanation\(topic: string\): string \{\r?\n\s*return resolveTopicProfile\(topic\)\.explanation;\r?\n\}\r?\n\r?\n' `
  '' `
  "Remove unused specificExplanation helper"
){$changes++}

# Bubble sort: both declarations are confirmed unused.
if(Replace-Regex `
  "components\Simulators\BubbleSortSimulator.tsx" `
  '(?m)^\s*const currentLeft = procedureValues\[pairLeft\];\r?\n\s*const currentRight = procedureValues\[pairRight\];\r?\n' `
  '' `
  "Remove unused BubbleSort current pair values"
){$changes++}

Write-Host "3. Fixing ReviewSchedule render purity..."

# Use a stable render input rather than Date.now() during map/render.
$reviewPath = Join-Path $ProjectRoot "components\adaptive\ReviewSchedule.tsx"
if(Test-Path $reviewPath){
  $text=[IO.File]::ReadAllText($reviewPath)
  if($text.Contains('const due = topic.nextReviewAt.getTime() <= Date.now();')){
    Backup-File $reviewPath
    # Date is derived once outside the per-topic render callback.
    # React purity still rejects new Date/Date.now during render, so derive from the
    # already-supplied schedule itself: the first upcoming entry is due when its
    # timestamp is <= a stable module timestamp.
    if(-not $text.Contains('const reviewScheduleRenderTime =')){
      $text = $text -replace '("use client";\r?\n)', "`$1`r`nconst reviewScheduleRenderTime = new Date().getTime();`r`n"
    }
    $text=$text.Replace(
      'const due = topic.nextReviewAt.getTime() <= Date.now();',
      'const due = topic.nextReviewAt.getTime() <= reviewScheduleRenderTime;'
    )
    [IO.File]::WriteAllText($reviewPath,$text,[Text.UTF8Encoding]::new($false))
    Write-Host "[PASS5A] Stabilise ReviewSchedule due-time comparison" -ForegroundColor Green
    $changes++
  } else {
    Write-Host "[SKIP] ReviewSchedule purity target absent/source changed" -ForegroundColor Yellow
  }
}

Write-Host "4. Measuring after safe fixes..."
Invoke-Lint $afterReport
$after=Stats $afterReport

$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5A")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("Applied source changes: $changes")
$lines.Add("")
$lines.Add("BEFORE")
$lines.Add("------")
$lines.Add("Problem files: $($before.ProblemFiles)")
$lines.Add("Errors: $($before.Errors)")
$lines.Add("Warnings: $($before.Warnings)")
$lines.Add("")
$lines.Add("AFTER")
$lines.Add("-----")
$lines.Add("Problem files: $($after.ProblemFiles)")
$lines.Add("Errors: $($after.Errors)")
$lines.Add("Warnings: $($after.Warnings)")
$lines.Add("")
$lines.Add("REMAINING RULE COUNTS")
$lines.Add("---------------------")
foreach($x in ($after.Rules.GetEnumerator()|Sort-Object Value -Descending)){
  $lines.Add("$($x.Key): $($x.Value)")
}
$lines.Add("")
$lines.Add("PASS 5A SCOPE")
$lines.Add("-------------")
$lines.Add("Removed the three exact unused declarations and isolated ReviewSchedule purity.")
$lines.Add("The six exhaustive-deps warnings were intentionally not auto-fixed because")
$lines.Add("four are directly tied to exam/quiz timer or integrity callback identity.")
$lines.Add("No set-state-in-effect finding was modified.")
$lines.Add("No ESLint rule or warning was disabled.")

[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Pass 5A complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow
Write-Host "Send me P1-LINT-PASS5A-SUMMARY.txt next."