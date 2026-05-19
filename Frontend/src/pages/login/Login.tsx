import { Logo } from '../../components/Logo';
import './Login.css';

export const Login = () => {
  return (
    <>
      <header>
        <Logo />
      </header>
      <main>
        <div className="form-card">
          <h1 className="form-title">Увійти</h1>
          <form className="form-grid">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Пароль*" required />
            
            <div className="form-actions">
              <a href="/forgot-password" className="forgot-link">Забули пароль?</a>
            </div>

            <button type="submit" className="submit-btn">
              Увійти
            </button>
          </form>
          
          <div className="form-footer">
            <p>Немає акаунту? <a href="/register">Зареєструватися</a></p>
          </div>
        </div>
      </main>
    </>
  );
};