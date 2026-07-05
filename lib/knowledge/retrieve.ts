import { searchKnowledge } from "@/lib/knowledge/search";
import type { KnowledgeChunk } from "@/lib/knowledge/types";

/** Build RAG context string for Gemini prompts (max ~3k chars). */
export function buildKnowledgeContext(input: {
  cropSlug?: string;
  query?: string;
  state?: string;
  maxChunks?: number;
}): string {
  const chunks = searchKnowledge({
    query: input.query,
    crop: input.cropSlug,
    state: input.state,
    limit: input.maxChunks ?? 6,
  });

  if (chunks.length === 0) return "";

  const body = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.title} (${c.sourceFile}${c.state ? `, ${c.state}` : ""})\n${c.text}`
    )
    .join("\n\n");

  return `AGRIVEDA KNOWLEDGE BASE (ICAR PoP, NFSM, IRAC/HRAC guides — use for accurate doses):\n\n${body}`;
}

export function retrieveTopChunks(input: {
  cropSlug?: string;
  query?: string;
  state?: string;
  limit?: number;
}): KnowledgeChunk[] {
  return searchKnowledge({
    query: input.query,
    crop: input.cropSlug,
    state: input.state,
    limit: input.limit ?? 6,
  });
}
