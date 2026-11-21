// Conservative, subject-independent quality flags. These are warnings, never proof of correctness.
export type FlagMark = { questionId: string; answerText: string; awardedMarks: number; feedback: string; improvementGuidance?: string; evidence: string; confidence: string; needsReview: boolean };
export type FlagQuestion = { id: string; maxMarks: number };
export type ReviewFlag = { questionId: string; code: string; detail: string };

// Check only unambiguous integer arithmetic in AI-written explanations.
// No eval, dynamic code, symbolic algebra, or student-answer scoring.
function numericExpression(expression: string): number | null {
  const tokens = expression.replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/[−]/g, '-').match(/\d+(?:\.\d+)?|[()+*/-]/g);
  if (!tokens || tokens.join('') !== expression.replace(/\s/g, '').replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/[−]/g, '-')) return null;
  let pos = 0;
  function factor(): number | null {
    const token = tokens![pos++];
    if (token === '-') { const n = factor(); return n === null ? null : -n; }
    if (token === '+') return factor();
    if (token === '(') { const n = sum(); if (tokens![pos++] !== ')') return null; return n; }
    if (token && /^\d/.test(token)) return Number(token);
    return null;
  }
  function product(): number | null {
    let value = factor();
    while (value !== null && (tokens![pos] === '*' || tokens![pos] === '/')) {
      const op = tokens![pos++], rhs = factor();
      if (rhs === null || (op === '/' && rhs === 0)) return null;
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  }
  function sum(): number | null {
    let value = product();
    while (value !== null && (tokens![pos] === '+' || tokens![pos] === '-')) {
      const op = tokens![pos++], rhs = product();
      if (rhs === null) return null;
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }
  const value = sum();
  return pos === tokens.length && value !== null && Number.isFinite(value) ? value : null;
}
// A deliberately narrow, subject-independent check: a bare admission of missing work
// cannot substantiate claims that a method was demonstrated. Other brief responses
// may be legitimate and are never automatically zeroed by this heuristic.
export function isExplicitNonAnswer(answer: string): boolean {
  return /^(?:no answer|not answered|blank|left blank|unanswered|n\/?a|i (?:do not|don.t) know|incorrect calculation|wrong calculation|no working|no calculation|not attempted|skipped|\s*)[.!\s]*$/i.test(answer.trim());
}
export function unsupportedWorkingClaim(answer: string, narrative: string): boolean {
  const compact = answer.trim();
  if (!compact || isExplicitNonAnswer(compact)) {
    // Detect affirmative claims of demonstrated work, not negative statements such as
    // "No substantive response was identified" or "No working was shown".
    const positiveMethodClaim = /\b(?:candidate|student|answer|response)\s+(?:has\s+|had\s+|was\s+|is\s+)?(?:correctly\s+|successfully\s+)?(?:shown|demonstrated|identified|applied|used|performed|calculated|integrated|differentiated|factorised|factored|substituted|derived|worked out)\b|\b(?:correctly|successfully)\s+(?:shown|demonstrated|identified|applied|used|performed|calculated|integrated|differentiated|factorised|factored|substituted|derived)\b/i;
    const withoutNegativeStatements = narrative.replace(/[^.!?\n]+[.!?]?/g, sentence =>
      /\b(?:no|not|never|without|none|cannot|can't|didn't|doesn't|wasn't|isn't|absent|missing|lack(?:s|ing|ed)?)\b/i.test(sentence) ? '' : sentence
    );
    return positiveMethodClaim.test(withoutNegativeStatements);
  }
  // A bare number, short guess or generic assertion contains no visible method.
  // Flag only when the AI explicitly attributes method/working to the candidate.
  const bare = /^(?:(?:i think|i guess|my answer is|answer is|the answer is)\s*)?(?:[-+]?\d+(?:\.\d+)?|yes|no|true|false)[.!\s]*$/i.test(compact);
  return bare && /\b(?:working|steps|method|factoris(?:ation|ed)|integrat(?:ion|ed)|differentiat(?:ion|ed)|substitut(?:ion|ed)|calculat(?:ion|ed)|formula|identified|applied|showed|demonstrated)\b/i.test(narrative) && /\b(?:candidate|student|answer|response|working|steps)\b/i.test(narrative);
}
/**
 * True when an uncertainty could change the mark. Notes such as "None", or doubts the marker says
 * have no effect ("no reading would earn the mark", "does not change the outcome") are not material.
 */
export function isMaterialUncertainty(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/^(?:none|n\/?a|nil|null|no\.?$|-+|no (?:uncertaint|issues?|concerns?|ambiguit)|nothing (?:uncertain|to report)|not applicable)/i.test(t)) return false;
  return !/(?:does not|doesn't|did not|would not|will not|cannot) (?:change|affect|alter) (?:the )?(?:outcome|mark|marks|result|level|credit)|no (?:plausible |possible )?reading (?:of it )?(?:would |could )?(?:earns?|gains?|changes?|makes?|gives?|affects?)|(?:every|any|all) plausible readings?|under any (?:plausible )?reading|either way|not needed for any mark|is not needed|does not matter|doesn't matter|no effect on|regardless of (?:the )?reading|so it is ignored|still (?:earns|scores) (?:the mark|0)|still scores? 0|no reading earns|ignored because (?:a |the )?(?:replacement|same answer)|(?:was|were) replaced by (?:the |a )?(?:same|correct|final|replacement)?/i.test(t);
}

/** Short, specific reason for a review flag, taken from the saved evidence line. */
export function flagReason(evidence: string): string {
  const reasons: string[] = [];
  const changed = evidence.match(/Moderator changed (\d+) to (\d+)/);
  if (changed) reasons.push(`markers disagreed (${changed[1]} vs ${changed[2]})`);
  if (/Marked by one examiner only|Moderation unavailable/.test(evidence)) reasons.push('moderation unavailable');
  const checks = evidence.match(/(?:^|\| )Checks: (.*?)(?= \| [A-Z][a-z]+: |$)/);
  if (checks && !/Marked by one examiner only/.test(checks[1])) reasons.push(`check: ${checks[1].replace(/Marked by one examiner only[^.]*\./, '').trim().slice(0, 90)}`);
  const uncertain = evidence.match(/(?:^|\| )Uncertain: (.*?)(?= \| [A-Z][a-z]+: |$)/);
  if (uncertain) reasons.push(`uncertain: ${uncertain[1].slice(0, 90)}`);
  if (/AI marking failed twice/.test(evidence)) reasons.push('AI could not mark this question');
  if (!reasons.length && /UNCERTAIN/.test(evidence)) reasons.push('credit relies on an uncertain reading');
  return reasons.length ? reasons.join('; ') : 'review requested: see Evidence';
}

export function qualityFlags(marks: FlagMark[], questions: FlagQuestion[], alignmentWarnings: string[] = []): ReviewFlag[] {
  const flags: ReviewFlag[] = [];
  for (const mark of marks) {
    const original = mark as FlagMark & { teacherJustification?: string };
    if (original.teacherJustification?.trim() && /\b(?:correct(?:ly)?[\s\w]{0,35}(?:method|working|approach|calculation)|(?:method|working|approach)[\s\w]{0,20}(?:correct|shown|demonstrated))\b/i.test([mark.feedback, mark.improvementGuidance, mark.evidence].join(" "))) {
      flags.push({ questionId: mark.questionId, code: "OVERRIDE_FEEDBACK_CHECK", detail: "Teacher override present with positive method claim; review feedback and guidance for consistency." });
    }
    const question = questions.find(q => q.id === mark.questionId);
    const add = (code: string, detail: string) => flags.push({ questionId: mark.questionId, code, detail });
    const blank = !mark.answerText.trim() || isExplicitNonAnswer(mark.answerText);
    if (mark.needsReview) add('UNCERTAIN', flagReason(mark.evidence || ''));
    if (mark.awardedMarks > 0 && isExplicitNonAnswer(mark.answerText)) add('UNSUPPORTED_CREDIT', 'Positive marks proposed for an explicit non-answer. Check the source PDF and criteria.');
    if (unsupportedWorkingClaim(mark.answerText, [mark.feedback, mark.evidence].join(' '))) add('UNSUPPORTED_WORKING', 'The feedback appears to credit working or method not visible in the extracted answer. Verify the original PDF.');
    if (!mark.evidence.trim()) add('MISSING_EVIDENCE', 'No supporting evidence recorded.');
    if (!mark.feedback.trim()) add('MISSING_FEEDBACK', 'No marking feedback recorded.');
    if (question && !blank && mark.awardedMarks < question.maxMarks && !(mark.improvementGuidance || '').trim()) add('MISSING_GUIDANCE', 'Lost marks without specific improvement guidance.');
    // Restrict checks to short numeric equalities, avoiding symbolic and unit-bearing formulae.
    const aiText = [mark.feedback, mark.improvementGuidance || '', mark.evidence].join(' ');
    const equations = aiText.matchAll(/(^|[^\w.])(-?\d+(?:\s*[+*×÷/−-]\s*-?\d+){1,6})\s*=\s*(-?\d+(?:\.\d+)?)(?![\w.])/gm);
    for (const match of equations) {
      const actual = numericExpression(match[2]);
      const claimed = Number(match[3]);
      if (actual !== null && Math.abs(actual - claimed) > 1e-8) add('ARITHMETIC_CONFLICT', `AI text says ${match[2]} = ${match[3]}, but arithmetic gives ${actual}.`);
    }
  }
  // Alignment warnings attach only to the questions they name. Warnings that merely report a
  // blank / missing answer are not flags (blank answers score 0 and are shown as such).
  for (const warning of alignmentWarnings) {
    if (/\b(?:no (?:attributable )?(?:candidate )?answer|not answered|missing|blank|no answer identified|no candidate writing)\b/i.test(warning) &&
        !/\b(?:partial|incomplete|continu|unclear|uncertain|ambiguous)\b/i.test(warning)) continue;
    const mentioned = questions.filter(q => new RegExp(`(?:^|[^\\w(])${q.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w)])`, 'i').test(warning));
    if (mentioned.length) for (const q of mentioned) flags.push({ questionId: q.id, code: 'ALIGNMENT', detail: warning.slice(0, 300) });
    else flags.push({ questionId: '*', code: 'ALIGNMENT', detail: warning.slice(0, 300) });
  }
  return flags;
}
