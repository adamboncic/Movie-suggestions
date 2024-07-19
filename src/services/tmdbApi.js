import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '__API_KEY__';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || '__ACCESS_TOKEN__';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'accept': 'application/json'
  },
  params: {
    api_key: API_KEY
  }
});

export default {
  searchMovies(query) {
    return tmdbApi.get('/search/movie', { params: { query } });
  },
  getMovieDetails(movieId) {
    return tmdbApi.get(`/movie/${movieId}`);
  },
  getSimilarMovies(movieId, page = 1) {
    return tmdbApi.get(`/movie/${movieId}/recommendations`, {
      params: {
        page: page
      }
    });
  },
  getMovieReviews(movieId, page = 1) {
    return tmdbApi.get(`/movie/${movieId}/reviews`, {
      params: {
        page: page
      }
    });
  },
  getMovieImages(movieId) {
    return tmdbApi.get(`/movie/${movieId}/images`);
  },
  getMovieVideos(movieId) {
    return tmdbApi.get(`/movie/${movieId}/videos`);
  },
  getMovieCredits(movieId) {
    return tmdbApi.get(`/movie/${movieId}/credits`);
  },
  getMovieKeywords(movieId) {
    return tmdbApi.get(`/movie/${movieId}/keywords`);
  },
  getPersonDetails(personId) {
    return tmdbApi.get(`/person/${personId}`);
  },
  getPersonMovieCredits(personId) {
    return tmdbApi.get(`/person/${personId}/movie_credits`);
  },
  getGenres() {
    return tmdbApi.get('/genre/movie/list');
  },
};

