import './Main.css';


import mainBg from '../../assets/mainpage/mainpage.png';
import bmwLogo from '../../assets/mainpage/bmw.png';
import hyundaiLogo from '../../assets/mainpage/hyundai.png';
import renaultLogo from '../../assets/mainpage/renault.png';
import skodaLogo from '../../assets/mainpage/skoda.png';
import toyotaLogo from '../../assets/mainpage/toyota.png';
import vwLogo from '../../assets/mainpage/volkswagen.png';

interface MainProps {
  onNavigateToCatalog: () => void;
}

export const Main = ({ onNavigateToCatalog }: MainProps) => {
  const brands = [
    { src: toyotaLogo, alt: "Toyota" },
    { src: vwLogo, alt: "Volkswagen" },
    { src: renaultLogo, alt: "Renault" },
    { src: skodaLogo, alt: "Skoda" },
    { src: bmwLogo, alt: "BMW" },
    { src: hyundaiLogo, alt: "Hyundai" }
  ];

  return (
    <div className="main-page-wrapper">
      

      <section className="hero-section" style={{ backgroundImage: `url(${mainBg})` }}>
        <div className="hero-overlay">
          <div className="hero-container">
            <h1 className="hero-title">ОРЕНДА АВТО</h1>
            <h2 className="hero-subtitle">ДЛЯ БУДЬ-ЯКИХ ЦІЛЕЙ ТА КОЖНОГО</h2>
            <p className="hero-description">
              Оренда від EasyCar – це простий, швидкий та вигідний спосіб завжди залишатися на ходу. 
              Вибирайте ідеальний автомобіль для подорожей, бізнесу чи особистих поїздок без зайвих турбот та переплат.
            </p>
            <button className="hero-book-btn" onClick={onNavigateToCatalog}>
              Забронювати
            </button>
          </div>
        </div>
      </section>


      <section className="brands-section">
        <h2 className="section-title-centered">МАРКИ АВТО</h2>
        <div className="brands-grid">
          {brands.map((brand, idx) => (
            <div key={idx} className="brand-logo-card">
              <img src={brand.src} alt={brand.alt} />
            </div>
          ))}
        </div>
      </section>


      <section className="steps-section">
        <h2 className="section-title-centered-blue">ЛИШЕ <span className="blue-accent-text">3 КРОКИ</span></h2>
        <div className="steps-container">
          
          <div className="step-card">
            <div className="step-badge">01</div>
            <h3 className="step-card-title">ВИБІР АВТО</h3>
            <p className="step-card-text">Виберіть відповідну модель у каталозі та вкажіть дати оренди.</p>
          </div>

          <div className="step-card">
            <div className="step-badge">02</div>
            <h3 className="step-card-title">ДАНІ</h3>
            <p className="step-card-text">Заповніть коротку форму та підтвердіть бронювання.</p>
          </div>

          <div className="step-card">
            <div className="step-badge">03</div>
            <h3 className="step-card-title">ОТРИМАННЯ</h3>
            <p className="step-card-text">Зустрічайте авто в потрібному місці і вирушайте в дорогу.</p>
          </div>

        </div>
      </section>


      <section className="about-text-section">
        <div className="about-card-container">
          <h2 className="about-main-title">EasyCar</h2>
          <div className="about-paragraphs-block">
            <p>
              EasyCar - це сучасний та надійний сервіс автопрокату, створений для людей, які цінують свій час, комфорт та свободу пересування. 
              Ми прагнемо зробити оренду автомобіля максимально простою та доступною для кожного, тому повністю відмовилися від складної бюрократії, заплутаних тарифів та поділу клієнтів на категорії. 
              У нас ви знайдете чесний та прозорий сервіс, де інтереси водія завжди на першому місці.
            </p>
            <p>
              Ми пропонуємо широкий вибір автомобілів на будь-який смак та бюджет – від практичних міських моделей до комфортних авто для далеких подорожей чи ділових зустрічей. 
              Весь наш автопарк знаходиться в ідеальному візуальному та технічному стані, проходячи регулярні перевірки та ретельний клінінг перед кожною видачею. 
              Ми гарантуємо безпеку, надійність та впевненість у кожній поїздці.
            </p>
            <p>
              Головна перевага EasyCar - це повна адаптація під ваші потреби. Вам більше не потрібно витрачати годину на поїздки до офісу, адже ми самі доставимо заправок та чистий автомобіль у будь-яку зручну для вас точку. 
              Наша команда професійних менеджерів завжди на зв'язку, щоб допомогти з вибором, відповісти на запитання та забезпечити миттєве оформлення. 
              Вибирайте EasyCar та насолоджуйтесь легкою дорогою з першої хвилини!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};