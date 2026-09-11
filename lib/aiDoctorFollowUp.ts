import { readStorage, writeStorage } from "@/lib/storage";
import { randomId } from "@/lib/randomId";

const KEY = "agriveda-ai-followups";
const FOLLOW_UP_DAYS = 6; // mid of 5–7 day window

export type AiFollowUpStatus = "pending" | "improved" | "same" | "worse" | "dismissed";

export interface AiDoctorFollowUp {
  id: string;
  historyId: string;
  cropSlug: string;
  diseaseName: string;
  createdAt: string;
  dueAt: string;
  status: AiFollowUpStatus;
}

function loadAll(): AiDoctorFollowUp[] {
  return readStorage<AiDoctorFollowUp[]>(KEY, []);
}

function saveAll(items: AiDoctorFollowUp[]) {
  writeStorage(KEY, items.slice(0, 40));
}

/** Schedule a farmer check-in ~6 days after diagnosis (not “was AI accurate?”). */
export function scheduleAiDoctorFollowUp(input: {
  historyId: string;
  cropSlug: string;
  diseaseName: string;
  days?: number;
}): AiDoctorFollowUp {
  const days = input.days ?? FOLLOW_UP_DAYS;
  const due = new Date();
  due.setDate(due.getDate() + days);
  const entry: AiDoctorFollowUp = {
    id: randomId(),
    historyId: input.historyId,
    cropSlug: input.cropSlug,
    diseaseName: input.diseaseName,
    createdAt: new Date().toISOString(),
    dueAt: due.toISOString(),
    status: "pending",
  };
  const next = [entry, ...loadAll().filter((f) => f.historyId !== input.historyId)];
  saveAll(next);
  return entry;
}

export function listDueAiFollowUps(now = Date.now()): AiDoctorFollowUp[] {
  return loadAll().filter(
    (f) => f.status === "pending" && Date.parse(f.dueAt) <= now
  );
}

export function answerAiFollowUp(
  id: string,
  status: Exclude<AiFollowUpStatus, "pending">
): void {
  saveAll(
    loadAll().map((f) => (f.id === id ? { ...f, status } : f))
  );
}

export type AiFollowUpAlert = {
  id: string;
  severity: "info";
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  href: string;
  followUpId: string;
};

export function buildAiFollowUpAlerts(hi: boolean): AiFollowUpAlert[] {
  return listDueAiFollowUps().map((f) => ({
    id: `ai-fu-${f.id}`,
    severity: "info" as const,
    title: hi
      ? `${f.diseaseName} — सुधार हुआ?`
      : `${f.diseaseName} — did it improve?`,
    titleEn: `${f.diseaseName} — did it improve?`,
    body: hi
      ? "5–7 दिन हो गए। खेत देखकर बताएँ — समस्या कम हुई, वैसी ही, या बढ़ी?"
      : "It's been 5–7 days. Did the problem improve, stay same, or get worse?",
    bodyEn:
      "It's been 5–7 days. Did the problem improve, stay same, or get worse?",
    href: "/ai-doctor",
    followUpId: f.id,
  }));
}
