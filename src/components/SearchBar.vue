<template>
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
    prepend-icon="mdi-database-search"
    return-object
    @update:search="onSearchInput"
    @click:clear="clearSearch"
    clearable
  >
    <template v-slot:item="{ props, item }">
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
    </template>
  </v-autocomplete>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import debounce from 'lodash/debounce';
import noPosterPath from '@/assets/no-poster.png';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { searchResults, loading, genres } = storeToRefs(movieStore);
    const searchQuery = ref('');
    const selectedMovie = ref(null);

    onMounted(async () => {
      if (genres.value.length === 0) {
        await movieStore.fetchGenres();
      }
    });

    const debouncedSearch = debounce((query) => {
      if (query && query.length >= 2) {
        movieStore.searchMovies(query);
      } else {
        movieStore.clearSearch();
      }
    }, 500);

    const onSearchInput = (value) => {
      searchQuery.value = value;
      debouncedSearch(value);
    };

    const clearSearch = () => {
      searchQuery.value = '';
      selectedMovie.value = null;
      movieStore.clearSearch();
    };

    watch(selectedMovie, (newMovie) => {
      if (newMovie) {
        movieStore.setSelectedMovie(newMovie);
      }
    });

    const formatRating = (rating) => {
      return rating ? `${rating.toFixed(1)}/10` : 'N/A';
    };

    const getGenres = (genreIds) => {
      return genreIds.map(id => movieStore.genreMap[id] || 'Unknown').join(', ');
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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