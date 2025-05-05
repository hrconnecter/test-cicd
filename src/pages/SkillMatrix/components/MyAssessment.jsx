/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Rating,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import AddMoreSkills from "./AddMoreSkills";
import ClearIcon from "@mui/icons-material/Clear";
import useSkills from "./useSkills";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BasicButton from "../BasicButton";
import { Avatar } from "@mui/material";
import useHook from "../../../hooks/UserProfile/useHook";
import BasicButton from "../../../components/BasicButton";

const MyAssessment = ({ mutate }) => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { UserInformation } = useHook();

  const userId = user._id;
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [showSelectedSkillsSection, setShowSelectedSkillsSection] =
    useState(false);
  const { skills, addSkills, clearSkills, getAuthToken } = useSkills(); // Using useSkills hook
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state for AddMoreSkills
  const formSchema = z.object({
    selectedSkills: z
      .array(
        z.object({
          skillName: z.string(),
          skillId: z.string(),
          rating: z.number().min(1).max(5),
        })
      )
      .min(1, { message: "At least one skill must be selected" }),
  });

  const { handleSubmit, setValue, formState, watch } = useForm({
    defaultValues: {
      selectedSkills: [],
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        {
          headers: { Authorization: authToken },
        }
      );
      const transformedSkills = response.data.data.map((skill) => ({
        skillName: skill.skillName,
        skillId: skill._id,
      }));
      addSkills(transformedSkills); // Storing skills using the useSkills hook
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [organisationId]);
  //   const handleDialogClose = (newSkillsAdded) => {
  //     setDialogOpen(false);

  //     if (newSkillsAdded && newSkillsAdded.length > 0) {
  //       const existingSkills = watch("selectedSkills");

  //       // Merge newly added skills with existing ones
  //       const updatedSkills = [
  //         ...existingSkills,
  //         ...newSkillsAdded.map((skill) => ({
  //           skillName: skill.skillName,
  //           skillId: skill.skillId || null, // Handle the case when skillId is not available
  //           rating: skill.rating || 3, // Default rating if not set
  //         })),
  //       ];

  //       // Update the selectedSkills field in the form
  //       setValue("selectedSkills", updatedSkills);
  //     }
  //   };

  const handleDialogClose = (newSkillsAdded) => {
    setDialogOpen(false);

    if (newSkillsAdded && newSkillsAdded.length > 0) {
      const existingSkills = watch("selectedSkills");

      // Remove duplicates by checking skill names
      const uniqueSkills = newSkillsAdded.filter(
        (newSkill) =>
          !existingSkills.some(
            (existing) =>
              existing.skillName.trim().toLowerCase() ===
              newSkill.skillName.trim().toLowerCase()
          )
      );

      const updatedSkills = [...existingSkills, ...uniqueSkills];
      setValue("selectedSkills", updatedSkills);
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = watch("selectedSkills").filter((_, i) => i !== index);
    setValue("selectedSkills", updatedSkills);
  };

  const handleSubmitAssessment = async (data) => {
    const preparedData = {
      employeeId: userId,
      skills: data.selectedSkills.map((skill) => ({
        skillName: skill.skillName,
        skillId: skill.skillId || null, // Include skillId if available
        rating: skill.rating,
      })),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/SelfAssessmentbyEmp`,
        preparedData,
        { headers: { Authorization: authToken } }
      );

      if (response.data.success) {
        alert("Assessment submitted successfully!");
      }
    } catch (error) {
      console.error(
        "Failed to submit assessment:",
        error.response?.data || error.message
      );
      alert("Failed to submit assessment.");
    }
  };

  const RatingGuidelines = () => {
    const skillLevels = [
      {
        rating: 1,
        level: "Beginner",
        
        description: "Basic understanding, needs significant guidance",
        examples: [
          "Familiar with basic concepts",
          "Can perform simple tasks with supervision",
          "Learning fundamental principles",
        ],
      },
      {
        rating: 2,
        level: "Developing",
        description: "Growing knowledge, requires regular support",
        examples: [
          "Handles routine tasks independently",
          "Needs help with complex problems",
          "Understanding best practices",
        ],
      },
      {
        rating: 3,
        level: "Proficient",
        description: "Good working knowledge, mostly independent",
        examples: [
          "Works independently on most tasks",
          "Solves common problems effectively",
          "Applies best practices consistently",
        ],
      },
      {
        rating: 4,
        level: "Advanced",
        description: "Deep understanding, guides others",
        examples: [
          "Handles complex challenges",
          "Mentors team members",
          "Implements sophisticated solutions",
        ],
      },
      {
        rating: 5,
        level: "Expert",
        description: "Mastery level, drives innovation",
        examples: [
          "Creates new methodologies",
          "Leads strategic initiatives",
          "Recognized authority in the field",
        ],
      },
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Rating Guidelines</h3>
        <div className="space-y-6">
          {skillLevels.map((level) => (
            <div
              key={level.rating}
              className="border-l-4 border-blue-500 pl-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-blue-700">
                  {level.rating}
                </span>
                <h4 className="text-lg font-semibold">{level.level}</h4>
              </div>
              <p className="text-gray-700 mb-2">{level.description}</p>
              <ul className="list-disc list-inside text-gray-600">
                {/* {level.examples.map((example, idx) => (
                  <li key={idx}>{example}</li>
                ))} */}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  
  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Self Assessment"}
        info={"Self-assist in evaluating your skills and discover opportunities for improvement"}
      />
   <form onSubmit={handleSubmit(handleSubmitAssessment)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info & Guidelines */}
        <div className="space-y-6">
          {/* User Profile Card */}
         
          {/* Rating Guidelines Card */}
          <RatingGuidelines />
        </div>
  
        {/* Center & Right Columns - Skill Selection & Assessment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Search & Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Select Skills to Assess</h3>
            <Autocomplete
              multiple
              options={skills}
              getOptionLabel={(option) => option.skillName || "Unnamed Skill"}
              onChange={(_, selected) => {
                const formattedSkills = selected.map((skill) => ({
                  skillName: skill.skillName,
                  skillId: skill.skillId,
                  rating: 0,
                }));
                setValue("selectedSkills", formattedSkills);
                setShowSelectedSkillsSection(formattedSkills.length > 0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search or Select Skills"
                  className="border-gray-300 rounded-lg"
                />
              )}
            />
          </div>
  
          {/* Selected Skills Assessment */}
          {showSelectedSkillsSection && (
            // <div className="bg-white rounded-xl shadow-lg p-6">
             
            //   <h3 className="text-lg font-bold mb-4">Rate Your Skills</h3>
            //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //     {watch("selectedSkills").map((skill, index) => (
            //       <div key={index} className="bg-gray-50 p-4 rounded-lg">
            //         <div className="flex justify-between items-start mb-2">
            //           <p className="font-semibold">{skill.skillName}</p>
            //           <IconButton
            //             onClick={() => handleRemoveSkill(index)}
            //             size="small"
            //             className="text-gray-400 hover:text-red-500"
            //           >
            //             <ClearIcon fontSize="small" />
            //           </IconButton>
            //         </div>
            //         <Rating
            //           value={skill.rating}
            //           onChange={(_, newValue) => setValue(`selectedSkills.${index}.rating`, newValue)}
            //           size="large"
            //         />
            //       </div>
            //     ))}
            //   </div>
            // </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
  <h3 className="text-lg font-bold mb-4">Rate Your Skills</h3>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {watch("selectedSkills").map((skill, index) => (
      <div key={index} className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate mr-2">{skill.skillName}</p>
          <IconButton
            onClick={() => handleRemoveSkill(index)}
            size="small"
            className="text-gray-400 hover:text-red-500"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
        <Rating
          value={skill.rating}
          onChange={(_, newValue) => setValue(`selectedSkills.${index}.rating`, newValue)}
          size="small"
        />
      </div>
    ))}
  </div>
</div>

          )}
  
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              className="px-8"
            >
              Submit Assessment
            </Button>
             {/* <BasicButton
              type="submit"
              size="large"
               className="px-8"
                   variant="contained"
            >
              Submit Assessment
            </BasicButton> */}
          


          </div>
        </div>
      </div>
      </form>
    </BoxComponent>
  );
  
};

export default MyAssessment;





//   {/* User Profile Card */}
//   <div className="bg-white rounded-xl shadow-lg p-6">
//   <div className="flex items-center space-x-4 mb-4">
//     <Avatar
//       sx={{ width: 64, height: 64 }}
//       src={UserInformation?.user_logo_url}
//     />
//     <div>
//       <h2 className="text-xl font-bold">{`${user?.first_name} ${user?.last_name}`}</h2>
//       <p className="text-gray-600">{UserInformation?.designation?.[0]?.designationName}</p>
//     </div>
//   </div>
// </div>
