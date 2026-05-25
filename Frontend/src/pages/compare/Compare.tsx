import React, { useState, useEffect } from 'react';
import type { Car } from '../../types';
import './Compare.css';

import defaultCarImg from '../../assets/skoda.png';

interface CompareProps {
  compareList: Car[];
  onRemoveFromCompare: (carId: number) => void;
  onBackToCatalog: () => void;
}

type Season = 'summer' | 'autumn' | 'winter' | 'spring';


const CompareCarImage: React.FC<{ carId: number; baseUrl: string }> = ({ carId, baseUrl }) => {
  const [imgUrl, setImgUrl] = useState<string>(defaultCarImg);

  useEffect(() => {
    fetch(`${baseUrl}/cars-details/cars/${carId}/images`)
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData && imgData.length > 0) {
          
          const primaryImg = imgData.find((i: any) => i.is_primary || i.is_main) || imgData[0];
          setImgUrl(`${baseUrl}${primaryImg.image_url}`);
        }
      })
      .catch(() => setImgUrl(defaultCarImg));
  }, [carId, baseUrl]);

  return <img src={imgUrl} alt="Автомобіль" style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />;
};

export const Compare: React.FC<CompareProps> = ({ compareList, onRemoveFromCompare, onBackToCatalog }) => {
  const [rentDays, setRentDays] = useState<number>(4);
  const [season, setSeason] = useState<Season>('summer');

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; brand_id: number; name: string }[]>([]);
  const [fuelTypes, setFuelTypes] = useState<{ id: number; name: string }[]>([]);
  const [gearboxTypes, setGearboxTypes] = useState<{ id: number; name: string }[]>([]);

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetch(`${BASE_URL}/cars-details/brands`).then(res => res.json()).then(data => setBrands(data)).catch(() => {});
    fetch(`${BASE_URL}/cars-details/models`).then(res => res.json()).then(data => setModels(data)).catch(() => {});
    fetch(`${BASE_URL}/cars-filters/fueltypes`).then(res => res.json()).then(data => setFuelTypes(data)).catch(() => {});
    fetch(`${BASE_URL}/cars-filters/gearboxtypes`).then(res => res.json()).then(data => setGearboxTypes(data)).catch(() => {});
  }, []);

  const getCarFullName = (car: Car) => {
    const brandObj = brands.find(b => b.id === car.brand_id);
    const modelObj = models.find(m => m.id === car.model_id);
    if (!brandObj && !modelObj) return "Завантаження...";
    return `${brandObj ? brandObj.name : ''} ${modelObj ? modelObj.name : ''}`.trim().toUpperCase();
  };

  const getFuelTypeName = (fuelTypeId: number) => {
    const fuel = fuelTypes.find(f => f.id === fuelTypeId);
    return fuel ? fuel.name : "Бензин";
  };

  const getGearboxTypeName = (gearboxTypeId: number) => {
    const gearbox = gearboxTypes.find(g => g.id === gearboxTypeId);
    return gearbox ? gearbox.name : "Автомат";
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setRentDays(val < 1 ? 1 : val);
  };

  const calculateTotalRent = (pricePerDay: number, days: number, selectedSeason: Season) => {
    let Kseason = 1.00;
    if (selectedSeason === 'winter') Kseason = 1.40;      
    else if (selectedSeason === 'autumn') Kseason = 1.15;  
    else if (selectedSeason === 'spring') Kseason = 1.10;  
    else Kseason = 1.00;                                  

    let Ddiscount = 0;
    if (days < 3) Ddiscount = 0;
    else if (days <= 7) Ddiscount = 2;   
    else if (days <= 14) Ddiscount = 5;  
    else Ddiscount = 10;                 

    const total = days * pricePerDay * Kseason * (1 - Ddiscount / 100);
    return total.toFixed(0);
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

  return (
    <div className="compare-page-container">
      <div className="compare-main-frame">
        
        <div className="compare-flex-layout">
          
          
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '215px' }}>
            
            
            <div style={{ 
              width: '259px', 
              height: '65px', 
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'Roboto, sans-serif',
              marginBottom: '15px' 
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Пора року
              </span>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000226',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02)'
                }}
              >
                <option value="summer">Літо</option>
                <option value="autumn">Осінь</option>
                <option value="winter">Зима</option>
                <option value="spring">Весна</option>
              </select>
            </div>

            <div className="compare-labels-column-card" style={{ marginTop: '0px' }}>
              <div className="label-spec-cell">Об'єм двигуна</div>
              <div className="label-spec-cell">Тип палива</div>
              <div className="label-spec-cell">Кількість місць</div>
              <div className="label-spec-cell">Тип трансмісії</div>
              <div className="label-spec-cell">Рік випуску</div>
              <div className="label-spec-cell">Витрати палива</div>
              <div className="label-spec-cell">Кількість дверей</div>
              <div className="label-spec-cell">Пробіг</div>
              
              <div className="compare-days-selector-block" style={{ justifyContent: 'space-between', padding: '0 20px' }}>
                <label style={{ fontSize: '13px' }}>Термін оренди</label>
                <input 
                  type="number" 
                  value={rentDays} 
                  onChange={handleDaysChange} 
                  min="1"
                  style={{
                    color: '#000226',
                    backgroundColor: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    width: '52px', 
                    height: '28px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'inline-block',
                    margin: 0
                  }}
                />
              </div>
            </div>
          </div>

          
          {compareList.map((car) => (
            <div key={car.id} className="compare-car-column-card">
              
              <div className="compare-car-card-header">
                <h3>{getCarFullName(car)}</h3>
                <button className="compare-delete-x-btn" onClick={() => onRemoveFromCompare(car.id)}>
                  &times;
                </button>
              </div>

              
              <div className="compare-car-img-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <CompareCarImage carId={car.id} baseUrl={BASE_URL} />
              </div>

              <div className="value-spec-cell">
                {car.fuel_per_km ? `${(car.fuel_per_km * 25).toFixed(1)}л` : '2.0л'}
              </div>
              <div className="value-spec-cell">{getFuelTypeName(car.fuel_type_id)}</div>
              <div className="value-spec-cell">{car.seats}</div>
              <div className="value-spec-cell">{getGearboxTypeName(car.gearbox_type_id)}</div>
              <div className="value-spec-cell">{car.year}</div>
              <div className="value-spec-cell">
                {car.fuel_per_km ? `${Math.round(car.fuel_per_km * 100)}л\\100км` : '12л\\100км'}
              </div>
              <div className="value-spec-cell">{car.doors}</div>
              <div className="value-spec-cell">{car.mileage.toLocaleString()} км</div>

              <button className="compare-total-price-indicator-btn">
                Ціна за {rentDays} днів: {calculateTotalRent(car.price_per_day, rentDays, season)} ₴
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