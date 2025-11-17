/* Inicio Imports */
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
/* Fin Imports */


/* Inicio AppPrincipal */
function App() {

  /* Inicio EstadoSidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /* Fin EstadoSidebar */


  return (
    <>
      {/* Inicio Header */}
      <Header onToggleSidebar={() => setSidebarOpen(true)} />
      {/* Fin Header */}


      {/* Inicio Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Fin Sidebar */}


      {/* Inicio ContenidoPrincipal */}
      <main className={sidebarOpen ? "main shift" : "main"}>
        <Outlet />
      </main>
      {/* Fin ContenidoPrincipal */}
    </>
  );
}
/* Fin AppPrincipal */


export default App;
