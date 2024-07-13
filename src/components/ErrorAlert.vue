<template>
  <transition name="shake">
    <div v-if="message" class="error-alert mb-3">
      {{ message }}
    </div>
  </transition>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'ErrorAlert',
  props: {
    error: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const message = ref(null);

    watch(() => props.error, (newError) => {
      message.value = newError;
      if (newError) {
        setTimeout(() => {
          message.value = null;
          emit('clear');
        }, 3000);
      }
    });

    return { message };
  }
}
</script>

<style scoped>
.error-alert {
  background-color: #ff5252;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

.shake-enter-active {
  animation: shake 0.5s;
}

.shake-leave-active {
  animation: fade-out 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>