#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const HUMAN_EVENTS = new Set([
  'ACK_SENT',
  'ACK_ERROR',
  'REVIEWED',
  'QUALIFIED',
  'HANDOFF_READY',
  'HANDOFF_ERROR',
  'HANDED_OFF',
  'FOLLOWUP_SUPPRESSED',
]);

function fail(code) {
  console.error(code);
  process.exit(1);
}

function valueFor(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function bounded(value, max) {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url) fail('ADVISORY_OPS_SUPABASE_URL_MISSING');
if (!key) fail('ADVISORY_OPS_SERVICE_ROLE_KEY_MISSING');

const client = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-essence-runtime': 'advisory-ops-server',
    },
  },
});

const command = process.argv[2];

if (command === 'list') {
  const rawLimit = valueFor('--limit');
  const parsed = rawLimit == null ? 50 : Number.parseInt(rawLimit, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
    fail('ADVISORY_OPS_LIMIT_INVALID');
  }

  const { data, error } = await client.rpc('advisory_intake_list_pending', {
    p_limit: parsed,
  });
  if (error) fail('ADVISORY_OPS_PENDING_READ_FAILED');
  process.stdout.write(`${JSON.stringify(data ?? [], null, 2)}\n`);
  process.exit(0);
}

if (command === 'append') {
  if (!process.argv.includes('--confirm-write')) {
    fail('ADVISORY_OPS_EXPLICIT_WRITE_CONFIRMATION_REQUIRED');
  }

  const intakeId = bounded(valueFor('--intake'), 64);
  const eventType = bounded(valueFor('--event'), 64);
  const correlation = bounded(valueFor('--correlation'), 300);
  const eventCode = bounded(valueFor('--code'), 120);
  const target = bounded(valueFor('--target'), 300);
  const actor = bounded(process.env.ADVISORY_OPERATOR_ACTOR, 200);

  if (!intakeId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(intakeId)) {
    fail('ADVISORY_OPS_INTAKE_ID_INVALID');
  }
  if (!eventType || !HUMAN_EVENTS.has(eventType)) {
    fail('ADVISORY_OPS_EVENT_NOT_OPERATOR_WRITABLE');
  }
  if (!correlation) fail('ADVISORY_OPS_CORRELATION_REQUIRED');
  if (!actor) fail('ADVISORY_OPS_ACTOR_REQUIRED');
  if (eventType === 'HANDED_OFF' && !target) {
    fail('ADVISORY_OPS_HANDOFF_TARGET_REQUIRED');
  }

  const { data, error } = await client.rpc('advisory_intake_append_lifecycle', {
    p_intake_event_id: intakeId,
    p_event_type: eventType,
    p_correlation_reference: correlation,
    p_event_code: eventCode,
    p_actor_reference: actor,
    p_target_reference: target,
  });
  if (error) {
    const safeCode = typeof error.message === 'string' && /^[A-Z0-9_]+$/.test(error.message)
      ? error.message
      : 'ADVISORY_OPS_APPEND_FAILED';
    fail(safeCode);
  }

  const row = Array.isArray(data) ? data[0] : data;
  process.stdout.write(`${JSON.stringify({
    status: 'accepted',
    lifecycleEventId: row?.lifecycle_event_id ?? null,
    replayed: row?.replayed === true,
  })}\n`);
  process.exit(0);
}

fail('ADVISORY_OPS_COMMAND_INVALID');
