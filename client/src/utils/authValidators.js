// client/src/utils/authValidators.js

/**
 * Validates full name format
 * @param {string} name
 * @returns {{ valid: boolean, error?: string, formatted?: string }}
 */
export function validateName(name) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { valid: false, error: 'Full name is required.' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long.' };
  }

  if (trimmed.length > 70) {
    return { valid: false, error: 'Name cannot exceed 70 characters.' };
  }

  const nameRegex = /^[a-zA-Z\u00C0-\u024F\s.'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and periods (no numbers or special symbols).'
    };
  }

  const letterCount = (trimmed.match(/[a-zA-Z\u00C0-\u024F]/g) || []).length;
  if (letterCount < 2) {
    return { valid: false, error: 'Name must contain at least 2 alphabetic letters.' };
  }

  if (/(\w)\1{3,}/i.test(trimmed)) {
    return { valid: false, error: 'Name contains unusual repetitive characters.' };
  }

  return { valid: true, formatted: trimmed };
}

/**
 * Validates email format and structure
 * @param {string} email
 * @returns {{ valid: boolean, error?: string, domain?: string, cleanEmail?: string }}
 */
export function validateEmailFormat(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, error: 'Email address is required.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, error: 'Please enter a valid email format (e.g. user@domain.com).' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Email must contain exactly one @ symbol.' };
  }

  const [localPart, domain] = parts;

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { valid: false, error: 'Email username cannot start, end, or contain consecutive dots.' };
  }

  if (localPart.length > 64) {
    return { valid: false, error: 'Email username is too long (maximum 64 characters).' };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, error: 'Email domain must have a valid extension (e.g. .com, .edu, .org, .in).' };
  }

  return { valid: true, domain, cleanEmail };
}

/**
 * Validates phone number and checks that it is exactly 10 digits
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string, digitsCount: number, formatted?: string }}
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { valid: false, error: 'Phone number is required.', digitsCount: 0 };
  }

  const trimmed = phone.trim();

  if (!/^[+]?[\d\s\-().]{1,25}$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Phone number contains invalid characters. Use 10 digits with optional spaces or dashes.',
      digitsCount: trimmed.replace(/\D/g, '').length
    };
  }

  const digits = trimmed.replace(/\D/g, '');

  // Extract national 10-digit mobile number if +91 country code or leading 0 prefix is used
  let nationalNumber = digits;
  if (digits.length === 12 && digits.startsWith('91')) {
    nationalNumber = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    nationalNumber = digits.slice(1);
  }

  // Strictly enforce exactly 10 digits
  if (nationalNumber.length !== 10) {
    return {
      valid: false,
      error: `Phone number must be exactly 10 digits (you entered ${nationalNumber.length} digits).`,
      digitsCount: nationalNumber.length
    };
  }

  // Check for all-identical digits (e.g. 0000000000 or 1111111111)
  if (/^(\d)\1{9}$/.test(nationalNumber)) {
    return {
      valid: false,
      error: 'Phone number cannot consist of all identical repeating digits.',
      digitsCount: 10
    };
  }

  // 10-digit mobile prefix check (starts with 6, 7, 8, or 9)
  if (!/^[6-9]\d{9}$/.test(nationalNumber)) {
    return {
      valid: false,
      error: '10-digit mobile number must start with 6, 7, 8, or 9 (e.g. 9876543210 or +91 98765 43210).',
      digitsCount: 10
    };
  }

  return {
    valid: true,
    digitsCount: 10,
    formatted: trimmed
  };
}

/**
 * Validates residential / campus hostel address
 * @param {string} address
 * @returns {{ valid: boolean, error?: string, formatted?: string }}
 */
export function validateAddress(address) {
  if (!address || typeof address !== 'string' || !address.trim()) {
    return { valid: false, error: 'Residential address / hostel location is required.' };
  }

  const trimmed = address.trim();

  if (trimmed.length < 10) {
    return {
      valid: false,
      error: 'Address is too short. Please provide a complete address with street/locality and city (minimum 10 characters).'
    };
  }

  if (trimmed.length > 250) {
    return { valid: false, error: 'Address cannot exceed 250 characters.' };
  }

  if (!/^[a-zA-Z0-9\s,.\-#/()':;]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Address contains invalid special characters.'
    };
  }

  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters < 5) {
    return {
      valid: false,
      error: 'Address must contain street, locality, or campus names (cannot be just numbers or symbols).'
    };
  }

  const parts = trimmed.split(/[\s,/-]+/).filter((w) => w.length >= 2);
  if (parts.length < 2) {
    return {
      valid: false,
      error: 'Please provide a structured address (e.g. Hostel/Room, Street/Campus, City).'
    };
  }

  if (/(\w)\1{4,}/.test(trimmed)) {
    return { valid: false, error: 'Address contains invalid repetitive characters.' };
  }

  return { valid: true, formatted: trimmed };
}
