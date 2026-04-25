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
import "../styles.css";
import hero from "../assets/hero.png";

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
        setMessage("User not found");
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
        setMessage("Verify your email first");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      setMessage("Login successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage("Wrong password");
      } else {
        setMessage(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">

      {/* Background */}
      <div className="bg-overlay"></div>

      {/* Card */}
      <div className="login-box">
        <img src={hero} alt="logo" className="logo" />

        <h2>Surveillance System</h2>
        <p className="subtitle">Secure Access Portal</p>

        {/* Username */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* Button */}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>

      {/* Toast */}
      {message && <div className="toast">{message}</div>}
    </div>
  );
}
