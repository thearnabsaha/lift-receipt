import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCalendar, monthGrid, shiftMonth, weekOf, weekStreaks } from "../lib/calendar";

const at = (iso: string, volume = 1000) => ({ startedAt: new Date(iso), volume });

test("weekOf is Monday-first", () => {
  assert.equal(weekOf("2026-10-26"), "2026-10-26"); // Mon
  assert.equal(weekOf("2026-11-01"), "2026-10-26"); // Sun
  assert.equal(weekOf("2026-01-01"), "2025-12-29"); // across year
});

test("monthGrid pads to whole Monday-first weeks", () => {
  const g = monthGrid("2026-10"); // Oct 1 2026 is a Thursday
  assert.equal(g.length % 7, 0);
  assert.deepEqual(g.slice(0, 4), [null, null, null, "2026-10-01"]);
  assert.equal(g.filter(Boolean).length, 31);
  assert.equal(monthGrid("2026-02").filter(Boolean).length, 28);
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
});

test("days bucket in the user's tz near midnight", () => {
  // 2026-10-25T19:00Z = 00:30 Mon 26 Oct in Kolkata, still Sun 25 in UTC
  const c = buildCalendar([at("2026-10-25T19:00:00Z")], "Asia/Kolkata", new Date("2026-10-27T06:00:00Z"));
  assert.deepEqual(Object.keys(c.days), ["2026-10-26"]);
  assert.equal(c.thisWeek, 1);
  const u = buildCalendar([at("2026-10-25T19:00:00Z")], "UTC", new Date("2026-10-27T06:00:00Z"));
  assert.deepEqual(Object.keys(u.days), ["2026-10-25"]);
  assert.equal(u.thisWeek, 0); // Sunday belongs to the previous week
  assert.equal(u.currentStreak, 1); // last week still keeps the streak alive
});

test("this week counts at the Sunday→Monday boundary in tz", () => {
  // now = Mon 00:10 in New York (DST ended Nov 1 2026)
  const now = new Date("2026-11-02T05:10:00Z");
  const c = buildCalendar([at("2026-11-02T05:05:00Z"), at("2026-11-02T04:50:00Z")], "America/New_York", now);
  assert.equal(c.today, "2026-11-02");
  assert.equal(c.thisWeek, 1);
  assert.equal(c.days["2026-11-01"].count, 1);
});

test("weekly streaks: current, alive through last week, broken, longest", () => {
  const s = new Set(["2026-09-28", "2026-10-05", "2026-10-12", "2026-08-03", "2026-08-10", "2026-08-17", "2026-08-24"]);
  assert.deepEqual(weekStreaks(s, "2026-10-19"), { current: 3, longest: 4 });
  assert.deepEqual(weekStreaks(s, "2026-10-12"), { current: 3, longest: 4 });
  assert.deepEqual(weekStreaks(s, "2026-10-26"), { current: 0, longest: 4 });
  assert.deepEqual(weekStreaks(new Set(["2025-12-29", "2026-01-05"]), "2026-01-05"), { current: 2, longest: 2 }); // year boundary
  assert.deepEqual(weekStreaks(new Set(), "2026-01-05"), { current: 0, longest: 0 });
});

test("multiple workouts per day aggregate; intensity terciles", () => {
  const ws = [at("2026-10-01T10:00Z", 100), at("2026-10-01T18:00Z", 100), at("2026-10-02T10:00Z", 5000), at("2026-10-03T10:00Z", 1000), at("2026-10-04T10:00Z", 0)];
  const c = buildCalendar(ws, "UTC", new Date("2026-10-04T12:00Z"));
  assert.equal(c.days["2026-10-01"].count, 2);
  assert.equal(c.days["2026-10-01"].volume, 200);
  assert.equal(c.days["2026-10-02"].level, 3);
  assert.equal(c.days["2026-10-04"].level, 1); // bodyweight-only day still marked
  assert.equal(c.activeWeeks, 1);
});
