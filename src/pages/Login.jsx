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

      setMessage("Login successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">

      <div className="login-card">
        <h2>Surveillance System</h2>
        <p className="subtitle">Secure Access Portal</p>

        {/* Username */}
        <div className="form-group">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Username</label>
        </div>

        {/* Password */}
        <div className="form-group">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>

          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* Button */}
        <button className="login-btn" onClick={handleLogin}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </div>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}
