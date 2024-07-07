# In The Mood - (Movie Suggestions)

A Vue 3 app that helps users discover movies based on their preferences. Enter a movie you like, and the app will suggest similar films you might enjoy.

Visit: [https://adamboncic.github.io/movie-suggestions/](https://adamboncic.github.io/movie-suggestions/)

## Technologies Used

- Vue 3
- Vite
- Vuetify 3
- Pinia (for state management)
- Vue Router
- The Movie Database (TMDb) API

## Features

- Search for movies
- View movie details
- Get recommendations for similar movies
- Explore director filmographies

## Getting Started

1. Clone the repository:
```sh
git clone https://github.com/adamboncic/movie-suggestions.git
cd movie-suggestions
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory and add your TMDb API key and access token:
```
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_ACCESS_TOKEN=your_access_token_here
```

2. Start the development server:
```sh
npm run dev
```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run test:unit`: Run unit tests
- `npm run lint`: Lint the code

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by a GitHub Actions workflow.
