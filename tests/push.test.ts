import { test } from "node:test";
import assert from "node:assert/strict";
import { idleDueAt, idlePushMessage } from "../lib/idle";

test("idle due = last activity + hours, off when 0", () => {
  const d = { startedAt: "2026-10-26T10:00:00Z", lastActivityAt: "2026-10-26T11:00:00Z" };
  assert.equal(idleDueAt(d, 3)!.toISOString(), "2026-10-26T14:00:00.000Z");
  assert.equal(idleDueAt(d, 0), null);
});
test("push text matches spec", () => {
  const m = idlePushMessage("2026-10-26T10:00:00Z", Date.parse("2026-10-26T14:10:00Z"));
  assert.equal(m.title, "Still working out?");
  assert.equal(m.body, "Your workout has been running 4h. Tap to finish or discard.");
  assert.equal(m.url, "/workout");
  assert.match(idlePushMessage("2026-10-26T10:00:00Z", Date.parse("2026-10-26T13:40:00Z")).body, /running 3\.5h/);
});
