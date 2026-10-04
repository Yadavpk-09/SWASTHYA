// server/config/seedData.js
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('Password123!', salt);

export const initialExercises = [
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
  }
];

export const initialAsanas = [
  {
    id: 'as-1',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    category: 'Standing & Alignment',
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
    category: 'Inversion & Full Body',
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
    category: 'Standing & Stamina',
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
    category: 'Backbend & Chest Opener',
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
    category: 'Balance & Focus',
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
    category: 'Restorative & Relaxation',
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
      'Severe knee injuries or diarrhea: place a folded blanket under hips or avoid deep flexion.'
    ]
  },
  {
    id: 'as-7',
    name: 'Bridge Pose',
    sanskritName: 'Setu Bandhasana',
    category: 'Spinal Extension',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 45,
    instructions: [
      'Lie on back with knees bent, feet flat on floor hip-width apart and close to glutes.',
      'Rest arms beside body with palms down.',
      'Press through feet to elevate pelvis and chest upward, clasping hands underneath if comfortable.',
      'Keep thighs parallel and chin lifted slightly away from sternum.'
    ],
    benefits: [
      'Re-energizes tired legs and stimulates thyroid gland.',
      'Stretches chest, neck, and spine.',
      'Reduces anxiety, insomnia, and stress headaches.'
    ],
    precautions: [
      'Avoid turning head from side to side while in the pose to protect cervical spine.'
    ]
  },
  {
    id: 'as-8',
    name: 'Cat-Cow Flow',
    sanskritName: 'Marjaryasana-Bitilasana',
    category: 'Mobility & Spine Flow',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 60,
    instructions: [
      'Start on hands and knees with neutral spine.',
      'Inhale into Cow: drop belly toward mat, lift chest and tailbone, gaze softly upward.',
      'Exhale into Cat: press floor away, round spine upward, draw navel toward spine and tuck chin.',
      'Repeat in sync with smooth, fluid breath.'
    ],
    benefits: [
      'Warms up spine and lubricates spinal discs.',
      'Massages abdominal organs and improves digestion.',
      'Coordinates breath with spinal flexion and extension.'
    ],
    precautions: [
      'Wrist discomfort: place hands slightly forward or rest on fists.'
    ]
  },
  {
    id: 'as-9',
    name: 'Corpse Pose',
    sanskritName: 'Shavasana',
    category: 'Restorative & Deep Calm',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    holdDurationSeconds: 300,
    instructions: [
      'Lie flat on back with legs naturally falling open and arms resting beside body, palms up.',
      'Close eyes, relax jaw, soften brow, and allow entire body weight to sink into mat.',
      'Surrender control of breath and remain in quiet, passive awareness.'
    ],
    benefits: [
      'Lowers heart rate and blood pressure.',
      'Integrates benefits of physical practice.',
      'Deeply resets central nervous system from sympathetic to parasympathetic state.'
    ],
    precautions: [
      'If lower back aches, place a bolster or pillow beneath knees.'
    ]
  }
];

export const initialWorkoutPlans = [
  {
    id: 'plan-1',
    title: 'Beginner Fat Loss & Metabolic Kickstart',
    description: 'A 3-day full body circuit engineered for maximum calorie burn, lean muscle toning, and beginner safety.',
    goalType: 'Fat Loss',
    level: 'Beginner',
    durationDays: 3,
    weeklyFrequency: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Full Body Activation A',
        focus: 'Chest, Quads, Core',
        exercises: [
          { exerciseId: 'ex-2', sets: 3, reps: '8-10', restSeconds: 60 },
          { exerciseId: 'ex-6', sets: 3, reps: '10 per leg', restSeconds: 60 },
          { exerciseId: 'ex-5', sets: 3, reps: '30 sec', restSeconds: 45 },
          { exerciseId: 'ex-9', sets: 3, reps: '20 sec', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Posterior & Pull Strength',
        focus: 'Back, Hamstrings, Biceps',
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
  }
];

export const initialBadges = [
  {
    id: 'b-first-step',
    name: 'First Step',
    description: 'Completed your very first logged workout.',
    category: 'Workouts',
    icon: 'Flame',
    criteria: 'workouts >= 1',
    pointsReward: 50
  },
  {
    id: 'b-streak-7',
    name: '7-Day Streak',
    description: 'Maintained 7 consecutive active days on SWASTHYA.',
    category: 'Consistency',
    icon: 'Zap',
    criteria: 'streak >= 7',
    pointsReward: 100
  },
  {
    id: 'b-streak-14',
    name: '14-Day Iron Streak',
    description: 'Unbroken dedication across two full weeks.',
    category: 'Consistency',
    icon: 'Trophy',
    criteria: 'streak >= 14',
    pointsReward: 200
  },
  {
    id: 'b-hydration-hero',
    name: 'Hydration Hero',
    description: 'Logged at least 2,500ml of water in a single day.',
    category: 'Wellness',
    icon: 'Droplets',
    criteria: 'water >= 2500',
    pointsReward: 40
  },
  {
    id: 'b-zen-master',
    name: 'Zen Master',
    description: 'Completed 5 guided breathing or yoga sessions.',
    category: 'Yoga',
    icon: 'Compass',
    criteria: 'yogaSessions >= 5',
    pointsReward: 75
  },
  {
    id: 'b-century-club',
    name: 'Century Club',
    description: 'Earned 500+ total fitness & wellness points.',
    category: 'Points',
    icon: 'Award',
    criteria: 'points >= 500',
    pointsReward: 150
  },
  {
    id: 'b-sleep-champion',
    name: 'Sleep Champion',
    description: 'Logged 7+ hours of quality sleep for 5 days.',
    category: 'Wellness',
    icon: 'Moon',
    criteria: 'goodSleep >= 5',
    pointsReward: 60
  },
  {
    id: 'b-nutrition-pro',
    name: 'Mindful Eater',
    description: 'Consistently logged balanced meals for 3 consecutive days.',
    category: 'Diet',
    icon: 'Utensils',
    criteria: 'mealsLogged >= 9',
    pointsReward: 50
  }
];

export const initialUsers = [
  {
    id: 'usr-riya',
    name: 'Riya Sharma',
    email: 'riya@example.com',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 21,
      gender: 'female',
      height: 162,
      weight: 64,
      bmi: 24.4,
      bmiCategory: 'Normal weight',
      goal: 'Fat Loss',
      activityLevel: 'Lightly Active',
      availableDays: 3,
      injuries: ['Mild knee discomfort when squatting deep'],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    points: 240,
    currentStreak: 4,
    longestStreak: 5,
    level: 2,
    assignedPlanId: 'plan-1',
    createdAt: '2026-09-10T10:00:00.000Z',
    lastActiveAt: '2026-09-28T15:30:00.000Z',
    earnedBadges: ['b-first-step', 'b-hydration-hero']
  },
  {
    id: 'usr-aman',
    name: 'Aman Verma',
    email: 'aman@example.com',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 24,
      gender: 'male',
      height: 178,
      weight: 76,
      bmi: 24.0,
      bmiCategory: 'Normal weight',
      goal: 'Muscle Gain',
      activityLevel: 'Moderately Active',
      availableDays: 4,
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    },
    points: 420,
    currentStreak: 6,
    longestStreak: 8,
    level: 3,
    assignedPlanId: 'plan-2',
    createdAt: '2026-09-01T09:00:00.000Z',
    lastActiveAt: '2026-09-28T19:00:00.000Z',
    earnedBadges: ['b-first-step', 'b-hydration-hero', 'b-sleep-champion']
  },
  {
    id: 'usr-admin',
    name: 'Prof. Rajesh Kulkarni (Admin)',
    email: 'admin@swasthya.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'admin',
    profile: {
      age: 42,
      gender: 'male',
      height: 175,
      weight: 75,
      bmi: 24.5,
      bmiCategory: 'Normal weight',
      goal: 'Flexibility & Yoga',
      activityLevel: 'Moderately Active',
      availableDays: 3,
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    points: 750,
    currentStreak: 12,
    longestStreak: 15,
    level: 5,
    assignedPlanId: 'plan-3',
    createdAt: '2026-08-15T08:00:00.000Z',
    lastActiveAt: '2026-09-28T21:00:00.000Z',
    earnedBadges: ['b-first-step', 'b-streak-7', 'b-zen-master', 'b-century-club']
  },
  // Additional Campus Leaderboard Users
  {
    id: 'usr-vikram',
    name: 'Vikram Singh',
    email: 'vikram@campus.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 22,
      gender: 'male',
      height: 182,
      weight: 80,
      bmi: 24.2,
      bmiCategory: 'Normal weight',
      goal: 'Strength',
      activityLevel: 'Very Active',
      availableDays: 5,
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
    },
    points: 890,
    currentStreak: 16,
    longestStreak: 18,
    level: 6,
    assignedPlanId: 'plan-4',
    createdAt: '2026-08-10T11:00:00.000Z',
    lastActiveAt: '2026-09-28T22:15:00.000Z',
    earnedBadges: ['b-first-step', 'b-streak-7', 'b-streak-14', 'b-century-club']
  },
  {
    id: 'usr-sneha',
    name: 'Sneha Patel',
    email: 'sneha@campus.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 20,
      gender: 'female',
      height: 165,
      weight: 58,
      bmi: 21.3,
      bmiCategory: 'Normal weight',
      goal: 'Flexibility & Yoga',
      activityLevel: 'Lightly Active',
      availableDays: 4,
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    points: 620,
    currentStreak: 9,
    longestStreak: 11,
    level: 4,
    assignedPlanId: 'plan-3',
    createdAt: '2026-08-20T10:00:00.000Z',
    lastActiveAt: '2026-09-28T18:40:00.000Z',
    earnedBadges: ['b-first-step', 'b-streak-7', 'b-zen-master', 'b-century-club']
  },
  {
    id: 'usr-arjun',
    name: 'Arjun Nair',
    email: 'arjun@campus.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 23,
      gender: 'male',
      height: 176,
      weight: 71,
      bmi: 22.9,
      bmiCategory: 'Normal weight',
      goal: 'Endurance',
      activityLevel: 'Very Active',
      availableDays: 4,
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    points: 540,
    currentStreak: 8,
    longestStreak: 10,
    level: 4,
    assignedPlanId: 'plan-5',
    createdAt: '2026-08-25T14:00:00.000Z',
    lastActiveAt: '2026-09-28T17:20:00.000Z',
    earnedBadges: ['b-first-step', 'b-streak-7', 'b-hydration-hero', 'b-century-club']
  }
];

export const initialProgressLogs = [
  {
    id: 'prog-1',
    userId: 'usr-riya',
    date: '2026-09-22',
    type: 'workout',
    details: 'Completed Day 1: Full Body Activation A',
    durationMinutes: 38,
    calories: 210,
    value: '4/4 exercises completed'
  },
  {
    id: 'prog-2',
    userId: 'usr-riya',
    date: '2026-09-24',
    type: 'workout',
    details: 'Completed Day 2: Posterior & Pull Strength',
    durationMinutes: 42,
    calories: 230,
    value: '4/4 exercises completed'
  },
  {
    id: 'prog-3',
    userId: 'usr-riya',
    date: '2026-09-26',
    type: 'measurement',
    details: 'Weekly Weight Check-in',
    durationMinutes: 0,
    calories: 0,
    value: '64.0 kg'
  },
  {
    id: 'prog-4',
    userId: 'usr-riya',
    date: '2026-09-27',
    type: 'workout',
    details: 'Completed Day 3: Metabolic Conditioning Blitz',
    durationMinutes: 35,
    calories: 245,
    value: '4/4 exercises completed'
  },
  {
    id: 'prog-5',
    userId: 'usr-aman',
    date: '2026-09-23',
    type: 'workout',
    details: 'Completed Upper Body Power & Chest',
    durationMinutes: 52,
    calories: 340,
    value: '4/4 exercises completed'
  },
  {
    id: 'prog-6',
    userId: 'usr-aman',
    date: '2026-09-25',
    type: 'workout',
    details: 'Completed Lower Body Strength & Quads',
    durationMinutes: 58,
    calories: 380,
    value: '4/4 exercises completed'
  },
  {
    id: 'prog-7',
    userId: 'usr-aman',
    date: '2026-09-27',
    type: 'workout',
    details: 'Completed Upper Body Pull & Lats',
    durationMinutes: 50,
    calories: 320,
    value: '4/4 exercises completed'
  }
];

export const initialWellnessLogs = [
  {
    id: 'well-riya-today',
    userId: 'usr-riya',
    date: '2026-09-28',
    water_ml: 1750,
    water_goal: 2500,
    sleepHours: 7.5,
    sleepQuality: 'Good',
    sleepTime: '23:30',
    wakeTime: '07:00',
    mood: 'Energetic',
    meals: [
      { id: 'm-1', name: 'Oatmeal with Almonds & Banana', calories: 340, mealType: 'Breakfast', time: '08:30' },
      { id: 'm-2', name: 'Brown Rice with Paneer & Dal', calories: 520, mealType: 'Lunch', time: '13:15' },
      { id: 'm-3', name: 'Greek Yogurt with Mixed Berries', calories: 180, mealType: 'Snack', time: '17:00' }
    ]
  },
  {
    id: 'well-aman-today',
    userId: 'usr-aman',
    date: '2026-09-28',
    water_ml: 2600,
    water_goal: 3000,
    sleepHours: 6.8,
    sleepQuality: 'Fair',
    sleepTime: '00:30',
    wakeTime: '07:20',
    mood: 'Focused',
    meals: [
      { id: 'm-4', name: '4 Eggs Scrambled + Whole Wheat Toast', calories: 480, mealType: 'Breakfast', time: '08:00' },
      { id: 'm-5', name: 'Grilled Chicken Breast with Quinoa & Veggies', calories: 650, mealType: 'Lunch', time: '13:00' },
      { id: 'm-6', name: 'Whey Protein Shake with Peanut Butter', calories: 320, mealType: 'Snack', time: '17:30' }
    ]
  }
];

// Rich Food Items database for API/Diet search
export const foodDatabase = [
  { id: 'f-1', name: 'Oatmeal with Milk & Honey', calories: 320, carbs: 54, protein: 12, fat: 6, serving: '1 bowl (250g)' },
  { id: 'f-2', name: 'Boiled Eggs (2 whole)', calories: 156, carbs: 1, protein: 13, fat: 10, serving: '2 large eggs' },
  { id: 'f-3', name: 'Scrambled Eggs with Toast', calories: 340, carbs: 26, protein: 18, fat: 15, serving: '1 plate' },
  { id: 'f-4', name: 'Paneer Bhurji / Grilled Paneer', calories: 280, carbs: 5, protein: 18, fat: 20, serving: '100g' },
  { id: 'f-5', name: 'Dal Tadka with 2 Rotis', calories: 380, carbs: 62, protein: 16, fat: 8, serving: '1 serving' },
  { id: 'f-6', name: 'Brown Rice with Steamed Veggies', calories: 250, carbs: 50, protein: 6, fat: 3, serving: '1 cup cooked' },
  { id: 'f-7', name: 'Grilled Chicken Breast', calories: 220, carbs: 0, protein: 42, fat: 5, serving: '150g' },
  { id: 'f-8', name: 'Whey Protein Shake (1 scoop in water)', calories: 130, carbs: 3, protein: 25, fat: 2, serving: '1 scoop (32g)' },
  { id: 'f-9', name: 'Greek Yogurt (Plain 0%)', calories: 110, carbs: 6, protein: 17, fat: 0.5, serving: '170g container' },
  { id: 'f-10', name: 'Banana', calories: 105, carbs: 27, protein: 1.3, fat: 0.3, serving: '1 medium (118g)' },
  { id: 'f-11', name: 'Apple with Peanut Butter', calories: 210, carbs: 25, protein: 5, fat: 9, serving: '1 apple + 1 tbsp PB' },
  { id: 'f-12', name: 'Mixed Sprout Salad with Lemon', calories: 160, carbs: 28, protein: 10, fat: 2, serving: '1 bowl' },
  { id: 'f-13', name: 'Soya Chunks Curry', calories: 240, carbs: 18, protein: 26, fat: 6, serving: '1 bowl' },
  { id: 'f-14', name: 'Almonds & Walnuts Trail Mix', calories: 190, carbs: 6, protein: 6, fat: 16, serving: 'handful (30g)' },
  { id: 'f-15', name: 'Tofu Stir Fry with Broccoli', calories: 230, carbs: 12, protein: 18, fat: 12, serving: '1 plate' },
  { id: 'f-16', name: 'Idli with Sambar (2 idlis)', calories: 210, carbs: 42, protein: 7, fat: 2, serving: '2 pieces + sambar' },
  { id: 'f-17', name: 'Moong Dal Chilla (2 pancakes)', calories: 260, carbs: 36, protein: 14, fat: 7, serving: '2 chillas' },
  { id: 'f-18', name: 'Avocado Toast on Sourdough', calories: 290, carbs: 30, protein: 8, fat: 15, serving: '1 slice' }
];

export const stressRoadmapData = {
  low: {
    title: 'Focus & Energizing Reset',
    description: 'Gentle posture realignments and rhythmic breathing to optimize cognitive clarity and physical stamina.',
    recommendedAsanas: ['as-1', 'as-8', 'as-5'],
    breathingTechnique: 'Calm Resonance (4s Inhale, 4s Exhale)',
    meditationMinutes: 5,
    tips: [
      'Take a 3-minute screen break every 50 minutes.',
      'Maintain an upright spine during seated work.',
      'Hydrate with a glass of cool water.'
    ]
  },
  medium: {
    title: 'Tension Decompression & Somatic Unwinding',
    description: 'Targeted shoulder/hip releases with 4-7-8 breathing to activate parasympathetic recovery and lower cortisol.',
    recommendedAsanas: ['as-2', 'as-4', 'as-6'],
    breathingTechnique: '4-7-8 Relaxing Breath (Inhale 4s, Hold 7s, Exhale 8s)',
    meditationMinutes: 10,
    tips: [
      'Disconnect from notifications for the next 45 minutes.',
      'Gently roll your shoulders back 10 times to release upper trapezius stiffness.',
      'Sip warm herbal or green tea.'
    ]
  },
  high: {
    title: 'Emergency Nervous System Calming & Vagal Reset',
    description: 'Deep restorative poses, grounding Balasana, and structured Box Breathing to halt the sympathetic fight-or-flight cycle.',
    recommendedAsanas: ['as-6', 'as-7', 'as-9'],
    breathingTechnique: 'Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)',
    meditationMinutes: 15,
    tips: [
      'Place a cold damp cloth or ice pack on the back of your neck to stimulate the vagus nerve.',
      'Lie in Balasana (Child’s pose) or Shavasana with palms facing up.',
      'Focus purely on letting the belly rise and fall with zero effort.'
    ]
  }
};
