import logoImg from '../assets/logo-ez.png';

export const Logo = () => {
  return (
    <div className="logo-container">
      <img 
        src={logoImg} 
        alt="EZ CAR Logo" 
        className="main-logo"
      />
    </div>
  );
};