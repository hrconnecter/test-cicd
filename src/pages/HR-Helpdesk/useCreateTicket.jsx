
// import { useState } from "react";
// import axios from "axios";

// const useCreateTicket = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const createTicket = async ({ title, description, module, priority, attachments, employeeId }) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // If attachments are provided, ensure they are URLs or base64 strings
//       const attachmentUrls = attachments.map((attachment) => attachment.url); // Assuming attachments is an array of objects with 'url' property

//       const ticketData = {
//         title,
//         description,
//         module,
//         priority,
//         attachments: attachmentUrls, // Send only the URLs or base64 strings of the attachments
//         employeeId,
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/create-ticket`,
//         ticketData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSuccess(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred while submitting the ticket.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { createTicket, loading, error, success };
// };

// export default useCreateTicket;

import { useState } from "react";
import axios from "axios";

const useCreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createTicket = async ({ title, description, module, priority, attachments, employeeId }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Validate and process attachments
      const attachmentUrls = attachments
        .filter((attachment) => attachment && attachment.url) // Remove invalid/null values
        .map((attachment) => attachment.url);
  
      const ticketData = {
        title,
        description,
        module,
        priority,
        attachments: attachmentUrls, // Send only valid URLs
        employeeId,
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/create-ticket`,
        ticketData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      setSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting the ticket.");
    } finally {
      setLoading(false);
    }
  };
  

  return { createTicket, loading, error, success };
};

export default useCreateTicket;
