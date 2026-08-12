import type { Topic } from "@/types/curriculum";

export const networksTopic: Topic = {
  id: "networks",
  title: "Computer Networks",
  description:
    "Explore network types, hardware, topologies, protocols, addressing and internet services.",
  difficulty: "⭐⭐☆",
  estimatedTime: "110 mins",
  simulator: "network-builder",
  status: "published",
  unit: "Networks",
  specificationReferences: ["AQA 3.5.5"],

  lessons: [
    {
      id: "network-types",
      title: "LANs, WANs and Network Models",
      description:
        "Compare local and wide area networks, client-server and peer-to-peer models.",
      estimatedTime: "18 mins",
      xpReward: 80,
      objectives: [
        "Define LAN and WAN.",
        "Compare client-server and peer-to-peer networks.",
        "Select a suitable network model for a scenario.",
      ],
      explanation:
        "A LAN covers a small geographical area and is usually owned by one organisation. A WAN connects networks across larger geographical areas. Client-server networks use central servers to manage resources and security, while peer-to-peer networks allow devices to share directly.",
      workedExample:
        "A school network is usually a LAN using a client-server model so accounts, files and permissions can be managed centrally.",
      practiceQuestions: [
        {
          question: "What does LAN stand for?",
          answer: "Local area network",
        },
        {
          question: "What does WAN stand for?",
          answer: "Wide area network",
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Which network model normally provides central account management?",
          answer: "Client-server",
          acceptedAnswers: ["Client server"],
        },
      ],
      examQuestion: {
        question: "Compare client-server and peer-to-peer networks.",
        marks: 6,
        answer:
          "Client-server networks use central servers to manage users, files, security and backups. They are easier to control but cost more and depend on servers. Peer-to-peer networks have no dedicated central server, are cheaper and simpler for small groups, but are harder to manage and secure.",
        markScheme: [
          "Client-server uses a central server.",
          "Central management of users, files or security.",
          "Client-server may cost more or depend on the server.",
          "Peer-to-peer has no dedicated central server.",
          "Peers share resources directly.",
          "Peer-to-peer is harder to manage, secure or back up.",
        ],
        guidance: ["Credit clear comparative statements."],
      },
      reflectionPrompt:
        "Recommend a network model for a small home and a large school.",
    },

    {
      id: "network-hardware",
      title: "Network Hardware and Transmission",
      description:
        "Understand switches, routers, wireless access points, NICs and transmission media.",
      estimatedTime: "20 mins",
      xpReward: 90,
      simulator: "network-builder",
      objectives: [
        "Describe common network hardware.",
        "Compare wired and wireless connections.",
        "Explain how hardware connects devices and networks.",
      ],
      explanation:
        "A network interface controller connects a device to a network. A switch connects devices within a LAN and forwards frames to the correct port. A router connects different networks and forwards packets. A wireless access point allows wireless devices to join a network.",
      workedExample:
        "A laptop connects through Wi-Fi to an access point. A switch links wired classroom computers, while a router connects the school network to the internet.",
      practiceQuestions: [
        {
          question: "Which device connects different networks?",
          answer: "Router",
        },
        {
          question: "Which device connects devices within a wired LAN?",
          answer: "Switch",
        },
      ],
      checkpointQuestions: [
        {
          question: "What hardware allows a device to connect to a network?",
          answer: "Network interface controller",
          acceptedAnswers: ["NIC", "Network interface card"],
        },
      ],
      examQuestion: {
        question:
          "Explain the roles of a switch and a router in a school network.",
        marks: 4,
        answer:
          "A switch connects devices within the school LAN and forwards frames to the appropriate device. A router connects the LAN to other networks, such as the internet, and forwards packets between them.",
        markScheme: [
          "Switch connects devices within a LAN.",
          "Switch forwards frames to the correct port or device.",
          "Router connects different networks.",
          "Router forwards packets between networks.",
        ],
        guidance: ["Award marks for accurate distinct roles."],
      },
      reflectionPrompt:
        "Explain one advantage and one disadvantage of wireless networking.",
    },

    {
      id: "topologies",
      title: "Network Topologies",
      description: "Compare star, bus and mesh network arrangements.",
      estimatedTime: "18 mins",
      xpReward: 85,
      simulator: "network-topology",
      objectives: [
        "Describe star, bus and mesh topologies.",
        "Compare reliability, cost and performance.",
        "Choose a suitable topology for a scenario.",
      ],
      explanation:
        "In a star topology, devices connect to a central switch. In a bus topology, devices share one backbone cable. In a mesh topology, devices have multiple connections. Star networks are easy to manage but depend on the central device. Mesh networks can be reliable but require more connections.",
      workedExample:
        "A school classroom commonly uses a star topology because each device has a separate connection to a central switch.",
      practiceQuestions: [
        {
          question: "Which topology connects each device to a central switch?",
          answer: "Star",
          acceptedAnswers: ["Star topology"],
        },
        {
          question: "Which topology uses a shared backbone cable?",
          answer: "Bus",
          acceptedAnswers: ["Bus topology"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Which topology normally provides the most alternative routes?",
          answer: "Mesh",
          acceptedAnswers: ["Mesh topology"],
        },
      ],
      examQuestion: {
        question:
          "Explain one advantage and one disadvantage of a star topology.",
        marks: 4,
        answer:
          "A failed cable normally affects only one connected device, making faults easier to isolate. However, if the central switch fails, the connected devices may lose network access.",
        markScheme: [
          "Identifies a valid advantage.",
          "Develops the advantage.",
          "Identifies a valid disadvantage.",
          "Develops the disadvantage.",
        ],
        guidance: ["Credit valid references to performance, cabling or cost."],
      },
      reflectionPrompt:
        "Explain why a full mesh is uncommon for a large wired school network.",
    },

    {
      id: "protocols",
      title: "Network Protocols",
      description: "Learn why standard communication rules are needed.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "protocols",
      objectives: [
        "Define a network protocol.",
        "Describe common protocols.",
        "Match protocols to their purposes.",
      ],
      explanation:
        "A protocol is a set of rules for communication. TCP divides data into packets and supports reliable delivery. IP handles addressing and routing. HTTP and HTTPS transfer web content, with HTTPS adding encryption. FTP transfers files, while SMTP, IMAP and POP support email.",
      workedExample:
        "When a secure website is opened, HTTPS protects web communication while TCP/IP supports packet delivery and routing.",
      practiceQuestions: [
        {
          question: "Which protocol is used for secure web communication?",
          answer: "HTTPS",
        },
        {
          question: "Which protocol is commonly used to send email?",
          answer: "SMTP",
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Which protocol is responsible for addressing and routing packets?",
          answer: "IP",
          acceptedAnswers: ["Internet Protocol"],
        },
      ],
      examQuestion: {
        question:
          "Explain why protocols are required and describe the roles of TCP and IP.",
        marks: 5,
        answer:
          "Protocols provide agreed communication rules so different devices can exchange data. TCP divides data into packets, checks delivery and supports reassembly. IP provides addressing and routes packets between networks.",
        markScheme: [
          "Protocols are agreed communication rules.",
          "They allow different devices or systems to communicate.",
          "TCP divides data into packets.",
          "TCP supports reliable delivery or reassembly.",
          "IP provides addressing or routing.",
        ],
        guidance: ["Credit accurate equivalent descriptions."],
      },
      reflectionPrompt:
        "Explain why HTTPS is preferable to HTTP for online banking.",
    },

    {
      id: "addresses-dns",
      title: "IP, MAC and DNS",
      description:
        "Understand network addresses and how domain names are resolved.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "dns",
      objectives: [
        "Describe IP and MAC addresses.",
        "Explain the purpose of DNS.",
        "Follow the process of resolving a domain name.",
      ],
      explanation:
        "An IP address identifies a device or network interface for communication across networks and may change. A MAC address identifies a network interface at the hardware level and is normally fixed by the manufacturer. DNS translates human-readable domain names into IP addresses.",
      workedExample:
        "When a user enters example.com, a DNS server returns the corresponding IP address so the browser can contact the web server.",
      practiceQuestions: [
        {
          question: "Which service translates domain names into IP addresses?",
          answer: "DNS",
          acceptedAnswers: ["Domain Name System"],
        },
        {
          question:
            "Which address is associated with a network interface at hardware level?",
          answer: "MAC address",
          acceptedAnswers: ["MAC"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Can an IP address change when a device joins a different network?",
          answer: "Yes",
        },
      ],
      examQuestion: {
        question:
          "Explain the difference between IP and MAC addresses and describe the purpose of DNS.",
        marks: 6,
        answer:
          "An IP address is a logical address used for communication and routing across networks and may change. A MAC address identifies a network interface at hardware level and is normally fixed. DNS translates domain names into IP addresses.",
        markScheme: [
          "IP is a logical network address.",
          "IP is used for routing or communication.",
          "IP may change.",
          "MAC identifies a network interface or device hardware.",
          "MAC is normally fixed or unique.",
          "DNS translates domain names into IP addresses.",
        ],
        guidance: ["Credit accurate distinctions."],
      },
      reflectionPrompt:
        "Explain why users normally remember domain names rather than IP addresses.",
    },

    {
      id: "packet-switching",
      title: "Packet Switching",
      description:
        "Follow packets as they travel independently through a network.",
      estimatedTime: "18 mins",
      xpReward: 90,
      simulator: "packet-routing",
      objectives: [
        "Describe packet switching.",
        "Identify information in a packet header.",
        "Explain packet reassembly and alternative routes.",
      ],
      explanation:
        "Data is divided into packets. Each packet contains a header with information such as source, destination and sequence number. Routers may send packets along different routes. At the destination, packets are checked and reordered to reconstruct the original data.",
      workedExample:
        "A message split into four packets may arrive in the order 2, 1, 4, 3 and then be reordered using sequence numbers.",
      practiceQuestions: [
        {
          question: "Why does each packet contain a sequence number?",
          answer: "So packets can be put back into the correct order",
          acceptedAnswers: ["For reassembly at the destination"],
        },
        {
          question: "Which device forwards packets between networks?",
          answer: "Router",
        },
      ],
      checkpointQuestions: [
        {
          question: "Must all packets from one message take the same route?",
          answer: "No",
        },
      ],
      examQuestion: {
        question:
          "Describe how packet switching transfers data across a network.",
        marks: 6,
        answer:
          "The data is divided into packets. Headers contain source, destination and sequence information. Routers forward packets, possibly along different routes. The destination checks the packets, requests missing data if necessary and reassembles them in order.",
        markScheme: [
          "Data is divided into packets.",
          "Packets contain headers.",
          "Headers include destination or sequence information.",
          "Routers forward packets.",
          "Packets may take different routes.",
          "Packets are checked and reassembled at the destination.",
        ],
        guidance: ["Credit accurate sequencing."],
      },
      reflectionPrompt:
        "Explain one benefit of allowing packets to take alternative routes.",
    },
  ],
};
