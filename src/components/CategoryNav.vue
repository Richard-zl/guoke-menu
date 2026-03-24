<template>
  <div class="category-nav">
    <div
      v-for="category in categories"
      :key="category.id"
      :class="['category-item', { active: selectedCategory === category.id }]"
      @click="selectCategory(category.id)"
    >
      {{ category.name }}
      <div v-if="selectedCategory === category.id" class="indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:selectedCategory'])

const selectCategory = (categoryId) => {
  emit('update:selectedCategory', categoryId)
}
</script>

<style scoped>
.category-nav {
  width: 92px;
  background-color: #f5f5f5;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: 1px solid #ececec;
}

.category-item {
  position: relative;
  padding: 14px 8px 14px 10px;
  text-align: center;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
}

.category-item:active {
  background-color: #e0e0e0;
  transform: scale(0.98);
}

.category-item.active {
  color: #e53e3e;
  font-weight: 500;
  background-color: #fff;
}

/* 选中指示：贴左侧竖条，垂直居中（常见侧边栏样式） */
.indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background-color: #e53e3e;
  border-radius: 0 2px 2px 0;
}
</style>
