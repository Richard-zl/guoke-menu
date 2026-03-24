<template>
  <div class="menu-view">
    <header class="header">
      <h1 class="header-title">果壳电竞</h1>
      <p class="header-subtitle">三角洲陪玩俱乐部 · 下单说明</p>
    </header>

    <div class="content-wrapper">
      <CategoryNav
        :categories="categories"
        :selected-category="selectedCategory"
        @update:selected-category="onSelectCategory"
      />

      <div class="product-list-wrapper">
        <div class="list-summary">共 {{ filteredProducts.length }} 条订单说明</div>
        <div class="product-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CategoryNav from '../components/CategoryNav.vue'
import ProductCard from '../components/ProductCard.vue'
import menuData from '../data/menu.js'

/** 左侧分类 Tab 持久化键（与项目名区分，避免与其它站点冲突） */
const SELECTED_CATEGORY_STORAGE_KEY = 'deltaMenusSelectedCategory'

const categories = ref(menuData.categories)
const products = ref(menuData.products)

/** 读取上次选中的分类；无效或缺失时回退为「全部分类」 */
function loadStoredCategory() {
  try {
    const raw = localStorage.getItem(SELECTED_CATEGORY_STORAGE_KEY)
    if (!raw) return 'all'
    const validIds = new Set(categories.value.map((c) => c.id))
    return validIds.has(raw) ? raw : 'all'
  } catch {
    return 'all'
  }
}

const selectedCategory = ref(loadStoredCategory())

function onSelectCategory(categoryId) {
  selectedCategory.value = categoryId
}

// 每次切换写入 localStorage，下次进入菜单页自动恢复
watch(
  selectedCategory,
  (id) => {
    try {
      localStorage.setItem(SELECTED_CATEGORY_STORAGE_KEY, id)
    } catch {
      /* 隐私模式等场景可能不可用，忽略 */
    }
  },
  { flush: 'post' }
)

const filteredProducts = computed(() => {
  const visibleProducts = products.value
    .filter((product) => product.showInList !== false)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

  if (selectedCategory.value === 'all') {
    return visibleProducts
  }
  return visibleProducts.filter(
    (product) => product.categoryId === selectedCategory.value
  )
})
</script>

<style scoped>
.menu-view {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}

.header-title {
  margin: 0 0 2px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-subtitle {
  margin: 0;
  font-size: 12px;
  color: #8b8b8b;
}

.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.product-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background-color: #f5f5f5;
}

.list-summary {
  margin-bottom: 10px;
  font-size: 12px;
  color: #7a7a7a;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
