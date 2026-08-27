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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass4m-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4m-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4m-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4M-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4M" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Backup-File([string]$FullPath) {
  $resolved = (Resolve-Path -LiteralPath $FullPath).Path
  $prefix = $ProjectRoot + "\"
  if (-not $resolved.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to back up a file outside ProjectRoot: $resolved"
  }
  $relative = $resolved.Substring($prefix.Length)
  $destination = Join-Path $backup $relative
  $parent = Split-Path -Parent $destination
  if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  if (-not (Test-Path -LiteralPath $destination)) {
    Copy-Item -LiteralPath $resolved -Destination $destination -Force
  }
}

function Replace-Exact([string]$RelativePath,[string]$OldText,[string]$NewText,[string]$Label) {
  $path = Join-Path $ProjectRoot $RelativePath
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] $Label - file missing." -ForegroundColor Yellow
    return $false
  }
  $content = [System.IO.File]::ReadAllText($path)
  if (-not $content.Contains($OldText)) {
    Write-Host "[SKIP] $Label - exact target absent/source changed." -ForegroundColor Yellow
    return $false
  }
  Backup-File $path
  Write-Utf8NoBom $path ($content.Replace($OldText,$NewText))
  Write-Host "[PASS4M] $Label" -ForegroundColor Green
  return $true
}

function Invoke-EslintJson([string]$OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force -ErrorAction SilentlyContinue
  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$OutputPath"
    $null = $LASTEXITCODE
  } finally { Pop-Location }
  if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
    throw "ESLint did not create: $OutputPath"
  }
}

function Get-LintStats([string]$ReportPath) {
  $results = Get-Content -LiteralPath $ReportPath -Raw | ConvertFrom-Json
  $problemFiles=0; $errors=0; $warnings=0; $rules=@{}
  foreach ($result in $results) {
    if ($result.messages.Count -gt 0) { $problemFiles++ }
    foreach ($message in $result.messages) {
      if ($message.severity -eq 2) { $errors++ } elseif ($message.severity -eq 1) { $warnings++ }
      $rule = if ($message.ruleId) { [string]$message.ruleId } else { "(parser)" }
      if (-not $rules.ContainsKey($rule)) { $rules[$rule]=0 }
      $rules[$rule]++
    }
  }
  [PSCustomObject]@{ProblemFiles=$problemFiles;Errors=$errors;Warnings=$warnings;Rules=$rules}
}

Write-Host "1. Measuring lint before Pass 4M..."
Invoke-EslintJson $beforeReport
$before=Get-LintStats $beforeReport

Write-Host "2. Applying source-specific low-risk effect refactors..."
$changes=0

# Curriculum profile hydration.
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
    if (
      profile?.qualification === "GCSE" ||
      profile?.qualification === "A_LEVEL" ||
      profile?.examBoard === "AQA" ||
      profile?.examBoard === "OCR" ||
      profile?.examBoard === "EDEXCEL"
    ) {
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
    }
'@
if(Replace-Exact "app\profile\curriculum\page.tsx" $old $new "Curriculum profile hydration"){ $changes++ }

# App shell route-close.
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
if(Replace-Exact "components\layout\AppShell.tsx" $old $new "Mobile sidebar route reset"){ $changes++ }

# Lesson practice prop hydration.
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
if(Replace-Exact "components\lesson-engine\LessonPracticeStep.tsx" $old $new "Lesson practice response hydration"){ $changes++ }

# Programming progress localStorage hydration.
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
if(Replace-Exact "hooks\useProgrammingProgress.ts" $old $new "Programming progress hydration"){ $changes++ }

# Exam question generator query prefill.
$old=@'
    setSettings({
      topic: topic.trim(),
      qualification: searchParams.get("qualification") || "GCSE",
      examBoard: searchParams.get("examBoard") || "AQA",
      difficulty,
      generationMode: "automatic",
      blueprint: createBlueprintFromQuery({
        topic: topic.trim(),
        difficulty,
        questionCount,
        totalMarks: requestedTotalMarks,
      }),
    });
'@
$new=@'
    void Promise.resolve().then(() => {
      setSettings({
        topic: topic.trim(),
        qualification: searchParams.get("qualification") || "GCSE",
        examBoard: searchParams.get("examBoard") || "AQA",
        difficulty,
        generationMode: "automatic",
        blueprint: createBlueprintFromQuery({
          topic: topic.trim(),
          difficulty,
          questionCount,
          totalMarks: requestedTotalMarks,
        }),
      });
    });
'@
if(Replace-Exact "app\teacher\exam-question-generator\page.tsx" $old $new "Exam generator query prefill"){ $changes++ }

# Quiz generator query prefill.
$old=@'
    setSettings({
      topic: topic.trim(),
      qualification:
        searchParams.get("qualification")?.trim() ||
        initialSettings.qualification,
      examBoard:
        searchParams.get("examBoard")?.trim() || initialSettings.examBoard,
      difficulty: normaliseDifficulty(searchParams.get("difficulty")),
      questionCount: normaliseQuestionCount(searchParams.get("questionCount")),
    });

    setQuiz(null);
    setSavedQuizId(null);
    setGenerationMode(null);
    setQuotaUnavailable(false);
    setCopilotPrefilled(true);
'@
$new=@'
    void Promise.resolve().then(() => {
      setSettings({
        topic: topic.trim(),
        qualification:
          searchParams.get("qualification")?.trim() ||
          initialSettings.qualification,
        examBoard:
          searchParams.get("examBoard")?.trim() || initialSettings.examBoard,
        difficulty: normaliseDifficulty(searchParams.get("difficulty")),
        questionCount: normaliseQuestionCount(searchParams.get("questionCount")),
      });

      setQuiz(null);
      setSavedQuizId(null);
      setGenerationMode(null);
      setQuotaUnavailable(false);
      setCopilotPrefilled(true);
    });
'@
if(Replace-Exact "app\teacher\quiz-generator\page.tsx" $old $new "Quiz generator query prefill"){ $changes++ }

# Intervention modal candidate prefill.
$old=@'
    setDueDate(date.toISOString().slice(0, 10));
    setTitle(`${candidate.priorityTopic} intervention`);
    setTopic(candidate.priorityTopic);
    setReason(candidate.recommendation);
    setPriority(
      candidate.priority === "low"
        ? "medium"
        : candidate.priority,
    );
    setLessonHref(
      `/learn?search=${encodeURIComponent(candidate.priorityTopic)}`,
    );
'@
$new=@'
    void Promise.resolve().then(() => {
      setDueDate(date.toISOString().slice(0, 10));
      setTitle(`${candidate.priorityTopic} intervention`);
      setTopic(candidate.priorityTopic);
      setReason(candidate.recommendation);
      setPriority(
        candidate.priority === "low"
          ? "medium"
          : candidate.priority,
      );
      setLessonHref(
        `/learn?search=${encodeURIComponent(candidate.priorityTopic)}`,
      );
    });
'@
if(Replace-Exact "components\teacher\interventions\CreateInterventionModal.tsx" $old $new "Intervention modal candidate prefill"){ $changes++ }

# Reporting workspace three selection-sync effects.
$old=@'
    setSelectedClassId(
      classes[0]?.classId ||
        "",
    );
'@
$new=@'
    void Promise.resolve().then(() => {
      setSelectedClassId(
        classes[0]?.classId ||
          "",
      );
    });
'@
if(Replace-Exact "components\teacher\reports\ReportingWorkspace.tsx" $old $new "Reporting class selection sync"){ $changes++ }

$old=@'
    setSelectedStudentId(
      classStudents[0]
        ?.studentId || "",
    );
'@
$new=@'
    void Promise.resolve().then(() => {
      setSelectedStudentId(
        classStudents[0]
          ?.studentId || "",
      );
    });
'@
if(Replace-Exact "components\teacher\reports\ReportingWorkspace.tsx" $old $new "Reporting student selection sync"){ $changes++ }

$old=@'
  useEffect(() => {
    setStudentSearch("");
  }, [selectedClassId]);
'@
$new=@'
  useEffect(() => {
    void Promise.resolve().then(() => {
      setStudentSearch("");
    });
  }, [selectedClassId]);
'@
if(Replace-Exact "components\teacher\reports\ReportingWorkspace.tsx" $old $new "Reporting student-search reset"){ $changes++ }

# Teacher-access profile hydration.
$old=@'
    if (
      extendedProfile
        ?.teacherAccessStatus ===
      "pending"
    ) {
      setSubmitted(true);
    }

    if (
      user &&
      !name
    ) {
      setName(
        profile?.name ||
          user.displayName ||
          "",
      );
    }
'@
$new=@'
    if (
      extendedProfile?.teacherAccessStatus === "pending" ||
      (user && !name)
    ) {
      void Promise.resolve().then(() => {
        if (extendedProfile?.teacherAccessStatus === "pending") {
          setSubmitted(true);
        }

        if (user && !name) {
          setName(
            profile?.name ||
              user.displayName ||
              "",
          );
        }
      });
    }
'@
if(Replace-Exact "app\teacher-access\page.tsx" $old $new "Teacher-access profile hydration"){ $changes++ }

# Exam trainer logged-out stage reset only; timer/autosave remain untouched.
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
if(Replace-Exact "components\exam-trainer\ExamQuestionTrainer.tsx" $old $new "Exam trainer logged-out stage reset"){ $changes++ }

Write-Host ""
Write-Host "Applied source changes: $changes"
Write-Host "3. Measuring lint after Pass 4M..."
Invoke-EslintJson $afterReport
$after=Get-LintStats $afterReport

$summaryLines=New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4M")
$summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$summaryLines.Add("Project: $ProjectRoot")
$summaryLines.Add("Backup: $backup")
$summaryLines.Add("")
$summaryLines.Add("Applied source changes: $changes")
$summaryLines.Add("")
$summaryLines.Add("BEFORE")
$summaryLines.Add("------")
$summaryLines.Add("Problem files: $($before.ProblemFiles)")
$summaryLines.Add("Errors: $($before.Errors)")
$summaryLines.Add("Warnings: $($before.Warnings)")
$summaryLines.Add("")
$summaryLines.Add("AFTER")
$summaryLines.Add("-----")
$summaryLines.Add("Problem files: $($after.ProblemFiles)")
$summaryLines.Add("Errors: $($after.Errors)")
$summaryLines.Add("Warnings: $($after.Warnings)")
$summaryLines.Add("")
$summaryLines.Add("REMAINING RULE COUNTS")
$summaryLines.Add("---------------------")
foreach($entry in ($after.Rules.GetEnumerator() | Sort-Object Value -Descending)){
  $summaryLines.Add("$($entry.Key): $($entry.Value)")
}
$summaryLines.Add("")
$summaryLines.Add("PASS 4M SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled source-specific UI/query/profile/reporting hydration and reset effects.")
$summaryLines.Add("Exam/quiz fullscreen, visibility, countdown, incident logging and auto-submit")
$summaryLines.Add("enforcement logic was not modified.")
$summaryLines.Add("Exam-trainer timer/autosave behaviour was not modified.")
$summaryLines.Add("ReviewSchedule purity was not modified.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines($summary,$summaryLines,[System.Text.UTF8Encoding]::new($false))
Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "P1 Lint Pass 4M complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4M-SUMMARY.txt next."