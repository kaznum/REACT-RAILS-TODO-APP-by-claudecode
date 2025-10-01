import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, setToken } from '../utils/auth'
import '../styles/Login.scss'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // トークンチェック
    if (isAuthenticated()) {
      navigate('/todos')
      return
    }

    // OAuthコールバックからのトークン処理
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      setToken(token)
      navigate('/todos')
    }
  }, [navigate, location])

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google_oauth2'
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">TODO管理アプリ</h1>
        <p className="login-subtitle">Googleアカウントでログイン</p>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <span className="google-icon">G</span>
          Googleでログイン
        </button>
      </div>
    </div>
  )
}

export default Login
