export default function LiveStream({ url }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#020617",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}
    >
      <h4 style={{ marginBottom: "10px" }}>Live Stream</h4>

      {/* 🔥 Square Container */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",   // ✅ square box
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
            transform: "scale(0.75)",   // 🔥 zoom out to fit
            transformOrigin: "top left"
          }}
        />
      </div>
    </div>
  );
}
