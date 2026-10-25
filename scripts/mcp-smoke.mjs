// Usage: MCP_URL=http://localhost:3000/api/mcp MCP_KEY=lr_... node scripts/mcp-smoke.mjs
const url = process.env.MCP_URL ?? "http://localhost:3000/api/mcp";
const key = process.env.MCP_KEY;
let sid;
async function rpc(method, params, id = Math.floor(Math.random() * 1e6)) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", authorization: `Bearer ${key}`, ...(sid ? { "mcp-session-id": sid } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", id, method, params }) });
  sid = res.headers.get("mcp-session-id") ?? sid;
  const t = await res.text();
  const line = t.split("\n").find((l) => l.startsWith("data:"));
  return { status: res.status, body: line ? JSON.parse(line.slice(5)) : t };
}
const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "smoke", version: "1" } });
console.log("initialize", init.status, JSON.stringify(init.body).slice(0, 200));
await fetch(url, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", authorization: `Bearer ${key}`, ...(sid ? { "mcp-session-id": sid } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) });
const tl = await rpc("tools/list", {});
console.log("tools", tl.status, tl.body.result?.tools?.map((t) => t.name).join(", ") ?? JSON.stringify(tl.body).slice(0, 300));
if (process.argv[2] === "full") {
  const call = async (name, args) => { const r = await rpc("tools/call", { name, arguments: args }); console.log(name, "→", JSON.stringify(r.body.result ?? r.body).slice(0, 300)); return r; };
  await call("log_workout", { name: "MCP Push", unit: "kg", exercises: [{ exercise: "Bench Press (Barbell)", sets: [{ weight: 60, reps: 10, type: "warmup" }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }] }, { exercise: "Overhead Press (Barbell)", sets: [{ weight: 60, reps: 6 }] }] });
  await call("get_stats", {});
  await call("get_personal_records", {});
  await call("log_measurement", { kind: "bodyweight", value: 80, unit: "kg" });
  await call("list_workouts", { limit: 2 });
}
const bad = await fetch(url, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", authorization: "Bearer nope" }, body: "{}" });
console.log("bad key →", bad.status);
