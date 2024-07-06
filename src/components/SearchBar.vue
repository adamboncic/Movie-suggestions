<template>
  <div class="search-container">
    <v-autocomplete
      v-model="selectedMovie"
      :items="searchResults"
      :loading="loading"
      :search-input.sync="searchQuery"
      color="white"
      hide-no-data
      hide-selected
      item-title="title"
      item-value="id"
      label="Search for a movie"
      placeholder="Start typing to search"
      return-object
      @update:search="onSearchInput"
      @click:clear="clearSearch"
      clearable
    >
      <template v-slot:item="{ props, item }">
        <v-slide-y-transition>
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-avatar class="grey lighten-2">
                <v-img 
                  :src="item.raw.poster_path ? `https://image.tmdb.org/t/p/w92${item.raw.poster_path}` : noPosterPath"
                  :alt="item.raw.title"
                />
              </v-avatar>
            </template>

            <v-list-item-subtitle class="d-flex align-center">
                {{ formatDate(item.raw.release_date) }} | 
                <v-icon class="small-icon" color="amber">mdi-star</v-icon>
                {{ formatRating(item.raw.vote_average) }} | 
                {{ getGenres(item.raw.genre_ids) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-slide-y-transition>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import debounce from 'lodash/debounce';
import noPosterPath from '@/assets/no-poster.png';
import { formatDate, formatRating } from '@/utils/formatters';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { searchResults, loading, genres } = storeToRefs(movieStore);
    const selectedMovie = ref(null);

    const searchQuery = computed({
      get: () => movieStore.searchQuery,
      set: (value) => movieStore.setSearchQuery(value)
    });

    const debouncedSearch = debounce((query) => {
      if (query && query.length >= 2) {
        movieStore.searchMovies(query);
      }
    }, 500);

    const onSearchInput = (value) => {
      debouncedSearch(value);
    };

    const clearSearch = () => {
      movieStore.clearSearch();
    };

    watch(selectedMovie, (newMovie) => {
      if (newMovie) {
        movieStore.setSelectedMovie(newMovie);
      }
    });

    onMounted(async () => {
      if (genres.value.length === 0) {
        await movieStore.fetchGenres();
      }
    });

    const getGenres = (genreIds) => {
      return genreIds.map(id => movieStore.genreMap[id] || 'Unknown').join(', ');
    };

    return {
      searchQuery,
      selectedMovie,
      searchResults,
      loading,
      onSearchInput,
      clearSearch,
      formatRating,
      getGenres,
      formatDate,
      noPosterPath
    };
  }
};
</script>

<style>
.small-icon {
  font-size: 12px; 
}

</style>