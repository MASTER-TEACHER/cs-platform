import type { ALevelExamBoard } from "@/types/aLevelPractice";

export type ALevelTopicCatalogItem = {
  id: string;
  board: ALevelExamBoard;
  specificationCode: string;
  title: string;
  sourceTopicIds: string[];
};

export const aLevelTopicCatalog: ALevelTopicCatalogItem[] = 
[
  {
    "id": "aqa-4-1",
    "board": "AQA",
    "specificationCode": "4.1",
    "title": "Fundamentals of Programming",
    "sourceTopicIds": [
      "advanced-programming"
    ]
  },
  {
    "id": "aqa-4-2",
    "board": "AQA",
    "specificationCode": "4.2",
    "title": "Fundamentals of Data Structures",
    "sourceTopicIds": [
      "data-structures"
    ]
  },
  {
    "id": "aqa-4-3",
    "board": "AQA",
    "specificationCode": "4.3",
    "title": "Fundamentals of Algorithms",
    "sourceTopicIds": [
      "algorithms-a-level",
      "computational-thinking"
    ]
  },
  {
    "id": "aqa-4-4",
    "board": "AQA",
    "specificationCode": "4.4",
    "title": "Theory of Computation",
    "sourceTopicIds": [
      "theory-computation"
    ]
  },
  {
    "id": "aqa-4-5",
    "board": "AQA",
    "specificationCode": "4.5",
    "title": "Fundamentals of Data Representation",
    "sourceTopicIds": [
      "advanced-data-representation"
    ]
  },
  {
    "id": "aqa-4-6",
    "board": "AQA",
    "specificationCode": "4.6",
    "title": "Fundamentals of Computer Systems",
    "sourceTopicIds": [
      "advanced-systems"
    ]
  },
  {
    "id": "aqa-4-7",
    "board": "AQA",
    "specificationCode": "4.7",
    "title": "Computer Organisation and Architecture",
    "sourceTopicIds": [
      "advanced-systems"
    ]
  },
  {
    "id": "aqa-4-8",
    "board": "AQA",
    "specificationCode": "4.8",
    "title": "Consequences of Uses of Computing",
    "sourceTopicIds": [
      "legal-ethical-a-level"
    ]
  },
  {
    "id": "aqa-4-9",
    "board": "AQA",
    "specificationCode": "4.9",
    "title": "Communication and Networking",
    "sourceTopicIds": [
      "advanced-networks"
    ]
  },
  {
    "id": "aqa-4-10",
    "board": "AQA",
    "specificationCode": "4.10",
    "title": "Fundamentals of Databases",
    "sourceTopicIds": [
      "advanced-databases"
    ]
  },
  {
    "id": "aqa-4-11",
    "board": "AQA",
    "specificationCode": "4.11",
    "title": "Big Data",
    "sourceTopicIds": [
      "big-data"
    ]
  },
  {
    "id": "aqa-4-12",
    "board": "AQA",
    "specificationCode": "4.12",
    "title": "Functional Programming",
    "sourceTopicIds": [
      "functional-programming"
    ]
  },
  {
    "id": "aqa-4-13",
    "board": "AQA",
    "specificationCode": "4.13",
    "title": "Systematic Approach to Problem Solving",
    "sourceTopicIds": [
      "software-development",
      "computational-thinking"
    ]
  },
  {
    "id": "aqa-4-14",
    "board": "AQA",
    "specificationCode": "4.14",
    "title": "Non-exam Assessment: Computing Practical Project",
    "sourceTopicIds": [
      "software-development"
    ]
  },
  {
    "id": "ocr-1-1",
    "board": "OCR",
    "specificationCode": "1.1",
    "title": "Processors, Input, Output and Storage",
    "sourceTopicIds": [
      "advanced-systems"
    ]
  },
  {
    "id": "ocr-1-2",
    "board": "OCR",
    "specificationCode": "1.2",
    "title": "Software and Software Development",
    "sourceTopicIds": [
      "software-development",
      "advanced-programming"
    ]
  },
  {
    "id": "ocr-1-3",
    "board": "OCR",
    "specificationCode": "1.3",
    "title": "Exchanging Data",
    "sourceTopicIds": [
      "advanced-networks",
      "advanced-databases",
      "advanced-data-representation"
    ]
  },
  {
    "id": "ocr-1-4",
    "board": "OCR",
    "specificationCode": "1.4",
    "title": "Data Types, Data Structures and Algorithms",
    "sourceTopicIds": [
      "data-structures",
      "advanced-data-representation",
      "algorithms-a-level"
    ]
  },
  {
    "id": "ocr-1-5",
    "board": "OCR",
    "specificationCode": "1.5",
    "title": "Legal, Moral, Cultural and Ethical Issues",
    "sourceTopicIds": [
      "legal-ethical-a-level"
    ]
  },
  {
    "id": "ocr-2-1",
    "board": "OCR",
    "specificationCode": "2.1",
    "title": "Elements of Computational Thinking",
    "sourceTopicIds": [
      "computational-thinking"
    ]
  },
  {
    "id": "ocr-2-2",
    "board": "OCR",
    "specificationCode": "2.2",
    "title": "Problem Solving and Programming",
    "sourceTopicIds": [
      "advanced-programming",
      "software-development"
    ]
  },
  {
    "id": "ocr-2-3",
    "board": "OCR",
    "specificationCode": "2.3",
    "title": "Algorithms",
    "sourceTopicIds": [
      "algorithms-a-level",
      "computational-thinking"
    ]
  },
  {
    "id": "ocr-3",
    "board": "OCR",
    "specificationCode": "03",
    "title": "Programming Project",
    "sourceTopicIds": [
      "software-development"
    ]
  }
] as ALevelTopicCatalogItem[];

export function getALevelTopicsForBoard(
  board: ALevelExamBoard,
): ALevelTopicCatalogItem[] {
  return aLevelTopicCatalog.filter(
    (topic) => topic.board === board,
  );
}
