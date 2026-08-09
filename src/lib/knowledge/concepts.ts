import type { ConceptDefinition, ConceptResolution } from './contracts';

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi');
}

export function resolveConcept(
  query: string,
  concepts: readonly ConceptDefinition[],
  scope?: string
): ConceptResolution {
  const needle = normalize(query);
  const scopeNeedle = scope ? normalize(scope) : null;

  const matches = concepts.filter((concept) => {
    const names = [concept.canonicalName, ...concept.aliases].map(normalize);
    if (!names.includes(needle)) return false;
    if (!scopeNeedle) return true;
    return concept.scopes.some((item) => normalize(item) === scopeNeedle);
  });

  if (matches.length === 0) return { status: 'not_found' };
  if (matches.length === 1) return { status: 'resolved', concept: matches[0] };
  return { status: 'ambiguous', concepts: matches };
}
