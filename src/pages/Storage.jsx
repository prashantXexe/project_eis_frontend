import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const storage = getStorage(app);

export default function Storage() {
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    const listRef = ref(storage, "detections/");
    const res = await listAll(listRef);

    const fileData = await Promise.all(
      res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url: url
        };
      })
    );

    setFiles(fileData);
  };

  useEffect(() => {
    loadFiles();

    // auto refresh every 5 sec
    const interval = setInterval(() => {
      loadFiles();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{
    marginLeft: "250px",
    padding: "20px" }}>
      <h2>Storage Images (Auto Updated)</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {files.map((file, i) => (
          <div key={i} className="card">

            <img
              src={file.url}
              width="100%"
              style={{ borderRadius: "10px" }}
            />

            <p style={{ fontSize: "12px", marginTop: "10px" }}>
              {file.name}
            </p>

            <a href={file.url} download target="_blank" rel="noreferrer">
              <button style={{ marginTop: "10px" }}>
                Download
              </button>
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}