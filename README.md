# Vue3 + TypeScript + Vite 移动端 H5 项目

一个完整的 Vue3 移动端 H5 项目框架，开箱即用。

## 技术栈

- **框架**: Vue 3.5 + TypeScript
- **构建工具**: Vite 7.2
- **UI 组件**: Vant 4
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **网络请求**: Axios
- **CSS 预处理**: Sass
- **移动端适配**: postcss-px-to-viewport-8-plugin

## 项目特性

✅ 完整的 TypeScript 支持  
✅ 移动端 px 自动转 vw 适配方案  
✅ Vant 组件自动按需引入  
✅ Vue API 自动导入（ref, computed, watch 等）  
✅ 完善的 Axios 封装（请求/响应拦截、错误处理、Loading）  
✅ 常用工具函数封装（storage, validator, format 等）  
✅ 路由配置及页面 KeepAlive 缓存  
✅ Pinia 状态管理示例  
✅ 完整的全局样式和工具类  

## 目录结构

```
pjh5/
├── public/                # 静态资源
├── src/
│   ├── api/              # API 接口
│   │   └── index.ts      # 接口定义
│   ├── assets/           # 资源文件
│   ├── components/       # 公共组件
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── stores/           # 状态管理
│   │   ├── app.ts        # 应用状态
│   │   └── user.ts       # 用户状态
│   ├── styles/           # 全局样式
│   │   ├── common.scss   # 通用样式类
│   │   ├── reset.scss    # 重置样式
│   │   ├── variables.scss # 变量定义
│   │   └── index.scss    # 样式入口
│   ├── utils/            # 工具函数
│   │   ├── format.ts     # 格式化函数
│   │   ├── request.ts    # Axios 封装
│   │   ├── storage.ts    # 存储函数
│   │   ├── validator.ts  # 验证函数
│   │   └── index.ts      # 工具函数入口
│   ├── views/            # 页面
│   │   ├── Home.vue      # 首页
│   │   ├── Demo.vue      # 示例页
│   │   └── NotFound.vue  # 404页面
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── env.d.ts          # 类型声明
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── postcss.config.js     # PostCSS 配置
└── package.json          # 依赖配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 配置说明

### 移动端适配

项目使用 `postcss-px-to-viewport-8-plugin` 实现移动端适配，设计稿宽度默认为 375px。

修改 `postcss.config.js` 中的 `viewportWidth` 来适配你的设计稿：

```js
viewportWidth: 375, // 你的设计稿宽度
```

### API 配置

1. 修改 `vite.config.ts` 中的代理配置：

```ts
proxy: {
  '/api': {
    target: 'http://your-api-url.com', // 你的 API 地址
    changeOrigin: true,
  },
},
```

2. 在 `src/api/index.ts` 中定义接口：

```ts
export const yourApi = {
  getData() {
    return get<Response>('/your-endpoint')
  },
}
```

### 网络请求

已封装好的 Axios 实例，支持：
- 自动添加 token
- 请求/响应拦截
- 错误统一处理
- Loading 提示

使用示例：

```ts
import { get, post } from '@/utils/request'

// GET 请求
const data = await get('/api/users')

// POST 请求
const result = await post('/api/login', { username, password })
```

### 工具函数

#### 本地存储

```ts
import { storage } from '@/utils'

// 存储
storage.set('key', value)

// 读取
const value = storage.get('key')

// 删除
storage.remove('key')
```

#### 表单验证

```ts
import { isPhone, isEmail, validators } from '@/utils/validator'

// 验证手机号
isPhone('13812345678') // true

// 创建验证器
const phoneValidator = validators.phone('请输入正确的手机号')
```

#### 格式化

```ts
import { formatMoney, formatPhone, formatDate } from '@/utils/format'

formatMoney(123456.789) // "123,456.79"
formatPhone('13812345678') // "138****5678"
formatDate(new Date(), 'YYYY-MM-DD') // "2024-01-01"
```

## 样式工具类

项目提供了丰富的 CSS 工具类：

```html
<!-- 布局 -->
<div class="flex-center">居中</div>
<div class="flex-between">两端对齐</div>

<!-- 文本 -->
<div class="text-center">文本居中</div>
<div class="text-ellipsis">文本省略</div>

<!-- 边距 -->
<div class="m-10">外边距 10px</div>
<div class="p-20">内边距 20px</div>

<!-- 字体 -->
<div class="fs-16">字体 16px</div>
<div class="fw-bold">加粗</div>

<!-- 颜色 -->
<div class="text-primary">主题色文字</div>
<div class="bg-primary">主题色背景</div>
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- iOS >= 12
- Android >= 6

## License

MIT
