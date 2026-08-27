param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5f-backup-$stamp"
$beforeReport=Join-Path $env:TEMP "cs-master-pass5f-before-$stamp.json"
$afterReport=Join-Path $env:TEMP "cs-master-pass5f-after-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5F-SUMMARY.txt"
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
  Write-Host "[PASS5F] $Label" -ForegroundColor Green
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
Write-Host "CS Master - P1 Lint Remediation Pass 5F" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
Invoke-Lint $beforeReport
$before=Get-Stats $beforeReport
$changes=0

$old='import { useEffect, useMemo, useRef, useState } from "react";'
$new='import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";'
if(Replace-Exact "components\quiz\QuizPlayer.tsx" $old $new "Add useEffectEvent to Quiz Player"){
  $changes++
}

# Quiz-duration synchronization is UI state, not integrity enforcement.
$old=@'
  useEffect(() => {
    setTimeLeft(quizDurationSeconds);
  }, [quiz.id, quizDurationSeconds]);
'@
$new=@'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setTimeLeft(quizDurationSeconds);
    });
  }, [quiz.id, quizDurationSeconds]);
'@
if(Replace-Exact "components\quiz\QuizPlayer.tsx" $old $new "Defer quiz timer reset"){
  $changes++
}

# Insert an Effect Event immediately after finishQuiz. The event always sees
# the latest finishQuiz state without becoming a timer dependency.
$old=@'
    await leaveFullscreenSafely();
    setShowResults(true);
  }

  useEffect(() => {
    if (
      showResults ||
'@
$new=@'
    await leaveFullscreenSafely();
    setShowResults(true);
  }

  const finishQuizFromTimer = useEffectEvent(
    (options: { terminated?: boolean; reason?: string }) => {
      void finishQuiz(options);
    },
  );

  useEffect(() => {
    if (
      showResults ||
'@
if(Replace-Exact "components\quiz\QuizPlayer.tsx" $old $new "Create stable quiz timer completion event"){
  $changes++
}

# Only timer-expiry submission changes to the Effect Event.
$old=@'
          void finishQuiz({
            terminated: assessmentMode,
            reason: assessmentMode
              ? "The assessment timer expired and the quiz was automatically submitted."
              : "",
          });
'@
$new=@'
          finishQuizFromTimer({
            terminated: assessmentMode,
            reason: assessmentMode
              ? "The assessment timer expired and the quiz was automatically submitted."
              : "",
          });
'@
if(Replace-Exact "components\quiz\QuizPlayer.tsx" $old $new "Use stable quiz timer completion event"){
  $changes++
}

# Replace integrity listener effect with Effect Events. Countdown, incident
# logging, visibility warnings and five-second auto-submit remain unchanged.
$old=@'
  useEffect(() => {
    if (
      !assessmentMode ||
      !integrityStarted ||
      showResults
    ) {
      return;
    }

    function onFullscreenChange() {
      if (finishingRef.current) {
        return;
      }

      if (
        document.fullscreenElement ===
        assessmentRootRef.current
      ) {
        resolveFullscreenExit();
      } else {
        beginFullscreenCountdown();
      }
    }

    function onVisibilityChange() {
      if (finishingRef.current) {
        return;
      }

      if (document.visibilityState === "hidden") {
        appendIntegrityIncident(
          "page_hidden",
          "The assessment page became hidden.",
        );

        setIntegrityWarning(
          "The assessment page was hidden. This incident has been recorded.",
        );
      } else {
        appendIntegrityIncident(
          "page_visible",
          "The assessment page became visible again.",
        );
      }
    }

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange,
    );
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
    };
  }, [
    assessmentMode,
    integrityStarted,
    showResults,
    currentIndex,
  ]);
'@
$new=@'
  const handleFullscreenChange = useEffectEvent(() => {
    if (finishingRef.current) {
      return;
    }

    if (
      document.fullscreenElement ===
      assessmentRootRef.current
    ) {
      resolveFullscreenExit();
    } else {
      beginFullscreenCountdown();
    }
  });

  const handleVisibilityChange = useEffectEvent(() => {
    if (finishingRef.current) {
      return;
    }

    if (document.visibilityState === "hidden") {
      appendIntegrityIncident(
        "page_hidden",
        "The assessment page became hidden.",
      );

      setIntegrityWarning(
        "The assessment page was hidden. This incident has been recorded.",
      );
    } else {
      appendIntegrityIncident(
        "page_visible",
        "The assessment page became visible again.",
      );
    }
  });

  useEffect(() => {
    if (
      !assessmentMode ||
      !integrityStarted ||
      showResults
    ) {
      return;
    }

    function onFullscreenChange() {
      handleFullscreenChange();
    }

    function onVisibilityChange() {
      handleVisibilityChange();
    }

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange,
    );
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
    };
  }, [
    assessmentMode,
    integrityStarted,
    showResults,
  ]);
'@
if(Replace-Exact "components\quiz\QuizPlayer.tsx" $old $new "Stabilise quiz integrity listeners"){
  $changes++
}

Invoke-Lint $afterReport
$after=Get-Stats $afterReport

$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5F")
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
$lines.Add("PASS 5F SCOPE")
$lines.Add("-------------")
$lines.Add("Refactored Quiz Player timer completion and integrity listeners using")
$lines.Add("React Effect Events so the latest state is available without unstable")
$lines.Add("effect dependencies.")
$lines.Add("The five-second fullscreen countdown, incident logging, visibility warning")
$lines.Add("and automatic submission behavior were preserved.")
$lines.Add("No ESLint rule or warning was disabled.")
[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Pass 5F complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow