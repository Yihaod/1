export function maskPhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.length === 11) {
    return `${trimmed.slice(0, 3)}****${trimmed.slice(7)}`;
  }
  return trimmed;
}
