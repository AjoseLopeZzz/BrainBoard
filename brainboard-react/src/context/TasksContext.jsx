// src/context/TasksContext.js
import { createContext, useContext, useEffect, useState } from "react";

const TasksContext = createContext();

/* Inicio Hook */
export function useTasks() {
  return useContext(TasksContext);
}
/* Fin Hook */


/* Inicio Provider */
export function TasksProvider({ children }) {

  /* Inicio EstadoPrincipal */
  const [tasks, setTasks] = useState([]);
  /* Fin EstadoPrincipal */


  /* Inicio CargarLocalStorage */
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);
  /* Fin CargarLocalStorage */


  /* Inicio GuardarLocalStorage */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  /* Fin GuardarLocalStorage */


  /* Inicio CRUD */
  const addTask = (newTask) =>
    setTasks((prev) => [...prev, newTask]);

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };
  /* Fin CRUD */


  /* Inicio FiltrosBasicos */
  const filterByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  const filterByPriority = (priority) =>
    tasks.filter((t) => t.priority === priority);
  /* Fin FiltrosBasicos */


  /* Inicio FiltroDia */
  const filterByDate = (isoDate) => {
    if (!isoDate) return tasks;

    const target = new Date(isoDate);
    target.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.startDate && !task.endDate) return false;

      const start = task.startDate ? new Date(task.startDate) : null;
      const end = task.endDate ? new Date(task.endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (start && end) return target >= start && target <= end;
      if (start && !end) return target.getTime() === start.getTime();
      if (!start && end) return target.getTime() === end.getTime();

      return false;
    });
  };
  /* Fin FiltroDia */


  /* Inicio FiltroSemana */
  const filterByWeek = (isoDate) => {
    if (!isoDate) return tasks;

    const date = new Date(isoDate);
    const day = date.getDay();

    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return tasks.filter((task) => {
      if (!task.startDate && !task.endDate) return false;

      const start = task.startDate ? new Date(task.startDate) : null;
      const end = task.endDate ? new Date(task.endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (start && end) return end >= monday && start <= sunday;
      if (start && !end) return start >= monday && start <= sunday;
      if (!start && end) return end >= monday && end <= sunday;

      return false;
    });
  };
  /* Fin FiltroSemana */


  /* Inicio FiltroMes */
  const filterByMonth = (isoDate) => {
    if (!isoDate) return tasks;

    const d = new Date(isoDate);
    const year = d.getFullYear();
    const month = d.getMonth();

    const first = new Date(year, month, 1);
    first.setHours(0, 0, 0, 0);

    const last = new Date(year, month + 1, 0);
    last.setHours(23, 59, 59, 999);

    return tasks.filter((task) => {
      if (!task.startDate && !task.endDate) return false;

      const start = task.startDate ? new Date(task.startDate) : null;
      const end = task.endDate ? new Date(task.endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (start && end) return end >= first && start <= last;
      if (start && !end) return start >= first && start <= last;
      if (!start && end) return end >= first && end <= last;

      return false;
    });
  };
  /* Fin FiltroMes */


  /* Inicio Value */
  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,

    filterByStatus,
    filterByPriority,

    filterByDate,
    filterByWeek,
    filterByMonth,

    onCreate: addTask
  };
  /* Fin Value */


  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}
/* Fin Provider */
