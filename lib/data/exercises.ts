// Built-in exercise library: [name, muscle, equipment]
export const MUSCLES = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quads", "Hamstrings", "Glutes", "Calves", "Core", "Full Body", "Cardio", "Other"] as const;
export const EQUIPMENT = ["Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Band", "Smith Machine", "EZ Bar", "Trap Bar", "Cardio", "Other"] as const;

export const BUILTIN_EXERCISES: [string, string, string][] = [
  // Chest
  ["Bench Press (Barbell)", "Chest", "Barbell"], ["Bench Press (Dumbbell)", "Chest", "Dumbbell"], ["Bench Press (Smith Machine)", "Chest", "Smith Machine"],
  ["Incline Bench Press (Barbell)", "Chest", "Barbell"], ["Incline Bench Press (Dumbbell)", "Chest", "Dumbbell"], ["Decline Bench Press (Barbell)", "Chest", "Barbell"],
  ["Decline Bench Press (Dumbbell)", "Chest", "Dumbbell"], ["Chest Press (Machine)", "Chest", "Machine"], ["Incline Chest Press (Machine)", "Chest", "Machine"],
  ["Chest Fly (Dumbbell)", "Chest", "Dumbbell"], ["Incline Chest Fly (Dumbbell)", "Chest", "Dumbbell"], ["Chest Fly (Machine)", "Chest", "Machine"],
  ["Cable Crossover", "Chest", "Cable"], ["Low Cable Fly", "Chest", "Cable"], ["Push Up", "Chest", "Bodyweight"], ["Incline Push Up", "Chest", "Bodyweight"],
  ["Decline Push Up", "Chest", "Bodyweight"], ["Chest Dip", "Chest", "Bodyweight"], ["Floor Press (Barbell)", "Chest", "Barbell"], ["Pullover (Dumbbell)", "Chest", "Dumbbell"],
  ["Close Grip Bench Press", "Triceps", "Barbell"],
  // Back
  ["Deadlift (Barbell)", "Back", "Barbell"], ["Deadlift (Trap Bar)", "Back", "Trap Bar"], ["Sumo Deadlift", "Back", "Barbell"], ["Rack Pull", "Back", "Barbell"],
  ["Bent Over Row (Barbell)", "Back", "Barbell"], ["Bent Over Row (Dumbbell)", "Back", "Dumbbell"], ["Pendlay Row", "Back", "Barbell"], ["T-Bar Row", "Back", "Barbell"],
  ["Seated Cable Row", "Back", "Cable"], ["Chest Supported Row (Dumbbell)", "Back", "Dumbbell"], ["Row (Machine)", "Back", "Machine"], ["Single Arm Row (Dumbbell)", "Back", "Dumbbell"],
  ["Pull Up", "Back", "Bodyweight"], ["Chin Up", "Back", "Bodyweight"], ["Pull Up (Assisted)", "Back", "Machine"], ["Lat Pulldown (Cable)", "Back", "Cable"],
  ["Close Grip Lat Pulldown", "Back", "Cable"], ["Straight Arm Pulldown", "Back", "Cable"], ["Inverted Row", "Back", "Bodyweight"], ["Back Extension", "Back", "Bodyweight"],
  ["Good Morning", "Back", "Barbell"], ["Shrug (Barbell)", "Back", "Barbell"], ["Shrug (Dumbbell)", "Back", "Dumbbell"], ["Face Pull", "Shoulders", "Cable"],
  ["Meadows Row", "Back", "Barbell"], ["Seal Row", "Back", "Barbell"],
  // Shoulders
  ["Overhead Press (Barbell)", "Shoulders", "Barbell"], ["Overhead Press (Dumbbell)", "Shoulders", "Dumbbell"], ["Seated Overhead Press (Dumbbell)", "Shoulders", "Dumbbell"],
  ["Shoulder Press (Machine)", "Shoulders", "Machine"], ["Arnold Press", "Shoulders", "Dumbbell"], ["Push Press", "Shoulders", "Barbell"],
  ["Lateral Raise (Dumbbell)", "Shoulders", "Dumbbell"], ["Lateral Raise (Cable)", "Shoulders", "Cable"], ["Lateral Raise (Machine)", "Shoulders", "Machine"],
  ["Front Raise (Dumbbell)", "Shoulders", "Dumbbell"], ["Front Raise (Plate)", "Shoulders", "Other"], ["Reverse Fly (Dumbbell)", "Shoulders", "Dumbbell"],
  ["Reverse Fly (Machine)", "Shoulders", "Machine"], ["Upright Row (Barbell)", "Shoulders", "Barbell"], ["Landmine Press", "Shoulders", "Barbell"], ["Handstand Push Up", "Shoulders", "Bodyweight"],
  ["Band Pull Apart", "Shoulders", "Band"],
  // Biceps
  ["Bicep Curl (Barbell)", "Biceps", "Barbell"], ["Bicep Curl (Dumbbell)", "Biceps", "Dumbbell"], ["Bicep Curl (Cable)", "Biceps", "Cable"], ["EZ Bar Curl", "Biceps", "EZ Bar"],
  ["Hammer Curl (Dumbbell)", "Biceps", "Dumbbell"], ["Preacher Curl (EZ Bar)", "Biceps", "EZ Bar"], ["Preacher Curl (Machine)", "Biceps", "Machine"],
  ["Incline Curl (Dumbbell)", "Biceps", "Dumbbell"], ["Concentration Curl", "Biceps", "Dumbbell"], ["Spider Curl", "Biceps", "Dumbbell"], ["Cable Rope Hammer Curl", "Biceps", "Cable"],
  ["Bayesian Curl", "Biceps", "Cable"], ["Reverse Curl (EZ Bar)", "Forearms", "EZ Bar"],
  // Triceps
  ["Triceps Pushdown (Cable)", "Triceps", "Cable"], ["Triceps Rope Pushdown", "Triceps", "Cable"], ["Overhead Triceps Extension (Cable)", "Triceps", "Cable"],
  ["Overhead Triceps Extension (Dumbbell)", "Triceps", "Dumbbell"], ["Skullcrusher (EZ Bar)", "Triceps", "EZ Bar"], ["Skullcrusher (Dumbbell)", "Triceps", "Dumbbell"],
  ["Triceps Dip", "Triceps", "Bodyweight"], ["Bench Dip", "Triceps", "Bodyweight"], ["Triceps Kickback", "Triceps", "Dumbbell"], ["Diamond Push Up", "Triceps", "Bodyweight"],
  ["JM Press", "Triceps", "Barbell"], ["Triceps Extension (Machine)", "Triceps", "Machine"],
  // Forearms
  ["Wrist Curl (Barbell)", "Forearms", "Barbell"], ["Reverse Wrist Curl", "Forearms", "Dumbbell"], ["Farmer's Walk", "Forearms", "Dumbbell"], ["Dead Hang", "Forearms", "Bodyweight"],
  // Legs
  ["Squat (Barbell)", "Quads", "Barbell"], ["Front Squat", "Quads", "Barbell"], ["High Bar Squat", "Quads", "Barbell"], ["Box Squat", "Quads", "Barbell"],
  ["Goblet Squat", "Quads", "Dumbbell"], ["Squat (Smith Machine)", "Quads", "Smith Machine"], ["Hack Squat", "Quads", "Machine"], ["Leg Press", "Quads", "Machine"],
  ["Leg Extension", "Quads", "Machine"], ["Bulgarian Split Squat", "Quads", "Dumbbell"], ["Lunge (Dumbbell)", "Quads", "Dumbbell"], ["Walking Lunge", "Quads", "Dumbbell"],
  ["Reverse Lunge (Barbell)", "Quads", "Barbell"], ["Step Up", "Quads", "Dumbbell"], ["Pistol Squat", "Quads", "Bodyweight"], ["Air Squat", "Quads", "Bodyweight"],
  ["Sissy Squat", "Quads", "Bodyweight"], ["Belt Squat", "Quads", "Machine"], ["Pendulum Squat", "Quads", "Machine"],
  ["Romanian Deadlift (Barbell)", "Hamstrings", "Barbell"], ["Romanian Deadlift (Dumbbell)", "Hamstrings", "Dumbbell"], ["Stiff Leg Deadlift", "Hamstrings", "Barbell"],
  ["Lying Leg Curl", "Hamstrings", "Machine"], ["Seated Leg Curl", "Hamstrings", "Machine"], ["Nordic Hamstring Curl", "Hamstrings", "Bodyweight"], ["Glute Ham Raise", "Hamstrings", "Bodyweight"],
  ["Single Leg Romanian Deadlift", "Hamstrings", "Dumbbell"],
  ["Hip Thrust (Barbell)", "Glutes", "Barbell"], ["Hip Thrust (Machine)", "Glutes", "Machine"], ["Glute Bridge", "Glutes", "Bodyweight"], ["Cable Pull Through", "Glutes", "Cable"],
  ["Hip Abduction (Machine)", "Glutes", "Machine"], ["Hip Adduction (Machine)", "Quads", "Machine"], ["Cable Kickback", "Glutes", "Cable"], ["Kettlebell Swing", "Glutes", "Kettlebell"],
  ["Standing Calf Raise", "Calves", "Machine"], ["Seated Calf Raise", "Calves", "Machine"], ["Calf Press (Leg Press)", "Calves", "Machine"], ["Single Leg Calf Raise", "Calves", "Bodyweight"],
  // Core
  ["Plank", "Core", "Bodyweight"], ["Side Plank", "Core", "Bodyweight"], ["Crunch", "Core", "Bodyweight"], ["Cable Crunch", "Core", "Cable"], ["Sit Up", "Core", "Bodyweight"],
  ["Hanging Leg Raise", "Core", "Bodyweight"], ["Hanging Knee Raise", "Core", "Bodyweight"], ["Lying Leg Raise", "Core", "Bodyweight"], ["Ab Wheel Rollout", "Core", "Other"],
  ["Russian Twist", "Core", "Bodyweight"], ["Pallof Press", "Core", "Cable"], ["Dead Bug", "Core", "Bodyweight"], ["Mountain Climber", "Core", "Bodyweight"],
  ["Bicycle Crunch", "Core", "Bodyweight"], ["Woodchopper (Cable)", "Core", "Cable"], ["Hollow Hold", "Core", "Bodyweight"], ["Dragon Flag", "Core", "Bodyweight"],
  // Full body / Olympic
  ["Power Clean", "Full Body", "Barbell"], ["Hang Clean", "Full Body", "Barbell"], ["Clean and Jerk", "Full Body", "Barbell"], ["Snatch", "Full Body", "Barbell"],
  ["Thruster (Barbell)", "Full Body", "Barbell"], ["Burpee", "Full Body", "Bodyweight"], ["Turkish Get Up", "Full Body", "Kettlebell"], ["Kettlebell Clean and Press", "Full Body", "Kettlebell"],
  ["Sled Push", "Full Body", "Other"], ["Battle Ropes", "Full Body", "Other"], ["Box Jump", "Quads", "Bodyweight"], ["Muscle Up", "Back", "Bodyweight"],
  // Cardio
  ["Running", "Cardio", "Cardio"], ["Treadmill", "Cardio", "Cardio"], ["Cycling", "Cardio", "Cardio"], ["Rowing (Machine)", "Cardio", "Cardio"], ["Elliptical", "Cardio", "Cardio"],
  ["Stair Climber", "Cardio", "Cardio"], ["Jump Rope", "Cardio", "Cardio"], ["Swimming", "Cardio", "Cardio"], ["Walking", "Cardio", "Cardio"], ["Assault Bike", "Cardio", "Cardio"],
];

export const builtinId = (name: string) =>
  "bi_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
