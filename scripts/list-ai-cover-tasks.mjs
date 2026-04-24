#!/usr/bin/env node
/**
 * 列出 menu.js 中引用的所有 images/covers/<id>.webp，便于在 Midjourney / 即梦 等工具中
 * 按约定文件名导出 PNG，再执行：npm run import:ai-covers -- <目录>
 *
 * 说明：generate-menu-covers.mjs 生成的是「渐变+文字」占位，不是卡通插画；
 * 卡通/二次元封面必须走本清单 → 外部 AI 出图 → import-ai-covers.mjs。
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const menuPath = path.join(ROOT, 'src', 'data', 'menu.js')
const coversDir = path.join(ROOT, 'public', 'images', 'covers')

/** 小于该字节的 webp 多为 ImageMagick 渐变占位（AI 方图通常远大于此） */
const PLACEHOLDER_SIZE_HINT = 16 * 1024

const text = readFileSync(menuPath, 'utf8')
const re = /images\/covers\/([a-z0-9-]+)\.webp/gi
const ids = new Set()
let m
while ((m = re.exec(text))) ids.add(m[1])

const sorted = [...ids].sort()
console.log('以下文件请在外部 AI 工具中出图（800×800，二次元战术 Q 版风，见 generate-menu-covers.mjs 头注释），')
console.log('导出为 PNG 并命名为 _ai_<id>.png 放入同一目录，然后执行：')
console.log('  npm run import:ai-covers -- /path/to/that/folder\n')

for (const id of sorted) {
  const webp = path.join(coversDir, `${id}.webp`)
  let hint = ''
  if (existsSync(webp)) {
    try {
      if (statSync(webp).size < PLACEHOLDER_SIZE_HINT) {
        hint = '  ← 当前 webp 体积较小，疑为渐变文字占位，建议替换为 AI 插画'
      }
    } catch {
      /* ignore */
    }
  } else {
    hint = '  ← 缺少 webp'
  }
  console.log(`  _ai_${id}.png${hint}`)
}

console.log(`\n共 ${sorted.length} 个封面 id。`)
