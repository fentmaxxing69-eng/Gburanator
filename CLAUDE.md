# Gburanator Development Guide

This document provides context and guidelines for continuing the development of the Gburanator slot machine project.

## 🎰 Project Overview
Gburanator is a customizable 5x3 slot machine application. It allows an administrator to manage the site's visual theme and game parameters (like symbol values) globally via a cloud-based configuration.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Persistence**: JSONBin.io (used as a lightweight cloud config store)
- **Hosting**: Vercel (SPA deployment)

## 🏗 Architecture & Key Logic

### 1. Global Theme Sync (`useTheme.ts`)
Instead of a traditional database, the app uses **JSONBin.io**. 
- The `useTheme` hook fetches the current theme object (background image and symbol configurations) on load.
- It provides an `updateTheme` function that merges partial updates and performs a `PUT` request to the cloud store.

### 2. Admin Panel (`AdminPanel.tsx`)
Accessed via the secret path `/cwel`.
- **Background Editor**: Allows changing the main site background URL.
- **Symbol Editor**: A table-based interface to edit the `image` URL and `value` (payout) for every slot symbol.

### 3. Betting System (`Controls.tsx`)
- Features "MIN" and "MAX" shortcuts.
- Implements a "click-to-edit" input for the bet amount.
- **Validation**: Bets must be strictly whole numbers (`Number.isInteger`) and stay within the range of `minBet` (from theme) and the current `balance`.

### 4. Routing & Deployment
- **SPA Routing**: Since this is a Single Page Application, `vercel.json` is configured to rewrite all requests to `index.html` to prevent 404s on refresh/direct access to `/cwel`.
- **Environment Variables**: Requires `VITE_JSONBIN_API_KEY` and `VITE_JSONBIN_BIN_ID` in the `.env` file and Vercel dashboard.

## 📂 Key File Map
- `src/hooks/useTheme.ts`: The core "brain" for cloud synchronization.
- `src/components/AdminPanel.tsx`: The UI for all administrative changes.
- `src/components/Controls.tsx`: The betting interface and validation logic.
- `src/App.tsx`: Entry point and simple routing for the admin view.
- `src/types/index.ts`: Global TypeScript interfaces (`Theme`, `SymbolConfig`).
- `vercel.json`: Vercel deployment routing configuration.

## 🚀 Development Workflow
1. **Local Dev**: `npm install` $\rightarrow$ `npm run dev`.
2. **Testing**: Verify changes in the browser.
3. **Deploy**: Push changes to the `main` branch on GitHub $\rightarrow$ Vercel auto-deploys.

## 📝 Guidelines for Claude
- **Type Safety**: Always update `src/types/index.ts` before adding new theme properties.
- **Validation**: Use `Number.isInteger()` for any currency or bet-related inputs to avoid floating-point errors.
- **UX**: Maintain the "High-Stakes/Casino" aesthetic (Bold fonts, Yellow/Gold colors, italicized headers).
- **Admin Security**: Keep the `/cwel` path as the primary way to access admin tools; do not add public links to it.
