import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Backlog from "./pages/Backlog";
import CalendarPage from "./pages/CalendarPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
