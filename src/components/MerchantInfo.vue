<template>
  <div class="merchant-info">
    <img :src="merchant.avatar" :alt="merchant.name" class="merchant-avatar" />
    <div class="merchant-details">
      <h3 class="merchant-name">{{ merchant.name }}</h3>
      <p class="merchant-followers">{{ formatFollowers(merchant.followers) }}粉丝</p>
    </div>
    <button class="follow-btn" @click="toggleFollow">
      {{ isFollowing ? '已关注' : '+关注' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  merchant: {
    type: Object,
    required: true
  }
})

const isFollowing = ref(false)

const formatFollowers = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toLocaleString('zh-CN')
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
}
</script>

<style scoped>
.merchant-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.merchant-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: #f0f0f0;
}

.merchant-details {
  flex: 1;
}

.merchant-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.merchant-followers {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.follow-btn {
  padding: 8px 20px;
  background-color: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  min-height: 36px;
}

.follow-btn:active {
  background-color: #c53030;
  transform: scale(0.95);
}

.follow-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
