// Exercise demos (Everkinetic line drawings, CC BY-SA 4.0). Pure types + helpers; data lives in lib/data/demos.json
// (server import) and public/demos/index.json (lazily fetched by the client sheet). Built by scripts/build-demos.py.
export type Demo = { src: string; title: string; frames: string[]; steps: string[]; primary: string[]; secondary: string[] };
export type DemoIndex = Record<string, Demo>;
export const DEMO_CREDIT = { name: "Everkinetic", url: "https://github.com/everkinetic/data", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

/** Steps from Everkinetic often start with a primer sentence ("This is an exercise for…"); drop it, the muscles row says that. */
export function cleanSteps(steps: string[]) {
  return steps.filter((s) => !/^this is an? .*exercise/i.test(s)).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
}

let cache: Promise<DemoIndex> | null = null;
export function loadDemoIndex(): Promise<DemoIndex> {
  if (!cache) cache = fetch("/demos/index.json").then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).catch((e) => { cache = null; throw e; });
  return cache;
}
