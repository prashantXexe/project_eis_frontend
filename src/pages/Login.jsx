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

const auth = getAuth(app);
const db = getFirestore(app);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setMessage("📧 Verification email sent. Please verify first.");
        setLoading(false);
        return;
      }

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
        <h2 style={styles.title}>🛡 Surveillance System</h2>
        <p style={styles.subtitle}>Secure Monitoring Login</p>

        {/* Username */}
        <div style={styles.inputGroup}>
          <input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.showBtn}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      {/* Toast Message */}
      {message && <div style={styles.popup}>{message}</div>}
    </div>
  );
}

// 🎨 MODERN UI STYLES
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(-45deg, #0f172a, #020617, #1e293b, #020617)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 12s ease infinite"
  },

  card: {
    width: "360px",
    padding: "35px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    textAlign: "center"
  },

  title: {
    color: "#fff",
    marginBottom: "5px",
    fontWeight: "600",
    fontSize: "20px"
  },

  subtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "25px"
  },

  inputGroup: {
    position: "relative",
    marginBottom: "15px"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s"
  },

  showBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#cbd5f5"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px"
  },

  popup: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(30, 41, 59, 0.9)",
    backdropFilter: "blur(10px)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
    fontSize: "14px"
  }
};
