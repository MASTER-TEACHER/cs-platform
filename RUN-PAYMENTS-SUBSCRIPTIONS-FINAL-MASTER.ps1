param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$summary = Join-Path $ProjectRoot "PAYMENTS-SUBSCRIPTIONS-FINAL-MASTER-SUMMARY.txt"
$bundle = Join-Path $ProjectRoot "PAYMENTS-SUBSCRIPTIONS-FINAL-MASTER-SOURCE-BUNDLE.txt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - PAYMENTS + SUBSCRIPTIONS FINAL MASTER AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

# ------------------------------------------------------------
# 1. Discover source/config files relevant to commercial access.
# ------------------------------------------------------------

$searchRoots = @(
  "app",
  "components",
  "contexts",
  "data",
  "lib",
  "services",
  "types"
)

$allFiles = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $searchRoots) {
  $root = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $root -PathType Container)) {
    continue
  }

  foreach ($file in @(Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx)) {
    $relative = $file.FullName.Substring($ProjectRoot.Length).TrimStart("\")
    if (-not $allFiles.Contains($relative)) {
      $allFiles.Add($relative)
    }
  }
}

foreach ($rootFile in @(
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "package.json",
  "next.config.js",
  "next.config.ts",
  ".firebaserc"
)) {
  $full = Join-Path $ProjectRoot $rootFile
  if (Test-Path -LiteralPath $full -PathType Leaf) {
    if (-not $allFiles.Contains($rootFile)) {
      $allFiles.Add($rootFile)
    }
  }
}

$allFiles = @($allFiles | Sort-Object)

$commercialPatterns = @(
  "subscription",
  "billing",
  "payment",
  "checkout",
  "stripe",
  "priceId",
  "customerId",
  "entitlement",
  "license",
  "licence",
  "plan",
  "schoolId",
  "school",
  "tenant",
  "teacherAccess",
  "teacherRequest",
  "admin",
  "role",
  "webhook"
)

$relevantFiles = New-Object System.Collections.Generic.List[string]

foreach ($relative in $allFiles) {
  $full = Join-Path $ProjectRoot $relative
  $content = [System.IO.File]::ReadAllText($full)
  $lower = ($relative + "`n" + $content).ToLowerInvariant()

  $relevant = $false

  foreach ($pattern in $commercialPatterns) {
    if ($lower.Contains($pattern.ToLowerInvariant())) {
      $relevant = $true
      break
    }
  }

  if ($relevant) {
    $relevantFiles.Add($relative)
  }
}

$relevantFiles = @($relevantFiles | Sort-Object)

# ------------------------------------------------------------
# 2. Existing billing/payment inventory.
# ------------------------------------------------------------

$billingSignals = [ordered]@{
  "Payment provider integration" = @("stripe", "checkout.session", "payment_intent")
  "Checkout workflow" = @("checkout", "create-checkout", "checkout session")
  "Billing portal" = @("billing portal", "billingportal", "portal session")
  "Webhook handling" = @("webhook", "constructevent", "stripe-signature")
  "Subscription records" = @("subscriptionId", "subscriptionStatus", "subscription")
  "Entitlement/access model" = @("entitlement", "subscriptionStatus", "planId")
  "School licence limits" = @("seatLimit", "licenseLimit", "licenceLimit", "maxStudents")
  "Admin billing visibility" = @("billing", "subscription")
}

$billingResults = New-Object System.Collections.Generic.List[string]
$missingBilling = New-Object System.Collections.Generic.List[string]

foreach ($entry in $billingSignals.GetEnumerator()) {
  $matches = New-Object System.Collections.Generic.List[string]

  foreach ($relative in $relevantFiles) {
    $full = Join-Path $ProjectRoot $relative
    $content = [System.IO.File]::ReadAllText($full).ToLowerInvariant()

    foreach ($needle in $entry.Value) {
      if ($content.Contains($needle.ToLowerInvariant())) {
        if (-not $matches.Contains($relative)) {
          $matches.Add($relative)
        }
        break
      }
    }
  }

  if ($matches.Count -gt 0) {
    $billingResults.Add("[FOUND] $($entry.Key) - detected in $($matches.Count) file(s)")
  }
  else {
    $billingResults.Add("[MISSING] $($entry.Key)")
    $missingBilling.Add($entry.Key)
  }
}

# ------------------------------------------------------------
# 3. Foundation checks needed for school-first subscriptions.
# ------------------------------------------------------------

$foundationSignals = [ordered]@{
  "Firebase Admin server support" = @("firebaseAdmin", "adminAuth", "adminDb")
  "Authenticated server API pattern" = @("verifyIdToken", "authorization", "Bearer")
  "Admin role model" = @('"admin"', "role")
  "Teacher role model" = @('"teacher"', "role")
  "Student role model" = @('"student"', "role")
  "School tenancy identifier" = @("schoolId")
  "School membership workflow" = @("join-school", "school membership", "schoolId")
  "Teacher access workflow" = @("teacher-access", "teacherRequests", "teacher request")
}

$foundationResults = New-Object System.Collections.Generic.List[string]
$missingFoundation = New-Object System.Collections.Generic.List[string]

foreach ($entry in $foundationSignals.GetEnumerator()) {
  $matches = New-Object System.Collections.Generic.List[string]

  foreach ($relative in $relevantFiles) {
    $full = Join-Path $ProjectRoot $relative
    $content = ($relative + "`n" + [System.IO.File]::ReadAllText($full)).ToLowerInvariant()

    $allFound = $true
    foreach ($needle in $entry.Value) {
      if (-not $content.Contains($needle.ToLowerInvariant())) {
        $allFound = $false
        break
      }
    }

    if ($allFound) {
      $matches.Add($relative)
    }
  }

  if ($matches.Count -gt 0) {
    $foundationResults.Add("[OK] $($entry.Key) - detected in $($matches.Count) file(s)")
  }
  else {
    $foundationResults.Add("[MISSING SIGNAL] $($entry.Key)")
    $missingFoundation.Add($entry.Key)
  }
}

# ------------------------------------------------------------
# 4. Package dependency check.
# ------------------------------------------------------------

$packagePath = Join-Path $ProjectRoot "package.json"
$packageResults = New-Object System.Collections.Generic.List[string]

if (Test-Path -LiteralPath $packagePath -PathType Leaf) {
  $packageText = [System.IO.File]::ReadAllText($packagePath)

  if ($packageText -match '"stripe"\s*:') {
    $packageResults.Add("[FOUND] stripe package")
  }
  else {
    $packageResults.Add("[MISSING] stripe package")
  }
}
else {
  $packageResults.Add("[MISSING] package.json")
}

# ------------------------------------------------------------
# 5. Environment variable references.
# ------------------------------------------------------------

$envSet = New-Object System.Collections.Generic.HashSet[string]
$envPattern = 'process\.env\.([A-Z0-9_]+)'

foreach ($relative in $allFiles) {
  $full = Join-Path $ProjectRoot $relative
  $content = [System.IO.File]::ReadAllText($full)

  foreach ($match in [System.Text.RegularExpressions.Regex]::Matches($content, $envPattern)) {
    [void]$envSet.Add($match.Groups[1].Value)
  }
}

$envList = @($envSet | Sort-Object)
$paymentEnv = @(
  $envList |
    Where-Object {
      $_ -match "STRIPE|PAYMENT|BILLING|PRICE|SUBSCRIPTION"
    }
)

# ------------------------------------------------------------
# 6. Firestore security/config signals.
# ------------------------------------------------------------

$securityResults = New-Object System.Collections.Generic.List[string]

foreach ($config in @(
  "firestore.rules",
  "firestore.indexes.json",
  "firebase.json"
)) {
  $full = Join-Path $ProjectRoot $config

  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $securityResults.Add("[OK] $config present")
  }
  else {
    $securityResults.Add("[MISSING] $config")
  }
}

# ------------------------------------------------------------
# 7. Risk markers relevant to payments.
# ------------------------------------------------------------

$riskPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "test secret",
  "sk_test_",
  "sk_live_",
  "whsec_",
  "hardcoded price",
  "bypass subscription",
  "bypass payment",
  "free access"
)

$riskFindings = New-Object System.Collections.Generic.List[string]

foreach ($relative in $relevantFiles) {
  $full = Join-Path $ProjectRoot $relative

  foreach ($pattern in $riskPatterns) {
    $matches = @(Select-String -LiteralPath $full -SimpleMatch -Pattern $pattern -ErrorAction SilentlyContinue)

    foreach ($match in $matches) {
      $riskFindings.Add("${relative}:$($match.LineNumber): $($match.Line.Trim())")
    }
  }
}

# ------------------------------------------------------------
# 8. Source bundle.
# ------------------------------------------------------------

$bundleLines = New-Object System.Collections.Generic.List[string]

$bundleLines.Add("CS MASTER - PAYMENTS + SUBSCRIPTIONS FINAL MASTER SOURCE BUNDLE")
$bundleLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$bundleLines.Add("Project: $ProjectRoot")
$bundleLines.Add("Relevant files: $($relevantFiles.Count)")

foreach ($relative in $relevantFiles) {
  $full = Join-Path $ProjectRoot $relative
  $bundleLines.Add("")
  $bundleLines.Add("=" * 110)
  $bundleLines.Add("FILE: $relative")
  $bundleLines.Add("=" * 110)

  $lineNumber = 1
  foreach ($line in Get-Content -LiteralPath $full) {
    $bundleLines.Add(("{0,5}: {1}" -f $lineNumber, $line))
    $lineNumber++
  }
}

[System.IO.File]::WriteAllLines(
  $bundle,
  $bundleLines,
  [System.Text.UTF8Encoding]::new($false)
)

# ------------------------------------------------------------
# 9. ESLint + production build.
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
  $lintStatus = if ($lintExit -eq 0) { "PASS" } else { "FAIL" }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE
  $buildStatus = if ($buildExit -eq 0) { "PASS" } else { "FAIL" }
}
finally {
  Pop-Location
}

if ($lintStatus -eq "PASS" -and $buildStatus -eq "PASS") {
  $status = "AUDIT COMPLETE - PAYMENT IMPLEMENTATION REQUIRED"
}
else {
  $status = "NOT YET READY FOR PAYMENT IMPLEMENTATION"
}

# ------------------------------------------------------------
# 10. Summary.
# ------------------------------------------------------------

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - PAYMENTS + SUBSCRIPTIONS FINAL MASTER AUDIT")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("")
$lines.Add("EXISTING PAYMENT / BILLING CAPABILITY")
$lines.Add("-------------------------------------")

foreach ($item in $billingResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("COMMERCIAL FOUNDATION")
$lines.Add("---------------------")

foreach ($item in $foundationResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("PACKAGE INVENTORY")
$lines.Add("-----------------")

foreach ($item in $packageResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("PAYMENT ENVIRONMENT VARIABLES")
$lines.Add("-----------------------------")
$lines.Add("Count: $($paymentEnv.Count)")

foreach ($item in $paymentEnv) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("FIREBASE / FIRESTORE")
$lines.Add("--------------------")

foreach ($item in $securityResults) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("PAYMENT RISK / UNFINISHED MARKERS")
$lines.Add("---------------------------------")
$lines.Add("Count: $($riskFindings.Count)")

foreach ($item in $riskFindings) {
  $lines.Add($item)
}

$lines.Add("")
$lines.Add("DISCOVERED COMMERCIAL-SCOPE FILES")
$lines.Add("---------------------------------")
$lines.Add("$($relevantFiles.Count)")

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
$lines.Add("PAYMENTS + SUBSCRIPTIONS PHASE STATUS")
$lines.Add("-------------------------------------")
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
Write-Host " PAYMENTS + SUBSCRIPTIONS MASTER AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Source bundle:"
Write-Host $bundle -ForegroundColor Yellow
Write-Host ""
Write-Host "Status: $status"