import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Todos from '../Todos'
import apiClient from '../../api/client'

vi.mock('../../api/client')
vi.mock('../../utils/auth', () => ({
  removeToken: vi.fn()
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Todos', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  }

  const mockTodos = [
    {
      id: 1,
      name: 'TODO 1',
      due_date: '2025-12-31',
      completed: false
    },
    {
      id: 2,
      name: 'TODO 2',
      due_date: null,
      completed: true
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    apiClient.get.mockImplementation((url) => {
      if (url === '/auth/check') {
        return Promise.resolve({ data: { user: mockUser } })
      }
      if (url === '/todos') {
        return Promise.resolve({ data: mockTodos })
      }
    })
  })

  it('認証チェックとTODO一覧を表示する', async () => {
    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('TODO 1')).toBeInTheDocument()
      expect(screen.getByText('TODO 2')).toBeInTheDocument()
    })

    expect(apiClient.get).toHaveBeenCalledWith('/auth/check')
    expect(apiClient.get).toHaveBeenCalledWith('/todos')
  })

  it('認証失敗時はログインページにリダイレクトする', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url === '/auth/check') {
        return Promise.reject(new Error('Unauthorized'))
      }
      if (url === '/todos') {
        return Promise.resolve({ data: [] })
      }
    })

    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('TODOが0件の場合は「TODOがありません」と表示される', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url === '/auth/check') {
        return Promise.resolve({ data: { user: mockUser } })
      }
      if (url === '/todos') {
        return Promise.resolve({ data: [] })
      }
    })

    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
  })

  it('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
    apiClient.delete.mockResolvedValue({})

    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const logoutButton = screen.getByText('ログアウト')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/auth/logout')
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('TODO削除時に確認ダイアログが表示される', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    apiClient.delete.mockResolvedValue({})

    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('TODO 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0])

    expect(confirmSpy).toHaveBeenCalledWith('このTODOを削除してもよろしいですか？')
    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/todos/1')
    })

    confirmSpy.mockRestore()
  })

  it('TODO削除をキャンセルした場合は削除されない', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <BrowserRouter>
        <Todos />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('TODO 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0])

    expect(confirmSpy).toHaveBeenCalled()
    expect(apiClient.delete).not.toHaveBeenCalledWith('/todos/1')

    confirmSpy.mockRestore()
  })
})
