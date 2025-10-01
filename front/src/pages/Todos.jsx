import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import '../styles/Todos.css'

const API_URL = 'http://localhost:3000/api'

function Todos() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState(null)

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check`, { withCredentials: true })
      setUser(response.data.user)
    } catch (error) {
      navigate('/login')
    }
  }, [navigate])

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, { withCredentials: true })
      setTodos(response.data)
      setLoading(false)
    } catch (error) {
      console.error('TODO取得エラー:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
    fetchTodos()
  }, [checkAuth, fetchTodos])

  const handleLogout = async () => {
    try {
      await axios.delete(`${API_URL}/auth/logout`, { withCredentials: true })
      navigate('/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const handleAddTodo = async (todo) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, { todo }, { withCredentials: true })
      setTodos([...todos, response.data])
    } catch (error) {
      console.error('TODO追加エラー:', error)
      alert('TODOの追加に失敗しました')
    }
  }

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, { todo: updates }, { withCredentials: true })
      setTodos(todos.map(t => t.id === id ? response.data : t))
      setEditingTodo(null)
    } catch (error) {
      console.error('TODO更新エラー:', error)
      alert('TODOの更新に失敗しました')
    }
  }

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('このTODOを削除してもよろしいですか？')) return

    try {
      await axios.delete(`${API_URL}/todos/${id}`, { withCredentials: true })
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('TODO削除エラー:', error)
      alert('TODOの削除に失敗しました')
    }
  }

  const handleToggleComplete = async (todo) => {
    handleUpdateTodo(todo.id, { completed: !todo.completed })
  }

  if (loading) {
    return <div className="loading">読み込み中...</div>
  }

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h1>TODO リスト</h1>
        {user && (
          <div className="user-info">
            <span>{user.name}</span>
            <button onClick={handleLogout} className="logout-button">ログアウト</button>
          </div>
        )}
      </div>

      <TodoForm onSubmit={handleAddTodo} />

      <div className="todos-list">
        {todos.length === 0 ? (
          <p className="no-todos">TODOがありません</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggleComplete(todo)}
              onEdit={() => setEditingTodo(todo)}
              onDelete={() => handleDeleteTodo(todo.id)}
              isEditing={editingTodo?.id === todo.id}
              onUpdate={(updates) => handleUpdateTodo(todo.id, updates)}
              onCancelEdit={() => setEditingTodo(null)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Todos
