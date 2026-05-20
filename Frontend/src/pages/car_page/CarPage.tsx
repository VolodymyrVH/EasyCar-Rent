import { useState } from 'react';
import './CarPage.css';
import type { Car } from '../../types';
import { BookingModal } from '../../components/BookingModal/BookingModal'; 

import bigCarImg from '../../assets/skoda.png';
import compareIcon from '../../assets/compare.png';
import checkIcon from '../../assets/check.png';

import blueSeats from '../../assets/assets_blue/seats.png';
import blueFuel from '../../assets/assets_blue/fluel.png';
import blueGearbox from '../../assets/assets_blue/gearbox.png';
import blueMotor from '../../assets/assets_blue/motor.png';
import blueYear from '../../assets/assets_blue/caryear.png';
import blueDoors from '../../assets/assets_blue/doors.png';
import blueMileage from '../../assets/assets_blue/mileage.png';

interface CarPageProps {
  car: Car;
  onBack: () => void;
  onAddToCompare: (car: Car) => void;
}

export const CarPage = ({ car, onBack, onAddToCompare }: CarPageProps) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'features'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const getCarClass = (price: number) => {
    if (price > 5000) return 'Преміум';
    if (price < 1250) return 'Економ';
    return 'Бізнес';
  };

  const currentClass = getCarClass(car.price_per_day);

  const specsList = [
    { icon: blueSeats, label: "Кількість місць", value: car.seats },
    { icon: blueFuel, label: "Тип палива", value: "Бензин" },
    { icon: blueGearbox, label: "Тип трансмісії", value: car.gearbox_type_id === 1 ? 'Автомат' : 'Механіка' },
    { icon: blueMotor, label: "Об'єм двигуна", value: "2.0 л 175кс" },
    { icon: blueFuel, label: "Витрати палива", value: "12л \\ 100км" },
    { icon: blueYear, label: "Рік випуску", value: car.year },
    { icon: blueDoors, label: "Кількість дверей", value: car.doors },
    { icon: blueMileage, label: "Пробіг", value: `${car.mileage} км` },
  ];

  const featuresList = [
    "Android Auto / CarPlay", "Мультифункціональне кермо", "Датчик світла",
    "Підігрів сидінь", "Панорамний дах", "Адаптивний круїз-контроль",
    "Задній парктронік", "Контроль сліпих зон", "Система утримання в смузі",
    "Мультимедійна система з LCD-екраном", "Камера 360°", "Клімат-контроль"
  ];

  return (
    <div className="car-page-container">
      <div className="car-page-layout">
        
        <div className="car-page-left">
          <div className="car-gallery-wrapper" style={{ backgroundImage: `url(${bigCarImg})` }}>
            <button className="back-to-catalog-btn" onClick={onBack}>
              ← Назад до каталогу
            </button>
            <div className="gallery-header-text">
              <h1 className="car-main-title">TOYOTA CAMRY</h1>
              <p className="car-sub-title">Седан</p>
            </div>
            <button className="gallery-arrow left">‹</button>
            <button className="gallery-arrow right">›</button>
            <div className="gallery-dots-nav">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>
              ОПИС
            </button>
            <button className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>
              КОМПЛЕКТАЦІЯ
            </button>
          </div>

          <div className="tab-content-card">
            {activeTab === 'desc' ? (
              <div className="description-text">
                <p><strong>Toyota Camry</strong> — комфорт та надійність для щоденних поїздок і ділових зустрічей.</p>
                <p>Цей седан поєднує стильний дизайн, плавний хід і високий уровень оснащення, що робить його ідеальним вибобом як для міста, так і для далеких поїздок.</p>
                <p>Просторий салон забезпечує максимальний комфорт для водія та пасажирів.</p>
              </div>
            ) : (
              <div className="features-grid-layout">
                {featuresList.map((item, index) => (
                  <div key={index} className="feature-checkbox-item">
                    <img src={checkIcon} alt="Checked" className="checkmark-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="car-page-right">
          <div className="side-specs-card">
            <div className="side-card-header">
              <h3>TOYOTA CAMRY</h3>
              <div className="side-header-meta">
                <span className="car-class-badge">{currentClass}</span>
                <button className="compare-action-btn" onClick={() => onAddToCompare(car)}>
                  <img src={compareIcon} alt="Compare" />
                </button>
              </div>
            </div>
            
            <div className="side-car-mini-img-wrapper">
              <img src={bigCarImg} alt="Mini profile" />
            </div>

            <div className="blue-specs-grid-layout">
              {specsList.map((spec, index) => (
                <div key={index} className="grid-spec-box">
                  <img src={spec.icon} alt="" className="grid-spec-icon" />
                  <div className="grid-spec-text-block">
                    <span className="grid-spec-label">{spec.label}</span>
                    <span className="grid-spec-value">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tariffs-pricing-card">
            <h3>ТАРИФИ</h3>
            <table className="tariffs-table">
              <thead>
                <tr>
                  <th>Умови знижок</th>
                  <th>1-3</th>
                  <th>4-9</th>
                  <th>10-20</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Базова ціна</td>
                  <td>{car.price_per_day}$</td>
                  <td>{(car.price_per_day * 0.9).toFixed(0)}$</td>
                  <td>{(car.price_per_day * 0.7).toFixed(0)}$</td>
                </tr>
                <tr>
                  <td>Постійний клієнт</td>
                  <td>-5$</td>
                  <td>-15$</td>
                  <td>-20$</td>
                </tr>
                <tr>
                  <td>Повна предоплата</td>
                  <td>-3$</td>
                  <td>-9$</td>
                  <td>-10$</td>
                </tr>
              </tbody>
            </table>
            <button className="side-panel-book-btn" onClick={() => setIsModalOpen(true)}>
              Забронювати
            </button>
          </div>
        </div>

      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        carName="TOYOTA CAMRY" 
      />
    </div>
  );
};