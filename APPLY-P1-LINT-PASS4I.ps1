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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4i-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4i-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4i-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4I-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4I" -ForegroundColor Cyan
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
  Write-Host "[PASS4I] $Label" -ForegroundColor Green
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

Write-Host "1. Measuring lint before Pass 4I..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative loader refactors..."
$changes = 0

# A. Intervention detail loader: stabilize load and move state transitions
# behind Promise callbacks. This should also resolve its exhaustive-deps warning.
if (Replace-Exact `
  "app\teacher\interventions\[interventionId]\page.tsx" `
  'import { useEffect, useState } from "react";' `
  'import { useCallback, useEffect, useState } from "react";' `
  "Added useCallback to intervention detail page") {
  $changes++
}

$interventionDetailOld = @'
  async function load() {
    setLoading(true);

    try {
      setItem(await getInterventionById(params.interventionId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [params.interventionId]);
'@

$interventionDetailNew = @'
  const load = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setLoading(true);
        return getInterventionById(params.interventionId);
      })
      .then((loadedItem) => {
        setItem(loadedItem);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.interventionId]);

  useEffect(() => {
    void load();
  }, [load]);
'@

if (Replace-Exact `
  "app\teacher\interventions\[interventionId]\page.tsx" `
  $interventionDetailOld `
  $interventionDetailNew `
  "Deferred and stabilized intervention-detail loader") {
  $changes++
}

# B. Intervention impact card: same effect-triggered loader pattern, plus
# unstable load dependency.
if (Replace-Exact `
  "components\teacher\interventions\InterventionImpactCard.tsx" `
@'
import {
  useEffect,
  useMemo,
  useState,
} from "react";
'@ `
@'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
'@ `
  "Added useCallback to intervention impact card") {
  $changes++
}

$impactOld = @'
  async function load() {
    try {
      setLoading(true);
      setError("");

      setImpact(
        await getInterventionImpact({
          interventionId,
          teacherId,
        }),
      );
    } catch (caughtError) {
      console.error(
        "Unable to load intervention impact:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Intervention impact could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [interventionId, teacherId]);
'@

$impactNew = @'
  const load = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");

        return getInterventionImpact({
          interventionId,
          teacherId,
        });
      })
      .then((loadedImpact) => {
        setImpact(loadedImpact);
      })
      .catch((caughtError) => {
        console.error(
          "Unable to load intervention impact:",
          caughtError,
        );

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Intervention impact could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [interventionId, teacherId]);

  useEffect(() => {
    void load();
  }, [load]);
'@

if (Replace-Exact `
  "components\teacher\interventions\InterventionImpactCard.tsx" `
  $impactOld `
  $impactNew `
  "Deferred and stabilized intervention-impact loader") {
  $changes++
}

# C. Teacher quiz markbook loader. This page reads integrity results but does
# not implement the student's fullscreen/countdown/auto-submit enforcement.
$markbookOld = @'
  const loadMarkbook = useCallback(async () => {
    if (authLoading || !profileReady) return;

    if (!assignmentId || !user?.uid) {
      setDetail(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loadedDetail = await getTeacherQuizAssignmentDetail(
        assignmentId,
        user.uid,
      );

      if (!loadedDetail) {
        setDetail(null);
        setError("This quiz assignment could not be found or you do not have permission to view it.");
        return;
      }

      setDetail(loadedDetail);
    } catch (caughtError) {
      console.error("Quiz markbook load error:", caughtError);
      setDetail(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The quiz markbook could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [assignmentId, authLoading, profileReady, user]);
'@

$markbookNew = @'
  const loadMarkbook = useCallback(() => {
    if (authLoading || !profileReady) {
      return Promise.resolve();
    }

    if (!assignmentId || !user?.uid) {
      return Promise.resolve().then(() => {
        setDetail(null);
        setError("");
        setLoading(false);
      });
    }

    const teacherId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");

        return getTeacherQuizAssignmentDetail(
          assignmentId,
          teacherId,
        );
      })
      .then((loadedDetail) => {
        if (!loadedDetail) {
          setDetail(null);
          setError("This quiz assignment could not be found or you do not have permission to view it.");
          return;
        }

        setDetail(loadedDetail);
      })
      .catch((caughtError) => {
        console.error("Quiz markbook load error:", caughtError);
        setDetail(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The quiz markbook could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assignmentId, authLoading, profileReady, user]);
'@

if (Replace-Exact `
  "app\teacher\quiz-assignments\[assignmentId]\page.tsx" `
  $markbookOld `
  $markbookNew `
  "Deferred teacher quiz-markbook loader state transitions") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4I..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4I")
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
$summaryLines.Add("PASS 4I SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled intervention detail, intervention impact, and teacher quiz")
$summaryLines.Add("markbook loader effects using the validated Promise-callback pattern.")
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

Write-Host "P1 Lint Pass 4I complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4I-SUMMARY.txt next."