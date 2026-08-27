param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5g-backup-$stamp"
$beforeReport=Join-Path $env:TEMP "cs-master-pass5g-before-$stamp.json"
$afterReport=Join-Path $env:TEMP "cs-master-pass5g-after-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5G-SUMMARY.txt"
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
  Write-Host "[PASS5G] $Label" -ForegroundColor Green
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
Write-Host "CS Master - P1 Lint Remediation Pass 5G" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
Invoke-Lint $beforeReport
$before=Get-Stats $beforeReport
$changes=0

# Add React Effect Events to the written-exam page.
$old=@'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
'@
$new=@'
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
'@
if(Replace-Exact "app\assignments\exam\[assignmentId]\page.tsx" $old $new "Add useEffectEvent to written exam"){
  $changes++
}

# Replace listener effect with latest-state Effect Events. The underlying
# countdown, pause/warn policy, logging and auto-submit functions are untouched.
$old=@'
  useEffect(() => {
    if (
      !assignment ||
      !user?.uid ||
      locked ||
      !integrityStarted ||
      !assignment.integrityPolicy
        .enabled
    ) {
      return;
    }

    function onFullscreenChange() {
      if (
        finishingRef.current
      ) {
        return;
      }

      if (
        document.fullscreenElement ===
        examRootRef.current
      ) {
        resolveFullscreenExit();
      } else {
        beginFullscreenCountdown();
      }
    }

    async function onVisibilityChange() {
      if (
        finishingRef.current ||
        !assignment
          ?.integrityPolicy
          .monitorPageVisibility
      ) {
        return;
      }

      if (
        document.visibilityState ===
        "hidden"
      ) {
        void logIncident(
          "page_hidden",
          "The exam page became hidden.",
        );

        const action =
          assignment
            .integrityPolicy
            .visibilityAction;

        if (
          action ===
          "auto_submit"
        ) {
          void terminateForIntegrity(
            "The exam page became hidden and the teacher configured immediate automatic submission.",
          );

          return;
        }

        if (action === "pause") {
          setIntegrityPaused(
            true,
          );
        } else {
          setIntegrityWarning(
            "The exam page was hidden. This incident has been recorded.",
          );
        }
      } else {
        void logIncident(
          "page_visible",
          "The exam page became visible again.",
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
    activeQuestionNumber,
    assignment,
    integrityStarted,
    locked,
    user?.uid,
  ]);
'@
$new=@'
  const handleExamFullscreenChange = useEffectEvent(() => {
    if (
      finishingRef.current
    ) {
      return;
    }

    if (
      document.fullscreenElement ===
      examRootRef.current
    ) {
      resolveFullscreenExit();
    } else {
      beginFullscreenCountdown();
    }
  });

  const handleExamVisibilityChange = useEffectEvent(() => {
    if (
      finishingRef.current ||
      !assignment
        ?.integrityPolicy
        .monitorPageVisibility
    ) {
      return;
    }

    if (
      document.visibilityState ===
      "hidden"
    ) {
      void logIncident(
        "page_hidden",
        "The exam page became hidden.",
      );

      const action =
        assignment
          .integrityPolicy
          .visibilityAction;

      if (
        action ===
        "auto_submit"
      ) {
        void terminateForIntegrity(
          "The exam page became hidden and the teacher configured immediate automatic submission.",
        );

        return;
      }

      if (action === "pause") {
        setIntegrityPaused(
          true,
        );
      } else {
        setIntegrityWarning(
          "The exam page was hidden. This incident has been recorded.",
        );
      }
    } else {
      void logIncident(
        "page_visible",
        "The exam page became visible again.",
      );
    }
  });

  useEffect(() => {
    if (
      !assignment ||
      !user?.uid ||
      locked ||
      !integrityStarted ||
      !assignment.integrityPolicy
        .enabled
    ) {
      return;
    }

    function onFullscreenChange() {
      handleExamFullscreenChange();
    }

    function onVisibilityChange() {
      handleExamVisibilityChange();
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
    assignment,
    integrityStarted,
    locked,
    user?.uid,
  ]);
'@
if(Replace-Exact "app\assignments\exam\[assignmentId]\page.tsx" $old $new "Stabilise written-exam integrity listeners"){
  $changes++
}

Invoke-Lint $afterReport
$after=Get-Stats $afterReport

$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5G")
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
$lines.Add("PASS 5G SCOPE")
$lines.Add("-------------")
$lines.Add("Refactored written-exam fullscreen and visibility listener callbacks using")
$lines.Add("React Effect Events while preserving the existing integrity policy.")
$lines.Add("Five-second countdown, pause/warn rules, incident logging and automatic")
$lines.Add("submission remain implemented by the same underlying functions.")
$lines.Add("No ESLint rule or warning was disabled.")
[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Pass 5G complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow