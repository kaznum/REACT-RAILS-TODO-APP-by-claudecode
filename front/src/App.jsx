import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Todos from './pages/Todos'
import Manual from './pages/Manual'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/manual" element={<Manual />} />
    </Routes>
  )
}

export default App
