import { useState } from 'react';
import './Account.css';

import accountIcon from '../../assets/account/account.png';
import rentalsIcon from '../../assets/account/rentals.png';
import logoutIcon from '../../assets/account/logout.png';

interface AccountProps {
  onGoToCatalog: () => void;
}

export const Account = ({ onGoToCatalog }: AccountProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [expandedBooking, setExpandedBooking] = useState<number | null>(1);

  const user = {
    first_name: "test",
    last_name: "test",
    email: "test@gmail.com",
    phone: "+48517120560",
    license: "BXH222222",
    address: "вул. Соборності 123",
    city: "Дніпро",
    zip: "99999",
    country: "Україна",
    role: "Новий клієнт"
  };

  const [myBookings] = useState([
    {
      id: 1,
      car: "SKODA KODIAQ",
      dates: "12-18 Травня",
      status: "Активна",
      statusClass: "active-status",
      number: "KA 4821 MX",
      pickup: "вул. Хрещатик, Київ",
      pickupTime: "Ср, 20 Травня 12:00",
      return: "вул. Антоновича 54, Київ",
      returnTime: "Ср, 20 Травня 12:00",
      price: "777$"
    },
    {
      id: 2,
      car: "SKODA KODIAQ",
      dates: "12-18 Травня",
      status: "Завершено",
      statusClass: "completed-status",
      number: "KA 4821 MX",
      pickup: "вул. Хрещатик, Київ",
      pickupTime: "Ср, 20 Травня 12:00",
      return: "вул. Антоновича 54, Київ",
      returnTime: "Ср, 20 Травня 12:00",
      price: "777$"
    }
  ]);

  const toggleBooking = (id: number) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  return (
    <div className="account-page-container">
      <div className="account-layout">
        
        <aside className="account-sidebar">
          <div className="user-avatar-block">
            <div className="avatar-circle">NS</div>
            <div className="user-meta">
              <h3>{user.last_name} {user.first_name}</h3>
              <p>{user.role}</p>
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
                      <span className="cell-value">{user.last_name} {user.first_name}</span>
                    </div>
                    <div className="info-cell">
                      <span className="cell-label">Контактні дані</span>
                      <span className="cell-value">{user.email}</span>
                      <span className="cell-value-sub">{user.phone}</span>
                    </div>
                  </div>

                  <div className="info-card-row" style={{ marginTop: '24px' }}>
                    <div className="info-cell">
                      <span className="cell-label">Номер посвідчення водія</span>
                      <span className="cell-value">{user.license}</span>
                    </div>
                    <div className="info-action-cell">
                      <button className="edit-data-link-btn" onClick={() => alert('Редагування...')}>
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
                      <span className="cell-value">{user.city}, {user.zip}</span>
                      <span className="cell-value-sub">{user.address}</span>
                      <span className="cell-value-sub">{user.country}</span>
                    </div>
                  </div>

                  <div className="info-card-row" style={{ marginTop: '14px' }}>
                    <div className="info-cell"></div>
                    <div className="info-action-cell">
                      <button className="edit-data-link-btn" onClick={() => alert('Редагування...')}>
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
              
              {myBookings.length === 0 ? (
                <div className="empty-bookings-container">
                  <p className="empty-title">У вас ще немає бронювань</p>
                  <p className="empty-desc">Щойно у вас буде бронювання, воно відобразиться тут</p>
                  <button className="account-redirect-catalog-btn" onClick={onGoToCatalog}>
                    Забронювати авто
                  </button>
                </div>
              ) : (
                <div className="bookings-accordion-list">
                  {myBookings.map((booking) => {
                    const isExpanded = expandedBooking === booking.id;
                    return (
                      <div key={booking.id} className={`booking-accordion-item ${isExpanded ? 'open' : ''}`}>
                        
                        <div className="accordion-trigger-header" onClick={() => toggleBooking(booking.id)}>
                          <span className="booking-car-title">{booking.car}</span>
                          <span className="booking-date-range">{booking.dates}</span>
                          
                          <div className="accordion-right-meta">
                            <span className={`status-badge-lbl ${booking.statusClass}`}>
                              {booking.status}
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
                                <span className="details-value">{booking.number}</span>
                              </div>
                              
                              <div className="details-column">
                                <span className="details-label">Місце отримання</span>
                                <span className="details-value">{booking.pickup}</span>
                                <span className="details-subvalue">{booking.pickupTime}</span>
                              </div>

                              <div className="details-column">
                                <span className="details-label">Місце повернення</span>
                                <span className="details-value">{booking.return}</span>
                                <span className="details-subvalue">{booking.returnTime}</span>
                              </div>
                            </div>
                            
                            <div className="booking-total-price-row">
                              <span>Вартість оренди: <strong>{booking.price}</strong></span>
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
    </div>
  );
};