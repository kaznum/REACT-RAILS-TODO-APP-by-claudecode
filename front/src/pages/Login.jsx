import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    // セッションチェック
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/check', {
          credentials: 'include'
        })
        if (response.ok) {
          navigate('/todos')
        }
      } catch (error) {
        console.error('セッションチェックエラー:', error)
      }
    }
    checkSession()
  }, [navigate])

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
