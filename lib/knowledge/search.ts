import type { KnowledgeChunk, KnowledgeSearchResult, KnowledgeTopic } from "@/lib/knowledge/types";
import { KNOWLEDGE_CHUNKS } from "@/data/knowledge/chunks";

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function searchKnowledge(input: {
  query?: string;
  crop?: string;
  topic?: KnowledgeTopic;
  state?: string;
  limit?: number;
}): KnowledgeSearchResult[] {
  const { query = "", crop, topic, state, limit = 8 } = input;
  const tokens = tokenize(query);

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0;
    const hay = `${chunk.title} ${chunk.text} ${chunk.crops.join(" ")}`.toLowerCase();

    if (crop && chunk.crops.includes(crop)) score += 12;
    if (topic && chunk.topics.includes(topic)) score += 8;
    if (state && chunk.state?.toLowerCase() === state.toLowerCase()) score += 10;

    for (const t of tokens) {
      if (chunk.title.toLowerCase().includes(t)) score += 6;
      if (hay.includes(t)) score += 2;
    }

    if (!query && !crop && !topic && !state) score = 1;

    return { ...chunk, score };
  })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

export function getChunksForCrop(cropSlug: string, limit = 6): KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS.filter((c) => c.crops.includes(cropSlug)).slice(0, limit);
}

export function getAllKnowledgeSources(): string[] {
  return [...new Set(KNOWLEDGE_CHUNKS.map((c) => c.sourceFile))].sort();
}
