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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass3-backup-$timestamp"

$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass3-before-$timestamp.json"
$afterReport  = Join-Path $env:TEMP "cs-master-p1-lint-pass3-after-$timestamp.json"
$summary      = Join-Path $ProjectRoot "P1-LINT-PASS3-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 3" -ForegroundColor Cyan
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
  if ([string]::IsNullOrWhiteSpace($FullPath)) {
    throw "Backup-File received an empty path."
  }

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
    Write-Host "[SKIP] $Label - exact target already absent or source changed." -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  $updated = $content.Replace($OldText, $NewText)
  Write-Utf8NoBom $path $updated

  Write-Host "[PASS3] $Label" -ForegroundColor Green
  return $true
}

function Remove-ImportIdentifier(
  [string]$RelativePath,
  [string]$Identifier
) {
  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] Remove unused import $Identifier - file not found: $RelativePath" -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)

  # Only inspect ES import declarations. This deliberately refuses to touch
  # arbitrary occurrences of the identifier elsewhere in the file.
  $pattern = '(?ms)^import\s+(type\s+)?\{(?<body>.*?)\}\s+from\s+(?<quote>["''])(?<module>.*?)\k<quote>;'
  $matches = [regex]::Matches($content, $pattern)

  foreach ($match in $matches) {
    $body = $match.Groups["body"].Value
    $items = $body -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }

    $target = $items | Where-Object {
      $_ -eq $Identifier -or
      $_ -match ("^" + [regex]::Escape($Identifier) + "\s+as\s+\w+$")
    }

    if (-not $target) {
      continue
    }

    $remaining = @($items | Where-Object {
      -not (
        $_ -eq $Identifier -or
        $_ -match ("^" + [regex]::Escape($Identifier) + "\s+as\s+\w+$")
      )
    })

    if ($remaining.Count -eq 0) {
      $replacement = ""
    }
    else {
      $prefix = if ($match.Groups[1].Success) { "type " } else { "" }
      $module = $match.Groups["module"].Value
      $replacement = "import $prefix{ " + ($remaining -join ", ") + " } from `"$module`";"
    }

    Backup-File $path
    $updated = $content.Substring(0, $match.Index) +
      $replacement +
      $content.Substring($match.Index + $match.Length)

    Write-Utf8NoBom $path $updated
    Write-Host "[PASS3] Removed unused import '$Identifier' from $RelativePath" -ForegroundColor Green
    return $true
  }

  Write-Host "[SKIP] Unused import '$Identifier' target not found in $RelativePath" -ForegroundColor Yellow
  return $false
}

function Invoke-EslintJson([string]$OutputPath) {
  if (Test-Path -LiteralPath $OutputPath) {
    Remove-Item -LiteralPath $OutputPath -Force
  }

  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$OutputPath"
    $exitCode = $LASTEXITCODE
  }
  finally {
    Pop-Location
  }

  if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
    throw "ESLint did not create the expected JSON report: $OutputPath"
  }

  return $exitCode
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

Write-Host "1. Measuring lint before Pass 3..."
$null = Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying conservative source-aware fixes..."

$changes = 0

# ---------------------------------------------------------------------------
# A. Safe unused imports identified in the Pass 2/Pass 3 lint inventory.
# These edits only modify import declarations and will skip if the exact
# identifier is no longer imported.
# ---------------------------------------------------------------------------
$unusedImports = @(
  @("app\resources\[resourceId]\page.tsx", "Loader2"),
  @("app\teacher\analytics\page.tsx", "BookOpenCheck"),
  @("app\teacher\quiz-assignments\page.tsx", "Clock3"),
  @("app\teacher\resources\[resourceId]\page.tsx", "Loader2"),
  @("app\teacher\students\[studentId]\page.tsx", "School"),
  @("components\exam-trainer\ExamQuestionTrainer.tsx", "ExamTrainerAnswer"),
  @("components\exam-trainer\ExamQuestionTrainer.tsx", "ExamTrainerQuestion"),
  @("components\Simulators\CaesarCipherSimulator.tsx", "useMemo"),
  @("components\Simulators\LogicGateSimulator.tsx", "useCallback"),
  @("services\examSubmissionService.ts", "ExamIntegrityPolicy"),
  @("services\quizService.ts", "setDoc")
)

foreach ($entry in $unusedImports) {
  if (Remove-ImportIdentifier $entry[0] $entry[1]) {
    $changes++
  }
}

# ---------------------------------------------------------------------------
# B. Learn page: this memoized lookup is a cheap synchronous lookup and does
# not need manual memoization. Removing useMemo avoids the React compiler's
# preserve-manual-memoization complaint without changing the returned value.
# ---------------------------------------------------------------------------
if (Remove-ImportIdentifier "app\learn\page.tsx" "useMemo") {
  $changes++
}

$learnOld = @'
  const coverage = useMemo(() => {
    if (
      !profile?.qualification ||
      !profile.examBoard
    ) {
      return null;
    }

    return getCurriculumCoverage(
      profile.qualification,
      profile.examBoard,
    );
  }, [
    profile?.qualification,
    profile?.examBoard,
  ]);
'@

$learnNew = @'
  const coverage =
    profile?.qualification && profile.examBoard
      ? getCurriculumCoverage(
          profile.qualification,
          profile.examBoard,
        )
      : null;
'@

if (Replace-Exact `
    "app\learn\page.tsx" `
    $learnOld `
    $learnNew `
    "Removed unnecessary LearnPage manual memoization") {
  $changes++
}

# ---------------------------------------------------------------------------
# C. QuizPlayer: do not read integrityTerminatedRef.current during render.
# The ref remains available to async save logic for immediate termination
# semantics; rendered XP derives from React state.
# ---------------------------------------------------------------------------
$quizOld = @'
  const awardedXP =
    integrityTerminated || integrityTerminatedRef.current
      ? 0
      : earnedXP;
'@

$quizNew = @'
  const awardedXP = integrityTerminated ? 0 : earnedXP;
'@

if (Replace-Exact `
    "components\quiz\QuizPlayer.tsx" `
    $quizOld `
    $quizNew `
    "Removed render-time integrity ref read from QuizPlayer") {
  $changes++
}

# ---------------------------------------------------------------------------
# D. useSimulator: questionSequenceRef starts at 1. Reading .current while
# rendering only to obtain that initial literal value is unnecessary.
# ---------------------------------------------------------------------------
$simOld = @'
  const initialQuestionId =
    getQuestionId?.(initialQuestion, "foundation") ??
    createSessionQuestionId(simulatorId, questionSequenceRef.current);
'@

$simNew = @'
  const initialQuestionId =
    getQuestionId?.(initialQuestion, "foundation") ??
    createSessionQuestionId(simulatorId, 1);
'@

if (Replace-Exact `
    "components\Simulators\common\useSimulator.tsx" `
    $simOld `
    $simNew `
    "Removed render-time questionSequenceRef read") {
  $changes++
}

# ---------------------------------------------------------------------------
# E. Teacher intelligence: use primitive auth values inside the callback.
# This helps React Compiler preserve the manual callback memoization because
# the callback now references exactly the values in its dependency list.
# ---------------------------------------------------------------------------
$teacherOld1 = @'
  const { user, profile, loading: authLoading } = useAuth();

  const [portfolio, setPortfolio] =
'@

$teacherNew1 = @'
  const { user, profile, loading: authLoading } = useAuth();
  const userId = user?.uid;
  const role = profile?.role;

  const [portfolio, setPortfolio] =
'@

if (Replace-Exact `
    "hooks\useTeacherIntelligence.ts" `
    $teacherOld1 `
    $teacherNew1 `
    "Added stable primitive auth values to useTeacherIntelligence") {
  $changes++
}

$teacherOld2 = @'
      !user?.uid ||
      (profile?.role !== "teacher" && profile?.role !== "admin")
'@

$teacherNew2 = @'
      !userId ||
      (role !== "teacher" && role !== "admin")
'@

if (Replace-Exact `
    "hooks\useTeacherIntelligence.ts" `
    $teacherOld2 `
    $teacherNew2 `
    "Updated useTeacherIntelligence role/user guard") {
  $changes++
}

$teacherOld3 = '      const result = await getTeacherAnalyticsPortfolio(user.uid);'
$teacherNew3 = '      const result = await getTeacherAnalyticsPortfolio(userId);'

if (Replace-Exact `
    "hooks\useTeacherIntelligence.ts" `
    $teacherOld3 `
    $teacherNew3 `
    "Updated teacher analytics request to stable userId") {
  $changes++
}

$teacherOld4 = '  }, [profile?.role, user?.uid]);'
$teacherNew4 = '  }, [role, userId]);'

if (Replace-Exact `
    "hooks\useTeacherIntelligence.ts" `
    $teacherOld4 `
    $teacherNew4 `
    "Aligned useTeacherIntelligence callback dependencies") {
  $changes++
}

Write-Host ""
Write-Host "   Applied changes: $changes"
Write-Host ""

Write-Host "3. Measuring lint after Pass 3..."
$null = Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 3")
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

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 3 complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS3-SUMMARY.txt next."