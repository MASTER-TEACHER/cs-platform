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
$backup = Join-Path $projectParent "$projectName-p1-lint-pass5b-backup-$timestamp"
$beforeReport = Join-Path $env:TEMP "cs-master-p1-lint-pass5b-before-$timestamp.json"
$afterReport = Join-Path $env:TEMP "cs-master-p1-lint-pass5b-after-$timestamp.json"
$summary = Join-Path $ProjectRoot "P1-LINT-PASS5B-SUMMARY.txt"

New-Item -ItemType Directory -Path $backup -Force | Out-Null

function Backup-File([string]$Path) {
  $relative = $Path.Substring($ProjectRoot.Length).TrimStart("\")
  $dest = Join-Path $backup $relative
  $parent = Split-Path -Parent $dest
  if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  if (-not (Test-Path -LiteralPath $dest)) {
    Copy-Item -LiteralPath $Path -Destination $dest -Force
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

  $text = [IO.File]::ReadAllText($path)
  if (-not $text.Contains($OldText)) {
    Write-Host "[SKIP] $Label - target absent/source changed." -ForegroundColor Yellow
    return $false
  }

  Backup-File $path
  [IO.File]::WriteAllText(
    $path,
    $text.Replace($OldText, $NewText),
    [Text.UTF8Encoding]::new($false)
  )
  Write-Host "[PASS5B] $Label" -ForegroundColor Green
  return $true
}

function Invoke-Lint([string]$Out) {
  Remove-Item $Out -Force -ErrorAction SilentlyContinue
  Push-Location $ProjectRoot
  try {
    & npx.cmd eslint . --format json --output-file "$Out"
    $null = $LASTEXITCODE
  } finally {
    Pop-Location
  }
  if (-not (Test-Path -LiteralPath $Out)) {
    throw "ESLint report missing: $Out"
  }
}

function Get-Stats([string]$File) {
  $r = Get-Content $File -Raw | ConvertFrom-Json
  $pf=0; $e=0; $w=0; $rules=@{}
  foreach($x in $r){
    if($x.messages.Count){$pf++}
    foreach($m in $x.messages){
      if($m.severity -eq 2){$e++}
      elseif($m.severity -eq 1){$w++}
      $id = if($m.ruleId){[string]$m.ruleId}else{"(parser)"}
      if(-not $rules.ContainsKey($id)){$rules[$id]=0}
      $rules[$id]++
    }
  }
  [pscustomobject]@{
    ProblemFiles=$pf
    Errors=$e
    Warnings=$w
    Rules=$rules
  }
}

Write-Host ""
Write-Host "CS Master - P1 Lint Remediation Pass 5B" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Backup:  $backup"
Write-Host ""
Write-Host "1. Measuring baseline..."
Invoke-Lint $beforeReport
$before = Get-Stats $beforeReport

$changes = 0

Write-Host "2. Stabilising teacher class loader..."

# Add useCallback import only if current import lacks it.
$old = 'import { useEffect, useMemo, useState } from "react";'
$new = 'import { useCallback, useEffect, useMemo, useState } from "react";'
if (Replace-Exact `
  "app\teacher\classes\page.tsx" `
  $old `
  $new `
  "Add useCallback to teacher classes"
) { $changes++ }

# Convert function declaration to stable callback.
$old = @'
  function loadClasses() {
'@
$new = @'
  const loadClasses = useCallback(() => {
'@
if (Replace-Exact `
  "app\teacher\classes\page.tsx" `
  $old `
  $new `
  "Start stable teacher classes loader"
) { $changes++ }

# Close callback and give it the actual user dependency.
$old = @'
  }

  useEffect(() => {
'@
$new = @'
  }, [user]);

  useEffect(() => {
'@
if (Replace-Exact `
  "app\teacher\classes\page.tsx" `
  $old `
  $new `
  "Close stable teacher classes loader"
) { $changes++ }

# Depend on the stable callback instead of user uid directly.
$old = @'
  }, [
    authLoading,
    profileReady,
    user?.uid,
  ]);
'@
$new = @'
  }, [
    authLoading,
    profileReady,
    loadClasses,
  ]);
'@
if (Replace-Exact `
  "app\teacher\classes\page.tsx" `
  $old `
  $new `
  "Use stable teacher classes dependency"
) { $changes++ }

Write-Host "3. Stabilising intervention page loader..."

$old = 'import { useEffect, useMemo, useRef, useState } from "react";'
$new = 'import { useCallback, useEffect, useMemo, useRef, useState } from "react";'
if (Replace-Exact `
  "app\teacher\interventions\page.tsx" `
  $old `
  $new `
  "Add useCallback to interventions page"
) { $changes++ }

# Existing loader is async; make its identity stable.
$old = @'
  async function load() {
'@
$new = @'
  const load = useCallback(async () => {
'@
if (Replace-Exact `
  "app\teacher\interventions\page.tsx" `
  $old `
  $new `
  "Start stable intervention loader"
) { $changes++ }

# This exact transition occurs immediately before the effect in the source.
$old = @'
  }

  useEffect(() => {
    void load();
  }, [user?.uid]);
'@
$new = @'
  }, [user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);
'@
if (Replace-Exact `
  "app\teacher\interventions\page.tsx" `
  $old `
  $new `
  "Close stable intervention loader and update effect dependency"
) { $changes++ }

Write-Host "4. Measuring lint after Pass 5B..."
Invoke-Lint $afterReport
$after = Get-Stats $afterReport

$lines = New-Object Collections.Generic.List[string]
$lines.Add("CS MASTER - P1 LINT REMEDIATION PASS 5B")
$lines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("Project: $ProjectRoot")
$lines.Add("Backup: $backup")
$lines.Add("")
$lines.Add("Applied source changes: $changes")
$lines.Add("")
$lines.Add("BEFORE")
$lines.Add("------")
$lines.Add("Problem files: $($before.ProblemFiles)")
$lines.Add("Errors: $($before.Errors)")
$lines.Add("Warnings: $($before.Warnings)")
$lines.Add("")
$lines.Add("AFTER")
$lines.Add("-----")
$lines.Add("Problem files: $($after.ProblemFiles)")
$lines.Add("Errors: $($after.Errors)")
$lines.Add("Warnings: $($after.Warnings)")
$lines.Add("")
$lines.Add("REMAINING RULE COUNTS")
$lines.Add("---------------------")
foreach($x in ($after.Rules.GetEnumerator() | Sort-Object Value -Descending)){
  $lines.Add("$($x.Key): $($x.Value)")
}
$lines.Add("")
$lines.Add("PASS 5B SCOPE")
$lines.Add("-------------")
$lines.Add("Stabilised the two non-integrity loaders called from effects:")
$lines.Add("teacher classes and teacher interventions.")
$lines.Add("Exam/quiz timer and integrity callback dependencies were not modified.")
$lines.Add("No set-state-in-effect finding was intentionally modified.")
$lines.Add("No ESLint rule or warning was disabled.")

[IO.File]::WriteAllLines(
  $summary,
  $lines,
  [Text.UTF8Encoding]::new($false)
)

Remove-Item $beforeReport,$afterReport -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Pass 5B complete." -ForegroundColor Green
Write-Host "Created: $summary" -ForegroundColor Yellow
Write-Host "Send me P1-LINT-PASS5B-SUMMARY.txt next."