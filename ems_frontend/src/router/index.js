import { createRouter, createWebHistory } from 'vue-router'
import TransactionList from '@/views/TransactionList.vue'
import TransactionFormWithVeeValidate from '@/views/TransactionFormWithVeeValidate.vue'
import Navbar from '@/components/Navbar.vue'
import Home from '@/components/Home.vue'
import TestForm from '@/components/CustomValidation_TestForm.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import BudgetList from '@/components/BudgetList.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name:'/home',
      component: Home,
    },
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
      path: '/testForm',
      name: 'testForm',
      component: TestForm
    },
    {
      path: '/budgetForm',
      name: 'budgetForm',
      component: BudgetForm
    },
    {
      path: '/budgetList',
      name: 'budgetList',
      component: BudgetList
    }
  ]
})

export default router
