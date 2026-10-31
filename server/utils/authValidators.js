// server/utils/authValidators.js
import dns from 'dns';

/**
 * Configure reliable DNS servers if default is localhost loopback
 */
function ensureDnsServers() {
  try {
    const servers = dns.getServers();
    if (!servers || servers.length === 0 || servers.includes('127.0.0.1')) {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }
  } catch (e) {
    // Non-fatal fallback
  }
}

/**
 * Validates a user's full name
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

  // Allow alphabetic characters, spaces, hyphens, periods, and apostrophes
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

  // Reject repetitive character spam (e.g. "aaaaa" or "zzzzz")
  if (/(\w)\1{3,}/i.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid repetitive characters.' };
  }

  return { valid: true, formatted: trimmed };
}

/**
 * Validates phone number and checks that it is exactly 10 digits
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string, digitsCount?: number, nationalNumber?: string, formatted?: string }}
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { valid: false, error: 'Phone number is required.', digitsCount: 0 };
  }

  const trimmed = phone.trim();

  // Validate allowed characters: digits, spaces, dashes, parentheses, dots, optional leading plus
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

  // Standard 10-digit mobile check (starts with 6, 7, 8, or 9)
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
    nationalNumber,
    formatted: trimmed
  };
}

/**
 * Validates residential / campus address format
 * @param {string} address
 * @returns {{ valid: boolean, error?: string, formatted?: string }}
 */
export function validateAddress(address) {
  if (!address || typeof address !== 'string' || !address.trim()) {
    return { valid: false, error: 'Address is required.' };
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

  // Check allowed characters: letters, numbers, spaces, commas, periods, hyphens, slashes, hash, colon, quotes, parentheses
  if (!/^[a-zA-Z0-9\s,.\-#/()':;]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Address contains invalid special characters.'
    };
  }

  // Must contain letters for street, area, hostel, or city
  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters < 5) {
    return {
      valid: false,
      error: 'Address must contain street or locality names (cannot be just numbers or punctuation).'
    };
  }

  // Must have multi-part structure (e.g. Room/Hostel + Campus/City or Street + City)
  const parts = trimmed.split(/[\s,/-]+/).filter((w) => w.length >= 2);
  if (parts.length < 2) {
    return {
      valid: false,
      error: 'Please provide a structured address (e.g. Hostel/Room, Street/Campus, City).'
    };
  }

  // Check against repetitive garbage spam
  if (/(\w)\1{4,}/.test(trimmed)) {
    return { valid: false, error: 'Address contains invalid repetitive characters.' };
  }

  return { valid: true, formatted: trimmed };
}

/**
 * Validates email format and verifies domain existence & MX records via DNS
 * @param {string} email
 * @param {{ checkDns?: boolean }} [options]
 * @returns {Promise<{ valid: boolean, error?: string, domain?: string, verified?: boolean, warning?: string }>}
 */
export async function verifyEmail(email, { checkDns = true } = {}) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, error: 'Email address is required.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Basic RFC 5322 compliant regex
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
    return { valid: false, error: 'Email domain must have a valid top-level extension (e.g. .com, .edu, .org, .in).' };
  }

  // Whitelist system/internal campus demo domains
  const whitelisted = ['swasthya.edu', 'campus.edu', 'localhost', 'test.edu', 'example.com'];
  if (whitelisted.includes(domain)) {
    return { valid: true, domain, verified: true, internal: true };
  }

  if (!checkDns) {
    return { valid: true, domain, verified: false };
  }

  ensureDnsServers();

  try {
    const mxPromise = dns.promises.resolveMx(domain);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DNS_TIMEOUT')), 3500)
    );
    const mxRecords = await Promise.race([mxPromise, timeoutPromise]);

    if (mxRecords && mxRecords.length > 0) {
      return { valid: true, domain, verified: true, mxCount: mxRecords.length };
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return {
        valid: false,
        error: `The email domain "${domain}" does not exist on the internet.`
      };
    }

    if (err.code === 'ENODATA') {
      // Check A/AAAA record fallback
      try {
        const lookup = await dns.promises.lookup(domain);
        if (lookup && lookup.address) {
          return { valid: true, domain, verified: true, hasARecord: true };
        }
      } catch (lookupErr) {
        return {
          valid: false,
          error: `The email domain "${domain}" does not have active mail servers (no MX records found).`
        };
      }
    }

    if (err.message === 'DNS_TIMEOUT') {
      console.warn(`[AUTH] DNS lookup timed out for domain: ${domain}. Proceeding with validated format.`);
      return {
        valid: true,
        domain,
        verified: false,
        warning: 'Domain DNS verification timed out, but format is valid.'
      };
    }

    console.warn(`[AUTH] DNS resolution issue for ${domain}: ${err.code || err.message}`);
    // If DNS server is unreachable/network error, allow format if valid
    return {
      valid: true,
      domain,
      verified: false,
      warning: 'Live domain check temporarily unavailable.'
    };
  }

  return { valid: true, domain, verified: true };
}

/**
 * Validates complete registration payload (User or Admin)
 * @param {object} params
 * @returns {Promise<{ valid: boolean, errors: string[] }>}
 */
export async function validateRegistrationPayload({
  name,
  email,
  password,
  phone,
  address
}) {
  const errors = [];

  // 1. Name check
  const nameRes = validateName(name);
  if (!nameRes.valid) errors.push(nameRes.error);

  // 2. Email & Domain verification
  const emailRes = await verifyEmail(email, { checkDns: true });
  if (!emailRes.valid) errors.push(emailRes.error);

  // 3. Phone check (digits count & valid prefix)
  const phoneRes = validatePhoneNumber(phone);
  if (!phoneRes.valid) errors.push(phoneRes.error);

  // 4. Address check (proper format & structure)
  const addressRes = validateAddress(address);
  if (!addressRes.valid) errors.push(addressRes.error);

  // 5. Password check
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      name: nameRes.formatted || name,
      email: email ? email.trim().toLowerCase() : '',
      phone: phoneRes.formatted || phone,
      address: addressRes.formatted || address
    }
  };
}
