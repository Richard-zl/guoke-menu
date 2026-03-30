/**
 * 将 products 内 image/heroImage 从 images/rules/* 改为 images/covers/<id>.webp
 * 跳过：fun-bingo-bigred-lianliankan（棋盘 PNG）、task-zone-special-dept-price（价目 PNG）
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const menuPath = path.join(__dirname, '../src/data/menu.js')

const skip = new Set(['fun-bingo-bigred-lianliankan', 'task-zone-special-dept-price'])

const lines = fs.readFileSync(menuPath, 'utf8').split('\n')
let inProducts = false
let currentId = null

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (line.includes('products: [')) inProducts = true
  if (!inProducts) continue

  const mid = line.match(/^\s+id:\s*'([^']+)',/)
  if (mid) currentId = mid[1]

  if (currentId && !skip.has(currentId)) {
    if (line.includes("image: asset('images/rules/")) {
      lines[i] = line.replace(
        /image: asset\('images\/rules\/[^']+'\),/,
        `image: asset(\`images/covers/${currentId}.webp\`),`
      )
    }
    if (line.includes("heroImage: asset('images/rules/")) {
      lines[i] = line.replace(
        /heroImage: asset\('images\/rules\/[^']+'\),/,
        `heroImage: asset(\`images/covers/${currentId}.webp\`),`
      )
    }
  }
}

fs.writeFileSync(menuPath, lines.join('\n'))
console.log('menu.js: wired images/covers/<id>.webp (except bingo + task PNG)')
