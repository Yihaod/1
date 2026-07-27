import { StyleSheet, View } from 'react-native';
import { palette } from '@/constants/theme';

/** 东方养生感：淡山、雾气、枝条 */
export function DecorativeBackground() {
  return (
    <View style={styles.wrap} pointerEvents="none" accessibilityElementsHidden>
      <View style={styles.mistTop} />
      <View style={styles.mistBottom} />
      <View style={[styles.mountain, styles.m1]} />
      <View style={[styles.mountain, styles.m2]} />
      <View style={[styles.mountainFill, styles.m1Fill]} />
      <View style={styles.branch} />
      <View style={[styles.leaf, styles.leafA]} />
      <View style={[styles.leaf, styles.leafB]} />
      <View style={[styles.leaf, styles.leafC]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  mistTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(121, 169, 149, 0.08)',
  },
  mistBottom: {
    position: 'absolute',
    bottom: 40,
    left: -40,
    width: 280,
    height: 160,
    borderRadius: 140,
    backgroundColor: 'rgba(121, 169, 149, 0.06)',
  },
  mountain: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(23, 61, 53, 0.08)',
  },
  m1: {
    bottom: 100,
    left: -50,
    width: 220,
    height: 110,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 90,
  },
  m2: {
    bottom: 70,
    left: 80,
    width: 180,
    height: 80,
    opacity: 0.65,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 70,
  },
  mountainFill: {
    position: 'absolute',
    backgroundColor: 'rgba(121, 169, 149, 0.05)',
    borderWidth: 0,
  },
  m1Fill: {
    bottom: 98,
    left: -48,
    width: 216,
    height: 50,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 80,
  },
  branch: {
    position: 'absolute',
    top: 68,
    right: 32,
    width: 1,
    height: 96,
    backgroundColor: 'rgba(121, 169, 149, 0.28)',
    transform: [{ rotate: '6deg' }],
  },
  leaf: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(121, 169, 149, 0.24)',
    backgroundColor: 'rgba(121, 169, 149, 0.04)',
  },
  leafA: {
    top: 92,
    right: 24,
    width: 26,
    height: 12,
    borderRadius: 12,
    transform: [{ rotate: '-32deg' }],
  },
  leafB: {
    top: 118,
    right: 40,
    width: 20,
    height: 10,
    borderRadius: 10,
    transform: [{ rotate: '24deg' }],
  },
  leafC: {
    top: 142,
    right: 20,
    width: 18,
    height: 9,
    borderRadius: 9,
    transform: [{ rotate: '-8deg' }],
  },
});
