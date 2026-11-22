import type { GeneratedExamQuestion } from "@/types/examQuestion";

/**
 * Mark schemes and model answers for the original Creative iMedia R093
 * practice questions (data/imedia/practiceBank.ts). Formative: verify against
 * the current OCR specification before formal assessment.
 */
export const imediaMarkSchemes: Record<
  string,
  Pick<
    GeneratedExamQuestion,
    "commandWord" | "difficulty" | "markScheme" | "levelDescriptors" | "modelAnswer"
  >
> = {
  "imedia-r093-01": {
    "commandWord": "identify",
    "difficulty": "foundation",
    "markScheme": [
      {
        "id": "imedia-r093-01-point-1",
        "description": "First valid media sector, e.g. film, television, radio, print publishing, computer games, interactive media, internet",
        "marks": 1
      },
      {
        "id": "imedia-r093-01-point-2",
        "description": "Suitable product for the first sector, e.g. film → feature film / trailer",
        "marks": 1
      },
      {
        "id": "imedia-r093-01-point-3",
        "description": "Second, different valid sector",
        "marks": 1
      },
      {
        "id": "imedia-r093-01-point-4",
        "description": "Suitable product for the second sector, e.g. print publishing → magazine",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Television – a TV advert; print publishing – a magazine."
  },
  "imedia-r093-02": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-02-point-1",
        "description": "First demographic factor, e.g. age, gender, income, location, ethnicity, occupation",
        "marks": 1
      },
      {
        "id": "imedia-r093-02-point-2",
        "description": "How it influences the design, e.g. younger audiences → bright colours, informal language, social-media platform",
        "marks": 1
      },
      {
        "id": "imedia-r093-02-point-3",
        "description": "Second, different demographic factor",
        "marks": 1
      },
      {
        "id": "imedia-r093-02-point-4",
        "description": "How it influences the design, e.g. higher income → premium style / luxury imagery",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Age affects style and platform (e.g. bold colours and social media for teenagers); income affects the tone and imagery (e.g. a premium look for high earners)."
  },
  "imedia-r093-03": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-03-point-1",
        "description": "First requirement identified, e.g. purpose/key message, duration, platform, content, house style, accessibility, deadline/budget",
        "marks": 1
      },
      {
        "id": "imedia-r093-03-point-2",
        "description": "Explained, applied to the charity video for 13–16 year olds",
        "marks": 1
      },
      {
        "id": "imedia-r093-03-point-3",
        "description": "Why it matters, e.g. affects length, format or style of the final product",
        "marks": 1
      },
      {
        "id": "imedia-r093-03-point-4",
        "description": "Second requirement identified",
        "marks": 1
      },
      {
        "id": "imedia-r093-03-point-5",
        "description": "Explained, applied to the scenario",
        "marks": 1
      },
      {
        "id": "imedia-r093-03-point-6",
        "description": "Why it matters",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "The platform (e.g. TikTok vs YouTube) decides aspect ratio and length so it reaches teenagers; the key message must be agreed so the video achieves the charity's aim."
  },
  "imedia-r093-04": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-04-point-1",
        "description": "Dependencies show which tasks must be finished before others can start",
        "marks": 1
      },
      {
        "id": "imedia-r093-04-point-2",
        "description": "Ensures tasks are scheduled in the correct order",
        "marks": 1
      },
      {
        "id": "imedia-r093-04-point-3",
        "description": "Shows the knock-on effect of a delay on later tasks / the deadline",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Dependencies show which tasks rely on others, so work is ordered correctly and the effect of delays is clear."
  },
  "imedia-r093-05": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-05-point-1",
        "description": "First useful annotation, e.g. shot type/camera angle, camera movement, duration/timing, audio, transitions, lighting, location",
        "marks": 1
      },
      {
        "id": "imedia-r093-05-point-2",
        "description": "Explanation of how it helps the production team, e.g. camera operator knows how to frame the shot",
        "marks": 1
      },
      {
        "id": "imedia-r093-05-point-3",
        "description": "Second, different annotation",
        "marks": 1
      },
      {
        "id": "imedia-r093-05-point-4",
        "description": "Explanation of how it helps, e.g. editor knows how long each scene lasts",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Shot types tell the camera operator how to frame each scene; timings tell the editor how long each shot should run."
  },
  "imedia-r093-06": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-06-point-1",
        "description": "Strength identified, e.g. quickly communicates the look and feel / colours, textures and style",
        "marks": 1
      },
      {
        "id": "imedia-r093-06-point-2",
        "description": "Strength explained in relation to communicating with the client",
        "marks": 1
      },
      {
        "id": "imedia-r093-06-point-3",
        "description": "Limitation identified, e.g. doesn't show layout, final content or how the product works / open to interpretation",
        "marks": 1
      },
      {
        "id": "imedia-r093-06-point-4",
        "description": "Limitation explained",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "A mood board shows the style and colour quickly so the client can react, but it doesn't show the final layout, so the client may imagine something different."
  },
  "imedia-r093-07": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-07-point-1",
        "description": "Check who owns the copyright",
        "marks": 1
      },
      {
        "id": "imedia-r093-07-point-2",
        "description": "Obtain permission or buy a licence that allows commercial use",
        "marks": 1
      },
      {
        "id": "imedia-r093-07-point-3",
        "description": "Check the licence terms, e.g. Creative Commons conditions such as attribution / no commercial use",
        "marks": 1
      },
      {
        "id": "imedia-r093-07-point-4",
        "description": "Check whether identifiable people/trademarks appear (model release / permission)",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Find out who owns the image and get a licence for commercial use, checking the licence conditions (e.g. Creative Commons non-commercial terms)."
  },
  "imedia-r093-08": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-08-point-1",
        "description": "Store the data securely, e.g. password protection / encryption / restricted access",
        "marks": 1
      },
      {
        "id": "imedia-r093-08-point-2",
        "description": "Explanation, e.g. prevents a data breach under data protection law",
        "marks": 1
      },
      {
        "id": "imedia-r093-08-point-3",
        "description": "Use the data only for the stated purpose / don't share without consent",
        "marks": 1
      },
      {
        "id": "imedia-r093-08-point-4",
        "description": "Delete it when no longer needed / keep it accurate",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Keep entrants' details secure and only use them to run the competition, deleting them afterwards, as required by data protection law."
  },
  "imedia-r093-09": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-09-point-1",
        "description": "First accessibility feature, e.g. subtitles/closed captions, audio description, transcript, high-contrast text, adjustable playback",
        "marks": 1
      },
      {
        "id": "imedia-r093-09-point-2",
        "description": "Justification linked to a user group, e.g. captions help deaf / hard-of-hearing viewers",
        "marks": 1
      },
      {
        "id": "imedia-r093-09-point-3",
        "description": "Further justification, e.g. viewers watching with sound off on social media",
        "marks": 1
      },
      {
        "id": "imedia-r093-09-point-4",
        "description": "Second, different accessibility feature",
        "marks": 1
      },
      {
        "id": "imedia-r093-09-point-5",
        "description": "Justification linked to a user group, e.g. audio description helps blind / partially sighted viewers",
        "marks": 1
      },
      {
        "id": "imedia-r093-09-point-6",
        "description": "Further justification / applied to an online promotional video",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Captions help deaf viewers and people watching without sound; audio description lets visually impaired viewers follow what is shown."
  },
  "imedia-r093-10": {
    "commandWord": "explain",
    "difficulty": "foundation",
    "markScheme": [
      {
        "id": "imedia-r093-10-point-1",
        "description": "The editable source file (e.g. PSD, project file) keeps layers/elements separate",
        "marks": 1
      },
      {
        "id": "imedia-r093-10-point-2",
        "description": "So changes can be made later without starting again",
        "marks": 1
      },
      {
        "id": "imedia-r093-10-point-3",
        "description": "The exported file (e.g. JPG, MP4) is compressed/flattened for the client or platform",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "The source file keeps everything editable for future changes; the export is a compressed final version for delivery."
  },
  "imedia-r093-11": {
    "commandWord": "compare",
    "difficulty": "higher",
    "markScheme": [
      {
        "id": "imedia-r093-11-point-1",
        "description": "Marked using the levels of response. Indicative content: Website reaches a global audience 24/7; Website content can be updated quickly and include interactive/multimedia elements; Website needs internet access and devices; may be missed among lots of online content; Print is tangible, can target a local area and suits audiences less likely to be online; Print has printing and distribution costs and cannot be updated once printed; Choice depends on audience, purpose and budget.",
        "marks": 6
      }
    ],
    "levelDescriptors": [
      {
        "level": 3,
        "markRange": "5-6",
        "description": "Thorough, well-developed points applied to the context; balanced and reaches a justified conclusion; accurate technical terms."
      },
      {
        "level": 2,
        "markRange": "3-4",
        "description": "Some developed points with some application to the context; partially balanced; mostly accurate terminology."
      },
      {
        "level": 1,
        "markRange": "1-2",
        "description": "Basic, mostly undeveloped points with little application to the context; limited terminology."
      }
    ],
    "modelAnswer": "A balanced answer compares reach, cost, interactivity, updating and audience access, and links the choice to purpose and audience."
  },
  "imedia-r093-12": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-12-point-1",
        "description": "Graphic designer creates the visual content, e.g. logos, layouts, graphics",
        "marks": 1
      },
      {
        "id": "imedia-r093-12-point-2",
        "description": "Explanation of how this contributes, e.g. ensures the product looks right for the audience/brief",
        "marks": 1
      },
      {
        "id": "imedia-r093-12-point-3",
        "description": "Project manager plans and coordinates the project, e.g. schedule, budget, resources",
        "marks": 1
      },
      {
        "id": "imedia-r093-12-point-4",
        "description": "Explanation, e.g. keeps the project on time and communicates with the client",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "The graphic designer produces the visual assets that meet the brief; the project manager plans the schedule and budget and keeps the team on track."
  },
  "imedia-r093-13": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-13-point-1",
        "description": "Purpose identified, e.g. to inform, entertain, educate, advertise, influence",
        "marks": 1
      },
      {
        "id": "imedia-r093-13-point-2",
        "description": "Effect on style, e.g. an informative product uses clear, simple layout and plain language",
        "marks": 1
      },
      {
        "id": "imedia-r093-13-point-3",
        "description": "Effect on content, e.g. an advert focuses on the product's benefits and a call to action",
        "marks": 1
      },
      {
        "id": "imedia-r093-13-point-4",
        "description": "Example contrasting two purposes",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "An informative leaflet uses clear headings and plain facts, while an entertainment product uses bold colours and humour to engage."
  },
  "imedia-r093-14": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-14-point-1",
        "description": "First method, e.g. size/scale of text or images",
        "marks": 1
      },
      {
        "id": "imedia-r093-14-point-2",
        "description": "How it guides the viewer, e.g. largest element is seen first",
        "marks": 1
      },
      {
        "id": "imedia-r093-14-point-3",
        "description": "Second method, e.g. colour/contrast, position/placement, white space, font weight",
        "marks": 1
      },
      {
        "id": "imedia-r093-14-point-4",
        "description": "How it guides the viewer",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Making the headline the largest element draws the eye first; contrasting colour highlights the call to action."
  },
  "imedia-r093-15": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-15-point-1",
        "description": "Ask the client for specific details of what doesn't appeal",
        "marks": 1
      },
      {
        "id": "imedia-r093-15-point-2",
        "description": "Research the teenage audience (e.g. survey or existing products they like)",
        "marks": 1
      },
      {
        "id": "imedia-r093-15-point-3",
        "description": "Change specific elements, e.g. colours, fonts, imagery, language",
        "marks": 1
      },
      {
        "id": "imedia-r093-15-point-4",
        "description": "Show the revised design to the client/target audience for further feedback",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Find out exactly what doesn't appeal, research what teenagers like, adjust colours, fonts and images, then test again with the audience."
  },
  "imedia-r093-16": {
    "commandWord": "explain",
    "difficulty": "foundation",
    "markScheme": [
      {
        "id": "imedia-r093-16-point-1",
        "description": "Files can be found quickly by anyone in the team",
        "marks": 1
      },
      {
        "id": "imedia-r093-16-point-2",
        "description": "Version numbers show which file is the latest",
        "marks": 1
      },
      {
        "id": "imedia-r093-16-point-3",
        "description": "Earlier versions can be returned to if needed / avoids overwriting work",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Clear names and version numbers make the latest file easy to find and let the team go back to earlier versions."
  },
  "imedia-r093-17": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-17-point-1",
        "description": "First risk identified, e.g. illness of a team member, equipment failure, bad weather, client changes, file loss",
        "marks": 1
      },
      {
        "id": "imedia-r093-17-point-2",
        "description": "Contingency for the first risk",
        "marks": 1
      },
      {
        "id": "imedia-r093-17-point-3",
        "description": "Explanation of how the contingency reduces delay",
        "marks": 1
      },
      {
        "id": "imedia-r093-17-point-4",
        "description": "Second, different risk identified",
        "marks": 1
      },
      {
        "id": "imedia-r093-17-point-5",
        "description": "Contingency for the second risk",
        "marks": 1
      },
      {
        "id": "imedia-r093-17-point-6",
        "description": "Explanation of how it reduces delay",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Equipment failure – book backup equipment so filming continues; bad weather – plan an indoor alternative date so the schedule isn't lost."
  },
  "imedia-r093-18": {
    "commandWord": "explain",
    "difficulty": "standard",
    "markScheme": [
      {
        "id": "imedia-r093-18-point-1",
        "description": "Technical testing checks the product works as intended",
        "marks": 1
      },
      {
        "id": "imedia-r093-18-point-2",
        "description": "Example, e.g. links work, file plays, correct dimensions/format, loads on different devices",
        "marks": 1
      },
      {
        "id": "imedia-r093-18-point-3",
        "description": "Audience/user testing checks the product meets the needs of the target audience",
        "marks": 1
      },
      {
        "id": "imedia-r093-18-point-4",
        "description": "Example, e.g. gathering feedback on whether it is appealing, clear, easy to use",
        "marks": 1
      }
    ],
    "levelDescriptors": [],
    "modelAnswer": "Technical testing checks it functions correctly (links, playback, formats); user testing checks the target audience finds it appealing and easy to use."
  },
  "imedia-r093-19": {
    "commandWord": "evaluate",
    "difficulty": "higher",
    "markScheme": [
      {
        "id": "imedia-r093-19-point-1",
        "description": "Marked using the levels of response. Indicative content: Meets the technical requirement for dimensions; Readability problem means users cannot access the content; Purpose (e.g. to inform) is not achieved if text can't be read; Possible causes: font size, colour contrast, font choice, too much text; Suggested improvements, e.g. larger font, higher contrast, clearer typeface; Reasoned judgement on fitness for purpose.",
        "marks": 6
      }
    ],
    "levelDescriptors": [
      {
        "level": 3,
        "markRange": "5-6",
        "description": "Thorough, well-developed points applied to the context; balanced and reaches a justified conclusion; accurate technical terms."
      },
      {
        "level": 2,
        "markRange": "3-4",
        "description": "Some developed points with some application to the context; partially balanced; mostly accurate terminology."
      },
      {
        "level": 1,
        "markRange": "1-2",
        "description": "Basic, mostly undeveloped points with little application to the context; limited terminology."
      }
    ],
    "modelAnswer": "A strong answer recognises that meeting dimensions alone is not enough, explains why poor readability undermines the purpose and audience, suggests fixes and concludes it is not fully fit for purpose."
  },
  "imedia-r093-20": {
    "commandWord": "evaluate",
    "difficulty": "higher",
    "markScheme": [
      {
        "id": "imedia-r093-20-point-1",
        "description": "Marked using the levels of response. Indicative content: Audience: content, language and interaction suitable for children aged 8–11; Accessibility: readable text, audio, height of screen, colour contrast; Interaction: simple navigation, touch controls, immediate feedback; Robustness: durable hardware, works with heavy use, easy to reset; Engagement: games, animation, sound to keep interest; educational content; Legal/safety: licensed assets, no personal data collected from children; Testing with children before launch; Prioritises factors with justification.",
        "marks": 9
      }
    ],
    "levelDescriptors": [
      {
        "level": 3,
        "markRange": "7-9",
        "description": "Comprehensive, well-structured discussion applied to the scenario; considers several perspectives and reaches a supported conclusion; precise terminology."
      },
      {
        "level": 2,
        "markRange": "4-6",
        "description": "Reasonable discussion with some application and some balance; conclusion may be partly supported; generally accurate terminology."
      },
      {
        "level": 1,
        "markRange": "1-3",
        "description": "Limited discussion, mostly descriptive with little application or balance; some inaccuracies."
      }
    ],
    "modelAnswer": "A strong answer evaluates three well-chosen factors, applies each to the museum and child audience, weighs their importance and justifies the priorities."
  }
};
