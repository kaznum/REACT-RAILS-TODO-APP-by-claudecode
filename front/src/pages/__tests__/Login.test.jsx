import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'
import * as auth from '../../utils/auth'

vi.mock('../../utils/auth', () => ({
  isAuthenticated: vi.fn(),
  setToken: vi.fn()
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' })
  }
})

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.isAuthenticated.mockReturnValue(false)
    delete window.location
    window.location = { href: '' }
  })

  it('ログインページのタイトルとボタンが表示される', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByText('TODO管理アプリ')).toBeInTheDocument()
    expect(screen.getByText('Googleアカウントでログイン')).toBeInTheDocument()
    expect(screen.getByText('Googleでログイン')).toBeInTheDocument()
  })

  it('既に認証済みの場合はTODOページにリダイレクトする', () => {
    auth.isAuthenticated.mockReturnValue(true)

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/todos')
  })

  it('Googleログインボタンをクリックすると認証URLにリダイレクトする', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const loginButton = screen.getByText('Googleでログイン')
    fireEvent.click(loginButton)

    expect(window.location.href).toBe('http://localhost:3000/auth/google_oauth2')
  })

  it('クエリパラメータにトークンがある場合はトークンを保存してTODOページにリダイレクトする', () => {
    // useLocationのモックを上書き
    const mockUseLocationWithToken = vi.fn(() => ({ search: '?token=test-jwt-token' }))

    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: mockUseLocationWithToken
      }
    })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(auth.setToken).toHaveBeenCalledWith('test-jwt-token')
    expect(mockNavigate).toHaveBeenCalledWith('/todos')
  })
})
