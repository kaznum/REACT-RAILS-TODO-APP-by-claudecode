import { useState } from 'react'
import '../styles/TodoForm.css'

function TodoForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('TODO名を入力してください')
      return
    }
    onSubmit({
      name: name.trim(),
      due_date: dueDate || null,
      completed: false
    })
    setName('')
    setDueDate('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="新しいTODOを入力"
        className="todo-input"
        maxLength={255}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="date-input"
      />
      <button type="submit" className="add-button">追加</button>
    </form>
  )
}

export default TodoForm
