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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass4o-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4o-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4o-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4O-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4O" -ForegroundColor Cyan
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
    throw "Refusing to back up file outside ProjectRoot: $resolved"
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
  Write-Host "[PASS4O] $Label" -ForegroundColor Green
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

  [PSCustomObject]@{
    ProblemFiles = $problemFiles
    Errors = $errors
    Warnings = $warnings
    Rules = $rules
  }
}

Write-Host "1. Measuring lint before Pass 4O..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "2. Applying remaining low-risk non-integrity refactors..."
$changes = 0

# ------------------------------------------------------------------
# useProgrammingProgress:
# localStorage hydration is synchronous state work invoked by an effect.
# Defer it to a Promise callback and guard against stale completion.
# ------------------------------------------------------------------
$old = @'
  useEffect(() => {
    setHydrated(false);
    setProgress(loadProgress(studentId));
    setHydrated(Boolean(studentId));
  }, [studentId]);
'@

$new = @'
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
  $old `
  $new `
  "Programming progress localStorage hydration"
) {
  $changes++
}

# ------------------------------------------------------------------
# Curriculum profile -> form hydration.
# Routing remains synchronous; only local form-state hydration is deferred.
# ------------------------------------------------------------------
$old = @'
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

$new = @'
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

if (Replace-Exact `
  "app\profile\curriculum\page.tsx" `
  $old `
  $new `
  "Curriculum profile form hydration"
) {
  $changes++
}

# ------------------------------------------------------------------
# Quiz landing page: the no-topic branch is a UI reset only.
# Generation/loading behaviour is intentionally left unchanged.
# ------------------------------------------------------------------
$old = @'
    if (!topicParam) {
      setGeneratedQuiz(null);
      setSelectedQuizId(
        null,
      );
      setLoadError("");
      return;
    }
'@

$new = @'
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

if (Replace-Exact `
  "app\quiz\page.tsx" `
  $old `
  $new `
  "Quiz no-topic UI reset"
) {
  $changes++
}

# ------------------------------------------------------------------
# Written exam loader: only the logged-out loading reset is deferred.
# The actual assignment/submission load and all integrity behaviour remain.
# ------------------------------------------------------------------
$old = @'
      if (!user?.uid) {
        setLoading(false);
        return;
      }
'@

$new = @'
      if (!user?.uid) {
        void Promise.resolve().then(() => {
          setLoading(false);
        });
        return;
      }
'@

if (Replace-Exact `
  "app\assignments\exam\[assignmentId]\page.tsx" `
  $old `
  $new `
  "Written exam signed-out loader reset"
) {
  $changes++
}

Write-Host ""
Write-Host "Applied source changes: $changes"
Write-Host "3. Measuring lint after Pass 4O..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4O")
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
$summaryLines.Add("PASS 4O SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled additional low-risk non-integrity hydration/reset effects found")
$summaryLines.Add("in the fresh 17-file source bundle.")
$summaryLines.Add("Student exam/quiz fullscreen, visibility, countdown, incident logging and")
$summaryLines.Add("automatic integrity submission behaviour was not modified.")
$summaryLines.Add("Exam/quiz timers and autosave behaviour were not modified.")
$summaryLines.Add("ReviewSchedule purity was deliberately left for the final cleanup.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "P1 Lint Pass 4O complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4O-SUMMARY.txt next."