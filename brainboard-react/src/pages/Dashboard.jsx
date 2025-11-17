/* Inicio Imports */
import "./Dashboard.css";
import { useState, useEffect, useRef } from "react";
import { useTasks } from "../context/TasksContext";

import StatusChart from "../components/Charts/StatusChart";
import PriorityChart from "../components/Charts/PriorityChart";
import PopupCalendar from "../components/Calendar/PopupCalendar";
import CreateTaskModal from "../components/Modal/CreateTaskModal";
import EditTaskModal from "../components/Modal/EditTaskModal";

import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartPie,
  FaEllipsisV,
  FaCalendarAlt,
  FaPlus,
  FaChevronDown,
  FaTrashAlt,
  FaEdit
} from "react-icons/fa";
/* Fin Imports */


function Dashboard() {

  /* Inicio Funciones contexto tareas */
  const { 
    filterByDate, 
    filterByWeek, 
    filterByMonth, 
    addTask,
    updateTask,
    deleteTask
  } = useTasks();
  /* Fin Funciones contexto tareas */


  /* Inicio Utilidad fecha */
  const getTodayISO = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
  };
  /* Fin Utilidad fecha */


  /* Inicio Estados globales */
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [view, setView] = useState("day");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [openMobileId, setOpenMobileId] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [toast, setToast] = useState("");

  const menuRef = useRef(null);
  /* Fin Estados globales */


  /* Inicio Efectos iniciales */
  useEffect(() => {
    const saved = localStorage.getItem("selectedDate");
    const savedView = localStorage.getItem("selectedView");
    if (saved) setSelectedDate(saved);
    if (savedView) setView(savedView);
  }, []);

  useEffect(() => localStorage.setItem("selectedDate", selectedDate), [selectedDate]);
  useEffect(() => localStorage.setItem("selectedView", view), [view]);

  /* Cierra menú al hacer clic afuera */
  useEffect(() => {
    const closeAll = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);
  /* Fin Efectos iniciales */


  /* Inicio Generación tareas filtradas */
  let filteredTasks = [];
  if (view === "day") filteredTasks = filterByDate(selectedDate);
  if (view === "week") filteredTasks = filterByWeek(selectedDate);
  if (view === "month") filteredTasks = filterByMonth(selectedDate);
  /* Fin Generación tareas filtradas */


  /* Inicio Utilidad formateo fecha */
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const [y,m,d]=isoDate.split("-");
    return new Date(Number(y),Number(m)-1,Number(d))
      .toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"})
      .replace(".", "");
  };
  /* Fin Utilidad formateo fecha */


  /* Inicio Validación vencimiento */
  const isOverdue = (task) => {
    if (!task.endDate) return false;
    const today = new Date().setHours(0,0,0,0);
    const end = new Date(task.endDate).setHours(0,0,0,0);

    return end < today && task.status !== "Completada";
  };
  /* Fin Validación vencimiento */


  /* Inicio Cálculos métricas */
  const total = filteredTasks.length;
  const completadas = filteredTasks.filter(t=>t.status==="Completada").length;
  const pendientes  = filteredTasks.filter(t=>t.status==="Pendiente").length;
  const progreso    = filteredTasks.filter(t=>t.status==="En Progreso").length;

  const pct = total===0 ? 0 : Math.round((completadas/total)*100);

  const alta = filteredTasks.filter(t=>t.priority==="Alta").length;
  const media = filteredTasks.filter(t=>t.priority==="Media").length;
  const baja = filteredTasks.filter(t=>t.priority==="Baja").length;
  /* Fin Cálculos métricas */


  /* Inicio Helpers UI */
  const showToast = (msg)=>{
    setToast(msg);
    setTimeout(()=>setToast(""),2000);
  };

  const handleDelete=(id)=>{
    if(confirm("¿Seguro que deseas eliminar esta tarea?")){
      deleteTask(id);
      showToast("Tarea eliminada");
      setOpenMenuId(null);
      setOpenMobileId(curr=>curr===id?null:curr);
    }
  };

  const handleEdit=(task)=>{
    setTaskToEdit(task);
    setEditModalOpen(true);
    setOpenMenuId(null);
  };

  const toggleMobileAccordion=(id)=>{
    setOpenMobileId(curr=>curr===id?null:id);
  };
  /* Fin Helpers UI */


  /* Inicio Render principal */
  return (
    <div className="dashboard-container" ref={menuRef}>

      {toast && <div className="toast">{toast}</div>}

      {/* Inicio Header */}
      <div className="dashboard-header">
        <div className="welcome-text">
          <h2>¡Bienvenido a Brain Board!</h2>
          <p>El progreso de tu equipo empieza aquí. ¡Sigue avanzando!</p>
        </div>

        <div className="dashboard-actions">
          <button className="date-btn" onClick={()=>setCalendarOpen(true)}>
            <FaCalendarAlt/> {formatDate(selectedDate)}
          </button>
          <button className="new-task-btn" onClick={()=>setModalOpen(true)}>
            <FaPlus/> Crear nueva tarea
          </button>
        </div>
      </div>
      {/* Fin Header */}


      {/* Inicio Filtros */}
      <div className="view-filters">
        <button className={view==="day"?"active":""} onClick={()=>setView("day")}>Día</button>
        <button className={view==="week"?"active":""} onClick={()=>setView("week")}>Semana</button>
        <button className={view==="month"?"active":""} onClick={()=>setView("month")}>Mes</button>
      </div>
      {/* Fin Filtros */}


      {/* Inicio Tarjetas resumen */}
      <div className="summary-grid">
        <div className="summary-card"><FaClipboardList className="summary-icon icon-purple"/><h3>Total</h3><span>{total}</span></div>
        <div className="summary-card"><FaCheckCircle className="summary-icon icon-green"/><h3>Completadas</h3><span className="green">{completadas}</span></div>
        <div className="summary-card"><FaExclamationTriangle className="summary-icon icon-pink"/><h3>Pendientes</h3><span className="pink">{pendientes}</span></div>
        <div className="summary-card"><FaClock className="summary-icon icon-purple2"/><h3>En progreso</h3><span className="purple">{progreso}</span></div>
        <div className="summary-card progress-card"><FaChartPie className="summary-icon icon-blue"/><h3>Progreso</h3><span className="blue">{pct}%</span></div>
      </div>
      {/* Fin Tarjetas resumen */}


      {/* Inicio Gráficas */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Estado de las tareas</h3>
          <StatusChart data={{pendiente:pendientes,progreso:progreso,completada:completadas}}/>
        </div>
        <div className="chart-card">
          <h3>Prioridades</h3>
          <PriorityChart data={{alta,media,baja}}/>
        </div>
      </div>
      {/* Fin Gráficas */}


      {/* Inicio Contenedor tareas */}
      <div className="tasks-section">
        <h3>
          {view==="day" && `Tareas del ${formatDate(selectedDate)}`}
          {view==="week" && `Tareas de la semana de ${formatDate(selectedDate)}`}
          {view==="month" && `Tareas del mes de ${formatDate(selectedDate)}`}
        </h3>

        {/* Inicio Tabla escritorio */}
        {window.innerWidth > 768 && (
          <div className="tasks-table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Inicio</th>
                  <th>Final</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.length===0 && (
                  <tr><td colSpan="7" className="no-tasks">No hay tareas para esta vista.</td></tr>
                )}

                {filteredTasks.map(t=>(
                  <tr 
                    key={t.id}
                    className={isOverdue(t) ? "overdue-row" : ""}
                  >
                    <td className={isOverdue(t) ? "overdue-text" : ""}>{t.title}</td>
                    <td className={isOverdue(t) ? "overdue-text" : ""}>{t.description || "-"}</td>

                    <td>
                      <span className={`tag tag-${t.priority.toLowerCase()}`}>{t.priority}</span>
                    </td>

                    <td>
                      <span className={`tag tag-${t.status.replace(" ","").toLowerCase()}`}>
                        {t.status}
                      </span>

                      {isOverdue(t) && <span className="overdue-tag">Vencida</span>}
                    </td>

                    <td>{formatDate(t.startDate)}</td>
                    <td>{formatDate(t.endDate)}</td>

                    <td className="options-cell">
                      <FaEllipsisV
                        className={`opts ${openMenuId===t.id?"active":""}`}
                        onClick={()=>setOpenMenuId(openMenuId===t.id?null:t.id)}
                      />

                      {openMenuId===t.id && (
                        <div className="task-menu">
                          <button onClick={()=>handleEdit(t)}>Editar</button>
                          <button onClick={()=>handleDelete(t.id)}>Eliminar</button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Fin Tabla escritorio */}


        {/* Inicio Vista móvil */}
        {window.innerWidth <= 768 && (
          <div className="tasks-list-mobile">

            {filteredTasks.length===0 && (
              <div className="no-tasks-mobile">No hay tareas para esta vista.</div>
            )}

            {filteredTasks.map(t=>{
              const isOpen = openMobileId===t.id;
              const overdue = isOverdue(t);

              const statusClass = `tag tag-${t.status.replace(" ","").toLowerCase()}`;
              const priorityClass = `tag tag-${t.priority.toLowerCase()}`;

              return (
                <div 
                  key={t.id} 
                  className={`task-accordion ${isOpen?"open":""} ${overdue ? "overdue-row" : ""}`}
                >
                  <button className="task-accordion-header" onClick={()=>toggleMobileAccordion(t.id)}>
                    <div className="task-accordion-icon"><FaChevronDown/></div>
                    <span className={`task-accordion-title ${overdue ? "overdue-text" : ""}`}>
                      {t.title}
                    </span>

                    {overdue && <span className="overdue-tag">Vencida</span>}
                  </button>

                  {isOpen && (
                    <div className="task-accordion-body">

                      <div className="accordion-row">
                        <span className="accordion-label">Descripción</span>
                        <span className="accordion-value">{t.description || "-"}</span>
                      </div>

                      <div className="accordion-row">
                        <span className="accordion-label">Prioridad</span>
                        <span className={priorityClass}>{t.priority}</span>
                      </div>

                      <div className="accordion-row">
                        <span className="accordion-label">Estado</span>
                        <span className={statusClass}>{t.status}</span>
                      </div>

                      <div className="accordion-row">
                        <span className="accordion-label">Inicio</span>
                        <span className="accordion-value">{formatDate(t.startDate)}</span>
                      </div>

                      <div className="accordion-row">
                        <span className="accordion-label">Final</span>
                        <span className="accordion-value">{formatDate(t.endDate)}</span>
                      </div>

                      <div className="accordion-row accordion-actions">
                        <span className="accordion-label">Acciones</span>

                        <div className="accordion-actions-buttons">
                          <button className="round-icon-btn delete" onClick={(e)=>{e.stopPropagation();handleDelete(t.id);}}>
                            <FaTrashAlt/>
                          </button>

                          <button className="round-icon-btn edit" onClick={(e)=>{e.stopPropagation();handleEdit(t);}}>
                            <FaEdit/>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
        {/* Fin Vista móvil */}

      </div>
      {/* Fin Contenedor tareas */}


      {/* Inicio Modales y calendarios */}
      <PopupCalendar 
        isOpen={calendarOpen} 
        onClose={()=>setCalendarOpen(false)} 
        onSelectDate={setSelectedDate}
      />

      <CreateTaskModal 
        isOpen={modalOpen} 
        onClose={()=>setModalOpen(false)} 
        defaultStart={selectedDate} 
        onCreate={addTask}
      />

      <EditTaskModal 
        isOpen={editModalOpen} 
        onClose={()=>setEditModalOpen(false)} 
        task={taskToEdit} 
        onSave={updateTask}
      />
      {/* Fin Modales y calendarios */}

    </div>
  );
  /* Fin Render principal */
}

export default Dashboard;
