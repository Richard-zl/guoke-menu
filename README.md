# 三角洲行动陪玩俱乐部网页

一个移动端优先的Vue 3网页应用，展示三角洲行动陪玩俱乐部的菜单和商品详情。

## 功能特性

- 📱 移动端优先设计，完美适配各种移动设备
- 🎨 简洁美观的UI界面
- 📋 商品分类浏览和筛选
- 🔍 商品详情页面展示
- 💾 静态JSON数据，无需后端服务器
- ⚡ 基于Vite构建，快速开发体验

## 技术栈

- Vue 3 (Composition API)
- Vue Router
- Vite
- CSS3 (移动端响应式设计)

## 项目结构

```
Delta_Menus/
├── index.html              # 入口HTML文件
├── package.json           # 项目依赖配置
├── vite.config.js         # Vite构建配置
├── public/                # 静态资源目录
│   └── images/           # 商品图片
├── src/
│   ├── main.js           # Vue应用入口
│   ├── App.vue           # 根组件
│   ├── router/           # 路由配置
│   ├── views/            # 页面组件
│   ├── components/       # 通用组件
│   ├── data/             # 静态数据
│   └── styles/           # 全局样式
└── README.md             # 项目说明
```

## 开发环境要求

- Node.js >= 16.0
- npm >= 7.0 或 yarn >= 1.22

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

访问 http://localhost:3000

## 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录中。

## 预览生产版本

```bash
npm run preview
```

## 部署说明

### 部署到腾讯云静态网站托管

1. **构建项目**
   ```bash
   npm run build
   ```

2. **登录腾讯云控制台**
   - 访问 https://console.cloud.tencent.com/
   - 进入"对象存储 COS"服务

3. **创建存储桶**
   - 创建新的存储桶（Bucket）
   - 选择合适的地域和访问权限

4. **开启静态网站托管**
   - 在存储桶设置中开启"静态网站托管"功能
   - 配置索引文档为 `index.html`

5. **上传文件**
   - 将 `dist/` 目录下的所有文件上传到存储桶根目录
   - 可以通过控制台上传或使用COS CLI工具
   - **建议顺序**：先上传 `dist/assets/` 下带 hash 的 JS/CSS，再上传根目录的 `index.html`，避免用户在新 HTML 下请求到尚未上传的旧资源。

6. **配置自定义域名**
   - 在COS控制台配置自定义域名
   - 添加CNAME记录到域名DNS解析
   - 开启HTTPS（腾讯云提供免费SSL证书）

7. **配置CDN加速（推荐）**
   - 开通腾讯云CDN服务
   - 添加加速域名
   - 配置源站为COS存储桶
   - 更新DNS解析指向CDN地址

### 微信里还是旧界面？（无全站 CDN 时的缓存）

Vite 构建后 **`assets/` 下的 JS、CSS 文件名带内容 hash**，换版即换 URL，可长期缓存。问题多半出在 **`index.html` 被微信或中间层强缓存**，仍指向上一版的入口脚本。

1. **服务端（必做，比 meta 更可靠）**  
   在 COS 控制台对 **`index.html`** 设置对象元数据（或上传时带上 HTTP 头）：  
   `Cache-Control: no-cache` 或 `max-age=0, must-revalidate`  
   对 **`assets/*`** 可设为 `Cache-Control: public, max-age=31536000, immutable`（文件名已带 hash，安全）。  
   若前面还有 **Nginx / 边缘函数**，同样对 `location = /index.html`（或你的子路径入口）单独 `add_header Cache-Control "no-cache"`。

2. **项目内（已做）**  
   `index.html` 已加 `Cache-Control` / `Pragma` / `Expires` 的 meta，对部分 WebView 有辅助作用，**不能替代** COS/网关上的 `Cache-Control` 响应头。

3. **发版与分享链接**  
   - 对外投放的链接可在末尾加版本参数，例如 `https://你的域名/?v=20260424`（每次大改版改一次），微信常把不同 query 视为不同资源。  
   - 用户侧可尝试：微信 **我 → 设置 → 通用 → 存储空间** 清理缓存，或复制链接到系统浏览器打开对比。

## 域名申请

### 推荐域名注册商

1. **腾讯云域名注册**
   - 访问: https://dnspod.cloud.tencent.com/
   - 注册腾讯云账号
   - 搜索并购买域名

2. **阿里云域名注册**
   - 访问: https://wanwang.aliyun.com/
   - 注册阿里云账号
   - 搜索并购买域名

### 域名备案

如果使用.cn域名或国内服务器，需要进行ICP备案。备案流程通常需要7-20个工作日。

## 数据管理

所有商品数据存储在 `src/data/menu.js` 文件中。修改此文件即可更新商品信息。

数据结构包括：
- 分类列表 (categories)
- 商家信息 (merchant)
- 商品列表 (products)

## 浏览器支持

- iOS Safari 12+
- Android Chrome 80+
- 微信内置浏览器
- 其他现代移动浏览器

## 许可证

MIT License
