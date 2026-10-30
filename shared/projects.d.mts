import type { RewardRecord } from "./rewards.mjs";

export const PROJECT_REGISTRY_STORAGE_KEY: string;
export const PROJECT_SCHEMA_VERSION: number;

export type RegisteredProjectInput = {
  projectId: string;
  moduleId: string;
  title: string;
  scope: string;
  criteria: string;
  baseExp: number;
  difficulty: "foundational" | "intermediate" | "advanced";
};

export type RegisteredProject = RegisteredProjectInput & {
  registeredAt: number;
  policyVersion: "LSR-1";
  schemaVersion: number;
  completed?: boolean;
  award?: RewardRecord | null;
};

export function listRegisteredProjects(storage: {
  getItem(key: string): string | null;
}): RegisteredProject[];

export function registerProject(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  input: RegisteredProjectInput,
  now?: () => number,
): { ok: true; project: RegisteredProject } | { ok: false; error: string };

export function completeProject(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  projectId: string,
  options?: { confirmed?: boolean; now?: number },
): { ok: true; duplicate?: boolean; record?: RewardRecord | null; totalExp?: number } | { ok: false; error: string };
