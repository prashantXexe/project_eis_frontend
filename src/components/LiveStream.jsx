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
          aspectRatio: "16 / 9",   // 🔥 maintain video ratio
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
            height: "100%",
            objectFit: "contain"  // 🔥 FULL video visible (no cut)
          }}
        />
      </div>
    </div>
  );
}
