import { useState } from 'react';
import { Logo } from '../../components/Logo';
import './Catalog.css';
import carImg from '../../assets/skoda.png';

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

interface FilterOption {
  label: string;
  icon: string;
}

interface FilterData {
  [key: string]: FilterOption[];
}

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const cars = [1, 2, 3]; 

  const toggleFilter = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const filterData: FilterData = {
    doors: [{ label: '2', icon: fDoors }, { label: '3', icon: fDoors }, { label: '4', icon: fDoors }, { label: '5', icon: fDoors }],
    seats: [{ label: '2', icon: fSeats }, { label: '4', icon: fSeats }, { label: '5', icon: fSeats }],
    gearbox: [{ label: 'АКПП', icon: fGear }, { label: 'МКПП', icon: fGear }],
    body: [
      { label: 'Седан', icon: bSedan },
      { label: 'Купе', icon: bCoupe },
      { label: 'Універсал', icon: bMinivan },
      { label: 'Позашляховик', icon: bSuv },
      { label: 'Хетчбек', icon: bHatch }
    ],
    brands: [
      { label: 'Toyota', icon: brToyota },
      { label: 'Volkswagen', icon: brVw },
      { label: 'Hyundai', icon: brHyundai },
      { label: 'Renault', icon: brRenault },
      { label: 'Skoda', icon: brSkoda },
      { label: 'BMW', icon: brBmw }
    ],
    fuel: [{ label: 'Бензин', icon: fFuel }, { label: 'Дизель', icon: fFuel }],
    price: [{ label: '0-50$', icon: '' }, { label: '51-100$', icon: '' }, { label: '101-150$', icon: '' }, { label: '151-200$', icon: '' }]
  };

  const filterList = [
    { id: 'doors', title: 'Кількість дверей' },
    { id: 'seats', title: 'Кількість місць' },
    { id: 'gearbox', title: 'КПП' },
    { id: 'body', title: 'Кузов' },
    { id: 'brands', title: 'Марка авто' },
    { id: 'fuel', title: 'Тип палива' },
    { id: 'price', title: 'Ціна за день' },
  ];

  return (
    <div className="catalog-page">
      <header className="catalog-header"><Logo /></header>
      <main className="catalog-main">
        <div className="catalog-container">
          <div className="filters-bar">
            {filterList.map((f) => (
              <div className="filter-wrapper" key={f.id}>
                <button 
                  className={`filter-item ${activeFilter === f.id ? 'active' : ''}`} 
                  onClick={() => toggleFilter(f.id)}
                >
                   {f.title} ▾
                </button>
                {activeFilter === f.id && (
                  <div className={`dropdown-menu dropdown-${f.id}`}>
                    {filterData[f.id].map((opt) => (
                      <label key={opt.label} className="dropdown-item">
                        <input type="checkbox" className="custom-checkbox" />
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
            {cars.map((_, index) => (
              <div key={index} className="car-card">
                <h2 className="car-title">SKODA KODIAQ</h2>
                <div className="image-wrapper"><img src={carImg} alt="" className="car-image" /></div>
                <div className="specs-list">
                  <div className="spec-tag"><img src={seatsIcon} alt="" /> 5</div>
                  <div className="spec-tag"><img src={gearboxIcon} alt="" /> M</div>
                  <div className="spec-tag"><img src={fuelIcon} alt="" /> 8.5\100 км</div>
                  <div className="spec-tag"><img src={motorIcon} alt="" /> 2.0</div>
                  <div className="spec-tag"><img src={caryearIcon} alt="" /> 2022</div>
                  <div className="spec-tag"><img src={mileageIcon} alt="" /> 20183</div>
                  <div className="spec-tag"><img src={doorsIcon} alt="" /> 5</div>
                </div>
                <div className="price-section">
                  <div className="table-header"><span>Діб</span><span>Ціна\д</span></div>
                  <div className="price-table">
                    <div className="price-row"><span>1 - 3</span> <span>90$</span></div>
                    <div className="price-row"><span>4 - 9</span> <span>80$</span></div>
                    <div className="price-row"><span>10 - 20</span> <span>50$</span></div>
                  </div>
                </div>
                <button className="book-btn">Забронювати</button>
              </div>
            ))}
          </div>
          <button className="load-more-btn">Більше авто...</button>
        </div>
      </main>
    </div>
  );
};