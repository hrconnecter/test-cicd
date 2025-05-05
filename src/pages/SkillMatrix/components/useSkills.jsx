import { useState, useContext } from "react";
import { UseContext } from "../../../State/UseState/UseContext";

const useSkills = () => {
  const { cookies } = useContext(UseContext);
  const [skills, setSkills] = useState([]);

  
  const getAuthToken = () => cookies["aegis"];

  // Function to add new skills
  const addSkills = (newSkills) => {
    setSkills((prevSkills) => [...prevSkills, ...newSkills]);
  };

  // Function to clear skills (e.g., after submission)
  const clearSkills = () => {
    setSkills([]);
  };

  return { skills, addSkills, clearSkills, getAuthToken };
};

export default useSkills;


// import { useState, useContext } from "react";
// import { useQuery } from "react-query";
// // import { UseContext } from "../../State/UseState/UseContext";
// import { UseContext } from "../../../State/UseState/UseContext";

// import axios from "axios";

// const useSkills = (organisationId, employeeId) => {
//   const { cookies } = useContext(UseContext);
//   const [skills, setSkills] = useState([]);
//   const authToken = cookies["aegis"];

//   // Fetch skills using useQuery
//   const { data, isLoading, isError, refetch } = useQuery(
//     ["skills", organisationId, employeeId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/skills`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.skills; // Adjust based on API response structure
//     },
//     {
//       onSuccess: (fetchedSkills) => {
//         setSkills(fetchedSkills);
//       },
//       onError: (error) => {
//         console.error("Failed to fetch skills:", error.response?.data || error.message);
//       },
//     }
//   );

//   // Function to add new skills
//   const addSkills = (newSkills) => {
//     setSkills((prevSkills) => [...prevSkills, ...newSkills]);
//   };

//   // Function to clear skills (e.g., after submission)
//   const clearSkills = () => {
//     setSkills([]);
//   };

//   return {
//     skills,
//     addSkills,
//     clearSkills,
//     isLoading,
//     isError,
//     refetch,
//   };
// };

// export default useSkills;

