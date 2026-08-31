import "server-only";

type TeacherVerificationEmailInput = {
  teacherName: string;
  teacherEmail: string;
  schoolName: string;
  jobTitle: string;
  verificationUrl: string;
  expiresAt: Date;
};

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;",
    );
}

export function createTeacherVerificationEmail({
  teacherName,
  teacherEmail,
  schoolName,
  jobTitle,
  verificationUrl,
  expiresAt,
}: TeacherVerificationEmailInput) {
  const safeTeacherName =
    escapeHtml(
      teacherName,
    );

  const safeTeacherEmail =
    escapeHtml(
      teacherEmail,
    );

  const safeSchoolName =
    escapeHtml(
      schoolName,
    );

  const safeJobTitle =
    escapeHtml(
      jobTitle,
    );

  const expiry =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(
      expiresAt,
    );

  const subject =
    `Verify ${teacherName}'s CS Master teacher account`;

  const text = [
    "CS Master teacher verification",
    "",
    `${teacherName} has requested teacher access to CS Master and has stated that they work at ${schoolName}.`,
    "",
    `Teacher: ${teacherName}`,
    `Teacher email: ${teacherEmail}`,
    `Job title: ${jobTitle}`,
    "",
    "Please use the secure link below to approve or reject this request:",
    verificationUrl,
    "",
    `The verification link expires on ${expiry}.`,
    "",
    "Opening the link does not automatically approve the teacher. You will be asked to confirm your decision.",
    "",
    "If you do not recognise this person or request, you can reject it.",
  ].join("\n");

  const html = `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 680px;
        margin: 0 auto;
        padding: 28px;
        color: #0f172a;
      "
    >
      <div
        style="
          background: #0f172a;
          color: white;
          border-radius: 18px;
          padding: 26px;
        "
      >
        <div
          style="
            color: #93c5fd;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.2px;
          "
        >
          CS MASTER
        </div>

        <h1
          style="
            margin: 10px 0 0;
            font-size: 28px;
          "
        >
          Teacher verification request
        </h1>
      </div>

      <div
        style="
          padding: 28px 4px;
        "
      >
        <p
          style="
            font-size: 16px;
            line-height: 1.7;
          "
        >
          <strong>${safeTeacherName}</strong>
          has requested teacher access to CS Master and
          has stated that they work at
          <strong>${safeSchoolName}</strong>.
        </p>

        <div
          style="
            margin: 24px 0;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            background: #f8fafc;
          "
        >
          <p style="margin: 0 0 8px;">
            <strong>Teacher:</strong>
            ${safeTeacherName}
          </p>

          <p style="margin: 0 0 8px;">
            <strong>Email:</strong>
            ${safeTeacherEmail}
          </p>

          <p style="margin: 0;">
            <strong>Job title:</strong>
            ${safeJobTitle}
          </p>
        </div>

        <p
          style="
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Please confirm whether this person is authorised
          to use CS Master as a teacher for your school.
        </p>

        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            margin-top: 12px;
            padding: 14px 22px;
            background: #2563eb;
            color: #ffffff;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 800;
          "
        >
          Review teacher request
        </a>

        <p
          style="
            margin-top: 24px;
            font-size: 13px;
            line-height: 1.6;
            color: #64748b;
          "
        >
          This secure link expires on ${expiry}.
          Opening it does not automatically approve the
          teacher. You will be asked to approve or reject
          the request.
        </p>
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
}