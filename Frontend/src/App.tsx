import { useState, useEffect } from 'react';
import { Main } from './pages/main/Main'; 
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
  const [currentPage, setCurrentPage] = useState<'main' | 'register' | 'catalog' | 'login' | 'account' | 'car-page' | 'compare'>('main');
  const [selectedCarForView, setSelectedCarForView] = useState<Car | null>(null);
  const [compareList, setCompareList] = useState<Car[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleViewCar = (car: Car) => {
    setSelectedCarForView(car);
    setCurrentPage('car-page');
  };

  const handleAddToCompare = (car: Car) => {
    setCompareList(prev => {
      if (prev.some(item => item.id === car.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, car];
    });
  };

  const handleRemoveFromCompare = (carId: number) => {
    setCompareList(prev => prev.filter(car => car.id !== carId));
  };

  const handleGoToCatalog = () => {
    setCurrentPage('catalog');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentPage('main'); 
    alert('Ви вийшли з системи');
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-container">
          <div className="header-left-block">
            <div onClick={() => setCurrentPage('main')} style={{ cursor: 'pointer' }}>
              <Logo />
            </div>
            <nav className="nav-menu">
              <button 
                className={currentPage === 'main' ? 'nav-link active' : 'nav-link'} 
                onClick={() => setCurrentPage('main')}
              >
                Головна
              </button>

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

              {token && (
                <button 
                  className={currentPage === 'account' ? 'nav-link active' : 'nav-link'} 
                  onClick={() => setCurrentPage('account')}
                >
                  Профіль
                </button>
              )}

              {!token ? (
                <>
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
                </>
              ) : (
                <button className="nav-link" onClick={handleLogout}>
                  Вийти
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="page-content">
        {currentPage === 'main' && <Main onNavigateToCatalog={handleGoToCatalog} />}

        {currentPage === 'login' && <Login onLoginSuccess={(userToken) => {
          setToken(userToken);
          setCurrentPage('catalog');
        }} />}
        
        {currentPage === 'register' && <Register onRegisterSuccess={() => {
          setCurrentPage('login');
        }} />}
        
        {currentPage === 'catalog' && (
          <Catalog onViewCar={handleViewCar} onAddToCompare={handleAddToCompare} />
        )}
        
        {currentPage === 'account' && token && <Account onGoToCatalog={handleGoToCatalog} />}
        
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