import './CarPage.css';

export const CarPage = () => {
  return (
    <main className="car-page-container">
      <div className="car-content">
        {/* Блок з фото */}
        <div className="car-gallery">
          <div className="main-image-placeholder">
            {/* Сюди прийде фото з бекенду */}
            <span>Фото автомобіля</span>
          </div>
        </div>

        {/* Блок з інформацією */}
        <div className="car-details">
          <h1 className="car-title">Назва автомобіля</h1>
          <p className="car-description">
            Короткий опис характеристик, комфорту та особливостей цієї моделі.
          </p>

          <div className="car-specs">
            <div className="spec-item">Тип палива: <span>Бензин</span></div>
            <div className="spec-item">Коробка: <span>Автомат</span></div>
            <div className="spec-item">Рік: <span>2024</span></div>
          </div>

          <div className="price-section">
            <span className="price">1500 грн / доба</span>
            <button className="rent-btn">Забронювати</button>
          </div>
        </div>
      </div>
    </main>
  );
};