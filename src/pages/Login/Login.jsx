import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import "./Login.scss";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY;


export default function Login() {
  const recaptchaRef =
    useRef(null);

  const [form, setForm] = useState({
    employeeId: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (
    event
  ) => {
    setForm((current) => ({
      ...current,

      [event.target.name]:
        event.target.value,
    }));

    setError("");
  };


  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!RECAPTCHA_SITE_KEY) {
      setError(
        "reCAPTCHA is not configured."
      );

      return;
    }

    const recaptchaToken =
      recaptchaRef.current?.getValue();

    if (!recaptchaToken) {
      setError(
        "Please complete the human verification."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              employeeId:
                form.employeeId,

              password:
                form.password,

              recaptchaToken,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to sign in."
        );
      }

      window.location.href =
        "/dashboard";

    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in."
      );

      recaptchaRef.current?.reset();

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="Login">
      <section className="Login__panel">

        <div className="Login__brand">
          <div className="Login__brand-mark">
            HC
          </div>

          <div>
            <strong>
              HUGE COMPANY
            </strong>

            <span>
              ORDERS
            </span>
          </div>
        </div>


        <div className="Login__heading">
          <span>
            EMPLOYEE ACCESS
          </span>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to continue to
            Huge Company Orders.
          </p>
        </div>


        <form
          className="Login__form"
          onSubmit={handleLogin}
        >

          <label>
            <span>
              Employee ID
            </span>

            <input
              type="text"
              name="employeeId"
              value={
                form.employeeId
              }
              onChange={
                updateField
              }
              placeholder="HC000001"
              autoComplete="username"
              autoCapitalize="characters"
              spellCheck="false"
              required
            />
          </label>


          <label>
            <span>
              Password
            </span>

            <input
              type="password"
              name="password"
              value={
                form.password
              }
              onChange={
                updateField
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>


          <div className="Login__recaptcha">
            {RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={
                  RECAPTCHA_SITE_KEY
                }
              />
            ) : (
              <span>
                reCAPTCHA is not configured.
              </span>
            )}
          </div>


          {error && (
            <div
              className="
                Login__message
                Login__message--error
              "
            >
              {error}
            </div>
          )}


          <button
            className="Login__button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Continue"}
          </button>

        </form>


        <footer className="Login__footer">
          <span>
            HUGE COMPANY
          </span>

          <span>
            Secure employee access
          </span>
        </footer>

      </section>
    </main>
  );
}