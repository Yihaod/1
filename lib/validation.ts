export function isValidCnMobile(phone: string): boolean {
  return /^1\d{10}$/.test(phone.trim());
}

export function isNonEmptyName(name: string): boolean {
  return name.trim().length >= 2;
}
