param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean"
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$projectParent = Split-Path -Parent $ProjectRoot
$projectName = Split-Path -Leaf $ProjectRoot

$backup = Join-Path $projectParent "$projectName-p1-lint-pass2-backup-$timestamp"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 2"
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$FullPath) {
  if ([string]::IsNullOrWhiteSpace($FullPath)) {
    throw "Backup-File received an empty path."
  }

  if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    throw "ProjectRoot is empty."
  }

  $resolvedFullPath = (Resolve-Path -LiteralPath $FullPath -ErrorAction Stop).Path
  $resolvedRoot = (Resolve-Path -LiteralPath $ProjectRoot -ErrorAction Stop).Path.TrimEnd("\")

  $rootWithSeparator = $resolvedRoot + "\"

  if (-not $resolvedFullPath.StartsWith(
      $rootWithSeparator,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
    throw "Refusing to back up a file outside the project root: $resolvedFullPath"
  }

  $relative = $resolvedFullPath.Substring($rootWithSeparator.Length)

  if ([string]::IsNullOrWhiteSpace($relative)) {
    throw "Could not calculate relative backup path for: $resolvedFullPath"
  }

  $destination = Join-Path -Path $backup -ChildPath $relative
  $parent = Split-Path -Parent $destination

  if (-not [string]::IsNullOrWhiteSpace($parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $destination -PathType Leaf)) {
    Copy-Item -LiteralPath $resolvedFullPath -Destination $destination -Force
  }
}

function Write-Utf8NoBom([string]$Path, [string[]]$Lines) {
  [System.IO.File]::WriteAllLines(
    $Path,
    $Lines,
    [System.Text.UTF8Encoding]::new($false)
  )
}

Push-Location $ProjectRoot

try {
  Write-Host "1. Reading the current ESLint findings..." -ForegroundColor Cyan
  $report = Join-Path $env:TEMP "cs-master-p1-lint-pass2-$timestamp.json"

if (Test-Path -LiteralPath $report) {
    Remove-Item -LiteralPath $report -Force
}
  & npx.cmd eslint . --format json --output-file $report
  $null = $LASTEXITCODE

  if (-not (Test-Path -LiteralPath $report -PathType Leaf)) {
    throw "ESLint did not create the Pass 2 report."
  }

  $results = Get-Content -LiteralPath $report -Raw | ConvertFrom-Json

  # ---------------------------------------------------------------
  # A. JSX text escaping.
  # These positions come directly from ESLint. Process each line from
  # right to left so inserting an HTML entity does not move an earlier
  # reported column.
  # ---------------------------------------------------------------

  $escapeFiles = @(
    $results |
      Where-Object {
        @($_.messages | Where-Object {
          $_.ruleId -eq "react/no-unescaped-entities" -and $_.severity -eq 2
        }).Count -gt 0
      }
  )

  $escapedCount = 0

  foreach ($item in $escapeFiles) {
    $fullPath = [string]$item.filePath

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
      continue
    }

    Backup-File $fullPath

    $lines = [System.Collections.Generic.List[string]](
      Get-Content -LiteralPath $fullPath
    )

    $messages = @(
      $item.messages |
        Where-Object {
          $_.ruleId -eq "react/no-unescaped-entities" -and $_.severity -eq 2
        } |
        Sort-Object `
          @{ Expression = { [int]$_.line }; Descending = $true },
          @{ Expression = { [int]$_.column }; Descending = $true }
    )

    foreach ($message in $messages) {
      $lineIndex = [int]$message.line - 1
      $charIndex = [int]$message.column - 1

      if ($lineIndex -lt 0 -or $lineIndex -ge $lines.Count) {
        throw "Invalid ESLint line position for $fullPath"
      }

      $line = [string]$lines[$lineIndex]

      if ($charIndex -lt 0 -or $charIndex -ge $line.Length) {
        throw "Invalid ESLint column position for $fullPath"
      }

      $character = $line[$charIndex]

      if ($character -eq "'") {
        $replacement = "&apos;"
      }
      elseif ($character -eq '"') {
        $replacement = "&quot;"
      }
      else {
        throw "Unexpected unescaped character '$character' at ${fullPath}:$($message.line):$($message.column)"
      }

      $before =
        if ($charIndex -gt 0) {
          $line.Substring(0, $charIndex)
        }
        else {
          ""
        }

      $afterIndex = $charIndex + 1

      $after =
        if ($afterIndex -lt $line.Length) {
          $line.Substring($afterIndex)
        }
        else {
          ""
        }

      $lines[$lineIndex] = $before + $replacement + $after
      $escapedCount++
    }

    Write-Utf8NoBom $fullPath $lines.ToArray()
  }

  Write-Host "[PASS2] Escaped $escapedCount JSX text character(s)." -ForegroundColor Green

  # ---------------------------------------------------------------
  # B. Remove the single explicit-any error using the imported data's
  # real inferred element type. This is type-only and behaviour-neutral.
  # ---------------------------------------------------------------

  $achievementPath = Join-Path $ProjectRoot  "components\dashboard\AchievementsCard.tsx"

  if (Test-Path -LiteralPath $achievementPath -PathType Leaf) {
    $achievementText = Get-Content -LiteralPath $achievementPath -Raw

    if ($achievementText.Contains("function getProgress(achievement: any)")) {
      Backup-File $achievementPath

      $achievementText = $achievementText.Replace(
        "function getProgress(achievement: any)",
        "function getProgress(achievement: (typeof achievements)[number])"
      )

      [System.IO.File]::WriteAllText(
        $achievementPath,
        $achievementText,
        [System.Text.UTF8Encoding]::new($false)
      )

      Write-Host "[PASS2] Replaced explicit any in AchievementsCard." -ForegroundColor Green
    }
    else {
      Write-Host "[PASS2] AchievementsCard explicit-any target already absent." -ForegroundColor DarkGray
    }
  }

  # ---------------------------------------------------------------
  # C. Replace the internal <a> with Next.js <Link>.
  # ---------------------------------------------------------------

  $selectorPath = Join-Path $ProjectRoot "components\teacher\exam\ExamPaperAssignmentSelector.tsx"

  if (Test-Path -LiteralPath $selectorPath -PathType Leaf) {
    $selectorLines = [System.Collections.Generic.List[string]](
      Get-Content -LiteralPath $selectorPath
    )

    $anchorIndex = -1
    $anchorCloseIndex = -1

    for ($i = 0; $i -lt $selectorLines.Count; $i++) {
      if (
        $selectorLines[$i].Trim() -eq "<a" -and
        $i + 1 -lt $selectorLines.Count -and
        $selectorLines[$i + 1].Contains('href="/teacher/question-bank"')
      ) {
        $anchorIndex = $i
        break
      }
    }

    if ($anchorIndex -ge 0) {
      for ($i = $anchorIndex + 1; $i -lt [Math]::Min($anchorIndex + 15, $selectorLines.Count); $i++) {
        if ($selectorLines[$i].Trim() -eq "</a>") {
          $anchorCloseIndex = $i
          break
        }
      }

      if ($anchorCloseIndex -lt 0) {
        throw "Could not find closing anchor in ExamPaperAssignmentSelector.tsx"
      }

      Backup-File $selectorPath

      $indent = $selectorLines[$anchorIndex].Substring(
        0,
        $selectorLines[$anchorIndex].Length - $selectorLines[$anchorIndex].TrimStart().Length
      )

      $selectorLines[$anchorIndex] = $indent + "<Link"

      $closeIndent = $selectorLines[$anchorCloseIndex].Substring(
        0,
        $selectorLines[$anchorCloseIndex].Length - $selectorLines[$anchorCloseIndex].TrimStart().Length
      )

      $selectorLines[$anchorCloseIndex] = $closeIndent + "</Link>"

      $hasLinkImport = $false

      foreach ($line in $selectorLines) {
        if ($line -match '^import Link from "next/link";') {
          $hasLinkImport = $true
          break
        }
      }

      if (-not $hasLinkImport) {
        $insertIndex = 0

        for ($i = 0; $i -lt $selectorLines.Count; $i++) {
          if ($selectorLines[$i] -match '^import .* from "react";') {
            $insertIndex = $i + 1
            break
          }
        }

        $selectorLines.Insert($insertIndex, 'import Link from "next/link";')
      }

      Write-Utf8NoBom $selectorPath $selectorLines.ToArray()
      Write-Host "[PASS2] Converted Question Bank anchor to Next.js Link." -ForegroundColor Green
    }
    else {
      Write-Host "[PASS2] Question Bank anchor target already absent." -ForegroundColor DarkGray
    }
  }

  # ---------------------------------------------------------------
  # Re-run lint and create the measured Pass 2 summary.
  # ---------------------------------------------------------------

  Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue

  Write-Host ""
  Write-Host "2. Measuring the remaining lint findings..." -ForegroundColor Cyan

  & npx eslint . --format json --output-file $report
  $null = $LASTEXITCODE

  if (-not (Test-Path -LiteralPath $report -PathType Leaf)) {
    throw "ESLint did not create the post-Pass-2 report."
  }

  $after = Get-Content -LiteralPath $report -Raw | ConvertFrom-Json

  $errors = 0
  $warnings = 0
  $problemFiles = 0
  $rules = @{}

  foreach ($item in $after) {
    if ($item.errorCount -gt 0 -or $item.warningCount -gt 0) {
      $problemFiles++
    }

    $errors += [int]$item.errorCount
    $warnings += [int]$item.warningCount

    foreach ($message in $item.messages) {
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
$summary = Join-Path $ProjectRoot "P1-LINT-PASS2-SUMMARY.txt"
  $summaryLines = New-Object System.Collections.Generic.List[string]
  $summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 2")
  $summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
  $summaryLines.Add("Project: $ProjectRoot")
  $summaryLines.Add("")
  $summaryLines.Add("Problem files: $problemFiles")
  $summaryLines.Add("Errors: $errors")
  $summaryLines.Add("Warnings: $warnings")
  $summaryLines.Add("")
  $summaryLines.Add("REMAINING RULE COUNTS")
  $summaryLines.Add("---------------------")

  foreach ($entry in ($rules.GetEnumerator() | Sort-Object Value -Descending)) {
    $summaryLines.Add("$($entry.Key): $($entry.Value)")
  }

  [System.IO.File]::WriteAllLines(
    $summary,
    $summaryLines,
    [System.Text.UTF8Encoding]::new($false)
  )

  Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue

  Write-Host ""
  Write-Host "P1 Lint Pass 2 complete." -ForegroundColor Green
  Write-Host "No ESLint rules were disabled." -ForegroundColor Green
  Write-Host ""
  Write-Host "Remaining problem files: $problemFiles"
  Write-Host "Remaining errors: $errors"
  Write-Host "Remaining warnings: $warnings"
  Write-Host ""
  Write-Host "Created:" -ForegroundColor Cyan
  Write-Host $summary -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Send me P1-LINT-PASS2-SUMMARY.txt next." -ForegroundColor Cyan
}
finally {
  Pop-Location
}