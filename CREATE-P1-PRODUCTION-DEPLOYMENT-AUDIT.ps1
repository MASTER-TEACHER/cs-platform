param(
  [string]$ProjectRoot = "C:\Users\cr7ri\cs-platform-clean"
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$outputPath = Join-Path $root "P1-PRODUCTION-DEPLOYMENT-AUDIT.txt"

Write-Host ""
Write-Host "CS Master - P1 Production & Deployment Readiness Audit" -ForegroundColor Cyan
Write-Host "Project: $root"
Write-Host ""

$sections = New-Object System.Collections.Generic.List[string]

function Add-Section {
  param(
    [string]$Title,
    [string]$Content
  )

  $sections.Add("")
  $sections.Add("=" * 100)
  $sections.Add($Title)
  $sections.Add("=" * 100)
  $sections.Add("")

  if ([string]::IsNullOrWhiteSpace($Content)) {
    $sections.Add("[No content found]")
  }
  else {
    $sections.Add($Content)
  }
}

function Add-File {
  param(
    [string]$RelativePath
  )

  $fullPath = Join-Path $root $RelativePath

  if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
    return
  }

  $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()

  $allowed = @(
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".rules",
    ".md",
    ".txt",
    ".css",
    ".mjs",
    ".cjs"
  )

  if ($allowed -notcontains $ext) {
    return
  }

  $content = Get-Content -LiteralPath $fullPath -Raw -ErrorAction SilentlyContinue

  if ($null -eq $content) {
    $content = ""
  }

  Add-Section -Title "FILE: $RelativePath" -Content $content
  Write-Host "ADDED   $RelativePath" -ForegroundColor Green
}

function Relative-Path {
  param(
    [string]$FullPath
  )

  return $FullPath.Substring($root.Length).TrimStart("\")
}

$header = @"
CS MASTER - P1 PRODUCTION & DEPLOYMENT READINESS AUDIT
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Project:   $root

COMPLETED PHASES
----------------
T1 Teacher Production Completion: complete
T2 Teacher Production Completion: complete
S1 Student Production Completion: complete
A1 Advanced Learning & Exam Mode Production Completion: complete

P1 PURPOSE
----------
P1 is the production/deployment hardening phase.

It audits whether the now-complete teacher, student and advanced systems can be
deployed safely and operated reliably in production.

PRIMARY P1 AREAS
----------------
P1A  Firebase Admin configuration and admin API runtime safety
P1B  Firebase Auth / role / account lifecycle production readiness
P1C  Firestore rules, composite indexes and tenant isolation deployment state
P1D  Environment-variable and secret handling
P1E  AI API production behaviour, quotas, failures and server-only boundaries
P1F  Next.js production route/runtime/caching behaviour
P1G  Error/loading/not-found/recovery states and operational resilience
P1H  Final deployment regression, cleanup and launch gate

This audit is READ ONLY.
No secret values are written to the report.
"@

$sections.Add($header)

# -------------------------------------------------------------------
# Core config
# -------------------------------------------------------------------

$coreFiles = @(
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.js",
  "next.config.ts",
  "eslint.config.js",
  "firebase.json",
  ".firebaserc",
  "firestore.rules",
  "firestore.indexes.json",
  "DEPLOYMENT_CHECKLIST.md",
  "README.md",
  "README-INSTALL.md",
  "app\layout.tsx",
  "app\error.tsx",
  "app\not-found.tsx",
  "app\loading.tsx",
  "components\layout\AppShell.tsx",
  "contexts\AuthContext.tsx",
  "lib\firebase.ts",
  "lib\firebaseAdmin.ts",
  "services\authService.ts",
  "services\userService.ts"
)

foreach ($file in $coreFiles) {
  Add-File $file
}

# -------------------------------------------------------------------
# Environment presence only -- never values
# -------------------------------------------------------------------

$envReport = New-Object System.Collections.Generic.List[string]
$envPath = Join-Path $root ".env.local"

$envNames = @(
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "OPENAI_API_KEY",
  "OPENAI_STUDENT_TUTOR_MODEL",
  "OPENAI_MARKING_MODEL",
  "OPENAI_EXAM_QUESTION_MODEL",
  "AI_STUDENT_TUTOR_DEMO_MODE",
  "AI_MARKING_DEMO_MODE",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY_BASE64"
)

if (Test-Path -LiteralPath $envPath -PathType Leaf) {
  $envText = Get-Content -LiteralPath $envPath -Raw

  foreach ($name in $envNames) {
    if ($envText -match ("(?m)^\s*" + [regex]::Escape($name) + "\s*=\s*\S+")) {
      $envReport.Add("$name=PRESENT")
    }
    else {
      $envReport.Add("$name=ABSENT")
    }
  }
}
else {
  $envReport.Add(".env.local=MISSING")
}

Add-Section `
  -Title "P1 ENVIRONMENT VARIABLE PRESENCE (VALUES REDACTED)" `
  -Content ($envReport -join [Environment]::NewLine)

# -------------------------------------------------------------------
# Production-sensitive route trees
# -------------------------------------------------------------------

$routeRoots = @(
  "app\api",
  "app\admin",
  "app\teacher-access",
  "app\login",
  "app\register",
  "app\onboarding",
  "app\join-school",
  "app\profile",
  "app\assignments",
  "app\teacher"
)

$routeFiles = New-Object System.Collections.Generic.List[string]

foreach ($routeRoot in $routeRoots) {
  $fullRouteRoot = Join-Path $root $routeRoot

  if (-not (Test-Path -LiteralPath $fullRouteRoot -PathType Container)) {
    continue
  }

  Get-ChildItem `
    -LiteralPath $fullRouteRoot `
    -Recurse `
    -File `
    -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Extension -in @(".ts", ".tsx", ".js", ".jsx")
    } |
    Sort-Object FullName |
    ForEach-Object {
      $relative = Relative-Path $_.FullName
      $routeFiles.Add($relative)
      Add-File $relative
    }
}

# -------------------------------------------------------------------
# Production-sensitive services and middleware
# -------------------------------------------------------------------

$serviceRoots = @(
  "services",
  "lib",
  "contexts",
  "hooks",
  "types"
)

$keywords = @(
  "auth",
  "admin",
  "school",
  "member",
  "invite",
  "teacher",
  "student",
  "exam",
  "assignment",
  "analytics",
  "ai",
  "tutor",
  "firebase",
  "security",
  "role",
  "profile"
)

$extraFiles = New-Object System.Collections.Generic.List[string]

foreach ($serviceRoot in $serviceRoots) {
  $full = Join-Path $root $serviceRoot

  if (-not (Test-Path -LiteralPath $full -PathType Container)) {
    continue
  }

  Get-ChildItem `
    -LiteralPath $full `
    -Recurse `
    -File `
    -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Extension -in @(".ts", ".tsx", ".js", ".jsx") -and
      (
        $name = $_.Name.ToLowerInvariant()
        ($keywords | Where-Object { $name.Contains($_) }).Count -gt 0
      )
    } |
    Sort-Object FullName |
    ForEach-Object {
      $relative = Relative-Path $_.FullName
      $extraFiles.Add($relative)
      Add-File $relative
    }
}

# -------------------------------------------------------------------
# Scan source for production-risk markers
# -------------------------------------------------------------------

$patterns = @(
  "TODO",
  "FIXME",
  "HACK",
  "TEMPORARY",
  "DEV ONLY",
  "demo fallback",
  "demo mode",
  "mock",
  "localhost",
  "127.0.0.1",
  "console.log",
  "console.warn",
  "console.error",
  "throw new Error",
  "permission-denied",
  "permission denied",
  "process.env",
  "NEXT_PUBLIC_",
  "OPENAI_API_KEY",
  "FIREBASE_ADMIN_",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "runtime =",
  "force-dynamic",
  "dynamic =",
  "revalidate",
  "cache:",
  "no-store",
  "cookies(",
  "headers(",
  "verifyIdToken",
  "setCustomUserClaims",
  "updateUser(",
  "deleteUser(",
  "server-only",
  "use client"
)

$scanRoots = @(
  "app",
  "components",
  "contexts",
  "hooks",
  "lib",
  "services"
)

$markerLines = New-Object System.Collections.Generic.List[string]

foreach ($scanRoot in $scanRoots) {
  $full = Join-Path $root $scanRoot

  if (-not (Test-Path -LiteralPath $full -PathType Container)) {
    continue
  }

  Get-ChildItem `
    -LiteralPath $full `
    -Recurse `
    -File `
    -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
    } |
    ForEach-Object {
      $relative = Relative-Path $_.FullName
      $lines = Get-Content -LiteralPath $_.FullName -ErrorAction SilentlyContinue

      if ($null -eq $lines) {
        return
      }

      for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = [string]$lines[$i]

        foreach ($pattern in $patterns) {
          if ($line.IndexOf(
            $pattern,
            [System.StringComparison]::OrdinalIgnoreCase
          ) -ge 0) {
            $markerLines.Add(
              ("{0}:{1}: {2}" -f $relative, ($i + 1), $line.Trim())
            )
            break
          }
        }
      }
    }
}

Add-Section `
  -Title "P1 PRODUCTION RISK MARKER SEARCH" `
  -Content ($markerLines -join [Environment]::NewLine)

# -------------------------------------------------------------------
# Git ignore / secret safety
# -------------------------------------------------------------------

$gitignorePath = Join-Path $root ".gitignore"
$gitignoreText = ""

if (Test-Path -LiteralPath $gitignorePath -PathType Leaf) {
  $gitignoreText = Get-Content -LiteralPath $gitignorePath -Raw
}

Add-Section `
  -Title "FILE: .gitignore" `
  -Content $gitignoreText

$secretSafety = New-Object System.Collections.Generic.List[string]

foreach ($required in @(
  ".env",
  ".env.local",
  "*.pem",
  "*.key",
  "service-account",
  "serviceAccount"
)) {
  if (
    $gitignoreText.IndexOf(
      $required,
      [System.StringComparison]::OrdinalIgnoreCase
    ) -ge 0
  ) {
    $secretSafety.Add("$required=IGNORED_OR_PATTERN_PRESENT")
  }
  else {
    $secretSafety.Add("$required=NO_EXPLICIT_PATTERN_FOUND")
  }
}

Add-Section `
  -Title "P1 SECRET-SAFETY CHECK" `
  -Content ($secretSafety -join [Environment]::NewLine)

# -------------------------------------------------------------------
# Firebase indexes summary
# -------------------------------------------------------------------

$indexesPath = Join-Path $root "firestore.indexes.json"

if (Test-Path -LiteralPath $indexesPath -PathType Leaf) {
  try {
    $indexes = Get-Content -LiteralPath $indexesPath -Raw | ConvertFrom-Json

    $indexCount = @($indexes.indexes).Count
    $overrideCount = @($indexes.fieldOverrides).Count

    Add-Section `
      -Title "P1 FIRESTORE INDEX SUMMARY" `
      -Content @"
Composite indexes: $indexCount
Field overrides: $overrideCount
"@
  }
  catch {
    Add-Section `
      -Title "P1 FIRESTORE INDEX SUMMARY" `
      -Content "firestore.indexes.json exists but could not be parsed as JSON."
  }
}
else {
  Add-Section `
    -Title "P1 FIRESTORE INDEX SUMMARY" `
    -Content "firestore.indexes.json is missing."
}

# -------------------------------------------------------------------
# Deployment-sensitive package scripts
# -------------------------------------------------------------------

$packagePath = Join-Path $root "package.json"

if (Test-Path -LiteralPath $packagePath -PathType Leaf) {
  try {
    $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json

    $scriptLines = New-Object System.Collections.Generic.List[string]

    foreach ($property in $package.scripts.PSObject.Properties) {
      $scriptLines.Add("$($property.Name)=$($property.Value)")
    }

    Add-Section `
      -Title "P1 PACKAGE SCRIPTS" `
      -Content ($scriptLines -join [Environment]::NewLine)
  }
  catch {
    Add-Section `
      -Title "P1 PACKAGE SCRIPTS" `
      -Content "package.json could not be parsed."
  }
}

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

$summary = @"
Production-sensitive route files captured: $(($routeFiles | Sort-Object -Unique).Count)
Production-sensitive support files captured: $(($extraFiles | Sort-Object -Unique).Count)
Production-risk marker matches: $($markerLines.Count)

P1 audit complete.

NEXT
----
Send P1-PRODUCTION-DEPLOYMENT-AUDIT.txt back for P1A-P1H implementation planning.
"@

Add-Section `
  -Title "P1 AUDIT SUMMARY" `
  -Content $summary

[System.IO.File]::WriteAllText(
  $outputPath,
  ($sections -join [Environment]::NewLine),
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "P1 audit created successfully:" -ForegroundColor Green
Write-Host $outputPath -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-PRODUCTION-DEPLOYMENT-AUDIT.txt" -ForegroundColor Cyan