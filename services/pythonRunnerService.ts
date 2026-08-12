import type {
  PythonRunRequest,
  PythonRunResult,
} from "@/types/programming";

type ReadyMessage = {
  type: "ready";
};

type InitialisationErrorMessage = {
  type: "initialisation-error";
  error: string;
};

type ResultMessage = {
  type: "result";
  id: string;
  stdout: string;
  stderr: string;
  error: string;
};

type WorkerResponse =
  | ReadyMessage
  | InitialisationErrorMessage
  | ResultMessage;

let worker: Worker | null = null;

let readyPromise: Promise<void> | null = null;

let requestCounter = 0;

const STARTUP_TIMEOUT_MS = 45_000;

function resetWorker() {
  if (worker) {
    worker.terminate();
  }

  worker = null;
  readyPromise = null;
}

function createWorker(): Worker {
  return new Worker(
    "/workers/python-runner.mjs",
    {
      type: "module",
    },
  );
}

function ensureWorker(): {
  worker: Worker;
  ready: Promise<void>;
} {
  if (typeof window === "undefined") {
    throw new Error(
      "Python execution is only available in the browser.",
    );
  }

  if (worker && readyPromise) {
    return {
      worker,
      ready: readyPromise,
    };
  }

  worker = createWorker();

  const activeWorker = worker;

  readyPromise = new Promise<void>(
    (resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        window.clearTimeout(startupTimer);

        activeWorker.removeEventListener(
          "message",
          handleMessage,
        );

        activeWorker.removeEventListener(
          "error",
          handleError,
        );
      };

      const succeed = () => {
        if (settled) return;

        settled = true;
        cleanup();
        resolve();
      };

      const fail = (message: string) => {
        if (settled) return;

        settled = true;
        cleanup();

        resetWorker();

        reject(
          new Error(message),
        );
      };

      const handleMessage = (
        event: MessageEvent<WorkerResponse>,
      ) => {
        const message = event.data;

        if (message.type === "ready") {
          succeed();
          return;
        }

        if (
          message.type ===
          "initialisation-error"
        ) {
          fail(
            message.error ||
              "The Python runtime could not be loaded.",
          );
        }
      };

      const handleError = (
        event: ErrorEvent,
      ) => {
        fail(
          event.message ||
            "The Python worker stopped while loading.",
        );
      };

      const startupTimer =
        window.setTimeout(() => {
          fail(
            "The Python runtime took too long to initialise.",
          );
        }, STARTUP_TIMEOUT_MS);

      activeWorker.addEventListener(
        "message",
        handleMessage,
      );

      activeWorker.addEventListener(
        "error",
        handleError,
      );
    },
  );

  return {
    worker,
    ready: readyPromise,
  };
}

export async function runPython({
  code,
  stdin = "",
  timeoutMs = 3000,
}: PythonRunRequest): Promise<PythonRunResult> {
  const startedAt = performance.now();

  const runner = ensureWorker();

  /*
   * Runtime loading is deliberately separate
   * from student-code execution.
   */
  await runner.ready;

  const activeWorker = runner.worker;

  const id =
    `python-${Date.now()}-${requestCounter++}`;

  return new Promise<PythonRunResult>(
    (resolve) => {
      let settled = false;

      const finish = (
        result: Omit<
          PythonRunResult,
          "durationMs"
        >,
      ) => {
        if (settled) return;

        settled = true;

        cleanup();

        resolve({
          ...result,
          durationMs: Math.round(
            performance.now() -
              startedAt,
          ),
        });
      };

      const handleMessage = (
        event: MessageEvent<WorkerResponse>,
      ) => {
        const message = event.data;

        if (
          message.type !== "result" ||
          message.id !== id
        ) {
          return;
        }

        finish({
          stdout:
            message.stdout ?? "",
          stderr:
            message.stderr ?? "",
          error:
            message.error ?? "",
          timedOut: false,
        });
      };

      const handleError = (
        event: ErrorEvent,
      ) => {
        finish({
          stdout: "",
          stderr: "",
          error:
            event.message ||
            "The Python worker stopped unexpectedly.",
          timedOut: false,
        });

        resetWorker();
      };

      const executionTimer =
        window.setTimeout(() => {
          /*
           * Infinite-loop or long-running
           * student code: terminate the worker.
           *
           * The next execution will initialise
           * a fresh Python runtime.
           */
          resetWorker();

          finish({
            stdout: "",
            stderr: "",
            error:
              `Execution stopped after ${timeoutMs} ms.`,
            timedOut: true,
          });
        }, timeoutMs);

      function cleanup() {
        window.clearTimeout(
          executionTimer,
        );

        activeWorker.removeEventListener(
          "message",
          handleMessage,
        );

        activeWorker.removeEventListener(
          "error",
          handleError,
        );
      }

      activeWorker.addEventListener(
        "message",
        handleMessage,
      );

      activeWorker.addEventListener(
        "error",
        handleError,
      );

      activeWorker.postMessage({
        type: "run",
        id,
        code,
        stdin,
      });
    },
  );
}

export function stopPythonRunner() {
  resetWorker();
}