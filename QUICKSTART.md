# 快速开始指南

## 第一步：安装依赖

```bash
npm install
```

如果安装失败，可以尝试使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

## 第二步：准备图片资源

将商品图片和商家头像放置到 `public/images/` 目录：

- `merchant-avatar.png` - 商家头像
- `product-1.jpg` - 商品1主图
- `product-1-hero.jpg` - 商品1详情页Hero图
- 其他商品图片...

如果没有图片，可以先使用占位图或临时图片进行测试。

## 第三步：启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 第四步：修改数据

编辑 `src/data/menu.json` 文件，修改商品信息、分类、商家信息等。

## 第五步：构建生产版本

```bash
npm run build
```

构建完成后，`dist/` 目录包含所有生产文件。

## 第六步：部署

参考 `DEPLOY.md` 文件中的详细部署步骤，将 `dist/` 目录中的文件上传到腾讯云COS。

## 常见问题

### 1. npm install 失败

- 检查网络连接
- 尝试使用国内镜像：`npm config set registry https://registry.npmmirror.com`
- 清除缓存：`npm cache clean --force`

### 2. 图片无法显示

- 检查图片路径是否正确
- 确保图片文件存在于 `public/images/` 目录
- 检查 `menu.json` 中的图片路径是否正确

### 3. 路由跳转问题

- 项目使用hash路由模式（URL中包含#），这是正常的
- 如需使用history模式，需要配置服务器重定向规则

### 4. 样式显示异常

- 清除浏览器缓存
- 检查浏览器控制台是否有错误
- 确保所有CSS文件正确加载

## 下一步

- 查看 `README.md` 了解项目详细说明
- 查看 `DEPLOY.md` 了解部署步骤
- 根据需要修改样式和功能


## 部署与集成

# 进入项目目录
- ssh root@49.232.29.2
- cd /home/guoke-menu

# 执行部署脚本
- bash deploy.sh