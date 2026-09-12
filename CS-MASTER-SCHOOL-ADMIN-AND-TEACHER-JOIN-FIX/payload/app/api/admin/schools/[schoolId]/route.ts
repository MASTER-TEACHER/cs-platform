import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebaseAdmin";
import {
  platformAdminError,
  requirePlatformAdmin,
} from "@/lib/admin/requirePlatformAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function loadSchool(schoolId: string) {
  const schoolRef = adminDb.collection("schools").doc(schoolId);
  const snapshot = await schoolRef.get();

  if (!snapshot.exists) {
    throw new Error("SCHOOL_NOT_FOUND");
  }

  return {
    schoolRef,
    data: snapshot.data() ?? {},
  };
}

async function revokeActiveInvites(schoolId: string): Promise<number> {
  const invitesSnapshot = await adminDb
    .collection("schoolInvites")
    .where("schoolId", "==", schoolId)
    .get();

  const activeInvites = invitesSnapshot.docs.filter(
    (invite) => invite.data().status === "active",
  );

  if (activeInvites.length === 0) {
    return 0;
  }

  const writer = adminDb.bulkWriter();

  for (const invite of activeInvites) {
    writer.set(
      invite.ref,
      {
        status: "revoked",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await writer.close();
  return activeInvites.length;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ schoolId: string }> },
) {
  try {
    const actor = await requirePlatformAdmin(request);
    const { schoolId: rawSchoolId } = await context.params;
    const schoolId = cleanString(rawSchoolId);

    if (!schoolId) {
      return NextResponse.json(
        { error: "A valid school ID is required." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as { action?: unknown };
    const action = cleanString(body.action);

    if (action !== "archive" && action !== "restore") {
      return NextResponse.json(
        { error: "Choose archive or restore." },
        { status: 400 },
      );
    }

    const { schoolRef, data } = await loadSchool(schoolId);
    const schoolName = cleanString(data.name) || "Unnamed School";
    const nextStatus = action === "archive" ? "archived" : "active";

    await schoolRef.set(
      {
        status: nextStatus,
        updatedAt: FieldValue.serverTimestamp(),
        ...(action === "archive"
          ? {
              archivedAt: FieldValue.serverTimestamp(),
              archivedByUserId: actor.uid,
            }
          : {
              archivedAt: null,
              restoredAt: FieldValue.serverTimestamp(),
              restoredByUserId: actor.uid,
            }),
      },
      { merge: true },
    );

    const revokedInvites =
      action === "archive" ? await revokeActiveInvites(schoolId) : 0;

    await adminDb.collection("adminAuditLogs").add({
      action: action === "archive" ? "school_archived" : "school_restored",
      schoolId,
      schoolName,
      actorUserId: actor.uid,
      actorEmail: actor.email,
      revokedInvites,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      schoolId,
      status: nextStatus,
      revokedInvites,
    });
  } catch (error) {
    console.error("Admin school status update error:", error);

    if (error instanceof Error && error.message === "SCHOOL_NOT_FOUND") {
      return NextResponse.json(
        { error: "The school could not be found." },
        { status: 404 },
      );
    }

    const failure = platformAdminError(error);
    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ schoolId: string }> },
) {
  try {
    const actor = await requirePlatformAdmin(request);
    const { schoolId: rawSchoolId } = await context.params;
    const schoolId = cleanString(rawSchoolId);

    if (!schoolId) {
      return NextResponse.json(
        { error: "A valid school ID is required." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as { confirmation?: unknown };
    const confirmation = cleanString(body.confirmation);

    const { schoolRef, data } = await loadSchool(schoolId);
    const schoolName = cleanString(data.name) || "Unnamed School";

    if (confirmation !== schoolName) {
      return NextResponse.json(
        {
          error: `Type the exact school name (${schoolName}) to confirm permanent deletion.`,
        },
        { status: 400 },
      );
    }

    const [classesSnapshot, usersSnapshot, invitesSnapshot, trialsSnapshot, subscriptionSnapshot] =
      await Promise.all([
        adminDb.collection("classes").where("schoolId", "==", schoolId).get(),
        adminDb.collection("users").where("schoolId", "==", schoolId).get(),
        adminDb.collection("schoolInvites").where("schoolId", "==", schoolId).get(),
        adminDb.collection("schoolTrials").where("schoolId", "==", schoolId).get(),
        adminDb.collection("schoolSubscriptions").doc(schoolId).get(),
      ]);

    if (!classesSnapshot.empty) {
      return NextResponse.json(
        {
          error:
            "This school still has classes. Archive the school instead, or remove/archive its classes before permanent deletion.",
          blockers: {
            classes: classesSnapshot.size,
          },
        },
        { status: 409 },
      );
    }

    const subscription = subscriptionSnapshot.data() ?? {};
    const isComplimentary = subscription.complimentaryAccess === true;
    const stripeCustomerId = cleanString(subscription.stripeCustomerId);
    const stripeSubscriptionId = cleanString(subscription.stripeSubscriptionId);

    if (isComplimentary) {
      return NextResponse.json(
        {
          error:
            "This school has protected complimentary access and cannot be permanently deleted from the admin screen.",
        },
        { status: 409 },
      );
    }

    if (stripeCustomerId || stripeSubscriptionId) {
      return NextResponse.json(
        {
          error:
            "This school has Stripe billing history. Archive it instead of permanently deleting it.",
        },
        { status: 409 },
      );
    }

    const writer = adminDb.bulkWriter();

    for (const userSnapshot of usersSnapshot.docs) {
      const userData = userSnapshot.data();
      const personalPlan = userData.personalPlan === "premium" ? "premium" : "free";

      writer.set(
        userSnapshot.ref,
        {
          schoolId: null,
          schoolName: FieldValue.delete(),
          school: FieldValue.delete(),
          accountType: "individual",
          plan: personalPlan,
          classIds: [],
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    for (const inviteSnapshot of invitesSnapshot.docs) {
      writer.delete(inviteSnapshot.ref);
    }

    for (const trialSnapshot of trialsSnapshot.docs) {
      writer.delete(trialSnapshot.ref);
    }

    if (subscriptionSnapshot.exists) {
      writer.delete(subscriptionSnapshot.ref);
    }

    await writer.close();

    // Deletes the school document and every nested school subcollection,
    // including schools/{schoolId}/members.
    await adminDb.recursiveDelete(schoolRef);

    await adminDb.collection("adminAuditLogs").add({
      action: "school_permanently_deleted",
      schoolId,
      schoolName,
      actorUserId: actor.uid,
      actorEmail: actor.email,
      detachedUsers: usersSnapshot.size,
      deletedInvites: invitesSnapshot.size,
      deletedTrialRecords: trialsSnapshot.size,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      schoolId,
      schoolName,
      detachedUsers: usersSnapshot.size,
    });
  } catch (error) {
    console.error("Admin permanent school deletion error:", error);

    if (error instanceof Error && error.message === "SCHOOL_NOT_FOUND") {
      return NextResponse.json(
        { error: "The school could not be found." },
        { status: 404 },
      );
    }

    const failure = platformAdminError(error);
    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}
