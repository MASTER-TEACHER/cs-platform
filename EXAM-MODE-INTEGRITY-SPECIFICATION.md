# Exam Mode integrity requirements

These requirements apply to the future full Exam Mode, not the Exam Question
Trainer.

## Full-screen start

- Full screen must be requested only after the student presses Start Exam.
- The exam timer starts after full-screen entry succeeds.
- The standard student sidebar, navbar and browser-like app controls are hidden.
- If full-screen entry is refused, the controlled mock must not start.

## Full-screen exit countdown

When the student exits full screen:

1. Record an integrity event containing:
   - student ID;
   - attempt ID;
   - event type `fullscreen_exit`;
   - current question ID and number;
   - timestamp;
   - remaining exam time.

2. Display a blocking warning over the exam:

   `Return to full screen within 5 seconds or your exam will be submitted.`

3. Start a visible countdown:

   `5, 4, 3, 2, 1`

4. Provide a `Return to full screen` button. The button must call
   `document.documentElement.requestFullscreen()` from the student's click.

5. If full screen is restored before the countdown expires:
   - cancel automatic termination;
   - record `fullscreen_restored`;
   - continue the same exam timer;
   - preserve every answer.

6. If the student is not back in full screen after five seconds:
   - set the attempt status to `terminated`;
   - record termination reason `fullscreen_timeout`;
   - save all answers;
   - submit the exam automatically;
   - prevent the student from reopening or editing the attempt;
   - show the submitted report only after marking completes.

## Page visibility monitoring

- Record `page_hidden` when `document.visibilityState === "hidden"`.
- Record `page_visible` when the student returns.
- A page-hidden event does not replace the full-screen five-second rule.
- The final integrity report shows all visibility and full-screen events.

## Integrity result

The submitted attempt should include:

- `clean`;
- `warning`;
- `terminated`.

A terminated attempt must clearly state:

`Automatically submitted because full screen was not restored within 5 seconds.`

## Technical limitation

This is browser integrity monitoring, not a guaranteed lockdown browser.
Operating-system shortcuts, another device and unmanaged environments cannot be
fully prevented by an ordinary website.
