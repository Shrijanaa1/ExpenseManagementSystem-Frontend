<template>
    <div>

      <!-- Top Menubar -->
       <div class="navbar">
          <Menubar :model="items">
            <template #start>

              <Button v-if="!sidebarVisible" icon="pi pi-bars" class="hamburger-menu" @click="toggleSidebar"/>
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
          <Menubar :model="itemsSidebar">
            <template #start>

            </template>
            <template #end>
              <!-- Close Button for Sidebar -->
               <Button icon="pi pi-times" class="close-sidebar" @click="toggleSidebar"/>
            </template>
          </Menubar>
       </div>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Search Query
  const searchQuery = ref('');
  
  // Menu Items for Top Navbar
  const items = ref([
      {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => { console.log('Home clicked') }
      },
      {
          label: 'Features',
          icon: 'pi pi-star',
          command: () => { console.log('Features clicked') }
      },
      {
          label: 'Projects',
          icon: 'pi pi-folder',
          items: [
              { label: 'Project 1', icon: 'pi pi-file' },
              { label: 'Project 2', icon: 'pi pi-file' }
          ]
      },
      {
          label: 'Contact',
          icon: 'pi pi-envelope',
          command: () => { console.log('Contact clicked') },
          badge: '3'
      }
  ]);
  
  //Menu Items for Sidebar Menubar
  const itemsSidebar = ref([
    { label: 'Dashboard', icon: 'pi pi-char-line' },
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { label: 'Logout', icon: 'pi pi-sign-out' }
  ]);

  //Sidebar Visibility State
  const sidebarVisible = ref(false);

  //Toggle Sidebar
  const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
  }

  // Methods to handle theme switching
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
    left: 1px;
    right: 1px;
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
    left: 1px;
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

  .sidebar Menubar {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  padding: 1rem;
  cursor: pointer;
}

.sidebar ul li:hover {
  background-color: var(--sidebar-hover-bg-color);
}

  </style>
  
