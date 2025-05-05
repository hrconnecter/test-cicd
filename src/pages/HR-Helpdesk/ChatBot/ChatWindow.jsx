import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatWindow = ({
  chat,
  toggleChat,
  userInput,
  setUserInput,
  handleSend,
  handleOptionClick,
  isTyping,
  chatEndRef,
  setAttachments, // Added prop for attachments
  attachments,
  setPreviews,
  previews,
}) => (
  <div
    className="w-[100%] sm:w-[450px] lg:w-[500px] sm:right-[40px] right-0"
    style={{
      padding: "10px",
      position: "fixed",
      bottom: "0px",
      height: "90%",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 1000,
    }}
  >
    <ChatHeader toggleChat={toggleChat} />
    <ChatMessages
      chat={chat}
      handleOptionClick={handleOptionClick}
      isTyping={isTyping}
      chatEndRef={chatEndRef}
    />
    <ChatInput
      userInput={userInput}
      setUserInput={setUserInput}
      handleSend={handleSend}
      setAttachments={setAttachments} // Pass the setAttachments prop
      attachments={attachments}
      setPreviews={setPreviews} 
      previews = {previews}
    />
  </div>
);

export default ChatWindow;
