import React, { useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const ChatInput = ({ userInput, setUserInput, handleSend, setAttachments, attachments, previews, setPreviews}) => {
  

  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const empId = user?._id;

  useEffect(() => {
    // Clear local previews when attachments are cleared
    if (attachments.length === 0) {
      setPreviews([]);
    }
  }, [attachments, setPreviews]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const url = await uploadAttachment(file); // Upload the file
          return { name: file.name, url, preview: URL.createObjectURL(file) }; // Generate preview
        })
      );

      setAttachments((prev) => [...prev, ...uploadedFiles]); // Append new attachments
      setPreviews((prev) => [...prev, ...uploadedFiles]); // Update previews for display
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
  };

  const handleRemoveAttachment = (name) => {
    setAttachments((prev) => prev.filter((file) => file.name !== name));
    setPreviews((prev) => prev.filter((file) => file.name !== name));
  };

  const uploadAttachment = async (file) => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    try {
      const { data: { url } } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/ticketAttachment-${empId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken, // Replace `authToken` with the token from your context or state
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return url.split("?")[0];
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw new Error("Failed to upload the image.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderTop: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "10px",
          gap: "10px",
          overflowX: "auto",
        }}
      >
        {previews.map((file) => (
          <div
            key={file.name}
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={file.preview}
              alt={file.name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() => handleRemoveAttachment(file.name)}
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                backgroundColor: "red",
                border: "none",
                borderRadius: "50%",
                color: "white",
                width: "20px",
                height: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <CloseIcon style={{ fontSize: "14px" }} />
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput && setUserInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <label
          htmlFor="attachment-upload"
          style={{
            marginRight: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AttachFileIcon style={{ color: "#007bff" }} />
          <input
            id="attachment-upload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <button
          onClick={handleSend}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
