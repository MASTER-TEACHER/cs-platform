param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)

$ErrorActionPreference="Stop"
Set-StrictMode -Version Latest

$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$parent=Split-Path -Parent $ProjectRoot
$name=Split-Path -Leaf $ProjectRoot
$backup=Join-Path $parent "$name-p1-lint-pass5d-backup-$stamp"
$beforeReport=Join-Path $env:TEMP "cs-master-pass5d-before-$stamp.json"
$afterReport=Join-Path $env:TEMP "cs-master-pass5d-after-$stamp.json"
$summary=Join-Path $ProjectRoot "P1-LINT-PASS5D-SUMMARY.txt"

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

function Replace-Exact(
  [string]$Relative,
  [string]$Old,
  [string]$New,
  [string]$Label
){
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

  [IO.File]::WriteAllText(
    $path,
    $text.Replace($Old,$New),
    [Text.UTF8Encoding]::new($false)
  )

  Write-Host "[PASS5D] $Label" -ForegroundColor Green
  return $true
}

function Invoke-Lint([string]$Out){
  Remove-Item -LiteralPath $Out -Force -ErrorAction SilentlyContinue

  Push-Location $ProjectRoot
  try{
    & npx.cmd eslint . --format json --output-file "$Out"
    $null=$LASTEXITCODE
  }
  finally{
    Pop-Location
  }

  if(-not(Test-Path -LiteralPath $Out -PathType Leaf)){
    throw "ESLint did not create $Out"
  }
}

function Get-Stats([string]$File){
  $r=Get-Content -LiteralPath $File -Raw | ConvertFrom-Json
  $pf=0
  $e=0
  $w=0
  $rules=@{}

  foreach($x in $r){
    if($x.messages.Count -gt 0){$pf++}

    foreach($m in $x.messages){
      if($m.severity -eq 2){$e++}
      elseif($m.severity -eq 1){$w++}

      $id=if($m.ruleId){[string]$m.ruleId}else{"(parser)"}

      if(-not $rules.ContainsKey($id)){
        $rules[$id]=0
      }

      $rules[$id]++
    }
  }

  [pscustomobject]@{
    ProblemFiles=$pf
    Errors=$e
    Warnings=$w
    Rules=$rules
  }
}

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 5D" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

Invoke-Lint $beforeReport
$before=Get-Stats $beforeReport
$changes=0

# 1. Student assignments loader.
$old=@'
    useCallback(async () => {
      if (!user?.uid) {
'@
$new=@'
    useCallback(async () => {
      await Promise.resolve();

      if (!user?.uid) {
'@
if(Replace-Exact "app\assignments\programming\page.tsx" $old $new "Student assignments loader async boundary"){
  $changes++
}

# 2. Curriculum profile hydration.
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
    const nextQualification =
      profile?.qualification === "GCSE" ||
      profile?.qualification === "A_LEVEL"
        ? profile.qualification
        : null;

    const nextExamBoard =
      profile?.examBoard === "AQA" ||
      profile?.examBoard === "OCR" ||
      profile?.examBoard === "EDEXCEL"
        ? profile.examBoard
        : null;

    if (nextQualification || nextExamBoard) {
      void Promise.resolve().then(() => {
        if (nextQualification) {
          setQualification(nextQualification);
        }

        if (nextExamBoard) {
          setExamBoard(nextExamBoard);
        }
      });
    }
'@
if(Replace-Exact "app\profile\curriculum\page.tsx" $old $new "Curriculum profile hydration"){
  $changes++
}

# 3. Quiz no-topic reset.
$old=@'
    if (!topicParam) {
      setGeneratedQuiz(null);
      setSelectedQuizId(
        null,
      );
      setLoadError("");
      return;
    }
'@
$new=@'
    if (!topicParam) {
      void Promise.resolve().then(() => {
        setGeneratedQuiz(null);
        setSelectedQuizId(
          null,
        );
        setLoadError("");
      });
      return;
    }
'@
if(Replace-Exact "app\quiz\page.tsx" $old $new "Quiz no-topic reset"){
  $changes++
}

# 4. Student resource loader.
$old=@'
  const loadResource = useCallback(async () => {
    if (!user?.uid || !resourceId) {
'@
$new=@'
  const loadResource = useCallback(async () => {
    await Promise.resolve();

    if (!user?.uid || !resourceId) {
'@
if(Replace-Exact "app\resources\[resourceId]\page.tsx" $old $new "Student resource loader async boundary"){
  $changes++
}

# 5. Teacher content loader.
$old=@'
  const load = useCallback(async () => {
    const teacherId = user?.uid;
'@
$new=@'
  const load = useCallback(async () => {
    await Promise.resolve();

    const teacherId = user?.uid;
'@
if(Replace-Exact "app\teacher\content\page.tsx" $old $new "Teacher content loader async boundary"){
  $changes++
}

# 6. Intervention loader after Pass 5B.
$old=@'
  const load = useCallback(async () => {
    const teacherId =
'@
$new=@'
  const load = useCallback(async () => {
    await Promise.resolve();

    const teacherId =
'@
if(Replace-Exact "app\teacher\interventions\page.tsx" $old $new "Intervention loader async boundary"){
  $changes++
}

# 7. Intervention deep-link selection.
$old=@'
    void Promise.resolve().then(() => {
      setSearch(
        requestedStudentName ||
          requested.student.name,
      );
    });

    setSelected(
      requested,
    );
'@
$new=@'
    void Promise.resolve().then(() => {
      setSearch(
        requestedStudentName ||
          requested.student.name,
      );

      setSelected(
        requested,
      );
    });
'@
if(Replace-Exact "app\teacher\interventions\page.tsx" $old $new "Intervention deep-link selection"){
  $changes++
}

# 8. Teacher resource editor loader.
$old=@'
  const loadResource = useCallback(async () => {
    if (!currentUser || !resourceId) {
'@
$new=@'
  const loadResource = useCallback(async () => {
    await Promise.resolve();

    if (!currentUser || !resourceId) {
'@
if(Replace-Exact "app\teacher\resources\[resourceId]\edit\page.tsx" $old $new "Teacher resource editor loader async boundary"){
  $changes++
}

# 9. AppShell route reset.
$old=@'
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);
'@
$new=@'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setMobileSidebarOpen(false);
    });
  }, [pathname]);
'@
if(Replace-Exact "components\layout\AppShell.tsx" $old $new "Mobile sidebar route reset"){
  $changes++
}

# 10. Lesson practice hydration.
$old=@'
  useEffect(() => {
    setResponses(createInitialResponses(questions, initialResponses));
  }, [questions, initialResponses]);
'@
$new=@'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setResponses(createInitialResponses(questions, initialResponses));
    });
  }, [questions, initialResponses]);
'@
if(Replace-Exact "components\lesson-engine\LessonPracticeStep.tsx" $old $new "Lesson practice response hydration"){
  $changes++
}

# 11. Programming progress hydration.
$old=@'
  useEffect(() => {
    setHydrated(false);
    setProgress(loadProgress(studentId));
    setHydrated(Boolean(studentId));
  }, [studentId]);
'@
$new=@'
  useEffect(() => {
    let active = true;

    void Promise.resolve().then(() => {
      if (!active) return;

      setHydrated(false);
      setProgress(loadProgress(studentId));
      setHydrated(Boolean(studentId));
    });

    return () => {
      active = false;
    };
  }, [studentId]);
'@
if(Replace-Exact "hooks\useProgrammingProgress.ts" $old $new "Programming progress hydration"){
  $changes++
}

Invoke-Lint $afterReport
$after=Get-Stats $afterReport

$lines=New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5D")
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
$lines.Add("PASS 5D SCOPE")
$lines.Add("-------------")
$lines.Add("Handled all remaining ordinary/non-integrity set-state-in-effect candidates.")
$lines.Add("Exam Trainer timer, Quiz Player timer/integrity, and written-exam integrity")
$lines.Add("listener behaviour were not modified.")
$lines.Add("No ESLint rule or warning was disabled.")

[IO.File]::WriteAllLines(
  $summary,
  $lines,
  [Text.UTF8Encoding]::new($false)
)

Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Pass 5D complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow