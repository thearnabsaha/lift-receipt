// Curated YouTube form-tutorial shorts per built-in exercise (<=60s, credible channels, oEmbed-verified 2026-10-27).
// Static list: no runtime YouTube API. Rendered via a tap-to-load muted youtube-nocookie embed (components/form-videos.tsx).
export type FormVideo = { videoId: string; title: string; channel: string };
export const EXERCISE_VIDEOS: Record<string, FormVideo[]> = {
  "bi_bench-press-barbell": [
    { videoId: "CjHIKDQ4RQo", title: "How To Do A Barbell Bench Press Correctly", channel: "PureGym" },
    { videoId: "CayG6UYqL8g", title: "How to do a Barbell Bench Press | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_bench-press-dumbbell": [
    { videoId: "YQ2s_Y7g5Qk", title: "Flat Dumbbell Bench Press", channel: "Renaissance Periodization" },
    { videoId: "AduT4Eq-iP0", title: "How To Do A Dumbbell Bench Press", channel: "PureGym" },
    { videoId: "ZaDlbm8E8Tg", title: "Dumbbell Bench Press - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_bench-press-smith-machine": [
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
    { videoId: "NwzUje3z0qY", title: "Machine Chest Press", channel: "Renaissance Periodization" },
    { videoId: "lRo9zZ7EwpM", title: "How to do a Chest Press on a Machine | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_incline-chest-press-machine": [
    { videoId: "TrTSvn5-MTk", title: "Incline Machine Chest Press", channel: "Renaissance Periodization" },
    { videoId: "ArMbAy4emuA", title: "Incline Chest Press Machine", channel: "OPEX Fitness" },
  ],
  "bi_chest-fly-dumbbell": [
    { videoId: "QwuUZ5wgQOk", title: "Dumbbell Flyes - Chest Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "Nhvz9EzdJ4U", title: "How To Do A Dumbbell Chest Fly", channel: "PureGym" },
    { videoId: "UKwkChzThig", title: "Dumbbell Flyes - Chest Exercise", channel: "MyTraining App" },
  ],
  "bi_chest-fly-machine": [
    { videoId: "eGjt4lk6g34", title: "How To Use The Chest Fly Machine", channel: "PureGym" },
  ],
  "bi_cable-crossover": [
    { videoId: "QcTcWpkn_bw", title: "How To Do A Cable Fly/ Cable Crossover", channel: "PureGym" },
    { videoId: "XY6JrX1wyxk", title: "How to do a Cable Crossover  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_push-up": [
    { videoId: "-z5guzTBmr4", title: "Good Push-Up Form", channel: "Testosterone Nation" },
    { videoId: "WDIpL0pjun0", title: "How to do a Push-Up | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
    { videoId: "2HYAeF6o7Bc", title: "How To Do Chest Dips", channel: "PureGym" },
  ],
  "bi_floor-press-barbell": [
    { videoId: "kqg6nkByPqk", title: "Barbell Floor Press", channel: "Testosterone Nation" },
    { videoId: "YdiVxhxufG8", title: "Barbell Floor Press - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_pullover-dumbbell": [
    { videoId: "FK4rHfWKEac", title: "The Dumbbell Pullover", channel: "Men's Health" },
    { videoId: "jQjWlIwG4sI", title: "Dumbbell Pullover", channel: "Renaissance Periodization" },
    { videoId: "CSkSflHdC3A", title: "Dumbbell Pullover", channel: "OPEX Fitness" },
  ],
  "bi_close-grip-bench-press": [
    { videoId: "g4VkufehmUU", title: "RP Close Grip Bench Press", channel: "Renaissance Periodization" },
    { videoId: "LJeqLAmJLfs", title: "How to do a Close Grip Bench Press  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "CGqKy5wiY8o", title: "Close Grip Bench Press - OPEX Exercise Library", channel: "OPEX Fitness" },
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
    { videoId: "pfSMst14EFk", title: "Sumo Deadlift", channel: "Renaissance Periodization" },
    { videoId: "JbY72Him34Q", title: "How To Correctly Perform A Sumo Deadlift", channel: "PureGym" },
  ],
  "bi_rack-pull": [
    { videoId: "d9sK2R95MMM", title: "Rack Pull", channel: "Testosterone Nation" },
    { videoId: "9vYBWV5OeKg", title: "How To Do A Rack Pull", channel: "PureGym" },
  ],
  "bi_bent-over-row-barbell": [
    { videoId: "6FZHJGzMFEc", title: "Barbell Bent Over Row", channel: "Renaissance Periodization" },
    { videoId: "qXrTDQG1oUQ", title: "Bent-Over Barbell Row | Proper Form for a Bigger Back", channel: "Moorefitcoach" },
    { videoId: "ZathOyxYZ3M", title: "Bent Over Barbell Row | Nuffield Health", channel: "Nuffield Health" },
  ],
  "bi_bent-over-row-dumbbell": [
    { videoId: "knB5Q4FN4ck", title: "Bent-Over Dumbbell Row", channel: "Testosterone Nation" },
    { videoId: "6gvmcqr226U", title: "How To Do A Dumbbell Bent Over Row", channel: "PureGym" },
    { videoId: "DJfQN6xJL28", title: "How to do a Dumbbell Bent Over Row", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_pendlay-row": [
    { videoId: "Wv7f0uIKh8o", title: "How To Do A Pendlay Row", channel: "PureGym" },
    { videoId: "2Z_WBWchbvk", title: "Pendlay Row Demo", channel: "Testosterone Nation" },
    { videoId: "EzFkN5ge5_k", title: "Pendlay Row", channel: "Onnit Academy" },
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
    { videoId: "nl2MnK1i504", title: "Thibaudeau Coaches the Chest Supported Dumbbell Row", channel: "Testosterone Nation" },
    { videoId: "9zkP4Cd_cz0", title: "Dumbbell Chest-Supported Row", channel: "Testosterone Nation" },
  ],
  "bi_row-machine": [
    { videoId: "0UBRfiO4zDs", title: "Chest Supported Row", channel: "Renaissance Periodization" },
    { videoId: "_FrrYQxA6kc", title: "Machine Chest Supported Row", channel: "Renaissance Periodization" },
  ],
  "bi_single-arm-row-dumbbell": [
    { videoId: "DMo3HJoawrU", title: "Single Arm Supported Dumbbell Row", channel: "Renaissance Periodization" },
    { videoId: "ZRSGpBUVcNw", title: "How To Do Single Arm Dumbbell Rows", channel: "PureGym" },
    { videoId: "b80Ek9clN98", title: "Single Arm Chest Supported Dumbbell Row", channel: "OPEX Fitness" },
  ],
  "bi_pull-up": [
    { videoId: "9yVGh3XbJ34", title: "How to do a Pull-Up | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
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
    { videoId: "wcVDItawocI", title: "Straight Arm Pulldown - Back Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "G9uNaXGTJ4w", title: "Straight Arm Pulldown", channel: "Renaissance Periodization" },
    { videoId: "6-lDyiVOWqE", title: "Straight-Arm Pulldown", channel: "Testosterone Nation" },
  ],
  "bi_inverted-row": [
    { videoId: "KOaCM1HMwU0", title: "Inverted Row", channel: "Renaissance Periodization" },
    { videoId: "X5gLL-xvhz0", title: "45-Degree Inverted Row", channel: "Testosterone Nation" },
  ],
  "bi_back-extension": [
    { videoId: "Tb9yp81fI9s", title: "Back Extension Technique", channel: "Testosterone Nation" },
    { videoId: "ZaLvgeHC_54", title: "Roman Chair Back Extension", channel: "OPEX Fitness" },
  ],
  "bi_good-morning": [
    { videoId: "YA-h3n9L4YU", title: "The Good Morning", channel: "CrossFit" },
    { videoId: "Daq-wJMUnes", title: "How to Do the Good Mornings", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "0Syp9iyINZ4", title: "Good Mornings Tutorial - Proper Form and Technique", channel: "Runna" },
  ],
  "bi_shrug-barbell": [
    { videoId: "9xGqgGFAtiM", title: "Barbell Shrug - Shoulder Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "M_MjF5Nm_h4", title: "Barbell Shrug", channel: "Renaissance Periodization" },
    { videoId: "larn3Asl6oM", title: "How To Do Barbell Shrugs", channel: "PureGym" },
  ],
  "bi_shrug-dumbbell": [
    { videoId: "_t3lrPI6Ns4", title: "Dumbbell Shrug", channel: "Renaissance Periodization" },
    { videoId: "GH_l85Ky3vA", title: "Dumbbell Lean Shrug", channel: "Renaissance Periodization" },
  ],
  "bi_face-pull": [
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
    { videoId: "cGnhixvC8uA", title: "How to do a Barbell Overhead Press", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_overhead-press-dumbbell": [
    { videoId: "Did01dFR3Lk", title: "Dumbbell Overhead Press - How To", channel: "Bobby Maximus" },
  ],
  "bi_shoulder-press-machine": [
    { videoId: "WvLMauqrnK8", title: "Machine Shoulder Press", channel: "Renaissance Periodization" },
    { videoId: "GcY6TZxfS0k", title: "How To Use The Shoulder Press Machine", channel: "PureGym" },
  ],
  "bi_arnold-press": [
    { videoId: "jeJttN2EWCo", title: "How To Do The Arnold Press", channel: "PureGym" },
  ],
  "bi_lateral-raise-dumbbell": [
    { videoId: "XPPfnSEATJA", title: "How to do a Dumbbell Lateral Raise", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "z-kOn7flIZg", title: "How To Do Lateral Raises", channel: "PureGym" },
    { videoId: "OuG1smZTsQQ", title: "Lateral Raise", channel: "Renaissance Periodization" },
  ],
  "bi_lateral-raise-cable": [
    { videoId: "lq7eLC30b9w", title: "Leaning Cable Lateral Raise", channel: "Renaissance Periodization" },
    { videoId: "Z5FA9aq3L6A", title: "How To Do Cable Lateral Raises", channel: "PureGym" },
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
    { videoId: "HN8HYJTOl8c", title: "How To Do Front Plate Raises", channel: "PureGym" },
  ],
  "bi_reverse-fly-machine": [
    { videoId: "5YK4bgzXDp0", title: "Machine Reverse Flye", channel: "Renaissance Periodization" },
  ],
  "bi_upright-row-barbell": [
    { videoId: "um3VVzqunPU", title: "Barbell Upright Row", channel: "Renaissance Periodization" },
    { videoId: "FMhKUd0BlB4", title: "Barbell Upright Rows", channel: "The Barbell Physio" },
  ],
  "bi_landmine-press": [
    { videoId: "6sH6vyWduNU", title: "How To Do A Landmine Chest Press", channel: "PureGym" },
    { videoId: "t9GuiNQo1O4", title: "How To Do The Landmine Shoulder Press", channel: "Ian Nimblett" },
  ],
  "bi_band-pull-apart": [
    { videoId: "eZwnwWMkEL4", title: "Band Pull-Apart Exercise | Onnit Tutorials", channel: "Onnit" },
    { videoId: "pASXdGKh-nc", title: "Band Pull Apart - Opex Exercise Library", channel: "OPEX Fitness" },
    { videoId: "MnDpmNYUjbc", title: "Band Pull Apart", channel: "Functional Bodybuilding" },
  ],
  "bi_bicep-curl-barbell": [
    { videoId: "dDI8ClxRS04", title: "Barbell Curl - Biceps Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "JnLFSFurrqQ", title: "Barbell Curl Normal Grip", channel: "Renaissance Periodization" },
    { videoId: "N5x5M1x1Gd0", title: "How To Do A Barbell Bicep Curl", channel: "PureGym" },
  ],
  "bi_bicep-curl-dumbbell": [
    { videoId: "iixND1P2lik", title: "Alternating Dumbbell Curl", channel: "Renaissance Periodization" },
    { videoId: "cBSD6mQIPQk", title: "Dumbbell Bicep Curl | Nuffield Health", channel: "Nuffield Health" },
    { videoId: "MtXdEcW3Eog", title: "How To Double Arm Curl (Dumbbell Bicep Curl)", channel: "PureGym" },
  ],
  "bi_bicep-curl-cable": [
    { videoId: "GNlopToAZyg", title: "How To Do A Cable Curl", channel: "PureGym" },
    { videoId: "rfRdD5PKrko", title: "Cable Bicep Curl", channel: "TurnFit - Vancouver Personal Trainers" },
  ],
  "bi_ez-bar-curl": [
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
    { videoId: "Ja6ZlIDONac", title: "Machine Preacher Curl", channel: "Renaissance Periodization" },
    { videoId: "Zbs3ko8ycyg", title: "How To Do Preacher Curls", channel: "PureGym" },
  ],
  "bi_incline-curl-dumbbell": [
    { videoId: "aTYlqC_JacQ", title: "Incline Dumbbell Curl", channel: "Renaissance Periodization" },
    { videoId: "aG7CXiKxepw", title: "Incline Dumbbell Curl - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_concentration-curl": [
    { videoId: "llD6MImgqe8", title: "How To Do Concentration Curls", channel: "PureGym" },
    { videoId: "iJ-FAFeTJ2k", title: "Concentration Curl - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_spider-curl": [
    { videoId: "PWhIhFut6Tc", title: "Spider curls", channel: "mountaindog1" },
    { videoId: "i-MkPLU82Cw", title: "Spider Curl", channel: "Testosterone Nation" },
    { videoId: "9Dd8iiEUs_Q", title: "How To Do Spider Curls", channel: "PureGym" },
  ],
  "bi_bayesian-curl": [
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
    { videoId: "1u18yJELsh0", title: "Cable Overhead Triceps Extension", channel: "Renaissance Periodization" },
    { videoId: "ns-RGsbzqok", title: "Overhead Cable Tricep Extension", channel: "ChadMollickDotCom" },
  ],
  "bi_overhead-triceps-extension-dumbbell": [
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
    { videoId: "qrS6aa0aQ9I", title: "How To Do A Bodyweight Tricep Dip", channel: "PureGym" },
    { videoId: "JhX1nBnirNw", title: "How to Do：TRICEPS DIPS", channel: "Leap Fitness" },
    { videoId: "89_spgcdQlw", title: "How to do Tricep Dips (Beginner) | Joanna Soh", channel: "Joanna Soh" },
  ],
  "bi_bench-dip": [
    { videoId: "WVeZDBhZwLA", title: "How to do a Bench Dip  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "yvAzWxRsnqU", title: "Bench Dip", channel: "OPEX Fitness" },
  ],
  "bi_triceps-kickback": [
    { videoId: "rCp0ttMPflc", title: "The Chest-Supported Triceps Kickback", channel: "Testosterone Nation" },
    { videoId: "JPmbMOu4IYw", title: "How To Do A Tricep Kickback", channel: "PureGym" },
    { videoId: "vzi_BxHuKqA", title: "Banded Tricep Kickback", channel: "OPEX Fitness" },
  ],
  "bi_diamond-push-up": [
    { videoId: "K8bKxVcwjrk", title: "How To Do A Diamond Push up", channel: "PureGym" },
  ],
  "bi_jm-press": [
    { videoId: "Tih5iHyELsE", title: "JM Press", channel: "Renaissance Periodization" },
    { videoId: "qPyPCQnwsd8", title: "JM Press - OPEX Exercise Library", channel: "OPEX Fitness" },
    { videoId: "1qEZaOeqfgg", title: "JM Press", channel: "The Barbell Physio" },
  ],
  "bi_triceps-extension-machine": [
    { videoId: "Bx8ga1BLHLE", title: "Machine Triceps Extension", channel: "Renaissance Periodization" },
  ],
  "bi_farmer-s-walk": [
    { videoId: "8OtwXwrJizk", title: "How To Do A Farmer's Walk (Farmer's Carry)", channel: "PureGym" },
  ],
  "bi_dead-hang": [
    { videoId: "0Bx_Ap7-EwU", title: "Dead Hang", channel: "OPEX Fitness" },
  ],
  "bi_squat-barbell": [
    { videoId: "rrJIyZGlK8c", title: "How To Do A Barbell Back Squat", channel: "PureGym" },
    { videoId: "-bJIpOq-LWk", title: "How to do a Barbell Back Squat", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_front-squat": [
    { videoId: "HHxNbhP16UE", title: "Front Squat", channel: "Renaissance Periodization" },
    { videoId: "CE0uSrr4SYQ", title: "Movement Demo - The Front Squat", channel: "Rogue Fitness" },
  ],
  "bi_high-bar-squat": [
    { videoId: "i7J5h7BJ07g", title: "High Bar Squat", channel: "Renaissance Periodization" },
  ],
  "bi_box-squat": [
    { videoId: "-GaRp6_b2vk", title: "How to do a Box Squat", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "ktMbRDQ_7fc", title: "Box Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_goblet-squat": [
    { videoId: "3gpXflqRiEc", title: "How to Goblet Squat", channel: "Men's Health" },
    { videoId: "zBV3ceGyAxw", title: "How To Do A Goblet squat", channel: "PureGym" },
    { videoId: "pEGfGwp6IEA", title: "Goblet Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_squat-smith-machine": [
    { videoId: "-eO_VydErV0", title: "Feet Forward Smith Squat", channel: "Renaissance Periodization" },
    { videoId: "QcmonZUuumg", title: "Smith Machine Back Squat", channel: "OPEX Fitness" },
    { videoId: "vzqoYIf8T9c", title: "Smith Machine Squats", channel: "The Fitness Life - Strength & Lifestyle Coaching" },
  ],
  "bi_hack-squat": [
    { videoId: "rYgNArpwE7E", title: "Hack Squat", channel: "Renaissance Periodization" },
  ],
  "bi_leg-press": [
    { videoId: "yZmx_Ac3880", title: "Leg Press", channel: "Renaissance Periodization" },
    { videoId: "cDGOn-yfKJA", title: "How to do a Leg Press  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_leg-extension": [
    { videoId: "m0FOpMEgero", title: "Leg Extension", channel: "Renaissance Periodization" },
    { videoId: "4ZDm5EbiFI8", title: "How To Do A Leg Extension", channel: "PureGym" },
    { videoId: "gtZ4AwZVtMI", title: "How To Leg Extension for Bigger Quads | #shorts", channel: "Physique Development" },
  ],
  "bi_bulgarian-split-squat": [
    { videoId: "TEXl2b3__S4", title: "How To Do Bulgarian Split Squats", channel: "PureGym" },
    { videoId: "hbw7hdyOpq0", title: "How to do a Bulgarian Split Squat  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "vgn7bSXkgkA", title: "How to do a Bulgarian Split Squat / Proper Setup", channel: "Denvyr | Tall Girl Nutritionist" },
  ],
  "bi_lunge-dumbbell": [
    { videoId: "9gglI77Kzq8", title: "Dumbbell Lunge", channel: "OPEX Fitness" },
    { videoId: "t7DBjlOTwAk", title: "How To Dumbbell Alternating Forward Lunge", channel: "Third Space London" },
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
    { videoId: "wfhXnLILqdk", title: "Step Up Exercise | Osteoarthritis Physiotherapy", channel: "Cornerstone Physiotherapy" },
  ],
  "bi_air-squat": [
    { videoId: "iiKn5FiVUjI", title: "Air Squat - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_sissy-squat": [
    { videoId: "R_GgqlXwJDE", title: "Sissy squats", channel: "mountaindog1" },
    { videoId: "FTmbNjUu7CI", title: "Bodyweight Sissy Squat", channel: "Testosterone Nation" },
    { videoId: "_kuzM5gKU8U", title: "Sissy Squat", channel: "OPEX Fitness" },
  ],
  "bi_romanian-deadlift-barbell": [
    { videoId: "xgusDooVfKU", title: "How to do a Romanian Deadlift (Barbell) | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_romanian-deadlift-dumbbell": [
    { videoId: "aa57T45iFSE", title: "How to do a Dumbbell Romanian Deadlift | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
    { videoId: "xAL7lHwj30E", title: "Dumbbell Romanian Deadlift", channel: "Onnit Academy" },
    { videoId: "6USOovx8pYI", title: "Dumbbell Romanian Deadlift  - OPEX Exercise Library", channel: "OPEX Fitness" },
  ],
  "bi_lying-leg-curl": [
    { videoId: "n5WDXD_mpVY", title: "Lying Leg Curl", channel: "Renaissance Periodization" },
    { videoId: "jxctD6fL_FQ", title: "Lying Leg Curls - Leg Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "SbSNUXPRkc8", title: "How To Do A Lying Leg Curl (Prone Leg Curl)", channel: "PureGym" },
  ],
  "bi_seated-leg-curl": [
    { videoId: "Orxowest56U", title: "Seated Leg Curl", channel: "Renaissance Periodization" },
    { videoId: "_2Kd0d-JEUM", title: "How to do a Seated Leg Curl  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_nordic-hamstring-curl": [
    { videoId: "kjv4WQXWl_A", title: "Nordic Hamstring Curl", channel: "Onnit Academy" },
    { videoId: "Lgibr8od0yA", title: "How to Perform the GHD Nordic Hamstring Curl", channel: "Champion Physical Therapy and Performance" },
  ],
  "bi_glute-ham-raise": [
    { videoId: "m0AIU1dCVkU", title: "The Glute-Ham Raise", channel: "CrossFit" },
    { videoId: "SBGYSfoqyfU", title: "Glute Ham Raise", channel: "Renaissance Periodization" },
    { videoId: "eXgk59SwocU", title: "Glute Ham Raise", channel: "Testosterone Nation" },
  ],
  "bi_single-leg-romanian-deadlift": [
    { videoId: "MsE_T9nAsSE", title: "Single Leg RDL", channel: "[P]rehab" },
    { videoId: "GoKjrvJi-Iw", title: "The Right Way to Do Single-Leg RDLs", channel: "Testosterone Nation" },
    { videoId: "6pEL3KxnlEo", title: "How to do a Single-Leg Romanian Deadlift", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_hip-thrust-barbell": [
    { videoId: "EF7jXP17DPE", title: "Barbell Hip Thrust", channel: "Renaissance Periodization" },
    { videoId: "aweBS7K71l8", title: "How To Do A Barbell Hip Thrust", channel: "PureGym" },
    { videoId: "5S8SApGU_Lk", title: "Barbell Hip Thrust", channel: "John Rusin" },
  ],
  "bi_hip-thrust-machine": [
    { videoId: "ZSPmIyX9RZs", title: "Machine Hip Thrust", channel: "Renaissance Periodization" },
    { videoId: "01rcKtWWvwE", title: "HOW TO: use the Hip Thrust Machine | instructional video | Hype Training & Coaching", channel: "Shannon Porter" },
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
  "bi_cable-kickback": [
    { videoId: "SqO-VUEak2M", title: "How To Do Cable Kickbacks", channel: "PureGym" },
    { videoId: "iElJ4Ngx--k", title: "Cable Glute Kickback", channel: "OPEX Fitness" },
    { videoId: "dU1R-AHW4IM", title: "How To: Cable Glute Kickback", channel: "Kia Khadem" },
  ],
  "bi_kettlebell-swing": [
    { videoId: "1cVT3ee9mgU", title: "Kettlebell Swing", channel: "StrongFirst" },
    { videoId: "1FjAoO5McVI", title: "How To Do A Kettlebell Swing (Two Handed)", channel: "PureGym" },
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
  "bi_side-plank": [
    { videoId: "Oe9Tp9SvTCE", title: "How To Do A Side Plank", channel: "PureGym" },
    { videoId: "44ND4bOB-T0", title: "How to do a Side Plank  | Proper Form & Technique | NASM", channel: "National Academy of Sports Medicine (NASM)" },
  ],
  "bi_crunch": [
    { videoId: "NnVhqMQRvmM", title: "AB EXERCISE - How to do an abdominal crunch (ab crunch)", channel: "PureGym" },
  ],
  "bi_cable-crunch": [
    { videoId: "3qjoXDTuyOE", title: "Cable Crunch - Abs / Core Exercise - Bodybuilding.com", channel: "Bodybuilding.com" },
    { videoId: "ToJeyhydUxU", title: "Cable Crunch: Do It Right!", channel: "Testosterone Nation" },
    { videoId: "W_dwbtaLup0", title: "Cable Crunch", channel: "OPEX Fitness" },
  ],
  "bi_sit-up": [
    { videoId: "pCX65Mtc_Kk", title: "How To Do a Sit Up Correctly", channel: "Detroit Medical Center" },
  ],
  "bi_hanging-leg-raise": [
    { videoId: "Yrtvs-nEnk0", title: "How To Do Hanging Leg Raises", channel: "PureGym" },
  ],
  "bi_hanging-knee-raise": [
    { videoId: "RD_A-Z15ER4", title: "Hanging Knee Raise", channel: "Renaissance Periodization" },
    { videoId: "O7iDA3ory-w", title: "How To Do Hanging Knee Raises", channel: "PureGym" },
  ],
  "bi_lying-leg-raise": [
    { videoId: "Wp4BlxcFTkE", title: "Lying Leg Raises", channel: "LivestrongWoman" },
  ],
  "bi_ab-wheel-rollout": [
    { videoId: "DA2QGI0NPWU", title: "Ab Wheel Rollout", channel: "Testosterone Nation" },
    { videoId: "4HZCJLM5wBk", title: "Ab Wheel Rollout", channel: "OPEX Fitness" },
  ],
  "bi_russian-twist": [
    { videoId: "JyUqwkVpsi8", title: "Russian Twist", channel: "LivestrongWoman" },
    { videoId: "LlccOWys8IU", title: "How To Russian Twist | Nuffield Health", channel: "Nuffield Health" },
    { videoId: "99T1EfpMwPA", title: "How To Do A Russian Twist", channel: "PureGym" },
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
    { videoId: "U5pviWt7sMo", title: "Core Strength Technique: Dragon Flags", channel: "Coach Myers" },
    { videoId: "rNpwcQuF0sQ", title: "Eccentric Dragon Flag", channel: "OPEX Fitness" },
    { videoId: "mjCMq2zkbOo", title: "Dragon flag", channel: "Milko Georgiev" },
  ],
  "bi_power-clean": [
    { videoId: "e8TpDdMYq4Y", title: "Power Clean", channel: "OPEX Fitness" },
  ],
  "bi_hang-clean": [
    { videoId: "WCdhjfg7fv4", title: "Movement Demo - The Hang Clean", channel: "Rogue Fitness" },
  ],
  "bi_snatch": [
    { videoId: "Iy0vPROslAA", title: "How To Do A Squat Snatch", channel: "PureGym" },
    { videoId: "UBc5N_-xdqo", title: "SNATCH / Olympic weightlifting", channel: "TOROKHTIY" },
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
