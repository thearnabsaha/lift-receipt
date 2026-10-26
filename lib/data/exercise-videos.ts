// Curated YouTube form-tutorial videos per built-in exercise, oEmbed-verified 2026-10-27.
// vertical: true = a real YouTube Short (9:16, /shorts/ID returns 200); others are <=60s landscape clips from credible channels.
// Static list: no runtime YouTube API. Rendered via a tap-to-load muted youtube-nocookie embed (components/form-videos.tsx).
export type FormVideo = { videoId: string; title: string; channel: string; vertical?: boolean };
export const EXERCISE_VIDEOS: Record<string, FormVideo[]> = {
  "bi_bench-press-barbell": [
    { videoId: "CjHIKDQ4RQo", title: "How To Do A Barbell Bench Press Correctly", channel: "PureGym" },
    { videoId: "CayG6UYqL8g", title: "How to do a Barbell Bench Press | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
  "bi_chest-fly-machine": [
    { videoId: "XZg28DIf1oc", title: "How to Perform the PERFECT Machine Chest Fly", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "XFnxc7gOIh8", title: "Chest Fly Machine Variations (KNOW THE DIFFERENCE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "eGjt4lk6g34", title: "How To Use The Chest Fly Machine", channel: "PureGym" },
  ],
  "bi_cable-crossover": [
    { videoId: "QcTcWpkn_bw", title: "How To Do A Cable Fly/ Cable Crossover", channel: "PureGym" },
    { videoId: "XY6JrX1wyxk", title: "How to do a Cable Crossover  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
    { videoId: "yPqv3ejnZvc", title: "How to do a Barbell Deadlift", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "Z6gcRfPNcZo", title: "How to Do a Barbell Deadlift | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
  ],
  "bi_pull-up-assisted": [
    { videoId: "8ygapPMYK1I", title: "Assisted Normal Grip Pullup", channel: "Renaissance Periodization" },
    { videoId: "GdsRZAeeDUc", title: "Assisted Parallel Pullup", channel: "Renaissance Periodization" },
    { videoId: "L4ChTwrXTjc", title: "Assisted Underhand Pullup", channel: "Renaissance Periodization" },
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
  ],
  "bi_overhead-press-barbell": [
    { videoId: "4LBVP2Oe7fg", title: "✅ The PERFECT Barbell Overhead Press", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "cGnhixvC8uA", title: "How to do a Barbell Overhead Press", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_overhead-press-dumbbell": [
    { videoId: "b132W5N8Jrg", title: "Dumbbell Overhead Press", channel: "Testosterone Nation", vertical: true },
    { videoId: "Did01dFR3Lk", title: "Dumbbell Overhead Press - How To", channel: "Bobby Maximus" },
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
    { videoId: "B7eo-wHS7Fc", title: "How To Handstand Push-Up", channel: "FitnessFAQs", vertical: true },
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
    { videoId: "6Fzep104f0s", title: "Cable Triceps Pushdown", channel: "Renaissance Periodization" },
  ],
  "bi_triceps-rope-pushdown": [
    { videoId: "e5aj8hhCPkA", title: "Rope Triceps Pushdown", channel: "Testosterone Nation" },
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
  ],
  "bi_air-squat": [
    { videoId: "iiKn5FiVUjI", title: "Air Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_sissy-squat": [
    { videoId: "lrPPo3PkUYI", title: "How To Do Sissy Squats", channel: "Mind Pump TV", vertical: true },
    { videoId: "R_GgqlXwJDE", title: "Sissy squats", channel: "mountaindog1" },
    { videoId: "FTmbNjUu7CI", title: "Bodyweight Sissy Squat", channel: "Testosterone Nation" },
  ],
  "bi_belt-squat": [
    { videoId: "4UARr5I0MY0", title: "Get Huge Quads w/ The Belt Squat!!", channel: "Renaissance Periodization", vertical: true },
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
    { videoId: "-1cAnwFNBLg", title: "Proper Hip Thrust Form #shorts", channel: "Bret Contreras Glute Guy", vertical: true },
    { videoId: "p1dTK5f73sY", title: "How to set up for hip thrusts #shorts", channel: "Bodybuilding.com", vertical: true },
    { videoId: "ZSPmIyX9RZs", title: "Machine Hip Thrust", channel: "Renaissance Periodization" },
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
  "bi_seated-calf-raise": [
    { videoId: "3ZRe_QpvRPg", title: "How To Do A Seated Calf Raise", channel: "PureGym" },
  ],
  "bi_calf-press-leg-press": [
    { videoId: "8k435cj30gc", title: "How to do a Leg Press Calf Raise | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
  ],
  "bi_cable-crunch": [
    { videoId: "K2m0jj6RfYg", title: "STOP Making This Cable Crunch MISTAKE!", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "ByZJuk85YuE", title: "❌ Cable Crunch Mistakes (FIX THESE!)", channel: "Andrew Kwong (DeltaBolic)", vertical: true },
    { videoId: "3qjoXDTuyOE", title: "Cable Crunch - Abs / Core Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
  ],
  "bi_sit-up": [
    { videoId: "pCX65Mtc_Kk", title: "How To Do a Sit Up Correctly", channel: "Detroit Medical Center" },
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
  ],
  "bi_snatch": [
    { videoId: "oNLCtvlqfmE", title: "The SECRET Moves to a Better Snatch Lift!😳", channel: "Squat University", vertical: true },
    { videoId: "2YkJ8QMf5yA", title: "Mastering Snatch Technique: Building Mechanics Without Weight", channel: "Bodybuilding.com", vertical: true },
    { videoId: "Iy0vPROslAA", title: "How To Do A Squat Snatch", channel: "PureGym" },
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
  ],
  "bi_sled-push": [
    { videoId: "QwscR2BhdEg", title: "How To Do The Sled Push", channel: "PureGym" },
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
  "bi_treadmill": [
    { videoId: "LsswRe8_I3g", title: "Treadmill Slow Jogging Technique — Quick Technique Demo", channel: "Fitness By Physio" },
  ],
  "bi_rowing-machine": [
    { videoId: "fxfhQMbATCw", title: "Rowing Technique Tips", channel: "CrossFit" },
    { videoId: "6_eLpWiNijE", title: "How To Use The Rowing Machine", channel: "PureGym" },
  ],
  "bi_elliptical": [
    { videoId: "3pCdU1XkNm8", title: "Proper Form on an Elliptical", channel: "LIVESTRONG" },
  ],
};
