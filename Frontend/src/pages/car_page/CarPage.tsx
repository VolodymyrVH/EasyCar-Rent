import { useState, useEffect } from 'react';
import './CarPage.css';
import type { Car } from '../../types';
import { BookingModal } from '../../components/BookingModal/BookingModal'; 

import carImgFallback from '../../assets/skoda.png';
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
  const [brandName, setBrandName] = useState('CAR');
  const [modelName, setModelName] = useState('');
  
  const [primaryImage, setPrimaryImage] = useState<string>(carImgFallback);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const [featuresList, setFeaturesList] = useState<string[]>([]);

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetch(`${BASE_URL}/cars-details/brands/${car.brand_id}`)
      .then(res => res.json())
      .then(data => setBrandName(data.name ? data.name.toUpperCase() : 'CAR'))
      .catch(() => {});

    fetch(`${BASE_URL}/cars-details/models/${car.model_id}`)
      .then(res => res.json())
      .then(data => setModelName(data.name ? data.name.toUpperCase() : ''))
      .catch(() => {});

    fetch(`${BASE_URL}/cars-details/cars/${car.id}/images`)
      .then(res => res.json())
      .then(imgData => {
        if (Array.isArray(imgData) && imgData.length > 0) {
          const primary = imgData.find((i: any) => i.is_primary);
          const gallery = imgData.filter((i: any) => !i.is_primary);
          
          setPrimaryImage(primary ? `${BASE_URL}${primary.image_url}` : carImgFallback);
          setGalleryImages(gallery.length > 0 ? gallery.map((i: any) => `${BASE_URL}${i.image_url}`) : [carImgFallback]);
        } else {
          setPrimaryImage(carImgFallback);
          setGalleryImages([carImgFallback]);
        }
      })
      .catch(() => {
        setPrimaryImage(carImgFallback);
        setGalleryImages([carImgFallback]);
      });

    fetch(`${BASE_URL}/cars/${car.id}`)
      .then(res => res.json())
      .then((data: any) => {
        if (data && data.tags && data.length > 0) {
          setFeaturesList(data.tags.map((tag: any) => tag.name));
        } else if (car.tags && car.tags.length > 0) {
          setFeaturesList(car.tags.map((tag: any) => tag.name));
        } else {
          setFeaturesList([]);
        }
      })
      .catch(() => {
        setFeaturesList([]);
      });
  }, [car]);

  const handlePrevImage = () => {
    setCurrentImgIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImgIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getCarClass = (price: number) => {
    if (price > 5000) return 'Преміум';
    if (price < 1250) return 'Економ';
    return 'Бізнес';
  };

  const currentClass = getCarClass(car.price_per_day);
  const fullCarTitle = `${brandName} ${modelName}`.trim();

  const specsList = [
    { icon: blueSeats, label: "Кількість місць", value: `${car.seats} місць` },
    { icon: blueFuel, label: "Тип палива", value: car.fuel_type_id === 1 ? 'Бензин' : 'Дизель' },
    { icon: blueGearbox, label: "Тип трансмісії", value: car.gearbox_type_id === 1 ? 'Автомат (АКПП)' : 'Механіка (МКПП)' },
    { icon: blueMotor, label: "Об'єм двигуна", value: "2.0 л" },
    { icon: blueFuel, label: "Витрати палива", value: `${car.fuel_per_km} л / км` },
    { icon: blueYear, label: "Рік випуску", value: car.year },
    { icon: blueDoors, label: "Кількість дверей", value: `${car.doors} дверей` },
    { icon: blueMileage, label: "Пробіг", value: `${car.mileage} км` },
  ];

  return (
    <div className="car-page-container">
      <div className="car-page-layout">
        
        <div className="car-page-left">
          <div className="car-gallery-wrapper" style={{ backgroundImage: `url(${galleryImages[currentImgIndex]})` }}>
            <button className="back-to-catalog-btn" onClick={onBack}>
              ← Назад до каталогу
            </button>
            <div className="gallery-header-text">
              <h1 className="car-main-title">{fullCarTitle}</h1>
              <p className="car-sub-title">Доступно до бронювання</p>
            </div>
            
            <button className="gallery-arrow left" onClick={handlePrevImage}>‹</button>
            <button className="gallery-arrow right" onClick={handleNextImage}>›</button>
            
            <div className="gallery-dots-nav">
              {galleryImages.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === currentImgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(index)} 
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
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
                <p><strong>{fullCarTitle}</strong> — комфорт, стиль та абсолютна надійність для будь-яких ваших поїздок.</p>
                <p>Автомобіль поєднує сучасний ергономічний дизайн, плавний хід та високий рівень безпеки, що робить його чудовим вибором для міського трафіку або тривалих подорожей країною.</p>
                <p>Просторий і чистий салон гарантує максимальну зручність як для водія, так і для кожного пасажира.</p>
              </div>
            ) : (
              <div className="features-grid-layout">
                {featuresList.map((item: string, index: number) => (
                  <div key={index} className="feature-checkbox-item">
                    <img src={checkIcon} alt="" className="checkmark-icon" />
                    <span>{item}</span>
                  </div>
                ))}
                {featuresList.length === 0 && (
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Дані про комплектацію відсутні.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="car-page-right">
          <div className="side-specs-card">
            <div className="side-card-header">
              <h3>{fullCarTitle}</h3>
              <div className="side-header-meta">
                <span className="car-class-badge">{currentClass}</span>
                <button className="compare-action-btn" onClick={() => onAddToCompare(car)}>
                  <img src={compareIcon} alt="" />
                </button>
              </div>
            </div>
            
            <div className="side-car-mini-img-wrapper">
              <img src={primaryImage} alt={fullCarTitle} style={{ maxWidth: '100%', borderRadius: '12px' }} />
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
            <h3>ТАРИФИ (₴ / ДЕНЬ)</h3>
            <table className="tariffs-table">
              <thead>
                <tr>
                  <th>Умови знижок</th>
                  <th>1-3 діб</th>
                  <th>4-9 діб</th>
                  <th>10-20 діб</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Базова ціна</td>
                  <td>{car.price_per_day} ₴</td>
                  <td>{(car.price_per_day * 0.9).toFixed(0)} ₴</td>
                  <td>{(car.price_per_day * 0.7).toFixed(0)} ₴</td>
                </tr>
                <tr>
                  <td>Постійний клієнт</td>
                  <td>-50 ₴</td>
                  <td>-150 ₴</td>
                  <td>-200 ₴</td>
                </tr>
                <tr>
                  <td>Повна предоплата</td>
                  <td>-3%</td>
                  <td>-5%</td>
                  <td>-10%</td>
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
        carName={fullCarTitle} 
        carId={car.id}
        pricePerDay={car.price_per_day}
      />
    </div>
  );
};