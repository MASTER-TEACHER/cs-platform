/*
 * CS Master marking conventions library (Computer Science).
 *
 * Conventions that OCR examiners apply across years for each TYPE of
 * question, distilled (in our own words, no OCR text reproduced) from
 * J277/J276 and H446/H046 mark schemes and examiners' reports, 2018-2026.
 * `sources` records where each convention was seen, for teacher review.
 *
 * How it is used: for each question, rules whose `match` pattern fits the
 * approved criteria/guidance (and the exam's qualification) are sent to
 * the examiner and moderator as "markingConventions". The approved mark
 * scheme for the paper ALWAYS takes priority over a convention.
 *
 * Applies only to Computer Science exams. Turn off with MARKING_RULES=off.
 */

export type Level = "GCSE" | "A Level" | "both";

export type MarkingRule = {
  id: string;
  title: string;
  level: Level;
  /** Tested against the question's criteria + guidance (lower case). */
  match: RegExp;
  /** Optional extra condition, e.g. on the question's maximum mark. */
  when?: (q: { maxMarks: number }) => boolean;
  /** Higher = more specific; used to pick the most relevant rules. */
  priority: number;
  rule: string;
  sources: string[];
};

const EXPLAIN = /explain|describe|why|benefit|advantage|drawback|disadvantage|justif|reason|impact|suitab/;

export const MARKING_RULES: MarkingRule[] = [
  /* ---------------- General answer quality ---------------- */
  {
    id: "G1", title: "Unqualified one-word answers", level: "both", priority: 1, match: EXPLAIN,
    rule: "Bare evaluative words such as 'faster', 'cheaper', 'easier', 'better', 'more efficient', 'less space' or 'size' are not enough on their own: credit them only when the answer says what is faster/cheaper/smaller and why, or the scheme accepts the bare word. At A Level, points must be qualified.",
    sources: ["J277/01 2022 Q6(c)", "J277/01 2023 Q2(a)(iii)", "J277/01 2024 Q2(b)(i)", "J277/02 2025 Q7(a)", "H446/02 2024 Q7(b)(ii)", "H446/02 2023 Q4"],
  },
  {
    id: "G2", title: "Differences need both sides", level: "both", priority: 3, match: /differen|compar|contrast|distinguish/,
    rule: "When a difference or comparison is asked for, each mark needs both items contrasted on the same feature. One side alone (e.g. 'RAM is volatile') is not a difference unless the other side is clearly stated or the scheme allows it.",
    sources: ["J277/01 2022 Q7(a)(i)", "J277/01 2026 Q4", "H446/01 2025 Q2(a)", "H446/02 2025 Q6(a)", "H446/01 2026 Q8(a)", "H446/01 2022 Q5"],
  },
  {
    id: "G3", title: "Repeating the question", level: "both", priority: 1, match: EXPLAIN,
    rule: "Words or facts already given in the question or scenario earn nothing when repeated back (e.g. 'built into a larger device' for an embedded system, 'it compresses the file' for compression). The answer must add something.",
    sources: ["J277/01 2023 Q7", "J277/01 2023 Q3(c)", "J277/01 2026 Q2(b)", "H446/01 2022 Q5(b)(i)"],
  },
  {
    id: "G4", title: "Definition versus example", level: "both", priority: 2, match: /defin|what is meant|state what|describe what|by example|example/,
    rule: "If a definition or description is asked for, an example on its own is not a definition (credit 'by example' only where the scheme says so). If an example is asked for, a definition alone does not earn the example mark.",
    sources: ["J277/02 2025 Q2(a)", "J277/02 2025 Q5(a)(ii)", "J277/02 2024 Q1(d)(i)", "J277/01 2025 Q2(b)(i)"],
  },
  {
    id: "G5", title: "Point then expansion; applying to the scenario", level: "both", priority: 2, match: /…|\.\.\.|expan|applicat|context|scenario|justif|max \d+ if/,
    rule: "Where marks are a point followed by an expansion ('…'), an expansion scores only after a creditworthy point and must add something new. Where the question sets a scenario, generic answers are capped as the scheme states; reward answers that are applied to the scenario.",
    sources: ["J277/01 2024 Q2(b)(i)", "J277/01 Specimen Q9(a)", "J277/01 2023 Q7", "H446/02 2024 Q9(a)", "H446/01 2026 Q6(b)"],
  },
  {
    id: "G6", title: "Choice then justification", level: "both", priority: 3, match: /choice|choose|justif|recommend|which (type|method|storage|algorithm)|tick (one|the)/,
    rule: "Where a choice is followed by a justification: if the choice is wrong, do not credit the justification unless the scheme allows follow-through; if no choice is written, read the justification and credit it if the choice is clearly stated there. The justification must match the choice made.",
    sources: ["J277/01 2022 Q5(b)", "J277/01 2022 Q7(b)(ii)", "J277/01 2023 Q3(c)", "J277/01 2025 Q1(c)", "J277/02 2024 Q3(a)(ii)"],
  },
  {
    id: "G7", title: "Ticks, crosses and grids", level: "both", priority: 2, match: /tick|✓|box(es)?\b|true.{0,10}false|valid.{0,10}invalid/,
    rule: "Accept a cross or any other clear mark in place of a tick, as long as the intended choice is unambiguous. A row with more boxes marked than allowed scores 0 for that row.",
    sources: ["J277/01 2023 Q1(c)(d)", "J277/01 2025 Q4(e)", "H446/01 2025 Q1(c)(i)", "J277/02 2024 Q6(a)"],
  },
  {
    id: "G8", title: "Brand names", level: "both", priority: 2, match: /application|software|package|utility|device|program (to|for)|example of/,
    rule: "A brand or product name (e.g. a named word processor or phone) is not credited as the type of software/device; credit the generic type. If a brand is used, a valid example or description that follows may still be credited.",
    sources: ["J277/01 2022 Q7(a)(ii)", "H446/01 2022 Q2(a)", "H446/01 2023 Q1", "H446/01 2024 Q3"],
  },

  /* ---------------- Number systems and data ---------------- */
  {
    id: "N1", title: "Binary addition working", level: "both", priority: 9, match: /binary addition|add (the|these|two).{0,30}binary|carr(y|ies)/,
    rule: "Binary addition: one mark for the answer and working mark(s) for the carries. Carries may be written above, below or beside the digits, in any size or style, but must sit in the correct columns. Converting to denary and back is not valid working (the answer mark is still available); if both carries and a denary check are shown, award the carries. Do not withhold the working mark merely because handwritten carries are small or slightly offset when they are plausibly in the right columns: flag for the teacher instead.",
    sources: ["J277/01 2023 Q1(e)", "J277/01 2024 Q1(e)", "J277/01 2025 Q5(c)", "J277/01 2026 Q1(f)", "H446/01 2024 Q4(e)", "H446/01 2026 Q5(a)"],
  },
  {
    id: "N2", title: "Overflow", level: "both", priority: 6, match: /overflow/,
    rule: "Where an addition produces an extra (overflow) bit, accept the answer either with the overflow bit shown or with it clearly removed, as the scheme allows. Stating the word 'overflow' is only required if the question asks for it.",
    sources: ["H446/01 2025 Q5(b)", "H446/01 2022 Q4(d)"],
  },
  {
    id: "N3", title: "Binary subtraction / two's complement", level: "A Level", priority: 8, match: /subtract|two.?s complement|sign and magnitude|negative/,
    rule: "Binary subtraction and two's complement working must be in binary (borrowing, or making the second number negative and adding). Denary-only working earns no working marks. The answer must use the number of bits stated in the question.",
    sources: ["H446/01 2022 Q3(a)(iii)", "H446/01 2025 Q3(a)", "H446/01 2026 Q5(b)", "H446/01 2022 Q4(b)(iii)(iv)"],
  },
  {
    id: "N4", title: "Base conversions", level: "both", priority: 7, match: /convert|denary|hexadecimal|\bhex\b|8.?bit binary/,
    rule: "Conversions: the answer must have the number of bits/digits the question states (include leading zeros for 8-bit binary). Where marks are per digit or per nibble, mark from right to left and limit marks if extra leading digits are added. Working may use any valid method (place values, via binary). Do not give the answer mark by follow-through from wrong working unless the scheme says so.",
    sources: ["J277/02 Nov 2020 Q4(a)(b)", "J277/02 Nov 2021 Q5(a)(c)", "J277/01 2022 Q1(c)", "J277/01 2025 Q5(b)", "H446/01 2022 Q4(b)"],
  },
  {
    id: "N5", title: "Binary shifts", level: "both", priority: 7, match: /shift/,
    rule: "A shift description needs both the direction and the number of places. Effects: a left shift of n multiplies by 2^n; a right shift of n divides by 2^n and may lose precision (bits shifted out are lost).",
    sources: ["J277/01 2023 Q1(f)", "J277/01 Specimen Q5(c)", "J277/01 2022 Q1(f)"],
  },
  {
    id: "N6", title: "File size calculations", level: "both", priority: 8, match: /file size|calculat|show your working|bytes|kilobytes|megabytes|sample rate|bit depth|colour depth/,
    rule: "Calculations: award each working mark for any correct stage even if later stages or the answer are wrong. Accept division by 1000 or 1024. Ignore units written mid-working and crossed-out work, but credit correct working seen anywhere in the answer space; if the answer line is blank, use an answer clearly identified in the working. Accept any method (statements, grids, calculations).",
    sources: ["J277/01 2024 Q5(b)", "J277/01 2025 Q1(b)(ii)", "J277/01 2026 Q9(a)"],
  },
  {
    id: "N7", title: "Values from n bits", level: "both", priority: 6, match: /how many (unique|different)|unique values|number of (colours|values|characters)|bits (are )?(needed|required)/,
    rule: "n bits give 2^n different values: accept any expression that equals the right value (e.g. 2^4 for 16). Do not confuse the number of bits needed with the number of values (answering 256 when 8 bits is asked for is wrong).",
    sources: ["J277/01 2022 Q1(e)", "J277/01 2023 Q3(a)(iii)", "J277/01 2025 Q1(b)(iii)"],
  },
  {
    id: "N8", title: "Floating point", level: "A Level", priority: 8, match: /floating|mantissa|exponent|normalis/,
    rule: "Floating point: a correct answer with valid binary working earns full marks; any valid method is accepted (moving the binary point, or mantissa x 2^exponent). A normalised answer must use the bit lengths given; check the sign of mantissa and exponent.",
    sources: ["H446/01 2026 Q3(a)", "H446/01 2022 Q3(b)", "H446/01 2023 Q3(c)(d)", "H446/01 2024 Q4(d)"],
  },
  {
    id: "N9", title: "Character codes", level: "both", priority: 7, match: /ascii|unicode|character (code|set)/,
    rule: "Character codes: each character's code is a separate value, in order, with nothing extra; adding the codes together is wrong. Upper and lower case letters have different codes. A character set is all the characters a computer can use together with their binary codes; it is not 'how many characters can be stored'.",
    sources: ["J277/01 2025 Q6(a)", "J277/01 2026 Q3(a)(b)", "J277/01 2022 Q6(b)", "H446/01 2023 Q3(a)", "H446/01 2022 Q5(e)"],
  },
  {
    id: "M1", title: "Sound sampling", level: "both", priority: 6, match: /sound|sampl|audio|analogue/,
    rule: "Sound: the amplitude (height) of the wave is measured at regular intervals and stored in binary; 'frequency of the wave' is a misconception. Sample rate is how often it is measured (per second); bit depth is bits per sample. Higher values improve quality and increase file size. An expansion must say what the change means (e.g. sound measured less often), not just restate it.",
    sources: ["J277/01 2022 Q6(a)", "J277/01 2024 Q5(a)", "J277/01 2026 Q9(b)", "J277/01 Specimen Q4"],
  },
  {
    id: "M2", title: "Images and metadata", level: "both", priority: 6, match: /image|pixel|colour depth|metadata|resolution|bitmap/,
    rule: "Images: colour depth is bits per pixel (more colours), not resolution; resolution is the number of pixels. Metadata is data about the file (height, width, colour depth, date, geolocation, file type, author), not the image's contents or the colour of each pixel. 'Colour' or 'size' on its own is not enough; follow the scheme on whether height/width/resolution count.",
    sources: ["J277/01 2022 Q6(c)", "J277/01 2023 Q3(a)(b)", "J277/01 2026 Q6(a)"],
  },
  {
    id: "M3", title: "Compression", level: "both", priority: 6, match: /compress|lossy|lossless|run length/,
    rule: "Compression: the justification must say what happens to the data (lossy permanently removes data; lossless loses no data and the original can be restored). 'It compresses the file more' or 'it looks like the original' is not enough. If the type is not named, credit a justification that makes the type clear.",
    sources: ["J277/01 2023 Q3(c)", "J277/01 2026 Q6(b)", "H446/01 2022 Q2(c)"],
  },

  /* ---------------- Hardware and software ---------------- */
  {
    id: "H1", title: "CPU components and registers", level: "both", priority: 6, match: /register|program counter|\bpc\b|\bmar\b|\bmdr\b|control unit|\bcu\b|\balu\b|fetch|decode|execute/,
    rule: "CPU: the PC holds the address of the next instruction (it does not count programs); the MAR holds an address; the MDR holds the data/instruction fetched or to be stored; the CU decodes and coordinates by sending control signals ('sends signals' alone is not enough; the CU does not execute instructions). Accept CIR/IR. If the register named is wrong, do not credit its purpose.",
    sources: ["J277/01 2022 Q2", "J277/01 2024 Q6(b)", "J277/01 2025 Q6(b)", "H446/01 2022 Q1"],
  },
  {
    id: "H2", title: "CPU performance factors", level: "both", priority: 5, match: /performance|clock speed|cores|cache/,
    rule: "Performance factors must be named in full: 'clock speed', 'cache size', 'number of cores'. Single words such as 'clock', 'cache', 'speed' or 'cores' are not enough.",
    sources: ["J277/01 2024 Q6(c)", "J277/01 2026 Q4(a)"],
  },
  {
    id: "H3", title: "Memory and storage", level: "both", priority: 6, match: /\bram\b|\brom\b|secondary|storage|solid.?state|magnetic|optical|virtual memory/,
    rule: "Storage: secondary storage is for long-term/non-volatile storage, not 'for when RAM is full' or 'only for backup'. When a TYPE is asked (magnetic, optical, solid state), a device or brand alone is not enough, and vice versa. 'Portable' or 'no moving parts' alone are not enough; claims that SSDs last longer or are more reliable are not accepted unless the scheme allows.",
    sources: ["J277/01 2022 Q7", "J277/01 2023 Q5(a)", "J277/01 2024 Q5(b)", "J277/01 2025 Q1(c)", "J277/01 2026 Q5", "J276/01 Nov 2021 Q6(b)"],
  },
  {
    id: "H4", title: "Operating systems and utilities", level: "both", priority: 5, match: /operating system|utility|defrag|peripheral|device driver/,
    rule: "Utilities perform maintenance/housekeeping tasks; one example of a utility is not a purpose. OS functions must match exactly (e.g. installing a printer driver is peripheral management). 'Manage' must be extended with what is managed. Defragmentation moves parts of files together to reduce access time; it does not create more free space.",
    sources: ["J277/01 2024 Q3(a)", "J277/01 2025 Q2", "J277/01 2026 Q4(c)", "H446/01 2025 Q1(d)"],
  },
  {
    id: "H5", title: "Embedded systems", level: "both", priority: 5, match: /embedded/,
    rule: "Embedded systems: answers must relate to the device in the scenario; generic features of embedded systems are capped as the scheme states, and 'built into a larger device' repeats the question.",
    sources: ["J277/01 2023 Q7", "J277/01 2024 Q7", "H446/01 2024 Q2"],
  },

  /* ---------------- Networks and security ---------------- */
  {
    id: "NW1", title: "LAN and WAN", level: "both", priority: 5, match: /\blan\b|\bwan\b|local area|wide area/,
    rule: "LANs and WANs are distinguished by geographical area and whose infrastructure is used, not by the number of computers.",
    sources: ["J277/01 2025 Q4(a)", "J277/01 2026 Q2(a)", "J276/01 Nov 2021 Q7(a)"],
  },
  {
    id: "NW2", title: "Network performance and media", level: "both", priority: 5, match: /bandwidth|performance|wired|wireless|topolog|star|mesh|switch/,
    rule: "More devices do not reduce a network's bandwidth; they reduce each device's share. 'The network is slower', 'fast' or 'range' alone is not enough: say what is affected and why. A switch is not a server; a star network's single point of failure is the central switch; a mesh describes connections, not software.",
    sources: ["J277/01 2022 Q3(a)", "J277/01 2023 Q2(a)", "J277/01 2024 Q2(b)", "J277/01 2025 Q4(b)", "J277/01 2026 Q8"],
  },
  {
    id: "NW3", title: "IP and MAC addresses", level: "both", priority: 9, match: /ipv4|ipv6|ip address|mac address/,
    rule: "IPv4: four denary numbers 0-255 separated by full stops. IPv6: eight groups of hexadecimal separated by colons. MAC: hexadecimal pairs (12 hex digits). Judge the structure the student intended: a separator or digit that is unclear in the handwriting is not an error (flag it instead).",
    sources: ["J277/01 2024 Q2(a)(i)", "J277/01 2025 Q4(e)", "J277/01 2022 Q3(c)"],
  },
  {
    id: "NW4", title: "Protocols", level: "both", priority: 5, match: /protocol|http|ftp|smtp|imap|pop|tcp|layer/,
    rule: "A protocol must match the task and be paired with its use where asked; full names are accepted for acronyms. Where the scenario mentions encryption, HTTP is not accepted in place of HTTPS. A list of unrelated protocols earns nothing.",
    sources: ["J277/01 2023 Q2(a)(i)", "H446/01 2022 Q6(b)", "H446/01 2022 Q3"],
  },
  {
    id: "NW5", title: "Encryption and firewalls", level: "both", priority: 6, match: /encrypt|intercept|firewall|key/,
    rule: "Encryption does not stop data being intercepted: it makes intercepted data meaningless without the key, and the key must be used to decrypt. A firewall controls access to a network; it does not stop interception or remove viruses. 'Cannot be read/accessed' alone is not enough.",
    sources: ["J277/01 2022 Q3(e)", "J277/01 2023 Q4(a)", "J277/01 2026 Q2(b)", "H446/01 2026 Q6"],
  },
  {
    id: "S1", title: "Threats and prevention", level: "both", priority: 5, match: /threat|attack|malware|phishing|brute|social engineering|prevent|physical security/,
    rule: "A threat must be named for its description to score; the description and prevention must match that threat. Physical security means physical measures (locks, guards, keycards, CCTV); a computer password is not physical, but a door passcode is. A second method that repeats the first does not earn extra marks.",
    sources: ["J277/01 2022 Q5", "J277/01 2023 Q4(b)", "J277/01 Practice Q6(c)"],
  },
  {
    id: "S2", title: "Legislation", level: "both", priority: 5, match: /legislation|\bact\b|\blaw\b|legal/,
    rule: "Name the act; minor errors in the name and a missing 'Act' are acceptable, and the Data Protection Act and GDPR are interchangeable. The act must fit the scenario.",
    sources: ["J276/01 Nov 2021 Q8", "J277/01 2026 Q10", "J277/01 2025 Q4(f)", "H446/01 2026 Q2"],
  },

  /* ---------------- Extended response ---------------- */
  {
    id: "E1", title: "GCSE 8-mark extended response", level: "GCSE", priority: 10, match: /mark band|level|band|discuss|evaluat|recommend/,
    when: q => q.maxMarks === 8,
    rule: "8-mark levels question (bands 6-8, 3-5, 1-2, 0). Top band: accurate, detailed knowledge applied consistently to the scenario, weighing both sides and covering every element the question requires (and a justified recommendation if one is asked for), with clear structure. Bullet points or headings are acceptable; an essay is not required. A list of facts without application stays in the low or mid band. Indicative content is not exhaustive: credit other valid points, and never mark down for indicative points that are absent. Within a band, start at the middle mark and move up or down by how well the descriptors are met.",
    sources: ["J277/01 2022 Q4", "J277/01 2023 Q6", "J277/01 2024 Q4", "J277/01 2025 Q3", "J277/01 2026 Q8", "J277/01 Specimen Q11"],
  },
  {
    id: "E2", title: "A Level 9/12-mark extended response", level: "A Level", priority: 10, match: /mark band|level|band|discuss|evaluat|recommend|ao3/,
    when: q => q.maxMarks === 9 || q.maxMarks === 12,
    rule: "A Level levels question (12 marks: bands 9-12, 5-8, 1-4; 9 marks: 7-9, 4-6, 1-3). AO1 knowledge, AO2 application to the context, AO3 evaluation. The top band needs a balanced, applied discussion and a clear conclusion justified by the points made; either conclusion is acceptable if justified. Generic answers without the context cannot reach the top band. Indicative content is not a checklist: do not lower the band or mark because particular points (e.g. named Acts) are missing. Within a band, start at the middle mark; an answer with accurate, applied points covering AO1-AO3 and a conclusion sits at the middle or top of its band even if brief.",
    sources: ["H446/01 2023 Q7", "H446/01 2025 Q4", "H446/02 2025 Q2(a), Q4", "H446/01 2023 Q6(b)"],
  },

  /* ---------------- Algorithms and programming ---------------- */
  {
    id: "P1", title: "Code answers: language and minor syntax", level: "both", priority: 7, match: /algorithm|write (a|the) program|pseudocode|program code|reference language|high.level (programming )?language|\bcode\b/,
    rule: "Code may be in OCR Exam Reference Language, pseudocode or any high-level language unless the question requires a specific one (if it requires high-level code or a named language, flowcharts/English are not accepted). Minor syntax errors (missing quotes, = for ==, spaces in an identifier) are penalised once and then followed through. Ignore capitalisation unless exact output or names are required.",
    sources: ["J277/02 2023 Q9", "J277/02 2025 Q8(b)", "J277/02 Specimen Q8(b)", "H446/01 2024 Q5", "H446/02 2025 Q8(b)"],
  },
  {
    id: "P2", title: "Follow-through in algorithms", level: "both", priority: 7, match: /algorithm|program|write|complete the|bp\d|mp\d/,
    rule: "Mark each bullet point independently: a mistake in one part does not block later marks if the later code is logically built on it (follow-through). Ignore superfluous code that does not change the outcome and non-initialisation of counters unless the scheme requires it. Code that changes the outcome (overwriting a parameter, adding invalid values) loses only the affected marks.",
    sources: ["J277/02 2022 Q4(b)(ii)", "J277/02 2023 Q6", "J277/02 Nov 2020 Q6(a)", "J277/02 2025 Q6(c)", "H446/02 2025 Q3"],
  },
  {
    id: "P3", title: "Functions, procedures and parameters", level: "both", priority: 7, match: /function|return|parameter|procedure|subroutine|getter|method/,
    rule: "A function must return its result when asked (printing instead of returning loses that mark). Data should arrive via parameters, not be overwritten by input inside the subroutine. A call must use the existing subroutine and, for a function, store or use the returned value. A getter is a function that returns the attribute.",
    sources: ["J277/02 2023 Q6(c)", "J277/02 2024 Q7(a)", "J277/02 2022 Q5(c)", "H446/02 2024 Q9(b)", "H446/02 2025 Q8(b)"],
  },
  {
    id: "P4", title: "Conditions and boundaries", level: "both", priority: 8, match: /\bif\b|\bwhile\b|condition|selection|inclusive|>=|<=|!=/,
    rule: "Each side of AND/OR must be a complete comparison ('x >= 1 AND x <= 100', not 'x >= 1 AND <= 100'). Boundaries must match the question's inclusive/exclusive wording. In code, use >= and <= (not the symbols ≥ ≤ or =>). AND takes precedence over OR. A Boolean variable need not be compared with True.",
    sources: ["J277/02 2022 Q5(b)", "J277/02 2023 Q1(b)", "J277/02 2024 Q9(c)", "J277/02 2025 Q5(b)"],
  },
  {
    id: "P5", title: "Strings, casting and concatenation", level: "both", priority: 6, match: /concatenat|string|substring|casting|cast\b|join/,
    rule: "Concatenation may use +, &, . or a join/concat function or string interpolation; a comma alone is not concatenation when building a string. Joining a number to a string needs casting (or interpolation). Spacing in the result must be right when the question specifies it. Substring index conventions are accepted if applied consistently.",
    sources: ["J277/02 Nov 2021 Q4(c)", "J277/02 2022 Q6(b)", "J277/02 2024 Q7(d)", "H446/02 2025 Q7"],
  },
  {
    id: "P6", title: "SQL", level: "both", priority: 8, match: /\bsql\b|select|from tbl|where /,
    rule: "SQL: field and table names must be spelled exactly as given with no spaces; keywords can be any case; quotes around field/table names are allowed; string values need quotes; = or == is accepted for comparison. Fields are separated by commas, not AND. Wrong clause order or extra invalid code is capped as the scheme states (usually one mark below full).",
    sources: ["J277/02 2022 Q6(d)", "J277/02 2023 Q9(d)", "J277/02 2024 Q7(c)", "J277/02 2025 Q6(b)", "H446/01 2025 Q6(c)"],
  },
  {
    id: "P7", title: "Trace tables", level: "both", priority: 8, match: /trace/,
    rule: "Trace tables: record values when they change (repeating unchanged values is allowed). Errors in line numbers are penalised once, then followed through. Outputs must be actual values (not 'print(30)' or '3-1'). Ignore case and minor spelling. Extra incorrect output or changes are capped as the scheme states.",
    sources: ["J277/02 2023 Q6(d)", "J277/02 2022 Q1(d)", "J277/02 2025 Q4(a)", "J277/02 Nov 2021 Q2(d)"],
  },
  {
    id: "P8", title: "Test data", level: "both", priority: 7, match: /test data|normal|boundary|erroneous|invalid|extreme/,
    rule: "Test data must be actual values (e.g. 50), not descriptions ('a number between 40 and 180'). Normal, boundary and erroneous/invalid data must match the limits in the question; boundary data is at the limit; erroneous data can be out of range or the wrong type.",
    sources: ["J277/02 2024 Q7(a)(iv)", "J277/02 2023 Q9(c)(ii)", "H446/02 2024 Q5(c)"],
  },
  {
    id: "P9", title: "Validation and defensive design", level: "both", priority: 6, match: /validat|defensive|authenticat|sanitis|range check|length check|presence/,
    rule: "Validation: name the check and how it applies here; restating the name ('a range check checks the range') is not enough. Validation is not verification (entering data twice) and not authentication. Range values must be sensible for the scenario.",
    sources: ["J277/02 2022 Q5(b)", "J277/02 2024 Q7(e)", "J277/02 2025 Q5(b)"],
  },
  {
    id: "P10", title: "Errors and corrections", level: "both", priority: 6, match: /syntax error|logic error|error|correct(ion)? .{0,20}line/,
    rule: "A syntax error breaks the rules of the language so the program will not run/translate; a logic error runs but gives the wrong result. 'An error in the code' or 'it does not work' is not enough. A correction must match the line number given; if the line number is wrong, do not credit the correction.",
    sources: ["J277/02 Nov 2021 Q2(a)", "J277/02 2025 Q2(b)", "J277/02 2023 Q1"],
  },
  {
    id: "P11", title: "Maintainability", level: "both", priority: 5, match: /maintain|readab|comments|identifier|indent/,
    rule: "Maintainability: comments, meaningful identifiers, subroutines, indentation (only if not already present), whitespace. 'Makes it easier to understand' alone is not enough; an expansion must link to the method named.",
    sources: ["J277/02 2022 Q4(a)", "J277/02 2024 Q8(a)"],
  },
  {
    id: "P12", title: "Data types", level: "both", priority: 5, match: /data type|integer|boolean|\breal\b|float|string|char/,
    rule: "Data types: Integer, Real/Float, Boolean, Character, String, and equivalent language names (int, bool, float, double, varchar). Descriptions ('whole number', 'text') and values ('True/False') are not type names.",
    sources: ["J277/02 2022 Q5(a)(i)", "J277/02 2024 Q7(a)(ii)(iii)", "J277/02 2023 Q9(a)"],
  },
  {
    id: "P13", title: "IDE and translators", level: "both", priority: 5, match: /\bide\b|integrated development|debug|compiler|interpreter|translator|assembler/,
    rule: "IDE features need a description that adds more than the feature's name; for a debugging question only debugging features count. Translators: a compiler translates the whole program and produces an executable; an interpreter translates and runs line by line, stopping at an error; an assembler translates assembly. 'Faster' alone is not enough.",
    sources: ["J277/02 2025 Q5(a)(iii)", "J277/02 2024 Q2", "J277/02 2025 Q7", "H446/02 2025 Q6(a)", "H446/01 2024 Q4(a)"],
  },
  {
    id: "P14", title: "Flowcharts", level: "both", priority: 6, match: /flowchart|flow chart/,
    rule: "Flowcharts: parallelograms for input/output and diamonds for decisions; a wrong symbol is penalised once, then followed through. Decisions must lead to the correct outcomes. A flowchart that just repeats the question earns nothing.",
    sources: ["J277/02 Nov 2021 Q2(b)", "J277/02 2022 Q6(a)", "J277/02 Nov 2020 Q3(a)"],
  },
  {
    id: "P15", title: "Logic gates and truth tables", level: "both", priority: 8, match: /logic (gate|diagram|circuit)|truth table|\bgate\b|boolean (expression|algebra)|karnaugh|¬|∧|∨/,
    rule: "Logic diagrams: mark the gate shapes, not labels; NOT needs its circle, AND/OR have none; gates need the correct number of inputs. Equivalent circuits are accepted (GCSE: a correctly used 3-input AND). Extra gates or a not-fully-correct circuit are capped as the scheme states. Truth tables accept 1/0 or True/False with inputs in any order. In expressions brackets matter where they change meaning (NOT (A OR B) differs from NOT A OR B); accept symbol variants (¬ ∧ ∨, overbar, . and +).",
    sources: ["J277/02 2022 Q2(a)", "J277/02 2023 Q5(a)", "J277/02 2025 Q6(a)", "H446/01 2024 Q5(a)", "H446/01 2023 Q6(a)", "H446/01 Nov 2021 Q5(a)"],
  },
  {
    id: "P16", title: "Searching and sorting", level: "both", priority: 8, match: /binary search|linear search|bubble|merge sort|insertion sort|sort(ed|ing)? (the|this) (list|data|array)/,
    rule: "Searching/sorting: use the data in the question; generic steps lose the context marks. Binary search: pick the middle item, compare, discard the half that cannot contain it, repeat ('splits the list in half' alone is not enough). Linear search must check items in order. Merge sort merges already-ordered lists (appending then sorting is wrong). Bubble sort compares adjacent pairs and swaps when out of order, with each comparison/decision shown. Descending order when ascending was asked: penalise once or cap as the scheme states.",
    sources: ["J277/02 2022 Q3(a)(b)", "J277/02 2023 Q3(a)", "J277/02 2024 Q3(a)(b)", "J277/02 2025 Q3(c)", "H446/02 2025 Q1(b)", "H446/02 2022 Q3(c)"],
  },
  {
    id: "P17", title: "Abstraction and decomposition", level: "both", priority: 6, match: /abstraction|decomposition|computational thinking|thinking (ahead|logically|procedurally|concurrently)/,
    rule: "Abstraction examples must be specific to the scenario and say what is removed/ignored or focused on; a definition without a scenario example earns no example marks. Decomposition is breaking a problem into smaller sub-problems.",
    sources: ["J277/02 2025 Q5(a)", "H446/02 2023 Q2(a), Q9(a)", "H446/02 2024 Q8(b)"],
  },

  /* ---------------- A Level specific ---------------- */
  {
    id: "A1", title: "Stacks, queues, lists and trees", level: "A Level", priority: 7, match: /stack|queue|linked list|pointer|binary (search )?tree|node/,
    rule: "Data structures: stack LIFO, queue FIFO, compared fully. A pointer holds a location, not the value. Pop: check empty, take the value, then move the pointer, in a sequence that works. A queue is not implemented by shifting every item. A binary tree node has at most two children (not always two), with left/right placement unambiguous.",
    sources: ["H446/02 2025 Q6(a)", "H446/02 2024 Q4, Q5(a)", "H446/02 2025 Q3", "H446/02 2025 Q7(a)", "H446/02 2024 Q7(b)"],
  },
  {
    id: "A2", title: "Dijkstra and A*", level: "A Level", priority: 8, match: /dijkstra|a\*|a star|shortest path|heuristic/,
    rule: "Shortest path tables: marks for the final path, the final distance and each section of working; replaced distances must be shown as overwritten. A* stops when the goal node is reached (do not explore every route as in Dijkstra). Accept N/A, blank or similar for the start node's previous node; ignore extra crossed-out rows.",
    sources: ["H446/02 2023 Q1(b)", "H446/02 2024 Q3(a)", "H446/02 2025 Q5(b)"],
  },
  {
    id: "A3", title: "Big O", level: "A Level", priority: 7, match: /big o|o\(|complexity|time complexity|space complexity/,
    rule: "Big O answers need both the name of the complexity class and what it means (e.g. linear: time grows in direct proportion to n). Exponential is O(2^n), not n^2. Do not confuse best case with the complexity asked.",
    sources: ["H446/02 2024 Q6(d)", "H446/02 2023 Q1(c)"],
  },
  {
    id: "A4", title: "Object-oriented programming", level: "A Level", priority: 7, match: /class|object|attribute|constructor|inherit|encapsulat|instantiat|private|public/,
    rule: "OOP: attributes private and methods public as required; a constructor sets attributes from its parameters (Python 'self' as an extra first parameter is allowed). Encapsulation means attributes are accessed only via methods. Instantiation (creating objects) is not inheritance.",
    sources: ["H446/01 2022 Q2(d)", "H446/01 2024 Q9", "H446/02 2023 Q9", "H446/02 2024 Q9(c)", "H446/02 2022 Q8"],
  },
  {
    id: "A5", title: "Little Man Computer / assembly", level: "A Level", priority: 7, match: /\blmc\b|little man|assembly|mnemonic|\bdat\b|\blda\b|\bsta\b/,
    rule: "Assembly/LMC: every label used needs a matching DAT location (DATs at the end); labels keep the case given in the question; mnemonic case is ignored. Penalise the first error, then follow through.",
    sources: ["H446/01 2024 Q1(d)", "H446/01 2022 Q1(b)", "H446/01 2026 Q1(d)", "H446/01 2025 Q4"],
  },
  {
    id: "A6", title: "HTML, CSS and JavaScript", level: "A Level", priority: 6, match: /html|css|javascript|<\w+>/,
    rule: "Web code must be in the language asked (only JavaScript when JavaScript is required). Tag or syntax slips (wrong-way slash, missing semicolons) are penalised once, then followed through; equivalent colour values (#FFF and #FFFFFF) are accepted.",
    sources: ["H446/01 2024 Q5", "H446/01 2026 Q4(a)", "H446/01 2023 Q4"],
  },
  {
    id: "A7", title: "Relational databases", level: "A Level", priority: 6, match: /relationship|entity|foreign key|primary key|normalis|crow/,
    rule: "Entity relationships use the specification notation (crow's foot); extra relationships are capped as the scheme states. A database is not a table; keys must be used for their correct purpose. SQL table and field names must match the case and spelling given.",
    sources: ["H446/01 2025 Q8(b)", "H446/01 2026 Q3(b)", "H446/01 2024 Q7", "H446/01 2025 Q6(c)"],
  },
];

export type QualificationContext = { subject?: string | null; level?: string | null };

function levelOf(level?: string | null): "GCSE" | "A Level" | null {
  const value = (level ?? "").toLowerCase();
  if (/gcse/.test(value)) return "GCSE";
  if (/a.?level|\bas\b/.test(value)) return "A Level";
  return null;
}

export function rulesEnabled(context: QualificationContext): boolean {
  if (process.env.MARKING_RULES?.trim().toLowerCase() === "off") return false;
  return /computer science|computing/i.test(context.subject ?? "");
}

/** The most relevant conventions for one question (max 5, most specific first). */
export function rulesFor(
  question: { criteria: string; notes?: string; maxMarks: number },
  context: QualificationContext,
  limit = 5
): MarkingRule[] {
  if (!rulesEnabled(context)) return [];
  const level = levelOf(context.level);
  const text = `${question.criteria}\n${question.notes ?? ""}`.toLowerCase();

  return MARKING_RULES
    .filter(rule => rule.level === "both" || rule.level === level)
    .filter(rule => rule.match.test(text) && (!rule.when || rule.when(question)))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
