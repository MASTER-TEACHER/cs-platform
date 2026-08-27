import {
  auth,
} from "@/lib/firebase";

import type {
  IndividualPlanKey,
  IndividualSubscriptionSummary,
  SchoolPlanKey,
  SchoolSubscriptionSummary,
} from "@/types/billing";

async function authHeaders(): Promise<
  Record<string, string>
> {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Sign in to continue.",
    );
  }

  return {
    "Content-Type":
      "application/json",
    Authorization:
      `Bearer ${await user.getIdToken()}`,
  };
}

async function jsonResponse<T>(
  response: Response,
): Promise<T> {
  const data =
    (await response.json()) as
      T & {
        error?: string;
      };

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Billing request failed.",
    );
  }

  return data;
}

export async function getSchoolSubscription(): Promise<SchoolSubscriptionSummary> {
  const response =
    await fetch(
      "/api/billing/status",
      {
        headers:
          await authHeaders(),
        cache:
          "no-store",
      },
    );

  return jsonResponse<SchoolSubscriptionSummary>(
    response,
  );
}

export async function getIndividualSubscription(): Promise<IndividualSubscriptionSummary> {
  const response =
    await fetch(
      "/api/billing/individual/status",
      {
        headers:
          await authHeaders(),
        cache:
          "no-store",
      },
    );

  return jsonResponse<IndividualSubscriptionSummary>(
    response,
  );
}

export async function startSchoolCheckout(
  planKey: SchoolPlanKey,
): Promise<void> {
  const response =
    await fetch(
      "/api/billing/checkout",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            planKey,
          }),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function startIndividualCheckout(
  planKey: IndividualPlanKey,
): Promise<void> {
  const response =
    await fetch(
      "/api/billing/individual/checkout",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            planKey,
          }),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function openBillingPortal(): Promise<void> {
  const response =
    await fetch(
      "/api/billing/portal",
      {
        method: "POST",
        headers:
          await authHeaders(),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function openIndividualBillingPortal(): Promise<void> {
  const response =
    await fetch(
      "/api/billing/individual/portal",
      {
        method: "POST",
        headers:
          await authHeaders(),
      },
    );

  const result =
    await jsonResponse<{
      url: string;
    }>(response);

  window.location.assign(
    result.url,
  );
}

export async function acceptSchoolInviteWithBilling(
  code: string,
): Promise<{
  schoolId: string;
  role: "student" | "teacher";
}> {
  const response =
    await fetch(
      "/api/schools/join",
      {
        method: "POST",
        headers:
          await authHeaders(),
        body:
          JSON.stringify({
            code,
          }),
      },
    );

  return jsonResponse(
    response,
  );
}