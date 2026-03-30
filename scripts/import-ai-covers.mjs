#!/usr/bin/env node
/**
 * 将 AI 导出的 PNG 批量转为 public/images/covers/<id>.webp（800×800，cwebp）。
 *
 * 约定：源目录内文件名为 _ai_<商品id>.png（与 menu.js 里 id 一致），例如 _ai_exp-zero-dam.png
 *
 * 用法：
 *   node scripts/import-ai-covers.mjs /path/to/folder/with/_ai_*.png
 *
 * 风格参考：用 fun-prison-clear-map 转 PNG 作 reference（与本仓库 generate-menu-covers 顶部说明一致）。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEST = path.join(__dirname, '..', 'public', 'images', 'covers')
const srcDir = process.argv[2]

if (!srcDir) {
  console.error('用法: node scripts/import-ai-covers.mjs <含 _ai_<id>.png 的目录>')
  process.exit(1)
}

const resolved = path.resolve(srcDir)
if (!existsSync(resolved)) {
  console.error('目录不存在:', resolved)
  process.exit(1)
}

const re = /^_ai_(.+)\.png$/i
let n = 0
for (const name of readdirSync(resolved)) {
  const m = name.match(re)
  if (!m) continue
  const id = m[1]
  const src = path.join(resolved, name)
  const tmp = path.join(DEST, `${id}.tmp.png`)
  const outWebp = path.join(DEST, `${id}.webp`)

  const mag = spawnSync(
    'magick',
    [src, '-resize', '800x800^', '-gravity', 'center', '-extent', '800x800', tmp],
    { encoding: 'utf8' }
  )
  if (mag.status !== 0) {
    console.error('magick failed', id, mag.stderr)
    continue
  }
  const cw = spawnSync('cwebp', ['-q', '82', '-m', '6', '-metadata', 'none', tmp, '-o', outWebp], {
    stdio: 'inherit'
  })
  unlinkSync(tmp)
  if (cw.status !== 0) {
    console.error('cwebp failed', id)
    continue
  }
  console.log('ok', id)
  n++
}
console.log('完成，共', n, '张')
