<template>
  <v-dialog :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" max-width="800px">
    <v-card>
      <v-card-title class="headline d-flex justify-space-between align-center">
        <span class="trailer-title">Trailer</span>
        <v-icon @click="$emit('update:isOpen', false)">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="d-flex justify-center align-center" style="min-height: 450px;">
        <v-progress-circular
          v-if="!trailerLoaded && trailerKey"
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <iframe
          v-if="trailerKey"
          width="100%"
          height="450"
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
.v-card {
  padding: .5em 0.25em;
}
</style>