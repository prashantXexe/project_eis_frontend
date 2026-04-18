import { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "detections"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLogs(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container" style={{
    marginLeft: "250px",
    padding: "20px" }}>
      <h2>Logs (Live)</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#1e293b",
        borderRadius: "10px"
      }}>
        <thead>
          <tr style={{ background: "#020617" }}>
            <th style={thStyle}>Track ID</th>
            <th style={thStyle}>Score</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Image</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => {
            const dateObj = log.timestamp?.seconds
              ? new Date(log.timestamp.seconds * 1000)
              : null;

            return (
              <tr key={i} style={{
                background: i % 2 === 0 ? "#1e293b" : "#0f172a",
                textAlign: "center"
              }}>
                <td style={tdStyle}>{log.track_id}</td>
                <td style={tdStyle}>{log.score}</td>
                <td style={tdStyle}>{dateObj?.toLocaleDateString()}</td>
                <td style={tdStyle}>{dateObj?.toLocaleTimeString()}</td>
                <td style={tdStyle}>
                  <a href={log.image_url} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #334155"
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #334155"
};