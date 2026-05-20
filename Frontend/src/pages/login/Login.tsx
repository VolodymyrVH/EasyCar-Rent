import { useState } from 'react';
import { Logo } from '../../components/Logo';
import '../register/Register.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Ви увійшли!');
        localStorage.setItem('token', data.access_token);
      } else {
        alert('Помилка: ' + data.detail);
      }
    } catch (err) {
      console.error(err);
      alert('Error');
    }
  };

  return (
    <>
      <header><Logo /></header>
      <main>
        <div className="form-card">
          <h1 className="form-title">Вхід в аккаунт</h1>
          <form className="form-grid" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Пароль*" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submit-btn">Увійти</button>
          </form>
        </div>
      </main>
    </>
  );
};