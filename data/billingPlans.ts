import type {
  IndividualPlanKey,
  PremiumFeatureMetadata,
  SchoolPlanKey,
} from "@/types/billing";

export type BillingPlan = {
  key: SchoolPlanKey;

  name: string;

  displayPrice: string;

  annualPricePence: number;

  seatLimit: number;

  description: string;

  highlights: string[];

  recommended?: boolean;
};

export type IndividualBillingPlan = {
  key: IndividualPlanKey;

  name: string;

  displayPrice: string;

  pricePence: number;

  billingInterval:
    | "month"
    | "year";

  description: string;

  highlights: string[];

  recommended?: boolean;

  annualSavingLabel?: string;
};

export type SchoolTrialPlan = {
  name: string;

  durationDays: number;

  cardRequired: boolean;

  description: string;

  highlights: string[];
};

/*
 * ---------------------------------------------------------
 * SCHOOL PLANS
 * ---------------------------------------------------------
 *
 * These remain annual licences.
 *
 * Stripe Price IDs are NOT stored here. They remain in
 * server-only environment variables.
 */

export const BILLING_PLANS: BillingPlan[] = [
  {
    key: "starter",

    name: "School Starter",

    displayPrice: "£499/year",

    annualPricePence: 49900,

    seatLimit: 100,

    description:
      "For smaller departments starting with CS Master.",

    highlights: [
      "Up to 100 student seats",
      "Full Student Premium access for licensed students",
      "Teacher workspace",
      "Classes and assignments",
      "Student progress analytics",
      "Curriculum and programming tools",
    ],
  },

  {
    key: "standard",

    name: "School Standard",

    displayPrice: "£999/year",

    annualPricePence: 99900,

    seatLimit: 300,

    recommended: true,

    description:
      "For most secondary-school Computer Science departments.",

    highlights: [
      "Up to 300 student seats",
      "Everything in School Starter",
      "Full teacher intelligence",
      "Exam Mode and integrity monitoring",
      "Interventions and reporting",
      "AI Tutor and adaptive learning",
    ],
  },

  {
    key: "pro",

    name: "School Pro",

    displayPrice: "£1,499/year",

    annualPricePence: 149900,

    seatLimit: 1000,

    description:
      "For larger schools, trusts and high-usage departments.",

    highlights: [
      "Up to 1,000 student seats",
      "Everything in School Standard",
      "Full CS Master platform",
      "Advanced analytics and interventions",
      "Large-scale licence capacity",
      "Priority commercial support",
    ],
  },
];

/*
 * ---------------------------------------------------------
 * INDIVIDUAL STUDENT PREMIUM
 * ---------------------------------------------------------
 *
 * Launch pricing:
 *
 * £6.99/month
 * £59.99/year
 */

export const INDIVIDUAL_BILLING_PLANS: IndividualBillingPlan[] = [
  {
    key: "premium_monthly",

    name: "Student Premium Monthly",

    displayPrice: "£6.99/month",

    pricePence: 699,

    billingInterval: "month",

    description:
      "Flexible monthly access to the complete individual student platform.",

    highlights: [
      "Full GCSE and A-level curriculum",
      "All supported exam boards",
      "Adaptive learning",
      "AI Tutor",
      "Exam Trainer and Exam Mode",
      "Full programming practice",
      "Knowledge Map",
      "Revision planning",
      "Advanced marking and feedback",
      "Detailed analytics",
    ],
  },

  {
    key: "premium_annual",

    name: "Student Premium Annual",

    displayPrice: "£59.99/year",

    pricePence: 5999,

    billingInterval: "year",

    recommended: true,

    annualSavingLabel:
      "Save £23.89 compared with monthly billing",

    description:
      "The complete Premium experience at the best individual value.",

    highlights: [
      "Everything in Student Premium Monthly",
      "One annual payment",
      "Best individual value",
      "Equivalent to about £5/month",
      "Manage or cancel through Stripe Billing Portal",
    ],
  },
];

/*
 * ---------------------------------------------------------
 * TEACHER / SCHOOL TRIAL
 * ---------------------------------------------------------
 *
 * No card required.
 *
 * The account itself remains permanent.
 * Only the school entitlement expires after 14 days.
 */

export const SCHOOL_TRIAL_PLAN: SchoolTrialPlan = {
  name: "CS Master School Trial",

  durationDays: 14,

  cardRequired: false,

  description:
    "Explore the complete teacher and school experience for 14 days with no payment card required.",

  highlights: [
    "Full teacher dashboard",
    "Classes and assignments",
    "Student progress monitoring",
    "Analytics and interventions",
    "Teacher reports",
    "Exam Mode management",
    "School administration tools",
    "Student Premium experience",
    "Pre-populated demo class with synthetic student data",
  ],
};

/*
 * ---------------------------------------------------------
 * PREMIUM FEATURE CATALOGUE
 * ---------------------------------------------------------
 *
 * Free students can SEE these features.
 *
 * If access is denied, the relevant metadata is used to
 * explain the feature and present an upgrade prompt.
 */

export const PREMIUM_FEATURES: PremiumFeatureMetadata[] = [
  {
    key: "full_curriculum",

    title: "Full Curriculum",

    shortDescription:
      "Unlock every published GCSE and A-level Computer Science lesson.",

    benefits: [
      "Complete GCSE curriculum access",
      "Complete A-level curriculum access",
      "Interactive lesson activities",
      "Exam-focused explanations and checkpoints",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "all_exam_boards",

    title: "All Exam Boards",

    shortDescription:
      "Access curriculum content aligned to all supported examination boards.",

    benefits: [
      "AQA-aligned curriculum",
      "OCR-aligned curriculum",
      "Pearson Edexcel-aligned curriculum",
      "Course-specific revision pathways",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "adaptive_learning",

    title: "Adaptive Learning",

    shortDescription:
      "Receive personalised learning recommendations based on your strengths and gaps.",

    benefits: [
      "Personalised next-topic recommendations",
      "Automatic weakness detection",
      "Mastery-based progression",
      "Targeted revision suggestions",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "knowledge_map",

    title: "Knowledge Map",

    shortDescription:
      "See your Computer Science knowledge strengths and gaps at a glance.",

    benefits: [
      "Topic mastery overview",
      "Weak-area identification",
      "Progress across the specification",
      "Revision priorities",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "advanced_analytics",

    title: "Advanced Analytics",

    shortDescription:
      "Understand your progress through detailed performance analytics.",

    benefits: [
      "Topic-level accuracy",
      "Progress trends",
      "Mastery tracking",
      "Performance insights",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "ai_tutor",

    title: "AI Tutor",

    shortDescription:
      "Get personalised Computer Science support whenever you need it.",

    benefits: [
      "Ask questions about any supported topic",
      "Receive explanations at your level",
      "Get hints before full solutions",
      "Identify misconceptions",
      "Receive exam-focused support",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "revision_plan",

    title: "Revision Planner",

    shortDescription:
      "Build a personalised revision plan based on your course and performance.",

    benefits: [
      "Personalised revision priorities",
      "Weak-topic scheduling",
      "Exam preparation planning",
      "Progress-aware recommendations",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "exam_mode",

    title: "Exam Mode",

    shortDescription:
      "Practise under realistic timed exam conditions.",

    benefits: [
      "Timed exam sessions",
      "Exam-style question sets",
      "Integrity monitoring",
      "Automatic submission",
      "Examiner-style feedback",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "exam_trainer",

    title: "Exam Trainer",

    shortDescription:
      "Practise exam questions and improve your responses with targeted feedback.",

    benefits: [
      "Exam-style practice",
      "Question history",
      "Mark-scheme feedback",
      "Improved-answer guidance",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "full_quiz_bank",

    title: "Full Quiz Bank",

    shortDescription:
      "Unlock unlimited access to CS Master quiz practice.",

    benefits: [
      "Full question bank",
      "Topic-specific practice",
      "Instant feedback",
      "Progress tracking",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "programming_lab",

    title: "Programming Lab",

    shortDescription:
      "Develop programming skills through interactive practice and challenges.",

    benefits: [
      "Python practice",
      "Debugging challenges",
      "Progressive difficulty",
      "Programming feedback",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "visualisers",

    title: "Computer Science Visualisers",

    shortDescription:
      "Explore difficult Computer Science concepts interactively.",

    benefits: [
      "Algorithm visualisation",
      "Data representation tools",
      "Programming concept visualisation",
      "Interactive learning support",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "advanced_marking",

    title: "Advanced Marking",

    shortDescription:
      "Receive detailed examiner-style feedback on extended responses.",

    benefits: [
      "Mark-scheme analysis",
      "Matched and missing points",
      "Improved model responses",
      "Examiner-style feedback",
    ],

    audience: "student",

    requiredTier:
      "student_premium",
  },

  {
    key: "teacher_dashboard",

    title: "Teacher Dashboard",

    shortDescription:
      "Manage teaching, classes and student progress from one workspace.",

    benefits: [
      "Class overview",
      "Student progress",
      "Teaching insights",
      "Assignment monitoring",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "classes",

    title: "Classes",

    shortDescription:
      "Create and manage Computer Science classes.",

    benefits: [
      "Student enrolment",
      "Class management",
      "Progress overview",
      "Assignment workflows",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "assignments",

    title: "Assignments",

    shortDescription:
      "Create, assign and monitor learning activities.",

    benefits: [
      "Lesson assignments",
      "Quiz assignments",
      "Programming assignments",
      "Exam assignments",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "student_monitoring",

    title: "Student Monitoring",

    shortDescription:
      "Track student progress and identify learners who need support.",

    benefits: [
      "Individual student analytics",
      "Class performance",
      "Mastery tracking",
      "Progress alerts",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "interventions",

    title: "Interventions",

    shortDescription:
      "Identify and manage targeted student support.",

    benefits: [
      "Weakness detection",
      "Intervention workflows",
      "Follow-up tracking",
      "Teacher action planning",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "teacher_reports",

    title: "Teacher Reports",

    shortDescription:
      "Generate useful reports from student and class performance.",

    benefits: [
      "Student reports",
      "Class reports",
      "Progress summaries",
      "Evidence for intervention",
    ],

    audience: "teacher",

    requiredTier:
      "school",
  },

  {
    key: "school_analytics",

    title: "School Analytics",

    shortDescription:
      "Understand Computer Science performance across classes and cohorts.",

    benefits: [
      "Class comparisons",
      "Cohort trends",
      "Weak-topic analysis",
      "Performance intelligence",
    ],

    audience: "school",

    requiredTier:
      "school",
  },

  {
    key: "school_administration",

    title: "School Administration",

    shortDescription:
      "Manage school access, licences and teaching staff.",

    benefits: [
      "Licence management",
      "Teacher access",
      "Student seat management",
      "School-level controls",
    ],

    audience: "school",

    requiredTier:
      "school",
  },
];

/*
 * ---------------------------------------------------------
 * LOOKUP HELPERS
 * ---------------------------------------------------------
 */

export function getBillingPlan(
  key: SchoolPlanKey,
): BillingPlan {
  const plan =
    BILLING_PLANS.find(
      (item) =>
        item.key === key,
    );

  if (!plan) {
    throw new Error(
      "Unknown billing plan.",
    );
  }

  return plan;
}

export function getIndividualBillingPlan(
  key: IndividualPlanKey,
): IndividualBillingPlan {
  const plan =
    INDIVIDUAL_BILLING_PLANS.find(
      (item) =>
        item.key === key,
    );

  if (!plan) {
    throw new Error(
      "Unknown individual billing plan.",
    );
  }

  return plan;
}

export function getPremiumFeature(
  key: PremiumFeatureMetadata["key"],
): PremiumFeatureMetadata {
  const feature =
    PREMIUM_FEATURES.find(
      (item) =>
        item.key === key,
    );

  if (!feature) {
    throw new Error(
      "Unknown Premium feature.",
    );
  }

  return feature;
}
