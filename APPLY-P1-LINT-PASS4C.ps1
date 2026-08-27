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

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4c-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4c-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4c-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4C-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4C" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
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
  Write-Host "[PASS4C] $Label" -ForegroundColor Green
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

Write-Host "1. Measuring lint before Pass 4C..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying safe loader-effect refactors..."
$changes = 0

# Teacher quiz assignments: do not synchronously mutate logged-out state from
# the callback invoked by useEffect. Logged-out values are derived for render.
if (Replace-Exact `
  "app\teacher\quiz-assignments\page.tsx" `
@'
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }
'@ `
@'
    if (!user?.uid) {
      return;
    }
'@ `
  "Removed synchronous logged-out quiz-assignment reset") { $changes++ }

# Teacher resource library: same logged-out guard pattern.
if (Replace-Exact `
  "app\teacher\resources\page.tsx" `
@'
    if (!currentUser) {
      setResources([]);
      setLoading(false);
      return;
    }
'@ `
@'
    if (!currentUser) {
      return;
    }
'@ `
  "Removed synchronous logged-out resource-library reset") { $changes++ }

# Resource viewer: resourceId is route-provided; when auth is absent, render
# state can be derived without writing null/loading synchronously.
if (Replace-Exact `
  "app\teacher\resources\[resourceId]\page.tsx" `
@'
    if (!currentUser || !resourceId) {
      setResource(null);
      setLoading(false);
      return;
    }
'@ `
@'
    if (!currentUser || !resourceId) {
      return;
    }
'@ `
  "Removed synchronous unauthenticated resource-viewer reset") { $changes++ }

# Existing teaching-resource selector: asynchronous load remains unchanged;
# only remove direct setters from the auth guard.
if (Replace-Exact `
  "components\teacher\assignments\ExistingTeachingResourceSelector.tsx" `
@'
    if (!user?.uid) {
      setResources([]);
      setLoading(false);

      return;
    }
'@ `
@'
    if (!user?.uid) {
      return;
    }
'@ `
  "Removed synchronous logged-out existing-resource reset") { $changes++ }

# Unified teacher assignments: logged-out empty summary is already a stable
# default; do not synchronously rewrite it from the effect-triggered loader.
if (Replace-Exact `
  "app\teacher\assignments\page.tsx" `
@'
        if (!user?.uid) {
          setSummary(
            emptySummary,
          );
          setLoading(false);
          return;
        }
'@ `
@'
        if (!user?.uid) {
          return;
        }
'@ `
  "Removed synchronous logged-out unified-assignment reset") { $changes++ }

# Knowledge map: remove direct no-user state writes. The map starts null and
# loading is only meaningful while an authenticated request can occur.
if (Replace-Exact `
  "hooks\useKnowledgeMap.ts" `
@'
    if (!user?.uid) {
      setMap(null);
      setLoading(false);
      return;
    }
'@ `
@'
    if (!user?.uid) {
      return;
    }
'@ `
  "Removed synchronous logged-out knowledge-map reset") { $changes++ }

if (Replace-Exact `
  "hooks\useKnowledgeMap.ts" `
@'
  return {
    map,
    loading: authLoading || loading,
    error,
    refresh,
  };
'@ `
@'
  return {
    map: user?.uid ? map : null,
    loading: authLoading || (Boolean(user?.uid) && loading),
    error: user?.uid ? error : "",
    refresh,
  };
'@ `
  "Derived logged-out knowledge-map return state") { $changes++ }

# Teacher intelligence/portfolio hook: remove no-role/no-user synchronous
# state writes when present; derive inaccessible state in returned values.
if (Replace-Exact `
  "hooks\useTeacherAnalyticsPortfolio.ts" `
@'
    if (!userId || role !== "teacher") {
      setPortfolio(null);
      setError("");
      setLoading(false);
      return;
    }
'@ `
@'
    if (!userId || role !== "teacher") {
      return;
    }
'@ `
  "Removed synchronous unavailable teacher-intelligence reset") { $changes++ }

if (Replace-Exact `
  "hooks\useTeacherAnalyticsPortfolio.ts" `
@'
  return {
    portfolio,
    loading: authLoading || loading,
    error,
    refresh,
  };
'@ `
@'
  return {
    portfolio: userId && role === "teacher" ? portfolio : null,
    loading: authLoading || (Boolean(userId) && role === "teacher" && loading),
    error: userId && role === "teacher" ? error : "",
    refresh,
  };
'@ `
  "Derived unavailable teacher-intelligence return state") { $changes++ }

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4C..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4C")
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
$summaryLines.Add("PASS 4C SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Handled selected non-integrity auth-guard/loader state effects.")
$summaryLines.Add("Async service and Firestore callback state updates remain intact.")
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

Write-Host "P1 Lint Pass 4C complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4C-SUMMARY.txt next."
