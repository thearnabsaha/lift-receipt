// Curated YouTube form-tutorial videos per built-in exercise, oEmbed-verified 2026-10-27.
// vertical: true = a real YouTube Short (9:16, /shorts/ID returns 200); others are short landscape tutorials from credible channels.
// Static list: no runtime YouTube API. Rendered via a tap-to-load muted youtube-nocookie embed (components/form-videos.tsx).
export type FormVideo = { videoId: string; title: string; channel: string; vertical?: boolean };
export const EXERCISE_VIDEOS: Record<string, FormVideo[]> = {
  "bi_bench-press-barbell": [
    { videoId: "_FkbD0FhgVE", title: "Perfect Bench Press Form (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "hWbUlkb5Ms4", title: "How To Bench Press With Perfect Technique (5 Steps)", channel: "Jeff Nippard", vertical: true },
    { videoId: "PTzUJkPrrDw", title: "Bench Press Form Guide", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_bench-press-dumbbell": [
    { videoId: "q--6_PuEV_c", title: "20 Second Form Fix: DB Bench Press", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "WbCEvFA0NJs", title: "FIX Your Dumbbell Bench Press (DO THIS INSTEAD!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "YQ2s_Y7g5Qk", title: "Flat Dumbbell Bench Press", channel: "Renaissance Periodization" },
  ],
  "bi_bench-press-smith-machine": [
    { videoId: "zyCKoJ-orXg", title: "Smith Machine Bench Press Variations", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "XFYMLdlaq04", title: "Smith Machine Bench Press Guide", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "O5viuEPDXKY", title: "Smith Machine Bench Press", channel: "Renaissance Periodization" },
  ],
  "bi_incline-bench-press-barbell": [
    { videoId: "2jFFCy8JBU8", title: "How To Do A Barbell Incline Bench Press", channel: "PureGym" },
    { videoId: "PZ7waXzAzZc", title: "Incline Barbell Bench Press - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "BjGLs6KGWUc", title: "How to do a Incline Barbell Bench Press  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_incline-bench-press-dumbbell": [
    { videoId: "jMQA3XtJSgo", title: "Incline Dumbbell Bench Press - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "_NrQUYg7Nlc", title: "How to do a Incline Dumbbell Bench Press", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_decline-bench-press-barbell": [
    { videoId: "LfyQBUKR8SE", title: "How To: Barbell Decline Bench Press", channel: "ScottHermanFitness" },
    { videoId: "WS0PFiKEQJE", title: "Exercise Videos- Barbell Decline Bench Press", channel: "HyperStrike28" },
  ],
  "bi_decline-bench-press-dumbbell": [
    { videoId: "Pf1nDoqx_1A", title: "Decline Dumbbell Bench Press  - Chest Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "2B6WxyLaIrE", title: "Decline Dumbbell Bench Press", channel: "OPEX Fitness" },
  ],
  "bi_chest-press-machine": [
    { videoId: "ZdPjARfCql8", title: "The MOST Important Chest Press Cue!", channel: "Renaissance Periodization", vertical: true },
    { videoId: "Qu7-ceCvq7w", title: "The PERFECT Machine Chest Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "VHIlmOPMWWs", title: "How to Do the PERFECT Machine Chest Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_incline-chest-press-machine": [
    { videoId: "Gruq177Psnk", title: "Incline Chest Press Mistake (STOP DOING THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "TrTSvn5-MTk", title: "Incline Machine Chest Press", channel: "Renaissance Periodization" },
    { videoId: "ArMbAy4emuA", title: "Incline Chest Press Machine", channel: "OPEX Fitness" },
  ],
  "bi_chest-fly-dumbbell": [
    { videoId: "atcyT99YDeI", title: "How To Do The Dumbbell Chest Fly #shorts", channel: "Mind Pump TV", vertical: true },
    { videoId: "bK8cvTA9yP4", title: "Solid Cues For The Dumbbell Chest Fly #shorts", channel: "Mind Pump TV", vertical: true },
    { videoId: "rk8YayRoTRQ", title: "FIX THESE Dumbbell Chest Fly Mistakes!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_incline-chest-fly-dumbbell": [
    { videoId: "bDaIL_zKbGs", title: "How To: Incline Dumbbell Fly || Hit Your Chest HARD!", channel: "ScottHermanFitness" },
    { videoId: "ewkmMvQjhIs", title: "Incline Dumbbell Fly - Chest Exercise", channel: "MyTraining App" },
    { videoId: "U6brZJ0NCIo", title: "Dumbbell Incline Chest Fly", channel: "Women's Strength Nation by Holly Perkins" },
  ],
  "bi_chest-fly-machine": [
    { videoId: "XZg28DIf1oc", title: "How to Perform the PERFECT Machine Chest Fly", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "XFnxc7gOIh8", title: "Chest Fly Machine Variations (KNOW THE DIFFERENCE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "eGjt4lk6g34", title: "How To Use The Chest Fly Machine", channel: "PureGym" },
  ],
  "bi_cable-crossover": [
    { videoId: "QcTcWpkn_bw", title: "How To Do A Cable Fly/ Cable Crossover", channel: "PureGym" },
    { videoId: "XY6JrX1wyxk", title: "How to do a Cable Crossover  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_low-cable-fly": [
    { videoId: "M1N804yWA-8", title: "How To: Low Cable Chest Fly", channel: "ScottHermanFitness" },
    { videoId: "Ub49dt2B2VI", title: "Exercise Index - Low Cable Crossover", channel: "mountaindog1" },
  ],
  "bi_push-up": [
    { videoId: "L-Yd2YpIDkI", title: "You CAN Do Pushups", channel: "Hybrid Calisthenics", vertical: true },
    { videoId: "wD1M-f69Yy8", title: "The Perfect Push-Up Technique", channel: "FitnessFAQs", vertical: true },
    { videoId: "-z5guzTBmr4", title: "Good Push-Up Form", channel: "Testosterone Nation" },
  ],
  "bi_incline-push-up": [
    { videoId: "0CcVzNxrcdc", title: "Incline Pushups", channel: "LivestrongWoman" },
    { videoId: "yAbg3_pJKvw", title: "How To Do An Incline Push Up", channel: "PureGym" },
    { videoId: "Gvm5Q29UHbk", title: "How to do an Incline Push-Up", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_decline-push-up": [
    { videoId: "QBlYp-EwHlo", title: "How To Do A Decline Push Up", channel: "PureGym" },
    { videoId: "aq2xZxfrQlM", title: "How to do a Decline Push-Up", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_chest-dip": [
    { videoId: "YvkF8-zPhoI", title: "Grow Bigger Chest With Dips", channel: "FitnessFAQs", vertical: true },
    { videoId: "2HYAeF6o7Bc", title: "How To Do Chest Dips", channel: "PureGym" },
  ],
  "bi_floor-press-barbell": [
    { videoId: "kqg6nkByPqk", title: "Barbell Floor Press", channel: "Testosterone Nation" },
    { videoId: "YdiVxhxufG8", title: "Barbell Floor Press - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_pullover-dumbbell": [
    { videoId: "F8-z6UV9IIY", title: "Master your dumbbell pullover technique", channel: "FitnessFAQs", vertical: true },
    { videoId: "6yYVcIOAERY", title: "Dumbbell Pullover Variations - Know the Difference!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "FK4rHfWKEac", title: "The Dumbbell Pullover", channel: "Men's Health" },
  ],
  "bi_close-grip-bench-press": [
    { videoId: "xXd7sddHGa0", title: "How to Perform the Perfect Close-Grip Bench Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "WGJyS85Li8o", title: "Close Grip Bench Press Tips with Iain Valliere & Chris Bumstead", channel: "Muscle & Strength", vertical: true },
    { videoId: "g4VkufehmUU", title: "RP Close Grip Bench Press", channel: "Renaissance Periodization" },
  ],
  "bi_deadlift-barbell": [
    { videoId: "ZaTM37cfiDs", title: "How To Deadlift With Perfect Technique (Step By Step)", channel: "Jeff Nippard", vertical: true },
    { videoId: "xNwpvDuZJ3k", title: "✅ The PERFECT Deadlift (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "8np3vKDBJfc", title: "The PERFECT Deadlift (5 Steps)", channel: "Jeremy Ethier", vertical: true },
  ],
  "bi_deadlift-trap-bar": [
    { videoId: "v709aJKv-gM", title: "Trap Bar Deadlift", channel: "Renaissance Periodization" },
    { videoId: "FYx76NSijfU", title: "Trap Bar Deadlift", channel: "OPEX Fitness" },
  ],
  "bi_sumo-deadlift": [
    { videoId: "eUhAJY8HuXs", title: "Nail your sumo deadlift technique! #deadlift #gluteguy #glutelab #shorts #short #fyp", channel: "Bret Contreras Glute Guy", vertical: true },
    { videoId: "pfSMst14EFk", title: "Sumo Deadlift", channel: "Renaissance Periodization" },
    { videoId: "JbY72Him34Q", title: "How To Correctly Perform A Sumo Deadlift", channel: "PureGym" },
  ],
  "bi_rack-pull": [
    { videoId: "d9sK2R95MMM", title: "Rack Pull", channel: "Testosterone Nation" },
    { videoId: "9vYBWV5OeKg", title: "How To Do A Rack Pull", channel: "PureGym" },
  ],
  "bi_bent-over-row-barbell": [
    { videoId: "stBQHqNMpr0", title: "Barbell Bent Over Row", channel: "Testosterone Nation", vertical: true },
    { videoId: "6FZHJGzMFEc", title: "Barbell Bent Over Row", channel: "Renaissance Periodization" },
    { videoId: "qXrTDQG1oUQ", title: "Bent-Over Barbell Row | Proper Form for a Bigger Back", channel: "Moorefitcoach" },
  ],
  "bi_bent-over-row-dumbbell": [
    { videoId: "XFWqAOECeBM", title: "How To Do Alternating Bent Over Rows with Dumbbells #shorts", channel: "Mind Pump TV", vertical: true },
    { videoId: "J__cFtonXHM", title: "How To Do Bent Over Dumbbell Rows #bentoverrow #backworkout  #fitness", channel: "Bodybuilding.com", vertical: true },
    { videoId: "H5UxWAwOXDE", title: "Avoid These 2 Mistakes in Bent over Dumbbell Rows #fitnessmistakes #fitness", channel: "Bodybuilding.com", vertical: true },
  ],
  "bi_pendlay-row": [
    { videoId: "NRKMw60mZYs", title: "Pendlay Row", channel: "Testosterone Nation", vertical: true },
    { videoId: "Wv7f0uIKh8o", title: "How To Do A Pendlay Row", channel: "PureGym" },
    { videoId: "2Z_WBWchbvk", title: "Pendlay Row Demo", channel: "Testosterone Nation" },
  ],
  "bi_t-bar-row": [
    { videoId: "yPis7nlbqdY", title: "T Bar Row", channel: "Renaissance Periodization" },
    { videoId: "GG6EjB3ZVf4", title: "Arnold T-Bar Rows", channel: "MusclePharm Official" },
  ],
  "bi_seated-cable-row": [
    { videoId: "UCXxvVItLoM", title: "Seated Cable Row", channel: "Renaissance Periodization" },
    { videoId: "lJoozxC0Rns", title: "How To Do A Seated Cable Row", channel: "PureGym" },
    { videoId: "4ZbqM_gcgAI", title: "Seated Cable Row", channel: "OPEX Fitness" },
  ],
  "bi_chest-supported-row-dumbbell": [
    { videoId: "2ByilQ4NaAs", title: "The PERFECT Chest-Supported Dumbbell Rows", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "nl2MnK1i504", title: "Thibaudeau Coaches the Chest Supported Dumbbell Row", channel: "Testosterone Nation" },
    { videoId: "9zkP4Cd_cz0", title: "Dumbbell Chest-Supported Row", channel: "Testosterone Nation" },
  ],
  "bi_row-machine": [
    { videoId: "0UBRfiO4zDs", title: "Chest Supported Row", channel: "Renaissance Periodization" },
    { videoId: "_FrrYQxA6kc", title: "Machine Chest Supported Row", channel: "Renaissance Periodization" },
  ],
  "bi_single-arm-row-dumbbell": [
    { videoId: "19PqchNnI5M", title: "How to Single Arm Dumbbell Row", channel: "Mind Pump TV", vertical: true },
    { videoId: "DMo3HJoawrU", title: "Single Arm Supported Dumbbell Row", channel: "Renaissance Periodization" },
    { videoId: "ZRSGpBUVcNw", title: "How To Do Single Arm Dumbbell Rows", channel: "PureGym" },
  ],
  "bi_pull-up": [
    { videoId: "UIcVAVc_OCs", title: "How To Pull-Up Higher", channel: "FitnessFAQs", vertical: true },
    { videoId: "P8s_LRBp9lo", title: "Pick Your Perfect Pull-Up Technique", channel: "FitnessFAQs", vertical: true },
    { videoId: "eDP_OOhMTZ4", title: "The Perfect Pull-Up (FIX THESE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_chin-up": [
    { videoId: "mRy9m2Q9_1I", title: "Proper Chin-Up Form", channel: "KILO Strength Society Education" },
    { videoId: "dYDJpuDiJGc", title: "Chinups: Best Bodyweight Biceps Exercise (3 STEPS!!)", channel: "ATHLEAN-X™" },
    { videoId: "yJuQ4XbXx_w", title: "Chin up | Basics and Progression | Charles R. Poliquin", channel: "Strength Sensei" },
  ],
  "bi_pull-up-assisted": [
    { videoId: "8ygapPMYK1I", title: "Assisted Normal Grip Pullup", channel: "Renaissance Periodization" },
    { videoId: "GdsRZAeeDUc", title: "Assisted Parallel Pullup", channel: "Renaissance Periodization" },
    { videoId: "L4ChTwrXTjc", title: "Assisted Underhand Pullup", channel: "Renaissance Periodization" },
  ],
  "bi_lat-pulldown-cable": [
    { videoId: "bNmvKpJSWKM", title: "✅ The PERFECT Lat Pulldown (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "hnSqbBk15tw", title: "Stop Messing Up Your Lat Pulldowns", channel: "Jeff Nippard", vertical: true },
    { videoId: "SqQxuEpXnF4", title: "Do You Have A Perfect Lat Pulldown? (Find Out)", channel: "Jeff Nippard", vertical: true },
  ],
  "bi_close-grip-lat-pulldown": [
    { videoId: "IjoFCmLX7z0", title: "How To Do A Close Grip Lat Pulldown", channel: "PureGym" },
    { videoId: "8hzVLzu-RJk", title: "Close Grip Lat Pulldown Form | 6 Quick Tips", channel: "nutritioneering" },
  ],
  "bi_straight-arm-pulldown": [
    { videoId: "lnec6DdscJU", title: "How To Do The PERFECT Straight Arm Pulldown", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "hAMcfubonDc", title: "The Perfect Straight Arm Pulldown", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "wcVDItawocI", title: "Straight Arm Pulldown - Back Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
  ],
  "bi_inverted-row": [
    { videoId: "Rx4Uo4zwjKA", title: "How to make inverted rows better", channel: "FitnessFAQs", vertical: true },
    { videoId: "kJ7I_xhyyWM", title: "Inverted Rows Will Transform Your Back", channel: "FitnessFAQs", vertical: true },
    { videoId: "zWIr2fEGpWU", title: "Inverted Row", channel: "Testosterone Nation", vertical: true },
  ],
  "bi_back-extension": [
    { videoId: "QJcT2z48jyA", title: "How to set up back extensions", channel: "Alan Thrall (Untamed Strength)", vertical: true },
    { videoId: "Tb9yp81fI9s", title: "Back Extension Technique", channel: "Testosterone Nation" },
    { videoId: "ZaLvgeHC_54", title: "Roman Chair Back Extension", channel: "OPEX Fitness" },
  ],
  "bi_good-morning": [
    { videoId: "YA-h3n9L4YU", title: "The Good Morning", channel: "CrossFit" },
    { videoId: "Daq-wJMUnes", title: "How to Do the Good Mornings", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "0Syp9iyINZ4", title: "Good Mornings Tutorial - Proper Form and Technique", channel: "Runna" },
  ],
  "bi_shrug-barbell": [
    { videoId: "D-coy6tq_-I", title: "How To Do Barbell Shrugs #fitness", channel: "Mind Pump TV", vertical: true },
    { videoId: "9xGqgGFAtiM", title: "Barbell Shrug - Shoulder Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "M_MjF5Nm_h4", title: "Barbell Shrug", channel: "Renaissance Periodization" },
  ],
  "bi_shrug-dumbbell": [
    { videoId: "VkZQsM7ZfsI", title: "Fix Your Dumbbell Shrugs!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "_t3lrPI6Ns4", title: "Dumbbell Shrug", channel: "Renaissance Periodization" },
    { videoId: "GH_l85Ky3vA", title: "Dumbbell Lean Shrug", channel: "Renaissance Periodization" },
  ],
  "bi_face-pull": [
    { videoId: "sHSY0Ao8QHs", title: "The RIGHT Way To  Do Face Pulls (Feat. Andrew Huberman)", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "ywQsaOTRjzM", title: "✅ Do Face Pulls LIKE THIS!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "eTCBSFlCJ_s", title: "How to do a Face Pull | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_meadows-row": [
    { videoId: "sRRQgK8Fm44", title: "Meadows Row", channel: "Testosterone Nation" },
    { videoId: "pXou8yx4INA", title: "Meadows row with Lat90 attachment", channel: "mountaindog1" },
    { videoId: "rFJbO8XSWjw", title: "Meadows Row", channel: "Nick McClary, DPT, CSCS" },
  ],
  "bi_seal-row": [
    { videoId: "4H2ItXwUTp8", title: "Seal Row", channel: "Renaissance Periodization" },
    { videoId: "KqbGIs16oAk", title: "Seal Row", channel: "Testosterone Nation" },
    { videoId: "fBgDGkfT8Rc", title: "Exercise Index - Seal Rows", channel: "mountaindog1" },
  ],
  "bi_overhead-press-barbell": [
    { videoId: "zoN5EH50Dro", title: "Perfect Overhead Press Form (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "4LBVP2Oe7fg", title: "✅ The PERFECT Barbell Overhead Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "KP1sYz2VICk", title: "How to do the BARBELL OVERHEAD 'MILITARY' PRESS! | 2 Minute Tutorial", channel: "Max Euceda" },
  ],
  "bi_overhead-press-dumbbell": [
    { videoId: "b132W5N8Jrg", title: "Dumbbell Overhead Press", channel: "Testosterone Nation", vertical: true },
    { videoId: "Did01dFR3Lk", title: "Dumbbell Overhead Press - How To", channel: "Bobby Maximus" },
  ],
  "bi_seated-overhead-press-dumbbell": [
    { videoId: "qybgyITCwcI", title: "Seated Overhead Press MISTAKE (DO THIS INSTEAD!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "b5JzUH8gsOg", title: "How to Do Seated Overhead Dumbbell Press | Arm Workout", channel: "Howcast" },
  ],
  "bi_shoulder-press-machine": [
    { videoId: "t2SmvH1iGjg", title: "3 Tips for the PERFECT Shoulder Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "Gkk-6q7Rq-s", title: "How to Perform the Machine Shoulder Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "WvLMauqrnK8", title: "Machine Shoulder Press", channel: "Renaissance Periodization" },
  ],
  "bi_arnold-press": [
    { videoId: "AjB-UXErljM", title: "The PERFECT Arnold Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "wRlIuexTowA", title: "Arnold Press Secrets: Avoid This Common Mistake for Maximum Results!", channel: "Bodybuilding.com", vertical: true },
    { videoId: "jeJttN2EWCo", title: "How To Do The Arnold Press", channel: "PureGym" },
  ],
  "bi_push-press": [
    { videoId: "iaBVSJm78ko", title: "The Push Press", channel: "CrossFit" },
    { videoId: "4DklYEgBLh0", title: "CrossFit - Coaching the Push Press with Miranda Oldroyd", channel: "CrossFit" },
    { videoId: "ep30avTSMB0", title: "How to Perform the PUSH PRESS  - Shoulder Exercise Tutorial", channel: "Buff Dudes Workouts" },
  ],
  "bi_lateral-raise-dumbbell": [
    { videoId: "sS77YMMLX-8", title: "Stop Doing DB Lateral Raises Like This! (SAVE A FRIEND)", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "JZNH_luANPY", title: "The Only Dumbbell Lateral Raise Tutorial You Need #lateralraise #workouttips", channel: "Bodybuilding.com", vertical: true },
    { videoId: "DuAaDnVhtZU", title: "Dumbbell Lateral Raise Mistake (STOP DOING THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_lateral-raise-cable": [
    { videoId: "JlT2xB92lY8", title: "Cable Lateral Raise Complete Guide", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "9ilIKuy6B0g", title: "🛑 STOP Making This Cable Lateral Raise Mistake!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "lq7eLC30b9w", title: "Leaning Cable Lateral Raise", channel: "Renaissance Periodization" },
  ],
  "bi_lateral-raise-machine": [
    { videoId: "xMEs3zEzS8s", title: "Lateral Raise Machine", channel: "My PT Hub" },
    { videoId: "0o07iGKUarI", title: "Machine Lateral Raise", channel: "Renaissance Periodization" },
    { videoId: "siazAOww2Tc", title: "Life Fitness Pro2 Lateral Raise Instructions", channel: "Life Fitness / Hammer Strength" },
  ],
  "bi_front-raise-dumbbell": [
    { videoId: "hRJ6tR5-if0", title: "Dumbbell Front Raise", channel: "Renaissance Periodization" },
    { videoId: "zkP0MsTcIVU", title: "How To Do A Dumbbell Front Raise", channel: "PureGym" },
    { videoId: "sOcYlBI85hc", title: "Dumbbell Front Raise - Shoulders Exercise", channel: "MyTraining App" },
  ],
  "bi_front-raise-plate": [
    { videoId: "eJ_HNftboic", title: "❌ Front Raise Mistake", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "HN8HYJTOl8c", title: "How To Do Front Plate Raises", channel: "PureGym" },
  ],
  "bi_reverse-fly-dumbbell": [
    { videoId: "WMaeSekozCM", title: "Dumbbell Reverse Flyes: A Simple Tutorial", channel: "Davis Diley" },
    { videoId: "JoCRRZ3zRtI", title: "How to: Dumbbell Reverse Fly", channel: "HybridFitness" },
    { videoId: "buuYPLVXsJg", title: "How to PROPERLY Dumbbell Rear Delt Fly | Reverse Dumbbell Fly Tutorial", channel: "Colossus Fitness" },
  ],
  "bi_reverse-fly-machine": [
    { videoId: "ZzeiSNGJOeE", title: "❌ Reverse Machine Fly Mistake", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "5YK4bgzXDp0", title: "Machine Reverse Flye", channel: "Renaissance Periodization" },
  ],
  "bi_upright-row-barbell": [
    { videoId: "um3VVzqunPU", title: "Barbell Upright Row", channel: "Renaissance Periodization" },
    { videoId: "FMhKUd0BlB4", title: "Barbell Upright Rows", channel: "The Barbell Physio" },
  ],
  "bi_landmine-press": [
    { videoId: "gH7PDepHNck", title: "This Landmine Press Tutorial Is GOLD!🤩", channel: "Squat University", vertical: true },
    { videoId: "6sH6vyWduNU", title: "How To Do A Landmine Chest Press", channel: "PureGym" },
    { videoId: "t9GuiNQo1O4", title: "How To Do The Landmine Shoulder Press", channel: "Ian Nimblett" },
  ],
  "bi_handstand-push-up": [
    { videoId: "h0HjqYRlXYg", title: "Master the Handstand Push Up - HSPU Tutorial", channel: "Calisthenicmovement" },
    { videoId: "uZWjFe4fufA", title: "How to HANDSTAND PUSHUP | Beginner Tutorial", channel: "FitnessFAQs" },
  ],
  "bi_band-pull-apart": [
    { videoId: "MpyEGXCLS8M", title: "Band Pull-Apart", channel: "Testosterone Nation", vertical: true },
    { videoId: "eZwnwWMkEL4", title: "Band Pull-Apart Exercise | Onnit Tutorials", channel: "Onnit" },
    { videoId: "pASXdGKh-nc", title: "Band Pull Apart - Opex Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_bicep-curl-barbell": [
    { videoId: "54x2WF1_Suc", title: "The Perfect Barbell Bicep Curl (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "dDI8ClxRS04", title: "Barbell Curl - Biceps Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "JnLFSFurrqQ", title: "Barbell Curl Normal Grip", channel: "Renaissance Periodization" },
  ],
  "bi_bicep-curl-dumbbell": [
    { videoId: "iixND1P2lik", title: "Alternating Dumbbell Curl", channel: "Renaissance Periodization" },
    { videoId: "cBSD6mQIPQk", title: "Dumbbell Bicep Curl | Nuffield Health", channel: "Nuffield Health" },
    { videoId: "MtXdEcW3Eog", title: "How To Double Arm Curl (Dumbbell Bicep Curl)", channel: "PureGym" },
  ],
  "bi_bicep-curl-cable": [
    { videoId: "CrbTqNOlFgE", title: "✅ The PERFECT Cable Bicep Curl", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "GNlopToAZyg", title: "How To Do A Cable Curl", channel: "PureGym" },
    { videoId: "rfRdD5PKrko", title: "Cable Bicep Curl", channel: "TurnFit - Vancouver Personal Trainers" },
  ],
  "bi_ez-bar-curl": [
    { videoId: "d2r5TCqnR4Y", title: "Do EZ Bar Curls Like This (IMPORTANT)", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "cdmnvo3augg", title: "EZ Bar Curl Narrow Grip", channel: "Renaissance Periodization" },
    { videoId: "-gSM-kqNlUw", title: "EZ Bar Curl - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_hammer-curl-dumbbell": [
    { videoId: "CFBZ4jN1CMI", title: "How to do a Dumbbell Hammer Curl", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "RIEMoYL_h1Y", title: "Dumbbell Hammer Curl - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "P5sXHLmXmBM", title: "Dumbbell Hammer Curls", channel: "Nikkiey Stott" },
  ],
  "bi_preacher-curl-ez-bar": [
    { videoId: "sxA__DoLsgo", title: "EZ Bar Preacher Curl", channel: "Renaissance Periodization" },
    { videoId: "dgaJQXa0kbg", title: "EZ Bar Preacher Curl", channel: "OPEX Fitness" },
  ],
  "bi_preacher-curl-machine": [
    { videoId: "7ixqAPO6JvU", title: "FIX Your Preacher Curls (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "WyAVZn6_PIY", title: "✅ PERFECT Preacher Curl Form", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "Ja6ZlIDONac", title: "Machine Preacher Curl", channel: "Renaissance Periodization" },
  ],
  "bi_incline-curl-dumbbell": [
    { videoId: "pOzUUZI2-d0", title: "How To Do Incline Dumbbell Curl", channel: "Mind Pump TV", vertical: true },
    { videoId: "A8RyF2x4SSA", title: "Proper Way For Incline Dumbbell Curl IG jake.beast", channel: "Bodybuilding.com", vertical: true },
    { videoId: "aTYlqC_JacQ", title: "Incline Dumbbell Curl", channel: "Renaissance Periodization" },
  ],
  "bi_concentration-curl": [
    { videoId: "I_bKCYL2nL8", title: "DO THIS on the Concentration Curl", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "EjUnEEfTSEY", title: "❌ Concentration Curl Mistakes You Need To FIX", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "llD6MImgqe8", title: "How To Do Concentration Curls", channel: "PureGym" },
  ],
  "bi_spider-curl": [
    { videoId: "PWhIhFut6Tc", title: "Spider curls", channel: "mountaindog1" },
    { videoId: "i-MkPLU82Cw", title: "Spider Curl", channel: "Testosterone Nation" },
    { videoId: "9Dd8iiEUs_Q", title: "How To Do Spider Curls", channel: "PureGym" },
  ],
  "bi_cable-rope-hammer-curl": [
    { videoId: "7Tw9fpb5mOo", title: "Cable Rope Hammer Curl Tutorial", channel: "Prep Coach UK" },
    { videoId: "iOwrtesXiDw", title: "Cable Rope Hammer Curls", channel: "Nikkiey Stott" },
  ],
  "bi_bayesian-curl": [
    { videoId: "w3sXATQzGvc", title: "✅ The PERFECT Bayesian Curl (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "oAlhGm6_Qh4", title: "Bayesian Curl Complete Guide", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "goqxi_ea8Do", title: "How to do Bayesian Curl", channel: "KM" },
  ],
  "bi_reverse-curl-ez-bar": [
    { videoId: "O2nSoaUSGUQ", title: "Reverse EZ Bar Curl - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "jKK_Q_hzNdc", title: "Reverse Grip EZ Bar Curls Narrow", channel: "My PT Hub" },
  ],
  "bi_triceps-pushdown-cable": [
    { videoId: "1FjkhpZsaxc", title: "The Perfect Triceps Pushdown (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "rGI88vZdArg", title: "🚫 Stop Messing Up Your Triceps Pushdowns!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "-zLyUAo1gMw", title: "How to do the CABLE TRICEP PUSHDOWN! | 2 Minute Tutorial", channel: "Max Euceda" },
  ],
  "bi_triceps-rope-pushdown": [
    { videoId: "e5aj8hhCPkA", title: "Rope Triceps Pushdown", channel: "Testosterone Nation" },
    { videoId: "-xa-6cQaZKY", title: "Rope Pushdown", channel: "Renaissance Periodization" },
    { videoId: "vB5OHsJ3EME", title: "How To: Rope Push-Down", channel: "ScottHermanFitness" },
  ],
  "bi_overhead-triceps-extension-cable": [
    { videoId: "oZ1MbUl-_-w", title: "✅ Do Overhead Cable Tricep Extensions LIKE THIS!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "1u18yJELsh0", title: "Cable Overhead Triceps Extension", channel: "Renaissance Periodization" },
    { videoId: "ns-RGsbzqok", title: "Overhead Cable Tricep Extension", channel: "ChadMollickDotCom" },
  ],
  "bi_overhead-triceps-extension-dumbbell": [
    { videoId: "b_r_LW4HEcM", title: "✅ The PERFECT Overhead DB Tricep Extension", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "J565P8FzJXA", title: "Overhead Dumbbell Triceps Extension Guide", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "a9oPnZReIRE", title: "Dumbbell Overhead Tricep Extension - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_skullcrusher-ez-bar": [
    { videoId: "eluOhtYkm-0", title: "EZ Bar Skull Crusher - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "r63Xtw-RabY", title: "Narrow Grip EZ Bar Skullcrushers", channel: "My PT Hub" },
    { videoId: "D47mYdoKllE", title: "EZ Bar Skull Crushers - Triceps Exercise", channel: "MyTraining App" },
  ],
  "bi_skullcrusher-dumbbell": [
    { videoId: "jPjhQ2hsAds", title: "Dumbbell Skullcrusher", channel: "Renaissance Periodization" },
    { videoId: "rIvTWKxQQOk", title: "Dumbbell Skull Crusher", channel: "Testosterone Nation" },
    { videoId: "jO2Jl9eZpXk", title: "Dumbbell Skull Crusher - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_triceps-dip": [
    { videoId: "dM400jrR8fw", title: "Tricep Dips Are Ruining Your Shoulders!", channel: "FitnessFAQs", vertical: true },
    { videoId: "ywtWzO8YVUc", title: "Dip Like This For Bigger Triceps", channel: "FitnessFAQs", vertical: true },
    { videoId: "Nj1Irhs0nlA", title: "5 New Dips for Big Triceps and Pecs #dips #pecsworkout", channel: "Testosterone Nation", vertical: true },
  ],
  "bi_bench-dip": [
    { videoId: "4ua3MzaU0QU", title: "✅ The PERFECT Bench Dip!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "jkTKsIME3Go", title: "The PERFECT Bench Dip", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "WVeZDBhZwLA", title: "How to do a Bench Dip  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_triceps-kickback": [
    { videoId: "WhBxKbe1-NU", title: "✅ The PERFECT Triceps Kickback", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "rCp0ttMPflc", title: "The Chest-Supported Triceps Kickback", channel: "Testosterone Nation" },
    { videoId: "JPmbMOu4IYw", title: "How To Do A Tricep Kickback", channel: "PureGym" },
  ],
  "bi_diamond-push-up": [
    { videoId: "PPTj-MW2tcs", title: "✅ How to Do the Perfect Diamond Push-Up #shorts", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "K8bKxVcwjrk", title: "How To Do A Diamond Push up", channel: "PureGym" },
  ],
  "bi_jm-press": [
    { videoId: "Tih5iHyELsE", title: "JM Press", channel: "Renaissance Periodization" },
    { videoId: "qPyPCQnwsd8", title: "JM Press - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "1qEZaOeqfgg", title: "JM Press", channel: "The Barbell Physio" },
  ],
  "bi_triceps-extension-machine": [
    { videoId: "1AFJTda1btg", title: "The PERFECT Machine Triceps Extension", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "Bx8ga1BLHLE", title: "Machine Triceps Extension", channel: "Renaissance Periodization" },
  ],
  "bi_wrist-curl-barbell": [
    { videoId: "lfQR7oVS8eo", title: "Barbell Standing Wrist Curl", channel: "Renaissance Periodization" },
    { videoId: "3VLTzIrnb5g", title: "How To Do Wrist Curls", channel: "PureGym" },
    { videoId: "_NhZ7uyE6lg", title: "How To: Standing Wrist Curl", channel: "ScottHermanFitness" },
  ],
  "bi_reverse-wrist-curl": [
    { videoId: "FW7URAaC-vE", title: "How To: Reverse Seated Wrist Curl", channel: "ScottHermanFitness" },
    { videoId: "krZ6pWGZ8xo", title: "How to Do Dumbbell Reverse Wrist Curls", channel: "LIVESTRONG" },
  ],
  "bi_farmer-s-walk": [
    { videoId: "w77p6m_SMx0", title: "Load up those Farmer's Walks!", channel: "Alan Thrall (Untamed Strength)", vertical: true },
    { videoId: "8OtwXwrJizk", title: "How To Do A Farmer's Walk (Farmer's Carry)", channel: "PureGym" },
  ],
  "bi_dead-hang": [
    { videoId: "dOCQjaasbGs", title: "How To Dead Hang Correctly", channel: "FitnessFAQs", vertical: true },
    { videoId: "0Bx_Ap7-EwU", title: "Dead Hang", channel: "OPEX Fitness" },
  ],
  "bi_squat-barbell": [
    { videoId: "dW3zj79xfrc", title: "✅ The PERFECT Barbell Squat", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "tNUq6b5t11Q", title: "The PERFECT Barbell Squat (Step-by-Step Guide)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "tKMMK5dEM1k", title: "How To Do Barbell Squat", channel: "Mind Pump TV", vertical: true },
  ],
  "bi_front-squat": [
    { videoId: "_qv0m3tPd3s", title: "✅ The PERFECT Front Squat", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "HHxNbhP16UE", title: "Front Squat", channel: "Renaissance Periodization" },
    { videoId: "CE0uSrr4SYQ", title: "Movement Demo - The Front Squat", channel: "Rogue Fitness" },
  ],
  "bi_high-bar-squat": [
    { videoId: "i7J5h7BJ07g", title: "High Bar Squat", channel: "Renaissance Periodization" },
    { videoId: "d38ChgL-Vek", title: "High Bar Back Squat Basics", channel: "The Physio Fix" },
    { videoId: "dW5-C1fsMjk", title: "How to Properly High Bar Squat (Olympic Style)", channel: "OmarIsuf" },
  ],
  "bi_box-squat": [
    { videoId: "XQmZ44xQSw4", title: "Box Squat", channel: "Testosterone Nation", vertical: true },
    { videoId: "-GaRp6_b2vk", title: "How to do a Box Squat", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "ktMbRDQ_7fc", title: "Box Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_goblet-squat": [
    { videoId: "ZBAd1g1z6qs", title: "Goblet Squat Variations", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "3gpXflqRiEc", title: "How to Goblet Squat", channel: "Men's Health" },
    { videoId: "zBV3ceGyAxw", title: "How To Do A Goblet squat", channel: "PureGym" },
  ],
  "bi_squat-smith-machine": [
    { videoId: "iKCJCydYYrE", title: "✅ The PERFECT Smith Machine Squat", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "jPrzu4kp47o", title: "How to Perform the Smith Machine Squat", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "-eO_VydErV0", title: "Feet Forward Smith Squat", channel: "Renaissance Periodization" },
  ],
  "bi_hack-squat": [
    { videoId: "cFGgMO-ENiQ", title: "Hack Squat Variations (Know the Difference!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "rYgNArpwE7E", title: "Hack Squat", channel: "Renaissance Periodization" },
  ],
  "bi_leg-press": [
    { videoId: "nDh_BlnLCGc", title: "How To Leg Press With Perfect Technique", channel: "Jeff Nippard", vertical: true },
    { videoId: "EotSw18oR9w", title: "✅ The PERFECT Leg Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "yZmx_Ac3880", title: "Leg Press", channel: "Renaissance Periodization" },
  ],
  "bi_leg-extension": [
    { videoId: "d3d2yz7V26c", title: "Leg Extension Form Tips (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "iQ92TuvBqRo", title: "✅ The Perfect Leg Extension", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "m0FOpMEgero", title: "Leg Extension", channel: "Renaissance Periodization" },
  ],
  "bi_bulgarian-split-squat": [
    { videoId: "or1frhkjBDc", title: "Bulgarian Split Squat Setup & Form Tips (DO THIS!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "o7yFuIR9XVU", title: "Bulgarian Split Squats Made Easy (FORM FIX)", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "9p5e2BSvoLs", title: "Bulgarian Split Squat Step by Step Guide", channel: "Bodybuilding.com", vertical: true },
  ],
  "bi_lunge-dumbbell": [
    { videoId: "mJilHWIBWO8", title: "✅ The PERFECT Dumbbell Static Lunge", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "f7Aw2yiqmVs", title: "❌ Fix These Dumbbell Lunge Mistakes!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "9gglI77Kzq8", title: "Dumbbell Lunge", channel: "OPEX Fitness" },
  ],
  "bi_walking-lunge": [
    { videoId: "L8fvypPrzzs", title: "The Walking Lunge", channel: "CrossFit" },
    { videoId: "mAgbXQdd4LM", title: "How To Do Walking Lunges", channel: "PureGym" },
    { videoId: "tQNktxPkSeE", title: "Walking Lunge", channel: "Onnit Academy" },
  ],
  "bi_reverse-lunge-barbell": [
    { videoId: "qfpaNBDhidg", title: "Barbell Reverse Lunge - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "tNkofNXbUig", title: "Barbell Reverse Lunge from Riser - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_step-up": [
    { videoId: "Wq_jUFssKd0", title: "The perfect step up for glutes!", channel: "Bret Contreras Glute Guy", vertical: true },
    { videoId: "GOrp0uGyoMY", title: "Master The Perfect Step Up For MAXIMUM Glute Gains!", channel: "Bret Contreras Glute Guy", vertical: true },
    { videoId: "wfhXnLILqdk", title: "Step Up Exercise | Osteoarthritis Physiotherapy", channel: "Cornerstone Physiotherapy" },
  ],
  "bi_pistol-squat": [
    { videoId: "jUQzp0KWgQY", title: "How To Pistol Squat For Beginners", channel: "FitnessFAQs", vertical: true },
    { videoId: "vq5-vdgJc0I", title: "How to Get Your First PISTOL SQUAT (Step-by-Step Progression)", channel: "Squat University" },
    { videoId: "88VxdkBpiFE", title: "Step-By-Step Instruction on How to Pistol Squat", channel: "Mind Pump TV" },
  ],
  "bi_air-squat": [
    { videoId: "iiKn5FiVUjI", title: "Air Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "C_VtOYc6j5c", title: "The Air Squat: CrossFit Foundational Movement", channel: "CrossFit" },
    { videoId: "rMvwVtlqjTE", title: "The Air Squat", channel: "CrossFit" },
  ],
  "bi_sissy-squat": [
    { videoId: "lrPPo3PkUYI", title: "How To Do Sissy Squats", channel: "Mind Pump TV", vertical: true },
    { videoId: "R_GgqlXwJDE", title: "Sissy squats", channel: "mountaindog1" },
    { videoId: "FTmbNjUu7CI", title: "Bodyweight Sissy Squat", channel: "Testosterone Nation" },
  ],
  "bi_belt-squat": [
    { videoId: "4UARr5I0MY0", title: "Get Huge Quads w/ The Belt Squat!!", channel: "Renaissance Periodization", vertical: true },
    { videoId: "FCIZZvIM-I0", title: "Exercise Tutorial - How to use a belt squat", channel: "Nexus Performance Australia" },
  ],
  "bi_pendulum-squat": [
    { videoId: "J8czl8DDnJ4", title: "The Pendulum Squat", channel: "Testosterone Nation" },
    { videoId: "wc2t62qiqAI", title: "Exercise Index - Pendulum Squat", channel: "mountaindog1" },
    { videoId: "Nmq-8AK-GJQ", title: "HOW TO: PENDULUM SQUAT", channel: "BEN MIGHTY" },
  ],
  "bi_romanian-deadlift-barbell": [
    { videoId: "9RrhTtcFMDk", title: "RDL Tips | BB Athlete @samileigh.fit", channel: "Bodybuilding.com", vertical: true },
    { videoId: "xgusDooVfKU", title: "How to do a Romanian Deadlift (Barbell) | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_romanian-deadlift-dumbbell": [
    { videoId: "hu3jRvTc_po", title: "The PERFECT Dumbbell Romanian Deadlift", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "aa57T45iFSE", title: "How to do a Dumbbell Romanian Deadlift | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "xAL7lHwj30E", title: "Dumbbell Romanian Deadlift", channel: "Onnit Academy" },
  ],
  "bi_stiff-leg-deadlift": [
    { videoId: "Wou9zVQrAfs", title: "Romanian vs Stiff-Leg Deadlift (KNOW THE DIFFERENCE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "AH7gaaT_tU8", title: "Lift With Your BACK : How To Stiff Leg Deadlift", channel: "Alan Thrall (Untamed Strength)" },
    { videoId: "Xy1O99wrKYE", title: "Exercise Index:  Leg Stiff leg Deadlift the CORRECT WAY", channel: "mountaindog1" },
  ],
  "bi_lying-leg-curl": [
    { videoId: "6eVuy_P5FR8", title: "Lying Leg Curl Variations - Know the Difference!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "n5WDXD_mpVY", title: "Lying Leg Curl", channel: "Renaissance Periodization" },
    { videoId: "jxctD6fL_FQ", title: "Lying Leg Curls - Leg Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
  ],
  "bi_seated-leg-curl": [
    { videoId: "xdbEG3xGLI8", title: "✅ The PERFECT Seated Leg Curl Tips", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "Orxowest56U", title: "Seated Leg Curl", channel: "Renaissance Periodization" },
    { videoId: "_2Kd0d-JEUM", title: "How to do a Seated Leg Curl  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_nordic-hamstring-curl": [
    { videoId: "wwgtGMHhS8Y", title: "How To Perform Nordic Hamstring Curls #shorts", channel: "E3 Rehab", vertical: true },
    { videoId: "PM23l_EVxYc", title: "How To Set Up Nordic Hamstring Curls (8 Options) #shorts", channel: "E3 Rehab", vertical: true },
    { videoId: "kjv4WQXWl_A", title: "Nordic Hamstring Curl", channel: "Onnit Academy" },
  ],
  "bi_glute-ham-raise": [
    { videoId: "m0AIU1dCVkU", title: "The Glute-Ham Raise", channel: "CrossFit" },
    { videoId: "SBGYSfoqyfU", title: "Glute Ham Raise", channel: "Renaissance Periodization" },
    { videoId: "eXgk59SwocU", title: "Glute Ham Raise", channel: "Testosterone Nation" },
  ],
  "bi_single-leg-romanian-deadlift": [
    { videoId: "nguB77nEwwc", title: "SECRET Tips For The Single Leg RDL!🤫", channel: "Squat University", vertical: true },
    { videoId: "Xc6xXLdcRFE", title: "Master The Single Leg RDL (STRONG GLUTES!)", channel: "Squat University", vertical: true },
    { videoId: "MsE_T9nAsSE", title: "Single Leg RDL", channel: "[P]rehab" },
  ],
  "bi_hip-thrust-barbell": [
    { videoId: "ov3-rfX1-Yk", title: "The Barbell Hip Thrust #shorts", channel: "Mind Pump TV", vertical: true },
    { videoId: "EF7jXP17DPE", title: "Barbell Hip Thrust", channel: "Renaissance Periodization" },
    { videoId: "aweBS7K71l8", title: "How To Do A Barbell Hip Thrust", channel: "PureGym" },
  ],
  "bi_hip-thrust-machine": [
    { videoId: "sxOrVuCvWq4", title: "The PERFECT Machine Hip Thrust", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "ZSPmIyX9RZs", title: "Machine Hip Thrust", channel: "Renaissance Periodization" },
    { videoId: "tztHvSLdXLA", title: "How to PROPERLY Machine Hip Thrust (FIX YOUR FORM NOW)", channel: "Colossus Fitness" },
  ],
  "bi_glute-bridge": [
    { videoId: "XLXGydU5DdU", title: "How to do a glute bridge | Bupa Health", channel: "Bupa Health" },
    { videoId: "tqp5XQPpTxY", title: "How To Do A Glute Bridge", channel: "PureGym" },
    { videoId: "PhTDzR0TpZs", title: "How to Do a Glute Bridge Exercise: A Guide from Physical Therapists", channel: "Hinge Health" },
  ],
  "bi_cable-pull-through": [
    { videoId: "pv8e6OSyETE", title: "Cable Pull Through", channel: "Renaissance Periodization" },
    { videoId: "A30YKvpWGu4", title: "Cable Pull Through", channel: "OPEX Fitness" },
  ],
  "bi_hip-abduction-machine": [
    { videoId: "tu4o4quPv2k", title: "Hip Abduction Machine (KNOW THE DIFFERENCE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "ctSsNDgOTmk", title: "Planet Fitness Hip Abduction Machine - How to use the hip abduction machine at Planet Fitness", channel: "Planet Fitness Beginner" },
  ],
  "bi_hip-adduction-machine": [
    { videoId: "GmRSV_n2E_0", title: "How To: Hip Adduction (Cybex)", channel: "ScottHermanFitness" },
    { videoId: "iYcS9jCA6gE", title: "Planet Fitness Hip Adduction Machine - How to use the hip adduction Machine at Planet Fitness", channel: "Planet Fitness Beginner" },
  ],
  "bi_cable-kickback": [
    { videoId: "CyJtnoZRxPw", title: "The PERFECT Cable Kickback", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "SqO-VUEak2M", title: "How To Do Cable Kickbacks", channel: "PureGym" },
    { videoId: "iElJ4Ngx--k", title: "Cable Glute Kickback", channel: "OPEX Fitness" },
  ],
  "bi_kettlebell-swing": [
    { videoId: "jhihfOmPulc", title: "The SECRET To Master Kettlebell Swings!", channel: "Squat University", vertical: true },
    { videoId: "jwILQCx61ts", title: "Fix Your Kettlebell Swing", channel: "FitnessFAQs", vertical: true },
    { videoId: "1cVT3ee9mgU", title: "Kettlebell Swing", channel: "StrongFirst" },
  ],
  "bi_standing-calf-raise": [
    { videoId: "x41IWlX4Rqo", title: "You're Doing Calf Raises WRONG", channel: "Renaissance Periodization", vertical: true },
    { videoId: "a-x_NR-ibos", title: "Calf Raise Variations (KNOW THE DIFFERENCE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "K_jsGgztcGU", title: "Standing Calf Raise - The Proper Lift - BPI Sports", channel: "BPI Sports" },
  ],
  "bi_seated-calf-raise": [
    { videoId: "3ZRe_QpvRPg", title: "How To Do A Seated Calf Raise", channel: "PureGym" },
    { videoId: "BxfKOyI8sUg", title: "How to Do a Seated Calf Raise: A Guide from Physical Therapists", channel: "Hinge Health" },
    { videoId: "JbyjNymZOt0", title: "How to Do Seated Calf Raises", channel: "LIVESTRONG" },
  ],
  "bi_calf-press-leg-press": [
    { videoId: "8k435cj30gc", title: "How to do a Leg Press Calf Raise | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "dhRz1Ns60Zg", title: "How To Do Calf Raises On The Leg Press", channel: "PureGym" },
  ],
  "bi_single-leg-calf-raise": [
    { videoId: "qPd73snQfUs", title: "Single-Leg Calf Raise (HSS)", channel: "Hospital for Special Surgery" },
    { videoId: "IphGZ8OlfYg", title: "How To Do A Single Leg Calf Raise", channel: "PureGym" },
  ],
  "bi_plank": [
    { videoId: "xe2MXatLTUw", title: "✅ The PERFECT Plank", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "v3V6iyQfKzY", title: "Plank Progression (DO THESE FOR ABS‼️) #shorts", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
  ],
  "bi_side-plank": [
    { videoId: "Oe9Tp9SvTCE", title: "How To Do A Side Plank", channel: "PureGym" },
    { videoId: "44ND4bOB-T0", title: "How to do a Side Plank  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_crunch": [
    { videoId: "NnVhqMQRvmM", title: "AB EXERCISE - How to do an abdominal crunch (ab crunch)", channel: "PureGym" },
    { videoId: "MKmrqcoCZ-M", title: "How to Do a Stomach Crunch Properly | Gym Workout", channel: "Howcast" },
    { videoId: "GWIEON0VSaY", title: "How To Do A Crunch Properly | Beginners Tutorial", channel: "Glamrs" },
  ],
  "bi_cable-crunch": [
    { videoId: "K2m0jj6RfYg", title: "STOP Making This Cable Crunch MISTAKE!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "ByZJuk85YuE", title: "❌ Cable Crunch Mistakes (FIX THESE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "3qjoXDTuyOE", title: "Cable Crunch - Abs / Core Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
  ],
  "bi_sit-up": [
    { videoId: "pCX65Mtc_Kk", title: "How To Do a Sit Up Correctly", channel: "Detroit Medical Center" },
    { videoId: "onaQ0v_J5uU", title: "How To Sit up | Nuffield Health", channel: "Nuffield Health" },
    { videoId: "1fbU_MkV7NE", title: "How to Do a Sit Up", channel: "LIVESTRONG" },
  ],
  "bi_hanging-leg-raise": [
    { videoId: "kRQnFpdZ69g", title: "Hanging Leg Raise", channel: "Testosterone Nation", vertical: true },
    { videoId: "Yrtvs-nEnk0", title: "How To Do Hanging Leg Raises", channel: "PureGym" },
  ],
  "bi_hanging-knee-raise": [
    { videoId: "RD_A-Z15ER4", title: "Hanging Knee Raise", channel: "Renaissance Periodization" },
    { videoId: "O7iDA3ory-w", title: "How To Do Hanging Knee Raises", channel: "PureGym" },
  ],
  "bi_lying-leg-raise": [
    { videoId: "5uB0KaoCF9w", title: "❌ Lying Leg Raise Mistake (STOP DOING THIS!) #shorts", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "Wp4BlxcFTkE", title: "Lying Leg Raises", channel: "LivestrongWoman" },
    { videoId: "3oIpxsn6FxQ", title: "Perfect Lying Leg Raises Form to Strengthen Your Core & Avoid Back Pain", channel: "Mobility Doc" },
  ],
  "bi_ab-wheel-rollout": [
    { videoId: "6DUbeqa9g3M", title: "Ab Wheel Rollouts For Beginners", channel: "FitnessFAQs", vertical: true },
    { videoId: "DA2QGI0NPWU", title: "Ab Wheel Rollout", channel: "Testosterone Nation" },
    { videoId: "4HZCJLM5wBk", title: "Ab Wheel Rollout", channel: "OPEX Fitness" },
  ],
  "bi_russian-twist": [
    { videoId: "-BzNffL_6YE", title: "STOP Doing Russian Twists Like This! (SAVE A FRIEND)", channel: "ATHLEAN-X™", vertical: true },
    { videoId: "JyUqwkVpsi8", title: "Russian Twist", channel: "LivestrongWoman" },
    { videoId: "LlccOWys8IU", title: "How To Russian Twist | Nuffield Health", channel: "Nuffield Health" },
  ],
  "bi_pallof-press": [
    { videoId: "gHGLwQGvtxg", title: "Pallof Press", channel: "Men's Health" },
    { videoId: "HXrLaqNIkTs", title: "How To Do A Pallof Press", channel: "PureGym" },
    { videoId: "05Zh2EP738E", title: "Pallof Press", channel: "Testosterone Nation" },
  ],
  "bi_dead-bug": [
    { videoId: "bxn9FBrt4-A", title: "How to do a Dead Bug | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "BZYaCzbP09M", title: "Dead Bug", channel: "E3 Rehab Exercise Library" },
  ],
  "bi_mountain-climber": [
    { videoId: "kLh-uczlPLg", title: "How To Do Mountain Climbers", channel: "PureGym" },
    { videoId: "hq_0YlyfqGM", title: "Mountain Climber - Exercise Demo", channel: "Group HIIT" },
  ],
  "bi_bicycle-crunch": [
    { videoId: "wnuLak2onoA", title: "AB EXERCISE - How to do a bicycle crunch", channel: "PureGym" },
    { videoId: "eqg47ZuGZXQ", title: "Strengthening the core: Bicycle Crunch", channel: "UCLA Health" },
    { videoId: "VaL7XWK3MVE", title: "How to Do a Bicycle Crunch Exercise | 30 Seconds | MedBridge", channel: "Medbridge" },
  ],
  "bi_woodchopper-cable": [
    { videoId: "iWxTGXIViro", title: "Cable Woodchopper", channel: "Ekspert Sports Performance" },
    { videoId: "7eCm3WQgzmI", title: "How to PROPERLY Cable Woodchopper Oblique Twist For Shredded Obliques", channel: "Colossus Fitness" },
  ],
  "bi_hollow-hold": [
    { videoId: "EsnM8eBtazU", title: "Hollow Body Hold - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "JnuYfsJ3CKg", title: "How to Do a Hollow Body Hold : Gymnastics", channel: "eHowSports" },
  ],
  "bi_dragon-flag": [
    { videoId: "yFiNw9EsJfI", title: "DRAGON FLAG: Tutorial", channel: "Hybrid Calisthenics", vertical: true },
    { videoId: "U5pviWt7sMo", title: "Core Strength Technique: Dragon Flags", channel: "Coach Myers" },
    { videoId: "rNpwcQuF0sQ", title: "Eccentric Dragon Flag", channel: "OPEX Fitness" },
  ],
  "bi_power-clean": [
    { videoId: "xJqdeR_Rg9s", title: "The SECRET to a PERFECT Power Clean!", channel: "Squat University", vertical: true },
    { videoId: "Caon_DUX0TM", title: "His Secret to a Perfect Power Clean! #weightlifting", channel: "Squat University", vertical: true },
    { videoId: "e8TpDdMYq4Y", title: "Power Clean", channel: "OPEX Fitness" },
  ],
  "bi_hang-clean": [
    { videoId: "WCdhjfg7fv4", title: "Movement Demo - The Hang Clean", channel: "Rogue Fitness" },
    { videoId: "TjTEOme9fvw", title: "The Hang Clean", channel: "CrossFit" },
    { videoId: "0aP3tgKZcHQ", title: "The Hang Power Clean", channel: "CrossFit" },
  ],
  "bi_clean-and-jerk": [
    { videoId: "PjY1rH4_MOA", title: "The Clean and Jerk", channel: "CrossFit" },
    { videoId: "8miqQQJEsO0", title: "CrossFit - Coaching the Clean and Jerk with Natalie Burgener", channel: "CrossFit" },
    { videoId: "oVAJkyyVj3o", title: "How to Do a Clean and Jerk by Wodstar", channel: "Wodstar" },
  ],
  "bi_snatch": [
    { videoId: "oNLCtvlqfmE", title: "The SECRET Moves to a Better Snatch Lift!😳", channel: "Squat University", vertical: true },
    { videoId: "2YkJ8QMf5yA", title: "Mastering Snatch Technique: Building Mechanics Without Weight", channel: "Bodybuilding.com", vertical: true },
    { videoId: "Iy0vPROslAA", title: "How To Do A Squat Snatch", channel: "PureGym" },
  ],
  "bi_thruster-barbell": [
    { videoId: "Zvt5-mugUco", title: "How To Do Barbell Thrusters | Exercise Guide", channel: "Bodybuilding.com" },
    { videoId: "Pb_tUPpU-UA", title: "Barbell Thruster", channel: "Central Athlete" },
  ],
  "bi_burpee": [
    { videoId: "NCqbpkoiyXE", title: "How To Burpee | Nuffield Health", channel: "Nuffield Health" },
    { videoId: "auBLPXO8Fww", title: "The Burpee", channel: "CrossFit" },
    { videoId: "1yPltRIm59E", title: "How To Do Burpees", channel: "PureGym" },
  ],
  "bi_turkish-get-up": [
    { videoId: "sgd8n917Zv0", title: "How to do a Turkish get-up", channel: "Furthermore from Equinox" },
    { videoId: "2dx2rM1FSgE", title: "Turkish Get-Up with Proper Form", channel: "Max" },
  ],
  "bi_kettlebell-clean-and-press": [
    { videoId: "sAtZ4yAsQnI", title: "Kettlebell Clean And Press", channel: "Men's Health" },
    { videoId: "ckjR4jYtuYc", title: "Kettlebell Clean and Press Variations - Nuffield Health", channel: "Nuffield Health" },
    { videoId: "48qvCvJJr8Y", title: "Kettlebell Clean and Press - a Primer on basic technique", channel: "Mark Wildman" },
  ],
  "bi_sled-push": [
    { videoId: "QwscR2BhdEg", title: "How To Do The Sled Push", channel: "PureGym" },
    { videoId: "QaTrePoCT4g", title: "The ULTIMATE Sled Push/Pull Tutorial", channel: "Squat University" },
    { videoId: "9XRRXaUpnLk", title: "How To Do The Sled Push The RIGHT Way! (AVOID MISTAKES!)", channel: "Mind Pump TV" },
  ],
  "bi_battle-ropes": [
    { videoId: "DfuvSn73Up4", title: "Battle Ropes Basics", channel: "Testosterone Nation" },
    { videoId: "zw0OMi00X5g", title: "How to perform BATTLE ROPES - HOIST Fitness MotionCage Exercise", channel: "HOIST Fitness" },
  ],
  "bi_box-jump": [
    { videoId: "k7dmYdknbac", title: "How To Do Box Jumps", channel: "PureGym" },
    { videoId: "W5QzqIbEWvk", title: "Box Jump Step Down - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "757ht_Y-fY0", title: "How to do a Box Jump-Up with Stabilization", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_muscle-up": [
    { videoId: "ZseoNNiEtIw", title: "Perfect Your Muscle-Up Technique", channel: "FitnessFAQs", vertical: true },
    { videoId: "N4u_sP0bbWI", title: "How To Muscle-Up For Beginners", channel: "FitnessFAQs", vertical: true },
  ],
  "bi_running": [
    { videoId: "brFHyOtTwH4", title: "What Is Perfect Running Form? | Run Technique Tips For All Runners", channel: "Global Triathlon Network" },
    { videoId: "_kGESn8ArrU", title: "How To Run Properly | Running Technique Explained", channel: "Global Triathlon Network" },
    { videoId: "-AASu9CNFoM", title: "How to Run Properly (Correct Running Form & Technique)", channel: "Progressive Soccer" },
  ],
  "bi_treadmill": [
    { videoId: "LsswRe8_I3g", title: "Treadmill Slow Jogging Technique — Quick Technique Demo", channel: "Fitness By Physio" },
    { videoId: "z3l-nIMIbPk", title: "How to use a Treadmill | Planet Fitness", channel: "Planet Fitness" },
    { videoId: "76XnbF5DBFY", title: "How To Use A Treadmill Correctly | GTN'S Guide For Beginners", channel: "Global Triathlon Network" },
  ],
  "bi_cycling": [
    { videoId: "hPcR6MQ5dJo", title: "How To Pedal | Cycling Technique", channel: "Global Cycling Network" },
    { videoId: "EW1_TIs_6Tw", title: "How To Improve Your Bike Handling - 5 Key Cycling Skills", channel: "Global Cycling Network" },
  ],
  "bi_rowing-machine": [
    { videoId: "fxfhQMbATCw", title: "Rowing Technique Tips", channel: "CrossFit" },
    { videoId: "6_eLpWiNijE", title: "How To Use The Rowing Machine", channel: "PureGym" },
  ],
  "bi_elliptical": [
    { videoId: "3pCdU1XkNm8", title: "Proper Form on an Elliptical", channel: "LIVESTRONG" },
    { videoId: "gpxUeHJ-Ps0", title: "Proper elliptical technique", channel: "EverFit Strategies" },
    { videoId: "j38LNpTLwzY", title: "HOW TO USE AN ELLIPTICAL | Beginner's Guide", channel: "Naomi Kong" },
  ],
  "bi_stair-climber": [
    { videoId: "ST-5lD69XqU", title: "How to use a Stair Climber | Planet Fitness", channel: "Planet Fitness" },
    { videoId: "ww3YV_N6U_U", title: "StairMaster Workout and Exercises! How to Use StairMaster with Proper Form", channel: "McKinley Health Center" },
  ],
  "bi_jump-rope": [
    { videoId: "u3zgHI8QnqE", title: "How To Jump Rope | The Right Way | Well+Good", channel: "Well+Good" },
    { videoId: "wqN5bRkZPK0", title: "How to Jump Rope (Beginner to Expert)", channel: "Tony Jeffries" },
  ],
  "bi_swimming": [
    { videoId: "5HLW2AI1Ink", title: "Freestyle Swimming Technique | Stroke", channel: "Speedo" },
    { videoId: "Gq2asyrI0MI", title: "Freestyle Swimming Breathing Technique | Step-by-Step Drills For Beginners", channel: "Rocket Swimming" },
    { videoId: "XS3_lChWJC4", title: "How To Swim Without Getting Tired | Essential Tips For Swimming", channel: "Global Triathlon Network" },
  ],
  "bi_walking": [
    { videoId: "q3JYT_jKs7Y", title: "How to Walk Faster | Power Walking", channel: "SIKANA English" },
    { videoId: "zAmsHhc2zCw", title: "Learning the Basic Technique | Nordic Walking", channel: "SIKANA English" },
  ],
  "bi_assault-bike": [
    { videoId: "RPY7HTGfOiU", title: "How to Use an Assault Bike", channel: "Peak Human Performance" },
    { videoId: "mY9ihujdkc0", title: "Assault Bike Tips and Tricks for Efficiency and Power", channel: "Marcus Filly" },
    { videoId: "Fv8tIEJhcsc", title: "4 Very Important Air Assault Bike Tips", channel: "ConstantlyVariedFitness" },
  ],
};
