param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")

$summary = Join-Path $ProjectRoot "CURRICULUM-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "CURRICULUM-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - CURRICULUM FINALISATION + EXAM-BOARD QA" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

# ------------------------------------------------------------
# 1. Core curriculum architecture inventory
# ------------------------------------------------------------

$expected = @(
  "data\curriculum\curriculumRegistry.ts",
  "data\curriculum\topics\index.ts",
  "types\curriculum\index.ts",
  "app\learn\page.tsx",
  "app\learn\[topicId]\page.tsx",
  "app\profile\curriculum\page.tsx",
  "app\onboarding\page.tsx"
)

$inventory = New-Object System.Collections.Generic.List[string]
$missing = New-Object System.Collections.Generic.List[string]

foreach ($relative in $expected) {
  $full = Join-Path $ProjectRoot $relative

  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $inventory.Add("[OK] $relative")
  }
  else {
    $inventory.Add("[MISSING] $relative")
    $missing.Add($relative)
  }
}

# ------------------------------------------------------------
# 2. Discover curriculum-related source files
# ------------------------------------------------------------

$roots = @(
  "data\curriculum",
  "types\curriculum",
  "app\learn",
  "app\profile\curriculum",
  "app\onboarding",
  "components\lesson",
  "components\curriculum",
  "services"
)

$files = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $roots) {
  $root = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  $candidateFiles =
    if (Test-Path -LiteralPath $root -PathType Container) {
      @(Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx)
    }
    else {
      @(Get-Item -LiteralPath $root)
    }

  foreach ($file in $candidateFiles) {
    $relative =
      $file.FullName.Substring(
        $ProjectRoot.Length
      ).TrimStart("\")

    $lower = $relative.ToLowerInvariant()

    if (
      $lower.Contains("curriculum") -or
      $lower.Contains("topic") -or
      $lower.Contains("qualification") -or
      $lower.Contains("examboard") -or
      $lower.Contains("exam-board") -or
      $lower.Contains("onboarding") -or
      $lower.Contains("learn")
    ) {
      if (-not $files.Contains($relative)) {
        $files.Add($relative)
      }
    }
  }
}

$files = @($files | Sort-Object)

# ------------------------------------------------------------
# 3. Board / qualification implementation signals
# ------------------------------------------------------------

$boardSignals = [ordered]@{
  "AQA" = "aqa"
  "OCR" = "ocr"
  "Pearson Edexcel" = "edexcel"
  "GCSE" = "gcse"
  "A Level" = "a level"
}

$signalResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $boardSignals.GetEnumerator()) {
  $found = New-Object System.Collections.Generic.List[string]

  foreach ($relative in $files) {
    $full = Join-Path $ProjectRoot $relative
    $content = [System.IO.File]::ReadAllText($full).ToLowerInvariant()

    if ($content.Contains($entry.Value.ToLowerInvariant())) {
      $found.Add($relative)
    }
  }

  if ($found.Count -gt 0) {
    $signalResults.Add(
      "[OK] $($entry.Key) - detected in $($found.Count) file(s)"
    )
  }
  else {
    $signalResults.Add(
      "[MISSING SIGNAL] $($entry.Key)"
    )
  }
}

# ------------------------------------------------------------
# 4. Curriculum workflow signals
# ------------------------------------------------------------

$workflowSignals = [ordered]@{
  "Qualification selection" = @(
    "qualification"
  )
  "Exam-board selection" = @(
    "examboard"
  )
  "Curriculum registry" = @(
    "curriculumregistry"
  )
  "Topic routing" = @(
    "topicid"
  )
  "Lesson collection" = @(
    "lessons"
  )
  "Difficulty metadata" = @(
    "difficulty"
  )
  "Estimated time metadata" = @(
    "estimatedtime"
  )
}

$workflowResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $workflowSignals.GetEnumerator()) {
  $found = $false

  foreach ($relative in $files) {
    $full = Join-Path $ProjectRoot $relative
    $content = [System.IO.File]::ReadAllText($full).ToLowerInvariant()

    foreach ($needle in $entry.Value) {
      if ($content.Contains($needle.ToLowerInvariant())) {
        $found = $true
        break
      }
    }

    if ($found) {
      break
    }
  }

  if ($found) {
    $workflowResults.Add("[OK] $($entry.Key)")
  }
  else {
    $workflowResults.Add("[MISSING SIGNAL] $($entry.Key)")
  }
}

# ------------------------------------------------------------
# 5. Cross-feature curriculum integration signals
# ------------------------------------------------------------

$integrationTargets = [ordered]@{
  "Quiz integration" = @(
    "services\quizAssignmentService.ts",
    "components\quiz\QuizPlayer.tsx",
    "app\quiz\page.tsx"
  )
  "Exam integration" = @(
    "services\examAssignmentService.ts",
    "app\exam\page.tsx"
  )
  "Programming integration" = @(
    "services\programmingChallengeService.ts",
    "app\programming\page.tsx"
  )
  "Adaptive integration" = @(
    "services\adaptiveRecommendationService.ts",
    "services\adaptiveLearningService.ts"
  )
}

$integrationResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $integrationTargets.GetEnumerator()) {
  $present = @()

  foreach ($relative in $entry.Value) {
    if (Test-Path -LiteralPath (Join-Path $ProjectRoot $relative) -PathType Leaf) {
      $present += $relative
    }
  }

  if ($present.Count -gt 0) {
    $integrationResults.Add(
      "[OK] $($entry.Key) - $($present.Count) source(s) present"
    )
  }
  else {
    $integrationResults.Add(
      "[MISSING SIGNAL] $($entry.Key)"
    )
  }
}

# ------------------------------------------------------------
# 6. Source-level curriculum data QA
# ------------------------------------------------------------

$qaResults = New-Object System.Collections.Generic.List[string]
$qaWarnings = New-Object System.Collections.Generic.List[string]

$curriculumRoot = Join-Path $ProjectRoot "data\curriculum"

if (Test-Path -LiteralPath $curriculumRoot -PathType Container) {
  $topicFiles = @(
    Get-ChildItem -LiteralPath $curriculumRoot -Recurse -File -Include *.ts |
      Where-Object {
        $_.FullName -notlike "*\index.ts"
      }
  )

  $qaResults.Add(
    "[OK] Curriculum TypeScript files discovered: $($topicFiles.Count)"
  )

  $emptyTopicFiles = @()

  foreach ($file in $topicFiles) {
    $text = [System.IO.File]::ReadAllText($file.FullName)

    if ($text.Trim().Length -lt 20) {
      $emptyTopicFiles +=
        $file.FullName.Substring(
          $ProjectRoot.Length
        ).TrimStart("\")
    }
  }

  if ($emptyTopicFiles.Count -eq 0) {
    $qaResults.Add(
      "[OK] No obviously empty curriculum source files"
    )
  }
  else {
    foreach ($item in $emptyTopicFiles) {
      $qaWarnings.Add(
        "Very small/empty curriculum file: $item"
      )
    }
  }
}
else {
  $qaWarnings.Add(
    "data\curriculum folder was not found"
  )
}

# ------------------------------------------------------------
# 7. Genuine unfinished marker scan
# ------------------------------------------------------------

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "temporary placeholder"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $markerPatterns) {
    $matches = Select-String `
      -LiteralPath $full `
      -SimpleMatch `
      -Pattern $pattern `
      -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $markers.Add(
        "${relative}:$($match.LineNumber): $($match.Line.Trim())"
      )
    }
  }
}

# ------------------------------------------------------------
# 8. Build source bundle
# ------------------------------------------------------------

$bundleFiles = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  if (-not $bundleFiles.Contains($relative)) {
    $bundleFiles.Add($relative)
  }
}

foreach ($entry in $integrationTargets.GetEnumerator()) {
  foreach ($relative in $entry.Value) {
    $full = Join-Path $ProjectRoot $relative

    if (
      (Test-Path -LiteralPath $full -PathType Leaf) -and
      (-not $bundleFiles.Contains($relative))
    ) {
      $bundleFiles.Add($relative)
    }
  }
}

$bundleFiles = @($bundleFiles | Sort-Object)

$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add(
  "CS MASTER - CURRICULUM FINAL MASTER SOURCE BUNDLE"
)
$bundleLines.Add(
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)
$bundleLines.Add(
  "Project: $ProjectRoot"
)
$bundleLines.Add(
  "Files: $($bundleFiles.Count)"
)

foreach ($relative in $bundleFiles) {
  $full = Join-Path $ProjectRoot $relative

  $bundleLines.Add("")
  $bundleLines.Add("=" * 110)
  $bundleLines.Add("FILE: $relative")
  $bundleLines.Add("=" * 110)

  $lineNumber = 1

  foreach ($line in Get-Content -LiteralPath $full) {
    $bundleLines.Add(
      ("{0,5}: {1}" -f $lineNumber, $line)
    )
    $lineNumber++
  }
}

[System.IO.File]::WriteAllLines(
  $bundle,
  $bundleLines,
  [System.Text.UTF8Encoding]::new($false)
)

# ------------------------------------------------------------
# 9. ESLint + production build
# ------------------------------------------------------------

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot

try {
  Write-Host "Running ESLint..." -ForegroundColor Cyan

  & npx.cmd eslint .
  $lintExit = $LASTEXITCODE

  if ($lintExit -eq 0) {
    $lintStatus = "PASS"
  }
  else {
    $lintStatus = "FAIL"
  }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan

  & npm.cmd run build
  $buildExit = $LASTEXITCODE

  if ($buildExit -eq 0) {
    $buildStatus = "PASS"
  }
  else {
    $buildStatus = "FAIL"
  }
}
finally {
  Pop-Location
}

# ------------------------------------------------------------
# 10. Final audit status
# ------------------------------------------------------------

$missingSignalCount = @(
  $signalResults |
    Where-Object {
      $_.StartsWith("[MISSING SIGNAL]")
    }
).Count

$missingWorkflowCount = @(
  $workflowResults |
    Where-Object {
      $_.StartsWith("[MISSING SIGNAL]")
    }
).Count

$missingIntegrationCount = @(
  $integrationResults |
    Where-Object {
      $_.StartsWith("[MISSING SIGNAL]")
    }
).Count

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $missing.Count -eq 0 -and
  $markers.Count -eq 0 -and
  $missingSignalCount -eq 0 -and
  $missingWorkflowCount -eq 0 -and
  $missingIntegrationCount -eq 0 -and
  $qaWarnings.Count -eq 0
) {
  $status =
    "PASS CANDIDATE - COVERAGE SOURCE REVIEW REQUIRED"
}
elseif (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status =
    "TECHNICALLY PASSING - CURRICULUM REMEDIATION REQUIRED"
}
else {
  $status =
    "NOT YET PASSING"
}

# ------------------------------------------------------------
# 11. Summary
# ------------------------------------------------------------

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add(
  "CS MASTER - CURRICULUM FINALISATION + EXAM-BOARD QA"
)
$lines.Add(
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)
$lines.Add(
  "Project: $ProjectRoot"
)

$lines.Add("")
$lines.Add("CORE INVENTORY")
$lines.Add("--------------")

foreach ($item in $inventory) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("QUALIFICATION / BOARD SIGNALS")
$lines.Add("-----------------------------")

foreach ($item in $signalResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("CURRICULUM WORKFLOW SIGNALS")
$lines.Add("---------------------------")

foreach ($item in $workflowResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("CROSS-FEATURE INTEGRATION")
$lines.Add("-------------------------")

foreach ($item in $integrationResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("CURRICULUM DATA QA")
$lines.Add("------------------")

foreach ($item in $qaResults) {
  $lines.Add($item)
}

foreach ($item in $qaWarnings) {
  $lines.Add("[WARN] $item")
}

$lines.Add("")
$lines.Add("DISCOVERED CURRICULUM-SCOPE FILES")
$lines.Add("---------------------------------")
$lines.Add("$($bundleFiles.Count)")

$lines.Add("")
$lines.Add("GENUINE UNFINISHED MARKERS")
$lines.Add("--------------------------")
$lines.Add("Count: $($markers.Count)")

foreach ($item in $markers) {
  $lines.Add($item)
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

$lines.Add("")
$lines.Add("SOURCE BUNDLE")
$lines.Add("-------------")
$lines.Add($bundle)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CURRICULUM MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"