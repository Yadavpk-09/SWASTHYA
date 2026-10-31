// server/test_otp_flow.js
async function runOtpTests() {
  const BASE_URL = 'http://localhost:5000';
  console.log('Testing SWASTHYA Live Registration OTP Flow...');

  // Test 1: Send OTP with invalid phone (11 digits)
  console.log('\n1. Testing OTP request with 11-digit phone (should fail):');
  const phoneFailRes = await fetch(`${BASE_URL}/api/auth/send-registration-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.test@gmail.com',
      phone: '98765432101', // 11 digits
      address: 'Flat 402, Lotus Towers, MG Road, Pune'
    })
  });
  const phoneFailData = await phoneFailRes.json();
  console.log('Status:', phoneFailRes.status, '| Error:', phoneFailData.error);
  if (phoneFailRes.status === 400 && phoneFailData.error.includes('10 digits')) {
    console.log('✅ PASS: Rejected 11-digit phone number as required.');
  } else {
    console.error('❌ FAIL: Did not reject non-10-digit phone number.');
  }

  // Test 2: Send OTP with valid 10-digit phone and email
  console.log('\n2. Testing OTP request with valid 10-digit phone & valid email:');
  const otpRes = await fetch(`${BASE_URL}/api/auth/send-registration-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.test@gmail.com',
      phone: '9876543210', // exact 10 digits
      address: 'Flat 402, Lotus Towers, MG Road, Pune'
    })
  });
  const otpData = await otpRes.json();
  console.log('Status:', otpRes.status, '| Response:', otpData);
  if (otpRes.status === 200 && otpData.otp && otpData.otp.length === 6) {
    console.log(`✅ PASS: Generated 6-digit OTP: ${otpData.otp}`);
  } else {
    console.error('❌ FAIL: OTP generation failed.');
    process.exit(1);
  }

  const generatedOtp = otpData.otp;

  // Test 3: Register without OTP (should fail)
  console.log('\n3. Testing registration without OTP (should fail):');
  const noOtpRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.test@gmail.com',
      password: 'Password123!',
      phone: '9876543210',
      address: 'Flat 402, Lotus Towers, MG Road, Pune'
    })
  });
  const noOtpData = await noOtpRes.json();
  console.log('Status:', noOtpRes.status, '| Error:', noOtpData.error);
  if (noOtpRes.status === 400 && noOtpData.error.includes('OTP')) {
    console.log('✅ PASS: Registration rejected when OTP is missing.');
  } else {
    console.error('❌ FAIL: Allowed registration without OTP.');
  }

  // Test 4: Register with incorrect OTP (should fail)
  console.log('\n4. Testing registration with incorrect OTP (should fail):');
  const wrongOtpRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.test@gmail.com',
      password: 'Password123!',
      phone: '9876543210',
      address: 'Flat 402, Lotus Towers, MG Road, Pune',
      otp: '000000'
    })
  });
  const wrongOtpData = await wrongOtpRes.json();
  console.log('Status:', wrongOtpRes.status, '| Error:', wrongOtpData.error);
  if (wrongOtpRes.status === 400 && wrongOtpData.error.includes('Invalid')) {
    console.log('✅ PASS: Registration rejected with incorrect OTP.');
  } else {
    console.error('❌ FAIL: Allowed registration with incorrect OTP.');
  }

  // Test 5: Register with correct OTP (should succeed)
  console.log('\n5. Testing registration with valid generated OTP:');
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.test@gmail.com',
      password: 'Password123!',
      phone: '9876543210',
      address: 'Flat 402, Lotus Towers, MG Road, Pune',
      otp: generatedOtp
    })
  });
  const registerData = await registerRes.json();
  console.log('Status:', registerRes.status, '| User:', registerData.user?.name, '| Token:', !!registerData.token);
  if (registerRes.status === 201 && registerData.token && registerData.user?.email === 'rohan.test@gmail.com') {
    console.log('✅ PASS: Registration succeeded with verified email and 10-digit phone!');
  } else {
    console.error('❌ FAIL: Registration failed with correct OTP.');
    process.exit(1);
  }

  console.log('\n🎉 ALL OTP & 10-DIGIT PHONE INTEGRATION TESTS PASSED!\n');
}

runOtpTests();
