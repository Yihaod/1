/** 本地开发 baseUrl 为空；GitHub Pages 构建时设 EXPO_PUBLIC_BASE_PATH=/1 */
const appJson = require('./app.json');

module.exports = () => ({
  expo: {
    ...appJson.expo,
    experiments: {
      baseUrl: process.env.EXPO_PUBLIC_BASE_PATH || '',
    },
    ios: {
      ...appJson.expo.ios,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          '用于按距离为您推荐较近的门店，不会上传您的精确位置。',
      },
    },
    android: {
      ...appJson.expo.android,
      permissions: [...(appJson.expo.android?.permissions ?? []), 'ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    },
  },
});
