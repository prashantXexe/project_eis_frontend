import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export default function RecentImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setImages(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
    width: "100%",
    height: "300px",      // 🔥 SAME HEIGHT
    background: "#020617",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)"
  }}
    >
      <h4 style={{ marginBottom: "10px" }}>Recent Captures</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px"
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.image_url}
            alt="capture"
            style={{
              width: "100%",
              height: "100px",
              objectFit: "contain",
              borderRadius: "8px",
              cursor: "pointer"
            }}
            onClick={() => window.open(img.image_url)}
          />
        ))}
      </div>
    </div>
  );
}