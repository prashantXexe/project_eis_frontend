import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

export default function CreateUser() {
  const [users, setUsers] = useState([]);

  // 🔥 POPUPS
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // 🔥 FORM STATES
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // 🔐 ADMIN CHECK
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") window.location.href = "/";
  }, []);

  // 🔄 FETCH USERS
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ❌ DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  // ✏️ OPEN EDIT
  const openEdit = (u) => {
    setEditUser(u.id);
    setForm({
      username: u.username,
      email: u.email,
      role: u.role,
      password: ""
    });
  };

  // 🔄 UPDATE USER
  const handleUpdate = async () => {
    await updateDoc(doc(db, "users", editUser), {
      username: form.username,
      email: form.email,
      role: form.role
    });

    setEditUser(null);
    fetchUsers();
  };

  // ➕ CREATE USER
  const handleCreate = async () => {
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);

      await addDoc(collection(db, "users"), {
        username: form.username,
        email: form.email,
        role: form.role
      });

      setShowCreate(false);
      fetchUsers();

      // 🔥 Firebase logout fix
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 1000);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Admin Panel</h2>

        <button style={styles.createBtn} onClick={() => setShowCreate(true)}>
          + Create User
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.table}>
        <div style={styles.headerRow}>
          <span>Username</span>
          <span>Role</span>
          <span>Edit</span>
          <span>Delete</span>
        </div>

        {users.map((u) => (
          <div key={u.id} style={styles.row}>
            <span>{u.username}</span>
            <span>{u.role}</span>

            <button style={styles.editBtn} onClick={() => openEdit(u)}>
              Edit
            </button>

            <button style={styles.deleteBtn} onClick={() => handleDelete(u.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 CREATE MODAL */}
      {showCreate && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Create User</h3>

            <input placeholder="Username"
              onChange={(e)=>setForm({...form, username:e.target.value})}
              style={styles.input}/>

            <input placeholder="Email"
              onChange={(e)=>setForm({...form, email:e.target.value})}
              style={styles.input}/>

            <input type="password" placeholder="Password"
              onChange={(e)=>setForm({...form, password:e.target.value})}
              style={styles.input}/>

            <select
              onChange={(e)=>setForm({...form, role:e.target.value})}
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button style={styles.createBtn} onClick={handleCreate}>
              Create
            </button>

            <button style={styles.deleteBtn} onClick={()=>setShowCreate(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔥 EDIT MODAL */}
      {editUser && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit User</h3>

            <input value={form.username}
              onChange={(e)=>setForm({...form, username:e.target.value})}
              style={styles.input}/>

            <input value={form.email}
              onChange={(e)=>setForm({...form, email:e.target.value})}
              style={styles.input}/>

            <select value={form.role}
              onChange={(e)=>setForm({...form, role:e.target.value})}
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button style={styles.createBtn} onClick={handleUpdate}>
              Update
            </button>

            <button style={styles.deleteBtn} onClick={()=>setEditUser(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 STYLES
const styles = {
  page: {
    marginLeft: "260px",
    marginRight: "260px",
    padding: "20px",
    color: "white"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  createBtn: {
   background: "#2563eb",
  padding: "4px 12px",   // 🔥 height kam ho gayi
  fontSize: "12px",      // 🔥 text bhi small
  height: "30px",        // 🔥 fixed height
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
  },

  table: {
    background: "#020617",
    padding: "10px 20px",
    borderRadius: "10px"
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    fontWeight: "bold",
    borderBottom: "2px solid #1e293b",
    padding: "10px 0"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    padding: "12px 0",
    borderBottom: "1px solid #1e293b",
    alignItems: "center"
  },

  editBtn: {
  background: "#f59e0b",
  border: "none",
  padding: "4px 8px",   // 🔥 smaller
  fontSize: "12px",     // 🔥 smaller text
  borderRadius: "4px",
  cursor: "pointer",
  width: "70px"         // 🔥 fixed small width
},

deleteBtn: {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "4px 8px",
  fontSize: "12px",
  borderRadius: "4px",
  cursor: "pointer",
  width: "70px"
},

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#020617",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white"
  }
};