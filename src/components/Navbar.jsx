import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  console.log("NAV ROLE:", role);

  return (
    <div style={{
      width: "200px",
      height: "100vh",
      background: "#020617",
      color: "white",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0
    }}>
      <h2>Menu</h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginTop: "20px"
      }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/logs" style={linkStyle}>Logs</Link>
        <Link to="/storage" style={linkStyle}>Storage</Link>

        {/* 🔥 ADMIN ONLY */}
        {role === "admin" && (
          <Link to="/create-user" style={linkStyle}>
            Create User
          </Link>
        )}

        <button onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }} style={{linkStyle, background: "red"}}>
          Logout
        </button>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px",
  background: "#1e293b",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};