import axios from 'axios';

const API_KEY = 'e947c1c7a2b3a6c3c95fdd7e0b3dac37';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTQ3YzFjN2EyYjNhNmMzYzk1ZmRkN2UwYjNkYWMzNyIsIm5iZiI6MTcxOTk0MzQyOS40NDM0MSwic3ViIjoiNjY4NDQwNTNmYTFiZWUzNzVmNjBhNjM3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TCXFj7fqldehIeBv92wdxKQf9QqCHJ4AD_buHTLCyVk'
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
  getMovieImages(movieId) {
    return tmdbApi.get(`/movie/${movieId}/images`);
  },
  getMovieCredits(movieId) {
    return tmdbApi.get(`/movie/${movieId}/credits`);
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

