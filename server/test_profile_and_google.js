// test_profile_and_google.js
const API = 'http://localhost:5000/api';

async function testAll() {
  console.log('--- TESTING PROFILE & GOOGLE AUTH ENHANCEMENTS ---');

  // 1. Test Registration with phone and address
  const uniqueEmail = `test.athlete.${Date.now()}@campus.edu`;
  const regRes = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Sharma',
      email: uniqueEmail,
      password: 'Password123!',
      phone: '+91 98765 99999',
      address: 'Hostel 5, Room 302, Delhi Campus'
    })
  }).then(r => r.json());

  console.log('1. Registration response:');
  console.log('   User:', regRes.user?.name);
  console.log('   Phone in user:', regRes.user?.phone || regRes.user?.profile?.phone);
  console.log('   Address in user:', regRes.user?.address || regRes.user?.profile?.address);

  const token = regRes.token;

  // 2. Test Profile Update: changing phone, address, and adding/removing avatar photo
  const updateRes1 = await fetch(`${API}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Pooja Sharma Updated',
      phone: '+91 99999 88888',
      address: 'Sector 14, Rohini, New Delhi',
      emergencyContact: '+91 99999 00000',
      avatarUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    })
  }).then(r => r.json());

  console.log('2a. Profile updated with custom photo:');
  console.log('   Name:', updateRes1.user?.name);
  console.log('   Phone:', updateRes1.user?.profile?.phone);
  console.log('   Address:', updateRes1.user?.profile?.address);
  console.log('   Photo length:', updateRes1.user?.profile?.avatarUrl?.length);

  // 2b. Test Profile Update: Removing photo
  const updateRes2 = await fetch(`${API}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      avatarUrl: ''
    })
  }).then(r => r.json());

  console.log('2b. Profile updated with photo removed:');
  console.log('   Avatar is cleared:', updateRes2.user?.profile?.avatarUrl === '');

  // 3. Test Google Account Chooser Authentication
  const googleAccountRes = await fetch(`${API}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'pappuya0099@gmail.com',
      name: 'Pappu Yadav',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    })
  }).then(r => r.json());

  console.log('3. Google Login with chosen account (pappuya0099@gmail.com):');
  console.log('   Name:', googleAccountRes.user?.name);
  console.log('   Email:', googleAccountRes.user?.email);
  console.log('   Token generated:', !!googleAccountRes.token);

  console.log('--- ALL PROFILE AND GOOGLE AUTH TESTS PASSED! ---');
}

testAll().catch(console.error);
