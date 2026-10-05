<template>
  <RouterView />
  <GlobalToast />
  <PwaUpdate />
  <div class="version">v{{ appVersion }}</div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalToast from '@/components/GlobalToast.vue'
import PwaUpdate from '@/components/PwaUpdate.vue'
const appVersion = __APP_VERSION__
</script>
<style lang="scss" scoped>
.version {
  position: fixed;
  right: 0;
  top: 0;
  color: $accent-terracotta;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
}
</style>
