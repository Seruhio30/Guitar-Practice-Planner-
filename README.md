# Guitar Practice Planner

## Live Application

 https://seruhio30.github.io/Guitar-Practice-Planner-/

---

## Overview

Guitar Practice Planner is a web application designed to help self-taught guitar learners follow a structured and organized practice routine.

The goal is to reduce time wasted searching through random online resources and instead provide a focused daily plan with supporting materials such as song suggestions and contextual information.

---

## Core Features

- Generate structured daily practice sessions based on skill level and focus.
- Built-in practice timer (start, pause, reset).
- Track completed sessions using LocalStorage.
- Search for songs using a real third-party API.
- Display contextual information about songs or artists.
- Save and manage favorite songs locally.
- Responsive dark UI optimized for long practice sessions.

---

## External APIs Used

### 1. iTunes Search API

Used to fetch real song data based on user search input.

Returned JSON data includes multiple attributes such as:
- trackId
- trackName
- artistName
- artworkUrl100
- trackViewUrl
- releaseDate
- collectionName
- primaryGenreName
- previewUrl

This API provides live, real-world data for song discovery.

### 2. Wikipedia REST API

Used to retrieve contextual summaries about the searched song or artist.

The application dynamically displays:
- Title
- Extract summary
- External link to full article

This enriches the learning experience with educational context.

---

## JavaScript Architecture

The project is built using vanilla JavaScript with ES modules.

Key components include:

- `sessionGenerator.js` – Creates structured practice sessions dynamically.
- `practice.js` – Handles timer logic, session rendering, and progress tracking.
- `mediaService.js` – Orchestrates media-related logic.
- `itunesService.js` – Handles API communication with iTunes.
- `wikiService.js` – Handles Wikipedia API requests.
- `favorites.js` – Manages LocalStorage persistence and UI updates.

The application uses:
- async/await for API calls
- map(), filter(), reduce() for JSON processing
- Event delegation for dynamic content
- Modular separation of concerns

---

## Events Used

The application uses multiple event listeners to create an interactive experience:

- click → Generate session
- click → Timer start
- click → Timer pause
- click → Timer reset
- click → Complete session
- input → Enable/disable search button
- click → Fetch song suggestions
- click → Add to favorites
- click → Remove favorite
- click → Clear favorites

---

## LocalStorage Implementation

The application stores persistent data using LocalStorage:

- `lastSession` – Stores the most recent generated session.
- `completedSessions` – Stores session completion history.
- `favorites` – Stores user-selected favorite songs.

This ensures data persists after page reload.

---

## Accessibility Improvements

- Buttons include explicit `type="button"`.
- Dynamic content areas use `aria-live="polite"`.
- Inputs are properly labeled.
- Disabled states provide visual feedback.

---

## Error Handling & Empty States

The application includes:

- Loading states for API calls.
- Clear messages when no results are found.
- Fallback behavior for video searches.
- Graceful handling of API failures.

---

## Testing Checklist

Manual testing was performed for:

- Song search functionality.
- Wikipedia summary loading.
- Favorites add/remove/clear.
- Practice session generation.
- Timer start/pause/reset.
- Session persistence after reload.
- Completed session tracking.
- Responsive layout (mobile and desktop).

---

## Known Limitations

- YouTube Data API requires billing verification, so video search currently provides a direct YouTube search fallback link.
- No backend user authentication is implemented.
- Progress tracking is stored locally per browser.

---

## Project Planning

 Trello Board:  
https://trello.com/invite/b/697e92bead58ebf42b73f049/ATTI89e6cb4973ae87e462fb2fc878c785051B6C0ED7/guitar-practice-planner

---

## Future Improvements

- Full YouTube Data API integration.
- Advanced recommendation logic.
- Embedded tutorial videos.
- User accounts and cloud persistence.
- Enhanced progress analytics.
