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
$backup = Join-Path $parent "$name-t-final-1c-backup-$stamp"
$summary = Join-Path $ProjectRoot "T-FINAL-1C-SUMMARY.txt"
$target = Join-Path $ProjectRoot "app\teacher\assignment-wizard\page.tsx"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $destination = Join-Path $backup $relative
  $directory = Split-Path -Parent $destination

  if ($directory) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  Copy-Item -LiteralPath $Path -Destination $destination -Force
}

if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
  throw "Assignment Wizard source file was not found: $target"
}

Write-Host ""
Write-Host "CS Master - T-FINAL-1C Intervention Reassessment Wiring" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

$source = [System.IO.File]::ReadAllText($target)
$updated = $source
$changes = 0

# 1. Add Firestore imports needed for intervention follow-through metadata.
$oldImports = @'
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
'@

$newImports = @'
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
'@

if ($updated.Contains($oldImports)) {
  $updated = $updated.Replace($oldImports, $newImports)
  $changes++
}
elseif (
  -not $updated.Contains("serverTimestamp,") -or
  -not $updated.Contains("updateDoc,")
) {
  throw "Could not safely extend the Firestore import block."
}

# 2. Read intervention reassessment context from the URL.
$oldParams = @'
  const quizId = searchParams.get("quizId");
  const contentType = searchParams.get("contentType");
  const contentId = searchParams.get("contentId");
'@

$newParams = @'
  const quizId = searchParams.get("quizId");
  const contentType = searchParams.get("contentType");
  const contentId = searchParams.get("contentId");

  const assignmentSource = searchParams.get("source");
  const interventionStudentId = searchParams.get("studentId");
  const interventionTopic = searchParams.get("topic");
  const interventionId = searchParams.get("interventionId");

  const isInterventionReassessment =
    assignmentSource === "intervention-review" &&
    Boolean(interventionStudentId) &&
    Boolean(interventionId);
'@

if ($updated.Contains($oldParams)) {
  $updated = $updated.Replace($oldParams, $newParams)
  $changes++
}
elseif (-not $updated.Contains("isInterventionReassessment")) {
  throw "Could not safely add intervention reassessment URL context."
}

# 3. When classes load, preselect the current teacher's class(es) containing
#    the intervention student and prefill focused instructions.
$anchor = @'
        loadedClasses.sort((a, b) =>
          a.name.localeCompare(
            b.name,
          ),
        );

        setClasses(loadedClasses);
'@

$replacement = @'
        loadedClasses.sort((a, b) =>
          a.name.localeCompare(
            b.name,
          ),
        );

        if (
          isInterventionReassessment &&
          interventionStudentId
        ) {
          const matchingClassIds =
            snapshot.docs
              .filter((classDocument) => {
                const data =
                  classDocument.data();

                return (
                  Array.isArray(
                    data.studentIds,
                  ) &&
                  data.studentIds.some(
                    (value) =>
                      typeof value ===
                        "string" &&
                      value ===
                        interventionStudentId,
                  )
                );
              })
              .map(
                (classDocument) =>
                  classDocument.id,
              );

          setWizardData((current) => ({
            ...current,
            selectedClassIds:
              current.selectedClassIds
                .length > 0
                ? current.selectedClassIds
                : matchingClassIds,
            instructions:
              current.instructions ||
              (interventionTopic
                ? `Complete a focused reassessment on ${interventionTopic}. Use the result to review the current intervention.`
                : "Complete this focused reassessment. Use the result to review the current intervention."),
          }));
        }

        setClasses(loadedClasses);
'@

if ($updated.Contains($anchor)) {
  $updated = $updated.Replace($anchor, $replacement)
  $changes++
}
elseif (-not $updated.Contains("matchingClassIds")) {
  throw "Could not safely add intervention class preselection."
}

# 4. Ensure the class-loading effect tracks intervention reassessment inputs.
$oldDeps = @'
  }, [authLoading, user]);
'@

$newDeps = @'
  }, [
    authLoading,
    user,
    isInterventionReassessment,
    interventionStudentId,
    interventionTopic,
  ]);
'@

# Only replace the first exact occurrence (the class subscription effect).
$depIndex = $updated.IndexOf($oldDeps)
if ($depIndex -ge 0 -and -not $updated.Contains("interventionStudentId,`r`n    interventionTopic,")) {
  $updated =
    $updated.Substring(0, $depIndex) +
    $newDeps +
    $updated.Substring($depIndex + $oldDeps.Length)
  $changes++
}

# 5. Show teacher-facing intervention context in the wizard.
$uiAnchor = @'
      <WizardProgress
        currentStep={step}
      />
'@

$uiReplacement = @'
      {isInterventionReassessment && (
        <Card className="border border-indigo-200 bg-indigo-50">
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">
            Intervention reassessment
          </p>

          <h2 className="mt-2 text-xl font-black text-indigo-950">
            Focused follow-up assessment
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-800">
            {interventionTopic
              ? `Choose an appropriate task for ${interventionTopic}. The class containing the intervention student has been preselected where possible.`
              : "Choose an appropriate reassessment task. The class containing the intervention student has been preselected where possible."}
          </p>

          <p className="mt-2 text-xs font-semibold text-indigo-700">
            This remains a class assignment. Return to the intervention impact review after new evidence is available.
          </p>
        </Card>
      )}

      <WizardProgress
        currentStep={step}
      />
'@

if ($updated.Contains($uiAnchor)) {
  $updated = $updated.Replace($uiAnchor, $uiReplacement)
  $changes++
}
elseif (-not $updated.Contains("Intervention reassessment")) {
  throw "Could not safely add intervention reassessment context card."
}

# 6. After successful assignment creation, record that a reassessment
#    has been assigned against the intervention so the workflow is traceable.
$successAnchor = @'
      toast.success(
        `${
'@

# We insert metadata update immediately before the success toast.
$metadataBlock = @'
      if (
        isInterventionReassessment &&
        interventionId
      ) {
        await updateDoc(
          doc(
            db,
            "interventions",
            interventionId,
          ),
          {
            reassessmentAssignedAt:
              serverTimestamp(),
            reassessmentAssignedBy:
              user.uid,
            reassessmentTopic:
              interventionTopic || "",
            reassessmentResourceType:
              wizardData.resource
                .resourceType,
            reassessmentResourceId:
              wizardData.resource
                .resourceId,
            reassessmentDueDate:
              wizardData.dueDate,
            reassessmentClassIds:
              wizardData
                .selectedClassIds,
            updatedAt:
              serverTimestamp(),
          },
        );
      }

      toast.success(
        `${
'@

if ($updated.Contains($successAnchor)) {
  $updated = $updated.Replace($successAnchor, $metadataBlock)
  $changes++
}
elseif (-not $updated.Contains("reassessmentAssignedAt")) {
  throw "Could not safely add intervention reassessment tracking metadata."
}

if ($changes -eq 0) {
  throw "No T-FINAL-1C changes were applied."
}

Backup-File $target

[System.IO.File]::WriteAllText(
  $target,
  $updated,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "[T-FINAL-1C] Applied intervention reassessment wiring." -ForegroundColor Green
Write-Host "Applied change groups: $changes"
Write-Host ""

$lintStatus = "NOT RUN"
$lintExit = $null
$buildStatus = "NOT RUN"
$buildExit = $null

Push-Location $ProjectRoot
try {
  Write-Host "1. Running ESLint..."
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

  if ($lintStatus -eq "PASS") {
    Write-Host ""
    Write-Host "2. Running production build..."
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
  else {
    Write-Host ""
    Write-Host "2. Production build skipped because ESLint failed." -ForegroundColor Yellow
  }
}
finally {
  Pop-Location
}

if ($lintStatus -eq "PASS" -and $buildStatus -eq "PASS") {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$lines = @(
  "CS MASTER - T-FINAL-1C INTERVENTION REASSESSMENT WIRING",
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
  "Project: $ProjectRoot",
  "Backup: $backup",
  "",
  "CHANGE",
  "------",
  "Connected Intervention Impact -> Assign reassessment -> Assignment Wizard.",
  "The wizard now consumes intervention-review URL context, preselects the",
  "teacher class containing the intervention student where possible, prefills",
  "focused reassessment instructions, displays reassessment context, and records",
  "reassessment assignment metadata back onto the intervention after success.",
  "",
  "NOTE",
  "----",
  "The existing assignment model remains class-based. This pass does not create",
  "a new student-only assignment schema.",
  "",
  "ESLINT",
  "------",
  "Status: $lintStatus",
  "Exit code: $lintExit",
  "",
  "PRODUCTION BUILD",
  "----------------",
  "Status: $buildStatus",
  "Exit code: $buildExit",
  "",
  "T-FINAL-1C STATUS",
  "-----------------",
  $status
)

[System.IO.File]::WriteAllLines(
  $summary,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""

if ($status -eq "PASS") {
  Write-Host "T-FINAL-1C status: PASS" -ForegroundColor Green
}
else {
  Write-Host "T-FINAL-1C status: NOT YET PASSED" -ForegroundColor Yellow
}