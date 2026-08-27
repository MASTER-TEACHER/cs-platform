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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4b-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4b-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4b-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4B-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4B" -ForegroundColor Cyan
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
  Write-Host "[PASS4B] $Label" -ForegroundColor Green
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

Write-Host "1. Measuring lint before Pass 4B..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying async-loader and close-action refactors..."
$changes = 0

# ---------------------------------------------------------------------------
# useStudentAdaptiveAnalytics
# Keep state changes in Promise completion callbacks rather than synchronously
# mutating state from the effect body. Logged-out values are derived on return.
# ---------------------------------------------------------------------------
if (Replace-Exact `
  "hooks\useStudentAdaptiveAnalytics.ts" `
@'
    if (!user?.uid) {
      setAnalytics(emptyStudentAdaptiveAnalytics);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const loaded = await getStudentAdaptiveAnalytics(user!.uid);

        if (!cancelled) {
          setAnalytics(loaded);
        }
      } catch (caughtError) {
        console.error("Student adaptive analytics error:", caughtError);

        if (!cancelled) {
          setAnalytics(emptyStudentAdaptiveAnalytics);

          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Assessment analytics could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
'@ `
@'
    if (!user?.uid) {
      return;
    }

    const studentId = user.uid;
    let cancelled = false;

    void getStudentAdaptiveAnalytics(studentId)
      .then((loaded) => {
        if (cancelled) return;

        setAnalytics(loaded);
        setError("");
      })
      .catch((caughtError) => {
        console.error("Student adaptive analytics error:", caughtError);

        if (cancelled) return;

        setAnalytics(emptyStudentAdaptiveAnalytics);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Assessment analytics could not be loaded.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
'@ `
  "Refactored student adaptive analytics loader callbacks") { $changes++ }

if (Replace-Exact `
  "hooks\useStudentAdaptiveAnalytics.ts" `
@'
  return {
    analytics,
    loading: authLoading || loading,
    error,
  };
'@ `
@'
  return {
    analytics: user?.uid ? analytics : emptyStudentAdaptiveAnalytics,
    loading: authLoading || (Boolean(user?.uid) && loading),
    error: user?.uid ? error : "",
  };
'@ `
  "Derived logged-out student adaptive analytics state") { $changes++ }

# ---------------------------------------------------------------------------
# useStudentAssignmentResults
# onSnapshot callbacks are already safe. Only remove synchronous logged-out
# setters from the effect and derive the logged-out return values.
# ---------------------------------------------------------------------------
if (Replace-Exact `
  "hooks\useStudentAssignmentResults.ts" `
@'
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }
'@ `
@'
    if (!user) {
      return;
    }
'@ `
  "Removed synchronous logged-out assignment-result reset") { $changes++ }

if (Replace-Exact `
  "hooks\useStudentAssignmentResults.ts" `
@'
  return {
    results,
    loading: authLoading || loading,
  };
'@ `
@'
  return {
    results: user ? results : [],
    loading: authLoading || (Boolean(user) && loading),
  };
'@ `
  "Derived logged-out assignment-result state") { $changes++ }

# ---------------------------------------------------------------------------
# useTeacherDashboard
# Same pattern: asynchronous Promise callbacks own data state; logged-out
# display state is derived rather than written synchronously by the effect.
# ---------------------------------------------------------------------------
if (Replace-Exact `
  "hooks\useTeacherDashboard.ts" `
@'
    if (!user?.uid) {
      setData(emptyTeacherDashboardData);

      setError("");
      setLoading(false);

      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const dashboardData = await getTeacherDashboardData(user!.uid);

        if (cancelled) {
          return;
        }

        setData(dashboardData);
      } catch (caughtError) {
        console.error("Teacher dashboard load error:", caughtError);

        if (cancelled) {
          return;
        }

        setData(emptyTeacherDashboardData);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The teacher dashboard could not be loaded.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();
'@ `
@'
    if (!user?.uid) {
      return;
    }

    const teacherId = user.uid;
    let cancelled = false;

    void getTeacherDashboardData(teacherId)
      .then((dashboardData) => {
        if (cancelled) return;

        setData(dashboardData);
        setError("");
      })
      .catch((caughtError) => {
        console.error("Teacher dashboard load error:", caughtError);

        if (cancelled) return;

        setData(emptyTeacherDashboardData);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The teacher dashboard could not be loaded.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
'@ `
  "Refactored teacher dashboard loader callbacks") { $changes++ }

if (Replace-Exact `
  "hooks\useTeacherDashboard.ts" `
@'
  return {
    ...data,
    loading: authLoading || loading,
    error,
  };
'@ `
@'
  return {
    ...(user?.uid ? data : emptyTeacherDashboardData),
    loading: authLoading || (Boolean(user?.uid) && loading),
    error: user?.uid ? error : "",
  };
'@ `
  "Derived logged-out teacher dashboard state") { $changes++ }

# ---------------------------------------------------------------------------
# AssignResourceModal
# Closing is a user action, so reset form state in the close path rather than
# synchronously from an effect that observes isOpen.
# ---------------------------------------------------------------------------
if (Replace-Exact `
  "components\teacher\resources\AssignResourceModal.tsx" `
@'
  useEffect(() => {
    if (!isOpen) {
      setSelectedClassId("");
      setDueDate("");
      setInstructions("");
      setLoadError("");
    }
  }, [isOpen]);

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    onClose();
  }
'@ `
@'
  function resetForm() {
    setSelectedClassId("");
    setDueDate("");
    setInstructions("");
    setLoadError("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }
'@ `
  "Moved resource-assignment reset from effect to close action") { $changes++ }

if (Replace-Exact `
  "components\teacher\resources\AssignResourceModal.tsx" `
@'
      onAssignmentCreated?.(assignmentId);

      onClose();
'@ `
@'
      onAssignmentCreated?.(assignmentId);

      resetForm();
      onClose();
'@ `
  "Reset resource-assignment form after successful submit") { $changes++ }

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4B..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4B")
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
$summaryLines.Add("PASS 4B SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Refactored selected async-loader and modal reset effects.")
$summaryLines.Add("Firestore subscription state remains inside onSnapshot callbacks.")
$summaryLines.Add("Exam/quiz integrity, fullscreen, visibility, countdown and auto-submit")
$summaryLines.Add("logic was not modified.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4B complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4B-SUMMARY.txt next."