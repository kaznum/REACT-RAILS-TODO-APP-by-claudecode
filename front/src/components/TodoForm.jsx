import { useState } from 'react'
import '../styles/TodoForm.scss'

function TodoForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('TODO名を入力してください')
      return
    }
    onSubmit({
      name: name.trim(),
      due_date: dueDate || null,
      completed: false,
      priority: parseInt(priority)
    })
    setName('')
    setDueDate('')
    setPriority(1)
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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
      >
        <option value={2}>高</option>
        <option value={1}>中</option>
        <option value={0}>低</option>
      </select>
      <button type="submit" className="add-button">追加</button>
    </form>
  )
}

export default TodoForm
