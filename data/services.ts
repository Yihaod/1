export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Service = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  rating: number;
  reviewCount: number;
  imageEmoji: string;
  provider: string;
  tags: string[];
};

export const categories: ServiceCategory[] = [
  { id: 'beauty', name: '美业', icon: 'cut-outline', color: '#EC4899' },
  { id: 'home', name: '到家', icon: 'home-outline', color: '#3B82F6' },
  { id: 'health', name: '健康', icon: 'heart-outline', color: '#10B981' },
  { id: 'fitness', name: '运动', icon: 'barbell-outline', color: '#F59E0B' },
  { id: 'pet', name: '宠物', icon: 'paw-outline', color: '#8B5CF6' },
  { id: 'more', name: '更多', icon: 'grid-outline', color: '#64748B' },
];

export const services: Service[] = [
  {
    id: 's1',
    categoryId: 'beauty',
    name: '精剪造型',
    description: '资深发型师一对一沟通，含洗吹造型。适合日常通勤与重要场合。',
    durationMinutes: 60,
    priceCents: 12800,
    rating: 4.9,
    reviewCount: 328,
    imageEmoji: '💇',
    provider: '青丝造型馆',
    tags: ['热门', '可上门'],
  },
  {
    id: 's2',
    categoryId: 'beauty',
    name: '美甲护理套餐',
    description: '基础护理 + 单色甲油胶，赠送手部按摩 10 分钟。',
    durationMinutes: 90,
    priceCents: 16800,
    rating: 4.8,
    reviewCount: 156,
    imageEmoji: '💅',
    provider: '指尖美学',
    tags: ['新店特惠'],
  },
  {
    id: 's3',
    categoryId: 'home',
    name: '深度保洁',
    description: '厨房、卫浴重点清洁，自带环保清洁剂与工具。',
    durationMinutes: 180,
    priceCents: 29900,
    rating: 4.7,
    reviewCount: 892,
    imageEmoji: '🧹',
    provider: '净到家',
    tags: ['口碑之选'],
  },
  {
    id: 's4',
    categoryId: 'home',
    name: '家电清洗',
    description: '空调/油烟机/洗衣机任选其一，高温消毒除菌。',
    durationMinutes: 120,
    priceCents: 19900,
    rating: 4.6,
    reviewCount: 445,
    imageEmoji: '🔧',
    provider: '净到家',
    tags: [],
  },
  {
    id: 's5',
    categoryId: 'health',
    name: '肩颈理疗',
    description: '持证理疗师操作，缓解久坐疲劳，含热敷。',
    durationMinutes: 45,
    priceCents: 15800,
    rating: 4.9,
    reviewCount: 621,
    imageEmoji: '💆',
    provider: '康愈堂',
    tags: ['热门'],
  },
  {
    id: 's6',
    categoryId: 'health',
    name: '中医推拿',
    description: '传统手法调理，适合腰背不适与运动恢复。',
    durationMinutes: 60,
    priceCents: 18800,
    rating: 4.8,
    reviewCount: 234,
    imageEmoji: '🌿',
    provider: '康愈堂',
    tags: [],
  },
  {
    id: 's7',
    categoryId: 'fitness',
    name: '私教体验课',
    description: '体测 + 定制训练计划讲解，适合新手入门。',
    durationMinutes: 60,
    priceCents: 9900,
    rating: 4.7,
    reviewCount: 189,
    imageEmoji: '🏋️',
    provider: '劲燃健身',
    tags: ['首单优惠'],
  },
  {
    id: 's8',
    categoryId: 'pet',
    name: '宠物洗澡美容',
    description: '中小型犬猫适用，含指甲修剪与耳道清洁。',
    durationMinutes: 90,
    priceCents: 13800,
    rating: 4.8,
    reviewCount: 97,
    imageEmoji: '🐕',
    provider: '毛孩子驿站',
    tags: ['可上门'],
  },
];

export function formatPrice(cents: number): string {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getCategoryById(id: string): ServiceCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function getServicesByCategory(categoryId: string): Service[] {
  if (categoryId === 'more') return services;
  return services.filter((s) => s.categoryId === categoryId);
}

/** 可预约时段（演示用固定模板） */
export function getTimeSlotsForDate(dateKey: string): string[] {
  const seed = dateKey.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  const all = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '18:00',
    '18:30',
    '19:00',
  ];
  return all.filter((_, i) => (i + seed) % 5 !== 0);
}

export function getNextDays(count: number): { key: string; label: string; weekday: string }[] {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const result: { key: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const label = i === 0 ? '今天' : i === 1 ? '明天' : `${d.getMonth() + 1}/${d.getDate()}`;
    result.push({ key, label, weekday: weekdays[d.getDay()] });
  }
  return result;
}
