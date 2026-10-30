/**
 * Node's built-in TypeScript stripping does not resolve extensionless TS imports.
 * This test-only loader retries relative extensionless imports with ".ts".
 * Production bundlers and application import paths are unchanged.
 */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && !/\.[a-z0-9]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw error;
  }
}
