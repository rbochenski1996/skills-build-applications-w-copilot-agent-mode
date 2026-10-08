import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from './assets/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

const links = [
  ['activities', 'Activities'],
  ['leaderboard', 'Leaderboard'],
  ['teams', 'Teams'],
  ['users', 'Users'],
  ['workouts', 'Workouts'],
]

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} alt="OctoFit Tracker logo" height="32" />
            OctoFit Tracker
          </NavLink>
          <ul className="navbar-nav flex-row gap-3">
            {links.map(([path, label]) => (
              <li className="nav-item" key={path}>
                <NavLink className="nav-link" to={`/${path}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="activities" element={<Activities />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="teams" element={<Teams />} />
          <Route path="users" element={<Users />} />
          <Route path="workouts" element={<Workouts />} />
        </Routes>
      </main>
    </>
  )
}
