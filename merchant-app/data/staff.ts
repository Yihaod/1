import type { StaffMember } from '@/types/admin';

/**
 * 演示用服务人员；姓名、岗位确定后在管理端或本文件维护。
 * 也可在「服务人员」页面临时切换是否上班（存本地）。
 */
export const staffMembers: StaffMember[] = [
  { id: 'staff-1a', storeId: 'store-1', name: '服务人员 A', role: '推拿师' },
  { id: 'staff-1b', storeId: 'store-1', name: '服务人员 B', role: '针灸师' },
  { id: 'staff-2a', storeId: 'store-2', name: '服务人员 C', role: '推拿师' },
  { id: 'staff-2b', storeId: 'store-2', name: '服务人员 D', role: '调理师' },
  { id: 'staff-3a', storeId: 'store-3', name: '服务人员 E', role: '艾灸师' },
  { id: 'staff-3b', storeId: 'store-3', name: '服务人员 F', role: '体质辨识' },
];

export function getStaffByStore(storeId: string): StaffMember[] {
  return staffMembers.filter((s) => s.storeId === storeId);
}

export function getStaffById(id: string): StaffMember | undefined {
  return staffMembers.find((s) => s.id === id);
}
