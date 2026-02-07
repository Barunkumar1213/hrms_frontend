import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { api } from "../api";

/* ======================
   ZOD SCHEMA
====================== */
const attendanceSchema = z.object({
  employee_id: z.string().min(1, "Please select an employee"),
  date: z.string().min(1, "Please select a date"),
  status: z.enum(["Present", "Absent"]),
});

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { status: "Present" },
  });

  const employeeId = watch("employee_id");

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const res = await api.get("/employees", {
          params: { page: 1, limit: 100 }, // enough for dropdown
        });
        setEmployees(res.data.data);
      } catch (err) {
        toast.error("Failed to load employees");
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  /* ================= LOAD ATTENDANCE ================= */
  useEffect(() => {
    if (!employeeId) {
      setRecords([]);
      return;
    }
    loadAttendance(employeeId);
  }, [employeeId]);

  const loadAttendance = async (id) => {
    try {
      setLoadingRecords(true);
      const res = await api.get(`/attendance/${id}`);
      setRecords(res.data);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setLoadingRecords(false);
    }
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      await api.post("/attendance", data);
      toast.success("Attendance marked");
      reset({ ...data, date: "" });
      loadAttendance(data.employee_id);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to mark attendance";
      toast.error(message);
    }
  };

  const presentCount = records.filter((r) => r.status === "Present").length;

  /* ================= RENDER ================= */

  return (
    <div className="employee-form-page">
      <div className="row justify-content-center w-100">
        <div className="col-lg-8 col-md-10">
          <div className="card employee-card">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold text-center mb-4">Mark Attendance</h3>

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* EMPLOYEE */}
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${
                      errors.employee_id ? "is-invalid" : ""
                    }`}
                    {...register("employee_id")}
                    disabled={loadingEmployees}
                  >
                    <option value="">
                      {loadingEmployees
                        ? "Loading employees..."
                        : "Select Employee"}
                    </option>
                    {employees.map((e) => (
                      <option key={e.employee_id} value={e.employee_id}>
                        {e.full_name}
                      </option>
                    ))}
                  </select>
                  <label>Employee</label>
                  <div className="invalid-feedback">
                    {errors.employee_id?.message}
                  </div>
                </div>

                {/* DATE */}
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className={`form-control ${
                      errors.date ? "is-invalid" : ""
                    }`}
                    {...register("date")}
                  />
                  <label>Date</label>
                  <div className="invalid-feedback">{errors.date?.message}</div>
                </div>

                {/* STATUS */}
                <div className="form-floating mb-4">
                  <select
                    className={`form-select ${
                      errors.status ? "is-invalid" : ""
                    }`}
                    {...register("status")}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                  <label>Status</label>
                  <div className="invalid-feedback">
                    {errors.status?.message}
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Mark Attendance"}
                  </button>
                </div>
              </form>

              {/* RECORDS */}
              {employeeId && (
                <div className="mt-5">
                  <h5 className="fw-semibold mb-3">Attendance History</h5>

                  {loadingRecords ? (
                    <p className="text-muted">Loading records...</p>
                  ) : records.length === 0 ? (
                    <p className="text-muted">No records found</p>
                  ) : (
                    <>
                      <p className="fw-medium">
                        Total Present Days:{" "}
                        <span className="text-success">{presentCount}</span>
                      </p>

                      <ul className="list-group">
                        {records.map((r, i) => (
                          <li
                            key={i}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>{r.date}</span>
                            <span
                              className={`badge ${
                                r.status === "Present"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {r.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
