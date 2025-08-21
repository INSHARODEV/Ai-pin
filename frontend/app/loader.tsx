import React from "react";

export default function Loader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      minHeight: 120,
    }}>
      <div style={{
        border: "6px solid #e0e0e0",
        borderTop: "6px solid #1976d2",
        borderRadius: "50%",
        width: 48,
        height: 48,
        animation: "spin 1s linear infinite"
      }} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
      <span style={{ marginLeft: 18, fontSize: 18, color: "#1976d2", fontWeight: 500 }}>
        Loading...
      </span>
    </div>
  );
}