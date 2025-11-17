import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import { TasksProvider } from "./context/TasksContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <AppRouter />
    </TasksProvider>
  </React.StrictMode>
)
