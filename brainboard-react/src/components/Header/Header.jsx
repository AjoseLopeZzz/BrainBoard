/* Inicio Imports */
import "./Header.css";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
/* Fin Imports */


function Header({ onToggleSidebar }) {

  /* Inicio Render */
  return (
    <header className="topbar">

      {/* Inicio BotonMenu */}
      <div className="menu" onClick={onToggleSidebar}>
        <FaBars />
        <span className="panel-text">Mi Panel</span>
      </div>
      {/* Fin BotonMenu */}

      {/* Inicio Buscador */}
      <div className="search-container">
        <input type="text" placeholder="Buscar tareas..." />
        <FaSearch className="search-icon" />
      </div>
      {/* Fin Buscador */}

      {/* Inicio IconosDerecha */}
      <div className="icons">
        <FaBell />
        <img
          src="https://i.pravatar.cc/40"
          alt="Perfil"
          className="avatar"
        />
      </div>
      {/* Fin IconosDerecha */}

    </header>
  );
  /* Fin Render */
}

export default Header;
