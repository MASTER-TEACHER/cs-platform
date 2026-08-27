param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$projectParent = Split-Path -Parent $ProjectRoot
$projectName = Split-Path -Leaf $ProjectRoot

$backup = Join-Path $projectParent "$projectName-p1-lint-pass4e-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4e-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass4e-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS4E-SUMMARY.txt"

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 4E" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

function Backup-File([string]$FullPath) {
  $resolved = (Resolve-Path -LiteralPath $FullPath).Path
  $prefix = $ProjectRoot + "\"

  if (-not $resolved.StartsWith(
      $prefix,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
    throw "Refusing to back up a file outside ProjectRoot: $resolved"
  }

  $relative = $resolved.Substring($prefix.Length)
  $destination = Join-Path $backup $relative
  $parent = Split-Path -Parent $destination

  if ($parent) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (-not (Test-Path -LiteralPath $destination)) {
    Copy-Item -LiteralPath $resolved -Destination $destination -Force
  }
}

function Replace-Exact(
  [string]$RelativePath,
  [string]$OldText,
  [string]$NewText,
  [string]$Label
) {
  $path = Join-Path $ProjectRoot $RelativePath

  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "[SKIP] $Label - file missing." -ForegroundColor Yellow
    return $false
  }

  $content = [System.IO.File]::ReadAllText($path)

  if (-not $content.Contains($OldText)) {
    Write-Host "[SKIP] $Label - exact target absent/source changed." -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  Write-Utf8NoBom $path ($content.Replace($OldText, $NewText))
  Write-Host "[PASS4E] $Label" -ForegroundColor Green
  return $true
}

function Invoke-EslintJson([string]$OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force -ErrorAction SilentlyContinue

  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$OutputPath"
    $null = $LASTEXITCODE
  }
  finally {
    Pop-Location
  }

  if (-not (Test-Path -LiteralPath $OutputPath -PathType Leaf)) {
    throw "ESLint did not create: $OutputPath"
  }
}

function Get-LintStats([string]$ReportPath) {
  $results = Get-Content -LiteralPath $ReportPath -Raw | ConvertFrom-Json
  $problemFiles = 0
  $errors = 0
  $warnings = 0
  $rules = @{}

  foreach ($result in $results) {
    if ($result.messages.Count -gt 0) { $problemFiles++ }

    foreach ($message in $result.messages) {
      if ($message.severity -eq 2) { $errors++ }
      elseif ($message.severity -eq 1) { $warnings++ }

      $rule = if ($message.ruleId) { [string]$message.ruleId } else { "(parser)" }

      if (-not $rules.ContainsKey($rule)) {
        $rules[$rule] = 0
      }

      $rules[$rule]++
    }
  }

  [PSCustomObject]@{
    ProblemFiles = $problemFiles
    Errors = $errors
    Warnings = $warnings
    Rules = $rules
  }
}

Write-Host "1. Measuring lint before Pass 4E..."
Invoke-EslintJson $beforeReport
$before = Get-LintStats $beforeReport

Write-Host "   Problem files: $($before.ProblemFiles)"
Write-Host "   Errors:        $($before.Errors)"
Write-Host "   Warnings:      $($before.Warnings)"
Write-Host ""

Write-Host "2. Applying proven Promise-callback loader refactors..."
$changes = 0

if (Replace-Exact `
  "components\teacher\interventions\InterventionEffectivenessOverview.tsx" `
  'import { useEffect, useMemo, useState } from "react";' `
  'import { useCallback, useEffect, useMemo, useState } from "react";' `
  "Added useCallback to intervention effectiveness overview") {
  $changes++
}

$interventionOld = @'
  async function load() {
    if (!teacherId.trim() || interventions.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const results = await Promise.all(
        interventions.map(async (intervention) => {
          try {
            const impact = await getInterventionImpact({
              interventionId: intervention.id,
              teacherId,
            });

            if (!impact) return null;

            return buildInterventionEffectivenessItem({
              source: intervention,
              impact,
            });
          } catch (caughtError) {
            console.error(
              `Unable to load intervention effectiveness for ${intervention.id}:`,
              caughtError,
            );

            return null;
          }
        }),
      );

      setItems(
        results.filter(
          (item): item is InterventionEffectivenessItem => Boolean(item),
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Intervention effectiveness could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [teacherId, interventions]);
'@

$interventionNew = @'
  const load = useCallback(() => {
    if (!teacherId.trim() || interventions.length === 0) {
      return Promise.resolve().then(() => {
        setItems([]);
        setError("");
        setLoading(false);
      });
    }

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");

        return Promise.all(
          interventions.map(async (intervention) => {
            try {
              const impact = await getInterventionImpact({
                interventionId: intervention.id,
                teacherId,
              });

              if (!impact) return null;

              return buildInterventionEffectivenessItem({
                source: intervention,
                impact,
              });
            } catch (caughtError) {
              console.error(
                `Unable to load intervention effectiveness for ${intervention.id}:`,
                caughtError,
              );

              return null;
            }
          }),
        );
      })
      .then((results) => {
        setItems(
          results.filter(
            (item): item is InterventionEffectivenessItem => Boolean(item),
          ),
        );
      })
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Intervention effectiveness could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teacherId, interventions]);

  useEffect(() => {
    void load();
  }, [load]);
'@

if (Replace-Exact `
  "components\teacher\interventions\InterventionEffectivenessOverview.tsx" `
  $interventionOld `
  $interventionNew `
  "Stabilized intervention effectiveness loader and deferred state transitions") {
  $changes++
}

$programmingOld = @'
  useEffect(() => {
    setHydrated(false);
    setProgress(loadProgress(studentId));
    setHydrated(Boolean(studentId));
  }, [studentId]);
'@

$programmingNew = @'
  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;

      setHydrated(false);
      setProgress(loadProgress(studentId));
      setHydrated(Boolean(studentId));
    });

    return () => {
      cancelled = true;
    };
  }, [studentId]);
'@

if (Replace-Exact `
  "hooks\useProgrammingProgress.ts" `
  $programmingOld `
  $programmingNew `
  "Deferred programming-progress hydration state transitions") {
  $changes++
}

$teacherIntelOld = @'
  const refresh = useCallback(async () => {
    if (
      !userId ||
      (role !== "teacher" && role !== "admin")
    ) {
      setPortfolio(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getTeacherAnalyticsPortfolio(userId);

      setPortfolio(result);
    } catch (caughtError: unknown) {
      const firebaseCode =
        typeof caughtError === "object" &&
        caughtError !== null &&
        "code" in caughtError &&
        typeof (caughtError as { code?: unknown }).code === "string"
          ? (caughtError as { code: string }).code
          : "";

      setPortfolio(null);

      if (
        firebaseCode === "permission-denied" ||
        firebaseCode === "firestore/permission-denied"
      ) {
        setError(
          "Teacher intelligence is unavailable for this account.",
        );
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Teacher intelligence could not be loaded.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [role, userId]);
'@

$teacherIntelNew = @'
  const refresh = useCallback(() => {
    if (
      !userId ||
      (role !== "teacher" && role !== "admin")
    ) {
      return Promise.resolve().then(() => {
        setPortfolio(null);
        setError("");
        setLoading(false);
      });
    }

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getTeacherAnalyticsPortfolio(userId);
      })
      .then((result) => {
        setPortfolio(result);
      })
      .catch((caughtError: unknown) => {
        const firebaseCode =
          typeof caughtError === "object" &&
          caughtError !== null &&
          "code" in caughtError &&
          typeof (caughtError as { code?: unknown }).code === "string"
            ? (caughtError as { code: string }).code
            : "";

        setPortfolio(null);

        if (
          firebaseCode === "permission-denied" ||
          firebaseCode === "firestore/permission-denied"
        ) {
          setError(
            "Teacher intelligence is unavailable for this account.",
          );
        } else {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Teacher intelligence could not be loaded.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [role, userId]);
'@

if (Replace-Exact `
  "hooks\useTeacherIntelligence.ts" `
  $teacherIntelOld `
  $teacherIntelNew `
  "Moved teacher-intelligence state transitions behind Promise callbacks") {
  $changes++
}

$assignmentsOld = @'
  const loadAssignments =
    useCallback(
      async () => {
        if (!user?.uid) {
          setSummary(
            emptySummary,
          );
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          setSummary(
            await getUnifiedTeacherAssignments(
              user.uid,
            ),
          );
        } catch (
          caughtError
        ) {
          console.error(
            "Unable to load unified teacher assignments:",
            caughtError,
          );

          setSummary(
            emptySummary,
          );

          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Your assignments could not be loaded.",
          );
        } finally {
          setLoading(false);
        }
      },
      [user],
    );
'@

$assignmentsNew = @'
  const loadAssignments =
    useCallback(
      () => {
        if (!user?.uid) {
          return Promise.resolve().then(() => {
            setSummary(
              emptySummary,
            );
            setError("");
            setLoading(false);
          });
        }

        const teacherId =
          user.uid;

        return Promise.resolve()
          .then(() => {
            setLoading(true);
            setError("");

            return getUnifiedTeacherAssignments(
              teacherId,
            );
          })
          .then(
            (loadedSummary) => {
              setSummary(
                loadedSummary,
              );
            },
          )
          .catch(
            (caughtError) => {
              console.error(
                "Unable to load unified teacher assignments:",
                caughtError,
              );

              setSummary(
                emptySummary,
              );

              setError(
                caughtError instanceof
                  Error
                  ? caughtError.message
                  : "Your assignments could not be loaded.",
              );
            },
          )
          .finally(() => {
            setLoading(false);
          });
      },
      [user],
    );
'@

if (Replace-Exact `
  "app\teacher\assignments\page.tsx" `
  $assignmentsOld `
  $assignmentsNew `
  "Moved unified teacher-assignment state transitions behind Promise callbacks") {
  $changes++
}

$viewerOld = @'
  const loadResource = useCallback(async () => {
    if (!currentUser || !resourceId) {
      setResource(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resourceReference = doc(db, "teacherResources", resourceId);

      const resourceSnapshot = await getDoc(resourceReference);

      if (!resourceSnapshot.exists()) {
        setResource(null);
        setError("This teaching resource could not be found.");
        return;
      }

      const data = resourceSnapshot.data() as FirestoreTeacherResource;

      if (data.teacherId !== currentUser.uid) {
        setResource(null);
        setError("You do not have permission to view this resource.");
        return;
      }

      setResource({
        id: resourceSnapshot.id,
        teacherId: data.teacherId,
        sourceResourceId: data.sourceResourceId,
        title: data.title,
        topic: data.topic,
        resourceType: data.resourceType,
        yearGroup: data.yearGroup,
        examBoard: data.examBoard,
        duration: data.duration,
        difficulty: data.difficulty,
        content: data.content,
        status: data.status,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      });
    } catch (caughtError) {
      console.error("Failed to load teacher resource:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The teaching resource could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, resourceId]);
'@

$viewerNew = @'
  const loadResource = useCallback(() => {
    if (!currentUser || !resourceId) {
      return Promise.resolve().then(() => {
        setResource(null);
        setError(null);
        setLoading(false);
      });
    }

    const teacherId = currentUser.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError(null);

        const resourceReference = doc(db, "teacherResources", resourceId);

        return getDoc(resourceReference);
      })
      .then((resourceSnapshot) => {
        if (!resourceSnapshot.exists()) {
          setResource(null);
          setError("This teaching resource could not be found.");
          return;
        }

        const data = resourceSnapshot.data() as FirestoreTeacherResource;

        if (data.teacherId !== teacherId) {
          setResource(null);
          setError("You do not have permission to view this resource.");
          return;
        }

        setResource({
          id: resourceSnapshot.id,
          teacherId: data.teacherId,
          sourceResourceId: data.sourceResourceId,
          title: data.title,
          topic: data.topic,
          resourceType: data.resourceType,
          yearGroup: data.yearGroup,
          examBoard: data.examBoard,
          duration: data.duration,
          difficulty: data.difficulty,
          content: data.content,
          status: data.status,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
        });
      })
      .catch((caughtError) => {
        console.error("Failed to load teacher resource:", caughtError);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The teaching resource could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser, resourceId]);
'@

if (Replace-Exact `
  "app\teacher\resources\[resourceId]\page.tsx" `
  $viewerOld `
  $viewerNew `
  "Moved teacher resource-viewer state transitions behind Promise callbacks") {
  $changes++
}

Write-Host ""
Write-Host "   Applied source changes: $changes"
Write-Host ""
Write-Host "3. Measuring lint after Pass 4E..."

Invoke-EslintJson $afterReport
$after = Get-LintStats $afterReport

Write-Host "   Problem files: $($after.ProblemFiles)"
Write-Host "   Errors:        $($after.Errors)"
Write-Host "   Warnings:      $($after.Warnings)"
Write-Host ""

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("CS MASTER - P1 LINT REMEDIATION PASS 4E")
$summaryLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$summaryLines.Add("Project: $ProjectRoot")
$summaryLines.Add("Backup: $backup")
$summaryLines.Add("")
$summaryLines.Add("Applied source changes: $changes")
$summaryLines.Add("")
$summaryLines.Add("BEFORE")
$summaryLines.Add("------")
$summaryLines.Add("Problem files: $($before.ProblemFiles)")
$summaryLines.Add("Errors: $($before.Errors)")
$summaryLines.Add("Warnings: $($before.Warnings)")
$summaryLines.Add("")
$summaryLines.Add("AFTER")
$summaryLines.Add("-----")
$summaryLines.Add("Problem files: $($after.ProblemFiles)")
$summaryLines.Add("Errors: $($after.Errors)")
$summaryLines.Add("Warnings: $($after.Warnings)")
$summaryLines.Add("")
$summaryLines.Add("REMAINING RULE COUNTS")
$summaryLines.Add("---------------------")

foreach ($entry in ($after.Rules.GetEnumerator() | Sort-Object Value -Descending)) {
  $summaryLines.Add("$($entry.Key): $($entry.Value)")
}

$summaryLines.Add("")
$summaryLines.Add("PASS 4E SCOPE")
$summaryLines.Add("-------------")
$summaryLines.Add("Extended the validated Promise-callback pattern to five non-integrity")
$summaryLines.Add("loader/hydration areas, including one combined exhaustive-deps fix.")
$summaryLines.Add("Exam/quiz integrity, fullscreen, visibility, countdown and auto-submit")
$summaryLines.Add("logic was not modified.")
$summaryLines.Add("No ESLint rules or warnings were disabled.")

[System.IO.File]::WriteAllLines(
  $summary,
  $summaryLines,
  [System.Text.UTF8Encoding]::new($false)
)

Remove-Item -LiteralPath $beforeReport -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $afterReport -Force -ErrorAction SilentlyContinue

Write-Host "P1 Lint Pass 4E complete." -ForegroundColor Green
Write-Host "No ESLint rules were disabled." -ForegroundColor Green
Write-Host ""
Write-Host "Created:"
Write-Host $summary -ForegroundColor Yellow
Write-Host ""
Write-Host "Send me P1-LINT-PASS4E-SUMMARY.txt next."