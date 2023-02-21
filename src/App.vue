<template>
  <div>
    <div class="nav">
      <router-link to="/">Index</router-link>
      <router-link to="/schema">Schema</router-link>
      <router-link to="/schema2">Schema2</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
.nav {
  display: flex;
  gap: 1em;
  margin-bottom: 2em;
}
</style>
