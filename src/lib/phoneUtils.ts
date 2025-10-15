/**
 * Phone number normalization and validation utilities
 * תומך בפורמטים: 05X-XXXX-XXX, 5X-XXXX-XXX, +972-5X-XXXX-XXX, 972-5X-XXXX-XXX
 */

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  
  // הסרת רווחים, מקפים, סוגריים
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // תמיכה ב-+972
  if (cleaned.startsWith('+972')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('972')) {
    cleaned = '0' + cleaned.slice(3);
  }
  
  // אם מתחיל ב-5 (ללא 0), הוסף 0
  if (cleaned.match(/^5\d{8,9}$/)) {
    cleaned = '0' + cleaned;
  }
  
  return cleaned;
}

export function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // תומך ב-9 או 10 ספרות (05X-XXXX-XXX או 05X-XXXX-XXXX)
  return /^05\d{8}$/.test(normalized) || /^05\d{9}$/.test(normalized);
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!validatePhone(normalized)) return phone;
  
  // פורמט: 05X-XXXX-XXX
  if (normalized.length === 10) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`;
  }
  return phone;
}
