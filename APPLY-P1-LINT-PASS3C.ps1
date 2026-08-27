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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass3c-backup-$timestamp"

$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass3c-before-$timestamp.json"
$afterReport  = Join-Path $env:TEMP "cs-master-p1-lint-pass3c-after-$timestamp.json"
$summary      = Join-Path $ProjectRoot "P1-LINT-PASS3C-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 3C" -ForegroundColor Cyan
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
    throw "Refusing to back up a file outside project root: $resolvedFullPath"
  }

  $relative = $resolvedFullPath.Substring($rootWithSeparator.Length)
  $destination = Join-Path $backup $relative
  $parent = Split-Path -Parent $destination

  if ($parent) {
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
    Write-Host "[SKIP] $Label - file missing" -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)

  if (-not $content.Contains($OldText)) {
    Write-Host "[SKIP] $Label - exact target absent/source changed" -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  Write-Utf8NoBom $path ($content.Replace($OldText, $NewText))
  Write-Host "[PASS3C] $Label" -ForegroundColor Green
  return $true
}

function Replace-RegexOnce(
  [string]$RelativePath,
  [string]$Pattern,
  [string]$Replacement,
  [string]$Label
) {
  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] $Label - file missing" -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)
  $options = [System.Text.RegularExpressions.RegexOptions]::Multiline
  $matches = [regex]::Matches($content, $Pattern, $options)

  if ($matches.Count -ne 1) {
    Write-Host "[SKIP] $Label - expected 1 match, found $($matches.Count)" -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  $updated = [regex]::Replace($content, $Pattern, $Replacement, $options)
  Write-Utf8NoBom $path $updated
  Write-Host "[PASS3C] $Label" -ForegroundColor Green
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
    throw "ESLint did not create JSON report: $OutputPath"
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

Write-Host "1. Measuring lint before Pass 3C..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative Pass 3C fixes..."
$changes = 0

# ---------------------------------------------------------------------------
# UNUSED VARIABLES
# ---------------------------------------------------------------------------

# Unused wrapper function: specificExplanation is used directly elsewhere.
$old = @'
function explanationForTopic(topic: string): string {
  return specificExplanation(topic);
}


'@
if (Replace-Exact `
    "app\api\ai\generate-exam-questions\route.ts" `
    $old `
    "" `
    "Removed unused explanationForTopic wrapper") { $changes++ }

# Bubble sort: calculated but never consumed.
$old = @'
  const shouldSwap =
    currentLeft !== undefined &&
    currentRight !== undefined &&
    currentLeft > currentRight;

'@
if (Replace-Exact `
    "components\Simulators\BubbleSortSimulator.tsx" `
    $old `
    "" `
    "Removed unused BubbleSort shouldSwap calculation") { $changes++ }

# Merge sort: only the setter is consumed.
if (Replace-Exact `
    "components\Simulators\MergeSortSimulator.tsx" `
    '  const [mergeQueue, setMergeQueue] = useState<MergeGroup[][]>([]);' `
    '  const [, setMergeQueue] = useState<MergeGroup[][]>([]);' `
    "Removed unused MergeSort mergeQueue binding while retaining setter") { $changes++ }

# Editable preview keeps onChange in its public prop type but does not destructure
# an unused local binding.
if (Replace-Exact `
    "components\teacher\EditableQuizPreview.tsx" `
    "  onChange,`r`n  onSave," `
    "  onSave," `
    "Removed unused EditableQuizPreview onChange local binding") { $changes++ }
elseif (Replace-Exact `
    "components\teacher\EditableQuizPreview.tsx" `
    "  onChange,`n  onSave," `
    "  onSave," `
    "Removed unused EditableQuizPreview onChange local binding") { $changes++ }

# useStudents: omit role using a key-filter projection rather than an unused
# destructuring binding.
$old = '.map(({ role, ...student }) => student);'
$new = @'
.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            xp: student.xp,
            streak: student.streak,
            badges: student.badges,
            completedLessons: student.completedLessons,
          }));
'@.TrimEnd()

if (Replace-Exact `
    "hooks\useStudents.ts" `
    $old `
    $new `
    "Removed temporary role field without unused destructuring") { $changes++ }

# teacherDashboardService: same approach for hasResults.
$old = '.map(({ hasResults: _hasResults, ...student }) => student);'
$new = @'
.map((student) => ({
      id: student.id,
      name: student.name,
      weakTopic: student.weakTopic,
      averageScore: student.averageScore,
      recommendedAction: student.recommendedAction,
    }));
'@.TrimEnd()

if (Replace-Exact `
    "services\teacherDashboardService.ts" `
    $old `
    $new `
    "Removed temporary hasResults field without unused destructuring") { $changes++ }

# StudentsTab is a complete unused helper. Remove only if exactly one function
# block is found before the next top-level function declaration.
$studentsTabPattern = '(?ms)^function StudentsTab\(\{ students \}: \{ students: ClassStudent\[\] \}\) \{.*?^\}\r?\n(?=\r?\nfunction )'
if (Replace-RegexOnce `
    "app\teacher\classes\[classId]\page.tsx" `
    $studentsTabPattern `
    "" `
    "Removed unused StudentsTab helper") { $changes++ }

# ---------------------------------------------------------------------------
# EXHAUSTIVE DEPS - stable callbacks / primitive IDs
# ---------------------------------------------------------------------------

# Revision plan: stabilize load with useCallback around userId.
if (Replace-Exact `
    "app\revision-plan\page.tsx" `
    'import { useEffect, useState } from "react";' `
    'import { useCallback, useEffect, useState } from "react";' `
    "Added useCallback import to RevisionPlan") { $changes++ }

$old = @'
  const { user } = useAuth();
  const [items, setItems] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    if (!user?.uid) return;
    setLoading(true);
    try {
      setItems(await getStudentInterventions(user.uid));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [user?.uid]);
'@
$new = @'
  const { user } = useAuth();
  const userId = user?.uid;
  const [items, setItems] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setItems(await getStudentInterventions(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);
'@
if (Replace-Exact `
    "app\revision-plan\page.tsx" `
    $old `
    $new `
    "Stabilized RevisionPlan load dependency") { $changes++ }

# Adaptive learning and knowledge map: useCallback for refresh.
foreach ($hook in @(
  @("hooks\useAdaptiveLearning.ts", "getAdaptiveLearningPlan", "plan", "setPlan"),
  @("hooks\useKnowledgeMap.ts", "getKnowledgeMap", "map", "setMap")
)) {
  $file = $hook[0]

  if (Replace-Exact `
      $file `
      'import { useEffect, useState } from "react";' `
      'import { useCallback, useEffect, useState } from "react";' `
      "Added useCallback import to $file") { $changes++ }

  $path = Join-Path $ProjectRoot $file
  if (Test-Path -LiteralPath $path) {
    $content = [System.IO.File]::ReadAllText($path)

    # Convert function declaration to memoized callback.
    if ($content.Contains("  async function refresh() {")) {
      Backup-File $path
      $content = $content.Replace(
        "  async function refresh() {",
        "  const refresh = useCallback(async () => {"
      )

      # The first standalone closing brace immediately before useEffect is the
      # refresh terminator in these two compact hooks.
      $content = [regex]::Replace(
        $content,
        '(?ms)^  \}\r?\n\r?\n  useEffect\(\(\) => \{',
        "  }, [user]);`r`n`r`n  useEffect(() => {",
        1
      )

      $content = $content.Replace(
        "  }, [authLoading, user?.uid]);",
        "  }, [authLoading, refresh]);"
      )

      Write-Utf8NoBom $path $content
      Write-Host "[PASS3C] Stabilized refresh callback in $file" -ForegroundColor Green
      $changes++
    }
  }
}

# Student adaptive analytics and teacher dashboard: ESLint inferred full user
# because the effect reads user. Track the same dependency React sees.
foreach ($file in @(
  "hooks\useStudentAdaptiveAnalytics.ts",
  "hooks\useTeacherDashboard.ts"
)) {
  if (Replace-Exact `
      $file `
      '  }, [authLoading, user?.uid]);' `
      '  }, [authLoading, user]);' `
      "Aligned full-user effect dependency in $file") { $changes++ }
}

Write-Host ""
Write-Host "   Applied changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 3C..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 3C")
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
$summaryLines.Add("NOTE")
$summaryLines.Add("----")
$summaryLines.Add("Pass 3C intentionally leaves ReviewSchedule purity plus exam-integrity")
$summaryLines.Add("and other effect warnings that overlap directly with set-state-in-effect.")
$summaryLines.Add("Those should be refactored together in Pass 4 rather than patched twice.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 3C complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS3C-SUMMARY.txt next."