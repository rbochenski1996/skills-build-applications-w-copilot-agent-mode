# OctoFit Tracker frontend

React 19 + Vite + react-router-dom + Bootstrap. Dev server runs on port 5173.

## API configuration

The API base URL is built in `src/api.js` from `import.meta.env.VITE_CODESPACE_NAME`:

- Set: `https://$VITE_CODESPACE_NAME-8000.app.github.dev`
- Unset: `http://localhost:8000`

In Codespaces, `VITE_CODESPACE_NAME` must be defined, for example in `.env.local` (git-ignored):

```bash
echo "VITE_CODESPACE_NAME=$CODESPACE_NAME" > octofit-tracker/frontend/.env.local
```

Restart the dev server after changing it. Port 8000 must be public for the browser to reach the API.

The app reads `/api/activities/`, `/api/leaderboard/`, `/api/teams/`, `/api/users/` and `/api/workouts/`, accepting either plain arrays or paginated `{ results: [...] }` responses.

## Scripts

- `npm run dev` – start Vite
- `npm run build` – production build
