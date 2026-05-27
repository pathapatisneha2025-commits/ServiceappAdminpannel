import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://medicurehospitaldatabase.onrender.com/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));

        alert("Login successful");
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>1 Tap Services Dashboard</p>

       <input
  style={styles.input}
  type="email"
  placeholder="Email"
  value={email}
  autoComplete="off"
  onChange={(e) => setEmail(e.target.value)}
/>
        {/* PASSWORD FIELD WITH EYE */}
     <div style={styles.inputWrapper}>
 <input
  style={styles.inputWithIcon}
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  autoComplete="new-password"
  onChange={(e) => setPassword(e.target.value)}
/>
  <span
    style={styles.eye}
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁"}
  </span>
</div>
        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f4f7fe",
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    marginBottom: "6px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1f2d3d",
  },

  subtitle: {
    marginBottom: "22px",
    fontSize: "12px",
    color: "#888",
  },

 inputWrapper: {
  position: "relative",
  marginBottom: "16px", // increase spacing between inputs
},

input: {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
},

// NEW IMPORTANT STYLE 👇
inputWithIcon: {
  width: "100%",
  padding: "12px 42px 12px 14px", // 👈 space for eye icon
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
},

eye: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px",
  userSelect: "none",
  color: "#666",
},

 
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3b5998",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    marginTop: "6px",
    transition: "0.2s",
  },
};