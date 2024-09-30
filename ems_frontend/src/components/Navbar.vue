<template>
  <!-- Top Menubar -->
   <div class="navbar">
      <Menubar :model="items">   <!-- :model is a Vue binding to pass data dynamically-->
        
        <template #start>
          <Button icon="pi pi-bars" class="hamburger-menu" @click="toggleSidebar"/>   
          <img src="@/assets/expense1.png" alt="Logo" class="logo"/>
        </template>
        
        <template #end>
          <span class="p-input-icon-left nav-search">
            <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
          </span>
          <img src="@/assets/expense1.png" alt="Profile" class="profile-icon"/>
        </template>

      </Menubar>
      <Dialog header="Theme Switcher" v-model:visible="displayThemeSwitcher" :modal="true">
            <ThemeSwitcher />
      </Dialog>
   </div>
  

  <!-- Sidebar Menubar -->
   <div class="sidebar" v-if="sidebarVisible">
    <PanelMenu :model="itemsSidebar" class="sidebar-menubar" />
   </div>

</template>

<script setup>
import { ref } from 'vue';   //Creates reactive variable
import { useRouter } from 'vue-router';    //for navigation
import ThemeSwitcher from './ThemeSwitcher.vue';

const router = useRouter(); //Initialize router

const searchQuery = ref('');   // Declares a reactive searchQuery variable with an initial value of an empty string.

const displayThemeSwitcher = ref(false);

// Menu Items for Top Navbar
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => { router.push({ name: 'home' }) } //Navigate to home
  },
  {
    label: 'Transactions',
    icon: 'pi pi-money-bill',
    command: () => { router.push({ name: 'transactionList' }) } //Navigate to home
  },
  {
    label: 'Budgets',
    icon: 'pi pi-wallet',
    command: () => { router.push({ name: 'budgetList'}) }
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-line',
    items: [
      { label: 'Monthly Reports', icon: 'pi pi-calendar' },
      { label: 'Yearly Reports', icon: 'pi pi-calendar-plus' }
    ]
  },
  {
        label: 'Theme',
        icon: 'pi pi-cog',
        command: () => displayThemeSwitcher.value = true
    }
]);

//Menu Items for Sidebar Menubar
const itemsSidebar = ref([
{ 
  label: 'Dashboard',
  icon: 'pi pi-home',
  command: () => { router.push({ name: 'home' }) } 
},
{ label: 'Manage Transactions', 
  icon: 'pi pi-money-bill', 
  items: [
      { label: 'Add Transaction', icon: 'pi pi-plus' },
      { label: 'View Transactions', icon: 'pi pi-eye' }
    ]
},
{ label: 'Budget Management', 
  icon: 'pi pi-wallet', 
  items: [
      { label: 'Add Budget', icon: 'pi pi-plus' },
      { label: 'View Budgets', icon: 'pi pi-eye' }
  ]
},
{
  label: 'Reports',
  icon: 'pi pi-char-line',
    items: [
        { label: 'Monthly Reports', icon: 'pi pi-calender' },
        { label: 'Yearly Reports', icon: 'pi pi-calender-plus' }
    ]
},
{
  label: 'Help & Support',
  icon: 'pi pi-question-circle',
    items: [
        { label: 'FAQ', icon: 'pi pi-question' },
        { label: 'Contact Support', icon: 'pi pi-envelope' }
    ]
},
{ 
  label: 'Settings', 
  icon: 'pi pi-cog' 
},
{ 
  label: 'Logout', 
  icon: 'pi pi-sign-out' 
}
]);


//Props to accept sidebar state and toggle function, props controlled by parent component(App.vue)
const props = defineProps ({
sidebarVisible: Boolean,
toggleSidebar: Function,
});


</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
}

.logo {
  width: 40px;
  margin-right: 1rem;
}

.hamburger-menu{
  margin-right: 1rem;
}

.profile-icon {
  width: 40px;
  border-radius: 50%;
  margin-left: 1rem;
}

.sidebar{
  position: fixed;
  top: 68px;
  left: 0px;
  width: 250px;
  height: 100%;
  z-index: 1000;
  box-shadow: var(--sidebar-box-shadow);
}

</style>

