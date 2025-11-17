/* Inicio Imports */
import { useState } from "react";
import "./PopupCalendar.css";
/* Fin Imports */


function PopupCalendar({ isOpen, onClose, onSelectDate }) {

  /* Inicio NoRender */
  if (!isOpen) return null;
  /* Fin NoRender */


  /* Inicio EstadoFecha */
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  /* Fin EstadoFecha */


  /* Inicio DatosMes */
  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const jsDay = new Date(currentYear, currentMonth, 1).getDay();
  const firstDay = (jsDay + 6) % 7;
  /* Fin DatosMes */


  /* Inicio CambiarMes */
  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(currentYear - 1);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(currentYear + 1);
  };
  /* Fin CambiarMes */


  /* Inicio SeleccionarFecha */
  const selectDate = (day) => {
    const formatted = new Date(currentYear, currentMonth, day)
      .toISOString()
      .substring(0, 10);

    onSelectDate(formatted);
    onClose();
  };
  /* Fin SeleccionarFecha */


  /* Inicio Render */
  return (
    <div className="popup-calendar-overlay">
      <div className="popup-calendar">


        {/* Inicio BotonCerrar */}
        <button className="popup-close-btn" onClick={onClose}>✕</button>
        {/* Fin BotonCerrar */}


        {/* Inicio Header */}
        <div className="popup-header">
          <button onClick={prevMonth}>◀</button>

          <span className="month-label">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button onClick={nextMonth}>▶</button>
        </div>
        {/* Fin Header */}


        {/* Inicio DiasSemana */}
        <div className="calendar-grid header">
          <span>Lun</span><span>Mar</span><span>Mié</span>
          <span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
        </div>
        {/* Fin DiasSemana */}


        {/* Inicio DiasMes */}
        <div className="calendar-grid">

          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="empty-cell"></div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;

            const isToday =
              new Date(currentYear, currentMonth, day).toDateString() ===
              new Date().toDateString();

            return (
              <div
                key={day}
                className={`day-cell ${isToday ? "today" : ""}`}
                onClick={() => selectDate(day)}
              >
                {day}
              </div>
            );
          })}

        </div>
        {/* Fin DiasMes */}


      </div>
    </div>
  );
  /* Fin Render */
}

export default PopupCalendar;
