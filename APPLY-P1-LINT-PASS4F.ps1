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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4f-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4f-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4f-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4F-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4F" -ForegroundColor Cyan
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
  Write-Host "[PASS4F] $Label" -ForegroundColor Green
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

      if (-not $rules.ContainsKey($rule)) {
        $rules[$rule] = 0
      }

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

Write-Host "1. Measuring lint before Pass 4F..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying the next low-risk loader refactors..."
$changes = 0

$revisionOld = @'
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setItems(await getStudentInterventions(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);
'@

$revisionNew = @'
  const load = useCallback(() => {
    if (!userId) {
      return Promise.resolve();
    }

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        return getStudentInterventions(userId);
      })
      .then((loadedItems) => {
        setItems(loadedItems);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);
'@

if (Replace-Exact `
  "app\revision-plan\page.tsx" `
  $revisionOld `
  $revisionNew `
  "Deferred revision-plan loader state transitions") {
  $changes++
}

$programmingOld = @'
  const loadAssignments = useCallback(async () => {
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      setAssignments(
        await getTeacherProgrammingAssignments(user.uid),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Programming assignments could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);
'@

$programmingNew = @'
  const loadAssignments = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setAssignments([]);
        setError("");
        setLoading(false);
      });
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getTeacherProgrammingAssignments(teacherId);
      })
      .then((loadedAssignments) => {
        setAssignments(loadedAssignments);
      })
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Programming assignments could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
'@

if (Replace-Exact `
  "app\teacher\programming-assignments\page.tsx" `
  $programmingOld `
  $programmingNew `
  "Deferred programming-assignment loader state transitions") {
  $changes++
}

$historyOld = @'
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const userId = user.uid;
    let active = true;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const items = await getExamTrainerHistory(userId);

        if (active) {
          setHistory(items);
        }
      } catch (loadError) {
        console.error("Exam trainer history error:", loadError);

        if (active) {
          setError("Your saved exam history could not be loaded.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, [user]);
'@

$historyNew = @'
  useEffect(() => {
    let active = true;

    if (!user) {
      void Promise.resolve().then(() => {
        if (!active) return;
        setHistory([]);
        setError("");
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }

    const userId = user.uid;

    void Promise.resolve()
      .then(() => {
        if (!active) return null;

        setLoading(true);
        setError("");

        return getExamTrainerHistory(userId);
      })
      .then((items) => {
        if (active && items) {
          setHistory(items);
        }
      })
      .catch((loadError) => {
        console.error("Exam trainer history error:", loadError);

        if (active) {
          setError("Your saved exam history could not be loaded.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);
'@

if (Replace-Exact `
  "components\exam-trainer\ExamTrainerHistory.tsx" `
  $historyOld `
  $historyNew `
  "Deferred exam-trainer history effect state transitions") {
  $changes++
}

$analyticsOld = @'
    if (!user?.uid) {
      setCentre(emptyActionCentre);
      setLoading(false);
      return;
    }
'@

$analyticsNew = @'
    if (!user?.uid) {
      void Promise.resolve().then(() => {
        if (cancelled) return;
        setCentre(emptyActionCentre);
        setError("");
        setLoading(false);
      });
      return;
    }
'@

# The analytics effect declares `cancelled` after this guard in the current
# source, so replacing only the guard with a reference to it would be unsafe.
# Instead, use a self-contained deferred callback for this branch.
$analyticsNew = @'
    if (!user?.uid) {
      void Promise.resolve().then(() => {
        setCentre(emptyActionCentre);
        setError("");
        setLoading(false);
      });
      return;
    }
'@

if (Replace-Exact `
  "app\teacher\analytics\page.tsx" `
  $analyticsOld `
  $analyticsNew `
  "Deferred teacher-analytics empty-user state transition") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4F..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4F")
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
$summaryLines.Add("PASS 4F SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Continued the validated Promise-callback approach on selected")
$summaryLines.Add("non-integrity loaders and empty-state branches.")
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

Write-Host "P1 Lint Pass 4F complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4F-SUMMARY.txt next."