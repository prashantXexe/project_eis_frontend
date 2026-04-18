export default function LiveStream({ url }) {
  return (
    <div
      style={{
        width: "100%",
        height: "300px",              // 🔥 SAME HEIGHT
        background: "#020617",
        padding: "0px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}
    >
      <h4 style={{ marginBottom: "8px" }}>Live Stream</h4>

      <div
        style={{
          flex: 1,                   // 🔥 FILL FULL HEIGHT
          background: "#000",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <img
          src={url || import.meta.env.VITE_STREAM_URL}
          alt="Live Stream"
          style={{
            width: "100%",
            height: "100%",          // 🔥 IMPORTANT
            objectFit: "cover"
          }}
        />
      </div>
    </div>
  );
}