# Project Context

- Tech stack: React Native (Expo)
- API: https://dummyjson.com/products
- Target devices: Low-end mobile devices (1–2GB RAM)
- Goal: Build a fast, lightweight product listing app
- Style: Clean, minimal UI with focus on performance and caching

# Core Requirements

- Optimize for low memory usage
- Avoid unnecessary re-renders
- Implement caching for API data
- Use pagination or lazy loading (no large data loads at once)

# Architecture

- Use feature-based folder structure
- Separate UI, hooks, and state management
- Keep components small and reusable

# Rules

- Use functional components only
- Use React hooks only
- Avoid class components

# Packages

- tailwind (nativewind for React Native styling)
- axios (API requests)
- @tanstack/react-query (data fetching & caching)
- zustand (state management)

# Coding Guidelines

- Use FlatList for rendering lists (optimized for performance)
- Memoize components when needed (React.memo)
- Use useCallback and useMemo to prevent unnecessary renders
- Avoid inline functions in render when possible
- Handle loading and error states properly

# Features (MVP)

1. Product list screen
2. Product detail screen
3. Search functionality
4. Cached API data (React Query)
5. Basic offline support (cached data fallback)
