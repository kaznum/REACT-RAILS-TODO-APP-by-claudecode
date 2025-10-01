import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoItem from '../TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    name: 'Test TODO',
    due_date: '2025-12-31',
    completed: false
  }

  const mockHandlers = {
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
    onCancelEdit: vi.fn()
  }

  it('TODOの名前と期限を表示する', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} isEditing={false} />)

    expect(screen.getByText('Test TODO')).toBeInTheDocument()
    expect(screen.getByText('期限: 2025-12-31')).toBeInTheDocument()
  })

  it('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} isEditing={false} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1)
  })

  it('編集ボタンをクリックするとonEditが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} isEditing={false} />)

    const editButton = screen.getByText('編集')
    fireEvent.click(editButton)

    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1)
  })

  it('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} isEditing={false} />)

    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1)
  })

  it('編集モードでは入力フィールドが表示される', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} isEditing={true} />)

    expect(screen.getByDisplayValue('Test TODO')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2025-12-31')).toBeInTheDocument()
  })

  it('完了済みのTODOにはcompletedクラスが付与される', () => {
    const completedTodo = { ...mockTodo, completed: true }
    const { container } = render(<TodoItem todo={completedTodo} {...mockHandlers} isEditing={false} />)

    const todoItem = container.querySelector('.todo-item')
    expect(todoItem).toHaveClass('completed')
  })
})
