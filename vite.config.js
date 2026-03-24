import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 静态站点子目录部署用 './'；若整站挂在域名根且由 Nginx 配绝对路径，可改为 '/'
  // 图片 URL 在 src/data/menu.js 中通过 import.meta.env.BASE_URL 拼接，勿写死 '/images/...'
  base: './',
  server: {
    port: 3000,
    open: true
  }
})
