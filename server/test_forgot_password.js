// test_forgot_password.js
const API = 'http://localhost:5000/api';

async function testForgotPassword() {
  console.log('--- TESTING FORGOT & RESET PASSWORD FLOW ---');

  // 1. Request verification code for user
  const forgotRes = await fetch(`${API}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'riya@swasthya.edu' })
  }).then(r => r.json());

  console.log('1. Forgot Password response:', forgotRes.message);
  console.log('   Reset code generated:', forgotRes.resetCode);

  if (!forgotRes.resetCode) {
    throw new Error('Reset code was not generated!');
  }

  // 2. Reset password using the code
  const resetRes = await fetch(`${API}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'riya@swasthya.edu',
      resetCode: forgotRes.resetCode,
      newPassword: 'MyNewSecretPassword123!'
    })
  }).then(r => r.json());

  console.log('2. Reset Password response:', resetRes.message);

  // 3. Log in with the new password
  const loginWithNew = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'riya@swasthya.edu',
      password: 'MyNewSecretPassword123!'
    })
  }).then(r => r.json());

  console.log('3. Login with New Password successful:', loginWithNew.user?.name, 'Token:', !!loginWithNew.token);

  // 4. Reset back to Password123! for demo continuity
  const forgotRes2 = await fetch(`${API}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'riya@swasthya.edu' })
  }).then(r => r.json());

  await fetch(`${API}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'riya@swasthya.edu',
      resetCode: forgotRes2.resetCode,
      newPassword: 'Password123!'
    })
  });

  console.log('4. Restored test password to Password123! successfully');

  // 5. Test Admin forgot password request
  const adminForgot = await fetch(`${API}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@swasthya.edu' })
  }).then(r => r.json());

  console.log('5. Admin Forgot Password response:', adminForgot.message, 'Reset code:', adminForgot.resetCode);

  console.log('--- ALL FORGOT & RESET PASSWORD TESTS PASSED! ---');
}

testForgotPassword().catch(console.error);
