import { runPython } from "@/services/pythonRunnerService";
import type {
  ProgrammingChallenge,
  ProgrammingEvaluation,
  ProgrammingTestCase,
  ProgrammingTestResult,
} from "@/types/programming";

export function normaliseProgrammingOutput(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .trim();
}

async function evaluateTest(
  code: string,
  test: ProgrammingTestCase,
): Promise<ProgrammingTestResult> {
  const result = await runPython({
    code,
    stdin: test.input,
    timeoutMs: 3000,
  });

  const actualOutput = normaliseProgrammingOutput(result.stdout);
  const expectedOutput = normaliseProgrammingOutput(test.expectedOutput);

  return {
    id: test.id,
    label: test.label,
    hidden: test.hidden === true,
    passed:
      !result.error &&
      !result.stderr &&
      actualOutput === expectedOutput,
    expectedOutput,
    actualOutput,
    error: result.error || result.stderr,
  };
}

export async function evaluateProgrammingChallenge(
  challenge: ProgrammingChallenge,
  code: string,
): Promise<ProgrammingEvaluation> {
  const tests = [
    ...challenge.visibleTests,
    ...challenge.hiddenTests.map((test) => ({
      ...test,
      hidden: true,
    })),
  ];

  const results: ProgrammingTestResult[] = [];

  for (const test of tests) {
    results.push(await evaluateTest(code, test));
  }

  const passedCount = results.filter((result) => result.passed).length;

  return {
    passed: results.length > 0 && passedCount === results.length,
    passedCount,
    totalCount: results.length,
    results,
  };
}
