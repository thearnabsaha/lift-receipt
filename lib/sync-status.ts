/** Sync outcome for one queued workout: saved, retry later (network / auth / server hiccup), or rejected by validation (kept, user told). */
export function classifyStatus(status: number | null): "sent" | "retry" | "rejected" {
  if (status == null) return "retry";
  if (status >= 200 && status < 300) return "sent";
  if (status === 401 || status === 403 || status === 408 || status === 429 || status >= 500) return "retry";
  return "rejected";
}

