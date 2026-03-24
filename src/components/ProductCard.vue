<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.title" class="product-image" />
      <div v-if="primaryTag" class="product-badge">{{ primaryTag }}</div>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-meta">
        <span class="product-views">浏览 {{ formatNumber(product.views) }}</span>
        <span class="product-series">{{ product.series }}</span>
      </div>
      <div class="product-price">{{ showPrice }}</div>
      <p class="product-subtitle">{{ product.subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const productTags = computed(() => (Array.isArray(props.product.tags) ? props.product.tags : []))

const primaryTag = computed(() => (productTags.value.length > 0 ? productTags.value[0] : ''))

// 卡片优先展示 rawText，兼容旧字段回退。
const showPrice = computed(() => {
  if (props.product?.pricing?.rawText) {
    return props.product.pricing.rawText
  }
  if (typeof props.product.currentPrice === 'number') {
    return `¥${props.product.currentPrice.toFixed(2)}`
  }
  return '以详情说明为准'
})

const formatNumber = (num) => {
  if (typeof num !== 'number') {
    return '0'
  }
  return num.toLocaleString('zh-CN')
}

const goToDetail = () => {
  router.push(`/detail/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:active {
  transform: scale(0.97);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  left: 8px;
  top: 8px;
  background-color: rgba(229, 62, 62, 0.92);
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.product-info {
  padding: 10px;
}

.product-title {
  font-size: 14px;
  color: #202124;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-views {
  font-size: 12px;
  color: #999;
}

.product-series {
  font-size: 11px;
  color: #666;
  background-color: #f3f4f6;
  padding: 1px 7px;
  border-radius: 10px;
}

.product-price {
  font-size: 16px;
  color: #e53e3e;
  font-weight: 700;
  margin-bottom: 4px;
}

.product-subtitle {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #7d7d7d;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
