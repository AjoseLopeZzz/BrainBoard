/* Inicio Imports */
import { useState, useEffect } from "react";
import "./Backlog.css";
import { useTasks } from "../context/TasksContext";
import CreateTaskModal from "../components/Modal/CreateTaskModal";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
/* Fin Imports */

function Backlog() {

  /* Inicio Contexto */
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  /* Fin Contexto */

  /* Inicio Estados Generales */
  const [selected, setSelected] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [toast, setToast] = useState("");
  /* Fin Estados Generales */

  /* Inicio Toast */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  /* Fin Toast */

  /* Inicio Ordenamiento */
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc"
  });

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const { key, direction } = sortConfig;
    const valA = a[key] || "";
    const valB = b[key] || "";

    if (key === "startDate" || key === "endDate") {
      const dA = valA ? new Date(valA) : new Date(0);
      const dB = valB ? new Date(valB) : new Date(0);
      return direction === "asc" ? dA - dB : dB - dA;
    }

    const textA = valA.toString().toLowerCase();
    const textB = valB.toString().toLowerCase();

    if (textA < textB) return direction === "asc" ? -1 : 1;
    if (textA > textB) return direction === "asc" ? 1 : -1;
    return 0;
  });
  /* Fin Ordenamiento */

  /* Inicio Filtros */
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = sortedTasks.filter((t) => {
    const matchesText =
      normalizedSearch === "" ||
      t.title.toLowerCase().includes(normalizedSearch) ||
      (t.description || "").toLowerCase().includes(normalizedSearch);

    const matchesPriority =
      filterPriority === "Todas" || t.priority === filterPriority;

    const matchesStatus =
      filterStatus === "Todos" || t.status === filterStatus;

    return matchesText && matchesPriority && matchesStatus;
  });
  /* Fin Filtros */

  /* Inicio Paginación */
  const totalTasks = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));

  useEffect(
    () => setCurrentPage(1),
    [searchTerm, filterPriority, filterStatus]
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageTasks = filteredTasks.slice(startIndex, startIndex + PAGE_SIZE);
  /* Fin Paginación */

  /* Inicio Panel Detalles */
  const openPanel = (task) => {
    setSelected(task);

    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditStart(task.startDate || "");
    setEditEnd(task.endDate || "");
  };

  const saveChanges = () => {
    if (!selected) return;

    const updated = {
      ...selected,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      status: editStatus,
      startDate: editStart,
      endDate: editEnd
    };

    updateTask(updated);
    setSelected(updated);
    showToast("Cambios guardados");
  };

  const closePanel = () => setSelected(null);
  /* Fin Panel Detalles */

  /* Inicio Fecha Vencida */
  const todayISO = new Date().toISOString().split("T")[0];
  /* Fin Fecha Vencida */

  /* Inicio Render Principal */
  return (
    <div className="backlog-container">

      {toast && <div className="toast">{toast}</div>}

      <div className="backlog-top">
        <div className="backlog-texts">
          <h2>Backlog de tareas</h2>
          <p className="subtitle">
            Administra, edita y organiza todas tus tareas en un mismo lugar.
          </p>
        </div>

        <button className="crear-btn" onClick={() => setOpenCreate(true)}>
          + Crear tarea
        </button>
      </div>

      <div className="backlog-filters">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="Todas">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Completada">Completada</option>
        </select>
      </div>

      <table className="backlog-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("title")}>
              Nombre {getSortArrow("title")}
            </th>

            <th onClick={() => requestSort("description")}>
              Descripción {getSortArrow("description")}
            </th>

            <th onClick={() => requestSort("priority")}>
              Prioridad {getSortArrow("priority")}
            </th>

            <th onClick={() => requestSort("status")}>
              Estado {getSortArrow("status")}
            </th>

            <th onClick={() => requestSort("startDate")}>
              Inicio {getSortArrow("startDate")}
            </th>

            <th onClick={() => requestSort("endDate")}>
              Final {getSortArrow("endDate")}
            </th>

            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          {pageTasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-tasks">
                No hay tareas para estos filtros.
              </td>
            </tr>
          ) : (
            pageTasks.map((task) => {
              const isExpired =
                task.endDate < todayISO && task.status !== "Completada";

              return (
                <tr
                  key={task.id}
                  onClick={() => openPanel(task)}
                  className={`${selected?.id === task.id ? "selected-row" : ""} ${isExpired ? "expired-row" : ""}`}
                >
                  <td>
                    {task.title}
                    {isExpired && <span className="expired-tag">Vencida</span>}
                  </td>

                  <td>{task.description || "-"}</td>

                  <td>
                    <span className={`tag prioridad-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span className={`tag estado-${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>
                  </td>

                  <td>{task.startDate || "-"}</td>
                  <td>{task.endDate || "-"}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="backlog-mobile-list">
        {pageTasks.length === 0 ? (
          <div className="no-tasks-mobile">
            No hay tareas para estos filtros.
          </div>
        ) : (
          pageTasks.map((task) => {
            const isExpired =
              task.endDate < todayISO && task.status !== "Completada";

            return (
              <div
                className={`task-card ${isExpired ? "expired-card" : ""}`}
                key={task.id}
                onClick={() => openPanel(task)}
              >
                <div className="task-card-header">
                  <span className="task-card-title">
                    {task.title}
                    {isExpired && <span className="expired-tag">Vencida</span>}
                  </span>

                  <div className="task-card-actions">
                    <button
                      className="round-icon-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPanel(task);
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="round-icon-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                <div className="task-card-row">
                  <span>Descripción:</span>
                  <span>{task.description || "-"}</span>
                </div>

                <div className="task-card-row">
                  <span>Prioridad:</span>
                  <span className={`tag prioridad-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="task-card-row">
                  <span>Estado:</span>
                  <span className={`tag estado-${task.status.toLowerCase().replace(" ", "-")}`}>
                    {task.status}
                  </span>
                </div>

                <div className="task-card-row">
                  <span>Inicio:</span>
                  <span>{task.startDate || "-"}</span>
                </div>

                <div className="task-card-row">
                  <span>Final:</span>
                  <span>{task.endDate || "-"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="backlog-pagination">
        <span className="backlog-count">
          {totalTasks === 0
            ? "Sin tareas"
            : `Mostrando ${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, totalTasks)} de ${totalTasks} tareas`}
        </span>

        <div className="backlog-page-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Anterior
          </button>

          <span className="page-indicator">
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

      <aside className={`detail-panel ${selected ? "active" : ""}`}>
        {!selected ? (
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

            <label>Descripción:</label>
            <textarea
              rows="3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
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

            <label>Fecha inicio:</label>
            <input
              type="date"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
            />

            <label>Fecha final:</label>
            <input
              type="date"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
            />

            <button className="save-btn" onClick={saveChanges}>
              Guardar cambios
            </button>
          </div>
        )}
      </aside>

      <CreateTaskModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={addTask}
      />

    </div>
  );
  /* Fin Render Principal */
}

export default Backlog;
