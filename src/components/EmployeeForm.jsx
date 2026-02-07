import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { api } from "../api";

/* ======================
   ZOD SCHEMA
====================== */
const employeeSchema = z.object({
  employee_id: z.string().min(2, "Employee ID is required"),
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
});

export default function EmployeeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/employees", data);
      toast.success("Employee added successfully");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add employee");
    }
  };

  return (
    <div className="employee-form-page">
      <div className="row justify-content-center w-100">
        <div className="col-lg-7 col-md-10">
          <div className="card employee-card">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold text-center mb-4">Add New Employee</h3>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* EMPLOYEE ID */}
                <div className="form-floating mb-3">
                  <input
                    className={`form-control ${
                      errors.employee_id ? "is-invalid" : ""
                    }`}
                    placeholder="Employee ID"
                    {...register("employee_id")}
                  />
                  <label>Employee ID</label>
                  <div className="invalid-feedback">
                    {errors.employee_id?.message}
                  </div>
                </div>

                {/* FULL NAME */}
                <div className="form-floating mb-3">
                  <input
                    className={`form-control ${
                      errors.full_name ? "is-invalid" : ""
                    }`}
                    placeholder="Full Name"
                    {...register("full_name")}
                  />
                  <label>Full Name</label>
                  <div className="invalid-feedback">
                    {errors.full_name?.message}
                  </div>
                </div>

                {/* EMAIL */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    {...register("email")}
                  />
                  <label>Email Address</label>
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* DEPARTMENT */}
                <div className="form-floating mb-4">
                  <input
                    className={`form-control ${
                      errors.department ? "is-invalid" : ""
                    }`}
                    placeholder="Department"
                    {...register("department")}
                  />
                  <label>Department</label>
                  <div className="invalid-feedback">
                    {errors.department?.message}
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
