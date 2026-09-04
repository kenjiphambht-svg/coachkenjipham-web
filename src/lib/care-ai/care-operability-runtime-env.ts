export const CARE_OPERABILITY_RUNTIME_ENV_KEYS = [
  'CARE_META_OPERABILITY_EVENTS_ENABLED',
  'CARE_META_OPERABILITY_HEALTH_ENABLED',
  'CARE_META_OPERABILITY_HEALTH_TOKEN',
  'CARE_META_OPERABILITY_LOOKBACK_MS',
  'CARE_META_OPERABILITY_PENDING_AGE_MS',
] as const;

export type CareOperabilityRuntimeEnvKey = typeof CARE_OPERABILITY_RUNTIME_ENV_KEYS[number];

type RuntimeBindings = Record<string, unknown>;
type ProcessEnvTarget = Record<string, string | undefined>;

export function syncCareOperabilityProcessEnvFromBindings(
  bindings: RuntimeBindings,
  target: ProcessEnvTarget = process.env,
): void {
  for (const key of CARE_OPERABILITY_RUNTIME_ENV_KEYS) {
    const value = bindings[key];
    if (typeof value === 'string') target[key] = value;
    else delete target[key];
  }
}

export async function hydrateCareOperabilityProcessEnv(): Promise<void> {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare');
  const { env } = await getCloudflareContext({ async: true });
  syncCareOperabilityProcessEnvFromBindings(env as unknown as RuntimeBindings);
}
