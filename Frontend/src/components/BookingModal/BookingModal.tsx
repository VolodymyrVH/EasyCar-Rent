import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
}

export const BookingModal = ({ isOpen, onClose, carName }: BookingModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Заявка на авто ${carName} прийнята! Наш менеджер зателефонує вам.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-clean" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-x" onClick={onClose} aria-label="Закрити">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h2>Оберіть дати</h2>
        
        <form onSubmit={handleSubmit} className="modal-form-layout">
          
          <div className="input-field-group">
            <span className="modal-field-label">Адреса подачі</span>
            <input 
              type="text" 
              placeholder="Введіть адресу подачі" 
              required 
            />
          </div>

          <div className="input-field-group">
            <span className="modal-field-label">Адреса повернення</span>
            <input 
              type="text" 
              placeholder="Введіть адресу повернення" 
              required 
            />
          </div>

          <div className="modal-time-row">
            <div className="input-field-group">
              <span className="modal-field-label">Час подачі</span>
              <input 
                type="datetime-local" 
                step="900"
                required 
              />
            </div>
            
            <div className="input-field-group">
              <span className="modal-field-label">Час повернення</span>
              <input 
                type="datetime-local" 
                step="900"
                required 
              />
            </div>
          </div>

          <button type="submit" className="modal-submit-action-btn">
            Залишити заявку
          </button>
        </form>
      </div>
    </div>
  );
};