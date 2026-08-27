param([Parameter(Mandatory=$true)][string]$ProjectRoot)
$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5i-backup-$stamp"
$report=Join-Path $env:TEMP "pass5i-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5I-SUMMARY.txt"
New-Item -ItemType Directory -Path $backup -Force|Out-Null

function Replace-Exact($rel,$old,$new,$label){
 $path=Join-Path $ProjectRoot $rel
 if(!(Test-Path -LiteralPath $path)){Write-Host "[SKIP] $label - missing" -ForegroundColor Yellow;return}
 $src=[IO.File]::ReadAllText($path)
 if(!$src.Contains($old)){Write-Host "[SKIP] $label - target absent" -ForegroundColor Yellow;return}
 $dest=Join-Path $backup $rel;$dir=Split-Path -Parent $dest
 if($dir){New-Item -ItemType Directory -Path $dir -Force|Out-Null}
 if(!(Test-Path $dest)){Copy-Item $path $dest -Force}
 [IO.File]::WriteAllText($path,$src.Replace($old,$new),[Text.UTF8Encoding]::new($false))
 Write-Host "[PASS5I] $label" -ForegroundColor Green
}

Replace-Exact "components\layout\AppShell.tsx" @'
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setMobileSidebarOpen(false);
    });
  }, [pathname]);
'@ "AppShell route reset"

Replace-Exact "components\lesson-engine\LessonPracticeStep.tsx" @'
  useEffect(() => {
    setResponses(createInitialResponses(questions, initialResponses));
  }, [questions, initialResponses]);
'@ @'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setResponses(createInitialResponses(questions, initialResponses));
    });
  }, [questions, initialResponses]);
'@ "Lesson practice hydration"

Replace-Exact "hooks\useProgrammingProgress.ts" @'
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
'@ "Programming progress hydration"

Replace-Exact "app\profile\curriculum\page.tsx" @'
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
'@ @'
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
'@ "Curriculum profile hydration"

Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" @'
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
'@ "Exam Trainer signed-out transition"

Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" @'
  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      void submitExam();
      return;
    }
'@ @'
  const submitExamFromTimer = useEffectEvent(() => {
    void submitExam();
  });

  useEffect(() => {
    if (stage !== "exam" || !attempt) return;

    if (attempt.secondsRemaining <= 0) {
      submitExamFromTimer();
      return;
    }
'@ "Exam Trainer timer Effect Event"

Push-Location $ProjectRoot
try{& npx.cmd eslint . --format json --output-file "$report";$exit=$LASTEXITCODE}finally{Pop-Location}
if(!(Test-Path $report)){throw "ESLint report missing"}
$r=Get-Content $report -Raw|ConvertFrom-Json
$pf=0;$e=0;$w=0;$rules=@{}
foreach($x in $r){if($x.messages.Count){$pf++};foreach($m in $x.messages){if($m.severity-eq 2){$e++}elseif($m.severity-eq 1){$w++};$id=if($m.ruleId){[string]$m.ruleId}else{"(parser)"};if(!$rules.ContainsKey($id)){$rules[$id]=0};$rules[$id]++}}
$lines=New-Object Collections.Generic.List[string]
@("CS MASTER - P1 LINT REMEDIATION PASS 5I","Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')","Project: $ProjectRoot","Backup: $backup","","AFTER","-----","Problem files: $pf","Errors: $e","Warnings: $w","ESLint exit code: $exit","","REMAINING RULE COUNTS","---------------------")|ForEach-Object{$lines.Add($_)}
if($rules.Count-eq 0){$lines.Add("None")}else{foreach($q in ($rules.GetEnumerator()|Sort-Object Value -Descending)){$lines.Add("$($q.Key): $($q.Value)")}}
$lines.Add("");$lines.Add("No ESLint rules or warnings were disabled.")
[IO.File]::WriteAllLines($summary,$lines,[Text.UTF8Encoding]::new($false))
Remove-Item $report -Force -ErrorAction SilentlyContinue
Write-Host "";Write-Host "Pass 5I complete." -ForegroundColor Green;Write-Host "Created: $summary" -ForegroundColor Yellow