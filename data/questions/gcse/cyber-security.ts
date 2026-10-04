import type { GCSEPracticeQuestion } from "./types";

export const gcseCyberSecurityQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-cyber-security-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Malware",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State what malware is and name two types of malware.",
    "markPoints": [
      "Malicious software designed to harm, disrupt or gain unauthorised access",
      "Valid type such as virus/worm/trojan/ransomware/spyware",
      "Second valid type"
    ],
    "modelAnswer": "Malware is malicious software intended to damage, disrupt or gain unauthorised access. Examples include ransomware and spyware.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "malware"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Virus and worm",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 4,
    "question": "Compare a computer virus with a worm.",
    "markPoints": [
      "Virus attaches to/depends on host file or program",
      "Virus commonly spreads when infected host executes/is shared",
      "Worm is standalone malware",
      "Worm can self-replicate across networks"
    ],
    "modelAnswer": "A virus typically attaches to another file or program and spreads when that host is executed or shared. A worm is standalone malware that can self-replicate and spread across networks.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "virus",
      "worm"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Trojan",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A user downloads a 'free game' that secretly installs software giving an attacker remote access. Identify the attack and explain your choice.",
    "markPoints": [
      "Trojan identified",
      "Appears to be legitimate/desirable software",
      "Contains hidden malicious functionality",
      "User is deceived into installing it"
    ],
    "modelAnswer": "This is a Trojan because the download appears legitimate but contains hidden malicious functionality that the user installs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "trojan",
      "malware"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Ransomware",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how ransomware can affect an organisation.",
    "markPoints": [
      "Malware encrypts/locks data or systems",
      "Users lose access",
      "Attacker demands payment",
      "Can disrupt operations / cause data or financial loss"
    ],
    "modelAnswer": "Ransomware can encrypt files or lock systems so staff cannot use them. Attackers then demand payment, while the organisation may suffer downtime and data or financial loss.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "ransomware"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Phishing",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "An email claims to be from a bank and links to a fake sign-in page. Explain how the attack works and give one way a user could recognise it.",
    "markPoints": [
      "Phishing/social engineering",
      "Impersonates trusted organisation",
      "Fake page captures credentials",
      "User is persuaded rather than system technically broken",
      "Recognition such as checking domain/sender/hovered link/unexpected urgency"
    ],
    "modelAnswer": "The attacker impersonates the bank and directs the victim to a fake login page that captures credentials. A user could check the real domain rather than trusting the displayed link or urgent wording.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "phishing",
      "social engineering"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Social engineering",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain what is meant by social engineering in cyber security.",
    "markPoints": [
      "Manipulates/deceives people",
      "Aims to obtain information/access/action",
      "Exploits human behaviour rather than only technical vulnerability"
    ],
    "modelAnswer": "Social engineering manipulates people into revealing information or performing an action that helps an attacker, exploiting human behaviour rather than relying only on a technical flaw.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "social engineering"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Brute force",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how a brute-force password attack works and why a longer password can make it harder.",
    "markPoints": [
      "Repeatedly tries candidate passwords",
      "Systematically searches possibilities",
      "Longer password increases possible combinations",
      "More combinations generally require more attempts/time"
    ],
    "modelAnswer": "A brute-force attack repeatedly tries possible passwords. Increasing password length increases the number of possible combinations, making exhaustive guessing take longer.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "brute force",
      "password"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Denial of service",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how a denial-of-service attack affects a network service.",
    "markPoints": [
      "Floods/overwhelms service or resources",
      "Consumes bandwidth/processing/connections",
      "Legitimate requests cannot be served promptly",
      "Reduces availability"
    ],
    "modelAnswer": "A denial-of-service attack overwhelms a service with traffic or requests, consuming resources so legitimate users experience severe slowdown or cannot access the service.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "dos",
      "availability"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "SQL injection",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A website builds this query by joining user input directly into SQL: `SELECT * FROM users WHERE name = '` + input + `'`; Explain the vulnerability and two appropriate defences.",
    "markPoints": [
      "Untrusted input becomes part of SQL command",
      "Attacker can alter intended query",
      "May expose/change data or bypass checks",
      "Use parameterised/prepared queries",
      "Validate input as additional defence",
      "Least privilege/other valid defence"
    ],
    "modelAnswer": "The application treats user input as SQL syntax, so crafted input can change the query. Parameterised queries keep data separate from SQL instructions. Input validation and restricted database privileges provide additional protection.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql injection",
      "parameterised query"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Network interception",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 5,
    "question": "A user signs in to a service over an unencrypted public Wi-Fi connection. Explain the risk of interception and how encryption helps.",
    "markPoints": [
      "Traffic may be captured by attacker",
      "Sensitive data/credentials at risk",
      "Encryption makes captured content unreadable without key",
      "HTTPS/TLS valid example",
      "Does not claim encryption prevents all attacks"
    ],
    "modelAnswer": "An attacker able to capture unencrypted traffic may read sensitive data. HTTPS/TLS encrypts data in transit so captured traffic is not directly readable without the required cryptographic keys.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "interception",
      "encryption",
      "https"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Firewall",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how a firewall can protect a network.",
    "markPoints": [
      "Monitors/filters network traffic",
      "Applies configured rules",
      "Can block unauthorised/unwanted connections",
      "Allows permitted traffic"
    ],
    "modelAnswer": "A firewall examines network traffic and applies rules to allow permitted connections and block unwanted or unauthorised traffic.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "firewall"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Penetration testing",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the purpose of authorised penetration testing.",
    "markPoints": [
      "Authorised security testing",
      "Attempts to find/exploit vulnerabilities",
      "Finds weaknesses before malicious attackers",
      "Results used to improve security"
    ],
    "modelAnswer": "Penetration testing is authorised testing that attempts to identify and exploit vulnerabilities so they can be fixed before malicious attackers use them.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "penetration testing"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Authentication",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare password-only authentication with two-factor authentication.",
    "markPoints": [
      "Password is one factor",
      "2FA requires second independent factor",
      "Stolen password alone may be insufficient",
      "2FA can improve account security",
      "May add inconvenience/cost/dependency"
    ],
    "modelAnswer": "Password-only authentication relies on one secret. Two-factor authentication also requires another factor, such as an authenticator code, so a stolen password alone may not be enough to gain access.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "authentication",
      "2fa"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Passwords",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Give three features of a strong password policy.",
    "markPoints": [
      "Sufficient length",
      "Avoid common/reused passwords",
      "Use unique passwords / block compromised passwords / MFA; any valid third"
    ],
    "modelAnswer": "A policy can require sufficiently long passwords, prevent common or compromised passwords and encourage unique credentials rather than reuse.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "password"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Encryption",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the difference between plaintext and ciphertext and the purpose of an encryption key.",
    "markPoints": [
      "Plaintext is readable original data",
      "Ciphertext is encrypted form",
      "Key controls encryption/decryption operation",
      "Without appropriate key ciphertext should be impractical to interpret"
    ],
    "modelAnswer": "Plaintext is the readable original data. Encryption transforms it into ciphertext using a key; the appropriate key is needed to recover or interpret the protected information.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "encryption",
      "plaintext",
      "ciphertext"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Access control",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A school database contains student medical notes. Explain how access levels and least privilege can reduce risk.",
    "markPoints": [
      "Users receive only needed permissions",
      "Medical data restricted to authorised roles",
      "Reduces accidental access/change",
      "Limits damage if account compromised",
      "Permissions should be reviewed/managed"
    ],
    "modelAnswer": "Only staff whose role requires the medical notes should receive access. Least privilege limits each account to necessary permissions, reducing accidental disclosure and the damage possible if an account is compromised.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "access control",
      "least privilege"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Backups",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how a well-designed backup strategy can help an organisation recover from ransomware.",
    "markPoints": [
      "Separate backup copy exists",
      "Backups made regularly",
      "Offline/isolated/versioned copy resists encryption by attacker",
      "Restore known-good data",
      "Backups do not themselves prevent infection"
    ],
    "modelAnswer": "Regular backups, especially isolated or versioned copies, allow clean data to be restored after infected systems are contained. Backups support recovery but do not prevent the ransomware infection itself.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "backup",
      "ransomware"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Security updates",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why installing security updates promptly can reduce cyber-security risk.",
    "markPoints": [
      "Updates can patch known vulnerabilities",
      "Attackers may exploit unpatched flaws",
      "Prompt patching reduces exposure window"
    ],
    "modelAnswer": "Security updates often fix known vulnerabilities. Installing them promptly reduces the time in which attackers can exploit those known weaknesses.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "patch",
      "update"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Cyber security",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A school proposes using only antivirus software to protect its network. Evaluate this approach and recommend a more complete strategy.",
    "markPoints": [
      "Antivirus can detect/block some malware",
      "Cannot address all threats",
      "Firewall/network filtering",
      "Updates/patching",
      "Authentication/access control",
      "User education/backups or encryption",
      "Layered strategy conclusion"
    ],
    "modelAnswer": "Antivirus is useful against some malware but is not sufficient by itself. The school should combine it with patching, firewalls, strong authentication and least privilege, user education and tested backups. Layered controls reduce reliance on any single defence.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "security",
      "defence in depth"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  },
  {
    "id": "gcse-cyber-security-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "cyber-security",
    "topicTitle": "Cyber Security",
    "subtopic": "Incident response",
    "specificationReferences": [
      "AQA 3.6 Cyber security",
      "OCR J277 1.4 Network security",
      "Pearson GCSE Computer Science - Security"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A staff account is suspected of being compromised. Explain appropriate immediate actions and why simply changing the password may not be enough.",
    "markPoints": [
      "Disable/restrict compromised account/session",
      "Change/reset credentials",
      "Investigate logs/scope",
      "Check malware/other persistence",
      "Revoke tokens/active sessions or enable MFA",
      "Reasoned recovery/monitoring"
    ],
    "modelAnswer": "The account should be restricted, active sessions or tokens revoked and credentials reset. Logs should be checked to identify what the attacker accessed, and the device/account should be checked for malware or persistence. MFA and monitoring can strengthen recovery; changing only the password may leave active sessions or other compromise in place.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "incident response",
      "account"
    ],
    "curriculumAreaIds": [
      "cyber-security"
    ]
  }
];
