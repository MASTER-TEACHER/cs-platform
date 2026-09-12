# CS Master beta join fixes

This package implements two beta fixes in one batch.

## Fix 1 - teacher school join route

`/join-school` is now a shared authenticated route. Approved teachers who do not yet
belong to a school can open the teacher school-invitation form instead of being pushed
through `StudentAccessGate` and returned to the teacher/dashboard flow.

School invitation codes remain single-use.

## Fix 2 - permanent reusable class join code

Every newly-created class receives an 8-character permanent class join code.

- The same code can be used by multiple students.
- Joining does not consume the code.
- Teachers can copy, disable/enable, or regenerate the code in Class Settings.
- Existing legacy classes can create a permanent code from Class Settings.
- Students enter the code from `/join-school`, which now becomes "Join a class" for student accounts.
- A student with no school membership can use a valid class code to join the class and its school in one step.
- A student already attached to another school is blocked.
- When billing enforcement is active, first-time school attachment through a class code respects the school seat limit.
- A duplicate join attempt is idempotent: the student gets an "already enrolled" result rather than duplicate membership.

## Apply

From PowerShell:

```powershell
cd C:\Users\cr7ri\CS-MASTER-BETA-JOIN-FIXES

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\APPLY-CS-MASTER-BETA-JOIN-FIXES.ps1 `
  -ProjectRoot "C:\Users\cr7ri\cs-platform-clean"
```

## Automated verification

```powershell
cd C:\Users\cr7ri\cs-platform-clean
npm run verify
```

Do not deploy until the build passes.

## Manual test A - teacher joins existing school

1. Use an approved teacher account with no `schoolId`.
2. Teacher -> School -> Enter teacher join code.
3. Confirm `/join-school` remains visible and does not redirect to the dashboard.
4. Generate a fresh single-use TEACHER school invitation from the permanent school account.
5. Enter the code.
6. Confirm the teacher lands on `/teacher/school`.
7. Confirm the teacher appears in the school's staff list.

## Manual test B - permanent class code

For an existing class:
1. Teacher -> Classes -> open class -> Settings.
2. Click `Create permanent class code` if the class is legacy and has no code.
3. Copy the code.

For a newly-created class:
1. Create the class.
2. Open Settings.
3. Confirm a code already exists.

Student tests:
1. Student A opens `/join-school`.
2. Confirm the page says `Join a class`.
3. Enter the permanent class code.
4. Confirm successful enrolment.
5. Repeat with Student B, Student C and Student D using THE SAME CODE.
6. Confirm all students appear in the same class.
7. Confirm the code is unchanged after each join.
8. Re-enter the same code as an already-enrolled student and confirm no duplicate is created.

## Manual test C - safety controls

1. Disable joining from Class Settings.
2. Try the same class code from a student account -> it must be rejected.
3. Re-enable the code -> it should work again.
4. Regenerate the code.
5. Old code -> must fail.
6. New code -> must work.
7. Student already belonging to a different school -> must be rejected.

## Important distinction

- School invitation code = single-use membership invitation.
- Class join code = reusable permanent class code.

The same school email domain is not used as the security boundary. School tenancy is
stored using `schoolId`; possession of a valid active class code can attach an
unassigned student to that class's school.
