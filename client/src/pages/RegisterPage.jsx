import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return "Name, email, and password are required.";
    }

    if (form.name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Password and confirm password must match.";
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
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create your ShopEase account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
            required
          />
        </label>

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

        <label className="block text-sm font-medium text-slate-700">
          Confirm Password
          <div className="mt-1 flex gap-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className="rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already registered? <Link to="/login" className="font-semibold text-[var(--brand)]">Sign in</Link>
      </p>
    </section>
  );
}
