import { createRouter, createWebHistory } from 'vue-router'
import TransactionList from '@/views/TransactionList.vue'
import TransactionFormWithVeeValidate from '@/views/TransactionFormWithVeeValidate.vue'
import Navbar from '@/components/Navbar.vue'
import Home from '@/components/Home.vue'
import Transaction from '@/components/Transaction.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/transactionList',
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
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction
    }
  ]
})

export default router
