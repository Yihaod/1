/** 本地开发 baseUrl 为空；GitHub Pages 构建时设 EXPO_PUBLIC_BASE_PATH=/1 */
const appJson = require('./app.json');

module.exports = () => ({
  expo: {
    ...appJson.expo,
    experiments: {
      baseUrl: process.env.EXPO_PUBLIC_BASE_PATH || '',
    },
  },
});
