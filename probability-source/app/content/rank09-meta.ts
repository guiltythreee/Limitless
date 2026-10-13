// Source ids of the Chapter 1 MCQ bank (E = easy, M = medium), in the same order as mcqByLesson.
export const mcqSources: Record<string, string[]> = {
  "sample-space": ["E1", "E2", "E7", "E54", "E74", "E75", "E89", "E34", "M42"],
  "events-operations": ["E3", "E4", "E6", "E25", "E70", "E88"],
  "set-theory": ["M1", "M2", "M3", "E76"],
  "mutually-exclusive": ["E8", "E13", "E31", "E33", "M4"],
  "exhaustive-partitions": ["E9", "E10", "E51", "E52", "E53", "E72"],
  "counting": ["E68", "E69", "E24", "E45", "M23", "M24"],
  "combinations": ["E22", "E23", "E43", "E42", "E65", "E66", "E67", "M8", "M32", "M33", "M37"],
  "multinomials": ["M25"],
  "axioms": ["E12", "E15", "E26", "E27", "E47", "E48", "M19", "M27", "M29", "M43", "M44"],
  "properties": ["E14", "E28", "E29", "E30", "E32", "E37", "E38", "E39", "E71", "E73", "E86", "E87", "M5", "M6", "M7", "M16", "M28", "M30", "M31", "M41", "M46", "M47", "M48"],
  "equally-likely": ["E16", "E17", "E18", "E19", "E20", "E21", "E44", "E46", "E55", "E56", "E57", "E58", "E59", "E60", "E61", "E62", "E63", "E64", "E90", "E91", "E92", "E93", "E94", "E95", "E96", "E97", "E98", "E99", "E100", "M34", "M35", "M36", "M38", "M39", "M40", "M49"],
  "probability-counting": ["E35", "E36", "E40", "E41", "M22", "M26", "M50"],
  "de-morgan": ["E5", "E11"],
  "continuity": ["E49", "E50", "M20", "M45", "M18"],
  "geometric-probability": ["E77", "E78", "E79", "E80", "E81", "E82", "M9", "M10", "M11", "M12", "M21"],
  "borel-cantelli": ["E83", "E84", "E85", "M13", "M14", "M15", "M17"],
};
