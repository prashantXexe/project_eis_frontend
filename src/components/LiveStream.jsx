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

      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
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
            width: "140%",        // 🔥 zoom out effect
            height: "140%",
            border: "none",
            position: "absolute",
            top: "-20%",          // 🔥 center vertically
            left: "-20%"          // 🔥 center horizontally
          }}
        />
      </div>
    </div>
  );
}
