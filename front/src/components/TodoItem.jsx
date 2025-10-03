import { useState } from 'react'
import '../styles/TodoItem.scss'

function TodoItem({ todo, onToggle, onEdit, onDelete, isEditing, onUpdate, onCancelEdit }) {
  const [name, setName] = useState(todo.name)
  const [dueDate, setDueDate] = useState(todo.due_date || '')
  const [priority, setPriority] = useState(todo.priority ?? 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('TODO名を入力してください')
      return
    }
    onUpdate({ name: name.trim(), due_date: dueDate || null, priority: parseInt(priority) })
  }

  const getPriorityLabel = (priorityValue) => {
    switch (priorityValue) {
      case 2: return '高'
      case 1: return '中'
      case 0: return '低'
      default: return '中'
    }
  }

  const getPriorityClass = (priorityValue) => {
    switch (priorityValue) {
      case 2: return 'priority-high'
      case 1: return 'priority-medium'
      case 0: return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    return due < today
  }

  if (isEditing) {
    return (
      <form className="todo-item editing" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="edit-input"
          maxLength={255}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="edit-date"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="edit-priority"
        >
          <option value={2}>高</option>
          <option value={1}>中</option>
          <option value={0}>低</option>
        </select>
        <div className="edit-actions">
          <button type="submit" className="save-button">保存</button>
          <button type="button" onClick={onCancelEdit} className="cancel-button">キャンセル</button>
        </div>
      </form>
    )
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${getPriorityClass(todo.priority)}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />
      <div className="todo-content">
        <h3 className="todo-name">{todo.name}</h3>
        <div className="todo-meta">
          <span className="todo-priority">優先度: {getPriorityLabel(todo.priority)}</span>
          {todo.due_date && (
            <span className={`todo-date ${isOverdue(todo.due_date, todo.completed) ? 'overdue' : ''}`}>
              期限: {todo.due_date}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={onEdit} className="edit-button">編集</button>
        <button onClick={onDelete} className="delete-button">削除</button>
      </div>
    </div>
  )
}

export default TodoItem
