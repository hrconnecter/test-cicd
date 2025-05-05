import React from "react";
import XenAegis from "../../../assets/XenAegis.png";

const ChatButton = ({ toggleChat, isRotating }) => (
  <button
    onClick={toggleChat}
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "transparent",
      border: "none",
      width: "100px",
      height: "100px",
      cursor: "pointer",
      padding: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transform: isRotating ? "rotateY(360deg)" : "none",
      transition: "transform 0.5s ease-in-out",
      zIndex : 1000,
    }}
  >
    <img
      src={XenAegis}
      alt="Chat"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </button>
);

export default ChatButton;
