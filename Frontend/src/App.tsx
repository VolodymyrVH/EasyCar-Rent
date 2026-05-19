import { useState } from 'react';
import { Register } from './pages/register/Register';
import { Login } from './pages/login/Login';
import { CarPage } from './pages/CarPage/CarPage';
import { Catalog } from './pages/catalog/Catalog';

function App() {
  // тимчасовий стан для навігації register або catalog
  const [currentPage, setCurrentPage] = useState<'register' | 'catalog' | 'login' | 'car'>('car');

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: '#111827',
        padding: '10px',
        borderRadius: '12px',
        display: 'flex',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <button 
          onClick={() => setCurrentPage('register')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'register' ? '#5BA3FF' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Реєстрація
        </button>
        <button 
          onClick={() => setCurrentPage('login')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'login' ? '#5BA3FF' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}
  >
  Логін
</button>
        <button 
          onClick={() => setCurrentPage('car')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'car' ? '#5BA3FF' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
    }}
  >
  Авто
  </button>
        <button 
          onClick={() => setCurrentPage('catalog')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'catalog' ? '#5BA3FF' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Каталог
        </button>
      </div>

      {currentPage === 'register' && <Register />}
      {currentPage === 'catalog' && <Catalog />}
      {currentPage === 'login' && <Login />}
      {currentPage === 'car' && <CarPage />}
    </>
  );
}

export default App;