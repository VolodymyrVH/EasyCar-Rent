import { Logo } from '../components/Logo';

export const Register = () => {
  return (
    <>
      <header>
        <Logo />
      </header>
      <main>
        <div className="form-card">
          <h1 className="form-title">Створення аккаунту</h1>
          <form className="form-grid">
            <input type="text" placeholder="Ім'я*" />
            <input type="text" placeholder="Прізвище*" />
            <input type="tel" placeholder="Номер телефону*" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Пароль*" />
            
            <div className="input-row">
              <input type="text" placeholder="Серія*" />
              <input type="text" placeholder="Номер*" />
            </div>

            <button type="submit" className="submit-btn">
              Реєстрація
            </button>
          </form>
        </div>
      </main>
    </>
  );
};