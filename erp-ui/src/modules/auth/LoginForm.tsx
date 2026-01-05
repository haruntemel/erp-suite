import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Style tipleri
interface StyleMap {
  container: React.CSSProperties;
  loginBox: React.CSSProperties;
  logo: React.CSSProperties;
  logoText: React.CSSProperties;
  logoSubtitle: React.CSSProperties;
  form: React.CSSProperties;
  inputGroup: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  error: React.CSSProperties;
  button: React.CSSProperties;
  footer: React.CSSProperties;
}

const styles: StyleMap = {
  container: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  loginBox: {
    background: "rgba(30, 41, 59, 0.9)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
    border: "1px solid #334155",
  },
  logo: { textAlign: "center", marginBottom: "30px" },
  logoText: { color: "#38bdf8", fontSize: "2.5rem", marginBottom: "10px" },
  logoSubtitle: { color: "#94a3b8" },
  form: { width: "100%" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", color: "#cbd5e1", marginBottom: "8px", fontWeight: 500 },
  input: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1e293b",
    border: "1px solid #475569",
    borderRadius: "10px",
    color: "#f1f5f9",
    fontSize: "1rem",
    transition: "all 0.3s",
  },
  error: {
    color: "#f87171",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "1.1rem",
    fontWeight: 600,
    transition: "all 0.3s",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  footer: { textAlign: "center", marginTop: "25px", color: "#64748b", fontSize: "0.9rem" },
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend'e login isteği
      const res = await axios.post("/api/auth/login", { username, password });

      const { token, user } = res.data;

      // Token içindeki role claim'ini decode et
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // localStorage'a kaydet
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role,
        })
      );

      // Dashboard'a yönlendir
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>ERP Suite</h1>
          <p style={styles.logoSubtitle}>
            Enterprise Resource Planning Application
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login to Dashboard
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>ERP Suite Login</p>
          <p>v2.1 | Responsive Design</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;