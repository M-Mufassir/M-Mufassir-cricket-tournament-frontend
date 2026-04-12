# M-Mufassir-cricket-tournament-frontend

Frontend application for the cricket tournament registration system built with React, Vite, Tailwind CSS, and React Router.

## Stack

- React
- Vite
- Tailwind CSS
- React Router DOM

## Features Included

- Public tournament details page
- Registration instructions page
- Team registration form
- Payment receipt upload integration
- Public approved teams page
- Admin login page
- Admin dashboard page
- Team approve, reject, edit, and delete actions

## Routes

- `/`
- `/instructions`
- `/register`
- `/teams`
- `/admin/login`
- `/admin/dashboard`

## Environment Variable

Copy `.env.example` to `.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Install and Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    admin/
    common/
    forms/
    layout/
  hooks/
  pages/
  services/
  utils/
```

## API Integration

The frontend expects the backend API to be running and reachable through:

- `VITE_API_BASE_URL`

Default local value:

- `http://localhost:5000/api`

## Admin Login

Use the backend seed admin account:

- Email: `admin@cricketapp.com`
- Password: `Admin@12345`

## Notes

- Admin authentication is stored in `localStorage`
- Public pages fetch the active public tournament from the backend
- Team registration sends `multipart/form-data` so receipt uploads work correctly
