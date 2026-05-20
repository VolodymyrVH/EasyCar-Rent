import { useState } from 'react';
import { Logo } from '../../components/Logo';
import './Register.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone_number: '',
    email: '', password: '', license_series: '',
    license_number: '', dob: '2000-01-01'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Реєстрація успішна!');
      } else {
        const error = await response.json();
        alert('Помилка: ' + JSON.stringify(error.detail));
      }
    } catch {
      alert('Помилка зв’язку з сервером');
    }
  };

  return (
    <>
      <header><Logo /></header>
      <main>
        <div className="form-card">
          <h1 className="form-title">Створення аккаунту</h1>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input type="text" placeholder="Ім'я*" onChange={e => setFormData({...formData, first_name: e.target.value})} />
            <input type="text" placeholder="Прізвище*" onChange={e => setFormData({...formData, last_name: e.target.value})} />
            <input type="tel" placeholder="Номер телефону*" onChange={e => setFormData({...formData, phone_number: e.target.value})} />
            <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Пароль*" onChange={e => setFormData({...formData, password: e.target.value})} />
            <div className="input-row">
              <input type="text" placeholder="Серія*" onChange={e => setFormData({...formData, license_series: e.target.value})} />
              <input type="text" placeholder="Номер*" onChange={e => setFormData({...formData, license_number: e.target.value})} />
            </div>
            <button type="submit" className="submit-btn">Реєстрація</button>
          </form>
        </div>
      </main>
    </>
  );
};