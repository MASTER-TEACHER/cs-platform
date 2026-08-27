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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass3b-backup-$timestamp"

$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass3b-before-$timestamp.json"
$afterReport  = Join-Path $env:TEMP "cs-master-p1-lint-pass3b-after-$timestamp.json"
$summary      = Join-Path $ProjectRoot "P1-LINT-PASS3B-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 3B" -ForegroundColor Cyan
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
  Write-Host "[PASS3B] $Label" -ForegroundColor Green
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
    Write-Host "[SKIP] $Label - file not found: $RelativePath" -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)
  $matches = [regex]::Matches(
    $content,
    $Pattern,
    [System.Text.RegularExpressions.RegexOptions]::Multiline
  )

  if ($matches.Count -ne 1) {
    Write-Host "[SKIP] $Label - expected exactly 1 match, found $($matches.Count)." -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  $updated = [regex]::Replace(
    $content,
    $Pattern,
    $Replacement,
    [System.Text.RegularExpressions.RegexOptions]::Multiline
  )
  Write-Utf8NoBom $path $updated
  Write-Host "[PASS3B] $Label" -ForegroundColor Green
  return $true
}

function Remove-ImportIdentifier(
  [string]$RelativePath,
  [string]$Identifier
) {
  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] Remove import $Identifier - file not found." -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)
  $pattern = '(?ms)^import\s+(type\s+)?\{(?<body>.*?)\}\s+from\s+(?<quote>["''])(?<module>.*?)\k<quote>;'
  $matches = [regex]::Matches($content, $pattern)

  foreach ($match in $matches) {
    $items = $match.Groups["body"].Value -split ',' |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ }

    if (-not ($items -contains $Identifier)) {
      continue
    }

    $remaining = @($items | Where-Object { $_ -ne $Identifier })

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
    Write-Host "[PASS3B] Removed import '$Identifier' from $RelativePath" -ForegroundColor Green
    return $true
  }

  Write-Host "[SKIP] Import '$Identifier' not found in $RelativePath" -ForegroundColor Yellow
  return $false
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

Write-Host "1. Measuring lint before Pass 3B..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport
Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying source-aware Pass 3B fixes..."
$changes = 0

# ---------------------------------------------------------------------------
# A. React Compiler memoization mismatches caused by callback body reading
# the full Firebase user object while dependency arrays track only user?.uid.
# The compiler explicitly reports `user` as the inferred dependency.
# Expanding the dependency to `user` preserves callback semantics.
# ---------------------------------------------------------------------------

$depFixes = @(
  @("app\assignments\programming\page.tsx",
    '}, [user?.uid]);',
    '}, [user]);',
    "Aligned programming assignment callback dependency with compiler-inferred user"),
  @("app\teacher\assignments\[assignmentId]\page.tsx",
    '}, [assignmentId, user?.uid]);',
    '}, [assignmentId, user]);',
    "Aligned teacher assignment detail callback dependency"),
  @("app\teacher\programming-assignments\page.tsx",
    '}, [user?.uid]);',
    '}, [user]);',
    "Aligned programming assignments callback dependency"),
  @("app\teacher\quiz-assignments\[assignmentId]\page.tsx",
    '}, [assignmentId, authLoading, profileReady, user?.uid]);',
    '}, [assignmentId, authLoading, profileReady, user]);',
    "Aligned quiz markbook callback dependency"),
  @("app\teacher\quiz-assignments\page.tsx",
    '}, [user?.uid]);',
    '}, [user]);',
    "Aligned quiz assignments callback dependency"),
  @("app\teacher\students\[studentId]\page.tsx",
    '}, [studentId, user?.uid]);',
    '}, [studentId, user]);',
    "Aligned student analytics callback dependency")
)

foreach ($fix in $depFixes) {
  if (Replace-Exact $fix[0] $fix[1] $fix[2] $fix[3]) { $changes++ }
}

# Special multi-line callback dependency in teacher assignments list.
if (Replace-Exact `
    "app\teacher\assignments\page.tsx" `
    "      [user?.uid],`r`n    );" `
    "      [user],`r`n    );" `
    "Aligned teacher assignments list callback dependency") {
  $changes++
}
elseif (Replace-Exact `
    "app\teacher\assignments\page.tsx" `
    "      [user?.uid],`n    );" `
    "      [user],`n    );" `
    "Aligned teacher assignments list callback dependency") {
  $changes++
}

# ---------------------------------------------------------------------------
# B. Cheap curriculum lookup memoization is unnecessary on Learn/Visualisers.
# Remove useMemo rather than fighting React Compiler dependency inference.
# ---------------------------------------------------------------------------

$coveragePattern = '(?ms)  const coverage = useMemo\(\(\) => \{\r?\n    if \(\r?\n      !profile\?\.qualification \|\|\r?\n      !profile\.examBoard\r?\n    \) \{\r?\n      return null;\r?\n    \}\r?\n\r?\n    return getCurriculumCoverage\(\r?\n      profile\.qualification,\r?\n      profile\.examBoard,\r?\n    \);\r?\n  \}, \[\r?\n    profile\?\.qualification,\r?\n    profile\?\.examBoard,\r?\n  \]\);'

$coverageReplacement = @'
  const coverage =
    profile?.qualification && profile.examBoard
      ? getCurriculumCoverage(
          profile.qualification,
          profile.examBoard,
        )
      : null;
'@

foreach ($page in @("app\learn\page.tsx", "app\visualisers\page.tsx")) {
  if (Replace-RegexOnce `
      $page `
      $coveragePattern `
      $coverageReplacement `
      "Removed unnecessary curriculum useMemo in $page") {
    $changes++
    if (Remove-ImportIdentifier $page "useMemo") { $changes++ }
  }
}

# ---------------------------------------------------------------------------
# C. CyberSecurityScenarioSimulator: replace render-time Math.random ordering
# with stable question-derived ordering. This avoids an impure render call
# and also stops answer order changing merely because the component re-renders.
# ---------------------------------------------------------------------------

$cyberOld = @'
    return Math.random() > 0.5 ? [safe, unsafe] : [unsafe, safe];
'@

$cyberNew = @'
    const orderKey = `${simulator.question.safe}|${simulator.question.unsafe}`
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);

    return orderKey % 2 === 0 ? [safe, unsafe] : [unsafe, safe];
'@

if (Replace-Exact `
    "components\Simulators\CyberSecurityScenarioSimulator.tsx" `
    $cyberOld `
    $cyberNew `
    "Replaced render-time Math.random with stable question-derived ordering") {
  $changes++
}

Write-Host ""
Write-Host "   Applied changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 3B..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 3B")
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
$summaryLines.Add("Pass 3B intentionally does not auto-fix ambiguous unused variables,")
$summaryLines.Add("effect dependency warnings, ReviewSchedule Date.now purity, or")
$summaryLines.Add("react-hooks/set-state-in-effect. Those require source-specific refactors.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 3B complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS3B-SUMMARY.txt next."