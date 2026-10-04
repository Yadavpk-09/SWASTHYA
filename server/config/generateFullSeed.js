// server/config/generateFullSeed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('Password123!', salt);

// 28 Curated Exercises
const exercises = [
  {
    id: 'ex-1',
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    caloriesBurnEstimate: 120,
    instructions: [
      'Rest barbell securely across upper trapezius muscles with feet shoulder-width apart.',
      'Brace your core, hinge your hips back, and bend knees simultaneously.',
      'Descend until thighs are at least parallel to the floor, maintaining neutral spine.',
      'Drive forcefully through the mid-foot and heel to return to standing position.'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus fault).',
      'Heels lifting off the ground.',
      'Rounding the lower back in the bottom of the squat.'
    ]
  },
  {
    id: 'ex-2',
    name: 'Standard Push-Up',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid', 'Core'],
    caloriesBurnEstimate: 80,
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Engage glutes and core to keep body in a rigid straight line from head to heels.',
      'Lower chest towards floor by bending elbows back at a 45-degree angle.',
      'Press up firmly through palms until arms are fully extended.'
    ],
    commonMistakes: [
      'Sagging hips or piking pelvis up in the air.',
      'Flaring elbows straight out to 90 degrees.',
      'Craning neck downward before chest reaches the ground.'
    ]
  },
  {
    id: 'ex-3',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    muscleGroup: 'Legs',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    caloriesBurnEstimate: 110,
    instructions: [
      'Hold dumbbells in front of thighs with feet hip-width apart and soft knees.',
      'Hinge backward at hips, pushing glutes toward the wall behind you.',
      'Lower weights along shins while keeping back flat and lats tight.',
      'Squeeze glutes and extend hips forward to return to starting position.'
    ],
    commonMistakes: [
      'Rounding the thoracic or lumbar spine.',
      'Bending the knees too much into a regular squat.',
      'Allowing weights to drift away from the legs.'
    ]
  },
  {
    id: 'ex-4',
    name: 'Dumbbell Overhead Shoulder Press',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps', 'Upper Traps'],
    caloriesBurnEstimate: 95,
    instructions: [
      'Sit or stand tall holding dumbbells at shoulder height with palms facing forward.',
      'Brace core and press dumbbells directly overhead in an arc until arms are locked out.',
      'Lower slowly back to ear level with controlled cadence.'
    ],
    commonMistakes: [
      'Arching the lower back excessively to compensate for shoulder tightness.',
      'Bouncing weights off shoulders.',
      'Pressing forward instead of straight overhead.'
    ]
  },
  {
    id: 'ex-5',
    name: 'Plank Hold',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Shoulders'],
    caloriesBurnEstimate: 60,
    instructions: [
      'Rest on forearms with elbows directly under shoulders and legs extended.',
      'Tuck pelvis into posterior pelvic tilt and actively squeeze glutes and abs.',
      'Hold neutral spine with head aligned and breathe rhythmically.'
    ],
    commonMistakes: [
      'Holding your breath.',
      'Allowing lower back to hyperextend/dip.',
      'Poking butt into a mountain peak.'
    ]
  },
  {
    id: 'ex-6',
    name: 'Bodyweight Walking Lunges',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core Balance'],
    caloriesBurnEstimate: 100,
    instructions: [
      'Step forward with one leg, lowering hips until both knees are bent at roughly 90 degrees.',
      'Keep front knee tracking over toes and back knee hovering just off the ground.',
      'Drive through front heel to step forward into next lunge.'
    ],
    commonMistakes: [
      'Front knee pushing excessively past toes.',
      'Leaning torso too far forward.',
      'Losing balance by placing feet in one tight line.'
    ]
  },
  {
    id: 'ex-7',
    name: 'Dumbbell Bent-Over Row',
    muscleGroup: 'Back',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps'],
    caloriesBurnEstimate: 105,
    instructions: [
      'Hinge at hips at a 45-degree angle with a dumbbell in each hand.',
      'Pull elbows up and back towards ribcage, squeezing shoulder blades together at top.',
      'Lower weights smoothly with control without rounding spine.'
    ],
    commonMistakes: [
      'Using momentum or jerking torso upwards.',
      'Rounding upper spine.',
      'Flaring elbows out instead of pulling towards waist.'
    ]
  },
  {
    id: 'ex-8',
    name: 'Flat Dumbbell Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    caloriesBurnEstimate: 110,
    instructions: [
      'Lie flat on bench holding dumbbells directly over chest with arms extended.',
      'Lower dumbbells slowly toward mid-chest level, keeping elbows around 60 degrees from body.',
      'Press dumbbells back up, squeezing chest at the top.'
    ],
    commonMistakes: [
      'Letting wrists bend backward excessively.',
      'Feet dancing on the floor instead of anchored.',
      'Touching dumbbells together and clanging at the top.'
    ]
  },
  {
    id: 'ex-9',
    name: 'Mountain Climbers',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Core', 'Hip Flexors', 'Deltoids', 'Cardiovascular System'],
    caloriesBurnEstimate: 130,
    instructions: [
      'Start in a push-up position with hands beneath shoulders.',
      'Drive one knee toward chest without touching toe to floor.',
      'Rapidly switch legs in a running motion while maintaining a stable pelvis.'
    ],
    commonMistakes: [
      'Bouncing hips too high in the air.',
      'Hands drifting out in front of shoulders.',
      'Curling shoulders into the ears.'
    ]
  },
  {
    id: 'ex-10',
    name: 'Pull-Up / Assisted Pull-Up',
    muscleGroup: 'Back',
    equipment: 'Machine',
    difficulty: 'Advanced',
    demoUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Grip'],
    caloriesBurnEstimate: 115,
    instructions: [
      'Grip pull-up bar with overhand grip slightly wider than shoulder-width.',
      'Retract scapulae and pull chest up toward the bar until chin clears bar.',
      'Lower yourself slowly with complete control to a full dead hang.'
    ],
    commonMistakes: [
      'Kicking legs or kipping to swing body up.',
      'Only doing half reps without full lockout.',
      'Reaching chin forward without chest moving up.'
    ]
  },
  {
    id: 'ex-11',
    name: 'Bicycle Crunches',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Rectus Abdominis', 'Internal & External Obliques'],
    caloriesBurnEstimate: 85,
    instructions: [
      'Lie face up with hands lightly behind head and knees raised to 90 degrees.',
      'Rotate torso to bring right elbow toward left knee while extending right leg.',
      'Switch smoothly to opposite side in a continuous pedaling motion.'
    ],
    commonMistakes: [
      'Yanking neck with hands.',
      'Rushing reps without feeling muscle contraction.',
      'Elbows closing in instead of rotating thoracic spine.'
    ]
  },
  {
    id: 'ex-12',
    name: 'Dumbbell Bicep Curls',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    caloriesBurnEstimate: 70,
    instructions: [
      'Stand upright holding dumbbells at sides with palms facing forward.',
      'Keeping upper arms stationary, curl weights while contracting biceps.',
      'Hold peak squeeze for 1 second, then lower slowly.'
    ],
    commonMistakes: [
      'Swinging elbows forward or using momentum from lower back.',
      'Dropping weights too fast without eccentric tension.'
    ]
  },
  {
    id: 'ex-13',
    name: 'Dumbbell Lateral Raises',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Lateral Deltoids', 'Trapezius'],
    caloriesBurnEstimate: 65,
    instructions: [
      'Stand with feet hip-width apart holding dumbbells in front of thighs.',
      'Raise arms out to sides with slight bend in elbows until parallel to floor.',
      'Pause briefly and control the descent.'
    ],
    commonMistakes: [
      'Using weights that are too heavy and swinging torso.',
      'Raising hands above shoulder level or shrugging traps.'
    ]
  },
  {
    id: 'ex-14',
    name: 'Glute Bridge Hold & Reps',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Core'],
    caloriesBurnEstimate: 75,
    instructions: [
      'Lie flat on back with knees bent, feet flat on floor hip-width apart.',
      'Drive through heels to lift hips until knees, hips, and shoulders form a straight line.',
      'Squeeze glutes at top for 2 seconds, then lower under control.'
    ],
    commonMistakes: [
      'Hyperextending lower back at top.',
      'Pushing through toes instead of heels.'
    ]
  },
  {
    id: 'ex-15',
    name: 'Burpees with Jump',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    demoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Full Body Conditioning', 'Chest', 'Quadriceps', 'Cardiovascular System'],
    caloriesBurnEstimate: 160,
    instructions: [
      'From standing, drop into a squat and place hands on floor.',
      'Kick feet back into a push-up position and perform a push-up.',
      'Jump feet forward to hands and explosively jump vertically with hands overhead.'
    ],
    commonMistakes: [
      'Letting spine sag during plank kickback.',
      'Landing heavily on stiff knees.'
    ]
  },
  {
    id: 'ex-16',
    name: 'Incline Dumbbell Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Clavicular Head Pectoralis', 'Anterior Deltoids', 'Triceps'],
    caloriesBurnEstimate: 110,
    instructions: [
      'Set bench to a 30-to-45-degree incline and sit with dumbbells resting on thighs.',
      'Kick weights to shoulders and press up directly above upper chest.',
      'Lower dumbbells with elbows slightly tucked until reaching upper chest depth, then press forcefully.'
    ],
    commonMistakes: [
      'Incline set too steep (turning it into a shoulder press).',
      'Flaring elbows out horizontally at 90 degrees.'
    ]
  },
  {
    id: 'ex-17',
    name: 'Parallel Bar / Bench Tricep Dips',
    muscleGroup: 'Arms',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Triceps Brachii', 'Anterior Deltoid', 'Lower Chest'],
    caloriesBurnEstimate: 95,
    instructions: [
      'Grip dip bars or edge of bench with arms straight and shoulders packed down.',
      'Lower torso by bending elbows until upper arms are parallel to floor.',
      'Press through palms to lockout arms without shrugging shoulders.'
    ],
    commonMistakes: [
      'Dipping too deep with anterior shoulder rolling forward.',
      'Failing to reach 90-degree elbow bend.'
    ]
  },
  {
    id: 'ex-18',
    name: 'Russian Kettlebell Swings',
    muscleGroup: 'Full Body',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Posterior Chain', 'Glutes', 'Hamstrings', 'Core'],
    caloriesBurnEstimate: 140,
    instructions: [
      'Hinge at hips with feet shoulder-width, gripping kettlebell/dumbbell with both hands.',
      'Hike weight back between upper thighs, then snap hips forward explosively.',
      'Allow bell to float up to chest height driven entirely by hip power, not arms.'
    ],
    commonMistakes: [
      'Squatting the weight instead of hinging hips.',
      'Using shoulder muscles to lift rather than hip drive.'
    ]
  },
  {
    id: 'ex-19',
    name: 'Bulgarian Split Squats',
    muscleGroup: 'Legs',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Quadriceps', 'Glute Medius', 'Hamstrings', 'Balance'],
    caloriesBurnEstimate: 125,
    instructions: [
      'Stand facing away from bench, resting top of rear foot on bench.',
      'Lower front hip downward until front thigh is parallel to floor.',
      'Drive up through front heel while keeping torso upright.'
    ],
    commonMistakes: [
      'Front foot too close to bench jamming knee forward.',
      'Leaning excessively or losing hip alignment.'
    ]
  },
  {
    id: 'ex-20',
    name: 'Standing Hammer Curls',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Brachioradialis', 'Brachialis', 'Biceps'],
    caloriesBurnEstimate: 70,
    instructions: [
      'Hold dumbbells at sides with neutral grip (palms facing inward).',
      'Curl weights upward keeping wrists neutral and elbows stationary.',
      'Lower slowly under muscular tension.'
    ],
    commonMistakes: [
      'Swinging hips or elbows.',
      'Rotating wrists mid-curl.'
    ]
  },
  {
    id: 'ex-21',
    name: 'Lat Pulldown / Band Pull-Down',
    muscleGroup: 'Back',
    equipment: 'Machine',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Latissimus Dorsi', 'Teres Major', 'Biceps'],
    caloriesBurnEstimate: 95,
    instructions: [
      'Grip wide bar with overhand grip and sit with thighs secured under pads.',
      'Lean back slightly (10-15 degrees) and pull bar down to upper chest while driving elbows down.',
      'Control bar smoothly on ascent back to full arm extension.'
    ],
    commonMistakes: [
      'Pulling bar down behind neck.',
      'Rocking back and forth aggressively.'
    ]
  },
  {
    id: 'ex-22',
    name: 'Russian Core Twists',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Internal Obliques', 'External Obliques', 'Transverse Abdominis'],
    caloriesBurnEstimate: 85,
    instructions: [
      'Sit on floor with knees bent, leaning torso back at a 45-degree angle.',
      'Clasp hands together and rotate torso from side to side, tapping floor near hip.',
      'Maintain stable core and keep chest open.'
    ],
    commonMistakes: [
      'Moving only arms without rotating thoracic spine.',
      'Rounding lower spine into a slump.'
    ]
  },
  {
    id: 'ex-23',
    name: 'Hanging Knee Raises',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    demoUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Lower Abdominals', 'Hip Flexors', 'Forearm Grip'],
    caloriesBurnEstimate: 90,
    instructions: [
      'Hang from pull-up bar with overhand grip and active shoulders.',
      'Curl pelvis upward and bring knees up towards chest with control.',
      'Lower legs slowly without allowing body to swing.'
    ],
    commonMistakes: [
      'Swinging legs like a pendulum.',
      'Only lifting thighs without posterior pelvic tilt.'
    ]
  },
  {
    id: 'ex-24',
    name: 'Standing Calf Raises',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Ankle Stabilizers'],
    caloriesBurnEstimate: 60,
    instructions: [
      'Stand with balls of feet on a raised edge or floor with feet parallel.',
      'Push down into balls of feet and raise heels as high as possible.',
      'Pause at peak contraction for 1 second, then lower heels slowly below step level.'
    ],
    commonMistakes: [
      'Bouncing fast without full range of motion.',
      'Bending knees to cheat the lift.'
    ]
  },
  {
    id: 'ex-25',
    name: 'Face Pulls with Cable / Band',
    muscleGroup: 'Shoulders',
    equipment: 'Machine',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Rear Deltoids', 'Rotator Cuff', 'Rhomboids'],
    caloriesBurnEstimate: 75,
    instructions: [
      'Attach rope to cable pulley set at eye level.',
      'Pull rope towards nose, separating handles and rotating hands back to externally rotate shoulders.',
      'Squeeze upper back firmly, then return slowly.'
    ],
    commonMistakes: [
      'Setting pulley too low.',
      'Failing to externally rotate at end of pull.'
    ]
  },
  {
    id: 'ex-26',
    name: 'Diamond Push-Ups',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    demoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Triceps Medial & Lateral Heads', 'Inner Pectoralis', 'Core'],
    caloriesBurnEstimate: 90,
    instructions: [
      'Assume push-up position with thumbs and index fingers touching to form a diamond.',
      'Keep elbows tucked close to ribcage as you lower chest to touch diamond.',
      'Press up firmly through palms to full arm extension.'
    ],
    commonMistakes: [
      'Flaring elbows out wide.',
      'Sagging hips during ascent.'
    ]
  },
  {
    id: 'ex-27',
    name: 'Goblet Squats',
    muscleGroup: 'Legs',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Thoracic Spine'],
    caloriesBurnEstimate: 105,
    instructions: [
      'Hold single dumbbell or kettlebell vertically against chest with both hands.',
      'Stand with feet slightly wider than hips, toes angled out.',
      'Squat between knees keeping chest proud and elbows inside knees at bottom.'
    ],
    commonMistakes: [
      'Rounding upper back or dropping the dumbbell away from chest.',
      'Knees caving inwards on the way up.'
    ]
  },
  {
    id: 'ex-28',
    name: 'Side Plank Isometric Hold',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    demoUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    targetMuscles: ['Quadratus Lumborum', 'Obliques', 'Glute Medius'],
    caloriesBurnEstimate: 60,
    instructions: [
      'Lie on side with forearm flat on ground directly beneath shoulder.',
      'Lift hips off floor creating a straight diagonal line from head to heels.',
      'Hold position firmly while maintaining calm nasal breath.'
    ],
    commonMistakes: [
      'Sagging bottom hip toward mat.',
      'Rotating top shoulder forward.'
    ]
  }
];

// 14 Curated Asanas
const asanas = [
  {
    id: 'as-1',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    category: 'Standing',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Stand with big toes touching and heels slightly apart.',
      'Lift and spread toes, grounding firmly through all four corners of each foot.',
      'Engage quadriceps, tuck pelvis neutrally, and lengthen spine upward.',
      'Roll shoulders back and down, allowing arms to rest beside torso with palms facing forward.',
      'Breathe deeply through the nose, visualizing roots growing from feet into earth.'
    ],
    benefits: [
      'Improves posture and spinal alignment.',
      'Strengthens thighs, knees, and ankles.',
      'Fosters grounded mental stillness and focus.'
    ],
    precautions: [
      'If dizzy or lightheaded, stand with feet hip-width apart.',
      'Avoid locking knees backwards.'
    ]
  },
  {
    id: 'as-2',
    name: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'Inversion',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 60,
    instructions: [
      'Come onto all fours with wrists directly under shoulders and knees under hips.',
      'Tuck toes, lift knees off mat, and send sitting bones high toward ceiling.',
      'Press firmly through finger knuckles, lengthening spine and widening shoulders.',
      'Gently pedal heels toward mat, letting head hang naturally between biceps.'
    ],
    benefits: [
      'Decompresses spine and elongates hamstrings & calves.',
      'Strengthens arms, lats, and shoulders.',
      'Boosts brain circulation, reducing fatigue and mild stress.'
    ],
    precautions: [
      'Carpal tunnel syndrome or severe wrist sensitivity: use fists or yoga wedges.',
      'Late-term pregnancy or uncontrolled high blood pressure: proceed gently or bend knees.'
    ]
  },
  {
    id: 'as-3',
    name: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    category: 'Standing',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Step feet wide apart (around 4 feet). Turn right foot out 90 degrees, left foot slightly in.',
      'Inhale arms parallel to floor, palms down.',
      'Exhale and bend right knee to a 90-degree angle, tracking knee directly over ankle.',
      'Gaze past right fingertips with open chest and strong torso.'
    ],
    benefits: [
      'Builds stamina, leg strength, and pelvic hip mobility.',
      'Opens chest and lungs for deeper oxygen uptake.',
      'Stimulates abdominal organs and builds inner focus.'
    ],
    precautions: [
      'High blood pressure: keep hands on hips instead of outstretched.',
      'Knee injuries: avoid bending knee beyond 90 degrees.'
    ]
  },
  {
    id: 'as-4',
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    category: 'Backbend',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 30,
    instructions: [
      'Lie face down on mat, tops of feet flat, hands placed beside chest under shoulders.',
      'Press tops of feet, thighs, and pubis firmly into floor.',
      'Inhale to lift chest off floor using back muscles, keeping elbows gently bent and close to ribs.',
      'Broaden collarbones and lift gaze softly without crunching neck.'
    ],
    benefits: [
      'Strengthens entire spinal column and glutes.',
      'Stretches chest, lungs, shoulders, and abdomen.',
      'Counteracts rounded desk posture and eases mild depression.'
    ],
    precautions: [
      'Avoid during pregnancy or recent abdominal surgery.',
      'Do not compress lower back; engage core slightly to protect lumbar.'
    ]
  },
  {
    id: 'as-5',
    name: 'Tree Pose',
    sanskritName: 'Vrikshasana',
    category: 'Balance',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Shift weight onto left foot, rooting down through base.',
      'Bend right knee and place sole of right foot against inner left calf or inner thigh (never directly on knee).',
      'Bring palms together at heart center (Anjali Mudra) or extend arms upward like branches.',
      'Fix gaze (Drishti) on an unmoving spot in front of you.'
    ],
    benefits: [
      'Improves neuromuscular balance and coordination.',
      'Strengthens calves, ankles, thighs, and spine.',
      'Calms nervous system and sharpens concentration.'
    ],
    precautions: [
      'Never place foot directly against the knee joint.',
      'If balance is challenging, practice near a wall for support.'
    ]
  },
  {
    id: 'as-6',
    name: "Child's Pose",
    sanskritName: 'Balasana',
    category: 'Restorative',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 90,
    instructions: [
      'Kneel on floor with big toes touching and knees spread comfortably apart.',
      'Sit hips back onto heels and fold torso forward between thighs.',
      'Rest forehead gently on mat and extend arms forward or alongside legs.',
      'Breathe deeply into back ribs and release all tension in shoulders and jaw.'
    ],
    benefits: [
      'Gently stretches hips, thighs, and ankles.',
      'Calms parasympathetic nervous system, easing anxiety and fatigue.',
      'Alleviates back and neck tension.'
    ],
    precautions: [
      'Knee injury or pregnancy: keep knees wider apart or place cushion between buttocks and heels.'
    ]
  },
  {
    id: 'as-7',
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    category: 'Standing',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'From a lunge, plant back heel down at a 45-degree angle.',
      'Square hips toward front of mat and bend front knee to 90 degrees.',
      'Sweep arms overhead, palms facing each other, lifting heart and gazing softly upward.'
    ],
    benefits: [
      'Strengthens quadriceps, calves, and ankles.',
      'Stretches chest, lungs, and hip flexors.',
      'Builds grounded stamina and inner resilience.'
    ],
    precautions: [
      'High blood pressure: keep arms parallel with hands on hips.',
      'Neck problems: keep head neutral rather than tilting gaze up.'
    ]
  },
  {
    id: 'as-8',
    name: 'Extended Triangle Pose',
    sanskritName: 'Utthita Trikonasana',
    category: 'Standing',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Step feet wide apart. Turn right foot 90 degrees out, left foot slightly in.',
      'Extend arms sideways and reach right hand directly over right leg.',
      'Hinge at hip, resting right hand on shin or yoga block, and raise left arm vertically.'
    ],
    benefits: [
      'Stretches hamstrings, groins, and hips.',
      'Expands chest and improves spinal lateral mobility.',
      'Stimulates abdominal digestion and relieves stress.'
    ],
    precautions: [
      'Do not rest hand directly on knee joint.',
      'Avoid twisting torso down toward floor.'
    ]
  },
  {
    id: 'as-9',
    name: 'Bridge Pose',
    sanskritName: 'Setu Bandhasana',
    category: 'Backbend',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Lie flat on back with knees bent and feet flat on floor, hip-width apart.',
      'Press arms and feet down into mat, lifting hips toward ceiling.',
      'Interlace fingers beneath pelvis and roll shoulders underneath to broaden chest.'
    ],
    benefits: [
      'Rejuvenates tired legs and activates gluteal muscles.',
      'Opens chest, neck, and spine, reducing anxiety.',
      'Calms brain and helps alleviate mild stress.'
    ],
    precautions: [
      'Neck injuries: do not turn head from side to side while in posture.'
    ]
  },
  {
    id: 'as-10',
    name: 'Camel Pose',
    sanskritName: 'Ustrasana',
    category: 'Backbend',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 30,
    instructions: [
      'Kneel on mat with hips directly over knees, shins hip-width apart.',
      'Place hands on lower back fingers down, pressing hips gently forward.',
      'Inhale to lift sternum, arching backward to reach hands for heels if accessible.'
    ],
    benefits: [
      'Deeply expands respiratory capacity and chest.',
      'Stretches entire front of body, hip flexors, and throat.',
      'Invigorates energy and counters slouching habits.'
    ],
    precautions: [
      'High or low blood pressure: enter and exit slowly.',
      'Severe lower back issues: maintain hands on sacrum without reaching for heels.'
    ]
  },
  {
    id: 'as-11',
    name: 'Seated Forward Fold',
    sanskritName: 'Paschimottanasana',
    category: 'Restorative',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 60,
    instructions: [
      'Sit tall with legs straight out in front and feet flexed.',
      'Inhale arms overhead, lengthening spine.',
      'Exhale and fold forward from hip creases, holding shins, ankles, or outer feet with soft knees.'
    ],
    benefits: [
      'Soothes central nervous system and eases headache/insomnia.',
      'Stretches entire posterior chain from heels to spine.',
      'Massages abdominal viscera and improves digestion.'
    ],
    precautions: [
      'Herniated disc or sciatica: avoid deep rounding; keep knees bent and spine long.'
    ]
  },
  {
    id: 'as-12',
    name: 'Pigeon Pose',
    sanskritName: 'Eka Pada Rajakapotasana',
    category: 'Restorative',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 60,
    instructions: [
      'From downward dog, bring right knee forward behind right wrist, shin angled across mat.',
      'Slide left leg back with knee and top of foot flat on mat.',
      'Square hips and slowly fold forward over front shin, resting forehead on hands or mat.'
    ],
    benefits: [
      'Deeply opens hip rotators, piriformis, and glutes.',
      'Releases buried emotional tension and somatic stress.',
      'Alleviates chronic lower back stiffness.'
    ],
    precautions: [
      'Knee trauma: flex front foot firmly or substitute with reclining figure-four pose.'
    ]
  },
  {
    id: 'as-13',
    name: 'Boat Pose',
    sanskritName: 'Navasana',
    category: 'Balance',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 35,
    instructions: [
      'Sit with knees bent, feet flat on floor.',
      'Lean back slightly with proud chest and lift feet until shins are parallel to floor.',
      'Extend arms forward alongside legs parallel to floor, or straighten legs into full V-shape.'
    ],
    benefits: [
      'Develops iron deep core strength and hip flexor endurance.',
      'Stimulates thyroid and kidneys.',
      'Cultivates physical balance and mental willpower.'
    ],
    precautions: [
      'Low back strain: bend knees with shins parallel rather than full leg extension.'
    ]
  },
  {
    id: 'as-14',
    name: 'Corpse Pose',
    sanskritName: 'Shavasana',
    category: 'Restorative',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 180,
    instructions: [
      'Lie comfortably flat on back with legs relaxed, feet falling naturally open.',
      'Rest arms alongside body, hands about 6 inches from hips with palms facing up.',
      'Close eyes, relax jaw and forehead, and surrender body weight completely to the ground.'
    ],
    benefits: [
      'Integrates energetic benefits of physical practice.',
      'Lowers heart rate, blood pressure, and central fatigue.',
      'Induces profound parasympathetic state of restoration.'
    ],
    precautions: [
      'Lower back discomfort: place a bolster or rolled blanket under knees.'
    ]
  }
];

// 15 Curated Workout Plan Templates (Meets PRD FR3.2)
const workoutPlans = [
  {
    id: 'plan-1',
    title: 'Beginner Fat Loss & Full Body Awakening',
    description: 'A 3-day full body introductory routine combining multi-joint compound movements and metabolic circuits to ignite fat loss and build foundational motor patterns.',
    goalType: 'Fat Loss',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Full Body Activation & Core',
        focus: 'Chest, Quads, Core',
        exercises: [
          { exerciseId: 'ex-2', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'ex-6', sets: 3, reps: '10 per leg', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '30 sec', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '25 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Posterior Chain & Upper Pull',
        focus: 'Hamstrings, Back, Glutes',
        exercises: [
          { exerciseId: 'ex-3', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'ex-7', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'ex-12', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Metabolic Conditioning Blitz',
        focus: 'Full Body & Core Endurance',
        exercises: [
          { exerciseId: 'ex-1', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-4', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-11', sets: 3, reps: '20 reps', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '30 sec', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-2',
    title: 'Intermediate Hypertrophy Split (Upper / Lower)',
    description: 'A 4-day progressive overload split targeted at building balanced lean muscle mass and structural strength.',
    goalType: 'Muscle Gain',
    level: 'Intermediate',
    durationDays: 4,
    weeklyFrequency: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Upper Body Power & Chest',
        focus: 'Chest, Shoulders, Triceps',
        exercises: [
          { exerciseId: 'ex-8', sets: 4, reps: '8-10', restSeconds: 75 },
          { exerciseId: 'ex-4', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-2', sets: 3, reps: 'To failure', restSeconds: 60 },
          { exerciseId: 'ex-13', sets: 3, reps: '12-15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Lower Body Strength & Quads',
        focus: 'Quads, Hamstrings, Calves',
        exercises: [
          { exerciseId: 'ex-1', sets: 4, reps: '8', restSeconds: 90 },
          { exerciseId: 'ex-3', sets: 3, reps: '10', restSeconds: 75 },
          { exerciseId: 'ex-6', sets: 3, reps: '12 per leg', restSeconds: 60 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Upper Body Pull & Lats',
        focus: 'Back, Biceps, Rear Delts',
        exercises: [
          { exerciseId: 'ex-10', sets: 4, reps: '6-8', restSeconds: 90 },
          { exerciseId: 'ex-7', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-12', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 3, reps: '45 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Full Body Sculpt & Core Finish',
        focus: 'Hypertrophy & Core',
        exercises: [
          { exerciseId: 'ex-8', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-1', sets: 3, reps: '10', restSeconds: 75 },
          { exerciseId: 'ex-11', sets: 3, reps: '25', restSeconds: 45 },
          { exerciseId: 'ex-13', sets: 3, reps: '15', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-3',
    title: 'Yoga Flow & Spinal Decompression',
    description: 'Mindful 3-day routine combining classical asanas, core stability, and deep parasympathetic restoration.',
    goalType: 'Flexibility & Yoga',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Morning Sun Salutation & Spine Awakening',
        focus: 'Posture & Mobility',
        exercises: [
          { exerciseId: 'ex-5', sets: 3, reps: '30 sec', restSeconds: 30 },
          { exerciseId: 'ex-14', sets: 3, reps: '12', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Hip Openers & Standing Balances',
        focus: 'Hips & Balance',
        exercises: [
          { exerciseId: 'ex-6', sets: 3, reps: '8 per leg', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 3, reps: '30 sec', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Deep Restorative Relaxation Flow',
        focus: 'Stress Relief & Decompression',
        exercises: [
          { exerciseId: 'ex-14', sets: 2, reps: '10', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 2, reps: '20 sec', restSeconds: 30 }
        ]
      }
    ]
  },
  {
    id: 'plan-4',
    title: '5-Day Push-Pull-Legs Powerhouse',
    description: 'High-intensity athletic program for advanced lifters seeking rapid strength gains and peak conditioning.',
    goalType: 'Strength',
    level: 'Advanced',
    durationDays: 5,
    weeklyFrequency: 5,
    days: [
      {
        dayNumber: 1,
        title: 'Push Heavy (Chest/Shoulders/Triceps)',
        focus: 'Push Heavy',
        exercises: [
          { exerciseId: 'ex-8', sets: 4, reps: '6-8', restSeconds: 90 },
          { exerciseId: 'ex-4', sets: 4, reps: '8', restSeconds: 75 },
          { exerciseId: 'ex-2', sets: 3, reps: '15', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Pull Heavy (Back/Biceps)',
        focus: 'Pull Heavy',
        exercises: [
          { exerciseId: 'ex-10', sets: 4, reps: '6-8', restSeconds: 90 },
          { exerciseId: 'ex-7', sets: 4, reps: '8', restSeconds: 75 },
          { exerciseId: 'ex-12', sets: 3, reps: '10', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Legs & Calves Domination',
        focus: 'Quads & Hamstrings',
        exercises: [
          { exerciseId: 'ex-1', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'ex-3', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'ex-6', sets: 3, reps: '12 per leg', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Push Hypertrophy & Delts',
        focus: 'Shoulders & Chest Volume',
        exercises: [
          { exerciseId: 'ex-4', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'ex-13', sets: 4, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-2', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 5,
        title: 'Pull Volume & Core Conditioning',
        focus: 'Back & Core',
        exercises: [
          { exerciseId: 'ex-7', sets: 4, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 4, reps: '45 sec', restSeconds: 45 },
          { exerciseId: 'ex-11', sets: 3, reps: '25', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-5',
    title: 'HIIT Shred & Athletic Endurance',
    description: 'Fast-paced high intensity intervals combined with bodyweight plyometrics for fat burning and cardio conditioning.',
    goalType: 'Endurance',
    level: 'Intermediate',
    durationDays: 4,
    weeklyFrequency: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Cardio Core Ignition',
        focus: 'Full Body Fat Burn',
        exercises: [
          { exerciseId: 'ex-15', sets: 4, reps: '10', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 4, reps: '30 sec', restSeconds: 30 },
          { exerciseId: 'ex-5', sets: 3, reps: '40 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Dynamic Lower Body Agility',
        focus: 'Leg Explosiveness',
        exercises: [
          { exerciseId: 'ex-6', sets: 3, reps: '12 per leg', restSeconds: 45 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-15', sets: 3, reps: '8', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Upper Torso & Sprint Intervals',
        focus: 'Upper Stamina',
        exercises: [
          { exerciseId: 'ex-2', sets: 4, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-7', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '30 sec', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Metabolic Finisher Round',
        focus: 'Total Caloric Burn',
        exercises: [
          { exerciseId: 'ex-15', sets: 4, reps: '10', restSeconds: 45 },
          { exerciseId: 'ex-11', sets: 4, reps: '25', restSeconds: 30 },
          { exerciseId: 'ex-5', sets: 3, reps: '45 sec', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-6',
    title: 'Desk Worker Posture & Spine Alignment',
    description: 'Targeted counter-strain routine reversing rounded shoulders, anterior pelvic tilt, and neck tightness.',
    goalType: 'Flexibility & Yoga',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Thoracic Extension & Chest Release',
        focus: 'Upper Back & Chest',
        exercises: [
          { exerciseId: 'ex-7', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Glute & Core Anti-Sitting Activation',
        focus: 'Glutes & Abdominals',
        exercises: [
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 3, reps: '35 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Scapular Control & Posture Lock',
        focus: 'Rhomboids & Trapezius',
        exercises: [
          { exerciseId: 'ex-13', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-7', sets: 3, reps: '12', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'plan-7',
    title: 'Beginner Calisthenics & Bodyweight Mastery',
    description: 'Build functional relative strength, tendon resilience, and gymnastic control using zero weights.',
    goalType: 'Strength',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Push Fundamentals & Core Bracing',
        focus: 'Push & Core',
        exercises: [
          { exerciseId: 'ex-2', sets: 4, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '40 sec', restSeconds: 45 },
          { exerciseId: 'ex-28', sets: 3, reps: '25 sec/side', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Lower Body Dynamic Stability',
        focus: 'Legs & Calves',
        exercises: [
          { exerciseId: 'ex-6', sets: 4, reps: '12 per leg', restSeconds: 60 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-24', sets: 3, reps: '20', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Pull Progression & Core Endurance',
        focus: 'Back & Core',
        exercises: [
          { exerciseId: 'ex-10', sets: 3, reps: '5-8', restSeconds: 90 },
          { exerciseId: 'ex-22', sets: 3, reps: '20 reps', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '30 sec', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-8',
    title: '6-Day Elite Hypertrophy Push-Pull-Legs',
    description: 'High-volume 6-day split designed for seasoned lifters seeking maximal muscle growth through double weekly muscle frequency.',
    goalType: 'Muscle Gain',
    level: 'Advanced',
    durationDays: 6,
    weeklyFrequency: 6,
    days: [
      {
        dayNumber: 1,
        title: 'Push A (Chest Dominant)',
        focus: 'Chest & Triceps',
        exercises: [
          { exerciseId: 'ex-8', sets: 4, reps: '8-10', restSeconds: 75 },
          { exerciseId: 'ex-16', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-17', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Pull A (Lats & Back Width)',
        focus: 'Back & Biceps',
        exercises: [
          { exerciseId: 'ex-10', sets: 4, reps: '8', restSeconds: 90 },
          { exerciseId: 'ex-21', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-12', sets: 3, reps: '12', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Legs A (Quad Focus)',
        focus: 'Quads & Calves',
        exercises: [
          { exerciseId: 'ex-1', sets: 4, reps: '8', restSeconds: 120 },
          { exerciseId: 'ex-19', sets: 3, reps: '10 per leg', restSeconds: 75 },
          { exerciseId: 'ex-24', sets: 4, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Push B (Delts & Triceps)',
        focus: 'Shoulders & Triceps',
        exercises: [
          { exerciseId: 'ex-4', sets: 4, reps: '8-10', restSeconds: 75 },
          { exerciseId: 'ex-13', sets: 4, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-26', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 5,
        title: 'Pull B (Upper Back & Arms)',
        focus: 'Rhomboids & Biceps',
        exercises: [
          { exerciseId: 'ex-7', sets: 4, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-25', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-20', sets: 3, reps: '12', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 6,
        title: 'Legs B (Hamstrings & Posterior Chain)',
        focus: 'Hamstrings & Glutes',
        exercises: [
          { exerciseId: 'ex-3', sets: 4, reps: '10', restSeconds: 90 },
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 60 },
          { exerciseId: 'ex-27', sets: 3, reps: '12', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'plan-9',
    title: 'Athletic Speed & Plyometric Conditioning',
    description: 'Explosive athletic development combining Olympic hip extensions, jumping mechanics, and rotational velocity.',
    goalType: 'Endurance',
    level: 'Intermediate',
    durationDays: 4,
    weeklyFrequency: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Posterior Explosiveness & Hip Snap',
        focus: 'Glutes & Speed',
        exercises: [
          { exerciseId: 'ex-18', sets: 4, reps: '15', restSeconds: 60 },
          { exerciseId: 'ex-15', sets: 4, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '45 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Unilateral Stability & Change of Direction',
        focus: 'Single-leg Balance',
        exercises: [
          { exerciseId: 'ex-19', sets: 3, reps: '10 per leg', restSeconds: 60 },
          { exerciseId: 'ex-6', sets: 3, reps: '12 per leg', restSeconds: 45 },
          { exerciseId: 'ex-28', sets: 3, reps: '30 sec/side', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Rotational Power & Anti-Flexion Core',
        focus: 'Rotational Core',
        exercises: [
          { exerciseId: 'ex-22', sets: 4, reps: '20', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 4, reps: '35 sec', restSeconds: 45 },
          { exerciseId: 'ex-2', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Metabolic Caloric Finisher',
        focus: 'Anaerobic Threshold',
        exercises: [
          { exerciseId: 'ex-15', sets: 4, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-18', sets: 4, reps: '15', restSeconds: 60 },
          { exerciseId: 'ex-11', sets: 3, reps: '30', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-10',
    title: 'Vinyasa Power Flow & Core Equilibrium',
    description: 'Dynamic 4-day athletic yoga flow fusing strength isometric holds, deep flexibility, and breath control.',
    goalType: 'Flexibility & Yoga',
    level: 'Intermediate',
    durationDays: 4,
    weeklyFrequency: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Standing Strength & Hip Balance',
        focus: 'Legs & Balance',
        exercises: [
          { exerciseId: 'ex-6', sets: 3, reps: '10 per leg', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 3, reps: '45 sec', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Core Fire & Lateral Stabilization',
        focus: 'Obliques & Abs',
        exercises: [
          { exerciseId: 'ex-28', sets: 3, reps: '35 sec/side', restSeconds: 45 },
          { exerciseId: 'ex-11', sets: 3, reps: '20', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Upper Spine Opening & Posture',
        focus: 'Chest & Thoracic',
        exercises: [
          { exerciseId: 'ex-14', sets: 3, reps: '15', restSeconds: 30 },
          { exerciseId: 'ex-25', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Deep Restorative Integration',
        focus: 'Mindful Recovery',
        exercises: [
          { exerciseId: 'ex-14', sets: 2, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 2, reps: '30 sec', restSeconds: 30 }
        ]
      }
    ]
  },
  {
    id: 'plan-11',
    title: '3-Day Express Full-Body Time-Saver',
    description: 'Maximum efficiency workout for busy college students and professionals designed to complete in 30 minutes.',
    goalType: 'Fat Loss',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Express Full Body Circuit A',
        focus: 'Chest & Legs',
        exercises: [
          { exerciseId: 'ex-27', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-2', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 3, reps: '35 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Express Full Body Circuit B',
        focus: 'Back & Hamstrings',
        exercises: [
          { exerciseId: 'ex-3', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-7', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-11', sets: 3, reps: '20', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Express Full Body Circuit C',
        focus: 'Full Body Metabolic',
        exercises: [
          { exerciseId: 'ex-18', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-4', sets: 3, reps: '10', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '30 sec', restSeconds: 30 }
        ]
      }
    ]
  },
  {
    id: 'plan-12',
    title: 'Core & Obliques Iron Fortress',
    description: 'Dedicated 3-day targeted core development improving spine safety, rotational torque, and athletic posture.',
    goalType: 'Strength',
    level: 'Intermediate',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Anti-Extension & Deep Abdominals',
        focus: 'Transverse Abdominis',
        exercises: [
          { exerciseId: 'ex-5', sets: 4, reps: '50 sec', restSeconds: 45 },
          { exerciseId: 'ex-23', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-11', sets: 3, reps: '25', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Anti-Rotation & Lateral Obliques',
        focus: 'Obliques & Quadratus',
        exercises: [
          { exerciseId: 'ex-28', sets: 4, reps: '35 sec/side', restSeconds: 45 },
          { exerciseId: 'ex-22', sets: 4, reps: '20', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '30 sec', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Posterior Stabilization & Glutes',
        focus: 'Glutes & Lower Back',
        exercises: [
          { exerciseId: 'ex-14', sets: 4, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-3', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '40 sec', restSeconds: 30 }
        ]
      }
    ]
  },
  {
    id: 'plan-13',
    title: 'Advanced Powerlifting Big 3 Foundations',
    description: 'Heavy strength program centered around the Squat, Bench Press, and Deadlift with accessory balance.',
    goalType: 'Strength',
    level: 'Advanced',
    durationDays: 4,
    weeklyFrequency: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Heavy Squat Day',
        focus: 'Squats & Legs',
        exercises: [
          { exerciseId: 'ex-1', sets: 5, reps: '5', restSeconds: 150 },
          { exerciseId: 'ex-19', sets: 3, reps: '8 per leg', restSeconds: 75 },
          { exerciseId: 'ex-24', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Heavy Bench Press Day',
        focus: 'Bench & Chest',
        exercises: [
          { exerciseId: 'ex-8', sets: 5, reps: '5', restSeconds: 120 },
          { exerciseId: 'ex-4', sets: 3, reps: '8', restSeconds: 75 },
          { exerciseId: 'ex-17', sets: 3, reps: '10', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Heavy Deadlift & Pull Day',
        focus: 'Deadlifts & Back',
        exercises: [
          { exerciseId: 'ex-3', sets: 5, reps: '5', restSeconds: 150 },
          { exerciseId: 'ex-10', sets: 4, reps: '6', restSeconds: 90 },
          { exerciseId: 'ex-7', sets: 3, reps: '8', restSeconds: 75 }
        ]
      },
      {
        dayNumber: 4,
        title: 'Upper Accessories & Shoulder Armor',
        focus: 'Shoulders & Arms',
        exercises: [
          { exerciseId: 'ex-16', sets: 4, reps: '8', restSeconds: 75 },
          { exerciseId: 'ex-13', sets: 4, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-20', sets: 3, reps: '10', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'plan-14',
    title: 'Restorative Yoga & Sleep Restoration',
    description: 'Gentle, therapeutic 3-day sequence shifting brainwaves from beta to alpha/theta for optimal recovery.',
    goalType: 'Flexibility & Yoga',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Evening Pelvic & Spine Release',
        focus: 'Lower Back & Pelvis',
        exercises: [
          { exerciseId: 'ex-14', sets: 2, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-5', sets: 2, reps: '25 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Chest & Shoulder Decompression',
        focus: 'Upper Back & Ribs',
        exercises: [
          { exerciseId: 'ex-25', sets: 2, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-14', sets: 2, reps: '10', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Full Body Grounding Savasana Preparation',
        focus: 'Parasympathetic Calming',
        exercises: [
          { exerciseId: 'ex-5', sets: 2, reps: '20 sec', restSeconds: 30 },
          { exerciseId: 'ex-14', sets: 2, reps: '10', restSeconds: 30 }
        ]
      }
    ]
  },
  {
    id: 'plan-15',
    title: 'Joint Longevity & Functional Mobility',
    description: 'Low-impact sustainable routine focusing on joint synovial fluid circulation, cartilage nourishment, and balance.',
    goalType: 'Endurance',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Hip & Knee Lubrication',
        focus: 'Hips & Knees',
        exercises: [
          { exerciseId: 'ex-27', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-14', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-24', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Scapular & Shoulder Health',
        focus: 'Rotator Cuff & Posture',
        exercises: [
          { exerciseId: 'ex-25', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'ex-7', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '30 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Functional Core & Kinetic Walk',
        focus: 'Core & Gait',
        exercises: [
          { exerciseId: 'ex-6', sets: 3, reps: '8 per leg', restSeconds: 45 },
          { exerciseId: 'ex-28', sets: 3, reps: '20 sec/side', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '20 sec', restSeconds: 45 }
        ]
      }
    ]
  }
];

// Curated Meditations (FR5.3)
const meditations = [
  {
    id: 'med-1',
    title: '5-Minute Mindful Breath & Grounding',
    instructor: 'Dr. Tara Brach',
    durationMinutes: 5,
    category: 'Mindfulness',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
    description: 'A swift, powerful mindfulness meditation that resets an overwhelmed mind through breath anchoring and body presence.'
  },
  {
    id: 'med-2',
    title: '10-Minute Full Body Scan for Stress Release',
    instructor: 'Jon Kabat-Zinn, Ph.D.',
    durationMinutes: 10,
    category: 'Stress Relief',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/u4gZgnCy5ew',
    description: 'Classical MBSR body scan cultivating non-judgmental somatic awareness to release tightness in shoulders, neck, and jaw.'
  },
  {
    id: 'med-3',
    title: '15-Minute Yoga Nidra Deep Sleep Journey',
    instructor: 'Ally Boothroyd',
    durationMinutes: 15,
    category: 'Sleep & Rest',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/BZZx-P1jG5s',
    description: 'Guided psychic sleep inducing delta and theta brainwave tranquility. Perfect for evening unwinding or sleepless nights.'
  },
  {
    id: 'med-4',
    title: '7-Minute Morning Motivation & Mental Clarity',
    instructor: 'Headspace Guidance',
    durationMinutes: 7,
    category: 'Morning Energy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/W19PdslWyt8',
    description: 'Awaken cognitive focus and align positive intentions before embarking on your workouts or university classes.'
  },
  {
    id: 'med-5',
    title: '12-Minute Tibetan Singing Bowl Sound Healing',
    instructor: 'Temple of Sound Sanctuary',
    durationMinutes: 12,
    category: 'Sound Healing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/1ZYbU851ViU',
    description: 'Harmonic 432Hz overtone frequencies designed to synchronize bilateral brain hemispheres and disperse anxiety.'
  },
  {
    id: 'med-6',
    title: '5-Minute Emergency Anxiety Calming Sequence',
    instructor: 'The Mindful Movement',
    durationMinutes: 5,
    category: 'Anxiety',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8',
    description: 'Immediate vagus nerve parasympathetic activation to stop racing heartbeats, exam stress, and sudden panic.'
  }
];

// Read existing db.json to preserve users/logs if present
const dbFilePath = path.join(__dirname, '..', 'data', 'db.json');
let existingDb = {};
if (fs.existsSync(dbFilePath)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  } catch (e) {
    console.error('Failed reading existing db.json:', e);
  }
}

// Generate the updated db.json
const updatedDb = {
  users: existingDb.users || [],
  exercises: exercises,
  asanas: asanas,
  workoutPlans: workoutPlans,
  meditations: meditations,
  badges: existingDb.badges || [],
  progressLogs: existingDb.progressLogs || [],
  wellnessLogs: existingDb.wellnessLogs || [],
  foodItems: existingDb.foodItems || [],
  stressRoadmaps: existingDb.stressRoadmaps || {}
};

fs.writeFileSync(dbFilePath, JSON.stringify(updatedDb, null, 2), 'utf-8');
console.log('Successfully generated complete SWASTHYA seed and updated db.json!');
