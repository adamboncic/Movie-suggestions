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
        <v-list-item v-bind="props" class="search-result-item">
          <template v-slot:prepend>
            <v-avatar size="40" class="mr-3">
              <v-img 
                :src="item.raw.poster_path ? `https://image.tmdb.org/t/p/w92${item.raw.poster_path}` : noPosterPath"
                :alt="item.raw.title"
              />
            </v-avatar>
          </template>
          <v-list-item-subtitle class="search-result-subtitle">
            <span class="rating">
              <v-icon color="amber" size="small">mdi-star</v-icon>
              {{ formatRating(item.raw.vote_average) }}
            </span>
            <div class="genre-pills">
              <span v-for="genre in getGenres(item.raw.genre_ids).slice(0,2)" :key="genre" class="genre-pill">
                {{ genre }}
              </span>
            </div>
          </v-list-item-subtitle>
        </v-list-item>
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
    const { selectedMovie, searchResults, loading, genres } = storeToRefs(movieStore);

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

    const formatTitle = (item) => {
      return `${item.title} ${formatDate(item.release_date)}`;
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
      return genreIds.map(id => movieStore.genreMap[id] || 'Unknown');
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
      formatTitle,
      noPosterPath
    };
  }
};
</script>


<style scoped>
.search-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.search-result-item {
  padding: 8px 0;
}

.search-result-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.rating .v-icon {
  margin-right: 4px;
}

.genre-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.genre-pill {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2px 8px;
  white-space: nowrap;
  font-size: 11px;
}
</style>