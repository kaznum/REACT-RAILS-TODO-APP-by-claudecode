import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Todos from './pages/Todos'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<Todos />} />
    </Routes>
  )
}

export default App
