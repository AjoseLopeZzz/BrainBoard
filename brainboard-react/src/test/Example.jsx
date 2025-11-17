import { useTasks } from "../context/TasksContext";

function Example() {
  const { tasks, addTask } = useTasks();

  return (
    <>
      <button onClick={() => addTask({
        id: Date.now(),
        title: "Tarea nueva",
        priority: "Alta",
        status: "Pendiente"
      })}>
        Agregar
      </button>

      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </>
  );
}

export default Example;
