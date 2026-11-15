/** Explicit profile registry. Add a profile only after its adapter and tests exist. */
const profiles = new Map();

export function registerProfile(profile) {
  if (!profile?.id || !profile.discipline || !profile.format) {
    throw new Error("A quality profile needs id, discipline and format");
  }
  if (profiles.has(profile.id)) throw new Error(`Duplicate quality profile: ${profile.id}`);
  profiles.set(profile.id, Object.freeze(profile));
}

export function getProfile(id) {
  const profile = profiles.get(id);
  if (!profile) throw new Error(`Unknown quality profile: ${id}`);
  return profile;
}

export function listProfiles() {
  return [...profiles.values()].map(({ id, version, discipline, format }) =>
    ({ id, version, discipline, format }));
}
