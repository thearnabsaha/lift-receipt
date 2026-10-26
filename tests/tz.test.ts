import { test } from "node:test";
import assert from "node:assert/strict";
import { mondayOfTz, addWeeks, tzOffsetMin, localDateKey, startOfDay, offsetToTz, isValidTz } from "../lib/tz";
import { mondayOf, recap, summarizeWeek } from "../lib/weekly";

const iso = (d: Date) => d.toISOString();

test("Kolkata: Monday 00:00 IST = Sunday 18:30Z", () => {
  assert.equal(iso(mondayOfTz(new Date("2026-10-28T12:00:00Z"), "Asia/Kolkata")), "2026-10-25T18:30:00.000Z");
  // Sunday 23:00 IST is still the previous week
  assert.equal(iso(mondayOfTz(new Date("2026-10-25T17:30:00Z"), "Asia/Kolkata")), "2026-10-18T18:30:00.000Z");
  // matches legacy fixed-offset implementation
  assert.equal(iso(mondayOf(new Date("2026-10-28T12:00:00Z"), 330)), "2026-10-25T18:30:00.000Z");
});

test("Berlin around DST end (25 Oct 2026, CEST→CET)", () => {
  assert.equal(tzOffsetMin(new Date("2026-10-24T12:00:00Z"), "Europe/Berlin"), 120);
  assert.equal(tzOffsetMin(new Date("2026-10-26T12:00:00Z"), "Europe/Berlin"), 60);
  const prev = mondayOfTz(new Date("2026-10-25T20:00:00Z"), "Europe/Berlin"); // Sun 21:00 CET
  assert.equal(iso(prev), "2026-10-18T22:00:00.000Z"); // Mon 19 Oct 00:00 CEST
  const next = mondayOfTz(new Date("2026-10-26T00:30:00Z"), "Europe/Berlin"); // Mon 01:30 CET
  assert.equal(iso(next), "2026-10-25T23:00:00.000Z"); // Mon 26 Oct 00:00 CET
  assert.equal(iso(addWeeks(prev, 1, "Europe/Berlin")), iso(next)); // 169-hour week
  assert.equal(+next - +prev, 169 * 3600e3);
  assert.equal(localDateKey(new Date("2026-10-25T23:30:00Z"), "Europe/Berlin"), "2026-10-26");
  assert.equal(iso(startOfDay(new Date("2026-10-25T12:00:00Z"), "Europe/Berlin")), "2026-10-24T22:00:00.000Z");
});

test("Berlin around DST start (29 Mar 2026): 167-hour week", () => {
  const a = mondayOfTz(new Date("2026-03-25T12:00:00Z"), "Europe/Berlin");
  const b = addWeeks(a, 1, "Europe/Berlin");
  assert.equal(iso(a), "2026-03-22T23:00:00.000Z");
  assert.equal(iso(b), "2026-03-29T22:00:00.000Z");
});

test("same instant lands in different weeks by zone", () => {
  const t = new Date("2026-12-06T20:00:00Z"); // Mon 01:30 IST, Sun 21:00 CET
  assert.equal(localDateKey(mondayOfTz(t, "Asia/Kolkata"), "Asia/Kolkata"), "2026-12-07");
  assert.equal(localDateKey(mondayOfTz(t, "Europe/Berlin"), "Europe/Berlin"), "2026-11-30");
});

test("helpers", () => {
  assert.ok(isValidTz("Europe/Berlin")); assert.ok(!isValidTz("Mars/Base")); assert.ok(!isValidTz(""));
  assert.equal(offsetToTz(330), "Asia/Kolkata"); assert.equal(offsetToTz(60), "Etc/GMT-1");
  assert.equal(tzOffsetMin(new Date("2026-06-01T00:00:00Z"), "America/New_York"), -240);
});

test("recap uses the user's unit", () => {
  const base = { sessions: 2, volumeKg: 1000, prs: 0, inProgress: true, change: { volume: null }, mostTrained: [], neglected: [], bestLift: null };
  assert.match(recap(base, "kg"), /1,000 kg lifted/);
  assert.match(recap(base, "lb"), /2,205 lb lifted/);
  assert.doesNotMatch(recap(base, "lb"), /kg/);
  const s = summarizeWeek([], mondayOfTz(new Date(), "Europe/Berlin"), () => undefined, new Date(), { tz: "Europe/Berlin", unit: "lb" });
  assert.equal(s.timezone, "Europe/Berlin"); assert.equal(s.unit, "lb");
});
