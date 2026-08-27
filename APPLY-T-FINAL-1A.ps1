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
$backup = Join-Path $parent "$name-t-final-1a-backup-$stamp"
$summary = Join-Path $ProjectRoot "T-FINAL-1A-SUMMARY.txt"
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
  throw "Assignment wizard source file was not found: $target"
}

Write-Host ""
Write-Host "CS Master - T-FINAL-1A Teacher Workflow Hardening" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""

$source = [System.IO.File]::ReadAllText($target)

$old = @'
    setSubmitting(true);

    try {
      if (
'@

$new = @'
    setSubmitting(true);

    try {
      /*
       * Production preflight:
       * verify every selected class still exists, belongs to this teacher,
       * and has at least one enrolled student before creating any assignment.
       *
       * This protects every assignment path (lesson, quiz, AI quiz,
       * exam paper, teaching resource and programming challenge) from
       * producing empty or stale class assignments.
       */
      const selectedClassSnapshots =
        await Promise.all(
          wizardData.selectedClassIds.map(
            (selectedClassId) =>
              getDoc(
                doc(
                  db,
                  "classes",
                  selectedClassId,
                ),
              ),
          ),
        );

      selectedClassSnapshots.forEach(
        (classSnapshot, index) => {
          const selectedClassId =
            wizardData.selectedClassIds[
              index
            ];

          if (
            !classSnapshot.exists()
          ) {
            throw new Error(
              "A selected class could not be found. Refresh the page and choose the class again.",
            );
          }

          const classData =
            classSnapshot.data();

          if (
            typeof classData.teacherId ===
              "string" &&
            classData.teacherId &&
            classData.teacherId !== user.uid
          ) {
            throw new Error(
              "You cannot assign work to another teacher's class.",
            );
          }

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
            studentIds.length === 0
          ) {
            const className =
              classes.find(
                (item) =>
                  item.id ===
                  selectedClassId,
              )?.name ||
              (typeof classData.name ===
                "string"
                ? classData.name
                : "A selected class");

            throw new Error(
              `${className} has no enrolled students. Add at least one student before assigning work.`,
            );
          }
        },
      );

      if (
'@

if (-not $source.Contains($old)) {
  throw "T-FINAL-1A target block was not found. The assignment wizard has changed; no source files were modified."
}

Backup-File $target

$updated = $source.Replace($old, $new)

[System.IO.File]::WriteAllText(
  $target,
  $updated,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "[T-FINAL-1A] Added assignment class preflight validation." -ForegroundColor Green
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

$phaseStatus =
  if (
    $lintStatus -eq "PASS" -and
    $buildStatus -eq "PASS"
  ) {
    "PASS"
  }
  else {
    "NOT YET PASSED"
  }

$lines = @(
  "CS MASTER - T-FINAL-1A TEACHER WORKFLOW HARDENING",
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
  "Project: $ProjectRoot",
  "Backup: $backup",
  "",
  "CHANGE",
  "------",
  "Added assignment preflight validation across all Assignment Wizard resource types.",
  "Selected classes must still exist, belong to the current teacher, and contain",
  "at least one enrolled student before any assignment documents are created.",
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
  "T-FINAL-1A STATUS",
  "-----------------",
  $phaseStatus
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
Write-Host "T-FINAL-1A status: $phaseStatus" -ForegroundColor $(if ($phaseStatus -eq "PASS") { "Green" } else { "Yellow" })