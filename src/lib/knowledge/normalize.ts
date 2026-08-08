import { hashUtf8Sha256, normalizeTextForHash } from './drive-sync';

export type NormalizedKnowledgeUnit = {
  sequence: number;
  unitKind: 'document' | 'section' | 'paragraph' | 'list_item';
  headingPath: readonly string[];
  rawText: string;
  retrievalText: string;
  contentHashSha256: string;
};

function isHeading(line: string): { level: number; text: string } | null {
  const markdown = line.match(/^(#{1,6})\s+(.+)$/);
  if (markdown) return { level: markdown[1].length, text: markdown[2].trim() };

  const numbered = line.match(/^(\d+(?:\.\d+)*)[.)]?\s+(.+)$/);
  if (numbered && numbered[2].length <= 140) {
    return {
      level: Math.min(numbered[1].split('.').length, 6),
      text: `${numbered[1]} ${numbered[2]}`.trim(),
    };
  }
  return null;
}

function isListItem(line: string): boolean {
  return /^\s*(?:[-*•]|\d+[.)])\s+/.test(line);
}

function buildRetrievalText(
  documentTitle: string,
  headingPath: readonly string[],
  rawText: string
): string {
  const context = [documentTitle, ...headingPath].filter(Boolean).join(' > ');
  return context ? `${context}\n${rawText}` : rawText;
}

export function normalizeKnowledgeText(input: {
  documentTitle: string;
  text: string;
}): NormalizedKnowledgeUnit[] {
  const text = normalizeTextForHash(input.text);
  if (!text) return [];

  const lines = text.split('\n');
  const headingStack: string[] = [];
  const units: NormalizedKnowledgeUnit[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const rawText = paragraph.join('\n').trim();
    paragraph = [];
    if (!rawText) return;

    const unitKind = isListItem(rawText.split('\n')[0]) ? 'list_item' : 'paragraph';
    const retrievalText = buildRetrievalText(input.documentTitle, headingStack, rawText);
    units.push({
      sequence: units.length,
      unitKind,
      headingPath: [...headingStack],
      rawText,
      retrievalText,
      contentHashSha256: hashUtf8Sha256(normalizeTextForHash(rawText)),
    });
  };

  for (const originalLine of lines) {
    const line = originalLine.trimEnd();
    const heading = isHeading(line.trim());
    if (heading) {
      flushParagraph();
      headingStack.splice(heading.level - 1);
      headingStack[heading.level - 1] = heading.text;
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    if (isListItem(line) && paragraph.length > 0 && !isListItem(paragraph[0])) {
      flushParagraph();
    }
    paragraph.push(line);
  }
  flushParagraph();

  if (units.length === 0) {
    const retrievalText = buildRetrievalText(input.documentTitle, [], text);
    units.push({
      sequence: 0,
      unitKind: 'document',
      headingPath: [],
      rawText: text,
      retrievalText,
      contentHashSha256: hashUtf8Sha256(text),
    });
  }

  return units;
}
