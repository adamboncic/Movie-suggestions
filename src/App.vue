<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  setup() {
    // ...
  },
}
</script>

<style>
.v-container .v-card {
  padding-bottom: 10px;
}
</style>