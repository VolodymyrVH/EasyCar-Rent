import { useState } from 'react';
import { Register } from './pages/register/Register';
import { Catalog } from './pages/catalog/Catalog';
import { Login } from './pages/login/Login';
import { Account } from './pages/account/Account';
import { CarPage } from './pages/car_page/CarPage';
import { Compare } from './pages/compare/Compare'; 
import { Logo } from './components/Logo';
import type { Car } from './types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'register' | 'catalog' | 'login' | 'account' | 'car-page' | 'compare'>('catalog');
  const [selectedCarForView, setSelectedCarForView] = useState<Car | null>(null);
  const [compareList, setCompareList] = useState<Car[]>([]);

  const handleViewCar = (car: Car) => {
    setSelectedCarForView(car);
    setCurrentPage('car-page');
  };


  const handleAddToCompare = (car: Car) => {
    setCompareList(prev => {
      if (prev.some(item => item.id === car.id)) {
        return prev;
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, car];
    });
  };

  const handleRemoveFromCompare = (carId: number) => {
    setCompareList(prev => prev.filter(car => car.id !== carId));
  };

  const handleGoToCatalog = () => {
    setCurrentPage('catalog');
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-container">
          <div className="header-left-block">
            <Logo />
            <nav className="nav-menu">
              <button 
                className={currentPage === 'catalog' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('catalog')}
              >
                Каталог авто
              </button>
              
              <button 
                className={currentPage === 'compare' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('compare')}
              >
                Порівняння {compareList.length > 0 && `(${compareList.length})`}
              </button>

              <button 
                className={currentPage === 'account' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('account')}
              >
                Профіль
              </button>
              <button 
                className={currentPage === 'register' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('register')}
              >
                Реєстрація
              </button>
              <button 
                className={currentPage === 'login' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('login')}
              >
                Логін
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="page-content">
        {currentPage === 'login' && <Login />}
        {currentPage === 'register' && <Register />}
        
        {currentPage === 'catalog' && (
          <Catalog onViewCar={handleViewCar} onAddToCompare={handleAddToCompare} />
        )}
        
        {currentPage === 'account' && <Account onGoToCatalog={handleGoToCatalog} />}
        
        {currentPage === 'compare' && (
          <Compare 
            compareList={compareList} 
            onRemoveFromCompare={handleRemoveFromCompare} 
            onBackToCatalog={handleGoToCatalog} 
          />
        )}

        {currentPage === 'car-page' && selectedCarForView && (
          <CarPage 
            car={selectedCarForView} 
            onBack={handleGoToCatalog} 
            onAddToCompare={handleAddToCompare} 
          />
        )}
      </div>
    </div>
  );
}

export default App;