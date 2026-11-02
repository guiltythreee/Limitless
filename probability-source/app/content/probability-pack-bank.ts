import { probabilityPackBank_seq08_a } from "./probability-pack-bank-seq08-a";
import { probabilityPackBank_seq08_b } from "./probability-pack-bank-seq08-b";
import { probabilityPackBank_seq07_a } from "./probability-pack-bank-seq07-a";
import { probabilityPackBank_seq07_b } from "./probability-pack-bank-seq07-b";
import { probabilityPackBank_seq07_c } from "./probability-pack-bank-seq07-c";

/** All 99 supplemental questions, grouped by their existing lesson IDs. */
export const probabilityPackBank = {
  ...probabilityPackBank_seq08_a,
  ...probabilityPackBank_seq08_b,
  ...probabilityPackBank_seq07_a,
  ...probabilityPackBank_seq07_b,
  ...probabilityPackBank_seq07_c,
};
