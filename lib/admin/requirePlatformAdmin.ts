import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export type PlatformAdminActor = {
  uid: string;
  token: DecodedIdToken;
  email: string;
};

function readBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

export async function requirePlatformAdmin(
  request: Request,
): Promise<PlatformAdminActor> {
  const idToken = readBearerToken(request);

  if (!idToken) {
    throw new Error("AUTH_REQUIRED");
  }

  let token: DecodedIdToken;

  try {
    token = await adminAuth.verifyIdToken(idToken);
  } catch {
    throw new Error("AUTH_INVALID");
  }

  const profileSnapshot = await adminDb
    .collection("users")
    .doc(token.uid)
    .get();

  if (!profileSnapshot.exists) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const profile = profileSnapshot.data() ?? {};

  if (profile.role !== "admin") {
    throw new Error("ADMIN_REQUIRED");
  }

  return {
    uid: token.uid,
    token,
    email: typeof token.email === "string" ? token.email : "",
  };
}

export function platformAdminError(
  error: unknown,
): {
  status: number;
  message: string;
} {
  const code = error instanceof Error ? error.message : "";

  switch (code) {
    case "AUTH_REQUIRED":
      return {
        status: 401,
        message: "Sign in as a CS Master administrator.",
      };

    case "AUTH_INVALID":
      return {
        status: 401,
        message: "Your administrator session is invalid or has expired.",
      };

    case "PROFILE_NOT_FOUND":
      return {
        status: 403,
        message: "Your CS Master administrator profile could not be found.",
      };

    case "ADMIN_REQUIRED":
      return {
        status: 403,
        message: "CS Master administrator access is required.",
      };

    default:
      console.error("[Admin route] Internal request failure:", error);
      return {
        status: 500,
        message: "Administrator request failed.",
      };
  }
}
