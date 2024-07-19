<template>
  <div v-if="movieReviews.length > 0" class="movie-reviews">
    <h3 class="reviews-title">User Reviews</h3>
    <div class="reviews-container">
      <div v-for="review in movieReviews" :key="review.id" class="review-card">
        <div class="review-header">
          <v-avatar color="primary" size="40">
            {{ review.author.charAt(0).toUpperCase() }}
          </v-avatar>
          <div class="review-meta">
            <h4>{{ review.author }}</h4>
            <span class="review-date">{{ formatDate(review.created_at) }}</span>
          </div>
        </div>
        <p class="review-content">{{ truncateContent(review.content) }}</p>
        <v-btn
          v-if="review.content.length > 200"
          text
          small
          color="primary"
          @click="toggleFullContent(review)"
        >
          {{ review.showFull ? 'Show Less' : 'Read More' }}
        </v-btn>
      </div>
    </div>
    <v-pagination
      v-if="totalReviewPages > 1"
      v-model="reviewsPage"
      :length="totalReviewPages"
      @input="loadReviewPage"
      class="reviews-pagination"
    ></v-pagination>
  </div>
  <div v-else class="no-reviews">No reviews available for this movie.</div>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { formatDate } from '@/utils/formatters';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { movieReviews, reviewsPage, totalReviewPages } = storeToRefs(movieStore);
    const movieId = ref(null); // You'll need to set this based on your route params

    onMounted(async () => {
      await movieStore.fetchMovieReviews(movieId.value);
    });

    const loadReviewPage = async (page) => {
      await movieStore.fetchMovieReviews(movieId.value, page);
    };

    const truncateContent = (content, maxLength = 200) => {
      if (content.length <= maxLength) return content;
      return content.slice(0, maxLength) + '...';
    };

    const toggleFullContent = (review) => {
      review.showFull = !review.showFull;
    };

    return {
      movieReviews,
      reviewsPage,
      totalReviewPages,
      formatDate,
      loadReviewPage,
      truncateContent,
      toggleFullContent,
    };
  }
};
</script>

<style scoped>
.movie-reviews {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.reviews-title {
  font-size: 1.8rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 1.5rem;
}

.reviews-container {
  display: grid;
  gap: 1.5rem;
}

.review-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.review-meta {
  margin-left: 1rem;
}

.review-meta h4 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #fff;
}

.review-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.review-content {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.reviews-pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.no-reviews {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
</style>