/**
 * Generates an authentic Veloura reservation reference:
 * Format: VEL-XXXX-YY (e.g. VEL-4829-XQ)
 */
export function generateBookingReference() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const suffix = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `VEL-${randomNum}-${prefix}${suffix}`;
}

export default generateBookingReference;

