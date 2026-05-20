import React, { useState } from 'react';
import type { Car } from '../../types';
import './Compare.css';

import defaultCarImg from '../../assets/skoda.png';

interface CompareProps {
  compareList: Car[];
  onRemoveFromCompare: (carId: number) => void;
  onBackToCatalog: () => void;
}

export const Compare: React.FC<CompareProps> = ({ compareList, onRemoveFromCompare, onBackToCatalog }) => {
  const [rentDays, setRentDays] = useState<number>(4);

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setRentDays(val < 1 ? 1 : val);
  };

  if (compareList.length === 0) {
    return (
      <div className="compare-page-container">
        <div className="compare-main-frame">
          <div className="compare-empty-state">
            <div className="compare-empty-title">У вас ще немає доданих авто</div>
            <div className="compare-empty-desc">Перейдіть до каталогу та додайте автомобілі для порівняння.</div>
            <button className="compare-back-catalog-btn" onClick={onBackToCatalog}>
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotalRent = (pricePerDay: number, days: number) => {
    let coeff = 1;
    if (days >= 4 && days <= 9) coeff = 0.9;
    else if (days >= 10) coeff = 0.7;
    return (pricePerDay * coeff * days).toFixed(0);
  };

  return (
    <div className="compare-page-container">
      <div className="compare-main-frame">
        
        <div className="compare-flex-layout">
          
          <div className="compare-labels-column-card">
            <div className="label-spec-cell">Об'єм двигуна</div>
            <div className="label-spec-cell">Тип палива</div>
            <div className="label-spec-cell">Кількість місць</div>
            <div className="label-spec-cell">Тип трансмісії</div>
            <div className="label-spec-cell">Рік випуску</div>
            <div className="label-spec-cell">Витрати палива</div>
            <div className="label-spec-cell">Кількість дверей</div>
            <div className="label-spec-cell">Пробіг</div>
            
            <div className="compare-days-selector-block">
              <label>Вкажіть термін оренди</label>
              <input 
                type="number" 
                value={rentDays} 
                onChange={handleDaysChange} 
                min="1"
              />
            </div>
          </div>

          {compareList.map((car) => (
            <div key={car.id} className="compare-car-column-card">
              
              <div className="compare-car-card-header">
                <h3>SKODA KODIAQ</h3>
                <button className="compare-delete-x-btn" onClick={() => onRemoveFromCompare(car.id)}>
                  &times;
                </button>
              </div>

              <div className="compare-car-img-box">
                <img src={defaultCarImg} alt="" />
              </div>

              <div className="value-spec-cell">2.0л 175кс</div>
              <div className="value-spec-cell">Бензин</div>
              <div className="value-spec-cell">{car.seats}</div>
              <div className="value-spec-cell">{car.gearbox_type_id === 1 ? 'Автомат' : 'Механіка'}</div>
              <div className="value-spec-cell">{car.year}</div>
              <div className="value-spec-cell">{car.fuel_per_km || '12л\\100км'}</div>
              <div className="value-spec-cell">{car.doors}</div>
              <div className="value-spec-cell">{car.mileage} км</div>

              <button className="compare-total-price-indicator-btn">
                Ціна за {rentDays} днів: {calculateTotalRent(car.price_per_day, rentDays)}$
              </button>

            </div>
          ))}

          {compareList.length < 3 && (
            <div className="compare-add-more-placeholder-card" onClick={onBackToCatalog}>
              <span className="plus-icon-sign">+</span>
              <span className="add-text-lbl">Додати авто</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};