import type { CourseManifest } from "../types";
import { capabilities } from "../capabilities";

/** MT200 — Testing of Materials. Source: the supplied NITK course plan. */
export const MT200_MANIFEST: CourseManifest = {
  id: "mt200",
  code: "MT200",
  title: "Testing of Materials",
  subtitle: "Mechanical testing, material behaviour and structure–property relations",
  description:
    "The five-module MT200 course plan, with four practice papers and their model solutions/marking schemes. Includes materials classification, tension and compression, hardness, torsion, impact, fatigue and creep.",
  symbol: "⚙",
  status: "live",
  route: "mt200",
  storageKey: "mm-mt200-v1",
  contentBase: "data/mt200",
  capabilities: capabilities({}),
  units: [
    { id: "m1", num: 1, title: "Introduction to Materials", topicIds: ["m1"] },
    { id: "m2", num: 2, title: "Tension and Compression Testing", topicIds: ["m2"] },
    { id: "m3", num: 3, title: "Hardness Testing", topicIds: ["m3"] },
    { id: "m4", num: 4, title: "Miscellaneous Testing Methods", topicIds: ["m4"] },
    { id: "m5", num: 5, title: "Practical Exposure", topicIds: ["m5"] },
  ],
  topics: [
    { id: "m1", unitId: "m1", num: 1, title: "Introduction to Materials", count: 0, hasLesson: false },
    { id: "m2", unitId: "m2", num: 2, title: "Tension and Compression Testing", count: 0, hasLesson: false },
    { id: "m3", unitId: "m3", num: 3, title: "Hardness Testing", count: 0, hasLesson: false },
    { id: "m4", unitId: "m4", num: 4, title: "Miscellaneous Testing Methods", count: 0, hasLesson: false },
    { id: "m5", unitId: "m5", num: 5, title: "Practical Exposure", count: 0, hasLesson: false },
  ],
  taxonomy: {
    types: [],
    difficulties: [
      { level: 1, name: "Basic" },
      { level: 2, name: "Intermediate" },
      { level: 3, name: "Advanced" },
      { level: 4, name: "Exam challenge" },
    ],
  },
  tools: [],
};
