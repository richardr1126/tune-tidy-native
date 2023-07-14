
<div align="center">
<h1 align="center">
<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
<br>tune-tidy-native
</h1>
<h3>◦ Perfect harmony for clean code!</h3>
<h3>◦ Developed with the software and tools listed below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/Swift-F05138.svg?style&logo=Swift&logoColor=white" alt="Swift" />
<img src="https://img.shields.io/badge/C-A8B9CC.svg?style&logo=C&logoColor=black" alt="C" />
<img src="https://img.shields.io/badge/React-61DAFB.svg?style&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/OpenAI-412991.svg?style&logo=OpenAI&logoColor=white" alt="OpenAI" />

<img src="https://img.shields.io/badge/Gradle-02303A.svg?style&logo=Gradle&logoColor=white" alt="Gradle" />
<img src="https://img.shields.io/badge/Expo-000020.svg?style&logo=Expo&logoColor=white" alt="Expo" />
<img src="https://img.shields.io/badge/java-%23ED8B00.svg?style&logo=openjdk&logoColor=white" alt="java" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style&logo=JSON&logoColor=white" alt="JSON" />
</p>
<img src="https://img.shields.io/github/languages/top/richardr1126/tune-tidy-native?style&color=5D6D7E" alt="GitHub top language" />
<img src="https://img.shields.io/github/languages/code-size/richardr1126/tune-tidy-native?style&color=5D6D7E" alt="GitHub code size in bytes" />
<img src="https://img.shields.io/github/commit-activity/m/richardr1126/tune-tidy-native?style&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/license/richardr1126/tune-tidy-native?style&color=5D6D7E" alt="GitHub license" />
</div>

---

## 📒 Table of Contents
- [📒 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [⚙️ Features](#-features)
- [📂 Project Structure](#project-structure)
- [🧩 Modules](#modules)
- [🚀 Getting Started](#-getting-started)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

The project is a music app built with React Native that uses the Spotify Web API to fetch and display user information, playlists, top artists, and top tracks. It provides functionalities for sorting and displaying playlists, top artists, and top tracks based on different criteria, such as name, popularity, and release date. The app also includes features like haptic feedback, dark mode, and the ability to generate and set custom cover images for playlists. Its value proposition lies in providing a visually appealing and customizable music experience for users, allowing them to easily access and interact with their Spotify content.

---

## ⚙️ Features

| Feature                | Description                           |
| ---------------------- | ------------------------------------- |
| **⚙️ Architecture**     | The codebase follows a modular architecture, with components organized into different folders based on their functionality. The main entry point is the `index.js` file, which registers the root component using Expo's `registerRootComponent` function. The codebase uses React Native and Expo, with navigation functionality implemented using React Navigation. It also makes use of NativeBase for styling and extends the theme with a dark color mode. The overall architecture appears to follow a component-based design pattern, with components such as `Main`, `LandingPage`, and `PlaylistRouter` serving as higher-level screens that render and manage other components. The codebase utilizes functional components and hooks like `useState` and `useEffect` for managing state and side effects. The codebase also integrates with the Spotify Web API to fetch data. |
| **📖 Documentation**   | The codebase provides some inline comments in certain files to explain the purpose and functionality of specific code snippets. However, the overall documentation appears to be limited, and some code files lack any comments or explanations. This could make it challenging for developers, especially newcomers, to understand the codebase and contribute effectively. Improving the documentation by adding more comments and explanations would enhance the codebase's comprehensiveness and maintainability. |
| **🔗 Dependencies**    | The codebase relies on several external dependencies to enhance its functionality. These include libraries such as React Native, Expo, React Navigation, NativeBase, FontAwesome5, SpotifyWebApi, OpenAI, AsyncStorage, and react-native-compressor. These dependencies provide essential features such as UI components, navigation, API integration, styling, and data persistence. The project utilizes package management with npm and specifies the required dependencies in the `package.json` file. |
| **🧩 Modularity**      | The codebase demonstrates modularity by organizing components into separate folders based on their functionality. For example, there are folders for `components`, `utils`, and `pages/tabs`. This modular organization allows for better code maintainability and reusability. Components such as `PlaylistTrackCard`, `GenericCard`, and `LoadingModal` are memoized for performance optimization. The codebase also encapsulates sorting functions for tracks in an object called `Sorters`, providing easy accessibility and reuse across the codebase. Overall, the codebase demonstrates a good level of modularity, separating concerns and promoting code reuse. |
| **✔️ Testing**          | The codebase does not include any explicit unit tests or testing frameworks. The lack of testing strategies and tools is a significant drawback, as it makes it difficult to ensure the correctness and robustness of the codebase. Implementing test cases using a suitable testing framework like Jest or React Testing Library would improve the overall quality of the codebase and facilitate easier maintenance and refactoring. |
| **⚡

---


## 📂 Project Structure




---

## 🧩 Modules

<details closed><summary>Root</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---                                                                                           | ---                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [index.js](https://github.com/richardr1126/tune-tidy-native/blob/main/index.js)               | The code snippet registers the root component'App' using Expo's'registerRootComponent' function, ensuring proper setup for loading the app in Expo Go or in a native build.                                                                                                                                                                                                                                            |
| [metro.config.js](https://github.com/richardr1126/tune-tidy-native/blob/main/metro.config.js) | The code snippet retrieves the default configuration for the Expo Metro Bundler and exports it for use. It simplifies the customization of the Metro bundler tool used in Expo projects.                                                                                                                                                                                                                               |
| [babel.config.js](https://github.com/richardr1126/tune-tidy-native/blob/main/babel.config.js) | This code exports a function that configures Babel presets and plugins for Expo projects. It enables the use of environment variables from a.env file using a plugin called "react-native-dotenv". The specified.env file and environment variable name are used to access the values in the code.                                                                                                                     |
| [App.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/App.jsx)                 | This code snippet is a React Native app that includes navigation functionality using React Navigation. It sets up a stack navigator with different screens, such as LandingPage, Main, Instructions, and CoverImageGenerator. It also manages the app's state using useState and useEffect hooks and implements a loading mechanism. The app uses NativeBase for styling and extends the theme with a dark color mode. |

</details>

<details closed><summary>Utils</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [Sorter.js](https://github.com/richardr1126/tune-tidy-native/blob/main/utils/Sorter.js)                                                   | The provided code snippet defines functions that sort tracks based on different criteria such as name, original position, album name, artist name, release date, popularity, date added, tempo, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, and valence. These sorting functions are encapsulated within an object called "Sorters" for easy access and use in other parts of the code.                                                                                                                                                                                                                                    |
| [asyncStorage.js](https://github.com/richardr1126/tune-tidy-native/blob/main/utils/asyncStorage.js)                                       | The provided code snippet includes functions for storing and retrieving data using AsyncStorage in React Native. The storeData function saves a key-value pair, while the getData function retrieves the value associated with a given key. The clear function clears all stored data and then restores the values of'generationLimit' and'lastUpdateDate'.                                                                                                                                                                                                                                                                                                           |
| [Header.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/Header.jsx)                           | The provided code snippet is a React component that represents a header section. It takes in props such as device theme, text, and a function to handle back button press. The component dynamically calculates the size of the text based on its length and adjusts the font size accordingly. It also applies different styles based on the device theme, such as background color, text color, and border color. The header section includes a back button and a heading that displays the given text. When the back button is pressed, the handleBackButtonPress function is called.                                                                              |
| [Profile.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/Profile.jsx)                         | This code snippet is a React Native component that represents a user profile. It displays the user's name, profile picture, and number of followers. It also includes buttons for viewing the user's profile on Spotify, viewing the privacy policy, and logging out. The component uses various styling and navigation functionalities.                                                                                                                                                                                                                                                                                                                              |
| [LoadingModal.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/LoadingModal.jsx)               | The provided code snippet is a React component that renders a loading modal. It takes in props for the device theme, modal open state, and progress value. It calculates and displays the estimated wait time based on the progress. The modal includes a heading, description, progress bar, and a warning message.                                                                                                                                                                                                                                                                                                                                                  |
| [jsonHelpers.js](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/jsonHelpers.js)                   | The code snippet defines a set of options and icons for sorting and displaying data. It includes options for sorting by different attributes such as name, album name, and popularity, as well as corresponding icons for ascending and descending sorting. It also includes icons for labeling the attributes on the left side.                                                                                                                                                                                                                                                                                                                                      |
| [PlaylistSelector.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/PlaylistSelector.jsx)       | The code snippet defines a React Native component called PlaylistSelector. It displays a list of playlists and allows the user to select one. It handles user interactions and navigation. The component also adapts its appearance based on the device's theme.                                                                                                                                                                                                                                                                                                                                                                                                      |
| [Instructions.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/Instructions.jsx)               | The code snippet defines a functional component called "Instructions" that displays instructions for a playlist sorting feature. It uses various UI components from the NativeBase library and FontAwesome5 icons. It also imports a "storeData" function from a utility file to handle data storage. The component has a "handleGetStartedPressed" function that saves data, navigates back, and renders a UI with headings, text, and buttons.                                                                                                                                                                                                                      |
| [CoverImageGenerator.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/CoverImageGenerator.jsx) | This code snippet is a React Native component that generates and sets a custom cover image for a playlist on Spotify. It uses various dependencies such as React Native, NativeBase, FontAwesome5, SpotifyWebApi, OpenAI, AsyncStorage, and react-native-compressor. The component allows the user to enter a description for the cover image, generates the image using OpenAI's API, compresses and displays the generated image, and provides an option to set the generated image as the cover for the selected playlist on Spotify. The component also manages the generation limit for the cover images and handles access token refresh for Spotify API calls. |
| [TracksList.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/utils/TracksList.jsx)                   | The provided code snippet is a functional component that renders a list of tracks. It uses the Animated.FlatList component from react-native to display the list with animation effects. It also includes features like pull-to-refresh and infinite scrolling. The tracks are passed as data and rendered using the PlaylistTrackCard component.                                                                                                                                                                                                                                                                                                                     |

</details>

<details closed><summary>Cards</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                   |
| [ArtistCard.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/cards/ArtistCard.jsx)               | The provided code snippet defines a functional component called ArtistCard. It renders a card with an avatar, index, and name of an artist. When pressed, it triggers a haptic feedback and opens the artist's URL. The card's appearance is dynamically styled based on the device's theme.                                          |
| [GenericCard.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/cards/GenericCard.jsx)             | This code snippet is a React Native component called GenericCard. It renders a pressable container that displays information about a music item, such as album art, name, and artists. It also includes functionality to open a URL when pressed and trigger haptic feedback. The component is memoized for performance optimization. |
| [PlaylistTrackCard.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/cards/PlaylistTrackCard.jsx) | This code snippet defines a PlaylistTrackCard component that displays information about a track in a playlist. When pressed, it triggers haptic feedback and opens the track's Spotify URL. It also dynamically adjusts the appearance based on the device's theme.                                                                   |

</details>

<details closed><summary>Pages</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [Main.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/Main.jsx)               | The code snippet is a React component that creates a main navigation screen using the Material Top Tab Navigator from the React Navigation library. It also makes use of the Spotify Web API to fetch data such as user information, playlists, top artists, and top tracks. The component fetches data on initial render and provides tabs for sorting playlists, displaying top artists, top tracks, and top albums. Additionally, it handles refreshing data and managing access tokens for authentication with the Spotify API. |
| [LandingPage.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/LandingPage.jsx) | This code snippet is a React Native component called "LandingPage". It is responsible for rendering a screen that serves as a landing page for a music app. The component includes functionalities for handling user authentication with Spotify, storing and retrieving data using AsyncStorage, refreshing access tokens, and checking token expiration. It also includes UI elements such as text, images, and buttons for displaying content and facilitating user interactions.                                                |

</details>

<details closed><summary>Tabs</summary>

| File                                                                                                                      | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                                       | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [PlaylistRouter.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/PlaylistRouter.jsx) | The code snippet provides a playlist router component for a React Native application. It uses the createStackNavigator function from the "@react-navigation/stack" library to create a stack navigator. The component renders different screens such as Playlist Selector, Playlist Editor, and Profile, passing relevant props and styling based on the color mode of the device. The component is exported as a memoized function.                                                                                              |
| [TopAlbums.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/TopAlbums.jsx)           | This code snippet is a functional component in React that displays a list of top albums based on the provided topTracks data. It allows the user to select a time range and sorts the albums based on the number of tracks. The component also handles the rendering of the albums and provides a fallback message if no top albums are found.                                                                                                                                                                                    |
| [TopTracks.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/TopTracks.jsx)           | This code defines a functional component called "TopTracks" that displays a list of top tracks. It uses various UI components from the NativeBase library and includes a dropdown menu to switch between different time ranges. The component receives "topTracks" as a prop, which is an object containing data for each time range. It renders a FlatList to display the top tracks based on the selected time range, or a message if there are no tracks available. It also utilizes memoization for performance optimization. |
| [TopArtists.jsx](https://github.com/richardr1126/tune-tidy-native/blob/main/components/pages/tabs/TopArtists.jsx)         | This code snippet defines the `TopArtists` component, which displays a list of top artists based on a selected time range. It uses various UI components from the `native-base` library and custom components like `ArtistCard`. The component handles state for the selected time range and renders the list of artists accordingly. It also includes some styling and haptic feedback.                                                                                                                                          |

</details>

---

## 🚀 Getting Started

### ✔️ Prerequisites

Before you begin, ensure that you have the following prerequisites installed:
> - `ℹ️ Requirement 1`
> - `ℹ️ Requirement 2`
> - `ℹ️ ...`

### 📦 Installation

1. Clone the tune-tidy-native repository:
```sh
git clone https://github.com/richardr1126/tune-tidy-native
```

2. Change to the project directory:
```sh
cd tune-tidy-native
```

3. Install the dependencies:
```sh
npm install
```

### 🎮 Using tune-tidy-native

```sh
node app.js
```

### 🧪 Running Tests
```sh
npm test
```

---


## 🗺 Roadmap

> - [X] `ℹ️  Task 1: Implement X`
> - [ ] `ℹ️  Task 2: Refactor Y`
> - [ ] `ℹ️ ...`


---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:
1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
4. Make changes to the project's codebase.
5. Commit your changes to your local branch with a clear commit message that explains the changes you've made.
```sh
git commit -m 'Implemented new feature.'
```
6. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
7. Create a new pull request to the original project repository. In the pull request, describe the changes you've made and why they're necessary.
The project maintainers will review your changes and provide feedback or merge them into the main branch.

---

## 📄 License

This project is licensed under the `ℹ️  INSERT-LICENSE-TYPE` License. See the [LICENSE](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository) file for additional info.

---

## 👏 Acknowledgments

> - `ℹ️  List any resources, contributors, inspiration, etc.`

---
