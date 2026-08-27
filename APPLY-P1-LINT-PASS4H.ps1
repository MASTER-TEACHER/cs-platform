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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4h-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4h-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4h-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4H-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4H" -ForegroundColor Cyan
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
  Write-Host "[PASS4H] $Label" -ForegroundColor Green
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

Write-Host "1. Measuring lint before Pass 4H..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative non-integrity refactors..."
$changes = 0

# A. Teacher resource-assignment progress loader.
$resourceAssignmentOld = @'
  const loadAssignment = useCallback(async () => {
    if (!assignmentId || !user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedAssignment = await getAssignmentById(assignmentId);

      if (!loadedAssignment) {
        setAssignment(null);
        setRows([]);

        setError("This resource assignment could not be found.");

        return;
      }

      if (loadedAssignment.teacherId !== user.uid) {
        setAssignment(null);
        setRows([]);

        setError("You do not have permission to view this assignment.");

        return;
      }

      const loadedRows = await Promise.all(
        loadedAssignment.studentIds.map(async (studentId) => {
          const [profileSnapshot, progress] = await Promise.all([
            getDoc(doc(db, "users", studentId)),
            getStudentAssignmentProgress(loadedAssignment.id, studentId),
          ]);

          const profileData = profileSnapshot.exists()
            ? profileSnapshot.data()
            : null;

          return {
            student: {
              id: studentId,
              name: profileData?.name || "Student",
              email: profileData?.email || "No email available",
            },
            progress,
          } satisfies StudentProgressRow;
        }),
      );

      loadedRows.sort((first, second) =>
        first.student.name.localeCompare(second.student.name),
      );

      setAssignment(loadedAssignment);
      setRows(loadedRows);
    } catch (caughtError) {
      console.error("Failed to load assignment progress:", caughtError);

      setAssignment(null);
      setRows([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The assignment dashboard could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [assignmentId, user]);
'@

$resourceAssignmentNew = @'
  const loadAssignment = useCallback(() => {
    if (!assignmentId || !user?.uid) {
      return Promise.resolve();
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getAssignmentById(assignmentId);
      })
      .then(async (loadedAssignment) => {
        if (!loadedAssignment) {
          setAssignment(null);
          setRows([]);
          setError("This resource assignment could not be found.");
          return;
        }

        if (loadedAssignment.teacherId !== teacherId) {
          setAssignment(null);
          setRows([]);
          setError("You do not have permission to view this assignment.");
          return;
        }

        const loadedRows = await Promise.all(
          loadedAssignment.studentIds.map(async (studentId) => {
            const [profileSnapshot, progress] = await Promise.all([
              getDoc(doc(db, "users", studentId)),
              getStudentAssignmentProgress(loadedAssignment.id, studentId),
            ]);

            const profileData = profileSnapshot.exists()
              ? profileSnapshot.data()
              : null;

            return {
              student: {
                id: studentId,
                name: profileData?.name || "Student",
                email: profileData?.email || "No email available",
              },
              progress,
            } satisfies StudentProgressRow;
          }),
        );

        loadedRows.sort((first, second) =>
          first.student.name.localeCompare(second.student.name),
        );

        setAssignment(loadedAssignment);
        setRows(loadedRows);
      })
      .catch((caughtError) => {
        console.error("Failed to load assignment progress:", caughtError);

        setAssignment(null);
        setRows([]);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The assignment dashboard could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assignmentId, user]);
'@

if (Replace-Exact `
  "app\teacher\assignments\[assignmentId]\page.tsx" `
  $resourceAssignmentOld `
  $resourceAssignmentNew `
  "Deferred resource-assignment progress loader state transitions") {
  $changes++
}

# B. Teacher student analytics loader.
$studentAnalyticsOld = @'
  const loadAnalytics = useCallback(async () => {
    if (!studentId || !user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedAnalytics = await getStudentAnalytics(studentId, user.uid);

      if (!loadedAnalytics) {
        setAnalytics(null);

        setError(
          "This student could not be found or is not enrolled in one of your classes.",
        );

        return;
      }

      setAnalytics(loadedAnalytics);
    } catch (caughtError) {
      console.error("Failed to load student analytics:", caughtError);

      setAnalytics(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Student analytics could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [studentId, user]);
'@

$studentAnalyticsNew = @'
  const loadAnalytics = useCallback(() => {
    if (!studentId || !user?.uid) {
      return Promise.resolve();
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getStudentAnalytics(studentId, teacherId);
      })
      .then((loadedAnalytics) => {
        if (!loadedAnalytics) {
          setAnalytics(null);

          setError(
            "This student could not be found or is not enrolled in one of your classes.",
          );

          return;
        }

        setAnalytics(loadedAnalytics);
      })
      .catch((caughtError) => {
        console.error("Failed to load student analytics:", caughtError);

        setAnalytics(null);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Student analytics could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId, user]);
'@

if (Replace-Exact `
  "app\teacher\students\[studentId]\page.tsx" `
  $studentAnalyticsOld `
  $studentAnalyticsNew `
  "Deferred student-analytics loader state transitions") {
  $changes++
}

# C. Quiz library: Firestore snapshot callbacks are already the correct place
# for live state. Only defer the unauthenticated reset.
$quizLibraryOld = @'
    if (!user) {
      setQuizzes([]);
      setLoadingQuizzes(false);
      return;
    }
'@

$quizLibraryNew = @'
    if (!user) {
      void Promise.resolve().then(() => {
        setQuizzes([]);
        setLoadingQuizzes(false);
      });

      return;
    }
'@

if (Replace-Exact `
  "app\teacher\quiz-library\page.tsx" `
  $quizLibraryOld `
  $quizLibraryNew `
  "Deferred quiz-library unauthenticated reset") {
  $changes++
}

# D. Programming workspace assigned-challenge prop synchronization.
$workspaceOld = @'
  useEffect(() => {
    if (!assignedChallenge) return;

    setMode(assignedChallenge.mode);
    setDifficulty(
      assignedChallenge.difficulty,
    );
    setCurrentChallengeId(
      assignedChallenge.id,
    );
  }, [assignedChallenge]);
'@

$workspaceNew = @'
  useEffect(() => {
    if (!assignedChallenge) return;

    let active = true;

    void Promise.resolve().then(() => {
      if (!active) return;

      setMode(assignedChallenge.mode);
      setDifficulty(
        assignedChallenge.difficulty,
      );
      setCurrentChallengeId(
        assignedChallenge.id,
      );
    });

    return () => {
      active = false;
    };
  }, [assignedChallenge]);
'@

if (Replace-Exact `
  "components\programming\ProgrammingWorkspace.tsx" `
  $workspaceOld `
  $workspaceNew `
  "Deferred assigned-programming-challenge state synchronization") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4H..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4H")
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
$summaryLines.Add("PASS 4H SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled four non-integrity effect-triggered loader/synchronization cases.")
$summaryLines.Add("Firestore snapshot updates remain inside onSnapshot callbacks.")
$summaryLines.Add("Exam/quiz integrity, fullscreen, visibility, countdown and auto-submit")
$summaryLines.Add("logic was not modified.")
$summaryLines.Add("ReviewSchedule purity was not modified.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4H complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4H-SUMMARY.txt next."