import "server-only";

import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "crypto";

export function createVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashVerificationToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function verificationTokenMatches(
  token: string,
  storedHash: string,
): boolean {
  if (
    !token ||
    !storedHash
  ) {
    return false;
  }

  const suppliedHash =
    hashVerificationToken(
      token,
    );

  const suppliedBuffer =
    Buffer.from(
      suppliedHash,
      "hex",
    );

  const storedBuffer =
    Buffer.from(
      storedHash,
      "hex",
    );

  if (
    suppliedBuffer.length !==
    storedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    suppliedBuffer,
    storedBuffer,
  );
}