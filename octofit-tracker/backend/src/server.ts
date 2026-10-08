import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models/index.js';
import { crudRouter } from './routes/crud.js';

const PORT = 8000;
const codespaceName = process.env.CODESPACE_NAME;
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/', (_req, res) => {
  const link = (p: string) => `${baseUrl}/api/${p}/`;
  res.json({
    users: link('users'),
    teams: link('teams'),
    activities: link('activities'),
    leaderboard: link('leaderboard'),
    workouts: link('workouts'),
  });
});

app.use('/api/users', crudRouter(User, ['name', 'email', 'team']));
app.use('/api/teams', crudRouter(Team, ['name', 'description']));
app.use('/api/activities', crudRouter(Activity, ['user', 'type', 'durationMinutes', 'calories', 'date']));
app.use('/api/leaderboard', crudRouter(Leaderboard, ['user', 'team', 'points']));
app.use('/api/workouts', crudRouter(Workout, ['name', 'description', 'difficulty', 'durationMinutes']));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    err.code === 11000 ? 409 : err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => console.log(`API listening at ${baseUrl}/api/`));
