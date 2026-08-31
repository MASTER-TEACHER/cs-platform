export type TeacherVerificationRisk =
  | "same_organisation_domain"
  | "domain_mismatch"
  | "personal_email_domain"
  | "invalid_email_domain";

export type TeacherVerificationDomainAnalysis = {
  teacherDomain: string;
  administratorDomain: string;

  sameDomain: boolean;
  personalDomain: boolean;

  risk: TeacherVerificationRisk;

  autoApproveEligible: boolean;
};

const PERSONAL_EMAIL_DOMAINS =
  new Set([
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "msn.com",
    "yahoo.com",
    "yahoo.co.uk",
    "icloud.com",
    "me.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "gmx.com",
    "gmx.co.uk",
    "mail.com",
  ]);

function normaliseEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

export function getEmailDomain(
  email: string,
): string {
  const cleaned =
    normaliseEmail(email);

  const atIndex =
    cleaned.lastIndexOf("@");

  if (
    atIndex <= 0 ||
    atIndex ===
      cleaned.length - 1
  ) {
    return "";
  }

  return cleaned
    .slice(atIndex + 1)
    .trim();
}

export function isPersonalEmailDomain(
  domain: string,
): boolean {
  return PERSONAL_EMAIL_DOMAINS.has(
    domain
      .trim()
      .toLowerCase(),
  );
}

export function analyseTeacherVerificationDomains(
  teacherEmail: string,
  administratorEmail: string,
): TeacherVerificationDomainAnalysis {
  const teacherDomain =
    getEmailDomain(
      teacherEmail,
    );

  const administratorDomain =
    getEmailDomain(
      administratorEmail,
    );

  if (
    !teacherDomain ||
    !administratorDomain
  ) {
    return {
      teacherDomain,
      administratorDomain,

      sameDomain: false,
      personalDomain: false,

      risk:
        "invalid_email_domain",

      autoApproveEligible:
        false,
    };
  }

  const sameDomain =
    teacherDomain ===
    administratorDomain;

  const personalDomain =
    isPersonalEmailDomain(
      teacherDomain,
    ) ||
    isPersonalEmailDomain(
      administratorDomain,
    );

  if (personalDomain) {
    return {
      teacherDomain,
      administratorDomain,

      sameDomain,
      personalDomain: true,

      risk:
        "personal_email_domain",

      autoApproveEligible:
        false,
    };
  }

  if (!sameDomain) {
    return {
      teacherDomain,
      administratorDomain,

      sameDomain: false,
      personalDomain: false,

      risk:
        "domain_mismatch",

      autoApproveEligible:
        false,
    };
  }

  return {
    teacherDomain,
    administratorDomain,

    sameDomain: true,
    personalDomain: false,

    risk:
      "same_organisation_domain",

    autoApproveEligible:
      true,
  };
}