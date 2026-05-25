import { useState, useEffect } from 'react';
import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
  carId: number;
  pricePerDay: number;
}

export const BookingModal = ({ isOpen, onClose, carName, carId, pricePerDay }: BookingModalProps) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [daysCount, setDaysCount] = useState<number>(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end > start) {
        const differenceInTime = end.getTime() - start.getTime();
        const days = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        setDaysCount(days);

        let discountMultiplier = 1;
        if (days >= 4 && days <= 9) {
          discountMultiplier = 0.9;
        } else if (days >= 10) {
          discountMultiplier = 0.7;
        }

        const calculated = days * pricePerDay * discountMultiplier;
        setTotalPrice(Math.round(calculated));
      } else {
        setDaysCount(0);
        setTotalPrice(0);
      }
    } else {
      setDaysCount(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, pricePerDay]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Будь ласка, увійдіть в аккаунт, щоб забронювати автомобіль.');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert('Час повернення має бути пізнішим за час подачі автомобіля');
      return;
    }

    const bookingData = {
      car_id: carId,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      pickup_address: pickupAddress,
      return_address: returnAddress
    };

    try {
      
      const rentalResponse = await fetch('http://localhost:8000/rentals/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const rentalData = await rentalResponse.json();

      if (rentalResponse.ok) {
        const paymentData = {
          rental_id: rentalData.id,              
          payment_type: "PAYMENT",                 
          payment_method_id: 1,                  
          amount: rentalData.price_sum          
        };

        try {
          const paymentResponse = await fetch('http://localhost:8000/payments/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
          });

          if (paymentResponse.ok) {
            alert(`Успіх! Автомобіль ${carName} заброньовано, рахунок на суму ${rentalData.price_sum} ₴ виставлено.`);
          } else {
            alert(`Оренда створена, але виникла помилка реєстрації рахунку.`);
          }
        } catch {
          console.error("Помилка фінансового запиту до бекенду");
        }

        
        setPickupAddress('');
        setReturnAddress('');
        setStartDate('');
        setEndDate('');
        onClose();
      } else {
        alert('Помилка бронювання: ' + (rentalData.detail || 'Не вдалося створити оренду.'));
      }
    } catch (err) {
      console.error(err);
      alert('Помилка зв’язку з сервером');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-clean" style={{ height: 'auto', minHeight: '385px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-x" onClick={onClose} aria-label="Закрити">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h2>Оберіть дати для {carName}</h2>
        
        <form onSubmit={handleSubmit} className="modal-form-layout">
          
          <div className="input-field-group">
            <span className="modal-field-label">Адреса подачі</span>
            <input 
              type="text" 
              placeholder="Введіть адресу подачі" 
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required 
            />
          </div>

          <div className="input-field-group">
            <span className="modal-field-label">Адреса повернення</span>
            <input 
              type="text" 
              placeholder="Введіть адресу повернення" 
              value={returnAddress}
              onChange={(e) => setReturnAddress(e.target.value)}
              required 
            />
          </div>

          <div className="modal-time-row">
            <div className="input-field-group">
              <span className="modal-field-label">Час подачі</span>
              <input 
                type="datetime-local" 
                step="900"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-field-group">
              <span className="modal-field-label">Час повернення</span>
              <input 
                type="datetime-local" 
                step="900"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required 
              />
            </div>
          </div>

          {daysCount > 0 && (
            <div style={{
              background: '#F3F4F6',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              fontFamily: 'sans-serif'
            }}>
              <span style={{ fontSize: '14px', color: '#4B5563' }}>
                Період оренди: <strong>{daysCount} {daysCount === 1 ? 'доба' : daysCount < 5 ? 'доби' : 'діб'}</strong>
              </span>
              <span style={{ fontSize: '16px', color: '#111827', fontWeight: 700 }}>
                Попередня вартість: <span style={{ color: '#5BA3FF' }}>{totalPrice} ₴</span>
              </span>
            </div>
          )}

          <button type="submit" className="modal-submit-action-btn">
            Залишити заявку
          </button>
        </form>
      </div>
    </div>
  );
};