import { test } from "node:test";
import assert from "node:assert/strict";
import { formatIdle, idleEndTime, idleMs, isIdle, lastActivity, parseIdleHours } from "../lib/idle";
const H = 3_600_000, start = "2026-10-25T10:00:00.000Z", t0 = Date.parse(start);
test("lastActivity falls back to start and never precedes it", () => {
  assert.equal(lastActivity({ startedAt: start }), t0);
  assert.equal(lastActivity({ startedAt: start, lastActivityAt: "garbage" }), t0);
  assert.equal(lastActivity({ startedAt: start, lastActivityAt: "2026-10-25T09:00:00.000Z" }), t0);
  assert.equal(lastActivity({ startedAt: start, lastActivityAt: "2026-10-25T11:00:00.000Z" }), t0 + H);
});
test("isIdle thresholds", () => {
  const d = { startedAt: start, lastActivityAt: new Date(t0 + H).toISOString() };
  assert.equal(isIdle(d, 3, t0 + 3.99 * H), false);
  assert.equal(isIdle(d, 3, t0 + 4 * H), true);
  assert.equal(isIdle(d, 0, t0 + 100 * H), false);
  assert.equal(idleMs(d, t0), 0);
});
test("idleEndTime uses last activity", () => {
  assert.equal(idleEndTime({ startedAt: start, lastActivityAt: "2026-10-25T10:45:00.000Z" }), "2026-10-25T10:45:00.000Z");
});
test("formatIdle + parseIdleHours", () => {
  assert.equal(formatIdle(3 * H), "3 hours"); assert.equal(formatIdle(1.2 * H), "1 hour"); assert.equal(formatIdle(2.6 * H), "2.5 hours");
  assert.equal(formatIdle(12.7 * H), "12 hours"); assert.equal(formatIdle(50 * H), "2 days");
  assert.equal(parseIdleHours(null), 3); assert.equal(parseIdleHours("0"), 0); assert.equal(parseIdleHours("6"), 6); assert.equal(parseIdleHours("5"), 3);
});
