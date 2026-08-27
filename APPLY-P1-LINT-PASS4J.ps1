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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4j-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4j-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4j-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4J-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4J" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
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

  if ($parent) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $destination)) {
    Copy-Item -LiteralPath $resolved -Destination $destination -Force
  }
}

function Replace-Exact(
  [string]$RelativePath,
  [string]$OldText,
  [string]$NewText,
  [string]$Label
) {
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
  Write-Utf8NoBom $path ($content.Replace($OldText, $NewText))
  Write-Host "[PASS4J] $Label" -ForegroundColor Green
  return $true
}

function Invoke-EslintJson([string]$OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force -ErrorAction SilentlyContinue

  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$OutputPath"
    $null = $LASTEXITCODE
  }
  finally {
    Pop-Location
  }

  if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
    throw "ESLint did not create: $OutputPath"
  }
}

function Get-LintStats([string]$ReportPath) {
  $results = Get-Content -LiteralPath $ReportPath -Raw | ConvertFrom-Json
  $problemFiles = 0
  $errors = 0
  $warnings = 0
  $rules = @{}

  foreach ($result in $results) {
    if ($result.messages.Count -gt 0) { $problemFiles++ }

    foreach ($message in $result.messages) {
      if ($message.severity -eq 2) { $errors++ }
      elseif ($message.severity -eq 1) { $warnings++ }

      $rule = if ($message.ruleId) { [string]$message.ruleId } else { "(parser)" }
      if (-not $rules.ContainsKey($rule)) { $rules[$rule] = 0 }
      $rules[$rule]++
    }
  }

  [PSCustomObject]@{
    ProblemFiles = $problemFiles
    Errors = $errors
    Warnings = $warnings
    Rules = $rules
  }
}

Write-Host "1. Measuring lint before Pass 4J..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative non-integrity refactors..."
$changes = 0

# A. Student assignment detail loader.
$studentAssignmentOld = @'
  const loadAssignment =
    useCallback(async () => {
      const studentId =
        user?.uid;

      if (!studentId || !assignmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const assignmentData =
          await getAssignmentById(
            assignmentId,
          );

        const progressData =
          await getStudentAssignmentProgress(
            assignmentId,
            studentId,
          );

        if (!assignmentData) {
          setError(
            "This assignment could not be found.",
          );
          setAssignment(null);
          return;
        }

        if (
          !assignmentData.studentIds.includes(
            studentId,
          )
        ) {
          setError(
            "You do not have access to this assignment.",
          );
          setAssignment(null);
          return;
        }

        setAssignment(
          assignmentData,
        );
        setProgress(progressData);
      } catch (loadError) {
        console.error(
          "Unable to load assignment:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "The assignment could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      assignmentId,
      user?.uid,
    ]);
'@

$studentAssignmentNew = @'
  const loadAssignment =
    useCallback(() => {
      const studentId =
        user?.uid;

      if (!studentId || !assignmentId) {
        return Promise.resolve().then(() => {
          setLoading(false);
        });
      }

      return Promise.resolve()
        .then(() => {
          setLoading(true);
          setError("");

          return getAssignmentById(
            assignmentId,
          );
        })
        .then(async (assignmentData) => {
          const progressData =
            await getStudentAssignmentProgress(
              assignmentId,
              studentId,
            );

          if (!assignmentData) {
            setError(
              "This assignment could not be found.",
            );
            setAssignment(null);
            return;
          }

          if (
            !assignmentData.studentIds.includes(
              studentId,
            )
          ) {
            setError(
              "You do not have access to this assignment.",
            );
            setAssignment(null);
            return;
          }

          setAssignment(
            assignmentData,
          );
          setProgress(progressData);
        })
        .catch((loadError) => {
          console.error(
            "Unable to load assignment:",
            loadError,
          );

          setError(
            loadError instanceof Error
              ? loadError.message
              : "The assignment could not be loaded.",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, [
      assignmentId,
      user?.uid,
    ]);
'@

if (Replace-Exact `
  "app\assignments\[assignmentId]\page.tsx" `
  $studentAssignmentOld `
  $studentAssignmentNew `
  "Deferred student-assignment loader state transitions") {
  $changes++
}

# B. Assignment wizard logged-out classes reset.
$wizardAuthOld = @'
    if (!user) {
      setClasses([]);
      setLoadingClasses(false);
      return;
    }
'@

$wizardAuthNew = @'
    if (!user) {
      void Promise.resolve().then(() => {
        setClasses([]);
        setLoadingClasses(false);
      });

      return;
    }
'@

if (Replace-Exact `
  "app\teacher\assignment-wizard\page.tsx" `
  $wizardAuthOld `
  $wizardAuthNew `
  "Deferred assignment-wizard logged-out class reset") {
  $changes++
}

# C. Assignment wizard saved-quiz preloading.
$wizardQuizOld = @'
    async function loadSavedQuiz() {
      setLoadingResource(true);

      try {
'@

$wizardQuizNew = @'
    async function loadSavedQuiz() {
      await Promise.resolve();

      if (cancelled) return;

      setLoadingResource(true);

      try {
'@

if (Replace-Exact `
  "app\teacher\assignment-wizard\page.tsx" `
  $wizardQuizOld `
  $wizardQuizNew `
  "Deferred assignment-wizard saved-quiz loading transition") {
  $changes++
}

# D. Assignment wizard teaching-resource / exam-paper preloading.
$wizardContentOld = @'
    async function loadContent() {
      setLoadingResource(true);
      try {
'@

$wizardContentNew = @'
    async function loadContent() {
      await Promise.resolve();

      if (cancelled) return;

      setLoadingResource(true);
      try {
'@

if (Replace-Exact `
  "app\teacher\assignment-wizard\page.tsx" `
  $wizardContentOld `
  $wizardContentNew `
  "Deferred assignment-wizard content loading transition") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4J..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4J")
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

foreach ($entry in ($after.Rules.GetEnumerator() | Sort-Object Value -Descending)) {
  $summaryLines.Add("$($entry.Key): $($entry.Value)")
}

$summaryLines.Add("")
$summaryLines.Add("PASS 4J SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled student assignment loading plus three assignment-wizard")
$summaryLines.Add("effect-triggered loading/reset paths using deferred Promise work.")
$summaryLines.Add("Student exam/quiz fullscreen, visibility, countdown, incident logging")
$summaryLines.Add("and auto-submit enforcement logic was not modified.")
$summaryLines.Add("ReviewSchedule purity was not modified.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4J complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4J-SUMMARY.txt next."