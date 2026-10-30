/**
 * Test-only resolver for Node's native TypeScript stripping.
 * The app code uses bundler-style extensionless imports, including directory
 * barrels such as "../content" -> "../content/index.ts".
 */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (firstError) {
    if (!specifier.startsWith(".") || /\.[a-z0-9]+$/i.test(specifier)) {
      throw firstError;
    }
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      return nextResolve(`${specifier}/index.ts`, context);
    }
  }
}
