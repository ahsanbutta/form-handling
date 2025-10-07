import './App.css'
import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/login'
import Signup from './components/signup'
import Profile from './components/Profile'

function App() {
  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </div>
  )
}

export default App
