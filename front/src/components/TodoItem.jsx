import { useState } from 'react'
import '../styles/TodoItem.css'

function TodoItem({ todo, onToggle, onEdit, onDelete, isEditing, onUpdate, onCancelEdit }) {
  const [name, setName] = useState(todo.name)
  const [dueDate, setDueDate] = useState(todo.due_date || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('TODO名を入力してください')
      return
    }
    onUpdate({ name: name.trim(), due_date: dueDate || null })
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
        <div className="edit-actions">
          <button type="submit" className="save-button">保存</button>
          <button type="button" onClick={onCancelEdit} className="cancel-button">キャンセル</button>
        </div>
      </form>
    )
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />
      <div className="todo-content">
        <h3 className="todo-name">{todo.name}</h3>
        {todo.due_date && (
          <span className="todo-date">期限: {todo.due_date}</span>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={onEdit} className="edit-button">編集</button>
        <button onClick={onDelete} className="delete-button">削除</button>
      </div>
    </div>
  )
}

export default TodoItem
