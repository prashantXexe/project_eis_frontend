export default function LiveStream({ url }) {
  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "#020617",
        padding: "0px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}
    >
      <h4 style={{ marginBottom: "8px", padding: "8px" }}>
        Live Stream
      </h4>

      <div
        style={{
          flex: 1,
          background: "#000",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <iframe
          src={url || import.meta.env.VITE_STREAM_URL}
          title="Live Stream"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            objectFit: "contain" // ✅ full video visible
          }}
        />
      </div>
    </div>
  );
}
