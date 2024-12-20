# TuneTidy Native 2.0

TuneTidy is a React Native and Expo-based application that helps you analyze and manage your Spotify playlists and top tracks. It allows you to:

- **Sort your playlists** by various track attributes (e.g., artist, album, track name, or audio features like danceability or energy).
- **Discover your top Spotify stats** over multiple time ranges (last month, 6 months, and long-term).
- **Generate custom AI-generated cover art** for your playlists using OpenAI's image generation models and apply them directly on Spotify.

## Key Features

1. **Playlist Sorting**  
   Organize playlists by album, artist, track name, tempo, loudness, or other advanced audio features.
   
2. **User Stats**  
   Access top artists, albums, and tracks in three time ranges:
   - Last Month
   - 6 Months
   - Long Term (~2 years)

3. **AI-Generated Cover Art**  
   Integrate with Dalle 2 or Dalle 3 (OpenAI) to create new cover images for your playlists. Save them directly to Spotify.

4. **Playlist Management**  
   Duplicate a sorted playlist into a new one for archiving, or reorder its tracks directly on Spotify.

## Project Structure

- **`app` Folder**  
  Contains the application's primary navigation and screens:
  - **`(tabs)` Directory:** Houses tab-based navigation groups.  
    - **`(playlist)` Directory:** Screens related to playlist selection, viewing, sorting, and editing.  
      - `[playlist].jsx`: Main playlist editor screen, supports refreshing and sorting tracks.
      - `index.jsx`: Playlist selector screen, allowing you to pick which playlist to edit.
      - `_layout.tsx`: Defines the layout and stack navigation options for the playlist-related screens.
    - **`(stats)` Directory:** Screens related to viewing top artists, albums, and tracks.
      - `artists.jsx`, `albums.jsx`, `tracks.jsx`: Each screen fetches and displays your top items in these categories.
      - `_layout.tsx`: Configures tab navigation for these stats screens.

  - **`settings.tsx`:** A screen for toggling theme, choosing cover art generation model, and logging out.
  - **`art.jsx`:** A modal screen for generating and previewing AI-driven cover art for a playlist.
  - **`landing.jsx`:** The landing/login screen where users authenticate with Spotify.

  - **`_layout.tsx`:** The root layout file that sets up theming, navigation, and global providers.

- **`components` Folder:**  
  Contains reusable UI components and primitives (like cards, buttons, skeletons, tooltips, toast messages), as well as higher-level components such as `TrackCard`, `PlaylistCard`, `ArtistCard`, and `AlbumCard`.

- **`contexts` Folder:**  
  Context providers that supply data and state:
  - **PlaylistsContext:** Fetches and provides a user’s playlists.
  - **StatsContext:** Provides top tracks, artists, and albums data.
  - **UserContext:** Manages Spotify authentication tokens, user info, and refresh logic.

- **`hooks` Folder:**  
  Custom hooks to encapsulate logic:
  - `useArtGenerator.jsx`: Handles AI cover art generation logic.
  - `usePlaylist.jsx`: Handles playlist data fetching, sorting, and reordering logic.
  - `useProgressToast.jsx`: Displays a toast with a progress bar, useful when performing long operations like reordering tracks.

- **`utils` Folder:**  
  Utility functions for async storage, event handling, sorting logic (`Sorter.js`), and token management.

- **`firebase` Folder:**  
  Contains Firebase Cloud Functions for prompt and image generation logic using OpenAI's API.

- **`global.css` & `tailwind.config.js`:**  
  For styling, using Tailwind CSS and nativewind to style components consistently across React Native.

- **`babel.config.js`, `metro.config.js`:**  
  Configuration files for project bundling and transpilation.

## Authentication & APIs

- **Spotify API:**  
  This project integrates with the Spotify Web API for fetching user playlists, top tracks/artists, and managing playlist cover images and track orders. OAuth 2.0 login is handled via `expo-web-browser` and `react-native-pkce-challenge`.

- **OpenAI API (Image & Prompt Generation):**  
  Utilizes OpenAI’s image generation endpoints for playlist cover art and GPT models for generating descriptive prompts.

- **Firebase Cloud Functions:**  
  Deployable endpoints for calling OpenAI’s API securely and processing/compressing images.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone <REPO_URL>
   cd tunetidy
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   - Set `EXPO_PUBLIC_SPOTIFY_CLIENT_ID` in your environment variables for Spotify authentication.
   - Set `OPENAI_API_KEY` in Firebase functions environment for image/prompt generation.

4. **Run the App:**
   ```bash
   npx expo start
   ```
   
   Use the Expo Go app or an emulator to preview.

5. **Firebase Deployment (Optional):**
   Configure Firebase CLI and run:
   ```bash
   cd firebase
   firebase deploy
   ```
