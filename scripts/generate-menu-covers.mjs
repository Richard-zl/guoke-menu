#!/usr/bin/env node
/**
 * 【推荐】正式封面：二次元战术插画风（色板与笔触可对齐监狱清图单，但不要求同一人物姿势）。
 * AI 出图后执行：node scripts/import-ai-covers.mjs <含 _ai_<id>.png 的目录>
 *
 * 勿把 fun-prison-clear-map 整图作全局 reference：图中「禁声」手势易被模型复制到所有封面。
 * 非监狱类订单应在 prompt 里按玩法写动作/场景，并避免沿用监狱图作图生图参考（见 import-ai-covers 注释）。
 *
 * 下方 ImageMagick 渐变仅作应急占位；部分环境渐变合成异常会出现「白底黑字」，勿作正式素材。
 *
 * 需本机已安装 ImageMagick(magick) 与 cwebp。
 *
 * ---------------------------------------------------------------------------
 * 全站封面风格说明（AI prompt 对齐）
 * ---------------------------------------------------------------------------
 * - 版式：800×800，上半画面、底部约 120px 标题安全区。
 * - 气质：二次元 / Q 版战术、撤离射击，暗色底，点缀 #e53e3e。
 * - 标题：白字深色描边；避免写实枪械特写。
 * - 输出：WebP q≈82；Bingo、任务价目表仍用 images/rules 下 PNG。
 *
 * 当前 public/images/covers/*.webp（订单封面）为 AI 按玩法定制的方图；请勿执行 generate:covers:force
 * 以免用渐变占位覆盖。
 *
 * 与前端比例（避免误以为会被裁字）
 * ---------------------------------------------------------------------------
 * - 列表 ProductCard：图片区为 1:1（宽 = 高），object-fit: cover。源图为正方形 800×800 时
 *   与容器比例一致，整图可见，不会因「比例不符」裁掉上下或左右。
 * - 详情 hero：图片 width:100%，高度随图片固有比例；正方形封面整图展示，非 cover 裁切。
 * - 若将来改用非正方形素材，列表会按 cover 居中裁切，重要文字请留在「中心安全区」或改 CSS。
 * ---------------------------------------------------------------------------
 */
import { spawnSync } from 'node:child_process'
import { existsSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..', 'public', 'images', 'covers')
const FONT = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'

const force = process.argv.includes('--force')

/** [id, 渐变起, 渐变止, 主标题, 副标题] — fun-prison-clear-map 由单独插画维护，不在此表 */
const COVERS = [
  ['exp-zero-dam', '#1a2744', '#2d5a8c', '特色体验单', '零号大坝 · 机密'],
  ['exp-top-no-prison', '#1a2744', '#2d5a8c', '特色体验单', '绝密 · 监狱除外'],
  ['exp-prison-trial', '#1a2744', '#3d4a6c', '特色体验单', '监狱体验'],
  ['escort-formal', '#1a2e1a', '#2d5c2d', '正式护航', '绝密巴克什 / 航天'],
  ['escort-prison', '#1a2e1a', '#2d4a2d', '监狱护航', '绝密监狱'],
  ['playmate-jimi-daba', '#2d1a4a', '#5a3d7a', '陪玩单', '机密大坝'],
  ['playmate-jimi-bakeshi', '#2d1a4a', '#5a3d7a', '陪玩单', '机密巴克什'],
  ['playmate-jimi-hangtian', '#2d1a4a', '#5a3d7a', '陪玩单', '机密航天'],
  ['playmate-juemi-bakeshi', '#3a1a4a', '#6a3d8a', '陪玩单', '绝密巴克什'],
  ['playmate-juemi-hangtian', '#3a1a4a', '#6a3d8a', '陪玩单', '绝密航天'],
  ['playmate-juemi-jianyu', '#3a1a4a', '#5a2d6a', '陪玩单', '绝密监狱'],
  ['playmate-female', '#4a1a4a', '#7a3d7a', '陪玩单', '女陪 · 娱乐类'],
  ['fun-escort-day-1888', '#4a1a3a', '#8a3d5a', '趣味单', '护航的一天'],
  ['fun-ai-gun-288', '#3a2040', '#6a4080', '趣味单', 'AI 改枪单'],
  ['fun-demon-streak', '#301a1a', '#6a2020', '趣味单', '魔王连连撤'],
  ['fun-sand-safe-588', '#4a3a1a', '#7a6020', '趣味单', '沙色保险箱'],
  ['fun-sand-match', '#4a3a1a', '#7a5528', '趣味单', '沙保连连看'],
  ['fun-home-temptation-1288', '#4a2a3a', '#7a4060', '趣味单', '回家的诱惑'],
  ['fun-space-order-688', '#1a2a4a', '#2d5080', '趣味单', '航天乌鲁鲁'],
  ['fun-dam-king-228', '#1a3a2a', '#2d6a40', '趣味单', '大坝连撤王'],
  ['fun-twelve-gold-228', '#4a4010', '#7a7020', '趣味单', '十二金宵'],
  ['fun-full-load-888', '#3a2040', '#6a3555', '趣味单', '满载而归'],
  ['fun-infinite-refill-568', '#2a1a4a', '#503080', '趣味单', '无限续杯'],
  ['fun-cattle-horse-288', '#3a3018', '#6a5028', '趣味单', '牛马单'],
  ['fun-quality-298', '#1a2a3a', '#2d4a60', '趣味单', '素质单'],
  ['fun-heaven-havoc-398', '#4a3018', '#7a5028', '趣味单', '大闹天宫'],
  ['fun-love-diary', '#5a2040', '#8a4070', '趣味单', '恋爱日记'],
  ['fun-operator-match', '#2a2048', '#5040a0', '趣味单', '干员消消乐'],
  ['fun-bridge-block', '#1a3048', '#2d5088', '趣味单', '堵桥单'],
  ['bigred-catalog', '#4a1018', '#7a1828', '大红对赌', '多档位价目'],
  ['bigred-special-ocean-tear', '#3a1028', '#6a2058', '大红对赌', '特别单 · 海洋之泪'],
  ['knife-run-9grid', '#0f2a32', '#1a4a58', '跑刀专区', '九格保险'],
  ['knife-run-6grid', '#0f2a32', '#1a4550', '跑刀专区', '六格保险'],
  ['knife-run-4grid', '#0f2a32', '#1a4048', '跑刀专区', '四格保险'],
  // AI 维护、勿用本脚本覆盖：fun-prison-clear-map、insurance-3x3-s9-*
]

function runMagick(outPng, c1, c2, line1, line2) {
  const r = spawnSync(
    'magick',
    [
      '(',
      '-size',
      '800x800',
      `gradient:${c1}-${c2}`,
      ')',
      '(',
      '-size',
      '400x400',
      'plasma:fractal',
      '-resize',
      '800x800',
      '-blur',
      '0x50',
      '-modulate',
      '100,45',
      ')',
      '-compose',
      'Overlay',
      '-composite',
      '-vignette',
      '0x20',
      '-font',
      FONT,
      '-pointsize',
      '48',
      '-fill',
      'white',
      '-stroke',
      '#000000',
      '-strokewidth',
      '2',
      '-gravity',
      'center',
      '-annotate',
      '+0-88',
      line1,
      '-pointsize',
      '26',
      '-fill',
      '#f0f0f0',
      '-stroke',
      '#000000',
      '-strokewidth',
      '1',
      '-annotate',
      '+0+42',
      line2,
      '-fill',
      'none',
      '-stroke',
      '#e53e3e',
      '-strokewidth',
      '4',
      '-draw',
      'roundrectangle 48,712 752,718 2,2',
      outPng
    ],
    { encoding: 'utf8' }
  )
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout)
    throw new Error('magick failed')
  }
}

function main() {
  for (const row of COVERS) {
    const [id, c1, c2, line1, line2] = row
    const outWebp = path.join(ROOT, `${id}.webp`)
    const outPng = path.join(ROOT, `${id}.tmp.png`)
    if (existsSync(outWebp) && !force) {
      console.log('skip exists:', id)
      continue
    }
    runMagick(outPng, c1, c2, line1, line2)
    const cw = spawnSync('cwebp', ['-q', '82', '-m', '6', '-metadata', 'none', outPng, '-o', outWebp], {
      encoding: 'utf8',
      stdio: 'inherit'
    })
    if (cw.status !== 0) throw new Error('cwebp failed ' + id)
    unlinkSync(outPng)
    console.log('ok', id)
  }
}

main()
