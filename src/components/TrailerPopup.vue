<template>
  <v-dialog id="trailer-popup" :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)">
    <v-card>
      <v-card-title class="headline d-flex justify-space-between align-center">
        <span class="trailer-title">Trailer</span>
        <v-icon @click="$emit('update:isOpen', false)">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="trailer-content">
        <v-progress-circular
          v-if="!trailerLoaded && trailerKey"
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <iframe
          v-if="trailerKey"
          width="100%"
          height="600"
          :src="`https://www.youtube.com/embed/${trailerKey}`"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
          @load="trailerLoaded = true"
          :style="{ display: trailerLoaded ? 'block' : 'none' }"
        ></iframe>
        <p v-if="!trailerKey">No trailer available</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    isOpen: Boolean,
    trailerKey: String,
  },
  emits: ['update:isOpen'],
  setup(props) {
    const trailerLoaded = ref(false);

    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        trailerLoaded.value = false;
      }
    });

    return { trailerLoaded };
  }
}
</script>

<style scoped>
#trailer-popup {
  max-width: 1200px;
}
#trailer-popup .v-card {
  background: black;
}
#trailer-popup .trailer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  padding: 0;
}
</style>