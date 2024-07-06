<template>
  <div>
    <GoogleLogin :callback="callback" />
  </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login'
import { useAuthStore } from '@/stores/authStore'

export default {
  components: { GoogleLogin },
  setup() {
    const authStore = useAuthStore()

    const callback = (response) => {
      authStore.setUser(response.profileObj)
    }

    return { callback }
  }
}
</script>