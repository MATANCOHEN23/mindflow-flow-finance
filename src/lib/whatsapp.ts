/**
 * WhatsApp Integration Utilities
 * Supports Israeli phone number formats and wa.me deep links
 */

import { normalizePhone, validatePhone } from './phoneUtils';

/**
 * Converts a local Israeli phone number to international format
 * 05X-XXXX-XXX → 972XXXXXXXXX
 */
export function phoneToInternational(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!normalized) return '';
  
  // Remove leading 0 and prepend 972
  if (normalized.startsWith('0')) {
    return '972' + normalized.slice(1);
  }
  
  return normalized;
}

/**
 * Generate WhatsApp Web URL for sending a message
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const internationalPhone = phoneToInternational(phone);
  
  if (!internationalPhone) {
    console.warn('Invalid phone number for WhatsApp:', phone);
    return '';
  }
  
  let url = `https://wa.me/${internationalPhone}`;
  
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  
  return url;
}

/**
 * Open WhatsApp with a pre-filled message
 */
export function openWhatsApp(phone: string, message?: string): void {
  const url = getWhatsAppUrl(phone, message);
  
  if (!url) {
    console.error('Cannot open WhatsApp: invalid phone number');
    return;
  }
  
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generate a payment reminder message in Hebrew
 */
export function getPaymentReminderMessage(
  clientName: string, 
  amount: number, 
  category?: string
): string {
  const formattedAmount = amount.toLocaleString('he-IL');
  
  let message = `שלום ${clientName} 👋\n\n`;
  message += `זוהי תזכורת ידידותית בנוגע לתשלום הממתין שלך בסך ₪${formattedAmount}`;
  
  if (category) {
    message += ` עבור ${category}`;
  }
  
  message += `.\n\nאשמח לעמוד לרשותך בכל שאלה 🙏`;
  
  return message;
}

/**
 * Generate a general contact message
 */
export function getGeneralContactMessage(clientName: string): string {
  return `שלום ${clientName} 👋\n\nרציתי ליצור איתך קשר...`;
}

/**
 * Send bulk WhatsApp reminders (opens each in new tab)
 */
export function sendBulkReminders(
  payments: Array<{
    clientName: string;
    phone: string;
    amount: number;
    category?: string;
  }>
): void {
  if (payments.length === 0) return;
  
  // Open first immediately
  const first = payments[0];
  openWhatsApp(first.phone, getPaymentReminderMessage(first.clientName, first.amount, first.category));
  
  // Open rest with delays to avoid browser blocking
  payments.slice(1).forEach((payment, index) => {
    setTimeout(() => {
      openWhatsApp(payment.phone, getPaymentReminderMessage(payment.clientName, payment.amount, payment.category));
    }, (index + 1) * 1000);
  });
}
