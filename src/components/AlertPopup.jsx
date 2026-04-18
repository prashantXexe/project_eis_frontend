export default function AlertPopup({ alert, onClose }) {
  if (!alert) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      background: "red",
      padding: 20,
      borderRadius: 10
    }}>
      🚨 ALERT: {alert.label}
      <br />
      <button onClick={onClose}>Close</button>
    </div>
  );
}