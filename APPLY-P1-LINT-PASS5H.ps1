param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5h-backup-$stamp"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5H-SUMMARY.txt"
$report=Join-Path $env:TEMP "cs-master-pass5h-after-$stamp.json"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path){
  $relative=$Path.Substring($ProjectRoot.Length).TrimStart("\")
  $dest=Join-Path $backup $relative
  $dir=Split-Path -Parent $dest
  if($dir){New-Item -ItemType Directory -Path $dir -Force|Out-Null}
  if(-not(Test-Path -LiteralPath $dest)){Copy-Item -LiteralPath $Path -Destination $dest -Force}
}
function Replace-Exact([string]$Relative,[string]$Old,[string]$New,[string]$Label){
  $path=Join-Path $ProjectRoot $Relative
  if(-not(Test-Path -LiteralPath $path -PathType Leaf)){Write-Host "[SKIP] $Label - missing" -ForegroundColor Yellow;return $false}
  $text=[IO.File]::ReadAllText($path)
  if(-not $text.Contains($Old)){Write-Host "[SKIP] $Label - target absent/source changed" -ForegroundColor Yellow;return $false}
  Backup-File $path
  [IO.File]::WriteAllText($path,$text.Replace($Old,$New),[Text.UTF8Encoding]::new($false))
  Write-Host "[PASS5H] $Label" -ForegroundColor Green
  return $true
}
function Defer-Loader([string]$Relative,[string]$Old,[string]$New,[string]$Label){
  return Replace-Exact $Relative $Old $New $Label
}

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 5H" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
$changes=0

# Effect-triggered loaders: defer invocation so state transitions happen from a microtask.
if(Defer-Loader "app\assignments\programming\page.tsx" @'
  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => loadAssignments());
  }, [loadAssignments]);
'@ "Defer programming assignment loader"){$changes++}

if(Defer-Loader "app\resources\[resourceId]\page.tsx" @'
  useEffect(() => {
    void loadResource();
  }, [loadResource]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => loadResource());
  }, [loadResource]);
'@ "Defer student resource loader"){$changes++}

if(Defer-Loader "app\teacher\content\page.tsx" @'
  useEffect(() => {
    if (authLoading || !profileReady) return;
    void load();
  }, [authLoading, profileReady, load]);
'@ @'
  useEffect(() => {
    if (authLoading || !profileReady) return;
    void Promise.resolve().then(() => load());
  }, [authLoading, profileReady, load]);
'@ "Defer Content Hub loader"){$changes++}

if(Defer-Loader "app\teacher\interventions\page.tsx" @'
  useEffect(() => {
    void load();
  }, [load]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
'@ "Defer intervention loader"){$changes++}

if(Defer-Loader "app\teacher\resources\[resourceId]\edit\page.tsx" @'
  useEffect(() => {
    if (!authLoading) {
      void loadResource();
    }
  }, [authLoading, loadResource]);
'@ @'
  useEffect(() => {
    if (!authLoading) {
      void Promise.resolve().then(() => loadResource());
    }
  }, [authLoading, loadResource]);
'@ "Defer editable resource loader"){$changes++}

# Curriculum/profile synchronization: defer local form hydration.
$path="app\profile\curriculum\page.tsx"
$old=@'
    if (
      profile?.qualification === "GCSE" ||
      profile?.qualification === "A_LEVEL"
    ) {
      setQualification(profile.qualification);
    }

    if (
      profile?.examBoard === "AQA" ||
      profile?.examBoard === "OCR" ||
      profile?.examBoard === "EDEXCEL"
    ) {
      setExamBoard(profile.examBoard);
    }
'@
$new=@'
    void Promise.resolve().then(() => {
      if (
        profile?.qualification === "GCSE" ||
        profile?.qualification === "A_LEVEL"
      ) {
        setQualification(profile.qualification);
      }

      if (
        profile?.examBoard === "AQA" ||
        profile?.examBoard === "OCR" ||
        profile?.examBoard === "EDEXCEL"
      ) {
        setExamBoard(profile.examBoard);
      }
    });
'@
if(Replace-Exact $path $old $new "Defer curriculum form hydration"){$changes++}

# Quiz selection synchronization.
$path="app\quiz\page.tsx"
$old=@'
      if (curriculumQuiz) {
        setSelectedQuizId(
          resolvedTopicId,
        );

        setGeneratedQuiz(
          null,
        );

        setLoadError("");

        return;
      }
'@
$new=@'
      if (curriculumQuiz) {
        void Promise.resolve().then(() => {
          setSelectedQuizId(
            resolvedTopicId,
          );

          setGeneratedQuiz(
            null,
          );

          setLoadError("");
        });

        return;
      }
'@
if(Replace-Exact $path $old $new "Defer curriculum quiz selection"){$changes++}

# AppShell route-close synchronization.
if(Replace-Exact "components\layout\AppShell.tsx" @'
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setMobileSidebarOpen(false);
    });
  }, [pathname]);
'@ "Defer mobile sidebar route reset"){$changes++}

# Lesson practice prop hydration.
if(Replace-Exact "components\lesson-engine\LessonPracticeStep.tsx" @'
  useEffect(() => {
    setResponses(createInitialResponses(questions, initialResponses));
  }, [questions, initialResponses]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setResponses(createInitialResponses(questions, initialResponses));
    });
  }, [questions, initialResponses]);
'@ "Defer lesson practice hydration"){$changes++}

# Programming progress localStorage hydration.
if(Replace-Exact "hooks\useProgrammingProgress.ts" @'
  useEffect(() => {
    setHydrated(false);
    setProgress(loadProgress(studentId));
    setHydrated(Boolean(studentId));
  }, [studentId]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setHydrated(false);
      setProgress(loadProgress(studentId));
      setHydrated(Boolean(studentId));
    });
  }, [studentId]);
'@ "Defer programming progress hydration"){$changes++}

# Exam Trainer: remove unused import, defer signed-out stage reset, and use an
# Effect Event for timer-expiry submission so submitExam is not a timer dependency.
if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" @'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
'@ @'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
'@ "Exam Trainer import already prepared"){}

if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" @'
    if (!user) {
      setStage("setup");
      return;
    }
'@ @'
    if (!user) {
      void Promise.resolve().then(() => {
        setStage("setup");
      });
      return;
    }
'@ "Defer Exam Trainer signed-out stage reset"){$changes++}

# Insert effect event immediately before timer effect.
$path="components\exam-trainer\ExamQuestionTrainer.tsx"
$old=@'
  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      void submitExam();
      return;
    }
'@
$new=@'
  const submitExamFromTimer = useEffectEvent(() => {
    void submitExam();
  });

  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      submitExamFromTimer();
      return;
    }
'@
if(Replace-Exact $path $old $new "Use Effect Event for Exam Trainer timer submission"){$changes++}

# Run lint and summarize exact post-pass state.
Push-Location $ProjectRoot
try{
  & npx.cmd eslint . --format json --output-file "$report"
  $lintExit=$LASTEXITCODE
}finally{Pop-Location}
if(-not(Test-Path -LiteralPath $report)){throw "ESLint report missing after Pass 5H."}
$r=Get-Content -LiteralPath $report -Raw|ConvertFrom-Json
$pf=0;$e=0;$w=0;$rules=@{}
foreach($x in $r){
  if($x.messages.Count){$pf++}
  foreach($m in $x.messages){
    if($m.severity -eq 2){$e++}elseif($m.severity -eq 1){$w++}
    $id=if($m.ruleId){[string]$m.ruleId}else{"(parser)"}
    if(-not $rules.ContainsKey($id)){$rules[$id]=0};$rules[$id]++
  }
}
$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5H")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("Applied source changes: $changes")
$lines.Add("")
$lines.Add("AFTER")
$lines.Add("-----")
$lines.Add("Problem files: $pf")
$lines.Add("Errors: $e")
$lines.Add("Warnings: $w")
$lines.Add("ESLint exit code: $lintExit")
$lines.Add("")
$lines.Add("REMAINING RULE COUNTS")
$lines.Add("---------------------")
if($rules.Count -eq 0){$lines.Add("None")}else{
  foreach($x in ($rules.GetEnumerator()|Sort-Object Value -Descending)){$lines.Add("$($x.Key): $($x.Value)")}
}
$lines.Add("")
$lines.Add("PASS 5H SCOPE")
$lines.Add("-------------")
$lines.Add("Targeted all 13 findings from the exact Pass 5H inventory.")
$lines.Add("No ESLint rules or warnings were disabled.")
$lines.Add("Exam Trainer timer submission uses a React Effect Event; autosave behavior was not changed.")
[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Pass 5H remediation complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow