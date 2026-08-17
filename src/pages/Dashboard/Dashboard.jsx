import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [showDepartments, setShowDepartments] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          navigate("/login", { replace: true });
          return;
        }

        setEmployee(data.employee);

        setActiveDepartment(
          data.employee.departments?.[0] || null
        );
      } catch (err) {
        console.error("EMPLOYEE LOAD ERROR:", err);

        setError(
          "Unable to load your employee information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [navigate]);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  }

  if (loading) {
    return (
      <main className="Dashboard Dashboard--loading">
        <div className="Dashboard__loading">
          <div className="Dashboard__loading-mark">
            HC
          </div>

          <span>Loading employee workspace</span>
        </div>
      </main>
    );
  }

  if (!employee) {
    return <Navigate to="/login" replace />;
  }

  const firstName =
    employee.name?.split(" ")[0] ||
    employee.name;

  const departments =
    employee.departments || [];

  return (
    <main className="Dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="Dashboard__sidebar">

        <div className="Dashboard__brand">
          <div className="Dashboard__brand-mark">
            HC
          </div>

          <div className="Dashboard__brand-copy">
            <strong>HUGE COMPANY</strong>
            <span>ORDERS</span>
          </div>
        </div>


        {/* ---------------------------------------------------
            NAVIGATION
        --------------------------------------------------- */}

        <nav className="Dashboard__nav">

          <div className="Dashboard__nav-section">
            <span className="Dashboard__nav-label">
              Workspace
            </span>

            <button
              className="Dashboard__nav-item Dashboard__nav-item--active"
              type="button"
            >
              <span className="Dashboard__nav-icon">
                ◫
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              className="Dashboard__nav-item"
              type="button"
            >
              <span className="Dashboard__nav-icon">
                □
              </span>

              <span>
                Orders
              </span>
            </button>
          </div>


          {/* -------------------------------------------------
              FIN
          ------------------------------------------------- */}

          {departments.includes("Fin") && (
            <div className="Dashboard__nav-section">

              <span className="Dashboard__nav-label">
                Fin
              </span>

              <button
                className="Dashboard__nav-item"
                type="button"
                onClick={() =>
                  navigate("/func/new/receipt")
                }
              >
                <span className="Dashboard__nav-icon">
                  +
                </span>

                <span>
                  New Receipt
                </span>
              </button>

            </div>
          )}

        </nav>


        {/* ===================================================
            EMPLOYEE
        =================================================== */}

        <div className="Dashboard__employee">

          <div className="Dashboard__employee-avatar">
            {employee.name
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="Dashboard__employee-info">

            <strong>
              {employee.name}
            </strong>

            <span>
              {employee.employeeId}
            </span>

          </div>


          {/* -------------------------------------------------
              THREE DOT MENU
          ------------------------------------------------- */}

          <button
            className="Dashboard__employee-menu"
            type="button"
            aria-label="Employee menu"
            onClick={() =>
              setShowDepartments(
                (current) => !current
              )
            }
          >
            •••
          </button>


          {showDepartments && (
            <div className="Dashboard__department-menu">

              <div className="Dashboard__department-heading">
                <span>
                  WORKING FOR
                </span>

                <strong>
                  {activeDepartment}
                </strong>
              </div>


              <div className="Dashboard__department-list">

                {departments.map(
                  (department) => (
                    <button
                      key={department}
                      type="button"
                      className={
                        department ===
                        activeDepartment
                          ? "Dashboard__department-option Dashboard__department-option--active"
                          : "Dashboard__department-option"
                      }
                      onClick={() => {
                        setActiveDepartment(
                          department
                        );

                        setShowDepartments(
                          false
                        );
                      }}
                    >
                      <span>
                        {department}
                      </span>

                      {department ===
                        activeDepartment && (
                        <span>
                          ✓
                        </span>
                      )}
                    </button>
                  )
                )}

              </div>


              {/* ------------------------------------------------
                  STARTER KITS
              ------------------------------------------------ */}

              {employee.starterKits && (
                <div className="Dashboard__starter-kits">

                  <span className="Dashboard__department-heading">
                    STARTER KITS
                  </span>

                  {departments.map(
                    (department) => {
                      const kit =
                        employee
                          .starterKits[
                          department
                        ];

                      if (!kit) {
                        return null;
                      }

                      return (
                        <div
                          className="Dashboard__starter-kit"
                          key={department}
                        >

                          <div>
                            <strong>
                              Huge Company Starter Kit:{" "}
                              {department}
                            </strong>

                            <span>
                              {kit.claimed
                                ? `Claimed ${
                                    kit.claimedAt ||
                                    ""
                                  }`
                                : "Not Claimed"}
                            </span>
                          </div>

                          <span
                            className={
                              kit.claimed
                                ? "Dashboard__kit-status Dashboard__kit-status--claimed"
                                : "Dashboard__kit-status"
                            }
                          >
                            {kit.claimed
                              ? "CLAIMED"
                              : "AVAILABLE"}
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

              <button
                className="Dashboard__logout"
                type="button"
                onClick={handleLogout}
              >
                Sign out
              </button>

            </div>
          )}

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="Dashboard__content">

        <header className="Dashboard__header">

          <div>

            <span className="Dashboard__eyebrow">
              {activeDepartment
                ? `${activeDepartment} · Employee Workspace`
                : "Employee Workspace"}
            </span>

            <h1>
              Good afternoon,{" "}
              <strong>{employee.name}</strong>
            </h1>

            <p>
              Employee ID ·{" "}
              <strong>
                {employee.employeeId}
              </strong>
            </p>

          </div>


          <div className="Dashboard__header-id">
            <span>
              EMPLOYEE ID
            </span>

            <strong>
              {employee.employeeId}
            </strong>
          </div>

        </header>


        {error && (
          <div className="Dashboard__error">
            {error}
          </div>
        )}


        {/* ===================================================
            DEPARTMENT CARDS
        =================================================== */}

        <section className="Dashboard__section">

          <div className="Dashboard__section-heading">

            <div>
              <span>
                YOUR DEPARTMENTS
              </span>

              <h2>
                Working for
              </h2>
            </div>

            <span className="Dashboard__department-count">
              {departments.length}{" "}
              {departments.length === 1
                ? "Department"
                : "Departments"}
            </span>

          </div>


          <div className="Dashboard__departments">

            {departments.map(
              (department) => (
                <button
                  type="button"
                  key={department}
                  className={
                    department ===
                    activeDepartment
                      ? "Dashboard__department-card Dashboard__department-card--active"
                      : "Dashboard__department-card"
                  }
                  onClick={() =>
                    setActiveDepartment(
                      department
                    )
                  }
                >

                  <span className="Dashboard__department-card-number">
                    {String(
                      departments.indexOf(
                        department
                      ) + 1
                    ).padStart(2, "0")}
                  </span>

                  <span className="Dashboard__department-card-name">
                    {department}
                  </span>

                  <span className="Dashboard__department-card-arrow">
                    →
                  </span>

                </button>
              )
            )}

          </div>

        </section>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="Dashboard__section">

          <div className="Dashboard__section-heading">

            <div>
              <span>
                QUICK ACTIONS
              </span>

              <h2>
                {activeDepartment} workspace
              </h2>
            </div>

          </div>


          <div className="Dashboard__actions">

            {activeDepartment === "Fin" && (
              <button
                type="button"
                className="Dashboard__action-card"
                onClick={() =>
                  navigate(
                    "/func/new/receipt"
                  )
                }
              >

                <span className="Dashboard__action-icon">
                  +
                </span>

                <span>
                  New Receipt
                </span>

                <small>
                  Create a new financial receipt
                </small>

                <strong>
                  →
                </strong>

              </button>
            )}

            <button
              type="button"
              className="Dashboard__action-card Dashboard__action-card--muted"
            >

              <span className="Dashboard__action-icon">
                □
              </span>

              <span>
                Orders
              </span>

              <small>
                View and manage your orders
              </small>

              <strong>
                →
              </strong>

            </button>

          </div>

        </section>

      </section>

    </main>
  );
}
