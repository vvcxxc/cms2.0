<template>
  <div>
    <el-menu>
      <el-menu-item
        v-for="route in routeInfo.routes"
        @click="router.push(route)"
      >
        <span>{{ route.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { routeInfo, router } from './router'
</script>
