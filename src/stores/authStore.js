import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    tempLogin() {
      this.user = { name: 'Test User', email: 'test@example.com' };
    },
    logout() {
      this.user = null;
    },
  },
});