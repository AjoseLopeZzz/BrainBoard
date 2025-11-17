/* Inicio Imports */
import "./TaskCard.css";
/* Fin Imports */


function TaskCard({ title, priority, status, onClick }) {

  /* Inicio ClasesPrioridad */
  const priorityClass = {
    Alta: "prioridad-alta",
    Media: "prioridad-media",
    Baja: "prioridad-baja",
  }[priority] || "";
  /* Fin ClasesPrioridad */


  /* Inicio ClasesEstado */
  const statusClass = {
    Pendiente: "estado-pendiente",
    "En Progreso": "estado-progreso",
    Completada: "estado-completada",
  }[status] || "";
  /* Fin ClasesEstado */


  return (
    <>
      {/* Inicio Card */}
      <div className="task-card" onClick={onClick}>

        {/* Inicio Titulo */}
        <div className="task-title">{title}</div>
        {/* Fin Titulo */}

        {/* Inicio Tags */}
        <div className="task-tags">
          <span className={`tag ${priorityClass}`}>{priority}</span>
          <span className={`tag ${statusClass}`}>{status}</span>
        </div>
        {/* Fin Tags */}

      </div>
      {/* Fin Card */}
    </>
  );
}

export default TaskCard;
