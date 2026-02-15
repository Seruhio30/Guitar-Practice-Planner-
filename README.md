# Guitar Practice Planner
## Overview

Guitar Practice Planner is a web application designed to help self-taught guitar learners follow a structured and organized practice routine.
The goal is to reduce time wasted searching through random online resources and instead provide a focused daily plan with supporting materials.

## Core Features

- Generate structured daily practice sessions based on skill level and focus.

- Search for songs using a real external API.

- Display contextual information about songs or artists.

- Save favorite songs locally using LocalStorage.

- Clean, distraction-free dark UI optimized for long practice sessions.

## External APIs Used
### iTunes Search API

Used to fetch real song data based on user search input.
Returned data includes:

- Song title

- Artist name

- External link

- Artwork thumbnail

- This API provides live, real-world data for song discovery.

### Wikipedia REST API

Used to retrieve contextual summaries about the searched song or artist.
This allows the application to provide educational background information alongside the practice content.

- Technical Implementation

- Built using HTML, Tailwind CSS, and vanilla JavaScript modules.

- Uses async/await for API requests.

- Organized service layer (mediaService, itunesService, wikiService).

- LocalStorage used for persistent favorites.

- Modular architecture allows future API expansion (e.g., tutorial video integration).

## Future Improvements

- Integrate YouTube Data API for embedded guitar tutorials.

- Add user progress tracking and session history.

- Improve filtering and recommendation logic.

- Add timer integration for practice sessions.

## Project Planning
[Trello Board: Guitar Practice Planner](https://trello.com/invite/b/697e92bead58ebf42b73f049/ATTI89e6cb4973ae87e462fb2fc878c785051B6C0ED7/guitar-practice-planner)
