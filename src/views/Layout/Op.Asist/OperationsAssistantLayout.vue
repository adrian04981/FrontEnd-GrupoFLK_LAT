<!-- src/layouts/MainLayout.vue -->
<template>
    <el-container style="height: 100vh">
      <Drawer ref="drawer" class="d-md-none" />
      <el-main>
        <router-view></router-view> 
      </el-main>
    </el-container>
  </template>
  
  <script>
  import Drawer from './Drawer.vue';
  
  export default {
    components: {
      Drawer
    },
  };
  </script>  