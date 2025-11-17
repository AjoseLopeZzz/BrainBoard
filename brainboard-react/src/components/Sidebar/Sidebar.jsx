/* Inicio Imports */
import "./Sidebar.css";
import {
  FaTimes,
  FaHome,
  FaListUl,
  FaBrain,
  FaCalendarAlt,
  FaCheckCircle,
  FaTasks
} from "react-icons/fa";

import { Link } from "react-router-dom";
/* Fin Imports */


function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "active" : ""}`}>

      {/* Inicio BotonCerrar */}
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      {/* Fin BotonCerrar */}


      {/* Inicio Logo */}
      <div className="logo-section">
        <img
          src="/BrainBoard.svg"
          alt="Brain Board Logo"
          className="sidebar-logo"
        />
        <span className="logo-text">Brain Board</span>
      </div>
      {/* Fin Logo */}


      {/* Inicio Menu */}
      <nav className="sidebar-menu">

        <Link to="/" onClick={onClose}>
          <FaHome /> Mi Panel
        </Link>

        <Link to="/backlog" onClick={onClose}>
          <FaListUl /> Backlog
        </Link>

        <Link to="/kanban" onClick={onClose}>
          <FaTasks /> Pendientes
        </Link>

        <Link to="/calendar" onClick={onClose}>
          <FaCalendarAlt /> Calendario
        </Link>

      </nav>
      {/* Fin Menu */}


      {/* Inicio Divisor */}
      <div className="sidebar-divider"></div>
      {/* Fin Divisor */}


      {/* Inicio Logout */}
      <div className="logout-section">
        <a href="#" className="logout">
          <FaCheckCircle /> Abandonar
        </a>
      </div>
      {/* Fin Logout */}

    </aside>
  );
}

export default Sidebar;
