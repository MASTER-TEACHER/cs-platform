param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parent = Split-Path -Parent $ProjectRoot
$name = Split-Path -Leaf $ProjectRoot

$backup = Join-Path $parent "$name-curriculum-final-fix2-backup-$stamp"
$summary = Join-Path $ProjectRoot "CURRICULUM-FINAL-FIX2-SUMMARY.txt"

$onboardingPath = Join-Path $ProjectRoot "app\onboarding\page.tsx"
$profilePath = Join-Path $ProjectRoot "app\profile\curriculum\page.tsx"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

function Ensure-SelectQualificationHelper {
  param(
    [Parameter(Mandatory = $true)][string]$Path
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "Required file not found: $Path"
  }

  $content = [System.IO.File]::ReadAllText($Path)

  if ($content.Contains("function selectQualification(")) {
    Write-Host "[OK] Helper already present: $Path" -ForegroundColor Green
    return
  }

  if (-not $content.Contains("getSupportedExamBoards")) {
    throw "getSupportedExamBoards import/wiring is missing in: $Path"
  }

  $pattern =
    '(?ms)(\s*const\s+\[examBoard,\s*setExamBoard\]\s*=\s*useState<ExamBoard>\("AQA"\);\s*)'

  $match =
    [System.Text.RegularExpressions.Regex]::Match(
      $content,
      $pattern
    )

  if (-not $match.Success) {
    throw "Could not locate examBoard state declaration in: $Path"
  }

  $helper = @'

  function selectQualification(
    nextQualification: Qualification,
  ) {
    const supportedBoards =
      getSupportedExamBoards(
        nextQualification,
      );

    setQualification(
      nextQualification,
    );

    if (
      !supportedBoards.includes(
        examBoard,
      )
    ) {
      setExamBoard(
        supportedBoards[0] ||
          "AQA",
      );
    }
  }

'@

  $replacement =
    $match.Groups[1].Value +
    $helper

  $updated =
    [System.Text.RegularExpressions.Regex]::Replace(
      $content,
      $pattern,
      [System.Text.RegularExpressions.MatchEvaluator]{
        param($m)
        return $replacement
      },
      1
    )

  if ($updated -eq $content) {
    throw "No helper insertion was applied to: $Path"
  }

  Backup-File -Path $Path
  Write-Utf8NoBom -Path $Path -Content $updated

  Write-Host "[FIX] Added selectQualification helper: $Path" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - CURRICULUM FINAL FIX 2" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

Ensure-SelectQualificationHelper -Path $onboardingPath
Ensure-SelectQualificationHelper -Path $profilePath

# ------------------------------------------------------------
# Verification
# ------------------------------------------------------------

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

foreach ($entry in @(
  @{
    Label = "Onboarding qualification helper"
    Path = $onboardingPath
  },
  @{
    Label = "Curriculum settings qualification helper"
    Path = $profilePath
  }
)) {
  $content = [System.IO.File]::ReadAllText($entry.Path)

  if (
    $content.Contains("function selectQualification(") -and
    $content.Contains("getSupportedExamBoards") -and
    $content.Contains("selectQualification(option.value)")
  ) {
    $checks.Add("[OK] $($entry.Label)")
  }
  else {
    $failed.Add("$($entry.Label) - helper or wiring incomplete")
  }
}

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot

try {
  Write-Host ""
  Write-Host "Running ESLint..." -ForegroundColor Cyan
  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE
  $lintStatus =
    if ($lintExit -eq 0) {
      "PASS"
    }
    else {
      "FAIL"
    }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE
  $buildStatus =
    if ($buildExit -eq 0) {
      "PASS"
    }
    else {
      "FAIL"
    }
}
finally {
  Pop-Location
}

if (
  $failed.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - CURRICULUM FINAL FIX 2")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add("Inserted the missing selectQualification helper into onboarding and")
$lines.Add("curriculum settings where required.")
$lines.Add("The helper keeps the selected exam board valid for the chosen qualification.")
$lines.Add("")
$lines.Add("VERIFICATION")
$lines.Add("------------")

foreach ($item in $checks) {
  $lines.Add($item)
}

foreach ($item in $failed) {
  $lines.Add("[FAIL] $item")
}

$lines.Add("")
$lines.Add("ESLINT")
$lines.Add("------")
$lines.Add("Status: $lintStatus")
$lines.Add("Exit code: $lintExit")
$lines.Add("")
$lines.Add("PRODUCTION BUILD")
$lines.Add("----------------")
$lines.Add("Status: $buildStatus")
$lines.Add("Exit code: $buildExit")
$lines.Add("")
$lines.Add("CURRICULUM PHASE STATUS")
$lines.Add("-----------------------")
$lines.Add($status)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""

if ($status -eq "PASS") {
  Write-Host "Curriculum status: PASS" -ForegroundColor Green
}
else {
  Write-Host "Curriculum status: NOT YET PASSED" -ForegroundColor Yellow
}