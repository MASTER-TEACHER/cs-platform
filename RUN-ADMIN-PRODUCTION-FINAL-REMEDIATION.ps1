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

$backup = Join-Path $parent "$name-admin-production-final-remediation-backup-$stamp"
$summary = Join-Path $ProjectRoot "ADMIN-PRODUCTION-FINAL-REMEDIATION-SUMMARY.txt"

$adminPage = Join-Path $ProjectRoot "app\admin\page.tsx"
$teacherPage = Join-Path $ProjectRoot "app\admin\teachers\[teacherId]\page.tsx"
$requestRoute = Join-Path $ProjectRoot "app\api\admin\teacher-request\[requestedId]\route.ts"
$statusRoute = Join-Path $ProjectRoot "app\api\admin\teachers\[teacherId]\status\route.ts"

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

foreach ($required in @(
  $adminPage,
  $teacherPage,
  $requestRoute,
  $statusRoute
)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "Required admin source file not found: $required"
  }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - ADMIN + PRODUCTION FINAL REMEDIATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# ------------------------------------------------------------
# 1. Admin dashboard: send Firebase token as Bearer auth header.
# ------------------------------------------------------------

$adminText = [System.IO.File]::ReadAllText($adminPage)
$adminOriginal = $adminText

$adminText = $adminText.Replace(
@'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          adminIdToken,
        }),
'@,
@'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminIdToken}`,
        },
        body: JSON.stringify({
          action,
        }),
'@
)

if ($adminText -eq $adminOriginal -and
    -not $adminText.Contains('Authorization: `Bearer ${adminIdToken}`')) {
  throw "Could not update admin teacher-request client authorization."
}

if ($adminText -ne $adminOriginal) {
  Backup-File -Path $adminPage
  Write-Utf8NoBom -Path $adminPage -Content $adminText
  Write-Host "[FIX] Admin teacher-request client now uses Bearer authorization." -ForegroundColor Green
}

# ------------------------------------------------------------
# 2. Teacher detail page: send Firebase token as Bearer auth header.
# ------------------------------------------------------------

$teacherText = [System.IO.File]::ReadAllText($teacherPage)
$teacherOriginal = $teacherText

$teacherText = $teacherText.Replace(
@'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          adminIdToken,
        }),
'@,
@'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminIdToken}`,
        },
        body: JSON.stringify({
          action,
        }),
'@
)

if ($teacherText -eq $teacherOriginal -and
    -not $teacherText.Contains('Authorization: `Bearer ${adminIdToken}`')) {
  throw "Could not update teacher-status client authorization."
}

if ($teacherText -ne $teacherOriginal) {
  Backup-File -Path $teacherPage
  Write-Utf8NoBom -Path $teacherPage -Content $teacherText
  Write-Host "[FIX] Teacher status client now uses Bearer authorization." -ForegroundColor Green
}

# ------------------------------------------------------------
# 3. Replace teacher-request API with strict Bearer auth.
# ------------------------------------------------------------

Backup-File -Path $requestRoute

$requestRouteSource = @'
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    requestedId: string;
  }>;
};

type TeacherRequestAction = {
  action: "approve" | "reject";
};

function readBearerToken(
  request: NextRequest,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) || "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return authorization
    .slice("Bearer ".length)
    .trim();
}

function isValidBody(
  value: unknown,
): value is TeacherRequestAction {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const body =
    value as Partial<TeacherRequestAction>;

  return (
    body.action === "approve" ||
    body.action === "reject"
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { requestedId } =
      await context.params;

    const adminIdToken =
      readBearerToken(request);

    if (!adminIdToken) {
      return NextResponse.json(
        {
          error:
            "Administrator authentication is required.",
        },
        { status: 401 },
      );
    }

    const body: unknown =
      await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid request.",
        },
        { status: 400 },
      );
    }

    const decodedToken =
      await adminAuth.verifyIdToken(
        adminIdToken,
      );

    const adminUserSnapshot =
      await adminDb
        .collection("users")
        .doc(decodedToken.uid)
        .get();

    if (!adminUserSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "Admin profile not found.",
        },
        { status: 403 },
      );
    }

    const adminUser =
      adminUserSnapshot.data();

    if (
      adminUser?.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        { status: 403 },
      );
    }

    const teacherRequestReference =
      adminDb
        .collection(
          "teacherRequests",
        )
        .doc(requestedId);

    const teacherRequestSnapshot =
      await teacherRequestReference.get();

    if (
      !teacherRequestSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "Teacher request not found.",
        },
        { status: 404 },
      );
    }

    const teacherRequest =
      teacherRequestSnapshot.data();

    if (
      !teacherRequest?.userId
    ) {
      return NextResponse.json(
        {
          error:
            "Teacher request is missing a user ID.",
        },
        { status: 400 },
      );
    }

    if (
      teacherRequest.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          error:
            "This request has already been reviewed.",
        },
        { status: 409 },
      );
    }

    const requestedUserId =
      String(
        teacherRequest.userId,
      ).trim();

    if (!requestedUserId) {
      return NextResponse.json(
        {
          error:
            "Teacher request has an invalid user ID.",
        },
        { status: 400 },
      );
    }

    const userReference =
      adminDb
        .collection("users")
        .doc(requestedUserId);

    const requestedUserSnapshot =
      await userReference.get();

    if (
      !requestedUserSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "Requested user profile not found.",
        },
        { status: 404 },
      );
    }

    const requestedUser =
      requestedUserSnapshot.data();

    if (
      requestedUser?.role ===
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Administrator accounts cannot be converted through teacher access requests.",
        },
        { status: 409 },
      );
    }

    if (
      body.action ===
      "approve"
    ) {
      await adminAuth.setCustomUserClaims(
        requestedUserId,
        {
          role: "teacher",
        },
      );

      await adminDb.runTransaction(
        async (transaction) => {
          transaction.update(
            userReference,
            {
              role: "teacher",
              teacherApprovedAt:
                new Date(),
              teacherApprovedBy:
                decodedToken.uid,
              updatedAt:
                new Date(),
            },
          );

          transaction.update(
            teacherRequestReference,
            {
              status:
                "approved",
              reviewedBy:
                decodedToken.uid,
              reviewedAt:
                new Date(),
              updatedAt:
                new Date(),
            },
          );
        },
      );

      return NextResponse.json({
        success: true,
        status: "approved",
      });
    }

    await teacherRequestReference.update(
      {
        status: "rejected",
        reviewedBy:
          decodedToken.uid,
        reviewedAt:
          new Date(),
        updatedAt:
          new Date(),
      },
    );

    return NextResponse.json({
      success: true,
      status: "rejected",
    });
  } catch (error) {
    console.error(
      "Teacher request review error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The request could not be reviewed.",
      },
      { status: 500 },
    );
  }
}
'@

Write-Utf8NoBom -Path $requestRoute -Content $requestRouteSource
Write-Host "[FIX] Teacher-request API now uses Bearer auth and protects admin targets." -ForegroundColor Green

# ------------------------------------------------------------
# 4. Replace teacher status API with strict target-role validation.
# ------------------------------------------------------------

Backup-File -Path $statusRoute

$statusRouteSource = @'
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    teacherId: string;
  }>;
};

type TeacherStatusBody = {
  action: "suspend" | "restore";
};

function readBearerToken(
  request: NextRequest,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) || "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return authorization
    .slice("Bearer ".length)
    .trim();
}

function isValidBody(
  value: unknown,
): value is TeacherStatusBody {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const body =
    value as Partial<TeacherStatusBody>;

  return (
    body.action === "suspend" ||
    body.action === "restore"
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { teacherId } =
      await context.params;

    const adminIdToken =
      readBearerToken(request);

    if (!adminIdToken) {
      return NextResponse.json(
        {
          error:
            "Administrator authentication is required.",
        },
        { status: 401 },
      );
    }

    const body: unknown =
      await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid action.",
        },
        { status: 400 },
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(
        adminIdToken,
      );

    const adminDoc =
      await adminDb
        .collection("users")
        .doc(decoded.uid)
        .get();

    if (!adminDoc.exists) {
      return NextResponse.json(
        {
          error:
            "Admin not found.",
        },
        { status: 403 },
      );
    }

    if (
      adminDoc.data()?.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        { status: 403 },
      );
    }

    if (
      teacherId ===
      decoded.uid
    ) {
      return NextResponse.json(
        {
          error:
            "Administrators cannot suspend their own account through teacher management.",
        },
        { status: 409 },
      );
    }

    const teacherRef =
      adminDb
        .collection("users")
        .doc(teacherId);

    const teacherDoc =
      await teacherRef.get();

    if (!teacherDoc.exists) {
      return NextResponse.json(
        {
          error:
            "Teacher not found.",
        },
        { status: 404 },
      );
    }

    const teacherData =
      teacherDoc.data();

    if (
      teacherData?.role !==
      "teacher"
    ) {
      return NextResponse.json(
        {
          error:
            "This account is not a teacher account.",
        },
        { status: 409 },
      );
    }

    const suspended =
      body.action ===
      "suspend";

    await adminAuth.updateUser(
      teacherId,
      {
        disabled: suspended,
      },
    );

    await teacherRef.update({
      status:
        suspended
          ? "suspended"
          : "active",
      updatedAt:
        new Date(),
      statusUpdatedBy:
        decoded.uid,
    });

    return NextResponse.json({
      success: true,
      status:
        suspended
          ? "suspended"
          : "active",
    });
  } catch (error) {
    console.error(
      "Teacher status update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the teacher account.",
      },
      { status: 500 },
    );
  }
}
'@

Write-Utf8NoBom -Path $statusRoute -Content $statusRouteSource
Write-Host "[FIX] Teacher status API now rejects non-teacher targets." -ForegroundColor Green

# ------------------------------------------------------------
# 5. Verification
# ------------------------------------------------------------

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

function Check-Signals {
  param(
    [string]$Label,
    [string]$Path,
    [string[]]$Signals
  )

  $content =
    [System.IO.File]::ReadAllText(
      $Path
    )

  $missingSignals = @(
    $Signals |
      Where-Object {
        -not $content.Contains($_)
      }
  )

  if ($missingSignals.Count -eq 0) {
    $checks.Add(
      "[OK] $Label"
    )
  }
  else {
    $failed.Add(
      "$Label - missing: $($missingSignals -join ', ')"
    )
  }
}

Check-Signals `
  -Label "Admin dashboard Bearer authorization" `
  -Path $adminPage `
  -Signals @(
    "Authorization",
    "Bearer",
    "getIdToken"
  )

Check-Signals `
  -Label "Teacher status client Bearer authorization" `
  -Path $teacherPage `
  -Signals @(
    "Authorization",
    "Bearer",
    "getIdToken"
  )

Check-Signals `
  -Label "Teacher-request server authorization" `
  -Path $requestRoute `
  -Signals @(
    "authorization",
    "verifyIdToken",
    'role !==',
    '"admin"'
  )

Check-Signals `
  -Label "Teacher status target-role guard" `
  -Path $statusRoute `
  -Signals @(
    "authorization",
    "verifyIdToken",
    'teacherData?.role !==',
    '"teacher"',
    "statusUpdatedBy"
  )

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

  if ($lintExit -eq 0) {
    $lintStatus = "PASS"
    Write-Host "ESLint: PASS" -ForegroundColor Green
  }
  else {
    $lintStatus = "FAIL"
    Write-Host "ESLint: FAIL" -ForegroundColor Red
  }

  Write-Host ""
  Write-Host "Running production build..." -ForegroundColor Cyan
  & npm.cmd run build
  $buildExit = $LASTEXITCODE

  if ($buildExit -eq 0) {
    $buildStatus = "PASS"
    Write-Host "Production build: PASS" -ForegroundColor Green
  }
  else {
    $buildStatus = "FAIL"
    Write-Host "Production build: FAIL" -ForegroundColor Red
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

$lines.Add("CS MASTER - ADMIN + PRODUCTION FINAL REMEDIATION")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add("Standardised admin API authentication on Authorization: Bearer Firebase ID tokens.")
$lines.Add("Teacher status management now validates that the target account is actually")
$lines.Add("a teacher before changing Firebase Auth disabled state or Firestore status.")
$lines.Add("Teacher access approval also refuses to convert administrator accounts.")
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
$lines.Add("ADMIN + PRODUCTION PHASE STATUS")
$lines.Add("-------------------------------")
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
  Write-Host "Admin + Production status: PASS" -ForegroundColor Green
}
else {
  Write-Host "Admin + Production status: NOT YET PASSED" -ForegroundColor Yellow
}