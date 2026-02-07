import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import Attendance from "./components/Attendance";
import "./landing.css";

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) =>
    location.pathname === path ? "active fw-semibold" : "";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top glass-nav">
        <div className="container">
          {/* LOGO */}
          <Link
            className="navbar-brand fw-bold fs-4"
            to="/"
            onClick={closeMenu}
          >
            HRMS Lite
          </Link>

          {/* HAMBURGER */}
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* MENU */}
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-3">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/")}`}
                  to="/"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/add")}`}
                  to="/add"
                  onClick={closeMenu}
                >
                  Add Employee
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/employees")}`}
                  to="/employees"
                  onClick={closeMenu}
                >
                  Employees
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/attendance")}`}
                  to="/attendance"
                  onClick={closeMenu}
                >
                  Attendance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= ROUTES ================= */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/add"
          element={
            <Page>
              <EmployeeForm />
            </Page>
          }
        />

        <Route
          path="/employees"
          element={
            <Page>
              <EmployeeTable />
            </Page>
          }
        />

        <Route
          path="/attendance"
          element={
            <Page>
              <Attendance />
            </Page>
          }
        />
      </Routes>
    </>
  );
}

/* ================= HOME / LANDING ================= */

function Home() {
  return (
    <section className="hero-section d-flex align-items-center">
      <div className="container text-center text-white animate-fade">
        <h1 className="display-4 fw-bold">
          Modern HR Management <span className="text-accent">Simplified</span>
        </h1>

        <p className="lead mt-3 opacity-75">
          Manage employees, track attendance, and stay organized with a
          lightweight HRMS.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
          <Link to="/add" className="btn btn-primary btn-lg px-4">
            Add Employee
          </Link>

          <Link to="/employees" className="btn btn-outline-light btn-lg px-4">
            View Employees
          </Link>
        </div>

        {/* FEATURES */}
        <div className="row mt-5 g-4">
          <Feature
            title="Employee Management"
            text="Add, view and delete employees with validations and clean UI."
          />
          <Feature
            title="Attendance Tracking"
            text="Mark daily attendance and view present / absent history."
          />
          <Feature
            title="Production Ready"
            text="Deployed, responsive, error-handled and scalable."
          />
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE WRAPPER ================= */

function Page({ children }) {
  return (
    <main className="container page-container animate-slide">{children}</main>
  );
}

/* ================= FEATURE CARD ================= */

function Feature({ title, text }) {
  return (
    <div className="col-md-4">
      <div className="feature-card h-100">
        <h5>{title}</h5>
        <p className="opacity-75">{text}</p>
      </div>
    </div>
  );
}
