
// import React, { useState, useEffect, useContext } from 'react';
// import useCreateTicket from '../useCreateTicket';
// import UserProfile from '../../../hooks/UserData/useUser';
// import { TestContext } from '../../../State/Function/Main';
// import { useQueryClient } from 'react-query';
// import CloseIcon from "@mui/icons-material/Close";
// import axios from 'axios';
// import useAuthToken from '../../../hooks/Token/useAuth';

// const TicketForm = ({ onClose }) => {
//   const { createTicket, loading, error, success } = useCreateTicket();
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user?._id;

//   const authToken = useAuthToken();

//   const [ticketData, setTicketData] = useState({
//     title: '',
//     description: '',
//     module: 'Module 1',
//     priority: 'Low',
//     attachments: [],
//   });
//   const [uploading, setUploading] = useState(false);

//   const modules = ['Leave Management', 'Payroll', 'Recruitment', 'Food Catering', 'Fullskape'];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTicketData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const uploadImage = async (file) => {
//     if (!file) {
//       throw new Error("No file provided for upload.");
//     }

//     try {
//       setUploading(true);
//       const { data: { url } } = await axios.get(
//         `${process.env.REACT_APP_API}/route/s3createFile/Tickets-${employeeId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         }
//       );

//       await axios.put(url, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       setUploading(false);
//       return url.split("?")[0];
//     } catch (error) {
//       setUploading(false);
//       console.error("Image upload failed:", error.message);
//       throw new Error("Failed to upload the image.");
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);

//     try {
//       const uploadedUrls = await Promise.all(files.map((file) => uploadImage(file)));
//       setTicketData((prevData) => ({
//         ...prevData,
//         attachments: [...prevData.attachments, ...uploadedUrls.map((url) => ({ url }))],
//       }));
//       handleAlert(true, "success", "Images uploaded successfully!");
//     } catch (error) {
//       handleAlert(true, "error", "Image upload failed.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createTicket({ ...ticketData, employeeId });
//   };

//   useEffect(() => {
//     if (success) {
//       handleAlert(true, "success", "Ticket created successfully!");
//       queryClient.invalidateQueries(["ticketsforemp"]);
//       onClose();
//     }
//   }, [success, onClose, handleAlert, queryClient]);

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         zIndex: 1000,
//         backgroundColor: '#fff',
//         borderRadius: '10px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
//         padding: '20px',
//         width: '90%',
//         maxWidth: '500px',
//       }}
//     >
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Ticket</h2>
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//       {success && <p style={{ color: 'green', textAlign: 'center' }}>Ticket created successfully!</p>}

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
//             Title:
//           </label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={ticketData.title}
//             onChange={handleInputChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//               fontSize: '14px',
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
//             Description:
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={ticketData.description}
//             onChange={handleInputChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//               fontSize: '14px',
//               minHeight: '100px',
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="module" style={{ display: 'block', marginBottom: '5px' }}>
//             Module:
//           </label>
//           <select
//             id="module"
//             name="module"
//             value={ticketData.module}
//             onChange={handleInputChange}
//             style={{
//               width: '100%',
//               padding: '10px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//               fontSize: '14px',
//             }}
//           >
//             {modules.map((module, index) => (
//               <option key={index} value={module}>
//                 {module}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="attachments" style={{ display: 'block', marginBottom: '5px' }}>
//             Attachments (optional):
//           </label>
//           <input
//             type="file"
//             id="attachments"
//             name="attachments"
//             multiple
//             onChange={handleFileChange}
//             style={{ width: '100%' }}
//           />
//           {uploading && <p style={{ color: 'blue' }}>Uploading images...</p>}
//         </div>

//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <button
//             type="submit"
//             disabled={loading || uploading}
//             style={{
//               backgroundColor: '#007bff',
//               color: '#fff',
//               padding: '10px 20px',
//               border: 'none',
//               borderRadius: '5px',
//               fontSize: '14px',
//               cursor: 'pointer',
//               width: '100%',
//             }}
//           >
//             {loading ? 'Creating Ticket...' : 'Create Ticket'}
//           </button>
//         </div>
//       </form>

//       <button
//         onClick={onClose}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           backgroundColor: 'transparent',
//           border: 'none',
//           cursor: 'pointer',
//           fontSize: '16px',
//         }}
//       >
//         <CloseIcon style={{ fontSize: "18px" }} />{" "}
//       </button>
//     </div>
//   );
// };

// export default TicketForm;


import React, { useState, useEffect, useContext } from 'react';
import useCreateTicket from '../useCreateTicket';
import UserProfile from '../../../hooks/UserData/useUser';
import { TestContext } from '../../../State/Function/Main';
import { useQueryClient } from 'react-query';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import useAuthToken from '../../../hooks/Token/useAuth';

const TicketForm = ({ onClose }) => {
  const { createTicket, loading, error, success } = useCreateTicket();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const authToken = useAuthToken();

  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    module: 'Module 1',
    priority: 'Low',
    attachments: [],
  });
  const [uploading, setUploading] = useState(false);

  const modules = ['Leave Management', 'Payroll', 'Recruitment', 'Food Catering', 'Fullskape'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Upload Image Function
  const uploadStudentImage = async (file) => {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    try {
      setUploading(true);
      const { data: { url } } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/Tickets-${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      setUploading(false);
      return url.split('?')[0];
    } catch (error) {
      setUploading(false);
      console.error('Image upload failed:', error.message);
      throw new Error('Failed to upload the image.');
    }
  };

  // Handle file change for attachments
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const uploadedUrls = await Promise.all(files.map((file) => uploadStudentImage(file)));

      setTicketData((prevData) => ({
        ...prevData,
        attachments: [
          ...prevData.attachments,
          ...uploadedUrls.map((url, index) => ({ url, name: files[index].name })),
        ],
      }));

      handleAlert(true, 'success', 'Images uploaded successfully!');
    } catch (error) {
      handleAlert(true, 'error', 'Image upload failed.');
    }
  };

  // Remove specific attachment
  const handleRemoveImage = (index) => {
    setTicketData((prevData) => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index),
    }));
    handleAlert(true, 'info', 'Image removed.');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTicket({ ...ticketData, employeeId });
  };

  // Close form if the ticket was created successfully
  useEffect(() => {
    if (success) {
      handleAlert(true, 'success', 'Ticket created successfully!');
      queryClient.invalidateQueries(['ticketsforemp']);
      onClose();
    }
  }, [success, onClose, handleAlert, queryClient]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Ticket</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>Ticket created successfully!</p>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={ticketData.title}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={ticketData.description}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
              minHeight: '100px',
            }}
          />
        </div>

        {/* Module Dropdown */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="module" style={{ display: 'block', marginBottom: '5px' }}>
            Module:
          </label>
          <select
            id="module"
            name="module"
            value={ticketData.module}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            {modules.map((module, index) => (
              <option key={index} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        {/* Attachments */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="attachments" style={{ display: 'block', marginBottom: '5px' }}>
            Attachments:
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            multiple
            onChange={handleFileChange}
            style={{ width: '100%' }}
          />
          {uploading && <p style={{ color: 'blue' }}>Uploading images...</p>}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            {ticketData.attachments.map((attachment, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                <img
                  src={attachment.url}
                  alt={`Attachment ${index + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '5px',
                    objectFit: 'cover',
                    border: '1px solid #ccc',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <DeleteIcon style={{ fontSize: '14px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading || uploading}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {loading ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </div>
      </form>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        <CloseIcon style={{ fontSize: '18px' }} />{' '}
      </button>
    </div>
  );
};

export default TicketForm;
