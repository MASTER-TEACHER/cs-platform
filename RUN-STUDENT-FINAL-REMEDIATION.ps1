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

$backup = Join-Path $parent "$name-student-final-remediation-backup-$stamp"
$summary = Join-Path $ProjectRoot "STUDENT-FINAL-REMEDIATION-SUMMARY.txt"
$target = Join-Path $ProjectRoot "components\quiz\QuizPlayer.tsx"

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

if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
  throw "QuizPlayer source file was not found: $target"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CS MASTER - STUDENT PHASE FINAL REMEDIATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

$source = [System.IO.File]::ReadAllText($target)
$updated = $source

$oldBlock = @'
  useEffect(() => {
    let cancelled = false;

    async function loadLinkedAssignment() {
      if (!assignmentId) {
        setLinkedAssignment(null);
        setAssignmentLoading(false);
        return;
      }

      try {
        setAssignmentLoading(true);
        setAssignmentError("");

        const snapshot = await getDoc(doc(db, "assignments", assignmentId));

        if (!snapshot.exists()) {
          throw new Error("The linked quiz assignment could not be found.");
        }

        const data = snapshot.data();

        if (data.type !== "quiz") {
          throw new Error("This assignment is not a quiz assignment.");
        }

        if (!data.classId || !data.teacherId) {
          throw new Error(
            "The assignment is missing its class or teacher information.",
          );
        }

        if (!cancelled) {
          setLinkedAssignment({
            id: snapshot.id,
            classId: data.classId,
            teacherId: data.teacherId,
            resourceId: data.resourceId || quiz.topicId,
            deliveryMode:
              data.deliveryMode === "assessment" ? "assessment" : "practice",
          });
        }
      } catch (error) {
        console.error("Quiz assignment load error:", error);

        if (!cancelled) {
          setAssignmentError(
            error instanceof Error
              ? error.message
              : "The linked quiz assignment could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setAssignmentLoading(false);
        }
      }
    }

    void loadLinkedAssignment();

    return () => {
      cancelled = true;
    };
  }, [assignmentId, quiz.topicId]);
'@

$newBlock = @'
  useEffect(() => {
    let cancelled = false;

    async function loadLinkedAssignment() {
      if (!assignmentId) {
        setLinkedAssignment(null);
        setAssignmentLoading(false);
        return;
      }

      if (!user?.uid) {
        setLinkedAssignment(null);
        setAssignmentError(
          "Sign in with the student account that received this assignment.",
        );
        setAssignmentLoading(false);
        return;
      }

      try {
        setAssignmentLoading(true);
        setAssignmentError("");

        const snapshot = await getDoc(
          doc(db, "assignments", assignmentId),
        );

        if (!snapshot.exists()) {
          throw new Error(
            "The linked quiz assignment could not be found.",
          );
        }

        const data = snapshot.data();

        if (data.type !== "quiz") {
          throw new Error(
            "This assignment is not a quiz assignment.",
          );
        }

        if (!data.classId || !data.teacherId) {
          throw new Error(
            "The assignment is missing its class or teacher information.",
          );
        }

        if (data.status === "cancelled") {
          throw new Error(
            "This quiz assignment has been cancelled.",
          );
        }

        const assignedResourceId =
          typeof data.resourceId === "string"
            ? data.resourceId.trim()
            : "";

        if (
          !assignedResourceId ||
          ![
            quiz.id,
            quiz.topicId,
          ].includes(assignedResourceId)
        ) {
          throw new Error(
            "This quiz does not match the linked assignment.",
          );
        }

        const classSnapshot = await getDoc(
          doc(
            db,
            "classes",
            data.classId,
          ),
        );

        if (!classSnapshot.exists()) {
          throw new Error(
            "The class linked to this assignment could not be found.",
          );
        }

        const classData =
          classSnapshot.data();

        const studentIds =
          Array.isArray(
            classData.studentIds,
          )
            ? classData.studentIds.filter(
                (
                  value,
                ): value is string =>
                  typeof value ===
                    "string" &&
                  Boolean(
                    value.trim(),
                  ),
              )
            : [];

        if (
          !studentIds.includes(
            user.uid,
          )
        ) {
          throw new Error(
            "You do not have access to this quiz assignment.",
          );
        }

        if (!cancelled) {
          setLinkedAssignment({
            id: snapshot.id,
            classId: data.classId,
            teacherId: data.teacherId,
            resourceId:
              assignedResourceId,
            deliveryMode:
              data.deliveryMode ===
              "assessment"
                ? "assessment"
                : "practice",
          });
        }
      } catch (error) {
        console.error(
          "Quiz assignment load error:",
          error,
        );

        if (!cancelled) {
          setLinkedAssignment(null);
          setAssignmentError(
            error instanceof Error
              ? error.message
              : "The linked quiz assignment could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setAssignmentLoading(false);
        }
      }
    }

    void loadLinkedAssignment();

    return () => {
      cancelled = true;
    };
  }, [
    assignmentId,
    quiz.id,
    quiz.topicId,
    user?.uid,
  ]);
'@

if (-not $updated.Contains($oldBlock)) {
  throw "The QuizPlayer assignment-loading block did not match the audited source. No source files were changed."
}

Backup-File -Path $target
$updated = $updated.Replace($oldBlock, $newBlock)

[System.IO.File]::WriteAllText(
  $target,
  $updated,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "[FIX] Hardened assigned-quiz student access and resource validation." -ForegroundColor Green
Write-Host ""

# ------------------------------------------------------------
# Genuine unfinished-marker scan.
# Deliberately exclude normal HTML placeholder attributes and the
# isPlaceholderStudentName analytics helper; those are not unfinished work.
# ------------------------------------------------------------

$scanRoots = @(
  "app\dashboard",
  "app\learn",
  "app\quiz",
  "app\assignments",
  "app\exam",
  "app\exam-trainer",
  "app\programming",
  "app\visualisers",
  "components\dashboard",
  "components\lesson",
  "components\quiz",
  "components\exam",
  "components\exam-trainer",
  "components\programming",
  "components\adaptive"
)

$genuinePatterns = @(
  "TODO",
  "FIXME",
  "coming soon",
  "not implemented",
  "next wiring step",
  "mock data",
  "disabled={true}"
)

$findings = New-Object System.Collections.Generic.List[string]

foreach ($relativeRoot in $scanRoots) {
  $root = Join-Path $ProjectRoot $relativeRoot

  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx |
    ForEach-Object {
      $file = $_

      foreach ($pattern in $genuinePatterns) {
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

          $findings.Add(
            "${relative}:$($match.LineNumber): $($match.Line.Trim())"
          )
        }
      }
    }
}

Write-Host "Genuine unfinished markers: $($findings.Count)"

# ------------------------------------------------------------
# ESLint and production build
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
  $lintStatus -eq "PASS" -and
  $buildStatus -eq "PASS" -and
  $findings.Count -eq 0
) {
  $status = "PASS"
}
else {
  $status = "NOT YET PASSED"
}

$summaryLines = New-Object System.Collections.Generic.List[string]

$summaryLines.Add("CS MASTER - STUDENT PHASE FINAL REMEDIATION")
$summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$summaryLines.Add("Project: $ProjectRoot")
$summaryLines.Add("Backup: $backup")
$summaryLines.Add("")
$summaryLines.Add("CHANGE")
$summaryLines.Add("------")
$summaryLines.Add("Hardened assigned-quiz access.")
$summaryLines.Add("The linked assignment must be active, match the loaded quiz,")
$summaryLines.Add("and belong to a class containing the signed-in student.")
$summaryLines.Add("")
$summaryLines.Add("AUDIT CLASSIFICATION")
$summaryLines.Add("--------------------")
$summaryLines.Add("Normal input/textarea placeholder attributes are treated as valid UI.")
$summaryLines.Add("The isPlaceholderStudentName analytics helper is treated as valid code.")
$summaryLines.Add("")
$summaryLines.Add("GENUINE UNFINISHED MARKERS")
$summaryLines.Add("--------------------------")
$summaryLines.Add("Count: $($findings.Count)")

foreach ($item in $findings) {
  $summaryLines.Add($item)
}

$summaryLines.Add("")
$summaryLines.Add("ESLINT")
$summaryLines.Add("------")
$summaryLines.Add("Status: $lintStatus")
$summaryLines.Add("Exit code: $lintExit")
$summaryLines.Add("")
$summaryLines.Add("PRODUCTION BUILD")
$summaryLines.Add("----------------")
$summaryLines.Add("Status: $buildStatus")
$summaryLines.Add("Exit code: $buildExit")
$summaryLines.Add("")
$summaryLines.Add("STUDENT PHASE STATUS")
$summaryLines.Add("--------------------")
$summaryLines.Add($status)

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " STUDENT FINAL REMEDIATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Student Phase status: $status" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Yellow" })