export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  // Parse date string (YYYY-MM-DD) in local/UTC date to avoid day-off issues
  const parts = typeof dateString === 'string' ? dateString.split('-') : [];
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const p1 = checkIn.split('-').map(Number);
  const p2 = checkOut.split('-').map(Number);
  if (p1.length !== 3 || p2.length !== 3) return 0;
  
  const start = Date.UTC(p1[0], p1[1] - 1, p1[2]);
  const end = Date.UTC(p2[0], p2[1] - 1, p2[2]);
  
  const diffTime = end - start;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function generateBookingReference() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const suffix = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `VEL-${randomNum}-${prefix}${suffix}`;
}

export function getTodayDateString(offsetDays = 0) {
  const now = new Date();
  const kolkataFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const kolkataDateStr = kolkataFormatter.format(now);
  const [year, month, day] = kolkataDateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day + offsetDays));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dt = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dt}`;
}

/**
 * Validates 10-digit Indian mobile numbers (+91, 91, 0, or direct 10-digit starting with 6-9)
 */
export function isValidIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validates 6-digit Indian PIN codes (cannot start with 0)
 */
export function isValidIndianPinCode(pin) {
  if (!pin) return false;
  const cleaned = String(pin).trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * List of all 36 Indian States and Union Territories
 */
export const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];
