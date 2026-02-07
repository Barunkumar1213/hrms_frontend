import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [meta, setMeta] = useState({
    page: 1,
    total_pages: 1,
    total: 0,
  });

  const loadEmployees = async (pageNo = page) => {
    try {
      setLoading(true);
      const res = await api.get("/employees", {
        params: { page: pageNo, limit },
      });
      setEmployees(res.data.data);
      setMeta(res.data.meta);
      setPage(pageNo);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees(1);
  }, []);

  /* ================= DELETE WITH TOAST CONFIRM ================= */

  const confirmDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-2 fw-semibold">
            Are you sure you want to delete this employee?
          </p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-light" onClick={closeToast}>
              Cancel
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                closeToast();
                deleteEmployee(id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false },
    );
  };

  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted");

      if (employees.length === 1 && page > 1) {
        loadEmployees(page - 1);
      } else {
        loadEmployees(page);
      }
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading employees...</p>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="alert alert-info text-center">No employees found</div>
    );
  }

  /* ================= TABLE ================= */

  return (
    <div className="card employee-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-semibold mb-0">Employees</h3>
        <span className="badge bg-primary-subtle text-primary">
          Total: {meta.total}
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td className="fw-medium">{emp.employee_id}</td>
                <td>{emp.full_name}</td>
                <td className="text-muted small">{emp.email}</td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary">
                    {emp.department}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-danger px-3"
                    onClick={() => confirmDelete(emp.employee_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary rounded-pill px-4"
          disabled={page === 1}
          onClick={() => loadEmployees(page - 1)}
        >
          ◀ Prev
        </button>

        <span className="text-muted small">
          Page <strong>{meta.page}</strong> of{" "}
          <strong>{meta.total_pages}</strong>
        </span>

        <button
          className="btn btn-outline-secondary rounded-pill px-4"
          disabled={page === meta.total_pages}
          onClick={() => loadEmployees(page + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
