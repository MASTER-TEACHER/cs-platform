import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs";

const allowedModules = [
  "math",
  "random",
  "statistics",
  "string",
  "collections",
  "itertools",
  "functools",
];

const pyodideReadyPromise = loadPyodide();

pyodideReadyPromise
  .then(() => {
    self.postMessage({
      type: "ready",
    });
  })
  .catch((error) => {
    self.postMessage({
      type: "initialisation-error",
      error:
        error instanceof Error
          ? error.message
          : "The Python runtime could not be loaded.",
    });
  });

function validateCode(code) {
  if (typeof code !== "string") {
    return "Code must be text.";
  }

  if (code.length > 20000) {
    return "Code is too large for the learning runner.";
  }

  const blockedPatterns = [
    /\bfrom\s+js\b/i,
    /\bimport\s+js\b/i,
    /\bfrom\s+pyodide\b/i,
    /\bimport\s+pyodide\b/i,
    /\bmicropip\b/i,
    /\bsubprocess\b/i,
    /\bsocket\b/i,
    /\burllib\b/i,
    /\brequests\b/i,
    /\baiohttp\b/i,
    /\bwebbrowser\b/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(code)) {
      return "This learning runner blocks browser, network and process-control modules.";
    }
  }

  return "";
}

self.onmessage = async (event) => {
  const { type, id, code, stdin = "" } = event.data ?? {};

  if (type !== "run") {
    return;
  }

  const validationError = validateCode(code);

  if (validationError) {
    self.postMessage({
      type: "result",
      id,
      stdout: "",
      stderr: "",
      error: validationError,
    });

    return;
  }

  try {
    const pyodide = await pyodideReadyPromise;

    pyodide.globals.set("__cs_student_code", code);
    pyodide.globals.set("__cs_student_input", stdin);
    pyodide.globals.set("__cs_allowed_modules", allowedModules);

    const jsonResult = await pyodide.runPythonAsync(`
import builtins
import contextlib
import io
import json
import traceback

_student_code = __cs_student_code
_input_text = __cs_student_input
_allowed = set(__cs_allowed_modules.to_py())

_input_values = iter(_input_text.splitlines())

_stdout = io.StringIO()
_stderr = io.StringIO()


def _learning_input(prompt=""):
    try:
        return next(_input_values)
    except StopIteration:
        raise EOFError("No more test input is available.")


_real_import = builtins.__import__


def _learning_import(
    name,
    globals=None,
    locals=None,
    fromlist=(),
    level=0
):
    root = name.split(".")[0]

    if root not in _allowed:
        raise ImportError(
            f"Module '{root}' is not enabled in the CS Master learning runner."
        )

    return _real_import(
        name,
        globals,
        locals,
        fromlist,
        level
    )


_safe_builtins = dict(vars(builtins))

_safe_builtins["input"] = _learning_input
_safe_builtins["__import__"] = _learning_import

for _blocked_name in (
    "eval",
    "exec",
    "compile",
):
    _safe_builtins.pop(
        _blocked_name,
        None
    )


_namespace = {
    "__name__": "__main__",
    "__builtins__": _safe_builtins,
}


_error = ""


try:
    with contextlib.redirect_stdout(
        _stdout
    ), contextlib.redirect_stderr(
        _stderr
    ):
        exec(
            compile(
                _student_code,
                "<student>",
                "exec"
            ),
            _namespace,
            _namespace
        )

except BaseException:
    _error = traceback.format_exc()


json.dumps({
    "stdout": _stdout.getvalue(),
    "stderr": _stderr.getvalue(),
    "error": _error,
})
`);

    const parsed = JSON.parse(jsonResult);

    self.postMessage({
      type: "result",
      id,
      stdout: parsed.stdout ?? "",
      stderr: parsed.stderr ?? "",
      error: parsed.error ?? "",
    });
  } catch (error) {
    self.postMessage({
      type: "result",
      id,
      stdout: "",
      stderr: "",
      error:
        error instanceof Error
          ? error.message
          : "Python could not run.",
    });
  }
};