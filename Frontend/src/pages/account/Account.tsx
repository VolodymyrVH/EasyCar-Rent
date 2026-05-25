import { useState, useEffect } from 'react';
import './Account.css';

import accountIcon from '../../assets/account/account.png';
import rentalsIcon from '../../assets/account/rentals.png';
import logoutIcon from '../../assets/account/logout.png';
import { EditProfileModal } from '../../components/EditProfileModal/EditProfileModal';

interface AccountProps {
  onGoToCatalog: () => void;
}

interface BackendBooking {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  returned_at: string | null;
  price_per_day: number;
  price_sum: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  pickup_location_id: number;
  return_location_id: number;
}

export const Account = ({ onGoToCatalog }: AccountProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userId, setUserId] = useState<number>(0);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

  const defaultUser = {
    first_name: "test",
    last_name: "test",
    email: "test@gmail.com",
    phone: "+48517120560",
    license: "BXH222222",
    role: "Новий клієнт"
  };

  const [userProfile, setUserProfile] = useState({
    first_name: defaultUser.first_name,
    last_name: defaultUser.last_name,
    email: defaultUser.email,
    phone_number: defaultUser.phone,
    license_series: "BXH",
    license_number: "222222",
    role: defaultUser.role
  });

  const billingAddress = {
    address: "вул. Соборності 123",
    city: "Дніпро",
    zip: "99999",
    country: "Україна"
  };

  const [backendRentals, setBackendRentals] = useState<BackendBooking[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; brand_id: number; name: string }[]>([]);
  const [cars, setCars] = useState<{ id: number; plate: string; brand_id: number; model_id: number }[]>([]);
  const [locations, setLocations] = useState<{ id: number; address: string }[]>([]);

  const BASE_URL = 'http://localhost:8000';
  const token = localStorage.getItem('token');

  const loadUserProfile = () => {
    if (!token) return;
    fetch(`${BASE_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Не вдалося завантажити профіль");
        return res.json();
      })
      .then(data => {
        setUserId(data.id);
        setUserProfile({
          first_name: data.first_name || defaultUser.first_name,
          last_name: data.last_name || defaultUser.last_name,
          email: data.email || defaultUser.email,
          phone_number: data.phone_number || defaultUser.phone,
          license_series: data.license_series || "BXH",
          license_number: data.license_number || "222222",
          role: data.role === 'ADMIN' ? 'Адміністратор' : defaultUser.role
        });
      })
      .catch(() => {
        console.log("Бекенд недоступний. Працює локальний макет.");
      });
  };

  const loadRentals = () => {
    if (!token) return;
    fetch(`${BASE_URL}/rentals/rentals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBackendRentals(data);
          if (data.length > 0 && expandedBooking === null) setExpandedBooking(data[0].id);
        }
      })
      .catch(err => console.error("Помилка завантаження оренд:", err));
  };

  useEffect(() => {
    if (!token) return;

    loadUserProfile();
    loadRentals();

    fetch(`${BASE_URL}/cars-details/brands`).then(res => res.json()).then(data => setBrands(data)).catch(() => {});
    fetch(`${BASE_URL}/cars-details/models`).then(res => res.json()).then(data => setModels(data)).catch(() => {});
    fetch(`${BASE_URL}/cars/`).then(res => res.json()).then(data => setCars(data)).catch(() => {});

    fetch(`${BASE_URL}/rentals/locations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLocations(data);
        }
      })
      .catch(() => {});
  }, [token]);

  const openCancelConfirmation = (rentalId: number) => {
    setSelectedRentalId(rentalId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedRentalId || !token) return;

    try {
      const response = await fetch(`${BASE_URL}/rentals/rentals/${selectedRentalId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsCancelModalOpen(false);
        setSelectedRentalId(null);
        loadRentals(); 
      } else {
        const errorData = await response.json();
        alert('Помилка скасування: ' + (errorData.detail || 'Не вдалося скасувати.'));
      }
    } catch (err) {
      console.error(err);
      alert('Помилка зв’язку з сервером');
    }
  };

  const getCarNameById = (carId: number) => {
    const carObj = cars.find(c => c.id === carId);
    if (!carObj) return "Завантаження авто...";
    const brandObj = brands.find(b => b.id === carObj.brand_id);
    const modelObj = models.find(m => m.id === carObj.model_id);
    return `${brandObj ? brandObj.name : ''} ${modelObj ? modelObj.name : ''}`.trim().toUpperCase();
  };

  const getCarPlateById = (carId: number) => {
    const carObj = cars.find(c => c.id === carId);
    return carObj ? carObj.plate : "KA 4821 MX";
  };

  const getLocationAddressById = (locationId: number, defaultFallback: string) => {
    const locObj = locations.find(l => l.id === locationId);
    return locObj ? locObj.address : defaultFallback;
  };

  const translateStatus = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { text: 'Активна', class: 'active-status' };
    case 'PENDING': return { text: 'В обробці', class: 'completed-status' };
    case 'CANCELLED': return { text: 'Скасовано', class: 'cancelled-status' };
    default: return { text: 'Завершено', class: 'completed-status' };
  }
  };

  const formatShortRange = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const months = ["Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"];
    return `${s.getDate()}-${e.getDate()} ${months[s.getMonth()]}`;
  };

  const formatFullTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = ["Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const toggleBooking = (id: number) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  return (
    <div className="account-page-container">
      <div className="account-layout">
        
        <aside className="account-sidebar">
          <div className="user-avatar-block">
            <div className="avatar-circle">
              {(userProfile.first_name && userProfile.first_name[0]) || 'U'}
              {(userProfile.last_name && userProfile.last_name[0]) || ''}
            </div>
            <div className="user-meta">
              <h3>{userProfile.last_name} {userProfile.first_name}</h3>
              <p>{userProfile.role}</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button 
              className={`menu-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <img src={accountIcon} alt="" className="menu-btn-icon" />
              Профіль
            </button>

            <button 
              className={`menu-item-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <img src={rentalsIcon} alt="" className="menu-btn-icon" />
              Мої бронювання
            </button>
          </nav>

          <button className="sidebar-logout-btn" onClick={() => alert('Вихід з системи...')}>
            <img src={logoutIcon} alt="" className="menu-btn-icon" />
            Вийти
          </button>
        </aside>

        <main className="account-main-content">
          
          {activeTab === 'profile' && (
            <div className="profile-tab-view">
              <h2>Профіль</h2>
              
              <div className="profile-content-wrapper-left">
                <div className="info-card-block">
                  <div className="info-card-row">
                    <div className="info-cell">
                      <span className="cell-label">Персональні дані</span>
                      <span className="cell-value">{userProfile.last_name} {userProfile.first_name}</span>
                    </div>
                    <div className="info-cell">
                      <span className="cell-label">Contact info</span>
                      <span className="cell-value" style={{ textTransform: 'none' }}>{userProfile.email}</span>
                      <span className="cell-value-sub">{userProfile.phone_number}</span>
                    </div>
                  </div>

                  <div className="info-card-row" style={{ marginTop: '24px' }}>
                    <div className="info-cell">
                      <span className="cell-label">Номер посвідчення водія</span>
                      <span className="cell-value">
                        {userProfile.license_series} {userProfile.license_number}
                      </span>
                    </div>
                    <div className="info-action-cell">
                      <button className="edit-data-link-btn" onClick={() => setIsEditModalOpen(true)}>
                        Редагувати
                      </button>
                    </div>
                  </div>
                </div>

                <div className="info-card-block">
                  <div className="info-card-row">
                    <div className="info-cell">
                      <span className="cell-label">Методи оплати</span>
                      <span className="cell-value">VISA **** **** **** 2222</span>
                      <span className="cell-value">MASTERCARD **** **** **** 2222</span>
                    </div>
                    <div className="info-cell">
                      <span className="cell-label">Платіжна адреса</span>
                      <span className="cell-value">{billingAddress.city}, {billingAddress.zip}</span>
                      <span className="cell-value-sub">{billingAddress.address}</span>
                      <span className="cell-value-sub">{billingAddress.country}</span>
                    </div>
                  </div>

                  <div className="info-card-row" style={{ marginTop: '14px' }}>
                    <div className="info-cell"></div>
                    <div className="info-action-cell">
                      <button className="edit-data-link-btn" onClick={() => setIsEditModalOpen(true)}>
                        Редагувати
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab-view">
              <h2>Мої бронювання</h2>
              
              {backendRentals.length === 0 ? (
                <div className="empty-bookings-container">
                  <p className="empty-title">У вас ще немає бронювань</p>
                  <p className="empty-desc">Щойно у вас буде бронювання, воно відобразиться тут</p>
                  <button className="account-redirect-catalog-btn" onClick={onGoToCatalog}>
                    Забронювати авто
                  </button>
                </div>
              ) : (
                <div className="bookings-accordion-list">
                  {backendRentals.map((booking) => {
                    const isExpanded = expandedBooking === booking.id;
                    const statusInfo = translateStatus(booking.status);

                    return (
                      <div key={booking.id} className={`booking-accordion-item ${isExpanded ? 'open' : ''}`}>
                        
                        <div className="accordion-trigger-header" onClick={() => toggleBooking(booking.id)}>
                          <span className="booking-car-title">{getCarNameById(booking.car_id)}</span>
                          <span className="booking-date-range">{formatShortRange(booking.start_date, booking.end_date)}</span>
                          
                          <div className="accordion-right-meta">
                            <span className={`status-badge-lbl ${statusInfo.class}`}>
                              {statusInfo.text}
                            </span>
                            <span className="arrow-toggle-icon">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="accordion-dropdown-body">
                            <div className="booking-details-grid">
                              <div className="details-column">
                                <span className="details-label">Номер авто</span>
                                <span className="details-value">{getCarPlateById(booking.car_id)}</span>
                              </div>
                              
                              <div className="details-column">
                                <span className="details-label">Місце отримання</span>
                                <span className="details-value">
                                  {getLocationAddressById(booking.pickup_location_id, "вул. Хрещатик, Київ")}
                                </span>
                                <span className="details-subvalue">{formatFullTime(booking.start_date)}</span>
                              </div>

                              <div className="details-column">
                                <span className="details-label">Місце повернення</span>
                                <span className="details-value">
                                  {getLocationAddressById(booking.return_location_id, "вул. Антоновича 54, Київ")}
                                </span>
                                <span className="details-subvalue">{formatFullTime(booking.end_date)}</span>
                              </div>
                            </div>
                            
                            <div className="booking-total-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Вартість оренди: <strong>{booking.price_sum}₴</strong></span>
                              
                              {(booking.status === 'PENDING' || booking.status === 'ACTIVE') && (
                                <button 
                                  onClick={() => openCancelConfirmation(booking.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#FF5B5B',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    padding: '5px 10px'
                                  }}
                                >
                                  Скасувати бронювання
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </main>
      </div>


      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId}
        currentData={{
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          phone_number: userProfile.phone_number,
          license_series: userProfile.license_series,
          license_number: userProfile.license_number
        }}
        onUpdateSuccess={loadUserProfile}
      />

      
      {isCancelModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCancelModalOpen(false)}>
          <div className="modal-content-clean" style={{ height: 'auto', minHeight: '200px', maxWidth: '400px', padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#111827', fontFamily: 'sans-serif' }}>Скасувати замовлення?</h3>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: '1.5', fontFamily: 'sans-serif' }}>
              Ви впевнені, що хочете скасувати це бронювання? Автомобіль буде миттєво звільнено для інших користувачів.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  background: '#FFF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Назад
              </button>
              <button 
                onClick={confirmCancelBooking}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#FF5B5B',
                  color: '#FFF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Так, скасувати
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};