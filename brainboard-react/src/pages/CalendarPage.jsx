// Inicio Imports
import "./CalendarPage.css";
import Gantt from "../components/Calendar/Gantt";
import { useState, useEffect } from "react";
import CreateTaskModal from "../components/Modal/CreateTaskModal";
import PopupCalendar from "../components/Calendar/PopupCalendar";
import { useTasks } from "../context/TasksContext";
// Fin Imports

// Inicio Utilidades
function toLocalDate(iso) {
  if (!iso) return new Date();
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0);
}
// Fin Utilidades

function CalendarPage() {
  // Inicio Contexto
  const {
    filterByDate,
    filterByWeek,
    filterByMonth,
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();
  // Fin Contexto

  // Inicio FechaHoy
  const getTodayISO = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(t.getDate()).padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] = useState(() =>
    localStorage.getItem("calendarDate") || getTodayISO()
  );

  useEffect(() => {
    localStorage.setItem("calendarDate", selectedDate);
  }, [selectedDate]);
  // Fin FechaHoy

  // Inicio VistaActual
  const [view, setView] = useState(() =>
    localStorage.getItem("calendarView") || "week"
  );

  useEffect(() => {
    localStorage.setItem("calendarView", view);
  }, [view]);
  // Fin VistaActual

  // Inicio Paginación
  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  // Fin Paginación

  // Inicio PanelDetalles
  const [selectedTask, setSelectedTask] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const openPanel = (task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditStart(task.startDate || "");
    setEditEnd(task.endDate || "");
  };

  const closePanel = () => setSelectedTask(null);

  const saveChanges = () => {
    if (!selectedTask) return;

    const updated = {
      ...selectedTask,
      title: editTitle,
      priority: editPriority,
      status: editStatus,
      startDate: editStart,
      endDate: editEnd,
    };

    updateTask(updated);
    setSelectedTask(updated);
  };
  // Fin PanelDetalles

  // Inicio Modales
  const [openCreate, setOpenCreate] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  // Fin Modales

  // Inicio FormatoFecha
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = toLocalDate(iso);
    return d
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(".", "");
  };
  // Fin FormatoFecha

  // Inicio FiltroTareas
  let tasksForGantt = [];
  const localSelected = toLocalDate(selectedDate);

  if (view === "day") tasksForGantt = filterByDate(localSelected);
  if (view === "week") tasksForGantt = filterByWeek(localSelected);
  if (view === "month") tasksForGantt = filterByMonth(localSelected);
  if (view === "all") tasksForGantt = tasks;

  const totalTasks = tasksForGantt.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageTasks = tasksForGantt.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => setCurrentPage(1), [selectedDate, view]);

  const isEmpty = pageTasks.length === 0;
  // Fin FiltroTareas

  return (
    <div className="calendar-page-container">

      {/* Inicio Header */}
      <div className="calendar-page-header">
        <div>
          <h2>Calendario</h2>
          <p className="calendar-subtitle">
            Visualiza tus tareas distribuidas en el tiempo o mira todas juntas.
          </p>
        </div>

        <div className="calendar-buttons">
          {view !== "all" && (
            <button className="date-btn" onClick={() => setOpenCalendar(true)}>
              📅 {formatDate(selectedDate)}
            </button>
          )}

          <button className="crear-btn" onClick={() => setOpenCreate(true)}>
            + Crear tarea
          </button>
        </div>
      </div>
      {/* Fin Header */}

      {/* Inicio BotonesVista */}
      <div className="calendar-view-buttons">
        <button
          className={view === "day" ? "active" : ""}
          onClick={() => setView("day")}
        >
          Día
        </button>

        <button
          className={view === "week" ? "active" : ""}
          onClick={() => setView("week")}
        >
          Semana
        </button>

        <button
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}
        >
          Mes
        </button>

        <button
          className={view === "all" ? "active" : ""}
          onClick={() => setView("all")}
        >
          Todas
        </button>
      </div>
      {/* Fin BotonesVista */}

      {/* Inicio Contenido */}
      {isEmpty ? (
        <div className="calendar-empty">
          <img src="/icons/empty-calendar.png" alt="" />

          <h3>
            {view === "all"
              ? "Aún no hay tareas registradas"
              : "No hay tareas programadas"}
          </h3>

          <p>
            {view === "all"
              ? "Crea una tarea para verla aquí."
              : view === "day"
              ? "No existen tareas para esta fecha."
              : view === "week"
              ? "No existen tareas para esta semana."
              : "No existen tareas para este mes."}
          </p>
        </div>
      ) : (
        <Gantt
          view={view}
          date={selectedDate}
          tasks={pageTasks}
          onTaskClick={openPanel}
        />
      )}
      {/* Fin Contenido */}

      {/* Inicio Paginación */}
      {!isEmpty && (
        <div className="calendar-pagination">
          <span className="calendar-count">
            Mostrando {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, totalTasks)} de {totalTasks}
          </span>

          <div className="calendar-page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </button>

            <span className="calendar-page-indicator">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      {/* Fin Paginación */}

      {/* Inicio PanelDetalles */}
      <aside className={`detail-panel ${selectedTask ? "active" : ""}`}>
        {!selectedTask ? (
          <div className="detail-empty">Selecciona una tarea</div>
        ) : (
          <div className="detail-body">
            <button className="close-panel" onClick={closePanel}>
              ✕
            </button>

            <h3>Detalles</h3>

            <label>Nombre:</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <label>Prioridad:</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>

            <label>Estado:</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completada</option>
            </select>

            <label>Inicio:</label>
            <input
              type="date"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
            />

            <label>Final:</label>
            <input
              type="date"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
            />

            <button className="save-btn" onClick={saveChanges}>
              Guardar cambios
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                deleteTask(selectedTask.id);
                setSelectedTask(null);
              }}
            >
              Eliminar tarea
            </button>
          </div>
        )}
      </aside>
      {/* Fin PanelDetalles */}

      {/* Inicio Modales */}
      <PopupCalendar
        isOpen={openCalendar}
        onClose={() => setOpenCalendar(false)}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setOpenCalendar(false);
        }}
      />

      <CreateTaskModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        defaultStart={selectedDate}
        onCreate={addTask}
      />
      {/* Fin Modales */}

    </div>
  );
}

export default CalendarPage;
