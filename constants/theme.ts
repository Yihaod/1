import { Platform, ViewStyle } from 'react-native';

export const palette = {
  background: '#F6F2E9',
  backgroundWarm: '#EFE8DC',
  inkGreen: '#173D35',
  inkGreenMuted: '#2A5248',
  jade: '#79A995',
  jadeLight: '#C5DDD3',
  jadeMist: '#E8F0EC',
  text: '#252A28',
  textMuted: '#6B736F',
  textSoft: '#8A928E',
  cinnabar: '#B85C4A',
  card: '#FFFCF8',
  cardInner: '#F9F6F1',
  border: '#E0D8CC',
  borderLight: '#EDE7DC',
  disabled: '#B8C4BF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const bookingRules = {
  minParty: 1,
  maxParty: 6,
  brandLabel: '中医馆',
  brandTagline: '顺时调养 · 安心预约',
  headline: '为身体留一点时间',
  headlineSub: '选一席清静时光，赴一场身心调养',
  cardTitle: '预约到店',
  partyQuestion: '几位到店？',
  dateLabel: '选择日期',
  timeLabel: '选择时间',
};

/** 轻阴影，避免厚重 */
export const elevation = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: palette.inkGreen,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.07,
      shadowRadius: 28,
    },
    android: { elevation: 3 },
    default: {},
  }),
};
