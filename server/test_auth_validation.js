// server/test_auth_validation.js
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
  verifyEmail,
  validateRegistrationPayload
} from './utils/authValidators.js';

async function runTests() {
  console.log('====================================================');
  console.log('  SWASTHYA AUTHENTICATION & VALIDATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
    }
  }

  // 1. NAME VALIDATION TESTS
  console.log('--- 1. Full Name Validation ---');
  assert(validateName('Riya Sharma').valid, 'Valid standard full name');
  assert(validateName('Dr. Rajesh Sharma').valid, 'Valid title and name with period');
  assert(validateName("Mary-Jane O'Connor").valid, 'Valid hyphenated and apostrophe name');
  assert(!validateName('').valid, 'Empty name rejected');
  assert(!validateName('A').valid, 'Single letter name rejected (<2 chars)');
  assert(!validateName('Riya123').valid, 'Name with digits rejected');
  assert(!validateName('User@123').valid, 'Name with special symbols rejected');
  assert(!validateName('aaaaaaa').valid, 'Name with repetitive junk rejected');

  // 2. PHONE NUMBER & DIGIT COUNT TESTS
  console.log('\n--- 2. Phone Number & Digit Count Validation ---');
  const validMobile10 = validatePhoneNumber('9876543210');
  assert(validMobile10.valid && validMobile10.digitsCount === 10, 'Standard 10-digit mobile accepted');

  const validWithCountryCode = validatePhoneNumber('+91 98765 43210');
  assert(validWithCountryCode.valid && validWithCountryCode.digitsCount === 10, '+91 format with 10 national digits accepted');

  const validWithZero = validatePhoneNumber('09876543210');
  assert(validWithZero.valid && validWithZero.digitsCount === 10, 'Trunk 0 prefix 10 national digits accepted');

  const shortPhone = validatePhoneNumber('98765');
  assert(!shortPhone.valid && shortPhone.error.includes('5 digits'), 'Short phone number (5 digits) rejected with digit count', shortPhone.error);

  const longPhone = validatePhoneNumber('98765432101');
  assert(!longPhone.valid && shortPhone.error.includes('digits'), '11 digits phone number rejected (must be exactly 10 digits)', longPhone.error);

  const twelvePhone = validatePhoneNumber('987654321012');
  assert(!twelvePhone.valid && twelvePhone.error.includes('12 digits'), '12 digits phone number rejected without country code', twelvePhone.error);

  const repetitivePhone = validatePhoneNumber('0000000000');
  assert(!repetitivePhone.valid, 'Repeating dummy digits rejected');

  const invalidCharsPhone = validatePhoneNumber('+91 98765 ABCD');
  assert(!invalidCharsPhone.valid, 'Alphabetic letters in phone rejected');

  // 3. ADDRESS FORMAT TESTS
  console.log('\n--- 3. Residential Address Format Validation ---');
  const validCampusAddr = validateAddress('Room 204, Ganga Hostel, Swasthya Campus, New Delhi');
  assert(validCampusAddr.valid, 'Proper campus hostel address accepted');

  const validCityAddr = validateAddress('Flat 101, Sunshine Apts, MG Road, Bengaluru - 560001');
  assert(validCityAddr.valid, 'Proper city apartment address accepted');

  const shortAddr = validateAddress('Delhi');
  assert(!shortAddr.valid && shortAddr.error.includes('too short'), 'Too short address rejected (<10 chars)', shortAddr.error);

  const numbersOnlyAddr = validateAddress('1234567890123');
  assert(!numbersOnlyAddr.valid, 'Numbers only address rejected (needs street/locality letters)');

  const repetitiveAddr = validateAddress('aaaaaaaaaaaaaaaa');
  assert(!repetitiveAddr.valid, 'Repetitive character address rejected');

  // 4. EMAIL FORMAT & DOMAIN MX VERIFICATION TESTS
  console.log('\n--- 4. Email Format & Domain / MX Verification ---');
  const validFormat = await verifyEmail('testuser@gmail.com', { checkDns: false });
  assert(validFormat.valid, 'Valid email syntax accepted');

  const invalidFormat = await verifyEmail('notanemail', { checkDns: false });
  assert(!invalidFormat.valid, 'Missing @ symbol rejected');

  const doubleDots = await verifyEmail('user..name@gmail.com', { checkDns: false });
  assert(!doubleDots.valid, 'Consecutive dots in username rejected');

  const invalidTld = await verifyEmail('user@gmail.c', { checkDns: false });
  assert(!invalidTld.valid, 'Single letter TLD rejected');

  const campusEmail = await verifyEmail('riya@swasthya.edu', { checkDns: true });
  assert(campusEmail.valid, 'Campus internal domain verified');

  console.log('Querying real public email domain (gmail.com)...');
  const realDomain = await verifyEmail('athlete@gmail.com', { checkDns: true });
  assert(realDomain.valid && realDomain.verified, 'Real domain (gmail.com) verified with MX records');

  console.log('Querying nonexistent domain (fake98716254719284fake.com)...');
  const fakeDomain = await verifyEmail('user@fake98716254719284fake.com', { checkDns: true });
  assert(!fakeDomain.valid && fakeDomain.error.includes('does not exist'), 'Nonexistent domain rejected via DNS lookup', fakeDomain.error);

  // 5. COMPREHENSIVE REGISTRATION PAYLOAD TEST
  console.log('\n--- 5. Complete Registration Payload Validation ---');
  const validPayload = await validateRegistrationPayload({
    name: 'Aman Verma',
    email: 'aman@swasthya.edu',
    phone: '+91 98111 22334',
    address: 'Room 302, Yamuna Hostel, Swasthya Campus, New Delhi',
    password: 'Password123!'
  });
  assert(validPayload.valid, 'Complete valid user payload accepted');

  const invalidPayload = await validateRegistrationPayload({
    name: 'X',
    email: 'invalid@fake98716254719284fake.com',
    phone: '123',
    address: 'delhi',
    password: '123'
  });
  assert(!invalidPayload.valid && invalidPayload.errors.length === 5, `All 5 invalid fields detected correctly (found ${invalidPayload.errors.length} errors)`);

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
