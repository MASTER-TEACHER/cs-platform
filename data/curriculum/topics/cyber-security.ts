import type { Topic } from "@/types/curriculum";

export const cyberSecurityTopic: Topic = {
  id: "cyber-security",
  title: "Cyber Security",
  description:
    "Understand cyber threats, vulnerabilities, social engineering, malware, authentication, encryption and defensive measures.",
  difficulty: "⭐⭐☆",
  estimatedTime: "120 mins",
  simulator: "cybersecurity",
  status: "published",
  unit: "Cyber Security",
  specificationReferences: ["AQA 3.6.3"],
  lessons: [
    {
      id: "threats-vulnerabilities",
      title: "Threats and Vulnerabilities",
      description:
        "Distinguish between threats, vulnerabilities, attacks and risks.",
      estimatedTime: "16 mins",
      xpReward: 75,
      objectives: [
        "Define a cyber threat.",
        "Define a vulnerability.",
        "Explain how attackers exploit weaknesses.",
      ],
      explanation:
        "A threat is something that could cause harm to a computer system or data. A vulnerability is a weakness that could be exploited. Risk depends on both the likelihood of a threat and the possible impact.",
      workedExample:
        "An unpatched web server contains a vulnerability. An attacker may exploit it to gain unauthorised access.",
      practiceQuestions: [
        {
          question: "What is a vulnerability?",
          answer: "A weakness that can be exploited",
          acceptedAnswers: ["A weakness in a system", "A security weakness"],
        },
        {
          question: "What is a cyber threat?",
          answer:
            "Something that could cause harm to a computer system or data",
          acceptedAnswers: [
            "A possible cause of damage",
            "A potential attack or danger",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Why should software be patched?",
          answer: "To fix known vulnerabilities",
          acceptedAnswers: [
            "To remove security weaknesses",
            "To reduce exploitation risk",
          ],
        },
      ],
      examQuestion: {
        question:
          "Explain the difference between a threat and a vulnerability.",
        marks: 4,
        answer:
          "A threat is something that could cause harm, such as an attacker or malware. A vulnerability is a weakness in the system that the threat could exploit.",
        markScheme: [
          "A threat is a potential source of harm.",
          "Provides a valid threat example.",
          "A vulnerability is a weakness.",
          "A threat can exploit a vulnerability.",
        ],
        guidance: ["Credit clear distinctions and valid examples."],
      },
      reflectionPrompt:
        "Explain how reducing vulnerabilities changes overall security risk.",
    },
    {
      id: "malware-attacks",
      title: "Malware and Network Attacks",
      description:
        "Explore viruses, worms, trojans, ransomware, brute force and denial-of-service attacks.",
      estimatedTime: "22 mins",
      xpReward: 95,
      objectives: [
        "Describe common malware types.",
        "Explain brute-force and denial-of-service attacks.",
        "Recommend suitable defensive measures.",
      ],
      explanation:
        "Malware includes viruses, worms, trojans, spyware and ransomware. A brute-force attack repeatedly guesses credentials. A denial-of-service attack overwhelms a service with traffic or requests.",
      workedExample:
        "Ransomware encrypts files and demands payment. Offline backups allow an organisation to restore data.",
      practiceQuestions: [
        {
          question: "Which malware encrypts files and demands payment?",
          answer: "Ransomware",
        },
        {
          question: "What does a brute-force attack attempt to do?",
          answer: "Guess a password or key by trying many possibilities",
          acceptedAnswers: [
            "Repeatedly guess login credentials",
            "Try many password combinations",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "What is the main purpose of a denial-of-service attack?",
          answer: "To make a service unavailable",
          acceptedAnswers: [
            "To overwhelm a service",
            "To block legitimate users",
          ],
        },
      ],
      examQuestion: {
        question:
          "Explain two ways an organisation can reduce the impact of ransomware.",
        marks: 4,
        answer:
          "The organisation can maintain tested offline backups so encrypted files can be restored. It can also use updates, antivirus software and staff training to reduce infection risk.",
        markScheme: [
          "Identifies a valid protection.",
          "Explains how the first protection reduces impact.",
          "Identifies a second valid protection.",
          "Explains how the second protection reduces impact.",
        ],
        guidance: [
          "Valid protections include backups, patching, antivirus, filtering and training.",
        ],
      },
      reflectionPrompt:
        "Explain why a backup connected permanently to an infected network may also be damaged.",
    },
    {
      id: "social-engineering",
      title: "Social Engineering",
      description:
        "Understand phishing, impersonation, baiting and human manipulation.",
      estimatedTime: "18 mins",
      xpReward: 85,
      objectives: [
        "Define social engineering.",
        "Recognise phishing and impersonation attempts.",
        "Explain how training and procedures reduce risk.",
      ],
      explanation:
        "Social engineering manipulates people into revealing information or performing unsafe actions. Phishing messages may imitate trusted organisations and pressure users to click links or provide credentials.",
      workedExample:
        "An attacker sends an urgent message pretending to be a headteacher and directs staff to a fake login page.",
      practiceQuestions: [
        {
          question: "What is social engineering?",
          answer:
            "Manipulating people into revealing information or performing unsafe actions",
          acceptedAnswers: [
            "Tricking users",
            "Using human behaviour to bypass security",
          ],
        },
        {
          question: "Give one warning sign of a phishing email.",
          answer: "An urgent request to click a suspicious link",
          acceptedAnswers: [
            "Unexpected attachment",
            "Spelling errors",
            "Mismatched sender address",
            "Request for passwords",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Why verify a sensitive request using another communication channel?",
          answer: "To confirm the sender is genuine",
          acceptedAnswers: ["To verify identity independently"],
        },
      ],
      examQuestion: {
        question: "Explain how staff training can reduce phishing risk.",
        marks: 4,
        answer:
          "Training helps staff recognise suspicious messages, verify requests, avoid unsafe links and report incidents quickly.",
        markScheme: [
          "Recognise suspicious messages.",
          "Verify requests or sender identity.",
          "Avoid unsafe links or attachments.",
          "Report incidents or reduce data disclosure.",
        ],
        guidance: ["Credit developed preventive actions."],
      },
      reflectionPrompt:
        "Write a checklist to follow before clicking a link in an unexpected email.",
    },
    {
      id: "authentication-passwords",
      title: "Authentication and Password Security",
      description:
        "Learn about strong passwords, multi-factor authentication, biometrics and access control.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "password-security",
      objectives: [
        "Explain authentication.",
        "Describe password security measures.",
        "Explain multi-factor authentication.",
      ],
      explanation:
        "Authentication checks that a user is who they claim to be. Strong unique passwords, account lockout, hashing and multi-factor authentication reduce unauthorised access.",
      workedExample:
        "A bank login may require a password and a one-time code sent to a registered device.",
      practiceQuestions: [
        {
          question: "What is authentication?",
          answer: "Checking that a user is who they claim to be",
          acceptedAnswers: ["Verifying a user's identity"],
        },
        {
          question: "Why should passwords be unique across accounts?",
          answer: "A breached password cannot then be reused on other accounts",
          acceptedAnswers: ["To prevent credential stuffing"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Give one ownership-based authentication factor.",
          answer: "A phone",
          acceptedAnswers: [
            "Security token",
            "Smart card",
            "One-time code device",
          ],
        },
      ],
      examQuestion: {
        question:
          "Explain why multi-factor authentication is more secure than only a password.",
        marks: 4,
        answer:
          "It requires evidence from more than one factor type. If an attacker steals the password, they still need the second factor.",
        markScheme: [
          "Uses more than one factor.",
          "Factors come from different categories.",
          "A stolen password alone is insufficient.",
          "Reduces unauthorised access.",
        ],
        guidance: ["Credit valid factor examples."],
      },
      reflectionPrompt:
        "Explain why a long unique passphrase can be stronger than a short complex-looking password.",
    },
    {
      id: "encryption",
      title: "Encryption",
      description:
        "Understand plaintext, ciphertext, keys and simple encryption methods.",
      estimatedTime: "22 mins",
      xpReward: 100,
      simulator: "caesar-cipher",
      objectives: [
        "Define encryption.",
        "Distinguish plaintext and ciphertext.",
        "Explain the role of keys.",
      ],
      explanation:
        "Encryption transforms plaintext into ciphertext using an algorithm and key. The correct key is required to decrypt the data.",
      workedExample:
        "A Caesar cipher shifts each letter by a fixed amount. It demonstrates keys and ciphertext but is not secure enough for modern systems.",
      practiceQuestions: [
        {
          question: "What is plaintext?",
          answer: "The original readable data",
          acceptedAnswers: ["Unencrypted data"],
        },
        {
          question: "What is ciphertext?",
          answer: "Encrypted unreadable data",
          acceptedAnswers: ["The result after encryption"],
        },
      ],
      checkpointQuestions: [
        {
          question: "What is required to decrypt encrypted data correctly?",
          answer: "The correct key",
          acceptedAnswers: ["A decryption key"],
        },
      ],
      examQuestion: {
        question: "Explain how encryption protects data sent across a network.",
        marks: 4,
        answer:
          "The sender transforms plaintext into ciphertext using an algorithm and key. Intercepted data should be unreadable without the correct key. The recipient decrypts it.",
        markScheme: [
          "Plaintext is transformed into ciphertext.",
          "An algorithm and key are used.",
          "Intercepted data is unreadable without the key.",
          "The recipient decrypts using the correct key.",
        ],
        guidance: ["Credit accurate equivalent terminology."],
      },
      reflectionPrompt:
        "Explain why encryption protects confidentiality but not availability.",
    },
    {
      id: "firewalls-penetration-testing",
      title: "Firewalls and Penetration Testing",
      description:
        "Explore traffic filtering, authorised security testing and monitoring.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "encryption",
      objectives: [
        "Explain how firewalls filter traffic.",
        "Define penetration testing.",
        "Distinguish authorised testing from attacks.",
      ],
      explanation:
        "A firewall monitors and filters traffic using rules. Penetration testing is authorised security testing that attempts to identify vulnerabilities before attackers exploit them.",
      workedExample:
        "A firewall may block inbound database connections while a tester checks whether another weakness still exposes the service.",
      practiceQuestions: [
        {
          question: "What is the purpose of a firewall?",
          answer: "To monitor and filter network traffic",
          acceptedAnswers: ["To allow or block traffic using rules"],
        },
        {
          question: "What makes penetration testing legitimate?",
          answer: "It is authorised",
          acceptedAnswers: ["Permission has been given"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Give one property a firewall rule could inspect.",
          answer: "Port number",
          acceptedAnswers: [
            "IP address",
            "Protocol",
            "Source address",
            "Destination address",
          ],
        },
      ],
      examQuestion: {
        question:
          "Explain how firewalls and penetration testing improve security.",
        marks: 6,
        answer:
          "A firewall filters traffic using rules and blocks suspicious connections. Penetration testing is authorised testing that finds vulnerabilities so they can be fixed before exploitation.",
        markScheme: [
          "Firewall monitors or filters traffic.",
          "Firewall applies rules.",
          "Firewall blocks suspicious connections.",
          "Penetration testing is authorised.",
          "Testing identifies vulnerabilities.",
          "Weaknesses can be fixed before exploitation.",
        ],
        guidance: ["Credit developed links to reduced risk."],
      },
      reflectionPrompt:
        "Explain why passing a penetration test once does not guarantee permanent security.",
    },
    {
      id: "sql-injection-backups",
      title: "SQL Injection, Backups and Security Policies",
      description:
        "Understand unsafe input, secure coding, recovery and organisational controls.",
      estimatedTime: "22 mins",
      xpReward: 105,
      simulator: "sql-injection",
      objectives: [
        "Describe SQL injection.",
        "Explain parameterised queries.",
        "Explain backup and policy controls.",
      ],
      explanation:
        "SQL injection occurs when untrusted input is treated as part of a database command. Parameterised queries keep user data separate from SQL instructions. Backups support recovery and policies define expected behaviour.",
      workedExample:
        "A login form that directly joins input into SQL may allow malicious input to change the query. A parameterised query treats input only as data.",
      practiceQuestions: [
        {
          question: "What causes SQL injection?",
          answer: "Untrusted input is interpreted as part of an SQL command",
          acceptedAnswers: ["User input is inserted directly into a query"],
        },
        {
          question:
            "Which technique keeps user input separate from SQL instructions?",
          answer: "Parameterised queries",
          acceptedAnswers: ["Prepared statements", "Parameterized queries"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Why should backups be tested?",
          answer: "To confirm data can actually be restored",
          acceptedAnswers: ["To verify recovery works"],
        },
      ],
      examQuestion: {
        question:
          "Explain how secure coding and backups reduce the impact of attacks.",
        marks: 6,
        answer:
          "Parameterised queries and validation reduce vulnerabilities such as SQL injection. Least privilege limits damage. Regular tested backups allow recovery after corruption, deletion or ransomware.",
        markScheme: [
          "Identifies parameterised queries or validation.",
          "Explains how secure coding prevents unsafe input execution.",
          "Identifies least privilege.",
          "Explains how restricted permissions reduce damage.",
          "Identifies regular tested backups.",
          "Explains how backups support recovery.",
        ],
        guidance: ["Credit other valid secure-development controls."],
      },
      reflectionPrompt:
        "Create a short policy covering passwords, updates, backups and incident reporting.",
    },
  ],
};
