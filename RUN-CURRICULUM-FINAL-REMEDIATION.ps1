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

$backup = Join-Path $parent "$name-curriculum-final-remediation-backup-$stamp"
$summary = Join-Path $ProjectRoot "CURRICULUM-FINAL-REMEDIATION-SUMMARY.txt"

$onboardingPath = Join-Path $ProjectRoot "app\onboarding\page.tsx"
$profilePath = Join-Path $ProjectRoot "app\profile\curriculum\page.tsx"
$lessonPagePath = Join-Path $ProjectRoot "app\learn\[topicId]\page.tsx"
$gatePath = Join-Path $ProjectRoot "components\lesson\CurriculumLessonGate.tsx"
$optionsPath = Join-Path $ProjectRoot "data\curriculum\supportedCurriculumOptions.ts"
$registryPath = Join-Path $ProjectRoot "data\curriculum\curriculumRegistry.ts"
$mapPath = Join-Path $ProjectRoot "data\curriculum\curriculumMap.ts"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    return
  }

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

  $directory = Split-Path -Parent $Path

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - CURRICULUM FINAL REMEDIATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

foreach ($required in @(
  $onboardingPath,
  $profilePath,
  $lessonPagePath,
  $registryPath,
  $mapPath
)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "Required curriculum source file was not found: $required"
  }
}

# ------------------------------------------------------------
# 1. Centralise supported qualification / exam-board combinations.
#    Current published A-level curricula are AQA and OCR.
#    Edexcel remains available for GCSE.
# ------------------------------------------------------------

$optionsSource = @'
import {
  curriculumDefinitions,
  getCurriculumDefinition,
} from "@/data/curriculum/curriculumMap";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export function getSupportedExamBoards(
  qualification: Qualification,
): ExamBoard[] {
  return Array.from(
    new Set(
      curriculumDefinitions
        .filter(
          (curriculum) =>
            curriculum.qualification ===
            qualification,
        )
        .map(
          (curriculum) =>
            curriculum.examBoard,
        ),
    ),
  );
}

export function isSupportedCurriculumSelection(
  qualification: Qualification,
  examBoard: ExamBoard,
): boolean {
  return Boolean(
    getCurriculumDefinition(
      qualification,
      examBoard,
    ),
  );
}
'@

if (Test-Path -LiteralPath $optionsPath -PathType Leaf) {
  Backup-File -Path $optionsPath
}

Write-Utf8NoBom -Path $optionsPath -Content $optionsSource
Write-Host "[FIX] Added central supported curriculum-option resolver." -ForegroundColor Green

# ------------------------------------------------------------
# 2. Harden onboarding board choices + validation.
# ------------------------------------------------------------

$onboarding = [System.IO.File]::ReadAllText($onboardingPath)
$originalOnboarding = $onboarding

$importAnchor =
  'import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";'

$importReplacement = @'
import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import { getSupportedExamBoards } from "@/data/curriculum/supportedCurriculumOptions";
'@

if ($onboarding.Contains($importAnchor) -and
    -not $onboarding.Contains("getSupportedExamBoards")) {
  $onboarding =
    $onboarding.Replace(
      $importAnchor,
      $importReplacement
    )
}

$stateAnchor = @'
  const [examBoard, setExamBoard] =
    useState<ExamBoard>("AQA");

  const [submitting, setSubmitting] =
'@

$stateReplacement = @'
  const [examBoard, setExamBoard] =
    useState<ExamBoard>("AQA");

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

  const [submitting, setSubmitting] =
'@

if ($onboarding.Contains($stateAnchor) -and
    -not $onboarding.Contains("function selectQualification")) {
  $onboarding =
    $onboarding.Replace(
      $stateAnchor,
      $stateReplacement
    )
}

$oldQualificationChange = @'
                          onChange={() =>
                            setQualification(
                              option.value,
                            )
                          }
'@

$newQualificationChange = @'
                          onChange={() =>
                            selectQualification(
                              option.value,
                            )
                          }
'@

if ($onboarding.Contains($oldQualificationChange)) {
  $onboarding =
    $onboarding.Replace(
      $oldQualificationChange,
      $newQualificationChange
    )
}

$onboarding =
  $onboarding.Replace(
    '{examBoardOptions.map(',
    '{examBoardOptions.filter((option) => getSupportedExamBoards(qualification).includes(option.value)).map('
  )

$submitAnchor = @'
    if (!user) {
      setError(
        "You must be signed in to complete your profile.",
      );
      return;
    }

    setSubmitting(true);
'@

$submitReplacement = @'
    if (!user) {
      setError(
        "You must be signed in to complete your profile.",
      );
      return;
    }

    if (
      !getCurriculumDefinition(
        qualification,
        examBoard,
      )
    ) {
      setError(
        "This qualification and exam-board combination is not currently published.",
      );
      return;
    }

    setSubmitting(true);
'@

if ($onboarding.Contains($submitAnchor) -and
    -not $onboarding.Contains("This qualification and exam-board combination is not currently published.")) {
  $onboarding =
    $onboarding.Replace(
      $submitAnchor,
      $submitReplacement
    )
}

if ($onboarding -eq $originalOnboarding) {
  throw "No onboarding curriculum changes were applied."
}

Backup-File -Path $onboardingPath
Write-Utf8NoBom -Path $onboardingPath -Content $onboarding
Write-Host "[FIX] Onboarding now exposes only published board/qualification combinations." -ForegroundColor Green

# ------------------------------------------------------------
# 3. Harden curriculum settings board choices.
# ------------------------------------------------------------

$profile = [System.IO.File]::ReadAllText($profilePath)
$originalProfile = $profile

$profileImportAnchor =
  'import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";'

$profileImportReplacement = @'
import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import { getSupportedExamBoards } from "@/data/curriculum/supportedCurriculumOptions";
'@

if ($profile.Contains($profileImportAnchor) -and
    -not $profile.Contains("getSupportedExamBoards")) {
  $profile =
    $profile.Replace(
      $profileImportAnchor,
      $profileImportReplacement
    )
}

$profileStateAnchor = @'
  const [examBoard, setExamBoard] = useState<ExamBoard>("AQA");

  const [submitting, setSubmitting] = useState(false);
'@

$profileStateReplacement = @'
  const [examBoard, setExamBoard] = useState<ExamBoard>("AQA");

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

  const [submitting, setSubmitting] = useState(false);
'@

if ($profile.Contains($profileStateAnchor) -and
    -not $profile.Contains("function selectQualification")) {
  $profile =
    $profile.Replace(
      $profileStateAnchor,
      $profileStateReplacement
    )
}

$profile =
  $profile.Replace(
    'onChange={() => setQualification(option.value)}',
    'onChange={() => selectQualification(option.value)}'
  )

$profile =
  $profile.Replace(
    '{examBoardOptions.map((option) => {',
    '{examBoardOptions.filter((option) => getSupportedExamBoards(qualification).includes(option.value)).map((option) => {'
  )

if ($profile -eq $originalProfile) {
  throw "No curriculum-settings changes were applied."
}

Backup-File -Path $profilePath
Write-Utf8NoBom -Path $profilePath -Content $profile
Write-Host "[FIX] Curriculum settings now expose only published board combinations." -ForegroundColor Green

# ------------------------------------------------------------
# 4. Enforce selected curriculum on direct lesson URLs.
# ------------------------------------------------------------

$gateSource = @'
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";

export default function CurriculumLessonGate({
  topicId,
  children,
}: {
  topicId: string;
  children: ReactNode;
}) {
  const {
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  if (
    loading ||
    (!profileReady &&
      !profileError)
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-bold text-slate-600">
          Checking your curriculum...
        </p>
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Curriculum check unavailable
        </h1>

        <p className="mt-3 text-red-800">
          {profileError}
        </p>
      </section>
    );
  }

  /*
   * Teacher/admin users may preview curriculum content.
   * Student access is restricted to the qualification and
   * exam board stored in the student profile.
   */
  if (
    profile?.role !== "student"
  ) {
    return <>{children}</>;
  }

  if (
    !profile.qualification ||
    !profile.examBoard
  ) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Curriculum selection required
        </h1>

        <p className="mt-3 text-amber-800">
          Select your qualification and exam board before opening lessons.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-6 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-black text-white"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  const coverage =
    getCurriculumCoverage(
      profile.qualification,
      profile.examBoard,
    );

  const allowed =
    Boolean(coverage) &&
    coverage!.units.some(
      (unit) =>
        unit.topics.some(
          (topic) =>
            topic.id === topicId,
        ),
    );

  if (!allowed) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-sm font-black uppercase tracking-wide text-amber-700">
          Curriculum restricted
        </p>

        <h1 className="mt-2 text-2xl font-black text-amber-950">
          This topic is not mapped to your selected curriculum
        </h1>

        <p className="mt-3 text-amber-800">
          Your current selection is{" "}
          {profile.examBoard}{" "}
          {profile.qualification ===
          "A_LEVEL"
            ? "A-level"
            : "GCSE"}.
        </p>

        <Link
          href="/learn"
          className="mt-6 inline-flex rounded-xl bg-amber-700 px-5 py-3 font-black text-white"
        >
          Back to my curriculum
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
'@

if (Test-Path -LiteralPath $gatePath -PathType Leaf) {
  Backup-File -Path $gatePath
}

Write-Utf8NoBom -Path $gatePath -Content $gateSource

$lessonPage = [System.IO.File]::ReadAllText($lessonPagePath)
$originalLessonPage = $lessonPage

$lessonImportAnchor =
  'import LessonNavigation from "@/components/lesson/LessonNavigation";'

$lessonImportReplacement = @'
import LessonNavigation from "@/components/lesson/LessonNavigation";
import CurriculumLessonGate from "@/components/lesson/CurriculumLessonGate";
'@

if ($lessonPage.Contains($lessonImportAnchor) -and
    -not $lessonPage.Contains("CurriculumLessonGate")) {
  $lessonPage =
    $lessonPage.Replace(
      $lessonImportAnchor,
      $lessonImportReplacement
    )
}

$oldReturn = @'
  return (
    <div className="space-y-8">
      <LessonNavigation
        topicId={topicId}
        currentIndex={lessonIndex}
        totalLessons={topic.lessons.length}
        previousLessonId={previousLesson?.id}
        nextLessonId={nextLesson?.id}
      />

      <LessonRenderer
        lesson={currentLesson}
        topicId={topicId}
        nextLessonId={nextLesson?.id}
        topicSimulator={topic.simulator}
      />
    </div>
  );
'@

$newReturn = @'
  return (
    <CurriculumLessonGate
      topicId={topicId}
    >
      <div className="space-y-8">
        <LessonNavigation
          topicId={topicId}
          currentIndex={lessonIndex}
          totalLessons={topic.lessons.length}
          previousLessonId={previousLesson?.id}
          nextLessonId={nextLesson?.id}
        />

        <LessonRenderer
          lesson={currentLesson}
          topicId={topicId}
          nextLessonId={nextLesson?.id}
          topicSimulator={topic.simulator}
        />
      </div>
    </CurriculumLessonGate>
  );
'@

if ($lessonPage.Contains($oldReturn)) {
  $lessonPage =
    $lessonPage.Replace(
      $oldReturn,
      $newReturn
    )
}
elseif (-not $lessonPage.Contains("<CurriculumLessonGate")) {
  throw "Could not safely wrap the lesson page in the curriculum gate."
}

if ($lessonPage -ne $originalLessonPage) {
  Backup-File -Path $lessonPagePath
  Write-Utf8NoBom -Path $lessonPagePath -Content $lessonPage
}

Write-Host "[FIX] Direct lesson URLs now respect the student's selected curriculum." -ForegroundColor Green

# ------------------------------------------------------------
# 5. Extend the curriculum registry with published A-level topics.
# ------------------------------------------------------------

$registry = [System.IO.File]::ReadAllText($registryPath)
$originalRegistry = $registry

if (-not $registry.Contains('id: "advanced-programming"')) {
  $insertAnchor = @'
];

export const curriculumRegistry: CurriculumTopicDefinition[] =
'@

  $aLevelEntries = @'
  {
    id: "advanced-programming",
    title: "Advanced Programming",
    unitId: "algorithms-programming",
    unitTitle: "A-level Programming",
    aliases: ["advanced programming", "object oriented programming", "oop", "recursion", "advanced python"],
    prerequisites: ["programming"],
    displayOrder: 180,
  },
  {
    id: "functional-programming",
    title: "Functional Programming",
    unitId: "algorithms-programming",
    unitTitle: "A-level Programming",
    aliases: ["functional programming", "pure functions", "higher order functions", "functional paradigm"],
    prerequisites: ["advanced-programming"],
    displayOrder: 190,
  },
  {
    id: "software-development",
    title: "Software Development",
    unitId: "algorithms-programming",
    unitTitle: "Software Development",
    aliases: ["software development", "software lifecycle", "testing strategies", "development methodologies"],
    prerequisites: ["programming"],
    displayOrder: 200,
  },
  {
    id: "data-structures",
    title: "Advanced Data Structures",
    unitId: "algorithms-programming",
    unitTitle: "Data Structures and Algorithms",
    aliases: ["data structures", "stack", "queue", "tree", "graph", "linked list", "hash table"],
    prerequisites: ["algorithms", "programming"],
    displayOrder: 210,
  },
  {
    id: "computational-thinking",
    title: "Computational Thinking",
    unitId: "algorithms-programming",
    unitTitle: "Computational Thinking",
    aliases: ["computational thinking", "abstraction", "decomposition", "problem solving", "algorithmic thinking"],
    prerequisites: ["algorithms"],
    displayOrder: 220,
  },
  {
    id: "theory-computation",
    title: "Theory of Computation",
    unitId: "algorithms-programming",
    unitTitle: "Theory of Computation",
    aliases: ["theory of computation", "finite state machine", "regular expressions", "turing machine", "computability"],
    prerequisites: ["algorithms"],
    displayOrder: 230,
  },
  {
    id: "advanced-data-representation",
    title: "Advanced Data Representation",
    unitId: "data-representation",
    unitTitle: "A-level Data Representation",
    aliases: ["advanced data representation", "floating point", "signed binary", "two's complement", "advanced number representation"],
    prerequisites: ["binary", "hexadecimal"],
    displayOrder: 240,
  },
  {
    id: "advanced-systems",
    title: "Advanced Computer Systems",
    unitId: "computer-systems",
    unitTitle: "A-level Computer Systems",
    aliases: ["advanced systems", "processor architecture", "instruction sets", "memory hierarchy", "virtual machines"],
    prerequisites: ["cpu", "memory-storage"],
    displayOrder: 250,
  },
  {
    id: "advanced-networks",
    title: "Advanced Networks",
    unitId: "networks-security",
    unitTitle: "A-level Networks and Security",
    aliases: ["advanced networks", "network layers", "routing", "tcp ip", "encryption", "network security"],
    prerequisites: ["networks", "cyber-security"],
    displayOrder: 260,
  },
  {
    id: "advanced-databases",
    title: "Advanced Databases",
    unitId: "data-management" as CurriculumTopicDefinition["unitId"],
    unitTitle: "A-level Databases",
    aliases: ["advanced databases", "normalisation", "transactions", "joins", "relational design"],
    prerequisites: ["databases"],
    displayOrder: 270,
  },
  {
    id: "big-data",
    title: "Big Data",
    unitId: "data-management" as CurriculumTopicDefinition["unitId"],
    unitTitle: "A-level Data and Society",
    aliases: ["big data", "volume velocity variety", "distributed data", "large datasets", "data bias"],
    prerequisites: ["databases"],
    displayOrder: 280,
  },
  {
    id: "legal-ethical-a-level",
    title: "A-level Legal, Ethical and Cultural Issues",
    unitId: "data-management" as CurriculumTopicDefinition["unitId"],
    unitTitle: "Consequences of Computing",
    aliases: ["a level ethical issues", "a level legal issues", "moral issues", "cultural issues", "consequences of computing"],
    prerequisites: ["ethical-legal"],
    displayOrder: 290,
  },
];

export const curriculumRegistry: CurriculumTopicDefinition[] =
'@

  if (-not $registry.Contains($insertAnchor)) {
    throw "Could not locate the curriculum registry insertion point."
  }

  $registry =
    $registry.Replace(
      $insertAnchor,
      $aLevelEntries
    )

  Backup-File -Path $registryPath
  Write-Utf8NoBom -Path $registryPath -Content $registry
  Write-Host "[FIX] Added all published A-level topics to the central curriculum registry." -ForegroundColor Green
}
else {
  Write-Host "[OK] A-level registry entries were already present." -ForegroundColor Green
}

# ------------------------------------------------------------
# 6. Verification checks.
# ------------------------------------------------------------

$checks = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

function Check-Signals {
  param(
    [string]$Label,
    [string]$Path,
    [string[]]$Signals
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    $failed.Add("$Label - file missing")
    return
  }

  $content = [System.IO.File]::ReadAllText($Path)

  $missingSignals = @(
    $Signals |
      Where-Object {
        -not $content.Contains($_)
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

$typeFile =
  Join-Path $ProjectRoot "types\curriculum.ts"

$typeIndex =
  Join-Path $ProjectRoot "types\curriculum\index.ts"

if (
  (Test-Path -LiteralPath $typeFile -PathType Leaf) -or
  (Test-Path -LiteralPath $typeIndex -PathType Leaf)
) {
  $checks.Add(
    "[OK] Curriculum type module resolves"
  )
}
else {
  $failed.Add(
    "Curriculum type module not found as types\curriculum.ts or types\curriculum\index.ts"
  )
}

Check-Signals `
  -Label "All three GCSE boards published" `
  -Path $mapPath `
  -Signals @(
    'qualification: "GCSE"',
    'examBoard: "AQA"',
    'examBoard: "OCR"',
    'examBoard: "EDEXCEL"'
  )

Check-Signals `
  -Label "A-level AQA and OCR published" `
  -Path $mapPath `
  -Signals @(
    'qualification: "A_LEVEL"',
    'title: "AQA A-level Computer Science"',
    'title: "OCR A-level Computer Science"'
  )

Check-Signals `
  -Label "Published-board filtering wired" `
  -Path $optionsPath `
  -Signals @(
    "getSupportedExamBoards",
    "curriculumDefinitions"
  )

Check-Signals `
  -Label "Onboarding rejects unpublished combinations" `
  -Path $onboardingPath `
  -Signals @(
    "getSupportedExamBoards",
    "getCurriculumDefinition",
    "selectQualification"
  )

Check-Signals `
  -Label "Curriculum settings reject unpublished combinations" `
  -Path $profilePath `
  -Signals @(
    "getSupportedExamBoards",
    "getCurriculumDefinition",
    "selectQualification"
  )

Check-Signals `
  -Label "Direct lesson curriculum gate" `
  -Path $lessonPagePath `
  -Signals @(
    "CurriculumLessonGate",
    "topicId={topicId}"
  )

Check-Signals `
  -Label "Student lesson gate uses curriculum coverage" `
  -Path $gatePath `
  -Signals @(
    "getCurriculumCoverage",
    'profile?.role !== "student"',
    "topic.id === topicId"
  )

Check-Signals `
  -Label "A-level topics registered centrally" `
  -Path $registryPath `
  -Signals @(
    'id: "advanced-programming"',
    'id: "data-structures"',
    'id: "advanced-data-representation"',
    'id: "advanced-systems"',
    'id: "advanced-networks"',
    'id: "advanced-databases"',
    'id: "legal-ethical-a-level"'
  )

# ------------------------------------------------------------
# 7. Genuine unfinished marker scan.
# ------------------------------------------------------------

$markerPatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step"
)

$markers = New-Object System.Collections.Generic.List[string]

foreach ($path in @(
  $onboardingPath,
  $profilePath,
  $lessonPagePath,
  $gatePath,
  $optionsPath,
  $registryPath,
  $mapPath
)) {
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    continue
  }

  foreach ($pattern in $markerPatterns) {
    $matches = Select-String `
      -LiteralPath $path `
      -SimpleMatch `
      -Pattern $pattern `
      -ErrorAction SilentlyContinue

    foreach ($match in $matches) {
      $relative =
        $path.Substring(
          $ProjectRoot.Length
        ).TrimStart("\")

      $markers.Add(
        "${relative}:$($match.LineNumber): $($match.Line.Trim())"
      )
    }
  }
}

# ------------------------------------------------------------
# 8. ESLint + production build.
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

# ------------------------------------------------------------
# 9. Summary.
# ------------------------------------------------------------

$lines = New-Object System.Collections.Generic.List[string]

$lines.Add(
  "CS MASTER - CURRICULUM FINAL REMEDIATION"
)
$lines.Add(
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)
$lines.Add(
  "Project: $ProjectRoot"
)
$lines.Add(
  "Backup: $backup"
)
$lines.Add("")
$lines.Add("CHANGE")
$lines.Add("------")
$lines.Add("Restricted board selection to combinations actually published in curriculumMap.")
$lines.Add("GCSE supports AQA, OCR and Pearson Edexcel.")
$lines.Add("A-level currently supports AQA and OCR in the UK curriculum architecture.")
$lines.Add("Direct student lesson URLs now enforce the selected qualification/exam board.")
$lines.Add("All existing published A-level topic IDs are now included in the central")
$lines.Add("curriculum registry for aliases, dependencies and adaptive integration.")
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

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CURRICULUM FINAL REMEDIATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
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