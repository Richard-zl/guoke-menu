<template>
  <div v-if="product" class="detail-view">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">订单详情</h1>
      <div class="header-placeholder"></div>
    </header>

    <div class="hero-section">
      <div class="hero-subtitle">{{ product.heroSubtitle }}</div>
      <h2 class="hero-title">{{ product.heroTitle }}</h2>
      <div class="hero-image-wrapper">
        <img :src="product.heroImage" :alt="product.heroTitle" class="hero-image" />
      </div>
    </div>

    <div class="price-section">
      <div class="price-row">
        <div class="current-price">{{ displayPrice }}</div>
        <div class="views-count">浏览 {{ formatNumber(product.views) }}</div>
      </div>
      <div v-if="displayGuarantee" class="guarantee-row">保底：{{ displayGuarantee }}</div>
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-subtitle">{{ product.subtitle }}</p>
      <div v-if="product.tags?.length" class="tag-list">
        <span v-for="tag in product.tags" :key="tag" class="tag-item">{{ tag }}</span>
      </div>
    </div>

    <div class="merchant-section">
      <MerchantInfo :merchant="merchant" />
    </div>

    <div class="details-section">
      <div class="details-header" @click="toggleDetails">
        <span class="details-title">规则详情</span>
        <svg
          :class="['details-icon', { expanded: detailsExpanded }]"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div v-if="detailsExpanded" class="details-content">
        <h3 class="service-type">{{ product.series }}</h3>

        <!-- 特色体验单：结构化摘要 -->
        <div v-if="product.experienceMeta" class="meta-card">
          <div class="meta-row">
            <span class="meta-label">类型</span>
            <span class="meta-value">{{ product.experienceMeta.label }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">价格</span>
            <span class="meta-value">{{ product.experienceMeta.priceR }}r</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">累计目标</span>
            <span class="meta-value">双护累计 {{ product.experienceMeta.guaranteeWan }} 万</span>
          </div>
        </div>

        <!-- 护航单：档位表 -->
        <div v-if="showEscortTable" class="price-table-wrap">
          <h4 class="table-title">档位一览</h4>
          <table class="price-table">
            <thead>
              <tr>
                <th>价格</th>
                <th>保底（万）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in product.escortMeta.tiers" :key="idx">
                <td>{{ row.priceR }}r</td>
                <td>{{ row.guaranteeWan }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="product.escortMeta.maps?.length" class="map-note">
            适用地图：{{ product.escortMeta.maps.join('、') }}
          </p>
        </div>

        <!-- 陪玩单：时薪表 -->
        <div v-if="showPlaymateTable" class="price-table-wrap">
          <h4 class="table-title">时薪价目</h4>
          <table class="price-table">
            <thead>
              <tr>
                <th>级别</th>
                <th>价格</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in product.playmateTiers" :key="idx">
                <td>{{ row.level }}</td>
                <td>{{ row.pricePerHour }}{{ row.unit }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="product.playmateMeta?.mapLabel" class="map-note">
            {{ product.orderType === 'playmate_female' ? '类型' : '地图' }}：{{ product.playmateMeta.mapLabel }}
          </p>
        </div>

        <div class="details-text">{{ product.details }}</div>

        <div v-if="Array.isArray(product.ruleItems) && product.ruleItems.length > 0" class="rules-block">
          <h4 class="services-title">规则条目</h4>
          <div v-for="(item, index) in product.ruleItems" :key="index" class="rule-item">
            <div class="rule-item-title">{{ item.title }}</div>
            <div class="rule-item-content">{{ item.content }}</div>
          </div>
        </div>

        <div v-if="product.notes" class="additional-services">
          <h4 class="services-title">补充说明</h4>
          <div class="details-text">{{ product.notes }}</div>
        </div>

        <!-- 体验单 / 护航单：点单说明（共用文案，置于规则详情最下方） -->
        <div v-if="showOrderingNotice" class="ordering-notice-block">
          <h4 class="ordering-notice-heading">点单说明</h4>
          <div class="details-text ordering-notice-text">{{ displayOrderingNotice }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MerchantInfo from '../components/MerchantInfo.vue'
import menuData from '../data/menu.js'

const router = useRouter()
const route = useRoute()
const detailsExpanded = ref(true)
const product = ref(null)
const merchant = ref(menuData.merchant)
/** 与 menu.js 中 orderingNotice 同步；单条订单可设 orderingNoticeOverride 覆盖 */
const orderingNoticeText = menuData.orderingNotice ?? ''

/** 点单说明正文：优先使用订单上的 orderingNoticeOverride（如零号大坝机密体验单） */
const displayOrderingNotice = computed(() => {
  const p = product.value
  if (!p) return ''
  if (p.orderingNoticeOverride) return p.orderingNoticeOverride
  return orderingNoticeText
})

const displayPrice = computed(() => {
  if (!product.value) return ''
  if (product.value.pricing?.rawText) return product.value.pricing.rawText
  if (typeof product.value.currentPrice === 'number') return `¥${product.value.currentPrice.toFixed(2)}`
  return '以规则说明为准'
})

const displayGuarantee = computed(() => {
  if (!product.value?.pricing) return ''
  const { guaranteeValue, guaranteeUnit } = product.value.pricing
  return guaranteeValue != null && guaranteeUnit ? `${guaranteeValue}${guaranteeUnit}` : ''
})

/** 护航单：正式 / 监狱 展示档位表 */
const showEscortTable = computed(() => {
  const p = product.value
  if (!p?.escortMeta?.tiers?.length) return false
  return p.orderType === 'escort_formal' || p.orderType === 'escort_prison'
})

/** 陪玩单：地图价目 / 女陪 */
const showPlaymateTable = computed(() => {
  const p = product.value
  if (!p?.playmateTiers?.length) return false
  return p.orderType === 'playmate_map' || p.orderType === 'playmate_female'
})

/** 特色体验单、护航单详情底部展示点单说明（可有单条 override） */
const showOrderingNotice = computed(() => {
  const p = product.value
  if (!p) return false
  if (p.categoryId !== 'experience' && p.categoryId !== 'escort') return false
  return !!(p.orderingNoticeOverride || orderingNoticeText)
})

const formatNumber = (num) => {
  if (typeof num !== 'number') return '0'
  return num.toLocaleString('zh-CN')
}

const goBack = () => router.back()

const toggleDetails = () => {
  detailsExpanded.value = !detailsExpanded.value
}

onMounted(() => {
  const productId = route.params.id
  const foundProduct = menuData.products.find((item) => item.id === productId)
  if (foundProduct) {
    product.value = foundProduct
    return
  }
  router.push('/')
})
</script>

<style scoped>
.detail-view {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  transition: background-color 0.2s, transform 0.1s;
  border-radius: 50%;
}

.back-btn:active {
  background-color: #f0f0f0;
  transform: scale(0.9);
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-placeholder {
  width: 32px;
}

.hero-section {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #fff;
  padding: 20px 16px;
}

.hero-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.hero-image-wrapper {
  width: 100%;
}

.hero-image {
  width: 100%;
  border-radius: 10px;
}

.price-section {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.current-price {
  font-size: 22px;
  font-weight: 700;
  color: #e53e3e;
}

.views-count {
  font-size: 13px;
  color: #999;
}

.guarantee-row {
  margin-bottom: 12px;
  font-size: 14px;
  color: #5f6368;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.product-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.tag-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  font-size: 11px;
  color: #4b5563;
  background-color: #f1f5f9;
  border-radius: 999px;
  padding: 3px 9px;
}

.merchant-section {
  padding: 0 16px;
  margin-bottom: 12px;
}

.details-section {
  background-color: #fff;
  margin: 0 16px;
  border-radius: 10px;
  overflow: hidden;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 2px solid #e53e3e;
  transition: background-color 0.2s;
  min-height: 44px;
}

.details-header:active {
  background-color: #f9f9f9;
}

.details-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.details-icon {
  transition: transform 0.3s;
  color: #666;
}

.details-icon.expanded {
  transform: rotate(180deg);
}

.details-content {
  padding: 16px;
}

.service-type {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.details-text {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 16px;
}

.rules-block {
  margin-top: 14px;
}

.rule-item {
  margin-top: 10px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 10px;
}

.rule-item-title {
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.rule-item-content {
  font-size: 13px;
  color: #5f6368;
  line-height: 1.6;
}

.additional-services {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.services-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.meta-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px solid #edf2f7;
}

.meta-row:last-child {
  border-bottom: none;
}

.meta-label {
  color: #64748b;
  flex-shrink: 0;
}

.meta-value {
  color: #1e293b;
  text-align: right;
  font-weight: 500;
}

.price-table-wrap {
  margin-bottom: 16px;
}

.table-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.price-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.price-table th,
.price-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.price-table th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
}

.price-table tr:last-child td {
  border-bottom: none;
}

.map-note {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #64748b;
}

.ordering-notice-block {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e53e3e;
}

.ordering-notice-heading {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 700;
  color: #c53030;
}

.ordering-notice-text {
  margin-bottom: 0;
  font-size: 13px;
  color: #4a5568;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 16px;
  color: #999;
}
</style>
