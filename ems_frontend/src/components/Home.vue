<template>
    <!-- <div class="home-container">
        <div :class="['home-content', { 'sidebar-open': sidebarVisible }]"> -->
        <h2> This is home page.</h2>
    <!-- </div>
    </div> -->
</template>

<script setup>
import { defineProps } from 'vue';

//Receive the sidebarVisible prop from the parent component(App.vue)
const props = defineProps({
    sidebarVisible: Boolean,
});


</script>

<style scoped>
.home-container {
  display: flex;
}

.home-content {
  padding-right: 1rem;
  flex-grow: 1; /* Allow the content to grow and fill the remaining space */
  width: 100%;
  transition: margin-left 0.3s ease;
}

.home-content.sidebar-open {
  margin-left: 250px; /* Adjust this to the sidebar width */
}

</style>