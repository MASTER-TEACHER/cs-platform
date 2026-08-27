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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4d-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4d-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4d-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4D-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4D" -ForegroundColor Cyan
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

  if (-not $resolved.StartsWith(
      $prefix,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
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
  Write-Host "[PASS4D] $Label" -ForegroundColor Green
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

      $rule = if ($message.ruleId) {
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

  [PSCustomObject]@{
    ProblemFiles = $problemFiles
    Errors = $errors
    Warnings = $warnings
    Rules = $rules
  }
}

Write-Host "1. Measuring lint before Pass 4D..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Refactoring complete effect-triggered loader patterns..."
$changes = 0

# ===========================================================================
# A. useAdaptiveLearning
# The function called by useEffect must not synchronously set state.
# All state transitions are moved behind Promise callbacks.
# ===========================================================================
$adaptiveOld = @'
  const refresh = useCallback(async () => {
    if (!user?.uid) {
      setPlan(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      setPlan(await getAdaptiveLearningPlan(user.uid));
    } catch (caughtError) {
      console.error("Adaptive learning error:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The adaptive learning plan could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);
'@

$adaptiveNew = @'
  const refresh = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setPlan(null);
        setError("");
        setLoading(false);
      });
    }

    const userId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getAdaptiveLearningPlan(userId);
      })
      .then((loadedPlan) => {
        setPlan(loadedPlan);
      })
      .catch((caughtError) => {
        console.error("Adaptive learning error:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The adaptive learning plan could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
'@

if (Replace-Exact `
    "hooks\useAdaptiveLearning.ts" `
    $adaptiveOld `
    $adaptiveNew `
    "Moved adaptive-learning state transitions behind Promise callbacks") {
  $changes++
}

# ===========================================================================
# B. useKnowledgeMap
# ===========================================================================
$mapOld = @'
  const refresh = useCallback(async () => {
    if (!user?.uid) {
      setMap(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      setMap(await getKnowledgeMap(user.uid));
    } catch (caughtError) {
      console.error("Knowledge map error:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The knowledge map could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);
'@

$mapNew = @'
  const refresh = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setMap(null);
        setError("");
        setLoading(false);
      });
    }

    const userId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getKnowledgeMap(userId);
      })
      .then((loadedMap) => {
        setMap(loadedMap);
      })
      .catch((caughtError) => {
        console.error("Knowledge map error:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The knowledge map could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
'@

if (Replace-Exact `
    "hooks\useKnowledgeMap.ts" `
    $mapOld `
    $mapNew `
    "Moved knowledge-map state transitions behind Promise callbacks") {
  $changes++
}

# ===========================================================================
# C. Teacher quiz assignments
# ===========================================================================
$quizAssignmentsOld = @'
  const loadAssignments = useCallback(async () => {
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedAssignments = await getTeacherQuizAssignments(user.uid);

      setAssignments(loadedAssignments);
    } catch (caughtError) {
      console.error("Failed to load quiz assignments:", caughtError);

      setAssignments([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Quiz assignments could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);
'@

$quizAssignmentsNew = @'
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
        return getTeacherQuizAssignments(teacherId);
      })
      .then((loadedAssignments) => {
        setAssignments(loadedAssignments);
      })
      .catch((caughtError) => {
        console.error("Failed to load quiz assignments:", caughtError);

        setAssignments([]);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Quiz assignments could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
'@

if (Replace-Exact `
    "app\teacher\quiz-assignments\page.tsx" `
    $quizAssignmentsOld `
    $quizAssignmentsNew `
    "Moved teacher quiz-assignment state transitions behind Promise callbacks") {
  $changes++
}

# ===========================================================================
# D. Teacher resource library
# ===========================================================================
$resourcesOld = @'
  const loadResources = useCallback(async () => {
    if (!currentUser) {
      setResources([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedResources = await getTeacherResources(currentUser.uid);

      setResources(savedResources);
    } catch (caughtError) {
      console.error("Failed to load teacher resources:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your resource library could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
'@

$resourcesNew = @'
  const loadResources = useCallback(() => {
    if (!currentUser) {
      return Promise.resolve().then(() => {
        setResources([]);
        setError(null);
        setLoading(false);
      });
    }

    const teacherId = currentUser.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError(null);
        return getTeacherResources(teacherId);
      })
      .then((savedResources) => {
        setResources(savedResources);
      })
      .catch((caughtError) => {
        console.error("Failed to load teacher resources:", caughtError);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Your resource library could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser]);
'@

if (Replace-Exact `
    "app\teacher\resources\page.tsx" `
    $resourcesOld `
    $resourcesNew `
    "Moved teacher resource-library state transitions behind Promise callbacks") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4D..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4D")
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
$summaryLines.Add("PASS 4D SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Refactored four complete effect-triggered loader functions so React state")
$summaryLines.Add("transitions occur inside asynchronous Promise callbacks rather than")
$summaryLines.Add("synchronously when the effect invokes the loader.")
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

Write-Host "P1 Lint Pass 4D complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4D-SUMMARY.txt next."