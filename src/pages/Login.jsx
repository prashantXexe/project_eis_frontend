import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 🔍 Find user from Firestore
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage("❌ User not found");
        setLoading(false);
        return;
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;
      const role = userData.role;

      // 🔐 Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 📧 Email verification
      if (!user.emailVerified) {
        await sendEmailVerification(user);

        setMessage(
          "📧 Verification email sent. Please verify and come back."
        );

        setLoading(false);
        return;
      }

      // ✅ Save role + login
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      setMessage("✅ Login successful");

      setTimeout(() => {
  window.location.href = "/";
}, 1000);

    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage("❌ Wrong password");
      } else if (error.code === "auth/too-many-requests") {
        setMessage("⚠️ Too many attempts. Try later");
      } else {
        setMessage(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Surveillance Login</h2>
        <p style={styles.subtitle}>Secure Monitoring System</p>

        {/* Username */}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        {/* Password */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, marginBottom: "0" }}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.showBtn}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login"}
        </button>
      </div>

      {/* Popup */}
      {message && <div style={styles.popup}>{message}</div>}
    </div>
  );
}

// 🎨 Styles
const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "320px",
    padding: "30px",
    borderRadius: "12px",
    background: "#020617",
    boxShadow: "0 0 25px rgba(0,0,0,0.6)",
    textAlign: "center"
  },

  title: {
    color: "white",
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none"
  },

  showBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "13px"
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  },

  popup: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#1e293b",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)"
  }
};