// server/config/generateSwasthyaData.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('Password123!', salt);

// 1. Curated Diet Plan Templates (PRD FR3.3: 6-8 diet plan templates stored in DB)
const dietPlans = [
  {
    id: 'diet-1',
    title: 'High-Protein Vegetarian Fat Shred',
    goalType: 'Weight Loss',
    dietaryPreference: 'Vegetarian',
    dailyCalorieTarget: 1750,
    dailyProteinTarget_g: 130,
    dailyFiberTarget_g: 35,
    dailyCarbTarget_g: 165,
    dailyFatTarget_g: 48,
    mealSuggestions: [
      { meal: 'Breakfast', text: 'Oats with chia seeds, whey protein, and crushed almonds (380 kcal, 32g protein)' },
      { meal: 'Lunch', text: 'Low-fat paneer bhurji with 2 multigrain rotis, green salad, and curd (520 kcal, 36g protein)' },
      { meal: 'Snack', text: 'Roasted chana with green tea and apple slices (180 kcal, 9g protein)' },
      { meal: 'Dinner', text: 'Sprouted moong dal khichdi with mixed sautéed vegetables (420 kcal, 24g protein)' }
    ],
    notes: 'Prioritizes satiety through high-fiber legumes and clean vegetarian protein to sustain metabolic rate in a deficit.'
  },
  {
    id: 'diet-2',
    title: 'Lean Hypertrophy Muscle Build (Non-Veg)',
    goalType: 'Muscle Gain',
    dietaryPreference: 'Non-Vegetarian',
    dailyCalorieTarget: 2600,
    dailyProteinTarget_g: 165,
    dailyFiberTarget_g: 36,
    dailyCarbTarget_g: 310,
    dailyFatTarget_g: 72,
    mealSuggestions: [
      { meal: 'Breakfast', text: '4 scrambled eggs (2 whole, 2 whites) on sourdough toast with sliced avocado (520 kcal, 34g protein)' },
      { meal: 'Lunch', text: 'Grilled chicken breast with basmati brown rice, steamed broccoli, and olive oil dressing (680 kcal, 52g protein)' },
      { meal: 'Snack', text: 'Whey protein shake with peanut butter and 1 ripe banana (360 kcal, 32g protein)' },
      { meal: 'Dinner', text: 'Pan-seared fish / chicken curry with quinoa and cucumber salad (600 kcal, 44g protein)' }
    ],
    notes: 'Engineered with optimal leucine triggers every 3-4 hours to maximize myofibrillar protein synthesis.'
  },
  {
    id: 'diet-3',
    title: 'Plant-Powered Vegan Metabolic Reset',
    goalType: 'Weight Loss',
    dietaryPreference: 'Vegan',
    dailyCalorieTarget: 1800,
    dailyProteinTarget_g: 110,
    dailyFiberTarget_g: 42,
    dailyCarbTarget_g: 220,
    dailyFatTarget_g: 45,
    mealSuggestions: [
      { meal: 'Breakfast', text: 'Tofu scramble with spinach, bell peppers, nutritional yeast, and rye toast (360 kcal, 26g protein)' },
      { meal: 'Lunch', text: 'Lentil dal with brown rice, steamed greens, and flaxseed crunch (510 kcal, 28g protein)' },
      { meal: 'Snack', text: 'Soy yogurt with blueberries and pumpkin seeds (210 kcal, 14g protein)' },
      { meal: 'Dinner', text: 'Edamame and tempeh stir-fry with zucchini noodles and sesame ginger sauce (450 kcal, 34g protein)' }
    ],
    notes: 'High in micronutrients, polyphenols, and prebiotic fibers to support gut microbiome and fat oxidation.'
  },
  {
    id: 'diet-4',
    title: 'Balanced Student Maintenance & Energy Plan',
    goalType: 'General Fitness',
    dietaryPreference: 'Flexible',
    dailyCalorieTarget: 2150,
    dailyProteinTarget_g: 120,
    dailyFiberTarget_g: 32,
    dailyCarbTarget_g: 260,
    dailyFatTarget_g: 60,
    mealSuggestions: [
      { meal: 'Breakfast', text: '2 boiled eggs or paneer wrap with fruit smoothie (440 kcal, 22g protein)' },
      { meal: 'Lunch', text: 'Homestyle rajma / chole with jeera rice and fresh salad (580 kcal, 24g protein)' },
      { meal: 'Snack', text: 'Handful of mixed nuts with dark chocolate square (220 kcal, 6g protein)' },
      { meal: 'Dinner', text: 'Grilled cottage cheese / chicken sandwich on whole wheat with mint chutney (480 kcal, 28g protein)' }
    ],
    notes: 'Budget-friendly, accessible ingredients suited for college campus cafeterias and busy study schedules.'
  },
  {
    id: 'diet-5',
    title: 'Clean Mass Gain & Strength Fuel (High Calorie)',
    goalType: 'Muscle Gain',
    dietaryPreference: 'Flexible',
    dailyCalorieTarget: 2900,
    dailyProteinTarget_g: 180,
    dailyFiberTarget_g: 38,
    dailyCarbTarget_g: 380,
    dailyFatTarget_g: 80,
    mealSuggestions: [
      { meal: 'Breakfast', text: 'Oatmeal loaded with whole milk, whey, peanut butter, honey, and sliced banana (720 kcal, 44g protein)' },
      { meal: 'Lunch', text: 'Double portion chicken / paneer tikka with 3 rotis and dal (780 kcal, 56g protein)' },
      { meal: 'Snack', text: 'Greek yogurt with granola and dried figs (380 kcal, 22g protein)' },
      { meal: 'Dinner', text: 'Pasta with minced lean chicken / soya chunks and tomato herb sauce (680 kcal, 48g protein)' }
    ],
    notes: 'Carbohydrate-dense fueling to restore glycogen stores between heavy compound lifting sessions.'
  },
  {
    id: 'diet-6',
    title: 'Anti-Inflammatory Digestive & Gut Health Reset',
    goalType: 'General Fitness',
    dietaryPreference: 'Vegetarian',
    dailyCalorieTarget: 1900,
    dailyProteinTarget_g: 105,
    dailyFiberTarget_g: 38,
    dailyCarbTarget_g: 230,
    dailyFatTarget_g: 52,
    mealSuggestions: [
      { meal: 'Breakfast', text: 'Warm turmeric ginger oatmeal with soaked almonds and stewed papaya (360 kcal, 14g protein)' },
      { meal: 'Lunch', text: 'Steamed brown rice with yellow moong dal and fermented probiotic curd (480 kcal, 22g protein)' },
      { meal: 'Snack', text: 'Cucumber, carrot sticks with homemade hummus and coconut water (190 kcal, 8g protein)' },
      { meal: 'Dinner', text: 'Light vegetable soup followed by grilled paneer & sautéed beans (420 kcal, 28g protein)' }
    ],
    notes: 'Formulated with low-FODMAP soothing foods to minimize gastrointestinal bloating and inflammation.'
  },
  {
    id: 'diet-7',
    title: 'Low-Carb Ketogenic Fat Burner',
    goalType: 'Weight Loss',
    dietaryPreference: 'Flexible',
    dailyCalorieTarget: 1700,
    dailyProteinTarget_g: 135,
    dailyFiberTarget_g: 28,
    dailyCarbTarget_g: 45,
    dailyFatTarget_g: 110,
    mealSuggestions: [
      { meal: 'Breakfast', text: '3 whole eggs fried in butter with spinach and cheddar cheese (480 kcal, 28g protein)' },
      { meal: 'Lunch', text: 'Paneer or chicken caesar salad with olive oil, walnuts, and parmesan (560 kcal, 38g protein)' },
      { meal: 'Snack', text: 'Avocado half with sea salt and roasted sunflower seeds (210 kcal, 5g protein)' },
      { meal: 'Dinner', text: 'Baked salmon or tofu with asparagus and creamy mushroom sauce (420 kcal, 36g protein)' }
    ],
    notes: 'Ketogenic macro ratio keeping net carbs under 30g to induce and maintain metabolic ketosis.'
  },
  {
    id: 'diet-8',
    title: 'Athletic Speed & Aerobic Endurance Fuel',
    goalType: 'General Fitness',
    dietaryPreference: 'Flexible',
    dailyCalorieTarget: 2400,
    dailyProteinTarget_g: 140,
    dailyFiberTarget_g: 34,
    dailyCarbTarget_g: 320,
    dailyFatTarget_g: 58,
    mealSuggestions: [
      { meal: 'Breakfast', text: 'Sweet potato hash with poached eggs and orange juice (520 kcal, 24g protein)' },
      { meal: 'Lunch', text: 'Quinoa bowl with black beans, corn, grilled chicken / tofu, and salsa (620 kcal, 38g protein)' },
      { meal: 'Snack', text: 'Date energy balls with whey protein isolate (260 kcal, 18g protein)' },
      { meal: 'Dinner', text: 'Rice noodles with chicken / edamame, bok choy, and sesame broth (580 kcal, 36g protein)' }
    ],
    notes: 'Complex low-glycemic carbohydrates to fuel stamina workouts and aerobic endurance running.'
  }
];

// 2. Full Breathing Techniques Library (PRD Module 6 - FR6.1, FR6.2, FR6.3, FR6.4)
const breathingTechniques = [
  {
    id: 'breath-box',
    name: 'Box Breathing (Sama Vritti)',
    sanskritName: 'Sama Vritti Pranayama',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    durationMinutes: 4,
    difficulty: 'Beginner',
    tags: ['quick calm', 'focus', 'anxiety'],
    benefits: [
      'Calms hyperactive nervous system and slows pulse within 2 minutes.',
      'Enhances mental concentration and executive decision-making under pressure.',
      'Synchronizes sympathetic and parasympathetic autonomic branches.'
    ],
    steps: [
      'Sit comfortably upright with shoulders relaxed and eyes gently closed.',
      'Exhale all air completely out through your mouth.',
      'Inhale slowly and deeply through your nose for a 4-second count.',
      'Hold the breath in your lungs smoothly for 4 seconds without clenching.',
      'Exhale slowly through your mouth for 4 seconds.',
      'Pause and hold your lungs empty for 4 seconds before the next breath.'
    ],
    caution: 'Do not strain on empty retention if you experience dizziness or pregnancy.'
  },
  {
    id: 'breath-478',
    name: '4-7-8 Relaxing Breath',
    sanskritName: 'Pranayama Vayu',
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    durationMinutes: 5,
    difficulty: 'Beginner',
    tags: ['better sleep', 'anxiety', 'quick calm'],
    benefits: [
      'Acts as a natural tranquilizer for the central nervous system.',
      'Lengthens the exhale to stimulate the vagus nerve and reduce heart rate.',
      'Helps you drift into restorative deep sleep within minutes.'
    ],
    steps: [
      'Place the tip of your tongue against the ridge behind your upper front teeth.',
      'Exhale completely through your mouth with a soft whoosh sound.',
      'Close your mouth and inhale quietly through your nose for 4 seconds.',
      'Hold your breath comfortably for a count of 7 seconds.',
      'Exhale completely through your mouth making a whoosh sound for 8 seconds.',
      'Repeat this cycle 4 to 8 times.'
    ],
    caution: 'Maintain the 4:7:8 ratio rather than counting slowly if breath retention feels tight.'
  },
  {
    id: 'breath-diaphragmatic',
    name: 'Diaphragmatic Deep Belly Breathing',
    sanskritName: 'Adham Pranayama',
    pattern: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
    durationMinutes: 5,
    difficulty: 'Beginner',
    tags: ['digestion', 'relaxation', 'low stress'],
    benefits: [
      'Reverses shallow chest breathing habits that trigger chronic stress.',
      'Massages abdominal viscera and improves stomach digestion.',
      'Lowers cortisol levels and promotes full oxygen exchange.'
    ],
    steps: [
      'Lie flat on your back or sit tall with one hand on your chest and one on your belly.',
      'Breathe in slowly through your nose, letting your belly push your hand outward while your chest remains still.',
      'Contract your abdominal muscles gently as you exhale through pursed lips, feeling your belly fall.',
      'Continue for 5 continuous minutes with steady rhythmic cadence.'
    ],
    caution: 'Safe for all practitioners; avoid forcing the abdominal wall.'
  },
  {
    id: 'breath-nadi',
    name: 'Alternate Nostril Breathing',
    sanskritName: 'Nadi Shodhana Pranayama',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 0 },
    durationMinutes: 6,
    difficulty: 'Intermediate',
    tags: ['focus', 'balance', 'quick calm'],
    benefits: [
      'Balances the left and right hemispheres of the brain.',
      'Clears respiratory pathways and balances Ida & Pingala energetic channels.',
      'Sharpens cognitive clarity before exams, presentations, or meditation.'
    ],
    steps: [
      'Sit comfortably and bring your right hand into Vishnu Mudra (fold index and middle finger).',
      'Close your right nostril with your thumb and inhale deeply through the left nostril for 4 seconds.',
      'Close both nostrils with thumb and ring finger, holding the breath for 4 seconds.',
      'Release the thumb and exhale smoothly through the right nostril for 4 seconds.',
      'Inhale through the right nostril for 4 seconds, close both and hold for 4 seconds, then exhale through the left nostril.'
    ],
    caution: 'Never force retention if nostrils are congested from cold or allergies.'
  },
  {
    id: 'breath-kapalabhati',
    name: 'Skull Shining Breath',
    sanskritName: 'Kapalabhati Pranayama',
    pattern: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
    durationMinutes: 3,
    difficulty: 'Advanced',
    tags: ['energizing', 'morning', 'metabolism'],
    benefits: [
      'Cleanses respiratory passages and expels stagnant air from lungs.',
      'Stimulates abdominal organs, improves peristalsis, and boosts metabolism.',
      'Provides an instant natural surge of alertness and mental clarity.'
    ],
    steps: [
      'Sit with an erect spine and place both hands on your knees.',
      'Take a deep inhalation through both nostrils.',
      'Begin rapid, forceful exhalations by snapping your lower belly backward toward your spine.',
      'Allow inhalation to occur passively and automatically between contractions.',
      'Complete 20-30 pumpings, then take a deep breath, hold briefly, and release.'
    ],
    caution: 'Contraindicated during pregnancy, high blood pressure, or abdominal hernia.'
  },
  {
    id: 'breath-bhramari',
    name: 'Humming Bee Breath',
    sanskritName: 'Bhramari Pranayama',
    pattern: { inhale: 4, hold1: 0, exhale: 8, hold2: 0 },
    durationMinutes: 4,
    difficulty: 'Beginner',
    tags: ['quick calm', 'headache', 'anxiety'],
    benefits: [
      'Creates soothing acoustic cranial vibrations that calm agitated neural circuits.',
      'Releases nitric oxide in nasal passages, boosting oxygen uptake.',
      'Alleviates tension headaches, anger, and acute anxiety.'
    ],
    steps: [
      'Sit with a straight spine and close your eyes.',
      'Gently place your thumbs on the cartilage of your ears (tragus) to block external noise.',
      'Inhale deeply through your nose.',
      'As you exhale, make a steady, resonant low-to-medium-pitched humming sound like a bee ("Mmmmm").',
      'Feel the soothing vibrations resonating in your skull and throat. Repeat 6-8 rounds.'
    ],
    caution: 'Do not press thumbs too deeply into ear canals; practice gently.'
  },
  {
    id: 'breath-ujjayi',
    name: 'Victorious Ocean Breath',
    sanskritName: 'Ujjayi Pranayama',
    pattern: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    durationMinutes: 5,
    difficulty: 'Intermediate',
    tags: ['flow', 'stamina', 'focus'],
    benefits: [
      'Builds internal body heat and stamina during strenuous asana flows.',
      'The oceanic whispering sound creates a rhythmic anchor for the wandering mind.',
      'Regulates blood pressure and stabilizes aerobic heart rate.'
    ],
    steps: [
      'Sit tall or practice while flowing through your yoga sequence.',
      'Slightly constrict the back of your throat (the glottis), as if whispering a secret or fogging up a mirror.',
      'Inhale steadily through your nose while keeping the throat constriction, producing a soft oceanic hiss.',
      'Exhale smoothly through your nose with the same whisper sound.',
      'Maintain an unbroken, soothing oceanic rhythm throughout your practice.'
    ],
    caution: 'Ensure the throat constriction is gentle and relaxed, not abrasive.'
  }
];

// 3. Redesigned Category-Based Stress Roadmaps (PRD Module 7 - FR7.1, FR7.2, FR7.3)
const stressRoadmaps = {
  low: {
    id: 'roadmap-low',
    category: 'low',
    title: 'Focus & Energizing Reset Protocol',
    description: 'Designed for daily maintenance and light desk stiffness: realigns physical posture, synchronizes breath, and grounds mental clarity.',
    steps: [
      {
        stepNumber: 1,
        title: 'Postural Alignment',
        shortLabel: 'Mountain Pose (Tadasana)',
        refType: 'asana',
        refId: 'as-1',
        durationMinutes: 3,
        fullProcess: 'Stand with feet grounded, pelvis neutral, and shoulders dropped. Hold Tadasana with deep nasal breathing for 3 minutes.',
        whyHere: 'Neutralizes spinal compression from sitting and establishes a steady somatic anchor before breathwork.'
      },
      {
        stepNumber: 2,
        title: 'Hemispheric Balance',
        shortLabel: 'Alternate Nostril Breathing',
        refType: 'breathing',
        refId: 'breath-nadi',
        durationMinutes: 5,
        fullProcess: 'Practice 8-10 rounds of Nadi Shodhana, alternating smooth 4-second counts between left and right nostrils.',
        whyHere: 'Equalizes autonomic nervous activity between both brain hemispheres to sharpen focus without restlessness.'
      },
      {
        stepNumber: 3,
        title: 'Mental Clarity Anchor',
        shortLabel: '5-Minute Mindful Breath',
        refType: 'meditation',
        refId: 'med-1',
        durationMinutes: 5,
        fullProcess: 'Listen to the guided mindfulness breath reset to cultivate presence and clear task distractions.',
        whyHere: 'Solidifies mental clarity, leaving you calm, alert, and ready for work or study.'
      }
    ]
  },
  medium: {
    id: 'roadmap-medium',
    category: 'medium',
    title: 'Tension Decompression & Somatic Unwinding Protocol',
    description: 'Calibrated for moderate stress, stiff shoulders, and racing thoughts: reverses muscle tightness, extends the exhale, and releases deep fascia tension.',
    steps: [
      {
        stepNumber: 1,
        title: 'Spinal Traction & Decompression',
        shortLabel: 'Downward-Facing Dog',
        refType: 'asana',
        refId: 'as-2',
        durationMinutes: 3,
        fullProcess: 'Pedal heels gently in Adho Mukha Svanasana for 90 seconds, followed by 90 seconds of steady hold.',
        whyHere: 'Reverses gravitational pressure on the spine and increases cerebral blood flow, instantly relieving mental fatigue.'
      },
      {
        stepNumber: 2,
        title: 'Thoracic & Heart Opening',
        shortLabel: 'Cobra Pose (Bhujangasana)',
        refType: 'asana',
        refId: 'as-4',
        durationMinutes: 3,
        fullProcess: 'Flow dynamically between gentle low cobra and static hold for 30-45 seconds, breathing into upper chest.',
        whyHere: 'Counteracts rounded desk posture and expands respiratory intercostal muscles.'
      },
      {
        stepNumber: 3,
        title: 'Vagal Nerve Activation',
        shortLabel: '4-7-8 Relaxing Breath',
        refType: 'breathing',
        refId: 'breath-478',
        durationMinutes: 5,
        fullProcess: 'Perform 6 cycles of 4s Inhale, 7s Hold, 8s Whoosh Exhale.',
        whyHere: 'Doubling the exhale duration relative to inhalation triggers the vagal brake, lowering heart rate and blood pressure.'
      },
      {
        stepNumber: 4,
        title: 'Full Body Scan & Release',
        shortLabel: '10-Minute MBSR Body Scan',
        refType: 'meditation',
        refId: 'med-2',
        durationMinutes: 10,
        fullProcess: 'Follow the guided body scan traveling awareness systematically from toes to facial muscles.',
        whyHere: 'Identifies and consciously dissolves residual micro-tensions stored in the jaw, trapezius, and lower back.'
      }
    ]
  },
  high: {
    id: 'roadmap-high',
    category: 'high',
    title: 'Emergency Nervous System Calming & Vagal Reset',
    description: 'Designed for acute anxiety, panic spikes, sensory overwhelm, or extreme exhaustion: rapidly de-escalates the sympathetic fight-or-flight response.',
    steps: [
      {
        stepNumber: 1,
        title: 'Somatic Grounding & Surrender',
        shortLabel: "Child's Pose (Balasana)",
        refType: 'asana',
        refId: 'as-6',
        durationMinutes: 4,
        fullProcess: 'Fold forward into Balasana with forehead grounded on mat or pillow. Breathe deeply into the back of your ribs.',
        whyHere: 'Shields sensory overload by closing off the visual field and curling into protective, parasympathetic posture.'
      },
      {
        stepNumber: 2,
        title: 'Gentle Heart Restoration',
        shortLabel: 'Bridge Pose (Setu Bandhasana)',
        refType: 'asana',
        refId: 'as-9',
        durationMinutes: 3,
        fullProcess: 'Support hips with hands or yoga block in gentle Bridge, holding for 3 minutes with relaxed belly.',
        whyHere: 'Opens the chest cavity to relieve suffocating sensations common in panic states.'
      },
      {
        stepNumber: 3,
        title: 'Autonomous Cadence Reset',
        shortLabel: 'Box Breathing (4-4-4-4)',
        refType: 'breathing',
        refId: 'breath-box',
        durationMinutes: 5,
        fullProcess: 'Follow the visual Box Breathing guide for 5 minutes (4s Inhale, 4s Hold, 4s Exhale, 4s Empty Hold).',
        whyHere: 'The equal four-sided rhythm rapidly down-regulates amygdala hyperactivity and interrupts panic spirals.'
      },
      {
        stepNumber: 4,
        title: 'Deep Restorative Psychic Sleep',
        shortLabel: '15-Minute Yoga Nidra',
        refType: 'meditation',
        refId: 'med-3',
        durationMinutes: 15,
        fullProcess: 'Lie in Shavasana covered with a light blanket and listen to guided Yoga Nidra for restorative theta brainwaves.',
        whyHere: 'Produces delta/theta restorative brainwaves equivalent to 2 hours of REM sleep, replenishing exhausted adrenal reserves.'
      }
    ]
  }
};

// 4. Food Database with full macros: calories, protein, carbs, fat, fiber (PRD FR10.1 & FR10.2)
const foodDatabase = [
  { id: 'f-1', name: 'Oatmeal with Milk & Honey', calories: 320, protein: 12, carbs: 54, fat: 6, fiber: 5, serving: '1 bowl (250g)' },
  { id: 'f-2', name: 'Boiled Eggs (2 whole)', calories: 156, protein: 13, carbs: 1, fat: 10, fiber: 0, serving: '2 large eggs' },
  { id: 'f-3', name: 'Scrambled Eggs with Multigrain Toast', calories: 340, protein: 18, carbs: 26, fat: 15, fiber: 4, serving: '1 plate' },
  { id: 'f-4', name: 'Grilled Paneer / Paneer Bhurji', calories: 280, protein: 18, carbs: 5, fat: 20, fiber: 1, serving: '100g' },
  { id: 'f-5', name: 'Yellow Moong Dal Tadka with 2 Rotis', calories: 380, protein: 16, carbs: 62, fat: 8, fiber: 9, serving: '1 serving' },
  { id: 'f-6', name: 'Steamed Brown Rice with Veggies', calories: 250, protein: 6, carbs: 50, fat: 3, fiber: 5, serving: '1 cup cooked' },
  { id: 'f-7', name: 'Grilled Chicken Breast', calories: 220, protein: 42, carbs: 0, fat: 5, fiber: 0, serving: '150g' },
  { id: 'f-8', name: 'Whey Protein Shake (1 scoop in water)', calories: 130, protein: 25, carbs: 3, fat: 2, fiber: 1, serving: '1 scoop (32g)' },
  { id: 'f-9', name: 'Greek Yogurt (Plain 0%)', calories: 110, protein: 17, carbs: 6, fat: 0.5, fiber: 0, serving: '170g container' },
  { id: 'f-10', name: 'Ripe Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, serving: '1 medium (118g)' },
  { id: 'f-11', name: 'Fresh Apple with Peanut Butter', calories: 210, protein: 5, carbs: 25, fat: 9, fiber: 4.5, serving: '1 apple + 1 tbsp PB' },
  { id: 'f-12', name: 'Sprouted Moong Salad with Lemon', calories: 160, protein: 10, carbs: 28, fat: 2, fiber: 7, serving: '1 bowl' },
  { id: 'f-13', name: 'High-Protein Soya Chunks Curry', calories: 240, protein: 26, carbs: 18, fat: 6, fiber: 8, serving: '1 bowl' },
  { id: 'f-14', name: 'Almonds & Walnuts Raw Mix', calories: 190, protein: 6, carbs: 6, fat: 16, fiber: 3, serving: 'handful (30g)' },
  { id: 'f-15', name: 'Tofu Stir-Fry with Broccoli', calories: 230, protein: 18, carbs: 12, fat: 12, fiber: 4, serving: '1 plate' },
  { id: 'f-16', name: 'Steamed Idli with Sambar (2 idlis)', calories: 210, protein: 7, carbs: 42, fat: 2, fiber: 4, serving: '2 idlis + sambar' },
  { id: 'f-17', name: 'Moong Dal Chilla (2 pancakes)', calories: 260, protein: 14, carbs: 36, fat: 7, fiber: 6, serving: '2 chillas' },
  { id: 'f-18', name: 'Avocado Sourdough Toast', calories: 290, protein: 8, carbs: 30, fat: 15, fiber: 7, serving: '1 slice' },
  { id: 'f-19', name: 'Grilled Fish Fillet with Lemon Herbs', calories: 210, protein: 34, carbs: 1, fat: 7, fiber: 0, serving: '1 fillet (150g)' },
  { id: 'f-20', name: 'Rajma Curry (Kidney Beans) with Rice', calories: 420, protein: 18, carbs: 70, fat: 7, fiber: 11, serving: '1 plate' },
  { id: 'f-21', name: 'Chia Seed Pudding with Almond Milk', calories: 180, protein: 6, carbs: 16, fat: 10, fiber: 9, serving: '1 jar' },
  { id: 'f-22', name: 'Steamed Edamame in Pods', calories: 140, protein: 12, carbs: 10, fat: 5, fiber: 6, serving: '1 cup' }
];

// 5. Initial Weekly Progress Logs (PRD Module 8 - FR8.1, FR8.2, FR8.3)
const weeklyProgressLogs = [
  {
    id: 'wprog-riya-1',
    userId: 'usr-riya',
    weekStartDate: '2026-09-08',
    weight: 63.8,
    bodyMeasurements: { chest_cm: 86, waist_cm: 72, hips_cm: 94 },
    workoutsCompleted: 3,
    workoutsPlanned: 3,
    adherencePercent: 100,
    weightDiffPrevWeek: 0,
    notes: 'Started Swasthya program with 3-day split.'
  },
  {
    id: 'wprog-riya-2',
    userId: 'usr-riya',
    weekStartDate: '2026-09-15',
    weight: 63.2,
    bodyMeasurements: { chest_cm: 86, waist_cm: 71, hips_cm: 93 },
    workoutsCompleted: 3,
    workoutsPlanned: 3,
    adherencePercent: 100,
    weightDiffPrevWeek: -0.6,
    notes: 'Good energy and logged water consistently.'
  },
  {
    id: 'wprog-riya-3',
    userId: 'usr-riya',
    weekStartDate: '2026-09-22',
    weight: 62.7,
    bodyMeasurements: { chest_cm: 85, waist_cm: 70, hips_cm: 93 },
    workoutsCompleted: 3,
    workoutsPlanned: 3,
    adherencePercent: 100,
    weightDiffPrevWeek: -0.5,
    notes: 'Consistent nutrition tracking.'
  },
  {
    id: 'wprog-riya-4',
    userId: 'usr-riya',
    weekStartDate: '2026-09-29',
    weight: 62.3,
    bodyMeasurements: { chest_cm: 85, waist_cm: 69.5, hips_cm: 92.5 },
    workoutsCompleted: 4,
    workoutsPlanned: 3,
    adherencePercent: 100,
    weightDiffPrevWeek: -0.4,
    notes: 'Exceeded workouts by +1 session and completed Box Breathing.'
  },
  {
    id: 'wprog-aman-1',
    userId: 'usr-aman',
    weekStartDate: '2026-09-15',
    weight: 76.5,
    bodyMeasurements: { chest_cm: 102, waist_cm: 84, arms_cm: 37 },
    workoutsCompleted: 4,
    workoutsPlanned: 4,
    adherencePercent: 100,
    weightDiffPrevWeek: 0,
    notes: 'Baseline week for hypertrophy split.'
  },
  {
    id: 'wprog-aman-2',
    userId: 'usr-aman',
    weekStartDate: '2026-09-22',
    weight: 76.9,
    bodyMeasurements: { chest_cm: 103, waist_cm: 84, arms_cm: 37.5 },
    workoutsCompleted: 4,
    workoutsPlanned: 4,
    adherencePercent: 100,
    weightDiffPrevWeek: +0.4,
    notes: 'Lean bulk on track with protein target hit daily.'
  },
  {
    id: 'wprog-aman-3',
    userId: 'usr-aman',
    weekStartDate: '2026-09-29',
    weight: 77.2,
    bodyMeasurements: { chest_cm: 103.5, waist_cm: 84.2, arms_cm: 38 },
    workoutsCompleted: 4,
    workoutsPlanned: 4,
    adherencePercent: 100,
    weightDiffPrevWeek: +0.3,
    notes: 'Strength progression on Romanian Deadlifts.'
  }
];

// Read existing db.json to preserve exercises, asanas, workout plans, meditations
const dbFilePath = path.join(__dirname, '..', 'data', 'db.json');
let existingDb = {};
if (fs.existsSync(dbFilePath)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  } catch (e) {
    console.error('Failed reading existing db.json:', e);
  }
}

// 6. Users: Ensure Riya, Aman, and Admin have correct roles & profiles
const users = [
  {
    id: 'usr-riya',
    name: 'Riya Sharma',
    email: 'riya@swasthya.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 21,
      gender: 'female',
      height: 162,
      weight: 62.3,
      bmi: 23.7,
      bmiCategory: 'Normal weight',
      goal: 'Weight Loss',
      activityLevel: 'Lightly Active',
      availableDays: 3,
      dietaryPreference: 'Vegetarian',
      stressLevel: 'medium',
      sleepPattern: 'fair',
      injuries: ['Mild lower back tightness'],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    assignedExercisePlanId: 'plan-1',
    assignedDietPlanId: 'diet-1',
    assignedRoadmapId: 'medium',
    meditationRecommended: true,
    points: 460,
    currentStreak: 12,
    longestStreak: 16,
    level: 3,
    status: 'active',
    createdAt: '2026-09-01T08:00:00.000Z',
    lastActiveAt: '2026-09-30T10:00:00.000Z'
  },
  {
    id: 'usr-aman',
    name: 'Aman Verma',
    email: 'aman@swasthya.edu',
    passwordHash: defaultPasswordHash,
    authProvider: 'local',
    role: 'user',
    profile: {
      age: 24,
      gender: 'male',
      height: 178,
      weight: 77.2,
      bmi: 24.4,
      bmiCategory: 'Normal weight',
      goal: 'Muscle Gain',
      activityLevel: 'Very Active',
      availableDays: 4,
      dietaryPreference: 'Non-Vegetarian',
      stressLevel: 'low',
      sleepPattern: 'good',
      injuries: [],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    assignedExercisePlanId: 'plan-2',
    assignedDietPlanId: 'diet-2',
    assignedRoadmapId: 'low',
    meditationRecommended: false,
    points: 780,
    currentStreak: 18,
    longestStreak: 21,
    level: 5,
    status: 'active',
    createdAt: '2026-08-25T08:00:00.000Z',
    lastActiveAt: '2026-09-30T11:00:00.000Z'
  },
  {
    id: 'usr-admin',
    name: 'Faculty Coordinator (Admin)',
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
      goal: 'General Fitness',
      activityLevel: 'Moderately Active',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    points: 1200,
    currentStreak: 30,
    longestStreak: 45,
    level: 8,
    status: 'active',
    createdAt: '2026-08-01T08:00:00.000Z',
    lastActiveAt: '2026-09-30T12:00:00.000Z'
  }
];

// Assemble complete updated SWASTHYA database
const updatedDb = {
  users: users,
  exercises: existingDb.exercises || [],
  asanas: existingDb.asanas || [],
  workoutPlans: existingDb.workoutPlans || [],
  dietPlans: dietPlans,
  breathingTechniques: breathingTechniques,
  stressRoadmaps: stressRoadmaps,
  meditations: existingDb.meditations || [],
  badges: existingDb.badges || [],
  progressLogs: existingDb.progressLogs || [],
  weeklyProgressLogs: weeklyProgressLogs,
  wellnessLogs: existingDb.wellnessLogs || [],
  foodItems: foodDatabase,
  assessments: [
    {
      id: 'assess-riya',
      userId: 'usr-riya',
      age: 21,
      gender: 'female',
      height: 162,
      weight: 62.3,
      bmi: 23.7,
      goal: 'Weight Loss',
      activityLevel: 'Lightly Active',
      daysAvailable: 3,
      dietaryPreference: 'Vegetarian',
      stressLevel: 'medium',
      sleepPattern: 'fair',
      injuries: ['Mild lower back tightness'],
      completedAt: '2026-09-01T08:30:00.000Z'
    },
    {
      id: 'assess-aman',
      userId: 'usr-aman',
      age: 24,
      gender: 'male',
      height: 178,
      weight: 77.2,
      bmi: 24.4,
      goal: 'Muscle Gain',
      activityLevel: 'Very Active',
      daysAvailable: 4,
      dietaryPreference: 'Non-Vegetarian',
      stressLevel: 'low',
      sleepPattern: 'good',
      injuries: [],
      completedAt: '2026-08-25T08:30:00.000Z'
    }
  ],
  generatedPlans: [
    {
      id: 'gen-plan-riya',
      userId: 'usr-riya',
      assessmentId: 'assess-riya',
      exercisePlanId: 'plan-1',
      dietPlanId: 'diet-1',
      meditationRecommended: true,
      stressRoadmapId: 'medium',
      generatedAt: '2026-09-01T08:35:00.000Z'
    },
    {
      id: 'gen-plan-aman',
      userId: 'usr-aman',
      assessmentId: 'assess-aman',
      exercisePlanId: 'plan-2',
      dietPlanId: 'diet-2',
      meditationRecommended: false,
      stressRoadmapId: 'low',
      generatedAt: '2026-08-25T08:35:00.000Z'
    }
  ]
};

fs.writeFileSync(dbFilePath, JSON.stringify(updatedDb, null, 2), 'utf-8');
console.log('Successfully updated Swasthya DB with diet plans, breathing library, roadmap nodes, and weekly progress!');
