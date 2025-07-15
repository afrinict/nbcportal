import crypto from 'crypto';

export function generateApplicationId(licenseTypeId: number): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `NBC-${year}-${licenseTypeId}-${timestamp}`;
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RMT${timestamp}${random}`;
}

export function generateLicenseNumber(licenseTypeId: number): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `NBC${year}${licenseTypeId.toString().padStart(2, '0')}${timestamp}`;
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(num);
}

export function validateNIN(nin: string): boolean {
  // Basic NIN validation (11 digits)
  return /^\d{11}$/.test(nin);
}

export function validatePhone(phone: string): boolean {
  // Basic Nigerian phone number validation
  return /^(\+234|0)[789]\d{9}$/.test(phone.replace(/\s/g, ''));
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}
