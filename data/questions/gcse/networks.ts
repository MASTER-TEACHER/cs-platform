import type { GCSEPracticeQuestion } from "./types";

export const gcseNetworkQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-networks-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "LAN and WAN",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "compare",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Compare a LAN inside one school with a WAN connecting schools in different cities.",
    "markPoints": [
      "LAN covers limited local area",
      "WAN covers large geographical area",
      "LAN often managed by one organisation",
      "WAN connects LANs/uses external communications infrastructure"
    ],
    "modelAnswer": "A LAN covers a limited area such as one school and can be managed by that organisation. A WAN spans a larger geographical area and connects networks using communications infrastructure.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "lan",
      "wan"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Network hardware",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State the purpose of a switch, router, wireless access point and network interface controller.",
    "markPoints": [
      "Switch connects devices on LAN/forwards frames",
      "Router forwards between networks",
      "WAP provides wireless access to network",
      "NIC allows device to connect to network"
    ],
    "modelAnswer": "A switch connects devices on a LAN, a router connects networks, a wireless access point provides Wi-Fi access, and a NIC provides a device's network interface.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "switch",
      "router",
      "wap",
      "nic"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Star topology",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain two advantages and one disadvantage of a star topology for a school computer room.",
    "markPoints": [
      "Each device has separate link",
      "Single cable/device failure normally affects only that device",
      "Easy to add/manage devices",
      "Central switch is dependency",
      "Switch failure can disrupt whole network"
    ],
    "modelAnswer": "Each computer has its own link to a central switch, so a single cable failure normally affects only one computer and devices are easy to add. However, failure of the central switch can disrupt the whole network.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "star",
      "topology"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Client-server",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare client-server and peer-to-peer networking for storing school files.",
    "markPoints": [
      "Client-server centralises resources/accounts",
      "Central backup/security easier",
      "Requires server/admin/cost",
      "Peer-to-peer has no dedicated central server",
      "Peer-to-peer simpler/cheaper for small setup",
      "Justified school choice"
    ],
    "modelAnswer": "Client-server provides central accounts, permissions and backup but needs server resources and administration. Peer-to-peer can be simpler and cheaper for a very small network. For important school files, central management normally makes client-server more suitable.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "client-server",
      "peer-to-peer"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Peer-to-peer",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A four-computer home network shares files directly between computers without a dedicated server. Explain why this is peer-to-peer and give one limitation.",
    "markPoints": [
      "Devices share directly",
      "No dedicated central server",
      "Peers can provide/consume resources",
      "Limitation such as decentralised backup/security/availability"
    ],
    "modelAnswer": "It is peer-to-peer because the computers share resources directly rather than through a dedicated server. A limitation is that files may become unavailable when the computer hosting them is turned off.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "peer-to-peer"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Protocols",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State the purpose of HTTP/HTTPS, FTP, SMTP and IMAP.",
    "markPoints": [
      "HTTP/HTTPS transfers web content",
      "FTP transfers files",
      "SMTP sends email",
      "IMAP retrieves/manages email on server"
    ],
    "modelAnswer": "HTTP/HTTPS is used for web communication, FTP for file transfer, SMTP for sending email and IMAP for accessing/managing email stored on a server.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "protocol",
      "http",
      "smtp",
      "imap"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Protocols",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why network protocols are necessary when devices communicate.",
    "markPoints": [
      "Agreed rules",
      "Define format/meaning/timing or handling",
      "Both ends interpret communication consistently",
      "Enables interoperable communication"
    ],
    "modelAnswer": "Protocols provide agreed rules for how data is formatted, transmitted and interpreted. Devices following the same rules can communicate reliably even when made by different manufacturers.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "protocol",
      "communication"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "TCP/IP",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how TCP and IP contribute to sending data across the internet.",
    "markPoints": [
      "IP provides addressing/routing",
      "Packets directed between networks",
      "TCP manages reliable delivery",
      "Sequence/reassembly/error/retransmission concepts",
      "Roles are complementary"
    ],
    "modelAnswer": "IP provides addressing and routing so packets can travel toward the destination. TCP manages reliable transport, including sequencing and retransmission when necessary, so received data can be reassembled correctly.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "tcp",
      "ip",
      "packet"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "DNS",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "A user enters a domain name into a browser. Explain the role of DNS.",
    "markPoints": [
      "Domain name is human-readable",
      "DNS resolves/looks up name",
      "Returns corresponding IP address",
      "IP used to contact correct server"
    ],
    "modelAnswer": "DNS resolves the domain name to the server's IP address. The browser can then use that IP address to communicate with the correct server.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "dns",
      "ip"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Cloud computing",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A school is considering cloud storage instead of keeping all files only on local servers. Evaluate the change.",
    "markPoints": [
      "Access from multiple locations/devices",
      "Provider can offer scalable storage/backup",
      "Depends on internet/service availability",
      "Privacy/security/provider considerations",
      "Ongoing cost/control consideration",
      "Balanced conclusion"
    ],
    "modelAnswer": "Cloud storage can improve remote access and scalability and may simplify backup, but the school becomes dependent on connectivity and the provider. Security, privacy, cost and service availability must be considered before deciding.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cloud",
      "storage"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Network hardware",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A school LAN has several classroom switches and one connection to the internet. Explain why both switches and a router are needed.",
    "markPoints": [
      "Switch connects local devices",
      "Switch forwards within LAN",
      "Router connects different networks",
      "Router sends traffic toward internet/other networks",
      "Correct distinction"
    ],
    "modelAnswer": "Switches connect and forward traffic between devices on the local network. The router is needed to forward traffic between the school LAN and other networks such as the internet.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "switch",
      "router"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Star topology",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare star topology with a topology in which devices share one main communication cable. Recommend one for a new school lab.",
    "markPoints": [
      "Star uses individual links to central device",
      "Individual link failure isolated",
      "Central device can fail",
      "Shared cable can create common-medium dependency/collisions depending technology",
      "Star easier to manage/expand",
      "Justified recommendation"
    ],
    "modelAnswer": "A star gives each workstation a separate connection to a central switch, making faults easier to isolate and expansion straightforward. It depends on the switch, but for a modern school lab the manageability and fault isolation make star the stronger choice.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "star",
      "topology"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Client-server",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A school grows from 15 to 900 devices. Explain why moving from peer-to-peer sharing to client-server services may improve management.",
    "markPoints": [
      "Central user accounts",
      "Central permissions/security policies",
      "Central backup/resources",
      "Scales management better",
      "Server/admin cost/complexity",
      "Justified link to 900 devices"
    ],
    "modelAnswer": "With 900 devices, central accounts, permissions, storage and backup are much easier to manage consistently through client-server services. The school must pay for and administer servers/services, but the management benefits become much more important at this scale.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "client-server",
      "scalability"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Peer-to-peer",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Evaluate peer-to-peer networking for a temporary team of six laptops sharing non-sensitive files at an event.",
    "markPoints": [
      "No dedicated server required",
      "Low setup/cost",
      "Direct sharing can be convenient",
      "Availability depends on peers",
      "Backup/security less centralised",
      "Reasoned conclusion for temporary small team"
    ],
    "modelAnswer": "For six temporary laptops, peer-to-peer may be adequate because it is simple and needs no dedicated server. Its decentralised backup, security and availability are weaknesses, but these may be acceptable for non-sensitive temporary sharing.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "peer-to-peer"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Protocols",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A student sends an email with an attachment and later reads it on another device. Name appropriate protocols involved and explain their roles.",
    "markPoints": [
      "SMTP for sending",
      "IMAP for accessing/synchronising received mail",
      "Attachment travels as part of email service/data",
      "Protocols define communication rules",
      "Roles correctly distinguished"
    ],
    "modelAnswer": "SMTP is used to send the email to mail servers. IMAP can then allow the recipient to access and synchronise the stored message from another device.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "smtp",
      "imap",
      "email"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "TCP/IP",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A large file is split into packets before travelling across the internet. Explain why packets may take different routes and how the destination can still reconstruct the data.",
    "markPoints": [
      "IP routes packets independently/across networks",
      "Routes can vary with network conditions",
      "Packets carry addressing/control information",
      "TCP sequence information/order handling",
      "Missing data can be detected/retransmitted where TCP used",
      "Data reassembled at destination"
    ],
    "modelAnswer": "IP allows packets to be routed across available networks, so different packets can take different paths. TCP provides sequencing and reliability mechanisms so the receiving system can reorder data and recover missing segments before reconstructing the file.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "packet",
      "tcp",
      "ip"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "DNS",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A website can be reached by its IP address but not by its domain name. Explain why DNS is a likely area to investigate.",
    "markPoints": [
      "Server/network may be reachable via IP",
      "Failure occurs at name-to-address step",
      "DNS performs resolution",
      "Incorrect/missing DNS record or resolver problem plausible",
      "Reasoned diagnosis"
    ],
    "modelAnswer": "Because the server responds when its IP address is used, basic connectivity may be working. The failure appears when translating the domain name to an IP address, which is DNS's role, so DNS configuration or resolution should be checked.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "dns",
      "troubleshooting"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Cloud computing",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare storing files locally on one school computer with storing them in a cloud service.",
    "markPoints": [
      "Local storage can work without internet",
      "Local data tied to device unless shared/backed up",
      "Cloud supports remote/multi-device access",
      "Cloud depends on network/provider",
      "Security/cost/control factor"
    ],
    "modelAnswer": "Local storage gives direct control and can work without internet access but is tied to the device unless separately shared and backed up. Cloud storage enables access from multiple locations but depends on connectivity and the provider.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cloud",
      "local"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "LAN and WAN",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A company has offices in London and Manchester, each with its own local network. Identify the LANs and explain what makes the connection between offices a WAN.",
    "markPoints": [
      "Each office network is a LAN",
      "LAN limited to local site",
      "Inter-city connection spans large geographical area",
      "WAN connects the site LANs"
    ],
    "modelAnswer": "Each office has its own LAN. The link connecting the two cities forms part of a WAN because it spans a large geographical distance and connects the separate LANs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "lan",
      "wan"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Network hardware",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain how a NIC, switch and router are involved when a classroom PC accesses a website on the internet.",
    "markPoints": [
      "NIC provides PC network interface",
      "Frame/data reaches switch",
      "Switch forwards local traffic toward router",
      "Router connects LAN to external network",
      "Router forwards based on network addressing/routes",
      "Coherent end-to-end explanation"
    ],
    "modelAnswer": "The PC uses its NIC to send network data. The switch forwards the local traffic toward the router. The router then forwards packets from the school LAN toward external networks and ultimately the website's network.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "nic",
      "switch",
      "router"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-021",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Protocols",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare HTTP and HTTPS when a student signs in to a web service.",
    "markPoints": [
      "Both support web communication",
      "HTTPS uses encryption via TLS",
      "Protects credentials/data in transit",
      "Helps authenticate server via certificates",
      "HTTP lacks this transport protection",
      "HTTPS justified for login"
    ],
    "modelAnswer": "Both are used for web communication, but HTTPS adds TLS encryption and server authentication mechanisms. This helps protect login credentials from being read or altered in transit, so HTTPS is appropriate for sign-in.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "http",
      "https",
      "tls"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-022",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Network performance",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two factors that can affect network performance when a class of students streams video simultaneously.",
    "markPoints": [
      "Available bandwidth",
      "Number of users/traffic load",
      "Wireless interference/signal strength or hardware",
      "Developed link to throughput/delay"
    ],
    "modelAnswer": "Limited bandwidth shared among many simultaneous streams can reduce throughput per user. On Wi-Fi, interference or weak signal can also cause lower data rates and retransmissions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bandwidth",
      "performance"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-023",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Network performance",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "A 120 MB file is transferred at an effective rate of 10 MB/s. Calculate the ideal transfer time and state one reason a real transfer may take longer.",
    "markPoints": [
      "120÷10",
      "12 seconds",
      "Valid reason such as protocol overhead/congestion/retransmission",
      "Explains reason reduces effective throughput"
    ],
    "modelAnswer": "The ideal time is 12 seconds. A real transfer can take longer because of protocol overhead, congestion, interference or retransmissions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "transfer",
      "bandwidth"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-024",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Networks",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A school is redesigning its network for 1,200 users. Evaluate the importance of topology, network hardware, protocols and security when planning the network.",
    "markPoints": [
      "Suitable managed topology such as switched star",
      "Switch/router capacity and reliability",
      "Standard protocols/interoperability",
      "Secure protocols/access controls",
      "Scalability/performance consideration",
      "Failure/availability consideration",
      "Balanced design conclusion"
    ],
    "modelAnswer": "A switched star design can make devices manageable and faults easier to isolate, but central hardware must have sufficient capacity and resilience. Routers and switches need to support the expected traffic, standard protocols ensure interoperability, and secure communication/access controls protect users and data. The final design should balance performance, resilience, security and cost.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "network",
      "design",
      "security"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  },
  {
    "id": "gcse-networks-025",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "networks",
    "topicTitle": "Networks",
    "subtopic": "Cloud computing",
    "specificationReferences": [
      "AQA 3.5 Computer networks",
      "OCR J277 1.3 Computer networks, connections and protocols",
      "Pearson GCSE Computer Science - Networks"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A cloud-based learning platform becomes unavailable because the school's internet connection fails. Explain what this demonstrates about cloud computing and suggest two mitigations.",
    "markPoints": [
      "Cloud service depends on connectivity",
      "Remote resources cannot be reached during outage",
      "Local/offline copies or offline-capable apps",
      "Redundant/backup internet connection",
      "Other valid resilience measure",
      "Links mitigations to availability"
    ],
    "modelAnswer": "The outage shows that access to remote cloud resources depends on network connectivity. The school could maintain offline copies or offline-capable resources and provide a backup internet connection to improve resilience.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cloud",
      "availability",
      "resilience"
    ],
    "curriculumAreaIds": [
      "networks"
    ]
  }
];
