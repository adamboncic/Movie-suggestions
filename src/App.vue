<template>
  <v-app>
<!--     <v-app-bar app color="primary" dark>
      <v-app-bar-title>Movie Recommender</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authStore.user" @click="showLoginDialog = true">
        Login
      </v-btn>
      <v-menu v-else open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            {{ authStore.user.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goToFavorites">
            <v-list-item-title>Favorites</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar> -->

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

<!--     <v-dialog v-model="showLoginDialog" max-width="500px">
      <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <GoogleLogin :callback="handleLogin" />
          <v-btn @click="tempLogin" class="mb-4" block color="primary">
            Temporary Login (Test User)
          </v-btn>
          <v-btn @click="continueAsGuest" block>
            Continue as Guest
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </v-app>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';
// Import commented out for now
// import { GoogleLogin } from 'vue3-google-login';

export default {
  components: {
    // GoogleLogin,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const showLoginDialog = ref(false);

    const handleLogin = async (response) => {
      await authStore.login(response.profileObj);
      showLoginDialog.value = false;
    };

    const tempLogin = async () => {
      await authStore.tempLogin();
      showLoginDialog.value = false;
    };

    const logout = async () => {
      await authStore.logout();
      router.push('/');
    };

    const continueAsGuest = () => {
      showLoginDialog.value = false;
      // You might want to set some state indicating guest mode
      // For now, we'll just close the dialog
    };

    const goToFavorites = () => {
      router.push('/favorites');
    };

    return {
      authStore,
      showLoginDialog,
      handleLogin,
      tempLogin,
      logout,
      continueAsGuest,
      goToFavorites,
    };
  },
}
</script>