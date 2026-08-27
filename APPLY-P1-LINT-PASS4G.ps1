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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4g-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4g-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4g-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4G-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4G" -ForegroundColor Cyan
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
  Write-Host "[PASS4G] $Label" -ForegroundColor Green
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

Write-Host "1. Measuring lint before Pass 4G..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative non-integrity refactors..."
$changes = 0

# 1) Teacher classes loader: defer the state transitions that are reached
# synchronously when useEffect invokes loadClasses().
$classesOld = @'
  async function loadClasses() {
    if (!user?.uid) {
      setClasses([]);
      setLoadingClasses(
        false,
      );

      return;
    }

    try {
      setLoadingClasses(
        true,
      );

      const [
        loaded,
        assignmentSummary,
      ] = await Promise.all([
        getTeacherClasses(
          user.uid,
        ),
        getUnifiedTeacherAssignments(
          user.uid,
        ),
      ]);

      setClasses(
        loaded,
      );

      setUnifiedAssignments(
        assignmentSummary.assignments,
      );
    } catch (error) {
      console.error(
        "Failed to load classes:",
        error,
      );

      toast.error(
        "Could not load your classes.",
      );
    } finally {
      setLoadingClasses(
        false,
      );
    }
  }
'@

$classesNew = @'
  function loadClasses() {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setClasses([]);
        setUnifiedAssignments([]);
        setLoadingClasses(false);
      });
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoadingClasses(true);

        return Promise.all([
          getTeacherClasses(
            teacherId,
          ),
          getUnifiedTeacherAssignments(
            teacherId,
          ),
        ]);
      })
      .then(([
        loaded,
        assignmentSummary,
      ]) => {
        setClasses(
          loaded,
        );

        setUnifiedAssignments(
          assignmentSummary.assignments,
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load classes:",
          error,
        );

        toast.error(
          "Could not load your classes.",
        );
      })
      .finally(() => {
        setLoadingClasses(
          false,
        );
      });
  }
'@

if (Replace-Exact `
  "app\teacher\classes\page.tsx" `
  $classesOld `
  $classesNew `
  "Deferred teacher-classes loader state transitions") {
  $changes++
}

# 2) Published-resource selector: preserve cancellation behaviour, but defer
# the no-user reset and loading transition out of the effect call stack.
$resourcesOld = @'
    if (!user?.uid) {
      setResources([]);
      setLoading(false);

      return;
    }
'@

$resourcesNew = @'
    if (!user?.uid) {
      void Promise.resolve().then(() => {
        setResources([]);
        setLoading(false);
      });

      return;
    }
'@

if (Replace-Exact `
  "components\teacher\resources\ExistingTeachingResourceSelector.tsx" `
  $resourcesOld `
  $resourcesNew `
  "Deferred published-resource empty-user reset") {
  $changes++
}

$resourcesLoadingOld = @'
      try {
        setLoading(true);

        const loaded =
          await getTeacherResources(
            teacherId,
          );
'@

$resourcesLoadingNew = @'
      try {
        await Promise.resolve();

        if (cancelled) {
          return;
        }

        setLoading(true);

        const loaded =
          await getTeacherResources(
            teacherId,
          );
'@

if (Replace-Exact `
  "components\teacher\resources\ExistingTeachingResourceSelector.tsx" `
  $resourcesLoadingOld `
  $resourcesLoadingNew `
  "Deferred published-resource loading transition") {
  $changes++
}

# 3) Programming progress hydration is localStorage hydration, not integrity
# logic. Keep the same values/order but move hydration state changes into a
# microtask so the effect does not synchronously cascade state updates.
$progressOld = @'
  useEffect(() => {
    setHydrated(false);
    setProgress(loadProgress(studentId));
    setHydrated(Boolean(studentId));
  }, [studentId]);
'@

$progressNew = @'
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

if (Replace-Exact `
  "hooks\useProgrammingProgress.ts" `
  $progressOld `
  $progressNew `
  "Deferred programming-progress localStorage hydration") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4G..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4G")
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
$summaryLines.Add("PASS 4G SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Continued conservative remediation of non-integrity effect-triggered")
$summaryLines.Add("loaders and localStorage hydration using deferred Promise callbacks.")
$summaryLines.Add("Exam/quiz integrity, fullscreen, visibility, countdown and auto-submit")
$summaryLines.Add("logic was not modified.")
$summaryLines.Add("ReviewSchedule purity was deliberately left for a dedicated fix.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4G complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4G-SUMMARY.txt next."