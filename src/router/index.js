import { createRouter, createWebHashHistory } from 'vue-router'
import MenuView from '../views/MenuView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailView,
      props: true
    }
  ]
})

export default router
