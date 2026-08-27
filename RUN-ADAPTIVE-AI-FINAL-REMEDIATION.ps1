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

$backup = Join-Path $parent "$name-adaptive-ai-final-remediation-backup-$stamp"
$summary = Join-Path $ProjectRoot "ADAPTIVE-AI-FINAL-REMEDIATION-SUMMARY.txt"

$routePath = Join-Path $ProjectRoot "app\api\ai\student-tutor\route.ts"
$servicePath = Join-Path $ProjectRoot "services\studentTutorService.ts"

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

if (-not (Test-Path -LiteralPath $routePath -PathType Leaf)) {
  throw "Student tutor API route was not found: $routePath"
}

if (-not (Test-Path -LiteralPath $servicePath -PathType Leaf)) {
  throw "Student tutor service was not found: $servicePath"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - ADAPTIVE + AI TUTOR FINAL REMEDIATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

# ------------------------------------------------------------
# 1. Harden client tutor request with Firebase ID token.
# ------------------------------------------------------------

$service = [System.IO.File]::ReadAllText($servicePath)
$originalService = $service

$service = $service.Replace(
  'import { db } from "@/lib/firebase";',
  'import { auth, db } from "@/lib/firebase";'
)

$oldRequest = @'
export async function requestTutorResponse(input: {
  studentId: string;
  conversationId: string;
  message: string;
  history: { role: "student" | "assistant"; content: string }[];
  context: TutorStudentContext;
}): Promise<TutorResponse> {
  const r = await fetch("/api/ai/student-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "The tutor could not respond.");
  return j as TutorResponse;
}
'@

$newRequest = @'
export async function requestTutorResponse(input: {
  studentId: string;
  conversationId: string;
  message: string;
  history: { role: "student" | "assistant"; content: string }[];
  context: TutorStudentContext;
}): Promise<TutorResponse> {
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== input.studentId) {
    throw new Error(
      "Sign in with the student account using the AI Tutor.",
    );
  }

  const idToken = await currentUser.getIdToken();

  const r = await fetch("/api/ai/student-tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  });

  const j = await r.json();

  if (!r.ok) {
    throw new Error(
      j.error || "The tutor could not respond.",
    );
  }

  return j as TutorResponse;
}
'@

if (-not $service.Contains($oldRequest)) {
  if (-not $service.Contains("Authorization: `Bearer ${idToken}`")) {
    throw "The audited requestTutorResponse block could not be found. No safe client replacement was made."
  }
}
else {
  Backup-File -Path $servicePath
  $service = $service.Replace($oldRequest, $newRequest)
  Write-Utf8NoBom -Path $servicePath -Content $service
  Write-Host "[FIX] Added authenticated Firebase ID-token tutor requests." -ForegroundColor Green
}

# ------------------------------------------------------------
# 2. Replace student tutor API with authenticated, validated,
#    output-sanitised implementation.
# ------------------------------------------------------------

Backup-File -Path $routePath

$route = @'
import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  TutorResponse,
  TutorStudentContext,
} from "@/types/studentTutor";

type TutorHistoryItem = {
  role: "student" | "assistant";
  content: string;
};

type Body = {
  studentId: string;
  message: string;
  history: TutorHistoryItem[];
  context: TutorStudentContext;
};

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
  }>;
};

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

function isTutorHistory(
  value: unknown,
): value is TutorHistoryItem[] {
  return (
    Array.isArray(value) &&
    value.length <= 12 &&
    value.every((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate =
        item as Partial<TutorHistoryItem>;

      return (
        (candidate.role === "student" ||
          candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0 &&
        candidate.content.length <= 4000
      );
    })
  );
}

function isTutorContext(
  value: unknown,
  studentId: string,
): value is TutorStudentContext {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Partial<TutorStudentContext>;

  return (
    candidate.studentId === studentId &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.qualification === "string" &&
    typeof candidate.examBoard === "string" &&
    typeof candidate.currentCourse === "string" &&
    typeof candidate.combinedAverage === "number" &&
    Number.isFinite(candidate.combinedAverage) &&
    Array.isArray(candidate.priorityTopics) &&
    Array.isArray(candidate.recommendedActions)
  );
}

function isValidBody(
  value: unknown,
): value is Body {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Partial<Body>;
  const studentId = clean(body.studentId);

  return (
    Boolean(studentId) &&
    studentId.length <= 160 &&
    typeof body.message === "string" &&
    body.message.trim().length > 0 &&
    body.message.length <= 2000 &&
    isTutorHistory(body.history) &&
    isTutorContext(
      body.context,
      studentId,
    )
  );
}

async function verifyFirebaseStudent(
  request: Request,
  studentId: string,
): Promise<
  | { ok: true }
  | {
      ok: false;
      status: number;
      error: string;
    }
> {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      error:
        "A signed-in student session is required.",
    };
  }

  const idToken =
    authorization.slice("Bearer ".length).trim();

  if (!idToken) {
    return {
      ok: false,
      status: 401,
      error:
        "A signed-in student session is required.",
    };
  }

  const apiKey =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "Student authentication verification is not configured.",
    };
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
        apiKey,
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        status: 401,
        error:
          "Your student session could not be verified. Sign in again.",
      };
    }

    const result =
      (await response.json()) as FirebaseLookupResponse;

    const verifiedUid =
      result.users?.[0]?.localId || "";

    if (
      !verifiedUid ||
      verifiedUid !== studentId
    ) {
      return {
        ok: false,
        status: 403,
        error:
          "You cannot request tutor support for another student account.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error(
      "Firebase tutor authentication check failed:",
      error,
    );

    return {
      ok: false,
      status: 503,
      error:
        "Student session verification is temporarily unavailable.",
    };
  }
}

function safeSuggestedPrompts(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(clean)
    .filter(Boolean)
    .map((item) => item.slice(0, 180))
    .slice(0, 4);
}

function safeRecommendations(
  value: unknown,
): TutorResponse["recommendations"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowedTypes =
    new Set(["lesson", "quiz", "exam"]);

  return value
    .flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const candidate = item as {
        title?: unknown;
        description?: unknown;
        href?: unknown;
        type?: unknown;
      };

      const title = clean(candidate.title);
      const description =
        clean(candidate.description);
      const href = clean(candidate.href);
      const type = clean(candidate.type);

      if (
        !title ||
        !description ||
        !href.startsWith("/") ||
        href.startsWith("//") ||
        !allowedTypes.has(type)
      ) {
        return [];
      }

      return [
        {
          title: title.slice(0, 120),
          description:
            description.slice(0, 400),
          href: href.slice(0, 500),
          type:
            type as "lesson" | "quiz" | "exam",
        },
      ];
    })
    .slice(0, 3);
}

function demo(
  body: Body,
  warning?: string,
): TutorResponse {
  const context = body.context;
  const first =
    context.name.split(" ")[0] || "Student";

  const topic =
    context.priorityTopics[0]?.topic ||
    context.recommendedActions[0]?.topic ||
    "Computer Science";

  const message =
    body.message.toLowerCase();

  let reply = "";

  if (/^(hi|hello|hey)/.test(message)) {
    reply =
      `Hi ${first}. Your combined average is ${context.combinedAverage}% and ` +
      `your predicted grade is ${context.predictedGrade}. ` +
      `${
        context.priorityTopics.length
          ? `Your main priority is ${topic}.`
          : "You have no high-priority topic currently."
      } What would you like help with?`;
  } else if (
    /revision plan|study plan|what should i revise/.test(
      message,
    )
  ) {
    reply = `Here is a focused plan for ${topic}:

1. Review the core lesson for 10 minutes.
2. Write three facts from memory.
3. Complete a short retrieval quiz.
4. Attempt one exam-style question.
5. Compare your answer with the mark scheme.

Aim for 25-30 minutes.`;
  } else if (
    /predicted grade|what grade/.test(
      message,
    )
  ) {
    reply =
      `Your current platform estimate is grade ${context.currentGrade}, ` +
      `with a predicted grade of ${context.predictedGrade}. ` +
      "This is not an official or guaranteed exam-board prediction.";
  } else {
    reply =
      `Let us work through that, ${first}. Start by telling me what you already know ` +
      "or the exact step that is confusing. Use this structure: definition -> process -> " +
      `example -> exam wording. Your current priority topic is ${topic}, so I will ` +
      "connect the explanation to it when relevant.";
  }

  return {
    reply,
    mode: "demo",
    suggestedPrompts: [
      `Explain ${topic} simply`,
      `Quiz me on ${topic}`,
      "Create a 25-minute revision plan",
      "How can I reach the next grade?",
    ],
    recommendations:
      context.recommendedActions
        .slice(0, 3)
        .map((action) => ({
          title: action.title,
          description:
            action.description,
          href: action.href,
          type: action.type,
        })),
    warning,
  };
}

function prompt(body: Body) {
  return `You are CS Master, a supportive UK secondary Computer Science tutor.

Student context:
${JSON.stringify(body.context, null, 2)}

Recent conversation:
${JSON.stringify(body.history.slice(-8), null, 2)}

Student message:
${body.message}

Use clear UK English.
Teach through explanation and checking questions.
Do not give unexplained answers to assessed work.
Do not help the learner bypass assessment integrity controls.
Never claim predicted grades are official or guaranteed.
Use only the supplied student context for personal performance claims.
Do not invent exam-board requirements.
Keep under 350 words.
Return JSON only:
{"reply":"string","suggestedPrompts":["string"],"recommendations":[{"title":"string","description":"string","href":"string","type":"lesson|quiz|exam"}]}`;
}

export async function POST(
  request: Request,
) {
  try {
    const rawBody: unknown =
      await request.json();

    if (!isValidBody(rawBody)) {
      return NextResponse.json(
        {
          error:
            "A valid tutor request is required.",
        },
        { status: 400 },
      );
    }

    const body = rawBody;

    const verified =
      await verifyFirebaseStudent(
        request,
        body.studentId,
      );

    if (!verified.ok) {
      return NextResponse.json(
        {
          error: verified.error,
        },
        {
          status: verified.status,
        },
      );
    }

    if (
      process.env
        .AI_STUDENT_TUTOR_DEMO_MODE ===
      "true"
    ) {
      return NextResponse.json(
        demo(
          body,
          "Demo tutor mode is enabled.",
        ),
      );
    }

    const key =
      process.env.OPENAI_API_KEY;

    if (!key) {
      return NextResponse.json(
        {
          error:
            "AI Tutor is temporarily unavailable because live AI is not configured.",
        },
        { status: 503 },
      );
    }

    try {
      const client =
        new OpenAI({
          apiKey: key,
        });

      const completion =
        await client.chat.completions.create(
          {
            model:
              process.env
                .OPENAI_STUDENT_TUTOR_MODEL ||
              "gpt-4.1-mini",
            temperature: 0.3,
            response_format: {
              type: "json_object",
            },
            messages: [
              {
                role: "system",
                content:
                  "You are a careful UK secondary Computer Science tutor. Return valid JSON only.",
              },
              {
                role: "user",
                content: prompt(body),
              },
            ],
          },
        );

      const text =
        completion.choices[0]?.message
          .content;

      if (!text) {
        throw new Error(
          "No tutor response.",
        );
      }

      const parsed =
        JSON.parse(text) as {
          reply?: unknown;
          suggestedPrompts?: unknown;
          recommendations?: unknown;
        };

      const reply =
        clean(parsed.reply).slice(
          0,
          6000,
        );

      if (!reply) {
        throw new Error(
          "The tutor returned an invalid response.",
        );
      }

      return NextResponse.json({
        reply,
        mode: "live",
        suggestedPrompts:
          safeSuggestedPrompts(
            parsed.suggestedPrompts,
          ),
        recommendations:
          safeRecommendations(
            parsed.recommendations,
          ),
      } satisfies TutorResponse);
    } catch (error) {
      console.error(
        "Live tutor unavailable:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "AI Tutor is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error(
      "Tutor route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The tutor could not respond.",
      },
      { status: 500 },
    );
  }
}
'@

Write-Utf8NoBom -Path $routePath -Content $route
Write-Host "[FIX] Hardened student tutor API authentication, validation and AI-output sanitisation." -ForegroundColor Green

# ------------------------------------------------------------
# 3. Integration checks
# ------------------------------------------------------------

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

function Check-Contains {
  param(
    [string]$Label,
    [string]$Path,
    [string[]]$Needles
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    $failed.Add("$Label - file missing")
    return
  }

  $text = [System.IO.File]::ReadAllText($Path)
  $missingSignals = @(
    $Needles |
      Where-Object {
        -not $text.Contains($_)
      }
  )

  if ($missingSignals.Count -eq 0) {
    $checks.Add("[OK] $Label")
  }
  else {
    $failed.Add(
      "$Label - missing: $($missingSignals -join ', ')"
    )
  }
}

Check-Contains `
  -Label "Tutor authenticated client request" `
  -Path $servicePath `
  -Needles @(
    "auth.currentUser",
    "getIdToken",
    "Authorization"
  )

Check-Contains `
  -Label "Tutor server identity verification" `
  -Path $routePath `
  -Needles @(
    "accounts:lookup",
    "verifiedUid !== studentId",
    "A signed-in student session is required"
  )

Check-Contains `
  -Label "Tutor context ownership validation" `
  -Path $routePath `
  -Needles @(
    "candidate.studentId === studentId",
    "isTutorContext"
  )

Check-Contains `
  -Label "Tutor AI output sanitisation" `
  -Path $routePath `
  -Needles @(
    "safeSuggestedPrompts",
    "safeRecommendations",
    'href.startsWith("/")'
  )

$adaptivePath = Join-Path $ProjectRoot "services\adaptiveLearningService.ts"

Check-Contains `
  -Label "Adaptive evidence aggregation" `
  -Path $adaptivePath `
  -Needles @(
    "quizResults",
    "assignmentResults",
    "getStudentExamAssignments",
    "getStudentInterventions",
    "calculateNextReviewDate"
  )

# ------------------------------------------------------------
# 4. Genuine unfinished-marker scan
# ------------------------------------------------------------

$scanRoots = @(
  "app\adaptive-learning",
  "app\tutor",
  "app\api\ai\student-tutor",
  "components\adaptive",
  "components\tutor",
  "services\adaptiveLearningService.ts",
  "services\studentTutorContextService.ts",
  "services\studentTutorService.ts"
)

$patterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "disabled={true}"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $scanRoots) {
  $path = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $path)) {
    continue
  }

  $targetFiles =
    if (Test-Path -LiteralPath $path -PathType Container) {
      @(Get-ChildItem -LiteralPath $path -Recurse -File -Include *.ts,*.tsx)
    }
    else {
      @(Get-Item -LiteralPath $path)
    }

  foreach ($file in $targetFiles) {
    foreach ($pattern in $patterns) {
      $matches = Select-String `
        -LiteralPath $file.FullName `
        -SimpleMatch `
        -Pattern $pattern `
        -ErrorAction SilentlyContinue

      foreach ($match in $matches) {
        $relative =
          $file.FullName.Substring(
            $ProjectRoot.Length
          ).TrimStart("\")

        $markers.Add(
          "${relative}:$($match.LineNumber): $($match.Line.Trim())"
        )
      }
    }
  }
}

# ------------------------------------------------------------
# 5. ESLint + production build
# ------------------------------------------------------------

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
  $markers.Count -eq 0 -and
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS"
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add("CS MASTER - ADAPTIVE LEARNING + AI TUTOR FINAL REMEDIATION")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add("Hardened AI Student Tutor production access.")
$lines.Add("Tutor requests now carry the signed-in Firebase ID token.")
$lines.Add("The server verifies the token against Firebase Auth and requires the")
$lines.Add("verified UID to match the requested student account.")
$lines.Add("Tutor payload size/history/context are validated and live AI links/prompts")
$lines.Add("are sanitised before being returned to the student UI.")
$lines.Add("")
$lines.Add("INTEGRATION CHECKS")
$lines.Add("------------------")

foreach ($item in $checks) {
  $lines.Add($item)
}

foreach ($item in $failed) {
  $lines.Add("[FAIL] $item")
}

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
$lines.Add("ADAPTIVE + AI PHASE STATUS")
$lines.Add("--------------------------")
$lines.Add($status)
$lines.Add("")
$lines.Add("PRODUCTION NOTE")
$lines.Add("---------------")
$lines.Add("Firebase ID-token verification uses the Firebase Auth accounts:lookup endpoint")
$lines.Add("with NEXT_PUBLIC_FIREBASE_API_KEY (or FIREBASE_API_KEY).")
$lines.Add("Predicted grades remain platform estimates, not guaranteed official grades.")

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ADAPTIVE + AI FINAL REMEDIATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Adaptive + AI status: $status" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Yellow" })