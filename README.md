# 🎬 HalalFlix

A premium halal streaming platform built as a full-stack mobile application. HalalFlix provides a curated library of family-friendly movies and series with a sleek, Netflix-inspired dark UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Architecture](#architecture)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Shared Types](#shared-types)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

HalalFlix is a full-stack streaming application designed to deliver halal, family-appropriate entertainment. It features user authentication, multi-profile support, a dynamic home feed with categorized content, search, watchlists, and a built-in video player — all wrapped in a dark, premium streaming aesthetic.

---

## Tech Stack

### Frontend

| Technology               | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| **React Native**         | Cross-platform mobile framework          |
| **Expo** (SDK 52)        | Development toolchain & managed workflow |
| **TypeScript**           | Type-safe development                    |
| **React Navigation**     | Stack & bottom-tab navigation            |
| **Zustand**              | Lightweight state management             |
| **Expo AV**              | Video playback                           |
| **Expo Linear Gradient** | UI gradient effects                      |

### Backend

| Technology                | Purpose               |
| ------------------------- | --------------------- |
| **Node.js / Express**     | REST API server       |
| **TypeScript**            | Type-safe development |
| **PostgreSQL**            | Relational database   |
| **JSON Web Tokens (JWT)** | Authentication        |
| **bcrypt**                | Password hashing      |
| **Helmet**                | Security headers      |

### Monorepo

| Technology                    | Purpose                            |
| ----------------------------- | ---------------------------------- |
| **npm Workspaces**            | Monorepo package management        |
| **Shared `@halalflix/types`** | Shared TypeScript type definitions |

---

## Project Structure

```
HalalFlix/
├── apps/
│   ├── backend/                  # Express REST API
│   │   ├── src/
│   │   │   ├── config/           # Environment & app configuration
│   │   │   ├── db/               # Database connection, migrations & seeds
│   │   │   │   └── migrations/   # SQL migration files
│   │   │   ├── middleware/       # Express middleware (auth, error handling)
│   │   │   ├── modules/          # Feature modules
│   │   │   │   ├── auth/         # Authentication (login, register)
│   │   │   │   ├── movies/       # Movies & series CRUD
│   │   │   │   ├── users/        # User management
│   │   │   │   └── watchlist/    # Watchlist management
│   │   │   └── main.ts           # App entry point
│   │   ├── .env                  # Environment variables (not committed)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                 # Expo / React Native app
│       ├── src/
│       │   ├── components/       # Reusable UI components
│       │   │   ├── Button.tsx
│       │   │   ├── ContentRow.tsx
│       │   │   ├── HeroSection.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   └── MovieCard.tsx
│       │   ├── screens/          # Application screens
│       │   │   ├── HomeScreen.tsx
│       │   │   ├── SearchScreen.tsx
│       │   │   ├── MovieDetailsScreen.tsx
│       │   │   ├── PlayerScreen.tsx
│       │   │   ├── LoginScreen.tsx
│       │   │   ├── SignUpScreen.tsx
│       │   │   ├── WelcomeScreen.tsx
│       │   │   ├── SettingsScreen.tsx
│       │   │   └── ...
│       │   ├── services/         # API service layer
│       │   ├── store/            # Zustand state stores
│       │   │   ├── authStore.ts
│       │   │   ├── movieStore.ts
│       │   │   ├── profileStore.ts
│       │   │   └── watchlistStore.ts
│       │   └── styles/           # Design system & theme
│       │       └── theme.ts
│       ├── App.tsx               # Root component & navigation
│       ├── app.json              # Expo configuration
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── types/                    # Shared TypeScript types
│       └── src/
│
├── package.json                  # Root workspace config
├── tsconfig.base.json            # Shared TS configuration
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 14
- **Expo CLI** — installed globally or via `npx`
- **Expo Go** app on your mobile device (for testing)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/HalalFlix.git
   cd HalalFlix
   ```

2. **Install all dependencies** (from the project root):
   ```bash
   npm install
   ```
   > This installs dependencies for the root, backend, and frontend workspaces via npm workspaces.

### Database Setup

1. **Create a PostgreSQL database:**

   ```sql
   CREATE DATABASE halalflix;
   ```

2. **Configure the environment** — create/update `apps/backend/.env`:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/halalflix
   JWT_SECRET=your-secure-secret-key
   JWT_EXPIRES_IN=7d
   ```

3. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

4. **Seed the database** with sample content:
   ```bash
   npm run db:seed
   ```

### Running the App

**Start the backend server:**

```bash
npm run dev:backend
```

> The API will be available at `http://localhost:3000`

**Start the frontend (Expo):**

```bash
npm run dev:frontend
```

> Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

---

## Architecture

### Backend

The backend follows a **modular architecture** where each feature is self-contained within its own module under `src/modules/`. Each module typically contains:

- **`*.routes.ts`** — Express route definitions
- **`*.controller.ts`** — Request handling & response formatting
- **`*.service.ts`** — Business logic & database queries

**Middleware:**

- **Authentication** — JWT-based token verification
- **Error Handling** — Centralized error handler with consistent error responses

**Security:**

- Passwords hashed with **bcrypt**
- HTTP headers hardened with **Helmet**
- CORS enabled for cross-origin requests

### Frontend

The frontend is an **Expo-managed React Native** app with a clean separation of concerns:

- **Screens** — Full page views (15 screens covering auth, browsing, playback, and settings)
- **Components** — Reusable UI elements (`Button`, `Input`, `MovieCard`, `HeroSection`, `ContentRow`, `LoadingSpinner`)
- **Services** — API communication layer abstracting HTTP calls
- **Stores** — Zustand stores for global state (auth, movies, profiles, watchlist)
- **Styles** — Centralized design system with color palette, typography, spacing, and shadow tokens

**Navigation Flow:**

```
Splash → Welcome → Login / Sign Up
                        ↓
                   Profile Select → Main Tabs
                                      ├── Home
                                      ├── Search
                                      ├── New & Hot
                                      └── My List (Watchlist)
                                           ↓
                                     Movie Details → Player
```

### Shared Types

The `packages/types` workspace provides shared TypeScript type definitions used by both the frontend and backend, ensuring type consistency across the stack.

---

## API Endpoints

| Method   | Endpoint             | Description                       | Auth |
| -------- | -------------------- | --------------------------------- | ---- |
| `GET`    | `/api/health`        | Health check                      | ❌   |
| `POST`   | `/api/auth/register` | Register a new user               | ❌   |
| `POST`   | `/api/auth/login`    | Login & receive JWT               | ❌   |
| `GET`    | `/api/users/me`      | Get current user                  | ✅   |
| `GET`    | `/api/movies/home`   | Home feed (featured + categories) | ✅   |
| `GET`    | `/api/movies/search` | Search movies                     | ✅   |
| `GET`    | `/api/movies/:id`    | Movie details                     | ✅   |
| `GET`    | `/api/watchlist`     | Get user's watchlist              | ✅   |
| `POST`   | `/api/watchlist`     | Add to watchlist                  | ✅   |
| `DELETE` | `/api/watchlist/:id` | Remove from watchlist             | ✅   |

---

## Database Schema

The database consists of the following tables:

| Table             | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `users`           | User accounts with email, password, and subscription status       |
| `profiles`        | User profiles (up to 4 per user, with kids mode support)          |
| `genres`          | Movie/series genres                                               |
| `movies`          | Movies and series catalog                                         |
| `movie_genres`    | Many-to-many junction between movies and genres                   |
| `episodes`        | Individual episodes for series content                            |
| `categories`      | Home feed content rows (e.g., "Trending Now", "Family Favorites") |
| `category_movies` | Many-to-many junction between categories and movies               |
| `watchlist`       | Per-profile watchlist entries                                     |

**Age Ratings:** `G`, `PG`, `PG-13`, `Family`

**Subscription Statuses:** `trial`, `active`, `canceled`, `expired`

---

## Environment Variables

| Variable         | Description                   | Default |
| ---------------- | ----------------------------- | ------- |
| `PORT`           | Backend server port           | `3000`  |
| `DATABASE_URL`   | PostgreSQL connection string  | —       |
| `JWT_SECRET`     | Secret key for JWT signing    | —       |
| `JWT_EXPIRES_IN` | JWT token expiration duration | `7d`    |

> ⚠️ The `.env` file is git-ignored. Create your own `apps/backend/.env` using the template above.

---

## Scripts

Run all scripts from the **project root**:

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev:backend`  | Start the backend dev server (with hot reload) |
| `npm run dev:frontend` | Start the Expo dev server                      |
| `npm run db:migrate`   | Run database migrations                        |
| `npm run db:seed`      | Seed the database with sample data             |

---

## License

This project is public for educational purposes.
