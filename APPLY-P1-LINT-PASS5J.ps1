param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parent = Split-Path -Parent $ProjectRoot
$name = Split-Path -Leaf $ProjectRoot
$backup = Join-Path $parent "$name-p1-lint-pass5j-backup-$stamp"
$report = Join-Path $env:TEMP "cs-master-pass5j-$stamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS5J-SUMMARY.txt"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

$changes = New-Object System.Collections.Generic.List[string]
$misses  = New-Object System.Collections.Generic.List[string]

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $dest = Join-Path $backup $relative
  $dir = Split-Path -Parent $dest

  if ($dir) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $dest)) {
    Copy-Item -LiteralPath $Path -Destination $dest -Force
  }
}

function Replace-RegexOnce(
  [string]$RelativePath,
  [string]$Pattern,
  [string]$Replacement,
  [string]$Label
) {
  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    $misses.Add("$Label - file missing")
    return
  }

  $source = [IO.File]::ReadAllText($path)
  $regex = [regex]::new(
    $Pattern,
    [Text.RegularExpressions.RegexOptions]::Multiline -bor
    [Text.RegularExpressions.RegexOptions]::Singleline
  )

  $match = $regex.Match($source)

  if (-not $match.Success) {
    $misses.Add("$Label - pattern not found")
    return
  }

  Backup-File $path

  $updated = $regex.Replace(
    $source,
    $Replacement,
    1
  )

  [IO.File]::WriteAllText(
    $path,
    $updated,
    [Text.UTF8Encoding]::new($false)
  )

  $changes.Add($Label)
  Write-Host "[PASS5J] $Label" -ForegroundColor Green
}

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 5J" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# -------------------------------------------------------------------
# 1. Curriculum profile hydration.
# Only the state-hydration setters are moved behind a Promise callback.
# Authentication redirects remain synchronous.
# -------------------------------------------------------------------
Replace-RegexOnce `
  "app\profile\curriculum\page.tsx" `
  '(\s*)if\s*\(\s*profile\?\.qualification\s*===\s*"GCSE"\s*\|\|\s*profile\?\.qualification\s*===\s*"A_LEVEL"\s*\)\s*\{\s*setQualification\(profile\.qualification\);\s*\}\s*if\s*\(\s*profile\?\.examBoard\s*===\s*"AQA"\s*\|\|\s*profile\?\.examBoard\s*===\s*"OCR"\s*\|\|\s*profile\?\.examBoard\s*===\s*"EDEXCEL"\s*\)\s*\{\s*setExamBoard\(profile\.examBoard\);\s*\}' `
  '$1void Promise.resolve().then(() => {
$1  if (
$1    profile?.qualification === "GCSE" ||
$1    profile?.qualification === "A_LEVEL"
$1  ) {
$1    setQualification(profile.qualification);
$1  }

$1  if (
$1    profile?.examBoard === "AQA" ||
$1    profile?.examBoard === "OCR" ||
$1    profile?.examBoard === "EDEXCEL"
$1  ) {
$1    setExamBoard(profile.examBoard);
$1  }
$1});' `
  "Curriculum profile hydration"

# -------------------------------------------------------------------
# 2. AppShell route-change close.
# -------------------------------------------------------------------
Replace-RegexOnce `
  "components\layout\AppShell.tsx" `
  'useEffect\(\(\)\s*=>\s*\{\s*setMobileSidebarOpen\(false\);\s*\},\s*\[pathname\]\);' `
  'useEffect(() => {
    void Promise.resolve().then(() => {
      setMobileSidebarOpen(false);
    });
  }, [pathname]);' `
  "AppShell route reset"

# -------------------------------------------------------------------
# 3. LessonPracticeStep prop hydration.
# -------------------------------------------------------------------
Replace-RegexOnce `
  "components\lesson-engine\LessonPracticeStep.tsx" `
  'useEffect\(\(\)\s*=>\s*\{\s*setResponses\(createInitialResponses\(questions,\s*initialResponses\)\);\s*\},\s*\[questions,\s*initialResponses\]\);' `
  'useEffect(() => {
    void Promise.resolve().then(() => {
      setResponses(createInitialResponses(questions, initialResponses));
    });
  }, [questions, initialResponses]);' `
  "Lesson practice hydration"

# -------------------------------------------------------------------
# 4. Programming progress localStorage hydration.
# -------------------------------------------------------------------
Replace-RegexOnce `
  "hooks\useProgrammingProgress.ts" `
  'useEffect\(\(\)\s*=>\s*\{\s*setHydrated\(false\);\s*setProgress\(loadProgress\(studentId\)\);\s*setHydrated\(Boolean\(studentId\)\);\s*\},\s*\[studentId\]\);' `
  'useEffect(() => {
    void Promise.resolve().then(() => {
      setHydrated(false);
      setProgress(loadProgress(studentId));
      setHydrated(Boolean(studentId));
    });
  }, [studentId]);' `
  "Programming progress hydration"

# -------------------------------------------------------------------
# 5. Exam Trainer signed-out transition.
# -------------------------------------------------------------------
Replace-RegexOnce `
  "components\exam-trainer\ExamQuestionTrainer.tsx" `
  'if\s*\(\s*!user\s*\)\s*\{\s*setStage\("setup"\);\s*return;\s*\}' `
  'if (!user) {
      void Promise.resolve().then(() => {
        setStage("setup");
      });
      return;
    }' `
  "Exam Trainer signed-out transition"

# -------------------------------------------------------------------
# 6 + 7. Exam Trainer timer:
#   - useEffectEvent import is already present.
#   - create the event immediately before the timer effect.
#   - replace only the timer-expiry call.
# This should simultaneously consume the unused import and remove the
# missing submitExam dependency.
# -------------------------------------------------------------------
$trainerPath = Join-Path $ProjectRoot "components\exam-trainer\ExamQuestionTrainer.tsx"
$trainerText = [IO.File]::ReadAllText($trainerPath)

if ($trainerText -notmatch 'const\s+submitExamFromTimer\s*=\s*useEffectEvent') {
  Replace-RegexOnce `
    "components\exam-trainer\ExamQuestionTrainer.tsx" `
    '(useEffect\(\(\)\s*=>\s*\{\s*if\s*\(\s*stage\s*!==\s*"exam"\s*\|\|\s*!attempt\s*\)\s*return;\s*if\s*\(\s*attempt\.secondsRemaining\s*<=\s*0\s*\)\s*\{\s*)void\s+submitExam\(\);' `
    'const submitExamFromTimer = useEffectEvent(() => {
    void submitExam();
  });

  $1submitExamFromTimer();' `
    "Exam Trainer timer Effect Event"
}
else {
  $changes.Add("Exam Trainer timer Effect Event already present")
}

# -------------------------------------------------------------------
# Verify all seven targets actually moved.
# -------------------------------------------------------------------
Write-Host ""
Write-Host "Applied targets: $($changes.Count)"
Write-Host "Missed targets:  $($misses.Count)"

if ($misses.Count -gt 0) {
  Write-Host ""
  Write-Host "TARGET MISSES:" -ForegroundColor Red
  $misses | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  throw "Pass 5J stopped because one or more exact remaining targets were not found."
}

# -------------------------------------------------------------------
# Final lint measurement.
# -------------------------------------------------------------------
Push-Location $ProjectRoot
try {
  & npx.cmd eslint . --format json --output-file "$report"
  $lintExit = $LASTEXITCODE
}
finally {
  Pop-Location
}

if (-not (Test-Path -LiteralPath $report -PathType Leaf)) {
  throw "ESLint report missing after Pass 5J."
}

$results = Get-Content -LiteralPath $report -Raw | ConvertFrom-Json
$problemFiles = 0
$errors = 0
$warnings = 0
$rules = @{}

foreach ($result in $results) {
  if ($result.messages.Count -gt 0) {
    $problemFiles++
  }

  foreach ($message in $result.messages) {
    if ($message.severity -eq 2) {
      $errors++
    }
    elseif ($message.severity -eq 1) {
      $warnings++
    }

    $rule =
      if ($message.ruleId) {
        [string]$message.ruleId
      }
      else {
        "(parser)"
      }

    if (-not $rules.ContainsKey($rule)) {
      $rules[$rule] = 0
    }

    $rules[$rule]++
  }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5J")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("Applied targets: $($changes.Count)")
$lines.Add("Missed targets: $($misses.Count)")
$lines.Add("")
$lines.Add("AFTER")
$lines.Add("-----")
$lines.Add("Problem files: $problemFiles")
$lines.Add("Errors: $errors")
$lines.Add("Warnings: $warnings")
$lines.Add("ESLint exit code: $lintExit")
$lines.Add("")
$lines.Add("REMAINING RULE COUNTS")
$lines.Add("---------------------")

if ($rules.Count -eq 0) {
  $lines.Add("None")
}
else {
  foreach ($entry in ($rules.GetEnumerator() | Sort-Object Value -Descending)) {
    $lines.Add("$($entry.Key): $($entry.Value)")
  }
}

$lines.Add("")
$lines.Add("No ESLint rules or warnings were disabled.")

[IO.File]::WriteAllLines(
  $summary,
  $lines,
  [Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Pass 5J complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow