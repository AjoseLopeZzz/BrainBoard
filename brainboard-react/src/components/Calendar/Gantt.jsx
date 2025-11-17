/* Inicio Imports */
import "./Calendar.css";
/* Fin Imports */


/* Inicio UtilLocalDate */
function toLocalDate(iso) {
  if (!iso) return new Date();
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}
/* Fin UtilLocalDate */


/* Inicio Helpers */
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function format(date) {
  return date.toISOString().split("T")[0];
}
/* Fin Helpers */


/* Inicio ComponenteGantt */
export default function Gantt({ view, date, tasks, onTaskClick }) {

  /* Inicio VistaTodas */
  if (view === "all") {
    return (
      <div className="gantt-container">
        <div className="gantt-header"><h2>Todas las tareas</h2></div>

        <div className="all-table">
          <table className="all-tasks-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Final</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} onClick={() => onTaskClick(t)}>
                  <td>{t.title}</td>
                  <td>{t.priority}</td>
                  <td>{t.status}</td>
                  <td>{t.startDate || "-"}</td>
                  <td>{t.endDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  /* Fin VistaTodas */


  /* Inicio CalculoDias */
  const localDate = toLocalDate(date);

  let daysToShow = [];

  if (view === "day") daysToShow = [localDate];

  if (view === "week") {
    const start = getStartOfWeek(localDate);
    daysToShow = [...Array(7)].map((_, i) => addDays(start, i));
  }

  if (view === "month") {
    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const total = new Date(year, month + 1, 0).getDate();
    daysToShow = [...Array(total)].map((_, i) => new Date(year, month, i + 1));
  }

  const taskCoversDate = (task, day) => {
    if (!task.startDate || !task.endDate) return false;

    const d = new Date(day);
    const start = toLocalDate(task.startDate);
    const end = toLocalDate(task.endDate);

    return d >= start && d <= end;
  };

  const getPriorityColor = (priority) => {
    if (priority === "Alta") return "#ef4444";
    if (priority === "Media") return "#f59e0b";
    return "#3b82f6";
  };
  /* Fin CalculoDias */


  /* Inicio Render */
  return (
    <div className="gantt-container">


      {/* Inicio Header */}
      <div className="gantt-header">
        {view === "day" && <h2>Día seleccionado</h2>}
        {view === "week" && <h2>Semana de {format(daysToShow[0])}</h2>}
        {view === "month" && <h2>Mes</h2>}
      </div>
      {/* Fin Header */}


      {/* Inicio VistaEscritorio */}
      <div className="gantt-grid desktop-only">

        <div className="gantt-grid-header">Tarea</div>

        {daysToShow.map((d, i) => (
          <div key={i} className="gantt-grid-header">
            {view === "month"
              ? d.getDate()
              : d.toLocaleDateString("es-CO", {
                  weekday: "short",
                  day: "numeric",
                })}
          </div>
        ))}

        {tasks.map((task) => (
          <div className="gantt-row" key={task.id}>

            <div className="gantt-task-title" onClick={() => onTaskClick(task)}>
              {task.title}
            </div>

            {daysToShow.map((d, index) => (
              <div key={index} className="gantt-day-cell">
                {taskCoversDate(task, d) && (
                  <div
                    className="gantt-block"
                    onClick={() => onTaskClick(task)}
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {(index === 0 ||
                      !taskCoversDate(task, addDays(d, -1))) &&
                      task.title}
                  </div>
                )}
              </div>
            ))}

          </div>
        ))}
      </div>
      {/* Fin VistaEscritorio */}


      {/* Inicio VistaMobile */}
      <div className="gantt-mobile-wrapper mobile-only">
        <div className="gantt-mobile-table">

          <div className="gantt-mobile-row gantt-mobile-days-row">
            <div className="gantt-mobile-cell title-col"></div>

            {daysToShow.map((d, i) => (
              <div className="gantt-mobile-cell day-col" key={i}>
                {d.toLocaleDateString("es-CO", {
                  weekday: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>

          {tasks.map((task) => (
            <div className="gantt-mobile-row" key={task.id}>
              <div className="gantt-mobile-cell title-col">{task.title}</div>

              {daysToShow.map((d, index) => (
                <div className="gantt-mobile-cell day-col" key={index}>
                  {taskCoversDate(task, d) && (
                    <div
                      className="gantt-mobile-block"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                      onClick={() => onTaskClick(task)}
                    >
                      {(index === 0 ||
                        !taskCoversDate(task, addDays(d, -1))) &&
                        task.title}
                    </div>
                  )}
                </div>
              ))}

            </div>
          ))}

        </div>
      </div>
      {/* Fin VistaMobile */}


    </div>
  );
  /* Fin Render */
}
