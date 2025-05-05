import React from "react";
import XenAegis from "../../../assets/XenAegis.png";
import { useQuery } from "react-query";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";
import { Button, Grid } from "@mui/material";
import { PersonOutline } from "@mui/icons-material";


const ChatMessages = ({ chat, handleOptionClick, isTyping, chatEndRef }) => {
  const { authToken } = useGetUser();

  const { data } = useQuery(
    "emp-profile",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/populate/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.emp;
    },
    {
      onSuccess: () => {},
    }
  );

  const userimage = data?.user_logo_url;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px",
      }}
    >
    <Grid container spacing={2} md={12}>
    {chat.map((message, index) =>
        message.isOption ? (
         <>
            <Grid
            key={index}
            item md={4} 
            
          >
            {message.isOption && (
            <Button
                  onClick={() => handleOptionClick(message.text)}
                  style={{
                    padding: "5px",
                    borderRadius: "15px",
                    border: "1px solid #007bff",
                    backgroundColor: "white",
                    color: "#007bff",
                    cursor: "pointer",
                    textAlign: "center",
                    width: "100%", // Ensures the button takes the full width of the grid item
                  }}
                >
                  {message.text}
                </Button>
             )}
          </Grid></>
        ) : message.isPredefinedQuestion ? (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
             <div
            //   src={
            //   alt={message.isAssistant ? "Bot" : "User"}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <button
              onClick={() => handleOptionClick(message.text)}
              style={{
                padding: "10px",
                borderRadius: "15px",
                border: "1px solid #007bff",
                backgroundColor: "#f9f9f9",
                color: "#007bff",
                cursor: "pointer",
                textAlign: "left",
                flex: 1,
              }}
            >
              {message.text}
            </button>
          </div>
        ) : (
          <div
            key={index}
            style={{
              width:"100%",
              margin: "5px 0",
              display: "flex",
              alignItems: "center",
              flexDirection: message.isAssistant ? "row" : "row-reverse",
            }}
          >
            <img
              src={message.isAssistant ? XenAegis : userimage || PersonOutline}
              alt={message.isAssistant ? "Bot" : "User"}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: message.isAssistant ? "10px" : "0",
                marginLeft: message.isAssistant ? "0" : "10px",
              }}
            />
            <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "15px",
                  backgroundColor: message.isAssistant ? "#f0f0f0" : "#007bff",
                  color: message.isAssistant ? "#000" : "#fff",
                  maxWidth: "80%",
                  wordBreak: "break-word", // Ensure long links wrap correctly
                }}
                dangerouslySetInnerHTML={{__html: message.text}}
              />
                
             
          </div>
        )
      )}
     {isTyping && (
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                color: "black",
                maxWidth: "80%",
              }}
            >
              Typing...
            </div>
          </div>
        )}
      <div ref={chatEndRef} />
    </Grid>
    </div>
  );
};

export default ChatMessages;
