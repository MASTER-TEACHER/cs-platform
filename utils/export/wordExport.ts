import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import { saveAs } from "file-saver";

import type { SavedTeacherResource } from "@/services/teacherResourceService";

const BRAND_COLOUR = "4F46E5";
const BRAND_DARK = "312E81";
const LIGHT_INDIGO = "EEF2FF";
const LIGHT_SLATE = "F8FAFC";
const BORDER_COLOUR = "CBD5E1";
const TEXT_COLOUR = "1E293B";
const MUTED_TEXT = "64748B";
const SUCCESS_COLOUR = "047857";
const WARNING_BACKGROUND = "FFFBEB";

function safeText(value: string | null | undefined): string {
  const cleanedValue = value?.trim();

  return cleanedValue || "Not provided";
}

function sanitiseFileName(value: string): string {
  const cleanedValue = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleanedValue || "cs-master-resource";
}

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatStatus(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatExportDate(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: {
      before: 360,
      after: 180,
    },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 10,
        color: BRAND_COLOUR,
        space: 6,
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        color: BRAND_DARK,
        size: 30,
      }),
    ],
  });
}

function createSubheading(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 240,
      after: 100,
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        color: TEXT_COLOUR,
        size: 25,
      }),
    ],
  });
}

function createBodyParagraph(
  text: string,
  options?: {
    bold?: boolean;
    italic?: boolean;
    colour?: string;
    before?: number;
    after?: number;
  },
): Paragraph {
  return new Paragraph({
    spacing: {
      before: options?.before ?? 0,
      after: options?.after ?? 140,
      line: 300,
    },
    children: [
      new TextRun({
        text: safeText(text),
        bold: options?.bold,
        italics: options?.italic,
        color: options?.colour ?? TEXT_COLOUR,
        size: 22,
      }),
    ],
  });
}

function createBulletParagraph(text: string): Paragraph {
  return new Paragraph({
    bullet: {
      level: 0,
    },
    spacing: {
      after: 90,
      line: 280,
    },
    children: [
      new TextRun({
        text: safeText(text),
        color: TEXT_COLOUR,
        size: 22,
      }),
    ],
  });
}

function createNumberedQuestion(
  number: number,
  question: string,
  marks: number,
): Paragraph {
  return new Paragraph({
    spacing: {
      before: 180,
      after: 100,
      line: 300,
    },
    children: [
      new TextRun({
        text: `${number}. `,
        bold: true,
        color: BRAND_COLOUR,
        size: 22,
      }),

      new TextRun({
        text: safeText(question),
        bold: true,
        color: TEXT_COLOUR,
        size: 22,
      }),

      new TextRun({
        text: `  [${marks} ${marks === 1 ? "mark" : "marks"}]`,
        bold: true,
        color: MUTED_TEXT,
        size: 20,
      }),
    ],
  });
}

function createDetailRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 32,
          type: WidthType.PERCENTAGE,
        },
        shading: {
          type: ShadingType.CLEAR,
          fill: LIGHT_INDIGO,
        },
        margins: {
          top: 130,
          bottom: 130,
          left: 160,
          right: 160,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                color: BRAND_DARK,
                size: 21,
              }),
            ],
          }),
        ],
      }),

      new TableCell({
        width: {
          size: 68,
          type: WidthType.PERCENTAGE,
        },
        margins: {
          top: 130,
          bottom: 130,
          left: 160,
          right: 160,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: safeText(value),
                color: TEXT_COLOUR,
                size: 21,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createDetailsTable(resource: SavedTeacherResource): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      left: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      right: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
    },
    rows: [
      createDetailRow("Topic", resource.topic),
      createDetailRow(
        "Resource type",
        formatResourceType(resource.resourceType),
      ),
      createDetailRow("Year group", resource.yearGroup),
      createDetailRow("Exam board", resource.examBoard),
      createDetailRow("Duration", resource.duration),
      createDetailRow("Difficulty", formatStatus(resource.difficulty)),
      createDetailRow("Status", formatStatus(resource.status)),
      createDetailRow("Exported", formatExportDate()),
    ],
  });
}

function createLessonSectionTable(
  sectionNumber: number,
  section: SavedTeacherResource["content"]["sections"][number],
): Table {
  const titleCell = new TableCell({
    columnSpan: 2,
    shading: {
      type: ShadingType.CLEAR,
      fill: BRAND_COLOUR,
    },
    margins: {
      top: 150,
      bottom: 150,
      left: 170,
      right: 170,
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `${sectionNumber}. ${safeText(section.title)}`,
            bold: true,
            color: "FFFFFF",
            size: 24,
          }),

          new TextRun({
            text: ` — ${safeText(section.duration)}`,
            color: "E0E7FF",
            size: 20,
          }),
        ],
      }),
    ],
  });

  function createContentRow(label: string, value: string): TableRow {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 27,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            type: ShadingType.CLEAR,
            fill: LIGHT_SLATE,
          },
          margins: {
            top: 140,
            bottom: 140,
            left: 150,
            right: 150,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  color: BRAND_DARK,
                  size: 20,
                }),
              ],
            }),
          ],
        }),

        new TableCell({
          width: {
            size: 73,
            type: WidthType.PERCENTAGE,
          },
          margins: {
            top: 140,
            bottom: 140,
            left: 150,
            right: 150,
          },
          children: [
            new Paragraph({
              spacing: {
                line: 280,
              },
              children: [
                new TextRun({
                  text: safeText(value),
                  color: TEXT_COLOUR,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  const resources =
    section.resources.length > 0
      ? section.resources.join("\n• ")
      : "No additional resources required";

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      left: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      right: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
    },
    rows: [
      new TableRow({
        children: [titleCell],
      }),
      createContentRow("Teacher instructions", section.teacherInstructions),
      createContentRow("Student activity", section.studentTask),
      createContentRow("Assessment", section.assessment),
      createContentRow("Resources", `• ${resources}`),
    ],
  });
}

function createDifferentiationTable(resource: SavedTeacherResource): Table {
  const differentiation = resource.content.differentiation;

  function createColumn(title: string, items: string[]): TableCell {
    return new TableCell({
      width: {
        size: 33.33,
        type: WidthType.PERCENTAGE,
      },
      margins: {
        top: 150,
        bottom: 150,
        left: 150,
        right: 150,
      },
      children: [
        new Paragraph({
          spacing: {
            after: 120,
          },
          children: [
            new TextRun({
              text: title,
              bold: true,
              color: BRAND_DARK,
              size: 22,
            }),
          ],
        }),

        ...(items.length > 0
          ? items.map((item) => createBulletParagraph(item))
          : [
              createBodyParagraph("No strategies provided.", {
                italic: true,
                colour: MUTED_TEXT,
              }),
            ]),
      ],
    });
  }

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      left: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      right: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: BORDER_COLOUR,
      },
    },
    rows: [
      new TableRow({
        children: [
          createColumn("Support", differentiation.support),
          createColumn("Core", differentiation.core),
          createColumn("Stretch", differentiation.stretch),
        ],
      }),
    ],
  });
}

function createCoverContent(resource: SavedTeacherResource): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 500,
        after: 140,
      },
      children: [
        new TextRun({
          text: "CS MASTER",
          bold: true,
          color: BRAND_COLOUR,
          size: 44,
          characterSpacing: 80,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 500,
      },
      children: [
        new TextRun({
          text: "TEACHING RESOURCE",
          bold: true,
          color: MUTED_TEXT,
          size: 24,
          characterSpacing: 40,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 300,
        after: 240,
      },
      children: [
        new TextRun({
          text: safeText(resource.title),
          bold: true,
          color: BRAND_DARK,
          size: 40,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 500,
      },
      children: [
        new TextRun({
          text: safeText(resource.content.overview),
          color: TEXT_COLOUR,
          size: 23,
          italics: true,
        }),
      ],
    }),
  ];
}

function createFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: BORDER_COLOUR,
            space: 8,
          },
        },
        children: [
          new TextRun({
            text: "Generated by CS Master",
            bold: true,
            color: BRAND_COLOUR,
            size: 18,
          }),

          new TextRun({
            text: `  •  ${formatExportDate()}`,
            color: MUTED_TEXT,
            size: 18,
          }),
        ],
      }),
    ],
  });
}

export async function exportResourceToWord(
  resource: SavedTeacherResource,
): Promise<void> {
  const content = resource.content;

  const documentChildren: (Paragraph | Table)[] = [
    ...createCoverContent(resource),

    createDetailsTable(resource),

    new Paragraph({
      children: [new PageBreak()],
    }),

    createSectionHeading("Resource Overview"),

    createBodyParagraph(content.overview),

    createSectionHeading("Learning Objectives"),

    ...(content.learningObjectives.length > 0
      ? content.learningObjectives.map(createBulletParagraph)
      : [
          createBodyParagraph("No learning objectives provided.", {
            italic: true,
            colour: MUTED_TEXT,
          }),
        ]),

    createSectionHeading("Success Criteria"),

    ...(content.successCriteria.length > 0
      ? content.successCriteria.map(createBulletParagraph)
      : [
          createBodyParagraph("No success criteria provided.", {
            italic: true,
            colour: MUTED_TEXT,
          }),
        ]),

    createSectionHeading("Prior Knowledge"),

    ...(content.priorKnowledge.length > 0
      ? content.priorKnowledge.map(createBulletParagraph)
      : [
          createBodyParagraph("No specific prior knowledge required.", {
            italic: true,
            colour: MUTED_TEXT,
          }),
        ]),

    createSectionHeading("Keywords"),

    createBodyParagraph(
      content.keywords.length > 0
        ? content.keywords.join(", ")
        : "No keywords provided.",
    ),

    createSectionHeading("Lesson Sequence"),
  ];

  content.sections.forEach((section, index) => {
    documentChildren.push(createLessonSectionTable(index + 1, section));

    documentChildren.push(
      new Paragraph({
        spacing: {
          after: 260,
        },
        children: [],
      }),
    );
  });

  documentChildren.push(
    createSectionHeading("Differentiation"),

    createDifferentiationTable(resource),

    createSectionHeading("Common Misconceptions"),
  );

  if (content.misconceptions.length > 0) {
    content.misconceptions.forEach((item, index) => {
      documentChildren.push(
        createSubheading(`Misconception ${index + 1}`),

        createBodyParagraph(item.misconception, {
          bold: true,
          colour: "92400E",
        }),

        createBodyParagraph(`Correction: ${safeText(item.correction)}`, {
          colour: SUCCESS_COLOUR,
        }),
      );
    });
  } else {
    documentChildren.push(
      createBodyParagraph("No common misconceptions provided.", {
        italic: true,
        colour: MUTED_TEXT,
      }),
    );
  }

  documentChildren.push(createSectionHeading("Assessment Questions"));

  if (content.assessmentQuestions.length > 0) {
    content.assessmentQuestions.forEach((question, index) => {
      documentChildren.push(
        createNumberedQuestion(index + 1, question.question, question.marks),

        new Paragraph({
          shading: {
            type: ShadingType.CLEAR,
            fill: WARNING_BACKGROUND,
          },
          spacing: {
            before: 60,
            after: 180,
            line: 280,
          },
          indent: {
            left: 240,
            right: 240,
          },
          children: [
            new TextRun({
              text: "Model answer: ",
              bold: true,
              color: SUCCESS_COLOUR,
              size: 20,
            }),

            new TextRun({
              text: safeText(question.answer),
              color: TEXT_COLOUR,
              size: 20,
            }),
          ],
        }),
      );
    });
  } else {
    documentChildren.push(
      createBodyParagraph("No assessment questions provided.", {
        italic: true,
        colour: MUTED_TEXT,
      }),
    );
  }

  documentChildren.push(
    createSectionHeading("Homework"),

    createBodyParagraph(content.homework),

    createSectionHeading("Teacher Notes"),

    createBodyParagraph(content.teacherNotes),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 500,
      },
      children: [
        new TextRun({
          text: "End of resource",
          bold: true,
          color: BRAND_COLOUR,
          size: 20,
        }),
      ],
    }),
  );

  const wordDocument = new Document({
    creator: "CS Master",
    title: resource.title,
    subject: resource.topic,
    description: "Teaching resource exported from CS Master",
    keywords: content.keywords.join(", "),
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 900,
              right: 900,
              bottom: 900,
              left: 900,
            },
          },
        },
        footers: {
          default: createFooter(),
        },
        children: documentChildren,
      },
    ],
  });

  const documentBlob = await Packer.toBlob(wordDocument);

  const fileName = `${sanitiseFileName(resource.title)}-CS-Master.docx`;

  saveAs(documentBlob, fileName);
}
