import { useState, useEffect, useMemo } from 'react';
import './Catalog.css';
import carImg from '../../assets/skoda.png';
import compareIcon from '../../assets/compare.png'; 
import type { Car } from '../../types';
import { BookingModal } from '../../components/BookingModal/BookingModal'; 

import doorsIcon from '../../assets/doors.png';
import seatsIcon from '../../assets/seats.png';
import gearboxIcon from '../../assets/gearbox.png';
import fuelIcon from '../../assets/fluel.png'; 
import motorIcon from '../../assets/motor.png';
import caryearIcon from '../../assets/caryear.png';
import mileageIcon from '../../assets/mileage.png';

import fDoors from '../../assets/filter/doors.png';
import fSeats from '../../assets/filter/seats.png';
import fFuel from '../../assets/filter/fuel.png';
import fGear from '../../assets/filter/gearbox.png';

import bCoupe from '../../assets/filter/body/coupe.png';
import bHatch from '../../assets/filter/body/hatchback.png';
import bMinivan from '../../assets/filter/body/minivan.png';
import bSedan from '../../assets/filter/body/sedan.png';
import bSuv from '../../assets/filter/body/suv.png';

import brBmw from '../../assets/filter/brands/bmw.png';
import brHyundai from '../../assets/filter/brands/hyundai.png';
import brRenault from '../../assets/filter/brands/renault.png';
import brSkoda from '../../assets/filter/brands/skoda.png';
import brToyota from '../../assets/filter/brands/toyota.png';
import brVw from '../../assets/filter/brands/volkswagen.png';

interface CatalogProps {
  onViewCar: (car: Car) => void;
  onAddToCompare: (car: Car) => void;
}

interface FilterOption {
  label: string;
  icon?: string;
  value: string | number;
}

interface FilterData {
  [key: string]: FilterOption[];
}

export const Catalog = ({ onViewCar, onAddToCompare }: CatalogProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [allCars, setAllCars] = useState<Car[]>([]);
  
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: (string | number)[] }>({
    doors: [], seats: [], gearbox: [], fuel: [], brands: [], body: [], carClass: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCar, setTargetCar] = useState<Car | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/cars/')
      .then((res) => res.json())
      .then((data) => setAllCars(data))
      .catch((err) => console.error("Помилка завантаження:", err));
  }, []);

  const toggleFilterMenu = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCheckboxChange = (filterId: string, value: string | number) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      const next = current.includes(value) 
        ? current.filter(item => item !== value) 
        : [...current, value];
      return { ...prev, [filterId]: next };
    });
  };

  const getCarClass = (car: Car) => {
    if (car.price_per_day > 5000) return 'Преміум';
    if (car.price_per_day < 1250) return 'Економ';
    return 'Бізнес';
  };

  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      if (selectedFilters.gearbox.length > 0) {
        const gearType = car.gearbox_type_id === 1 ? 'АКПП' : 'МКПП';
        if (!selectedFilters.gearbox.includes(gearType)) return false;
      }
      if (selectedFilters.doors.length > 0 && !selectedFilters.doors.includes(String(car.doors))) return false;
      if (selectedFilters.seats.length > 0 && !selectedFilters.seats.includes(String(car.seats))) return false;
      
      if (selectedFilters.carClass.length > 0) {
        const currentClass = getCarClass(car);
        if (!selectedFilters.carClass.includes(currentClass)) return false;
      }
      return true;
    });
  }, [allCars, selectedFilters]);

  const filterData: FilterData = {
    gearbox: [{ label: 'АКПП', icon: fGear, value: 'АКПП' }, { label: 'МКПП', icon: fGear, value: 'МКПП' }],
    doors: [{ label: '2', icon: fDoors, value: '2' }, { label: '3', icon: fDoors, value: '3' }, { label: '4', icon: fDoors, value: '4' }, { label: '5', icon: fDoors, value: '5' }],
    seats: [{ label: '2', icon: fSeats, value: '2' }, { label: '4', icon: fSeats, value: '4' }, { label: '5', icon: fSeats, value: '5' }],
    carClass: [{ label: 'Бізнес', value: 'Бізнес' }, { label: 'Економ', value: 'Економ' }, { label: 'Преміум', value: 'Преміум' }],
    body: [
      { label: 'Седан', icon: bSedan, value: 'Sedan' },
      { label: 'Купе', icon: bCoupe, value: 'Coupe' },
      { label: 'Універсал', icon: bMinivan, value: 'Minivan' },
      { label: 'Позашляховик', icon: bSuv, value: 'SUV' },
      { label: 'Хетчбек', icon: bHatch, value: 'Hatchback' }
    ],
    brands: [
      { label: 'Toyota', icon: brToyota, value: 1 },
      { label: 'Volkswagen', icon: brVw, value: 2 },
      { label: 'Hyundai', icon: brHyundai, value: 4 },
      { label: 'Renault', icon: brRenault, value: 5 },
      { label: 'Skoda', icon: brSkoda, value: 6 },
      { label: 'BMW', icon: brBmw, value: 3 }
    ],
    fuel: [{ label: 'Бензин', icon: fFuel, value: 'Petrol' }, { label: 'Дизель', icon: fFuel, value: 'Diesel' }],
  };

  const filterList = [
    { id: 'gearbox', title: 'КПП' },
    { id: 'doors', title: 'Кількість дверей' },
    { id: 'seats', title: 'Кількість місць' },
    { id: 'carClass', title: 'Класс авто' },
    { id: 'body', title: 'Кузов' },
    { id: 'brands', title: 'Марка авто' },
    { id: 'fuel', title: 'Тип палива' },
  ];

  return (
    <div className="catalog-page">
      <main className="catalog-main">
        <div className="catalog-container">
          <div className="filters-bar">
            {filterList.map((f) => (
              <div className="filter-wrapper" key={f.id}>
                <button 
                  className={`filter-item ${activeFilter === f.id ? 'active' : ''}`} 
                  onClick={() => toggleFilterMenu(f.id)}
                >
                   {f.title} ▾
                </button>
                {activeFilter === f.id && (
                  <div className={`dropdown-menu dropdown-${f.id}`}>
                    {filterData[f.id]?.map((opt) => (
                      <label key={String(opt.value)} className="dropdown-item">
                        <input 
                          type="checkbox" 
                          className="custom-checkbox" 
                          checked={selectedFilters[f.id]?.includes(opt.value) || false}
                          onChange={() => handleCheckboxChange(f.id, opt.value)}
                        />
                        <span className="dropdown-text">{opt.label}</span>
                        {opt.icon && <img src={opt.icon} alt="" className="dropdown-icon" />}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="range-container">
               <span className="range-label">2002</span>
               <input type="range" className="price-range" />
               <span className="range-label">2022</span>
            </div>
          </div>

          <div className="cars-grid">
            {filteredCars.map((car) => {
              const currentClass = getCarClass(car);
              return (
                <div key={car.id} className="car-card">
                  <div className="car-card-header">
                    <h2 className="car-title-link" onClick={() => onViewCar(car)}>SKODA KODIAQ</h2>
                    
                    <div className="car-header-meta-vertical">
                      <span className="car-class-badge">{currentClass}</span>
                      <button 
                        className="compare-action-btn-under" 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          onAddToCompare(car);
                        }}
                      >
                        <img src={compareIcon} alt="Compare" />
                      </button>
                    </div>
                  </div>

                  <div className="image-wrapper clickable" onClick={() => onViewCar(car)}>
                    <img src={carImg} alt="" className="car-image" />
                  </div>
                  
                  <div className="specs-list">
                    <div className="spec-tag"><img src={seatsIcon} alt="" /> {car.seats}</div>
                    <div className="spec-tag"><img src={gearboxIcon} alt="" /> {car.gearbox_type_id === 1 ? 'A' : 'M'}</div>
                    <div className="spec-tag"><img src={fuelIcon} alt="" /> {car.fuel_per_km} л</div>
                    <div className="spec-tag"><img src={motorIcon} alt="" /> 2.0</div>
                    <div className="spec-tag"><img src={caryearIcon} alt="" /> {car.year}</div>
                    <div className="spec-tag"><img src={mileageIcon} alt="" /> {car.mileage}</div>
                    <div className="spec-tag"><img src={doorsIcon} alt="" /> {car.doors}</div>
                  </div>
                  
                  <div className="price-section-container">
                    <div className="price-section-header">
                      <span>Діб</span>
                      <span>Ціна\д</span>
                    </div>
                    <div className="price-table-rows">
                      <div className="price-row-item">
                        <span>1 - 3</span> 
                        <span className="price-value-font">{car.price_per_day}₴</span>
                      </div>
                      <div className="price-row-item">
                        <span>4 - 9</span> 
                        <span className="price-value-font">{(car.price_per_day * 0.9).toFixed(0)}₴</span>
                      </div>
                      <div className="price-row-item">
                        <span>10 - 20</span> 
                        <span className="price-value-font">{(car.price_per_day * 0.7).toFixed(0)}₴</span>
                      </div>
                    </div>
                  </div>

                  <button className="book-btn" onClick={() => { setTargetCar(car); setIsModalOpen(true); }}>
                    Забронювати
                  </button>
                </div>
              );
            })}
          </div>
          {filteredCars.length === 0 && <p style={{textAlign: 'center', marginTop: '40px'}}>Машин з такими параметрами не знайдено.</p>}
        </div>
      </main>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        carName={targetCar ? "SKODA KODIAQ" : "Car"} 
      />
    </div>
  );
};