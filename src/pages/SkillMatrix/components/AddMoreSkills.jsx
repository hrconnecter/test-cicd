// // //Working ✅
// import React, { useState } from "react";
// import axios from "axios";
// import { Button, TextField, Rating } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "react-router";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSkills from "./useSkills";

// const AddMoreSkills = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const userId = user._id;

//   const {
//     skills,
//     addSkills,
//     clearSkills,
//     isLoading,
//     isError,
//     refetch,
//   } = useSkills(organisationId, employeeId);
  
//   const [skills, setSkills] = useState([]);

//   const formSchema = z.object({
//     selectedSkills: z
//       .array(
//         z.object({
//           skillName: z.string().nonempty("Skill name is required"),
//           rating: z.number().min(1).max(5),
//         })
//       )
//       .min(1, "At least one skill must be added"),
//   });

//   const { handleSubmit, setValue, formState } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: { selectedSkills: [] },
//   });

// //   const handleSkillChange = (index, field, value) => {
// //     const updatedSkills = [...skills];
// //     updatedSkills[index][field] = value;
// //     setSkills(updatedSkills);
// //     setValue("selectedSkills", updatedSkills);
// //   };

// //   const handleAddSkill = () => {
// //     if (skills.some(skill => !skill.skillName.trim())) {
// //       alert("Complete the current skill before adding another.");
// //       return;
// //     }
// //     setSkills([...skills, { skillName: "", rating: 3 }]);
// //   };



// const handleSkillChange = (index, field, value) => {
//     const updatedSkills = [...skills];
//     updatedSkills[index][field] = value;
//     setSkills(updatedSkills);
    
//     // Synchronize form field
//     setValue("selectedSkills", updatedSkills, { shouldValidate: true });
//   };
  
//   const handleAddSkill = () => {
//     if (skills.some(skill => !skill.skillName.trim())) {
//       alert("Complete the current skill before adding another.");
//       return;
//     }
  
//     const newSkill = { skillName: "", rating: 3 };
//     const updatedSkills = [...skills, newSkill];
//     setSkills(updatedSkills);
  
//     // Synchronize form field
//     setValue("selectedSkills", updatedSkills, { shouldValidate: true });
//   };
  
// //   const handleAddMoreSkills = async (data) => {
// //     console.log("Prepared Data:", data.selectedSkills);
// //     try {
// //       const preparedData = {
// //         employeeId: userId,
// //         skills: data.selectedSkills.map(skill => ({
// //           skillName: skill.skillName,
// //           rating: skill.rating,
// //           groupName: "Default Group",
// //           subGroupName: "Default Subgroup",
// //         })),
// //       };

// //       const response = await axios.post(
// //         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
// //         preparedData,
// //         { headers: { Authorization: authToken } }
// //       );

// //       setSkills([]); // Reset after success
// //       setValue("selectedSkills", []);
// //       alert("Skills added successfully!");
// //     } catch (error) {
// //       console.error("Failed to add skills:", error.response?.data || error.message);
// //       alert("Failed to add skills. Please check the console for details.");
// //     }
// //   };

//   const handleAddMoreSkills = async (data) => {
//     try {
//       const preparedData = {
//         employeeId: userId,
//         skills: data.selectedSkills.map((skill) => ({
//           skillName: skill.skillName,
//           rating: skill.rating,
//           groupName: "Default Group",
//           subGroupName: "Default Subgroup",
//         })),
//       };
  
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
//         preparedData,
//         { headers: { Authorization: authToken } }
//       );
  
//       if (response.data.success) {
//         alert("Skills added successfully!");
  
//         // Pass back the newly added skills
//         // Call onSuccess to pass back the new skills
//         if (onSuccess) {
//             onSuccess(preparedData.skills);
//           }
  
//           // Reset form
//           setSkills([]);
//           setValue("selectedSkills", []);
//         }
//       } catch (error) {
//         console.error("Failed to add skills:", error.response?.data || error.message);
//         alert("Failed to add skills. Please check the console for details.");
//       }
//     };
  

//   return (
//     <div>
//       {/* <h3>Add More Skills</h3> */}
//       <form onSubmit={handleSubmit(handleAddMoreSkills)}>
//         {skills.map((skill, index) => (
//           <div key={index}>
//             <TextField
//               label={`Skill ${index + 1}`}
//               value={skill.skillName}
//               onChange={(e) => handleSkillChange(index, "skillName", e.target.value)}
//               fullWidth
//             />
//             <Rating
//               value={skill.rating}
//               onChange={(_, newValue) => handleSkillChange(index, "rating", newValue)}
//             />
//           </div>
//         ))}

//         {formState.errors.selectedSkills?.message && (
//           <p style={{ color: "red" }}>{formState.errors.selectedSkills.message}</p>
//         )}

//         <Button onClick={handleAddSkill} variant="outlined">
//           Add Skill
//         </Button>
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AddMoreSkills;




// import React, { useState } from "react";
// import axios from "axios";
// import { Button, TextField, Rating } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "react-router";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSkills from "./useSkills";

// const AddMoreSkills = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const userId = user._id;

//   // Use the custom hook for managing skills
//   const { skills, addSkills, clearSkills } = useSkills();

//   // Zod form validation schema
//   const formSchema = z.object({
//     selectedSkills: z
//       .array(
//         z.object({
//           skillName: z.string().nonempty("Skill name is required"),
//           rating: z.number().min(1).max(5),
//         })
//       )
//       .min(1, "At least one skill must be added"),
//   });

//   const { handleSubmit, setValue, formState } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: { selectedSkills: [] },
//   });

//   const handleSkillChange = (index, field, value) => {
//     const updatedSkills = [...skills];
//     updatedSkills[index][field] = value;
//     addSkills(updatedSkills); // Update skills using the custom hook
//     setValue("selectedSkills", updatedSkills, { shouldValidate: true });
//   };

//   const handleAddSkill = () => {
//     if (skills.some((skill) => !skill.skillName.trim())) {
//       alert("Complete the current skill before adding another.");
//       return;
//     }

//     const newSkill = { skillName: "", rating: 3 };
//     addSkills([...skills, newSkill]); // Add new skill using the custom hook
//     setValue("selectedSkills", [...skills, newSkill], { shouldValidate: true });
//   };

//   const handleAddMoreSkills = async (data) => {
//     try {
//       const preparedData = {
//         employeeId: userId,
//         skills: data.selectedSkills.map((skill) => ({
//           skillName: skill.skillName,
//           rating: skill.rating,
//           groupName: "Default Group",
//           subGroupName: "Default Subgroup",
//         })),
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
//         preparedData,
//         { headers: { Authorization: authToken } }
//       );

//       if (response.data.success) {
//         alert("Skills added successfully!");
//         clearSkills(); // Clear skills after successful addition
//         setValue("selectedSkills", []);
//       }
//     } catch (error) {
//       console.error("Failed to add skills:", error.response?.data || error.message);
//       alert("Failed to add skills. Please check the console for details.");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit(handleAddMoreSkills)}>
//         {skills.map((skill, index) => (
//           <div key={index}>
//             <TextField
//               label={`Skill ${index + 1}`}
//               value={skill.skillName}
//               onChange={(e) => handleSkillChange(index, "skillName", e.target.value)}
//               fullWidth
//             />
//             <Rating
//               value={skill.rating}
//               onChange={(_, newValue) => handleSkillChange(index, "rating", newValue)}
//             />
//           </div>
//         ))}

//         {formState.errors.selectedSkills?.message && (
//           <p style={{ color: "red" }}>{formState.errors.selectedSkills.message}</p>
//         )}

//         <Button onClick={handleAddSkill} variant="outlined">
//           Add Skill
//         </Button>
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AddMoreSkills;


import React from "react";
import axios from "axios";
import { Button, TextField, Rating } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useSkills from "./useSkills";

const AddMoreSkills = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;

  const { skills, addSkills, clearSkills } = useSkills();

  const formSchema = z.object({
    selectedSkills: z
      .array(
        z.object({
          skillName: z.string().nonempty("Skill name is required"),
          rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
        })
      )
      .min(1, "At least one skill must be added"),
  });

  const { handleSubmit, setValue, formState, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { selectedSkills: skills },
  });

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...watch("selectedSkills")];
    updatedSkills[index][field] = value;
    setValue("selectedSkills", updatedSkills, { shouldValidate: true });
    addSkills(updatedSkills); // Keep state and form in sync
  };

  const handleAddSkill = () => {
    const currentSkills = watch("selectedSkills");
    const newSkill = { skillName: "", rating: 3 };
  
    if (currentSkills.some((skill) => !skill.skillName.trim())) {
      alert("Complete the current skill before adding another.");
      return;
    }
  
    // Check for duplicates
    const skillNames = currentSkills.map((skill) => skill.skillName.trim().toLowerCase());
    if (skillNames.includes(newSkill.skillName.toLowerCase())) {
      alert("This skill already exists.");
      return;
    }
  
    const updatedSkills = [...currentSkills, newSkill];
    setValue("selectedSkills", updatedSkills, { shouldValidate: true });
    addSkills(updatedSkills); // Use the shared hook
  };
  

//   const handleAddMoreSkills = async (data) => {
//     try {
//       const preparedData = {
//         employeeId: userId,
//         skills: data.selectedSkills.map((skill) => ({
//           skillName: skill.skillName,
//           rating: skill.rating,
//           groupName: "Default Group",
//           subGroupName: "Default Subgroup",
//         })),
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
//         preparedData,
//         { headers: { Authorization: authToken } }
//       );

//       if (response.data.success) {
//         alert("Skills added successfully!");
//         clearSkills();
//         setValue("selectedSkills", []);
//       }
//     } catch (error) {
//       console.error("Failed to add skills:", error.response?.data || error.message);
//       alert("Failed to add skills. Please check the console for details.");
//     }
//   };
const handleAddMoreSkills = async (data) => {
    try {
      const preparedData = {
        employeeId: userId,
        skills: data.selectedSkills.map((skill) => ({
          skillName: skill.skillName,
          rating: skill.rating,
          groupName: "Default Group",
          subGroupName: "Default Subgroup",
        })),
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
        preparedData,
        { headers: { Authorization: authToken } }
      );
  
      if (response.data.success) {
        alert("Skills added successfully!");
  
        // Fetch the updated skills list from the server
        const updatedSkillsResponse = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
          { headers: { Authorization: authToken } }
        );
  
        const updatedSkills = updatedSkillsResponse.data.skills;
        addSkills(updatedSkills); // Update local state with new skills
        clearSkills(); // Clear temporary form state
        setValue("selectedSkills", updatedSkills); // Sync form state with updated skills
      }
    } catch (error) {
      console.error("Failed to add skills:", error.response?.data || error.message);
      alert("Failed to add skills. Please check the console for details.");
    }
  };
  

  const selectedSkills = watch("selectedSkills");

  return (
    <div>
      <form onSubmit={handleSubmit(handleAddMoreSkills)}>
        {selectedSkills.map((skill, index) => (
          <div key={index}>
            <TextField
              label={`Skill ${index + 1}`}
              value={skill.skillName}
              onChange={(e) => handleSkillChange(index, "skillName", e.target.value)}
              fullWidth
            />
            <Rating
              value={skill.rating}
              onChange={(_, newValue) => handleSkillChange(index, "rating", newValue)}
            />
          </div>
        ))}

        {formState.errors.selectedSkills?.message && (
          <p style={{ color: "red" }}>{formState.errors.selectedSkills.message}</p>
        )}

        <Button onClick={handleAddSkill} variant="outlined">
          Add Skill
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddMoreSkills;



// import React from "react";
// import axios from "axios";
// import { Button, TextField, Rating } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "react-router";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSkills from "./useSkills";

// const AddMoreSkills = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const userId = user._id;

//   const {
//     skills,
//     addSkills,
//     clearSkills,
//     isLoading,
//     isError,
//     refetch,
//   } = useSkills(organisationId, userId);

//   const formSchema = z.object({
//     selectedSkills: z
//       .array(
//         z.object({
//           skillName: z.string().nonempty("Skill name is required"),
//           rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
//         })
//       )
//       .min(1, "At least one skill must be added"),
//   });

//   const { handleSubmit, setValue, formState, watch } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: { selectedSkills: skills },
//   });

//   const handleSkillChange = (index, field, value) => {
//     const updatedSkills = [...watch("selectedSkills")];
//     updatedSkills[index][field] = value;
//     setValue("selectedSkills", updatedSkills, { shouldValidate: true });
//   };

//   const handleAddSkill = () => {
//     const currentSkills = watch("selectedSkills");
//     if (currentSkills.some((skill) => !skill.skillName.trim())) {
//       alert("Complete the current skill before adding another.");
//       return;
//     }
//     setValue(
//       "selectedSkills",
//       [...currentSkills, { skillName: "", rating: 3 }],
//       { shouldValidate: true }
//     );
//   };

//   const handleAddMoreSkills = async (data) => {
//     try {
//       const preparedData = {
//         employeeId: userId,
//         skills: data.selectedSkills.map((skill) => ({
//           skillName: skill.skillName,
//           rating: skill.rating,
//           groupName: "Default Group",
//           subGroupName: "Default Subgroup",
//         })),
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/add-more`,
//         preparedData,
//         { headers: { Authorization: authToken } }
//       );

//       if (response.data.success) {
//         alert("Skills added successfully!");
//         addSkills(preparedData.skills); // Update shared state
//         setValue("selectedSkills", []); // Reset form
//       }
//     } catch (error) {
//       console.error("Failed to add skills:", error.response?.data || error.message);
//       alert("Failed to add skills. Please check the console for details.");
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <form onSubmit={handleSubmit(handleAddMoreSkills)}>
//         {watch("selectedSkills").map((skill, index) => (
//           <div key={index}>
//             <TextField
//               label={`Skill ${index + 1}`}
//               value={skill.skillName}
//               onChange={(e) => handleSkillChange(index, "skillName", e.target.value)}
//               fullWidth
//             />
//             <Rating
//               value={skill.rating}
//               onChange={(_, newValue) => handleSkillChange(index, "rating", newValue)}
//             />
//           </div>
//         ))}

//         {formState.errors.selectedSkills?.message && (
//           <p style={{ color: "red" }}>{formState.errors.selectedSkills.message}</p>
//         )}

//         <Button onClick={handleAddSkill} variant="outlined">
//           Add Skill
//         </Button>
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AddMoreSkills;





//esme se selected skill skills show functionallity leni hai 
// import React, { useState } from "react";
// import { Button, TextField, Rating, Box } from "@mui/material";

// const AddMoreSkills = ({ onSuccess }) => {
//   const [newSkills, setNewSkills] = useState([
//     { skillName: "", rating: 3 },
//   ]);

//   // Add a new skill input row
//   const handleAddSkillRow = () => {
//     setNewSkills([
//       ...newSkills,
//       { skillName: "", rating: 3 },
//     ]);
//   };

//   // Handle skill input change
//   const handleSkillChange = (index, value, type) => {
//     const updatedSkills = [...newSkills];
//     updatedSkills[index][type] = value;
//     setNewSkills(updatedSkills);
//   };

//   // Submit added skills
//   const handleSubmit = () => {
//     // Pass the added skills back to the parent component
//     const addedSkills = newSkills.map((skill) => ({
//       skillName: skill.skillName,
//       skillId: Math.random().toString(36).substring(7), // Temporary ID for new skill
//       rating: skill.rating,
//     }));
//     onSuccess(addedSkills);
//   };

//   return (
//     <div>
//       {newSkills.map((skill, index) => (
//         <Box key={index} mb={2}>
//           <TextField
//             label={`Skill Name ${index + 1}`}
//             value={skill.skillName}
//             onChange={(e) => handleSkillChange(index, e.target.value, "skillName")}
//             fullWidth
//           />
//           <Box mt={1}>
//             <Rating
//               value={skill.rating}
//               onChange={(_, newValue) => handleSkillChange(index, newValue, "rating")}
//             />
//           </Box>
//         </Box>
//       ))}
      
//       {/* Add New Skill Row Button */}
//       <Button variant="outlined" onClick={handleAddSkillRow}>
//         Add Another Skill
//       </Button>

//       {/* Submit Added Skills */}
//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={handleSubmit}>
//           Submit Skills
//         </Button>
//       </Box>
//     </div>
//   );
// };

// export default AddMoreSkills;


