# MovieHub — movie platform for search and recommendation

The movie search platform is designed as a modern three-tier architecture through the integration of separate technological layers within a unique monorepo code organization: **React (Vite)** on the frontend, **NestJS** on the backend, and the non-relational **ArangoDB** database.

<img width="462" height="302" alt="Architecture diagram" src="https://github.com/user-attachments/assets/6093efa1-0876-4b9a-83de-a861658b5282" />

The growing volume of available content creates a paradox of choice, more options require more cognitive effort, often leading to decision fatigue, repeated searching, and wasted time. This platform aims to ease the decision-making process through search, personalized recommendations, and interactions with other users. In addition to search functionality, the platform provides the ability to keep personalized movie diaries.

The primary goal when designing the user interface was to create a modern, intuitive, and accessible web application. The inspiration for the visual and functional concept came from platforms like Letterboxd and IMDb, where the first encounter with the site's content is designed to stimulate user's curiosity about new films and community opinions.

<img width="1365" height="595" alt="Registration page" src="https://github.com/user-attachments/assets/c767b857-3e67-431a-a788-b7c1b6af133b" />
<img width="1365" height="595" alt="Login page" src="https://github.com/user-attachments/assets/d63d102e-ad7f-410b-ad75-009d3a4fea92" />

The registration and login page uses a background depicting the experience of buying a cinema ticket and taking a seat, a visual metaphor for the moment a user successfully enters the application.

<img width="1346" height="594" alt="Homepage" src="https://github.com/user-attachments/assets/613b8d9e-79ed-4f9a-b97c-da49e2fdeeb0" />
<img width="1350" height="594" alt="Movie tab" src="https://github.com/user-attachments/assets/a9103fcd-8e58-478c-ae8f-d525b263c6bf" />
<img width="1350" height="595" alt="Search page" src="https://github.com/user-attachments/assets/cda401e9-e0a8-4764-a153-e9ddb78b7231" />

## Tech stack

- **Frontend:** React (Vite framework), TypeScript
- **Backend:** NestJS framework, TypeScript
- **Database:** ArangoDB

## Main features

- Movie search and filtering
- User account management (login, registration, edit user information, logout)
- Content interaction (leave a review, rate a movie, create a library, follow other user's activity)
- Movie details view

## Setup instructions

1. Install all dependencies by running `npm install` in the project's root directory.
2. Run the database locally inside a Docker container on the default port `8529`.
3. Run `npm run dev` (or `npx turbo run dev`) to launch the Turborepo tool, which initializes the NestJS backend and React frontend in parallel in the development environment.
