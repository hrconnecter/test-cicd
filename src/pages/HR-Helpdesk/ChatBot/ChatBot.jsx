import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatButton from "./ChatButton";
import { useLocation, useParams } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import useCreateTicket from "../useCreateTicket";

const ticketQuestions = ["title", "description"];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [chat, setChat] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [ticketData, setTicketData] = useState({});
  const [currentInputStep, setCurrentInputStep] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attachmentStep, setAttachmentStep] = useState(false);
  const [previews, setPreviews] = useState([]); // To handle preview of images
  const [attachments, setAttachments] = useState([]);
  const chatEndRef = useRef(null);

  const { getCurrentUser } = UserProfile();
  const { id, organisationId } = useParams();
  const orgId = id || organisationId;
  const user = getCurrentUser();
  const empId = user?._id;
  const location = useLocation();

  const { createTicket, loading } = useCreateTicket();

  const predefinedQuestions = (orgId) => ({
    Payroll: [
      {
        question: "How to view my payslip?",
        answer: `Log in to your profile, navigate to the Payroll section, and download the payslip for the desired month. For more details, refer to the <a href='/organisation/${orgId}/How-to-Doc' style='color: blue; text-decoration: underline;'>How-to Document</a>.`,
        isPredefinedQuestion: true,
      },
      {
        question: "What are the payroll deduction rules?",
        answer: `Payroll deductions depend on the organization policies. Refer to the <a href='/organisation/${orgId}/How-to-Doc' style='color: blue; text-decoration: underline;'>Payroll Deductions How-to Document</a>.`,
        isPredefinedQuestion: true,
      },
    ],
    Attendance: [
      {
        question: "How to apply for leave?",
        answer: `After logging into your profile, navigate to the 'Attendance and Leave Management' section. Select the date, type of leave, and submit. Refer to the <a href='/organisation/${orgId}/How-to-Doc' style='color: blue; text-decoration: underline;'>Leave Management How-to Document</a>.`,
        isPredefinedQuestion: true,
      },
      {
        question: "Can I pull back my attendance and leave request?",
        answer: `Yes, by applying for a delete request. Refer to the <a href='/organisation/${orgId}/How-to-Doc' style='color: blue; text-decoration: underline;'>How-to Document</a>.`,
        isPredefinedQuestion: true,
      },
      {
        question:
          "Can I raise the leaves or attendance on the behalf of an employee?",
        answer:
          "Yes. By clicking on the leaves and attendance management, you can raise leaves and attendance.",
        isPredefinedQuestion: true,
      },
      {
        question: "How to approve leave requests of my team?",
        answer:
          "You can approve leave requests in the “Notification” tab of the Leave and Attendance Module of the AEGIS HRMS after being logged in or through the notification “Bell Icon”. Click “Leave” to view the leave requests of your team and “Approve” the requests. AEGIS hrms → Leave and Attendance → Notifications → For Leave",
        isPredefinedQuestion: true,
      },
      {
        question: "How to reject leave requests for the team?",
        answer:
          "You can reject leave requests in the “Notification” tab of the Leave and Attendance Module of the AEGIS HRMS after being logged in or through the notification “Bell Icon”. Click “Leave” to view the leave requests of your team and “Reject” the requests. AEGIS hrms → Leave and Attendance → Notifications → Leave",
        isPredefinedQuestion: true,
      },
    ],
    FAQ: [
      {
        question: "Why can't I log in?",
        answer:
          "Ensure your user ID and password are correct. Use 'Forgot Password' if needed.",
        isPredefinedQuestion: true,
      },
      {
        question: "What to do if I have forgotten my password?",
        answer: `Reset your password using the <a href='/organisation/${orgId}/How-to-Doc' style='color: blue; text-decoration: underline;'>How-to Document</a> option on the login page.`,
        isPredefinedQuestion: true,
      },
      {
        question: "Does AEGIS HRMS show who's off work?",
        answer:
          "Yes. In the dashboard, managers can view the number of employees present and the number of employees on leave on the current date.",
        isPredefinedQuestion: true,
      },
      {
        question: "Can I suggest any training for my team members?",
        answer:
          "Yes. You can create training and assign it by selecting employees.",
        isPredefinedQuestion: true,
      },
    ],
  });

  const allowedRoutes = [
    `/organisation/${orgId}/dashboard/super-admin`,
    `/organisation/${user?.organizationId}/dashboard/HR-dashboard`,
    `/organisation/${user?.organizationId}/dashboard/employee-dashboard`,
  ];
  const isRouteAllowed = allowedRoutes.includes(location.pathname);

  const predefined = predefinedQuestions(orgId);

  useEffect(() => {
    if (isOpen) {
      displayMainMenu();
    }
  }, [isOpen]);

  const displayMainMenu = () => {
    setChat((prev) => [
      ...prev,
      { text: "Welcome! How can I help you today?", isAssistant: true },
      { text: "Please select a module to proceed:", isAssistant: true },
      { text: "Payroll", isOption: true },
      { text: "Attendance", isOption: true },
      { text: "FAQ", isOption: true },
    ]);
  };

  const toggleChat = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsOpen(!isOpen);
      setIsRotating(false);
    }, 300);
  };

  const handleModuleSelect = (module) => {
    if (predefined[module]) {
      setSelectedModule(module);
      setChat((prev) => [
        ...prev,
        { text: module, isAssistant: false },
        {
          text: `Here are some questions regarding ${module}:`,
          isAssistant: true,
        },
        ...predefined[module].map((q) => ({
          text: q.question,
          isPredefinedQuestion: true,
        })),
      ]);
    }
  };

  const handleQuestionSelect = (question) => {
    const answer = predefined[selectedModule]?.find(
      (q) => q.question === question
    )?.answer;
    setChat((prev) => [
      ...prev,
      { text: question, isAssistant: false },
      {
        text: answer || "I'm sorry, I don't have an answer for that question.",
        isAssistant: true,
      },
      { text: "Would you like to do any of the following?", isAssistant: true },
      { text: "Raise a Ticket", isOption: true },
      { text: "Previous Menu", isOption: true },
      { text: "Main Menu", isOption: true },
    ]);
  };

  const handleRaiseTicket = () => {
    if (attachmentStep) {
      createTicket({
        ...ticketData,
        module: selectedModule,
        employeeId: empId,
        attachments,
      });

      setChat((prev) => [
        ...prev,
        {
          text: "Your ticket has been successfully submitted.",
          isAssistant: true,
        },
      ]);
      setAttachmentStep(false);
      setTicketData({});
      setAttachments([]);
      setPreviews([]);
      setCurrentInputStep(null);
      return;
    }

    if (currentInputStep !== null) {
      const currentQuestion = ticketQuestions[currentInputStep];
      setTicketData((prev) => ({ ...prev, [currentQuestion]: userInput }));
      setChat((prev) => [...prev, { text: userInput, isAssistant: false }]);
      setUserInput("");

      if (currentInputStep < ticketQuestions.length - 1) {
        setCurrentInputStep((step) => step + 1);
        setChat((prev) => [
          ...prev,
          {
            text: `Please provide the ${
              ticketQuestions[currentInputStep + 1]
            }.`,
            isAssistant: true,
          },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { text: "Do you have any attachments?", isAssistant: true },
          { text: "Yes", isOption: true },
          { text: "No", isOption: true },
        ]);
        setAttachmentStep(true);
      }
    }
  };

  const handleOptionClick = (option) => {
    if (attachmentStep) {
      if (option === "Yes") {
        setChat((prev) => [
          ...prev,
          { text: option, isAssistant: false },
          { text: "Please upload your attachments.", isAssistant: true },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { text: option, isAssistant: false },
          { text: "Submitting your ticket...", isAssistant: true },
        ]);
        handleRaiseTicket();
      }
      return;
    }

    if (option === "Raise a Ticket") {
      setChat((prev) => [
        ...prev,
        { text: option, isAssistant: false },
        { text: "Please provide the title of the ticket.", isAssistant: true },
      ]);
      setCurrentInputStep(0);
    } else if (option === "Main Menu") {
      setSelectedModule(null);
      displayMainMenu();
    } else if (option === "Previous Menu" && selectedModule) {
      handleModuleSelect(selectedModule);
    } else {
      if (!selectedModule) {
        handleModuleSelect(option);
      } else {
        handleQuestionSelect(option);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!isRouteAllowed) return null;

  return (
    <div>
      <ChatButton toggleChat={toggleChat} isRotating={isRotating} />
      {isOpen && (
        <ChatWindow
          chat={chat}
          toggleChat={toggleChat}
          handleOptionClick={handleOptionClick}
          isTyping={loading}
          chatEndRef={chatEndRef}
          userInput={userInput}
          setUserInput={setUserInput}
          handleSend={handleRaiseTicket}
          setAttachments={setAttachments}
          attachments={attachments}
          setPreviews={setPreviews}
          previews={previews}
        />
      )}
    </div>
  );
};

export default ChatBot;
