/* Inicio Imports */
import "./Modal.css";
import { useState, useEffect } from "react";
import PopupCalendar from "../Calendar/PopupCalendar";
/* Fin Imports */


/* Inicio Componente */
function EditTaskModal({ isOpen, onClose, task, onSave }) {

  /* Inicio EstadosCampos */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Alta");
  const [status, setStatus] = useState("Pendiente");
  /* Fin EstadosCampos */

  /* Inicio EstadosFechas */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  /* Fin EstadosFechas */

  /* Inicio PopupCalendar */
  const [openCalendar, setOpenCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState(null);
  /* Fin PopupCalendar */


  /* Inicio CargarDatos */
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setStartDate(task.startDate || "");
      setEndDate(task.endDate || "");
    }
  }, [task]);
  /* Fin CargarDatos */


  /* Inicio ValidaciónModal */
  if (!isOpen || !task) return null;
  /* Fin ValidaciónModal */


  /* Inicio GuardarCambios */
  const handleSave = () => {
    if (!title.trim()) {
      alert("El título no puede estar vacío.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Debes seleccionar fechas de inicio y final.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("La fecha final no puede ser menor que la de inicio.");
      return;
    }

    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      startDate,
      endDate,
    });

    onClose();
  };
  /* Fin GuardarCambios */


  /* Inicio AbrirCalendar */
  const openCalendarFor = (field) => {
    setCalendarTarget(field);
    setOpenCalendar(true);
  };
  /* Fin AbrirCalendar */


  /* Inicio SeleccionarFecha */
  const handleSelectDate = (date) => {
    if (calendarTarget === "start") setStartDate(date);
    if (calendarTarget === "end") setEndDate(date);
    setOpenCalendar(false);
  };
  /* Fin SeleccionarFecha */


  /* Inicio Render */
  return (
    <>
      {/* Inicio Modal */}
      <div className="modal-overlay">
        <div className="modal-content">

          <h3>Editar tarea</h3>

          {/* Título */}
          <label>Título:</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows="2"
          />

          {/* Descripción */}
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Describe la tarea..."
          />

          {/* Prioridad */}
          <label>Prioridad:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          {/* Estado */}
          <label>Estado:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>

          {/* Fecha de inicio */}
          <label>Fecha de inicio:</label>
          <div className="date-row">
            <input
              type="text"
              readOnly
              value={startDate}
              placeholder="Seleccionar fecha..."
            />
            <button
              className="calendar-btn"
              onClick={() => openCalendarFor("start")}
            >
              📅
            </button>
          </div>

          {/* Fecha final */}
          <label>Fecha final:</label>
          <div className="date-row">
            <input
              type="text"
              readOnly
              value={endDate}
              placeholder="Seleccionar fecha..."
            />
            <button
              className="calendar-btn"
              onClick={() => openCalendarFor("end")}
            >
              📅
            </button>
          </div>

          {/* Botones */}
          <div className="modal-buttons">
            <button className="add-btn" onClick={handleSave}>
              Guardar
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>

        </div>
      </div>
      {/* Fin Modal */}

      {/* Inicio PopupCalendar */}
      <PopupCalendar
        isOpen={openCalendar}
        onClose={() => setOpenCalendar(false)}
        onSelectDate={handleSelectDate}
      />
      {/* Fin PopupCalendar */}
    </>
  );
  /* Fin Render */
}
/* Fin Componente */


export default EditTaskModal;
