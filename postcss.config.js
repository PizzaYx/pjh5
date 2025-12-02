export default {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375, // 设计稿宽度（根据你的设计图调整）
      viewportHeight: 667, // 设计稿高度
      unitPrecision: 3, // 转换后保留的小数位数
      viewportUnit: 'vw', // 转换后的单位
      selectorBlackList: ['.ignore', '.hairlines'], // 不需要转换的类名
      minPixelValue: 1, // 小于1px不转换
      mediaQuery: false, // 允许媒体查询中转换
      exclude: [/node_modules/], // 排除node_modules
    },
  },
}

