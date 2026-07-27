import type { CustomerGender } from '@/types/booking';

export const genderOptions: { value: Exclude<CustomerGender, null>; label: string }[] = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
];

export function formatGender(gender?: CustomerGender | null): string | undefined {
  if (!gender) return undefined;
  return gender === 'male' ? '男' : '女';
}
