/* Inicio Imports */
import { useState } from "react";
import "./Kanban.css";

import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard/TaskCard";
import CreateTaskModal from "../components/Modal/CreateTaskModal";
import EditTaskModal from "../components/Modal/EditTaskModal";
/* Fin Imports */


function Kanban() {

  /* Inicio EstadoGlobal */
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  /* Fin EstadoGlobal */


  /* Inicio EstadosLocales */
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  /* Fin EstadosLocales */


  /* Inicio OrdenarPrioridad */
  const priorityOrder = { "Alta": 1, "Media": 2, "Baja": 3 };

  const sortByPriority = (arr) =>
    [...arr].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  /* Fin OrdenarPrioridad */


  /* Inicio Clasificación */
  const pendientes = sortByPriority(tasks.filter(t => t.status === "Pendiente"));
  const progreso   = sortByPriority(tasks.filter(t => t.status === "En Progreso"));
  const completas  = sortByPriority(tasks.filter(t => t.status === "Completada"));
  /* Fin Clasificación */


  /* Inicio DragDrop */
  const onDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const onDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === id);

    if (!task) return;
    updateTask({ ...task, status: newStatus });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };
  /* Fin DragDrop */


  /* Inicio AbrirEdicion */
  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setOpenEdit(true);
  };
  /* Fin AbrirEdicion */


  /* Inicio LimpiarCompletadas */
  const removeCompleted = () => {
    completas.forEach(t => deleteTask(t.id));
  };
  /* Fin LimpiarCompletadas */


  return (
    <div className="kanban-container">

      {/* Inicio Header */}
      <div className="kanban-top">

        <div className="kanban-titles">
          <h2>Vista de tareas por progreso</h2>
          <p className="kanban-subtitle">
            Organiza tus tareas visualmente moviéndolas entre columnas según su progreso.
          </p>
        </div>

        <div className="kanban-actions">
          <button className="crear-btn" onClick={() => setOpenCreate(true)}>
            + Crear tarea
          </button>

          <button className="clean-btn" onClick={removeCompleted}>
            Limpiar completadas
          </button>
        </div>

      </div>
      {/* Fin Header */}


      {/* Inicio Columnas */}
      <div className="kanban-board">

        {/* Inicio Pendiente */}
        <div
          className="kanban-column"
          onDragOver={allowDrop}
          onDrop={(e) => onDrop(e, "Pendiente")}
        >
          <h3>Pendiente</h3>

          <div className="kanban-list">
            {pendientes.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                priority={task.priority}
                status={task.status}
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onClick={() => handleOpenEdit(task)}
              />
            ))}
          </div>
        </div>
        {/* Fin Pendiente */}


        {/* Inicio EnProgreso */}
        <div
          className="kanban-column"
          onDragOver={allowDrop}
          onDrop={(e) => onDrop(e, "En Progreso")}
        >
          <h3>En Progreso</h3>

          <div className="kanban-list">
            {progreso.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                priority={task.priority}
                status={task.status}
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onClick={() => handleOpenEdit(task)}
              />
            ))}
          </div>
        </div>
        {/* Fin EnProgreso */}


        {/* Inicio Completada */}
        <div
          className="kanban-column"
          onDragOver={allowDrop}
          onDrop={(e) => onDrop(e, "Completada")}
        >
          <h3>Completada</h3>

          <div className="kanban-list">
            {completas.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                priority={task.priority}
                status={task.status}
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onClick={() => handleOpenEdit(task)}
              />
            ))}
          </div>
        </div>
        {/* Fin Completada */}

      </div>
      {/* Fin Columnas */}


      {/* Inicio Modales */}
      <CreateTaskModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={addTask}
      />

      <EditTaskModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        task={taskToEdit}
        onSave={updateTask}
      />
      {/* Fin Modales */}

    </div>
  );
}

export default Kanban;
