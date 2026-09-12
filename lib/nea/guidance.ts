import type { NeaStageId } from "@/types/nea";

export type NeaStageGuidance = {
  title: string;
  purpose: string;
  studentQuestions: string[];
  evidenceIdeas: string[];
  teacherPrompts: string[];
  integrityBoundary: string;
};

export const NEA_STAGE_GUIDANCE: Record<NeaStageId, NeaStageGuidance> = {
  analysis: {
    title: "Analysis",
    purpose:
      "Understand the problem, users, constraints and measurable success criteria before deciding how to build the solution.",
    studentQuestions: [
      "What real problem are you solving and for whom?",
      "What evidence do you have that the problem exists?",
      "What inputs, outputs and constraints matter?",
      "Which success criteria can be tested objectively later?",
      "What existing approaches did you investigate and what did you learn from them?",
    ],
    evidenceIdeas: [
      "Interview or questionnaire notes you produced",
      "Problem decomposition",
      "Requirements and measurable success criteria",
      "Research notes with sources",
      "Early data or process models",
    ],
    teacherPrompts: [
      "Which requirement is still vague?",
      "How will you prove this criterion has been met?",
      "What evidence supports the user's need?",
      "Which constraint has the greatest effect on the design?",
    ],
    integrityBoundary:
      "CS Master can help you question and refine your analysis, but it must not write the assessed analysis for you.",
  },
  design: {
    title: "Design",
    purpose:
      "Plan a solution that can be implemented and tested, with justified algorithms, data structures, interfaces and validation.",
    studentQuestions: [
      "What are the main modules or classes and their responsibilities?",
      "Which data structures fit the operations your solution performs?",
      "Which algorithms are central to the solution?",
      "How will invalid input and exceptional conditions be handled?",
      "How does each major design choice link back to a requirement?",
    ],
    evidenceIdeas: [
      "Structure charts, class diagrams or data models",
      "Pseudocode or flow diagrams you created",
      "Interface sketches",
      "Validation rules",
      "Design decision table with alternatives and justification",
    ],
    teacherPrompts: [
      "Why is this structure appropriate for the operations required?",
      "What alternative did you reject and why?",
      "Which part of the design is hardest to test?",
      "Where could coupling make later changes difficult?",
    ],
    integrityBoundary:
      "CS Master may explain design concepts and challenge your choices, but it must not generate a complete assessed design for submission.",
  },
  development: {
    title: "Development",
    purpose:
      "Implement the solution iteratively and preserve evidence of your own technical decisions, problems, fixes and refinements.",
    studentQuestions: [
      "What did you implement in this iteration?",
      "What technical problem did you encounter?",
      "How did you diagnose the problem?",
      "What changed in the code and why?",
      "What evidence demonstrates that you made and understood the decision?",
    ],
    evidenceIdeas: [
      "Version-control commits",
      "Code excerpts you wrote and annotated",
      "Debugging records",
      "Before/after screenshots",
      "Iteration notes linking changes to requirements",
    ],
    teacherPrompts: [
      "Explain this code in your own words.",
      "Why did you choose this algorithm or structure?",
      "What would happen if this input were different?",
      "Show the evidence trail from the problem to the fix.",
    ],
    integrityBoundary:
      "CS Master can explain language features, debugging strategies and concepts. It must not generate the student's assessed program or a complete solution to the project.",
  },
  testing: {
    title: "Testing",
    purpose:
      "Demonstrate systematically that the solution behaves as intended, including normal, boundary, erroneous and requirement-linked cases.",
    studentQuestions: [
      "Which requirement does each test provide evidence for?",
      "Have you included normal, boundary and invalid cases where appropriate?",
      "What did you expect before running the test?",
      "What actually happened?",
      "If a test failed, what changed and what retest proves the fix?",
    ],
    evidenceIdeas: [
      "Test plan linked to requirements",
      "Expected and actual results",
      "Screenshots or logs",
      "Failed test and correction evidence",
      "Regression/retest results",
    ],
    teacherPrompts: [
      "Which requirement has the weakest testing evidence?",
      "Why is this boundary value important?",
      "What does this failed test reveal?",
      "How do you know the fix did not break another feature?",
    ],
    integrityBoundary:
      "CS Master may help you understand testing methods and question your coverage, but it must not fabricate test evidence or results.",
  },
  evaluation: {
    title: "Evaluation",
    purpose:
      "Judge the finished solution against evidence, success criteria, user needs and technical limitations rather than merely describing what was built.",
    studentQuestions: [
      "Which success criteria were fully met, partly met or not met?",
      "What evidence supports each judgement?",
      "What did users or testing reveal?",
      "What are the most important technical limitations?",
      "Which improvement would have the greatest impact and why?",
    ],
    evidenceIdeas: [
      "Criteria-by-criteria judgement",
      "User feedback you collected",
      "Testing evidence referenced in evaluation",
      "Performance or usability observations",
      "Prioritised future improvements with justification",
    ],
    teacherPrompts: [
      "Where is the evidence for this judgement?",
      "Is this a limitation or simply a feature you did not include?",
      "Which improvement is highest priority and why?",
      "What would you measure if you had more development time?",
    ],
    integrityBoundary:
      "CS Master can challenge the strength of your evaluation, but the final judgements and written evaluation must be the student's own assessed work.",
  },
};
