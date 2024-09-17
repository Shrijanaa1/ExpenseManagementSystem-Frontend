import { createRouter, createWebHistory } from 'vue-router'
import TransactionList from '@/views/TransactionList.vue'
import TransactionFormWithVeeValidate from '@/views/TransactionFormWithVeeValidate.vue'
import Navbar from '@/components/Navbar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'transactionList',
      component: TransactionList
    },
    {
      path: '/transactionFormWithVeeValidate',
      name: 'transactionFormWithVeeValidate',
      component: TransactionFormWithVeeValidate
    },
    {
      path: '/menubar',
      name: 'menubar',
      component: Navbar
    }
  ]
})

export default router
