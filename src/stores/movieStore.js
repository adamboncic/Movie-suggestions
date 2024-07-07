import { defineStore } from 'pinia';
import tmdbApi from '@/services/tmdbApi';
import { useAuthStore } from './authStore';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    selectedMovie: null,
    selectedMovieDetails: null,
    similarMovies: [],
    directorFilmography: [],
    director: null,
    searchResults: [],
    genres: [],
    loading: false,
    error: null,
    hasSearched: false,
  }),

  actions: {
    async searchMovies(query) {
      this.loading = true;
      this.error = null;
      this.hasSearched = true;
      try {
        if (!query || query.trim() === '') {
          this.searchResults = [];
          this.hasSearched = false;
          return;
        }
        const response = await tmdbApi.searchMovies(query);
        this.searchResults = response.data.results;
        if (!this.searchResults.length) {
           this.error = 'No results found. Please try again.';
        }
      } catch (error) {
        this.error = 'Error searching movies. Please try again.';
        console.error('Error searching movies:', error);
      } finally {
        this.loading = false;
      }
    },

    clearSearch() {
      this.searchResults = [];
      this.hasSearched = false;
      this.selectedMovie = null;
      this.selectedMovieDetails = null;
      this.similarMovies =[];
      this.directorFilmography = [];
      this.director = null;
    },

    async setSelectedMovie(movie) {
      this.selectedMovie = movie;
      await Promise.all([
        this.fetchSimilarMovies(movie.id),
      ]);
    },

   async fetchSimilarMovies(movieId) {
      this.loading = true;
      this.error = null;
      this.similarMovies = [];

      try {
        let moviesArr = [];

        const firstPageResponse = await tmdbApi.getSimilarMovies(movieId, 1);
        const { results, total_pages, total_results } = firstPageResponse.data;

        if (total_results === 0) {
          this.error = 'No similar movies found. Please try another.';
          return;
        }

        moviesArr = results;

        const maxPages = Math.min(total_pages, 5);  // Limit to 5 pages
        const remainingPages = Array.from({ length: maxPages - 1 }, (_, i) => i + 2);

        const remainingPagesPromises = remainingPages.map(page => 
          tmdbApi.getSimilarMovies(movieId, page)
        );

        const responses = await Promise.all(remainingPagesPromises);
        
        responses.forEach(response => {
          moviesArr.push(...response.data.results);
        });

        moviesArr.sort((a, b) => b.popularity - a.popularity);

        this.similarMovies = moviesArr;

      } catch (error) {
        this.error = 'Error fetching similar movies. Please try again.';
        console.error('Error fetching similar movies:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchGenres() {
      try {
        const response = await tmdbApi.getGenres();
        this.genres = response.data.genres;
      } catch (error) {
        console.error('Error fetching genres:', error);
        this.error = 'Failed to fetch genres';
      }
    },

   async fetchDirectorFilmography(movieId) {
    this.loading = true;
    this.error = null;
    try {
      // First, get the movie credits to find the director
      const movieCredits = await tmdbApi.getMovieCredits(movieId);
      const director = movieCredits.data.crew.find(person => person.job === 'Director');
      
      if (director) {
        this.director = director;
        // Then, get the person's movie credits
        const personCredits = await tmdbApi.getPersonMovieCredits(director.id);
        this.directorFilmography = personCredits.data.crew
          .filter(movie => movie.job === 'Director')
          .sort((a, b) => b.popularity - a.popularity);
      } else {
        this.directorFilmography = [];
        this.director = null;
        console.log('No director found for this movie');
      }
    } catch (error) {
      this.error = 'Error fetching director filmography. Please try again.';
      console.error('Error fetching director filmography:', error);
    } finally {
      this.loading = false;
    }
  },

    async fetchMovieDetails(movieId) {
      this.loading = true;
      this.error = null;
      this.selectedMovieDetails = null
      try {
        const response = await tmdbApi.getMovieDetails(movieId);
        this.selectedMovieDetails = response.data;
      } catch (error) {
        this.error = 'Error fetching movie details. Please try again.';
        console.error('Error fetching movie details:', error);
      } finally {
        this.loading = false;
      }
    },

  },

  getters: {
    genreMap: (state) => {
      return state.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    },
  }
});