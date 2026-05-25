import { useState, useEffect } from 'react';
import "../BookingModal/BookingModal.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  currentData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    license_series: string;
    license_number: string;
  };
  onUpdateSuccess: () => void;
}

export const EditProfileModal = ({ isOpen, onClose, userId, currentData, onUpdateSuccess }: EditProfileModalProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseSeries, setLicenseSeries] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFirstName(currentData.first_name);
      setLastName(currentData.last_name);
      setEmail(currentData.email);
      setPhoneNumber(currentData.phone_number);
      setLicenseSeries(currentData.license_series);
      setLicenseNumber(currentData.license_number);
    }
  }, [isOpen, currentData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Сесія закінчилася. Будь ласка, увійдіть знову.');
      return;
    }

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      license_series: licenseSeries,
      license_number: licenseNumber
    };

    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Дані профілю успішно оновлено!');
        onUpdateSuccess();
        onClose();
      } else {
        alert('Помилка оновлення: ' + (data.detail || 'Не вдалося зберегти дані.'));
      }
    } catch (err) {
      console.error(err);
      alert('Помилка зв’язку з сервером');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-clean" style={{ height: 'auto', minHeight: '440px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-x" onClick={onClose} aria-label="Закрити">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h2>Редагувати профіль</h2>
        
        <form onSubmit={handleSubmit} className="modal-form-layout">
          
          <div className="modal-time-row">
            <div className="input-field-group">
              <span className="modal-field-label">Ім'я</span>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            <div className="input-field-group">
              <span className="modal-field-label">Прізвище</span>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <span className="modal-field-label">Електронна пошта</span>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-field-group">
            <span className="modal-field-label">Номер телефону</span>
            <input 
              type="text" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required 
            />
          </div>

          <div className="modal-time-row">
            <div className="input-field-group">
              <span className="modal-field-label">Серія прав</span>
              <input 
                type="text" 
                maxLength={3}
                value={licenseSeries}
                onChange={(e) => setLicenseSeries(e.target.value)}
                required 
              />
            </div>
            <div className="input-field-group">
              <span className="modal-field-label">Номер прав</span>
              <input 
                type="text" 
                maxLength={6}
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="modal-submit-action-btn" style={{ marginTop: '15px' }}>
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};