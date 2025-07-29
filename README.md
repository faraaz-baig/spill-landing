# Spill Landing Page

A minimalist landing page for Spill - a distraction-free writing app. Built with SolidJS and powered by Bun.js for fast development and builds.

## Features

- 📧 Email collection with Supabase integration
- 📱 Mobile-responsive design with device detection
- 🎨 Clean, minimalist UI
- ⚡ Fast builds with Bun.js
- 🔒 Secure email storage with Row Level Security

## Prerequisites

- [Bun.js](https://bun.sh) (latest version)
- A Supabase account and project

## Setup

1. **Clone and install dependencies:**
   ```bash
   bun install
   ```

2. **Configure Supabase:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in the `.env` file. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## Available Scripts

### `bun run dev`

Runs the app in development mode.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.

### `bun run build`

Builds the app for production to the `dist` folder.<br>
Optimizes the build for the best performance with minification and hashed filenames.

### `bun run serve`

Serves the production build locally for testing.

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.module.css   # Component styles
├── supabase.ts      # Database integration
└── index.tsx        # Application entry point
```

## Deployment

You can deploy the `dist` folder to any static host provider:
- Vercel
- Netlify
- Surge
- GitHub Pages

## Built With

- [SolidJS](https://solidjs.com) - Reactive UI framework
- [Bun.js](https://bun.sh) - Fast JavaScript runtime and package manager
- [Supabase](https://supabase.com) - Backend as a Service
- [Vite](https://vitejs.dev) - Build tool
