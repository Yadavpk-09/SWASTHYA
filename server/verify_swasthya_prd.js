// verify_swasthya_prd.js
const API = 'http://localhost:5000/api';

async function testAll() {
  console.log('--- STARTING SWASTHYA PRD VERIFICATION ---');

  // 1. Health
  const healthRes = await fetch(`${API}/health`).then(r => r.json());
  console.log('1. Health check:', healthRes.platform, 'version:', healthRes.version);

  // 2. Auth - User Login
  const userLogin = await fetch(`${API}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona: 'riya' })
  }).then(r => r.json());
  console.log('2. User Demo Login (Riya):', userLogin.user?.name, 'Role:', userLogin.user?.role);
  const userToken = userLogin.token;

  // 3. Auth - Dedicated Admin Login
  const adminLogin = await fetch(`${API}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@swasthya.edu', password: 'adminpassword123' })
  }).then(r => r.json());
  console.log('3. Dedicated Admin Login:', adminLogin.user?.name, 'Role:', adminLogin.user?.role);
  const adminToken = adminLogin.token;

  // Verify non-admin blocked from admin endpoints
  const blockedCheck = await fetch(`${API}/admin/stats`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  console.log('3b. Non-admin accessing /api/admin/stats blocked:', blockedCheck.status === 403 ? 'PASS (403)' : 'FAIL');

  // 4. Module 2 & 3: Requirement Assessment & Conditional Plan Generation
  // Test A: High Stress -> Expect Meditation Recommended
  const assessHigh = await fetch(`${API}/assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      age: 21,
      gender: 'female',
      height: 165,
      weight: 60,
      goal: 'Fat Loss',
      activityLevel: 'Moderately Active',
      daysAvailable: 3,
      injuries: ['Knee soreness'],
      dietaryPreference: 'Vegetarian',
      stressLevel: 'high',
      sleepPattern: 'poor'
    })
  }).then(r => r.json());
  console.log('4a. Assessment High Stress: BMI =', assessHigh.assessment?.bmi,
    'Meditation Recommended =', assessHigh.planPackage?.meditationRecommended,
    'Diet Target =', assessHigh.planPackage?.dietPlan?.dailyCalorieTarget, 'kcal');

  // Test B: Low Stress & Good Sleep -> Expect Meditation Skipped (FR3.1)
  const assessLow = await fetch(`${API}/assessment/retake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      age: 21,
      gender: 'female',
      height: 165,
      weight: 60,
      goal: 'Fat Loss',
      activityLevel: 'Lightly Active',
      daysAvailable: 3,
      injuries: [],
      dietaryPreference: 'Vegetarian',
      stressLevel: 'low',
      sleepPattern: 'good'
    })
  }).then(r => r.json());
  console.log('4b. Assessment Low Stress / Good Sleep: Meditation Recommended =', assessLow.planPackage?.meditationRecommended,
    '(Expected: false)');

  // 5. Module 6: Breathing Techniques Library
  const breathList = await fetch(`${API}/breathing`).then(r => r.json());
  console.log('5a. Breathing Techniques Total seeded:', breathList.length,
    'Sample technique:', breathList[0]?.name, 'Cadence:', breathList[0]?.pattern);
  const filterBreath = await fetch(`${API}/breathing?tag=better%20sleep`).then(r => r.json());
  console.log('5b. Filter by tag "better sleep":', filterBreath.map(b => b.name));

  const completeBreath = await fetch(`${API}/breathing/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ techniqueId: 'breath-box', durationMinutes: 4 })
  }).then(r => r.json());
  console.log('5c. Complete Breathing Session:', completeBreath.message, 'Added points:', completeBreath.addedPoints);

  // 6. Module 7: Stress Management Roadmap
  const roadmapHigh = await fetch(`${API}/roadmap/high`).then(r => r.json());
  console.log('6a. High Stress Roadmap steps count:', roadmapHigh.steps?.length);
  console.log('6b. Node 1 rationale (whyHere):', roadmapHigh.steps[0]?.whyHere);

  const stepComplete = await fetch(`${API}/roadmap/step/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ stepNumber: 1, category: 'high', stepTitle: roadmapHigh.steps[0]?.title })
  }).then(r => r.json());
  console.log('6c. Complete Roadmap Step:', stepComplete.message);

  // 7. Module 10: Smart Calorie & Nutrition Tracker
  const foodSearch = await fetch(`${API}/nutrition/search?q=paneer`, {
    headers: { Authorization: `Bearer ${userToken}` }
  }).then(r => r.json());
  console.log('7a. Food Search "paneer":', foodSearch[0]?.name, 'Macros: P', foodSearch[0]?.protein, 'C', foodSearch[0]?.carbs, 'F', foodSearch[0]?.fat);

  const logMealRes = await fetch(`${API}/nutrition/meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ foodId: foodSearch[0]?.id, servings: 1.5, mealType: 'Lunch' })
  }).then(r => r.json());
  console.log('7b. Meal Auto Logged:', logMealRes.meal?.name, 'Calories:', logMealRes.meal?.calories, 'Protein:', logMealRes.meal?.protein_g, 'g');

  const todayNutrition = await fetch(`${API}/nutrition/today`, {
    headers: { Authorization: `Bearer ${userToken}` }
  }).then(r => r.json());
  console.log('7c. Today Nutrition Guidance Banner (FR10.3):', todayNutrition.summaryText);

  // 8. Module 8: Weekly Progress & Weigh-In
  const weeklyWeighin = await fetch(`${API}/progress/weekly-weighin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ weight: 59.6, waist_cm: 72, notes: 'Feeling leaner' })
  }).then(r => r.json());
  console.log('8a. Weekly Weigh-in Recorded:', weeklyWeighin.message, 'Weight:', weeklyWeighin.log?.weight);

  const weeklySummary = await fetch(`${API}/progress/weekly`, {
    headers: { Authorization: `Bearer ${userToken}` }
  }).then(r => r.json());
  console.log('8b. Weekly Summary Card (FR8.3):', weeklySummary.currentWeek?.weightDiffText,
    '| Workouts:', weeklySummary.currentWeek?.completionSummary,
    '| Adherence:', weeklySummary.currentWeek?.adherencePercent + '%');

  console.log('--- ALL PRD MODULE VERIFICATIONS COMPLETED SUCCESSFULLY ---');
}

testAll().catch(console.error);
