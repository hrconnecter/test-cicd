import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ChatHeader = ({ toggleChat }) => (
  <div
    style={{
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px",
      fontWeight: "bold",
      fontSize: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    XenAegis
    <button
      onClick={toggleChat}
      style={{
        background: "none",
        border: "none",
        color: "white",
        cursor: "pointer",
      }}
    >
      <CloseIcon />
    </button>
  </div>
);

export default ChatHeader;
