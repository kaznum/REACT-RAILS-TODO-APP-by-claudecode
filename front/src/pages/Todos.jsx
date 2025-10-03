import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import { removeToken } from '../utils/auth'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import '../styles/Todos.scss'

function Todos() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState(null)
  const [priorityFilter, setPriorityFilter] = useState('')

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/check')
      setUser(response.data.user)
    } catch (error) {
      navigate('/login')
    }
  }, [navigate])

  const fetchTodos = useCallback(async () => {
    try {
      const response = await apiClient.get('/todos')
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
      await apiClient.delete('/auth/logout')
      removeToken()
      navigate('/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const handleAddTodo = async (todo) => {
    try {
      await apiClient.post('/todos', { todo })
      await fetchTodos()
    } catch (error) {
      console.error('TODO追加エラー:', error)
      alert('TODOの追加に失敗しました')
    }
  }

  const handleUpdateTodo = async (id, updates) => {
    try {
      await apiClient.put(`/todos/${id}`, { todo: updates })
      await fetchTodos()
      setEditingTodo(null)
    } catch (error) {
      console.error('TODO更新エラー:', error)
      alert('TODOの更新に失敗しました')
    }
  }

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('このTODOを削除してもよろしいですか？')) return

    try {
      await apiClient.delete(`/todos/${id}`)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('TODO削除エラー:', error)
      alert('TODOの削除に失敗しました')
    }
  }

  const handleToggleComplete = async (todo) => {
    handleUpdateTodo(todo.id, { completed: !todo.completed })
  }

  const filteredTodos = priorityFilter === ''
    ? todos
    : todos.filter(todo => todo.priority === parseInt(priorityFilter))

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
            <Link to="/manual" className="manual-link">📖 使い方</Link>
          </div>
        )}
      </div>

      <TodoForm onSubmit={handleAddTodo} />

      <div className="filter-container">
        <label htmlFor="priority-filter">優先度で絞り込み:</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="priority-filter"
        >
          <option value="">選択なし</option>
          <option value="2">高</option>
          <option value="1">中</option>
          <option value="0">低</option>
        </select>
      </div>

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <p className="no-todos">TODOがありません</p>
        ) : (
          filteredTodos.map(todo => (
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
