<template>
    <div class="navbar">
      <Menubar :model="items">
        <template #start>
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
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Menubar from 'primevue/menubar';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  
  // Search Query
  const searchQuery = ref('');
  
  // Menu Items
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
    padding: 1rem;
    background-color: var(--navbar-bg-color);
  }
  
  .logo {
    width: 40px;
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
  </style>
  
