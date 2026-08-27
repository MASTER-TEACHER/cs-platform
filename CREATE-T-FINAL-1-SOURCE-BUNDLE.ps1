param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd("\")
$output = Join-Path $ProjectRoot "T-FINAL-1-SOURCE-BUNDLE.txt"

$relativeFiles = @(
  "app\teacher\classes\page.tsx",
  "app\teacher\classes\[classId]\page.tsx",
  "components\teacher\classes\ClassSettingsPanel.tsx",
  "components\teacher\classes\ClassStudentsManager.tsx",
  "services\classService.ts",
  "services\classStudentService.ts",

  "app\teacher\assignment-wizard\page.tsx",
  "app\teacher\assignments\page.tsx",
  "app\teacher\assignments\[assignmentId]\page.tsx",
  "components\teacher\AssignmentClassStep.tsx",
  "components\teacher\AssignmentDetailsStep.tsx",
  "components\teacher\AssignmentResourceStep.tsx",
  "components\teacher\AssignmentReviewStep.tsx",
  "services\assignmentService.ts",
  "services\unifiedAssignmentService.ts",
  "services\unifiedTeacherAssignmentService.ts",
  "services\lessonAssignmentService.tsx",
  "services\quizAssignmentService.ts",
  "services\programmingAssignmentService.ts",
  "services\resourceAssignmentService.ts",

  "app\teacher\interventions\page.tsx",
  "app\teacher\interventions\[interventionId]\page.tsx",
  "components\teacher\interventions\CreateInterventionModal.tsx",
  "components\teacher\interventions\InterventionActionContext.tsx",
  "components\teacher\interventions\InterventionEffectivenessOverview.tsx",
  "components\teacher\interventions\InterventionImpactCard.tsx",
  "components\teacher\interventions\InterventionStudentRow.tsx",
  "components\teacher\interventions\StudentInterventionImpactList.tsx",
  "services\interventionService.ts",
  "services\interventionAnalyticsService.ts",
  "services\analytics\interventionEffectivenessService.ts",
  "services\analytics\interventionImpactService.ts",
  "services\analytics\interventionReviewCycleService.ts",

  "app\teacher\content\page.tsx",
  "app\teacher\resources\page.tsx",
  "app\teacher\resources\[resourceId]\page.tsx",
  "app\teacher\resources\[resourceId]\edit\page.tsx",
  "components\teacher\resources\AssignResourceModal.tsx",
  "components\teacher\resources\ExistingTeachingResourceSelector.tsx",
  "components\teacher\resources\ResourcePublishControls.tsx",
  "services\teacherContentLibraryService.ts",
  "services\teacherResourceService.ts"
)

$lines = New-Object System.Collections.Generic.List[string]
$included = 0
$missing = New-Object System.Collections.Generic.List[string]

foreach ($relative in $relativeFiles) {
  $full = Join-Path $ProjectRoot $relative

  if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
    $missing.Add($relative)
    continue
  }

  $included++
  $lines.Add("")
  $lines.Add("=" * 110)
  $lines.Add("FILE: $relative")
  $lines.Add("=" * 110)
  $lines.Add("")

  $number = 1
  foreach ($line in Get-Content -LiteralPath $full) {
    $lines.Add(("{0,5}: {1}" -f $number, $line))
    $number++
  }
}

$lines.Add("")
$lines.Add("=" * 110)
$lines.Add("BUNDLE SUMMARY")
$lines.Add("=" * 110)
$lines.Add("Included files: $included")
$lines.Add("Missing files: $($missing.Count)")

if ($missing.Count -gt 0) {
  $lines.Add("")
  $lines.Add("MISSING")
  foreach ($item in $missing) {
    $lines.Add($item)
  }
}

[System.IO.File]::WriteAllLines(
  $output,
  $lines,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "T-FINAL-1 source bundle created." -ForegroundColor Green
Write-Host "Included files: $included"
Write-Host "Missing files:  $($missing.Count)"
Write-Host ""
Write-Host "Created:"
Write-Host $output -ForegroundColor Yellow