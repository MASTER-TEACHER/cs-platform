param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")

$summary = Join-Path $ProjectRoot "ADMIN-PRODUCTION-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "ADMIN-PRODUCTION-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - ADMIN + PRODUCTION HARDENING FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

# ------------------------------------------------------------
# 1. Core admin / production architecture inventory
# ------------------------------------------------------------

$expected = @(
  "app\admin\page.tsx",
  "app\admin\teachers\page.tsx",
  "app\admin\teachers\[teacherId]\page.tsx",
  "app\api\admin\teachers\[teacherId]\status\route.ts",
  "app\api\admin\teacher-request\[requestedId]\route.ts",
  "app\api\health\route.ts",
  "firebase.json",
  "firestore.indexes.json",
  "firestore.rules"
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
# 2. Discover relevant admin/security/production files
# ------------------------------------------------------------

$roots = @(
  "app\admin",
  "app\api\admin",
  "app\api\health",
  "app\teacher-access",
  "app\join-school",
  "app\teacher\school",
  "components\admin",
  "components\teacher",
  "services",
  "lib"
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
      $lower.Contains("admin") -or
      $lower.Contains("teacher") -or
      $lower.Contains("school") -or
      $lower.Contains("tenant") -or
      $lower.Contains("auth") -or
      $lower.Contains("security") -or
      $lower.Contains("health") -or
      $lower.Contains("firebase") -or
      $lower.Contains("user")
    ) {
      if (-not $files.Contains($relative)) {
        $files.Add($relative)
      }
    }
  }
}

foreach ($rootFile in @(
  "firebase.json",
  "firestore.indexes.json",
  "firestore.rules",
  ".firebaserc",
  "next.config.js",
  "next.config.ts",
  "middleware.ts",
  "middleware.js"
)) {
  $full = Join-Path $ProjectRoot $rootFile

  if (
    (Test-Path -LiteralPath $full -PathType Leaf) -and
    (-not $files.Contains($rootFile))
  ) {
    $files.Add($rootFile)
  }
}

$files = @($files | Sort-Object)

# ------------------------------------------------------------
# 3. Role / authorization signal checks
# ------------------------------------------------------------

$authSignals = [ordered]@{
  "Admin role enforcement" = @(
    "role",
    "admin"
  )
  "Teacher status management" = @(
    "teacher",
    "status"
  )
  "School membership / tenancy" = @(
    "schoolId"
  )
  "API authorization" = @(
    "authorization"
  )
  "Firebase identity verification" = @(
    "idToken"
  )
}

$authResults = New-Object System.Collections.Generic.List[string]

foreach ($entry in $authSignals.GetEnumerator()) {
  $matchedFiles = New-Object System.Collections.Generic.List[string]

  foreach ($relative in $files) {
    $full = Join-Path $ProjectRoot $relative
    $content = [System.IO.File]::ReadAllText($full).ToLowerInvariant()

    $allPresent = $true

    foreach ($needle in $entry.Value) {
      if (-not $content.Contains($needle.ToLowerInvariant())) {
        $allPresent = $false
        break
      }
    }

    if ($allPresent) {
      $matchedFiles.Add($relative)
    }
  }

  if ($matchedFiles.Count -gt 0) {
    $authResults.Add(
      "[OK] $($entry.Key) - detected in $($matchedFiles.Count) file(s)"
    )
  }
  else {
    $authResults.Add(
      "[MISSING SIGNAL] $($entry.Key)"
    )
  }
}

# ------------------------------------------------------------
# 4. Production-hardening checks
# ------------------------------------------------------------

$productionChecks = New-Object System.Collections.Generic.List[string]
$productionWarnings = New-Object System.Collections.Generic.List[string]

function Check-ContainsAny {
  param(
    [string]$Label,
    [string]$Path,
    [string[]]$Needles
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    $productionWarnings.Add("$Label - file missing: $Path")
    return
  }

  $content =
    [System.IO.File]::ReadAllText($Path).ToLowerInvariant()

  $found = $false

  foreach ($needle in $Needles) {
    if ($content.Contains($needle.ToLowerInvariant())) {
      $found = $true
      break
    }
  }

  if ($found) {
    $productionChecks.Add("[OK] $Label")
  }
  else {
    $productionWarnings.Add("$Label - expected signal not detected")
  }
}

Check-ContainsAny `
  -Label "Health endpoint present" `
  -Path (Join-Path $ProjectRoot "app\api\health\route.ts") `
  -Needles @(
    "NextResponse",
    "health",
    "status"
  )

Check-ContainsAny `
  -Label "Firestore rules configured" `
  -Path (Join-Path $ProjectRoot "firestore.rules") `
  -Needles @(
    "rules_version",
    "match /databases"
  )

Check-ContainsAny `
  -Label "Firestore indexes configured" `
  -Path (Join-Path $ProjectRoot "firestore.indexes.json") `
  -Needles @(
    "indexes",
    "fieldOverrides"
  )

Check-ContainsAny `
  -Label "Firebase hosting/config present" `
  -Path (Join-Path $ProjectRoot "firebase.json") `
  -Needles @(
    "firestore",
    "hosting",
    "frameworksBackend"
  )

# ------------------------------------------------------------
# 5. Search for risky production markers
# ------------------------------------------------------------

$riskPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "temporary admin",
  "temporary bypass",
  "bypass auth",
  "skip auth",
  "allow read, write: if true",
  "allow read: if true",
  "allow write: if true",
  "localhost:",
  "127.0.0.1",
  "hardcoded password",
  "demo password",
  "test password",
  "admin@example.com",
  "teacher@example.com",
  "student@example.com"
)

$riskFindings = New-Object System.Collections.Generic.List[string]

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $riskPatterns) {
    $matches = Select-String `
      -LiteralPath $full `
      -SimpleMatch `
      -Pattern $pattern `
      -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $riskFindings.Add(
        "${relative}:$($match.LineNumber): $($match.Line.Trim())"
      )
    }
  }
}

# ------------------------------------------------------------
# 6. Environment variable usage inventory
# ------------------------------------------------------------

$envReferences = New-Object System.Collections.Generic.HashSet[string]

$envPattern =
  'process\.env\.([A-Z0-9_]+)'

foreach ($relative in $files) {
  $full = Join-Path $ProjectRoot $relative
  $content = [System.IO.File]::ReadAllText($full)

  $matches =
    [System.Text.RegularExpressions.Regex]::Matches(
      $content,
      $envPattern
    )

  foreach ($match in $matches) {
    [void]$envReferences.Add(
      $match.Groups[1].Value
    )
  }
}

$envList = @($envReferences | Sort-Object)

# ------------------------------------------------------------
# 7. Source bundle
# ------------------------------------------------------------

$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add(
  "CS MASTER - ADMIN + PRODUCTION HARDENING FINAL MASTER SOURCE BUNDLE"
)
$bundleLines.Add(
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)
$bundleLines.Add(
  "Project: $ProjectRoot"
)
$bundleLines.Add(
  "Files: $($files.Count)"
)

foreach ($relative in $files) {
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
# 8. ESLint + production build
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
# 9. Phase status
# ------------------------------------------------------------

$missingAuthSignals = @(
  $authResults |
    Where-Object {
      $_.StartsWith("[MISSING SIGNAL]")
    }
).Count

if (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $missing.Count -eq 0 -and
  $missingAuthSignals -eq 0 -and
  $productionWarnings.Count -eq 0 -and
  $riskFindings.Count -eq 0
) {
  $status =
    "PASS CANDIDATE - SOURCE REVIEW REQUIRED"
}
elseif (
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status =
    "TECHNICALLY PASSING - PRODUCTION REMEDIATION REQUIRED"
}
else {
  $status =
    "NOT YET PASSING"
}

# ------------------------------------------------------------
# 10. Summary
# ------------------------------------------------------------

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add(
  "CS MASTER - ADMIN + PRODUCTION HARDENING FINAL MASTER AUDIT"
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
$lines.Add("AUTHORIZATION / TENANCY SIGNALS")
$lines.Add("-------------------------------")

foreach ($item in $authResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("PRODUCTION CONFIGURATION")
$lines.Add("------------------------")

foreach ($item in $productionChecks) {
  $lines.Add($item)
}

foreach ($item in $productionWarnings) {
  $lines.Add("[WARN] $item")
}

$lines.Add("")
$lines.Add("RISK / UNFINISHED MARKERS")
$lines.Add("-------------------------")
$lines.Add("Count: $($riskFindings.Count)")

foreach ($item in $riskFindings) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("ENVIRONMENT VARIABLES REFERENCED")
$lines.Add("--------------------------------")
$lines.Add("Count: $($envList.Count)")

foreach ($item in $envList) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("DISCOVERED ADMIN / PRODUCTION FILES")
$lines.Add("-----------------------------------")
$lines.Add("$($files.Count)")

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
$lines.Add("ADMIN + PRODUCTION PHASE STATUS")
$lines.Add("-------------------------------")
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
Write-Host " ADMIN + PRODUCTION MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"  