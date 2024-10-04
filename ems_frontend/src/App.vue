<template>
  <!-- Navbar component with sidebarVisible prop and toggleSidebar function-->
  <Navbar @toggle-sidebar="toggleSidebar"/>
  
  <!-- Main content(RouterView) -->
   <div class="main-content" :class="{ 'sidebar-open': sidebarVisible }">
      <RouterView /> <!-- Pass Sidebar visible down -->
   </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import Navbar from './components/Navbar.vue';

//Sidebar visibility state management
const sidebarVisible = ref(false);

//Toggle sidebar visibility function
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

</script>

<style scoped>

.main-content{
  padding-top: 55px;
  transition: margin-left 0.3s ease; /* Smooth transition for content shift */
}

/* When sidebar is open, adjust the main content */
.sidebar-open {
  margin-left: 250px;
}
</style>
