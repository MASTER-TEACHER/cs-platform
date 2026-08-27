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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4a-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4a-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4a-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4A-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4A" -ForegroundColor Cyan
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
  $resolvedFullPath = (Resolve-Path -LiteralPath $FullPath -ErrorAction Stop).Path
  $rootWithSeparator = $ProjectRoot + "\"

  if (-not $resolvedFullPath.StartsWith(
      $rootWithSeparator,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
    throw "Refusing to back up a file outside the project root: $resolvedFullPath"
  }

  $relative = $resolvedFullPath.Substring($rootWithSeparator.Length)
  $destination = Join-Path -Path $backup -ChildPath $relative
  $parent = Split-Path -Parent $destination

  if (-not [string]::IsNullOrWhiteSpace($parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $destination -PathType Leaf)) {
    Copy-Item -LiteralPath $resolvedFullPath -Destination $destination -Force
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
    Write-Host "[SKIP] $Label - file not found: $RelativePath" -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)

  if (-not $content.Contains($OldText)) {
    Write-Host "[SKIP] $Label - exact target absent/source changed." -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  Write-Utf8NoBom $path ($content.Replace($OldText, $NewText))

  Write-Host "[PASS4A] $Label" -ForegroundColor Green
  return $true
}

function Invoke-EslintJson([string]$OutputPath) {
  if (Test-Path -LiteralPath $OutputPath) {
    Remove-Item -LiteralPath $OutputPath -Force
  }

  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$OutputPath"
    $null = $LASTEXITCODE
  }
  finally {
    Pop-Location
  }

  if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
    throw "ESLint did not create the expected JSON report: $OutputPath"
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

      $rule = if ($message.ruleId) { [string]$message.ruleId } else { "(parser)" }

      if (-not $rules.ContainsKey($rule)) {
        $rules[$rule] = 0
      }

      $rules[$rule]++
    }
  }

  return [PSCustomObject]@{
    ProblemFiles = $problemFiles
    Errors = $errors
    Warnings = $warnings
    Rules = $rules
  }
}

Write-Host "1. Measuring lint before Pass 4A..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying low-risk effect-state refactors..."
$changes = 0

# ===========================================================================
# A. ADMIN DASHBOARD
# Non-admin UI state is derived from isAdmin. Firestore state updates remain
# inside onSnapshot callbacks, which is the intended effect/subscription model.
# ===========================================================================
if (Replace-Exact `
    "app\admin\page.tsx" `
    @'
    if (!isAdmin) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }
'@ `
    @'
    if (!isAdmin) {
      return;
    }
'@ `
    "Removed synchronous non-admin request-state reset") {
  $changes++
}

if (Replace-Exact `
    "app\admin\page.tsx" `
    '  if (profileLoading || loadingRequests) {' `
    '  if (profileLoading || (isAdmin && loadingRequests)) {' `
    "Derived admin request loading state from authorization") {
  $changes++
}

# ===========================================================================
# B. ADMIN TEACHER DIRECTORY
# ===========================================================================
if (Replace-Exact `
    "app\admin\teachers\page.tsx" `
    @'
    if (!isAdmin) {
      setTeachers([]);
      setLoadingTeachers(false);
      return;
    }
'@ `
    @'
    if (!isAdmin) {
      return;
    }
'@ `
    "Removed synchronous non-admin teacher-list reset") {
  $changes++
}

if (Replace-Exact `
    "app\admin\teachers\page.tsx" `
    '  if (profileLoading || loadingTeachers) {' `
    '  if (profileLoading || (isAdmin && loadingTeachers)) {' `
    "Derived teacher-directory loading state from authorization") {
  $changes++
}

# ===========================================================================
# C. ADMIN TEACHER DETAIL
# ===========================================================================
if (Replace-Exact `
    "app\admin\teachers\[teacherId]\page.tsx" `
    @'
    if (!isAdmin) {
      setLoading(false);
      return;
    }
'@ `
    @'
    if (!isAdmin) {
      return;
    }
'@ `
    "Removed synchronous non-admin teacher-detail loading reset") {
  $changes++
}

if (Replace-Exact `
    "app\admin\teachers\[teacherId]\page.tsx" `
    '  if (profileLoading || loading) {' `
    '  if (profileLoading || (isAdmin && loading)) {' `
    "Derived teacher-detail loading state from authorization") {
  $changes++
}

# ===========================================================================
# D. PROTECTED ROUTE
# checked is fully derivable from auth loading + user.
# ===========================================================================
if (Replace-Exact `
    "components\auth\ProtectedRoute.tsx" `
    'import { useEffect, useState } from "react";' `
    'import { useEffect } from "react";' `
    "Removed ProtectedRoute useState import") {
  $changes++
}

if (Replace-Exact `
    "components\auth\ProtectedRoute.tsx" `
    @'
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [user, loading, router]);

  if (loading || !checked) {
'@ `
    @'
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
'@ `
    "Derived ProtectedRoute checked state from authentication") {
  $changes++
}

# ===========================================================================
# E. TARGET GRADE CONTROL
# Reset the draft when editing starts/cancels instead of synchronizing props to
# state on every value change via an effect.
# ===========================================================================
if (Replace-Exact `
    "components\teacher\analytics\TargetGradeControl.tsx" `
    @'
import {
  useEffect,
  useState,
} from "react";
'@ `
    @'
import {
  useState,
} from "react";
'@ `
    "Removed TargetGradeControl useEffect import") {
  $changes++
}

if (Replace-Exact `
    "components\teacher\analytics\TargetGradeControl.tsx" `
    @'
  useEffect(() => {
    setSelected(
      value || "",
    );
  }, [value]);

  function cancel() {
'@ `
    @'
  function beginEditing() {
    setSelected(
      value || "",
    );

    setEditing(true);
  }

  function cancel() {
'@ `
    "Moved target-grade draft reset to edit action") {
  $changes++
}

if (Replace-Exact `
    "components\teacher\analytics\TargetGradeControl.tsx" `
    @'
          onClick={() =>
            setEditing(true)
          }
'@ `
    @'
          onClick={beginEditing}
'@ `
    "Connected target-grade edit button to draft initializer") {
  $changes++
}

# ===========================================================================
# F. CLASS REPORT PAGINATION
# Reset page at the user actions that change the search/page-size rather than
# running a synchronous reset effect after render.
# ===========================================================================
if (Replace-Exact `
    "components\teacher\reports\ClassProgressReportPanel.tsx" `
    @'
  useEffect(() => {
    setExamPage(1);
  }, [examSearch, examPageSize]);

'@ `
    "" `
    "Removed report pagination reset effect") {
  $changes++
}

if (Replace-Exact `
    "components\teacher\reports\ClassProgressReportPanel.tsx" `
    '                    onChange={(event) => setExamSearch(event.target.value)}' `
    @'
                    onChange={(event) => {
                      setExamSearch(event.target.value);
                      setExamPage(1);
                    }}
'@ `
    "Reset report page directly when search changes") {
  $changes++
}

if (Replace-Exact `
    "components\teacher\reports\ClassProgressReportPanel.tsx" `
    @'
                  onChange={(event) =>
                    setExamPageSize(Number(event.target.value))
                  }
'@ `
    @'
                  onChange={(event) => {
                    setExamPageSize(Number(event.target.value));
                    setExamPage(1);
                  }}
'@ `
    "Reset report page directly when page size changes") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4A..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4A")
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
$summaryLines.Add("PASS 4A SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled low-risk derived/reset state effects only.")
$summaryLines.Add("Did not modify exam integrity, fullscreen, visibility, countdown,")
$summaryLines.Add("auto-submit, quiz timer, or incident logging behaviour.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4A complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4A-SUMMARY.txt next."