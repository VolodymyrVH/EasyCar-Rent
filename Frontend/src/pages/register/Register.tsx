import { useState } from 'react';
import { Logo } from '../../components/Logo';
import './Register.css';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export const Register = ({ onRegisterSuccess }: RegisterProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    license_series: '',
    license_number: '',
    dob: '2000-01-01'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (formData.phone_number.length < 10) {
      alert('Номер телефону має містити не менше 10 символів');
      return;
    }

    
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      alert('Реєстрація дозволена тільки особам від 18 років');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        onRegisterSuccess();
      } else {
        
        const errorDetail = Array.isArray(data.detail) 
          ? data.detail.map((d: any) => d.msg).join(', ') 
          : data.detail;
        alert('Помилка реєстрації: ' + (errorDetail || 'Перевірте введені дані'));
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
            <input 
              type="text" 
              placeholder="Ім'я*" 
              value={formData.first_name}
              onChange={e => setFormData({...formData, first_name: e.target.value})} 
              required
            />
            <input 
              type="text" 
              placeholder="Прізвище*" 
              value={formData.last_name}
              onChange={e => setFormData({...formData, last_name: e.target.value})} 
              required
            />
            <input 
              type="tel" 
              placeholder="Номер телефону* (напр. 0991234567)" 
              value={formData.phone_number}
              onChange={e => setFormData({...formData, phone_number: e.target.value})} 
              required
            />
            <input 
              type="email" 
              placeholder="Email*" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required
            />
            <input 
              type="password" 
              placeholder="Пароль* (мін. 8 символів)" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required
            />
            
            
            <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', color: '#666', textAlign: 'left' }}>Дата народження*</label>
              <input 
                type="date" 
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})} 
                required
              />
            </div>

            <div className="input-row">
              <input 
                type="text" 
                placeholder="Серія прав*" 
                maxLength={3}
                value={formData.license_series}
                onChange={e => setFormData({...formData, license_series: e.target.value})} 
                required
              />
              <input 
                type="text" 
                placeholder="Номер прав*" 
                maxLength={6}
                value={formData.license_number}
                onChange={e => setFormData({...formData, license_number: e.target.value})} 
                required
              />
            </div>
            <button type="submit" className="submit-btn">Реєстрація</button>
          </form>
        </div>
      </main>
    </>
  );
};