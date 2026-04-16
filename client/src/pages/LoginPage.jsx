import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = location.state?.from || "/";

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return "Email and password are required.";
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back to ShopEase.</p>
      {location.state?.from && (
        <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Please login to continue to {location.state.from}.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <div className="mt-1 flex gap-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        New user? <Link to="/register" className="font-semibold text-[var(--brand)]">Create account</Link>
      </p>
    </section>
  );
}
