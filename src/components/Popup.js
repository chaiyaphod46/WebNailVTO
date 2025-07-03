// Popup.js
import React, { useState, useEffect } from "react";
import "./Popup.css";

function Popup({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>ขั้นตอนเตรียมพร้อมสำหรับ Try-On</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="popup-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "100px",
            }}
          >
            <img
              src="./hand/หลังมือตรง1.jpg"
              alt="รูปภาพการเตรียมพร้อม"
              className="popup-image"
            />
            <img
              src="./hand/หลังมือตรง2.jpg"
              alt="รูปภาพการเตรียมพร้อม"
              className="popup-image"
            />
          </div>

          <p>1. โชว์หลังมือผ่านกล้อง        2. งอเล็บเข้าหากล้อง</p>
        </div>
        <div className="popup-footer">
          <button onClick={onClose} className="confirm-button">
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
