import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Storage from "./pages/Storage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import CreateUser from "./pages/CreateUser";

// 🔥 wrapper to control navbar visibility
function Layout() {
  const location = useLocation();

  // ❌ hide navbar on login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/storage" element={<Storage />} />

        {/* 🔥 FIX HERE */}
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}