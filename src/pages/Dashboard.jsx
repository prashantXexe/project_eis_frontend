import { useEffect, useState } from "react";
import LiveStream from "../components/LiveStream";
import RecentImages from "../components/RecentImages";
import AlertPopup from "../components/AlertPopup";

import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { app } from "../firebase";

const db = getFirestore(app);

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [alert, setAlert] = useState(null);

  // 🔐 LOGIN PROTECTION
  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔥 REAL-TIME LOGS
  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLogs(data);

      if (data[0]?.score > 4) {
        setAlert(data[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{
  marginLeft: "260px",
  height: "100vh",
  padding: "20px",
  overflow: "hidden", // 🔥 no scroll
  display: "flex",
  flexDirection: "column"
}}>
      <h2>Home</h2>

      {/* 🔥 GRID LAYOUT */}
      <div style={styles.grid}>

        {/* 🎥 Live Stream */}
        <div style={styles.card}>
          <LiveStream url="https://reason-sink-assignments-spectacular.trycloudflare.com/video" />
        </div>

        {/* 🖼️ Recent Images */}
        <div style={styles.card}>
          <RecentImages />
        </div>

        {/* 📊 Recent Logs */}
        <div style={styles.card}>
          <h3>Recent Logs</h3>

          <div style={styles.headerRow}>
            <span>Track</span>
            <span>Score</span>
            <span>Date</span>
            <span>Time</span>
          </div>

          {logs.map((log, i) => {
            const dateObj = log.timestamp?.seconds
              ? new Date(log.timestamp.seconds * 1000)
              : null;

            return (
              <div key={i} style={styles.row}>
                <span>{log.track_id}</span>
                <span>{log.score}</span>
                <span>{dateObj?.toLocaleDateString()}</span>
                <span>{dateObj?.toLocaleTimeString()}</span>
              </div>
            );
          })}
        </div>

        {/* 📈 Graph */}
        <div style={styles.card}>
          <h3>Detection Graph</h3>

          <div style={styles.graphBox}>
            Graph coming soon 📊
          </div>
        </div>

      </div>

      {/* 🚨 ALERT */}
      <AlertPopup alert={alert} onClose={() => setAlert(null)} />
    </div>
  );
}

// 🎨 STYLES
const styles = {
  grid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr", 
  gap: "20px",
  flex: 1, 
},

  card: {
    background: "#020617",
    padding: "8px",
    borderRadius: "10px",
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "14px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #1e293b",
    fontSize: "13px"
  },

  graphBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "14px"
  }
};
