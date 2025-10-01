import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoForm from '../TodoForm'

describe('TodoForm', () => {
  it('TODO名と期限を入力できる', () => {
    const onSubmit = vi.fn()
    const { container } = render(<TodoForm onSubmit={onSubmit} />)

    const nameInput = screen.getByPlaceholderText('新しいTODOを入力')
    const dateInput = container.querySelector('input[type="date"]')

    fireEvent.change(nameInput, { target: { value: '新しいTODO' } })
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } })

    expect(nameInput.value).toBe('新しいTODO')
    expect(dateInput.value).toBe('2025-12-31')
  })

  it('フォームを送信するとonSubmitが呼ばれる', () => {
    const onSubmit = vi.fn()
    render(<TodoForm onSubmit={onSubmit} />)

    const nameInput = screen.getByPlaceholderText('新しいTODOを入力')
    const submitButton = screen.getByText('追加')

    fireEvent.change(nameInput, { target: { value: '新しいTODO' } })
    fireEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({
      name: '新しいTODO',
      due_date: null,
      completed: false
    })
  })

  it('送信後、フォームがクリアされる', () => {
    const onSubmit = vi.fn()
    const { container } = render(<TodoForm onSubmit={onSubmit} />)

    const nameInput = screen.getByPlaceholderText('新しいTODOを入力')
    const dateInput = container.querySelector('input[type="date"]')
    const submitButton = screen.getByText('追加')

    fireEvent.change(nameInput, { target: { value: '新しいTODO' } })
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } })
    fireEvent.click(submitButton)

    expect(nameInput.value).toBe('')
    expect(dateInput.value).toBe('')
  })

  it('TODO名が空の場合はアラートが表示される', () => {
    const onSubmit = vi.fn()
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const { container } = render(<TodoForm onSubmit={onSubmit} />)

    const form = container.querySelector('form')
    const nameInput = screen.getByPlaceholderText('新しいTODOを入力')

    // required属性を一時的に削除してJSバリデーションをテスト
    nameInput.removeAttribute('required')
    fireEvent.submit(form)

    expect(alertMock).toHaveBeenCalledWith('TODO名を入力してください')
    expect(onSubmit).not.toHaveBeenCalled()

    alertMock.mockRestore()
  })
})
