export type ClinicService = {
  id: string;
  name: string;
  description: string;
  durationLabel: string;
  icon: string;
};

export const clinicServices: ClinicService[] = [
  {
    id: 'tuina',
    name: '推拿调理',
    description: '舒筋活络，缓解疲劳与肌肉紧张',
    durationLabel: '约 45–60 分钟',
    icon: '🤲',
  },
  {
    id: 'acupuncture',
    name: '针灸',
    description: '传统针法，辅助调理经络与不适',
    durationLabel: '约 30–45 分钟',
    icon: '📍',
  },
  {
    id: 'moxibustion',
    name: '艾灸',
    description: '温通经络，适合畏寒、虚损调养',
    durationLabel: '约 30–40 分钟',
    icon: '🔥',
  },
  {
    id: 'cupping',
    name: '拔罐',
    description: '祛湿散寒，放松背颈与肩背',
    durationLabel: '约 20–30 分钟',
    icon: '⭕',
  },
  {
    id: 'consult',
    name: '体质辨识',
    description: '望闻问切，了解体质与调养方向',
    durationLabel: '约 20–30 分钟',
    icon: '🍃',
  },
  {
    id: 'combo',
    name: '综合调养',
    description: '由医师根据到店情况安排项目组合',
    durationLabel: '时长到店确认',
    icon: '✨',
  },
];

export function getServiceById(id: string): ClinicService | undefined {
  return clinicServices.find((s) => s.id === id);
}
