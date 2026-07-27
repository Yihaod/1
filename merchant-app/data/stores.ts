export type ClinicStore = {
  id: string;
  name: string;
  /** 确定后可填写，填写后会在选店卡片展示 */
  address?: string;
  phone?: string;
  /** 营业时间摘要，如「周一至周日 10:00–21:00」 */
  hoursSummary?: string;
  /** 用于「附近门店」排序；未填写则无法参与距离排序 */
  latitude?: number;
  longitude?: number;
};

/**
 * 门店列表：目前仅保留名称供选择。
 * 地址、电话、营业时间确定后，在对应门店对象里补上可选字段即可。
 * 经纬度仅用于按距离排序（不在页面展示地址）；上线前请改为各门店真实坐标。
 */
export const clinicStores: ClinicStore[] = [
  { id: 'store-1', name: '1 号店', latitude: 31.2304, longitude: 121.4737 },
  { id: 'store-2', name: '2 号店', latitude: 31.188, longitude: 121.436 },
  { id: 'store-3', name: '3 号店', latitude: 31.22, longitude: 121.505 },
];

export function getStoreById(id: string): ClinicStore | undefined {
  return clinicStores.find((s) => s.id === id);
}
