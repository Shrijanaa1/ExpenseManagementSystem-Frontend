<template>
      <!-- Top Menubar -->
       <div class="navbar">
          <Menubar :model="items">   <!-- :model is a Vue binding to pass data dynamically-->
            <template #start>

              <Button v-if="!sidebarVisible" icon="pi pi-bars" class="hamburger-menu" @click="toggleSidebar"/>   <!-- hamburger button will only be shown when the sidebar is not visible -->
              <!-- Logo on the left side -->
              <img src="@/assets/expense1.png" alt="Logo" class="logo"/>
            </template>
            <template #end>
              <!-- Search Box -->
              <span class="p-input-icon-left nav-search">
                <InputText v-model="searchQuery" placeholder="Search" />
              </span>
      
              <!-- Theme Toggle Buttons -->
              <Button icon="pi pi-sun" class="theme-icon" @click="setLightTheme"/>
              <Button icon="pi pi-moon" class="theme-icon" @click="setDarkTheme"/>
              
              <!-- Profile Icon -->
              <img src="@/assets/expense1.png" alt="Profile" class="profile-icon"/>
            </template>
          </Menubar>
       </div>
      

      <!-- Sidebar Menubar -->
       <div class="sidebar" v-if="sidebarVisible">
          <Menubar :model="itemsSidebar" class="sidebar-menubar">
            <template #end>
              <!-- Close Button for Sidebar -->
               <Button icon="pi pi-times" class="close-sidebar" @click="toggleSidebar"/>
            </template>
          </Menubar>
       </div>

  </template>
  
  <script setup>
  import { ref } from 'vue';   //Creates reactive variable
  import { useRouter } from 'vue-router';    //for navigation

  const router = useRouter(); //Initialize router
  
  const searchQuery = ref('');   // Declares a reactive searchQuery variable with an initial value of an empty string.
  
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
        command: () => { router.push({ name: 'transaction' }) } //Navigate to home
      },
      {
        label: 'Budgets',
        icon: 'pi pi-wallet',
        items: [
          { label: 'Add Budget', icon: 'pi pi-plus' },
          { label: 'View Budgets', icon: 'pi pi-eye' }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-line',
        items: [
          { label: 'Monthly Reports', icon: 'pi pi-calendar' },
          { label: 'Yearly Reports', icon: 'pi pi-calendar-plus' }
        ]
      },
  ]);
  
  //Menu Items for Sidebar Menubar
  const itemsSidebar = ref([
    { 
      label: 'Dashboard',
      icon: 'pi pi-char-line',
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

  // //Sidebar Visibility State
  // const sidebarVisible = ref(false);

  // //Toggle Sidebar
  // const toggleSidebar = () => {
  //   sidebarVisible.value = !sidebarVisible.value;
  // }

  //Props to accept sidebar state and toggle function, props controlled by parent component(App.vue)
  const props = defineProps ({
    sidebarVisible: Boolean,
    toggleSidebar: Function,
  });

  // Methods to handle theme switching, by changing the data-theme attribute of the document's root element
  const setLightTheme = () => {
      document.documentElement.setAttribute('data-theme', 'light');
  };
  
  const setDarkTheme = () => {
      document.documentElement.setAttribute('data-theme', 'dark');
  };

  </script>
  
  <style scoped>
  .navbar {
    background-color: var(--navbar-bg-color);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
    height: 50px;
    z-index: 1001;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .logo {
    width: 40px;
    margin-right: 1rem;
  }
  
  .hamburger-menu{
    margin-right: 1rem;
  }

  .nav-search {
    margin-right: 1rem;
  }
  
  .theme-icon {
    margin-right: 1rem;
  }
  
  .profile-icon {
    width: 40px;
    border-radius: 50%;
    margin-left: 1rem;
  }

  .sidebar{
    position: fixed;
    top: 50px;
    left: 0px;
    width: 250px;
    height: 100%;
    background-color: var(--sidebar-bg-color);
    z-index: 1000;
    box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
  }

  .close-sidebar{
    margin: 1rem;
  }

.sidebar {
display: flex;
flex-direction: column;
}

.sidebar-item {
margin-bottom: 10px;
}

</style>
  
