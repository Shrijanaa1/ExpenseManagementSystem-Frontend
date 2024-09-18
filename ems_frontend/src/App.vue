<template>

  <!-- Navbar component with sidebarVisible prop and toggleSidebar function-->
  <Navbar :sidebarVisible="sidebarVisible" :toggleSidebar="toggleSidebar"/>
  
  <!-- Main content(RouterView) -->
   <div class="main-content">
      <RouterView :sidebarVisible="sidebarVisible"/> <!-- Pass Sidebar visible down -->
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
}
</style>
