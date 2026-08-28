import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormEvent, useMemo, useState } from 'react';
import { MODEL_QUALITY_GOLDENS, MODEL_QUALITY_SCENARIOS } from '../lib/care-ai/model-quality-corpus';

type Provider = 'openai_responses' | 'openai_compatible_chat' | 'anthropic_messages' | 'google_gemini';
type Channel = 'website' | 'facebook_messenger' | 'instagram';

interface TestResult {
  fixtureId?: string | null;
  turns?: string[];
  inbound?: { channel: Channel; sender: string; rawKind: string };
  config?: { provider: Provider; model: string; baseUrl: string | null };
  guardMode?: 'DETERMINISTIC_FIXTURE_GUARD' | 'MODEL_ONLY_FREEFORM_SYNTHETIC';
  decision?: {
    family: string;
    truthStatus: string;
    nextBestCare: string;
    commercialReadiness: string;
    memoryDecision: string;
    handoffRequired: boolean;
    reply: string;
  };
  evaluation?: {
    hardFails: string[];
    comparisonNotes: string[];
    expected: Record<string, string>;
    autoVerdict: string;
    note: string;
  } | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const enabled = process.env.CARE_AI_TEST_UI_ENABLED === 'true';
  const accessGateConfigured = Boolean(process.env.CARE_AI_TEST_ACCESS_TOKEN);
  if (!enabled || !accessGateConfigured) return { notFound: true };
  return { props: {} };
};

const providerDefaults: Record<Provider, { model: string; baseUrl: string }> = {
  openai_responses: { model: '', baseUrl: '' },
  openai_compatible_chat: { model: '', baseUrl: '' },
  anthropic_messages: { model: '', baseUrl: '' },
  google_gemini: { model: '', baseUrl: '' },
};

const fixtures = [...MODEL_QUALITY_SCENARIOS, ...MODEL_QUALITY_GOLDENS];

export default function CareAiTestPage() {
  const [accessToken, setAccessToken] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<Provider>('openai_responses');
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [channel, setChannel] = useState<Channel>('website');
  const [fixtureId, setFixtureId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const needsBaseUrl = provider === 'openai_compatible_chat';
  const selectedFixture = useMemo(() => fixtures.find((item) => item.id === fixtureId), [fixtureId]);
  const channelLabel = useMemo(() => ({
    website: 'Website',
    facebook_messenger: 'Facebook Messenger',
    instagram: 'Instagram',
  })[channel], [channel]);

  function changeProvider(next: Provider) {
    setProvider(next);
    setModel(providerDefaults[next].model);
    setBaseUrl(providerDefaults[next].baseUrl);
    setResult(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-care-test-token': accessToken,
      };
      const response = await fetch('/api/internal/care-ai-test', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          provider,
          model,
          baseUrl: baseUrl || undefined,
          apiKey,
          channel,
          fixtureId: fixtureId || undefined,
          message: fixtureId ? undefined : message,
        }),
      });
      const payload = (await response.json()) as TestResult;
      setResult(payload);
    } catch {
      setResult({ error: 'CARE_TEST_NETWORK_ERROR' });
    } finally {
      setLoading(false);
      setApiKey('');
    }
  }

  return (
    <>
      <Head><title>Kenji Care AI — Founder Test Console</title></Head>
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '32px 20px 64px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Kenji Care AI — Founder Test Console</h1>
        <p>Synthetic/admin test only. Trang này chỉ tồn tại khi explicit test gate và access token đã được cấu hình. Không có Production action hoặc Meta outbound send từ console này.</p>
        <p><strong>Guard note:</strong> 40+10 canonical fixtures dùng deterministic Care guard. Freeform hiện chỉ là model-output sandbox để Founder/P09 xem nội dung, chưa phải Production Care authority.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
          <label>
            Test access token
            <input type="password" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} autoComplete="off" style={{ display: 'block', width: '100%', padding: 10 }} />
          </label>

          <label>
            Channel simulator
            <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)} style={{ display: 'block', width: '100%', padding: 10 }}>
              <option value="website">Website</option>
              <option value="facebook_messenger">Facebook Messenger</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>

          <label>
            Model API family
            <select value={provider} onChange={(e) => changeProvider(e.target.value as Provider)} style={{ display: 'block', width: '100%', padding: 10 }}>
              <option value="openai_responses">OpenAI Responses</option>
              <option value="openai_compatible_chat">OpenAI-compatible endpoint</option>
              <option value="anthropic_messages">Anthropic Messages</option>
              <option value="google_gemini">Google Gemini</option>
            </select>
          </label>

          <label>
            Model name / ID
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="model-id" style={{ display: 'block', width: '100%', padding: 10 }} />
          </label>

          {needsBaseUrl && (
            <label>
              API endpoint URL (HTTPS + server allowlist required)
              <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://provider.example/v1/chat/completions" style={{ display: 'block', width: '100%', padding: 10 }} />
            </label>
          )}

          <label>
            Model API key (ephemeral; bỏ trống nếu server đã có test secret)
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} autoComplete="off" style={{ display: 'block', width: '100%', padding: 10 }} />
          </label>

          <label>
            Test fixture
            <select value={fixtureId} onChange={(e) => { setFixtureId(e.target.value); setResult(null); }} style={{ display: 'block', width: '100%', padding: 10 }}>
              <option value="">Freeform — tự nhập câu khách</option>
              <optgroup label="40 Scenarios">
                {MODEL_QUALITY_SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.turns[0].slice(0, 90)}</option>)}
              </optgroup>
              <optgroup label="10 Golden Conversations">
                {MODEL_QUALITY_GOLDENS.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.turns[0].slice(0, 90)}</option>)}
              </optgroup>
            </select>
          </label>

          {selectedFixture ? (
            <section style={{ padding: 14, border: '1px solid #ccc' }}>
              <strong>{selectedFixture.id} canonical turns</strong>
              {selectedFixture.turns.map((turn, index) => (
                <p key={`${selectedFixture.id}-${index}`}><strong>Turn {index + 1}:</strong> {turn}</p>
              ))}
              <small>Canonical fixture text and deterministic guard are server-side; browser input cannot change the expected case.</small>
            </section>
          ) : (
            <label>
              Synthetic message as {channelLabel}
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Nhập câu khách hàng để test..." style={{ display: 'block', width: '100%', padding: 10 }} />
            </label>
          )}

          <button type="submit" disabled={loading || !accessToken || !model || (!fixtureId && !message.trim())} style={{ padding: '12px 18px' }}>
            {loading ? 'Đang chạy…' : fixtureId ? `Run ${fixtureId}` : 'Run freeform test'}
          </button>
        </form>

        {result && (
          <section style={{ marginTop: 28, borderTop: '1px solid #ccc', paddingTop: 20 }}>
            <h2>Result</h2>
            {result.error ? (
              <p><strong>Error:</strong> {result.error}</p>
            ) : result.decision ? (
              <>
                <p><strong>Fixture:</strong> {result.fixtureId || 'Freeform'}</p>
                <p><strong>Channel:</strong> {result.inbound?.channel}</p>
                <p><strong>Provider/model:</strong> {result.config?.provider} / {result.config?.model}</p>
                <p><strong>Guard mode:</strong> {result.guardMode}</p>
                {result.evaluation && (
                  <div style={{ padding: 14, border: '1px solid #ccc', marginBottom: 16 }}>
                    <p><strong>Auto verdict:</strong> {result.evaluation.autoVerdict}</p>
                    <p><strong>Hard fails:</strong> {result.evaluation.hardFails.length ? result.evaluation.hardFails.join(', ') : '0'}</p>
                    <p><strong>Semantic differences:</strong> {result.evaluation.comparisonNotes.length ? result.evaluation.comparisonNotes.join(' | ') : '0'}</p>
                    <small>{result.evaluation.note}</small>
                  </div>
                )}
                <p><strong>Family:</strong> {result.decision.family}</p>
                <p><strong>Truth:</strong> {result.decision.truthStatus}</p>
                <p><strong>Next Best Care:</strong> {result.decision.nextBestCare}</p>
                <p><strong>Commercial readiness:</strong> {result.decision.commercialReadiness}</p>
                <p><strong>Memory:</strong> {result.decision.memoryDecision}</p>
                <p><strong>Human handoff:</strong> {String(result.decision.handoffRequired)}</p>
                <h3>Customer-facing reply</h3>
                <div style={{ whiteSpace: 'pre-wrap', padding: 16, border: '1px solid #ccc' }}>{result.decision.reply}</div>
              </>
            ) : null}
          </section>
        )}
      </main>
    </>
  );
}
