import type { CustomerGender } from '@/types/booking';

export const genderOptions: { value: Exclude<CustomerGender, null>; label: string }[] = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
];

export function formatGender(gender?: CustomerGender | null): string | undefined {
  if (!gender) return undefined;
  return gender === 'male' ? '男' : '女';
}

const HONORIFIC_SUFFIX = /(先生|女士)$/;

/** 去掉姓名末尾已有尊称，避免重复拼接 */
export function stripCustomerHonorific(name: string): string {
  return name.trim().replace(HONORIFIC_SUFFIX, '').trim();
}

/** 确认信息、短信等展示用：按性别在姓名后加先生/女士 */
export function formatCustomerDisplayName(
  name: string,
  gender?: CustomerGender | null
): string {
  const base = stripCustomerHonorific(name);
  if (!base) return '';
  if (gender === 'male') return `${base}先生`;
  if (gender === 'female') return `${base}女士`;
  return base;
}
