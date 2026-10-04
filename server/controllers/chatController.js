// server/controllers/chatController.js

const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['squat', 'knee', 'squatting', 'depth'],
    answer: "For a safe barbell or bodyweight squat: keep your feet shoulder-width apart, turn your toes out 15-30 degrees, brace your core, and initiate the movement by hinging hips back and bending knees. Ensure your knees track in line with your toes and do not collapse inward. Descend until thighs are parallel to the floor while maintaining a flat, neutral spine.",
    category: 'Form & Technique'
  },
  {
    keywords: ['back pain', 'lower back', 'spine', 'ache'],
    answer: "Lower back tension often stems from tight hip flexors and prolonged sitting. Beneficial asanas include Balasana (Child's Pose), Marjaryasana-Bitilasana (Cat-Cow Flow), and gentle Setu Bandhasana (Bridge Pose). Avoid heavy spinal loading or rapid twists if experiencing acute discomfort. Note: If pain is sharp or radiates into the legs, consult a certified physician.",
    category: 'Recovery & Posture'
  },
  {
    keywords: ['fat loss', 'lose weight', 'burn fat', 'shred', 'calories'],
    answer: "Effective fat loss is driven by a consistent moderate caloric deficit (~300-500 kcal below maintenance) paired with resistance training 3-4 days a week to preserve lean muscle, and at least 7,000-10,000 daily steps. Prioritize high-protein meals (1.6 - 2.2g per kg of target bodyweight) and whole foods to remain satiated.",
    category: 'Fat Loss & Nutrition'
  },
  {
    keywords: ['muscle', 'hypertrophy', 'build muscle', 'bulk', 'gains'],
    answer: "Muscle hypertrophy requires progressive overload (gradually increasing weight, reps, or sets over time) within 6-12 rep ranges, adequate protein (1.6 - 2.0g per kg of bodyweight), and 7-9 hours of restorative sleep for muscle protein synthesis and growth hormone release.",
    category: 'Muscle Building'
  },
  {
    keywords: ['water', 'hydration', 'drink', 'thirsty', 'liters', 'ml'],
    answer: "General recommendation is 2.5 to 3.5 liters (around 8-12 glasses) daily, increasing with heat, humidity, or heavy workout sweating. Staying hydrated prevents muscle cramping, improves joint lubrication, and elevates cognitive energy levels.",
    category: 'Hydration'
  },
  {
    keywords: ['sleep', 'insomnia', 'tired', 'rest', 'bed'],
    answer: "Sleep is the foundation of physical recovery and hormonal balance. Aim for 7 to 9 hours nightly. Try our 4-7-8 breathing exercise or 5 minutes of Shavasana (Corpse Pose) before bed, dim screens 45 minutes prior, and keep your room cool.",
    category: 'Sleep & Recovery'
  },
  {
    keywords: ['stress', 'anxiety', 'calm', 'relax', 'breathing', 'nervous'],
    answer: "Use our Guided Breathing timer in the Yoga tab! The Box Breathing technique (4s Inhale, 4s Hold, 4s Exhale, 4s Hold) activates the parasympathetic vagus nerve, quickly reducing heart rate and cortisol levels. Pair it with 5 minutes of Balasana (Child’s pose).",
    category: 'Stress Management'
  },
  {
    keywords: ['protein', 'diet', 'meal', 'food', 'snack', 'vegetarian'],
    answer: "Great vegetarian protein sources include paneer (18g/100g), Greek yogurt, lentils/dal, soya chunks (52g/100g dry), tofu, and whey protein isolates. Non-vegetarian sources include chicken breast, eggs, and fish. Try logging your meals in the Wellness tracker!",
    category: 'Nutrition'
  },
  {
    keywords: ['beginner', 'start', 'confused', 'new', 'routine'],
    answer: "Welcome to your fitness journey! Start with our 'Beginner Fat Loss & Metabolic Kickstart' or 'Yoga Flow & Spinal Decompression' plan. Aim for 3 days a week for 30-40 minutes. Focus entirely on form over heavy weights. Consistency beats intensity every time!",
    category: 'Beginner Guidance'
  }
];

export const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const q = message.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_RESPONSES) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    let responseText = '';
    let category = 'General Advice';

    if (bestMatch && highestScore > 0) {
      responseText = bestMatch.answer;
      category = bestMatch.category;
    } else {
      responseText = `Thanks for asking! As your SWASTHYA assistant, I recommend focusing on consistent daily habits: structured 3-4 day workouts, mindful yoga & breathing, 2.5L+ hydration, and wholesome protein-rich meals. You can explore our Exercise and Asana libraries for exact form guides!`;
    }

    res.json({
      reply: responseText,
      category,
      disclaimer: "SWASTHYA AI Assistant provides general fitness and wellness guidance only. It is not intended as medical advice or clinical diagnosis.",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Chatbot service error.' });
  }
};
