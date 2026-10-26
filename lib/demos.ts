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

/** Plain-English names for the Latin/anatomical muscle strings in the Everkinetic data. Test fails if a new one appears unmapped. */
export const MUSCLE_PLAIN: Record<string, string> = {
  "Abdominals": "Abs", "Back": "Back", "Biceps brachii": "Biceps", "Core": "Core", "Deltoid": "Shoulders",
  "Deltoideus (clavicula)": "Front delts", "Erector spinae": "Lower back", "Forearm": "Forearms", "Gastrocnemius": "Calves",
  "Glutaeus maximus": "Glutes", "Hip abductors": "Outer hips", "Ischiocrural muscles": "Hamstrings", "Latissimus dorsi": "Lats",
  "Obliques": "Obliques", "Pectoralis major": "Chest", "Quadriceps": "Quads", "Soleus": "Calves (soleus)", "Trapezius": "Traps",
  "Triceps brachii": "Triceps", "Upper back": "Upper back",
};
export function plainMuscle(m: string) {
  return MUSCLE_PLAIN[m] ?? m.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
/** Map + de-duplicate (two Latin names can share a plain one). */
export const plainMuscles = (ms: string[]) => [...new Set(ms.map(plainMuscle))];
