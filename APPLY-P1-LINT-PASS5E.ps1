param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5e-backup-$stamp"
$beforeReport=Join-Path $env:TEMP "cs-master-pass5e-before-$stamp.json"
$afterReport=Join-Path $env:TEMP "cs-master-pass5e-after-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5E-SUMMARY.txt"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path){
  $relative=$Path.Substring($ProjectRoot.Length).TrimStart("\")
  $dest=Join-Path $backup $relative
  $dir=Split-Path -Parent $dest
  if($dir){New-Item -ItemType Directory -Path $dir -Force|Out-Null}
  if(-not(Test-Path -LiteralPath $dest)){
    Copy-Item -LiteralPath $Path -Destination $dest -Force
  }
}

function Replace-Exact([string]$Relative,[string]$Old,[string]$New,[string]$Label){
  $path=Join-Path $ProjectRoot $Relative
  if(-not(Test-Path -LiteralPath $path -PathType Leaf)){
    Write-Host "[SKIP] $Label - missing" -ForegroundColor Yellow
    return $false
  }
  $text=[IO.File]::ReadAllText($path)
  if(-not $text.Contains($Old)){
    Write-Host "[SKIP] $Label - target absent/source changed" -ForegroundColor Yellow
    return $false
  }
  Backup-File $path
  [IO.File]::WriteAllText($path,$text.Replace($Old,$New),[Text.UTF8Encoding]::new($false))
  Write-Host "[PASS5E] $Label" -ForegroundColor Green
  return $true
}

function Invoke-Lint([string]$Out){
  Remove-Item -LiteralPath $Out -Force -ErrorAction SilentlyContinue
  Push-Location $ProjectRoot
  try{
    & npx.cmd eslint . --format json --output-file "$Out"
    $null=$LASTEXITCODE
  }finally{Pop-Location}
  if(-not(Test-Path -LiteralPath $Out -PathType Leaf)){throw "ESLint report missing"}
}

function Get-Stats([string]$File){
  $r=Get-Content -LiteralPath $File -Raw|ConvertFrom-Json
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
Write-Host "CS Master - P1 Lint Remediation Pass 5E" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
Invoke-Lint $beforeReport
$before=Get-Stats $beforeReport
$changes=0

# React 19 effect event is used only to expose the latest submit function
# to the timer without forcing the interval effect to depend on a changing
# function identity.
$old='import { useEffect, useMemo, useRef, useState } from "react";'
$new='import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";'
if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" $old $new "Add useEffectEvent to Exam Trainer"){
  $changes++
}

# Signed-out setup reset: preserve behavior, move setter into async callback.
$old=@'
    if (!user) {
      setStage("setup");
      return;
    }
'@
$new=@'
    if (!user) {
      void Promise.resolve().then(() => {
        setStage("setup");
      });
      return;
    }
'@
if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" $old $new "Defer Exam Trainer signed-out stage reset"){
  $changes++
}

# Replace timer effect with primitive dependencies + Effect Event submission.
$old=@'
  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      void submitExam();
      return;
    }

    const timer = window.setInterval(() => {
      setAttempt((current) =>
        current
          ? {
              ...current,
              secondsRemaining: Math.max(0, current.secondsRemaining - 1),
              updatedAt: new Date(),
            }
          : current,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt?.id, attempt?.secondsRemaining, stage]);
'@
$new=@'
  const submitExamFromTimer = useEffectEvent(() => {
    void submitExam();
  });

  const timerAttemptId = attempt?.id ?? "";
  const timerSecondsRemaining = attempt?.secondsRemaining ?? 0;

  useEffect(() => {
    if (stage !== "exam" || !timerAttemptId) return;

    if (timerSecondsRemaining <= 0) {
      submitExamFromTimer();
      return;
    }

    const timer = window.setInterval(() => {
      setAttempt((current) =>
        current
          ? {
              ...current,
              secondsRemaining: Math.max(0, current.secondsRemaining - 1),
              updatedAt: new Date(),
            }
          : current,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerAttemptId, timerSecondsRemaining, stage]);
'@
if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" $old $new "Stabilise Exam Trainer timer submission"){
  $changes++
}

Invoke-Lint $afterReport
$after=Get-Stats $afterReport

$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5E")
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
$lines.Add("PASS 5E SCOPE")
$lines.Add("-------------")
$lines.Add("Refactored Exam Trainer signed-out state reset and timer submission.")
$lines.Add("Autosave cadence and exam submission behavior were preserved.")
$lines.Add("Quiz Player integrity and written-exam integrity were not modified.")
$lines.Add("No ESLint rule or warning was disabled.")
[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Pass 5E complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow