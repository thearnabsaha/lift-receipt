import { test } from "node:test";
import assert from "node:assert/strict";
import { EXERCISE_VIDEOS } from "../lib/data/exercise-videos";
import { BUILTIN_EXERCISES, builtinId } from "../lib/data/exercises";

test("exercise video data integrity", () => {
  const ids = new Set(BUILTIN_EXERCISES.map(([n]) => builtinId(n)));
  const seen = new Map<string, string>();
  for (const [k, vs] of Object.entries(EXERCISE_VIDEOS)) {
    assert.ok(ids.has(k), `unknown exercise ${k}`);
    assert.ok(vs.length >= 1 && vs.length <= 3, `${k} count`);
    for (const v of vs) {
      assert.match(v.videoId, /^[A-Za-z0-9_-]{11}$/, `${k} id`);
      assert.ok(v.title.trim() && v.channel.trim(), `${k} meta`);
      assert.ok(!seen.has(v.videoId), `${v.videoId} duplicated in ${k} and ${seen.get(v.videoId)}`);
      seen.set(v.videoId, k);
    }
  }
});
