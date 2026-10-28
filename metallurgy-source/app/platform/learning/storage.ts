// app/platform/learning/storage.ts
//
// The only stateful helper in the learning core. It is deliberately injected
// with the course's own read/write pair so it can never construct a storage
// key or replace a whole payload. `setStored` must merge the additive field.
//
// Read path:
//   root = read()
//   if root.activities is an array -> sanitise it
//   else -> derive legacy from the course's own `answered` map
// No write happens on load.
//
// Write path:
//   next = appendActivities(current, input)
//   write(setStored(root, next))
// Every other field on the root survives.

import type {
  Activity,
  ActivityLog,
  ActivityLogConfig,
  NewActivity,
} from "./types";
import { MAX_ACTIVITIES } from "./types";
import { appendActivities, sanitiseActivities } from "./activities";

export function createActivityLog<TRoot>(
  cfg: ActivityLogConfig<TRoot>
): ActivityLog {
  const cap = Math.max(0, Math.floor(cfg.cap ?? MAX_ACTIVITIES));

  const readList = (root: TRoot): Activity[] => {
    const stored = cfg.getStored(root);
    if (Array.isArray(stored)) {
      return sanitiseActivities(stored, cfg.courseId, cap);
    }
    const derived = cfg.deriveLegacy ? cfg.deriveLegacy(root) : [];
    return sanitiseActivities(derived, cfg.courseId, cap);
  };

  return {
    courseId: cfg.courseId,
    storageKey: cfg.storageKey,

    load(): Activity[] {
      return readList(cfg.read());
    },

    append(input: NewActivity | readonly NewActivity[]): Activity[] {
      const root = cfg.read();
      const incoming = Array.isArray(input)
        ? (input as readonly NewActivity[])
        : [input as NewActivity];

      const next = appendActivities(readList(root), incoming, {
        courseId: cfg.courseId,
        cap,
        now: cfg.now ? cfg.now() : Date.now(),
      });

      cfg.write(cfg.setStored(root, next));
      return next;
    },
  };
}
