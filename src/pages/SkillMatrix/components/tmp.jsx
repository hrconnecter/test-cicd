/* eslint-disable no-unused-vars */

import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import UserProfile from "../../../hooks/UserData/useUser";

// Existing imports
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Rating } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Typography,
  Modal
} from "@mui/material";

import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";

const OlddSkillsLookup = () => {
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [newSkillRatings, setNewSkillRatings] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Fetch Assessments Query
  const {
    data: assessments = [],
    isLoading: isAssessmentsLoading,
    error: assessmentsError
  } = useQuery(
    ['assessments', organisationId, currentPage],
    async () => {



      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
        {
          headers: { Authorization: authToken }
        }
      );
      console.log('Assessments Response:', response.data);
      console.log('Assessments Count:', response.data.data.length);
      return response.data.data;
    },
    {
      keepPreviousData: true,
      staleTime: 5000
    }
  );

  // Fetch Completed Manager Assessment Query
  const {
    data: completedAssessmentData,
    isLoading: isSelectedAssessmentLoading,
    refetch: refetchSelectedAssessment
  } = useQuery(
    ['completedManagerAssessment', employeeId, organisationId],
    async () => {
      if (!openModal || !employeeId) return null;
      
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
        {
          headers: { Authorization: authToken }
        }
      );
      console.log('Completed Assessment Response:', response.data);
      console.log('Selected Skills:', response.data.data?.selectedSkills);
      return response.data.data;
    },
    {
      enabled: openModal && !!employeeId,
      onSuccess: (data) => {
        if (data && data.selectedSkills) {
          setSelectedAssessment(data);
        }
      }
    }
  );

  // Submit Manager Ratings Mutation
  const submitRatingsMutation = useMutation(
    async (ratingData) => {
      const { assessmentId, ratings } = ratingData;
      
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${assessmentId}`,
        { selectedSkills: ratings },
        {
          headers: { 
            Authorization: authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Submit Ratings Response:', response.data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['assessments']);
        queryClient.invalidateQueries(['completedManagerAssessment']);
        handleCloseModal();
        console.log('Ratings Submission Successful:', data);
        handleAlert('Ratings submitted successfully', 'success');
      },
      onError: (error) => {
        console.error("Error submitting ratings:", error);
        handleAlert("Error submitting ratings", "error");
      }
    }
  );

  // Handler Methods
  const handleSubmitRatings = () => {
    if (!selectedAssessment?.selectedSkills) return;

    const ratings = selectedAssessment.selectedSkills.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      rating: skill.rating,
      mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
    }));

    submitRatingsMutation.mutate({
      assessmentId: selectedAssessment._id,
      ratings
    });
  };

  const handleOpenModal = (assessment) => {
    const employeeId = assessment.employeeId?._id || assessment.employeeId;
    setEmployeeId(employeeId);
    setNewSkillRatings({});
    setSelectedAssessment({
      ...assessment,
      selectedSkills: assessment.selectedSkills || [],
    });
    setOpenModal(true);
  };

  // const handleEvaluateSkills = (assessment) => {

  //   console.log('Assessment for Evaluation:', assessment);
  //   const employeeId = 
  //   assessment.employeeId?._id || 
  //   assessment.employeeId || 
  //   assessment.employeeId;

  //   const completedAssessments = assessments.filter(
  //     (a) =>
  //       a.employeeId._id === employeeId &&
  //       (a.status.trim().toLowerCase() === "completed" ||
  //        a.status === "Completed")
  //   );

  //   if (completedAssessments.length === 0) {
  //     alert("No completed assessments found for the employee.");
  //     return;
  //   }

  //   const assessmentToEvaluate = completedAssessments.sort((a, b) => 
  //     new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
  //   )[0];

  //   handleOpenModal(assessmentToEvaluate);
  // };


 


const handleEvaluateSkills = (assessment) => {
  console.log('Assessment for Evaluation:', assessment);

  // Safely extract employeeId
  const employeeId = 
    assessment.employeeId?._id || 
    assessment.employeeId || 
    assessment.employeeId;

  // Find all assessments for this employee
  const employeeAssessments = assessments.filter(
    (a) => a.employeeId._id === employeeId
  );

  console.log('All Employee Assessments:', employeeAssessments);

  // Separate completed and pending assessments
  const completedAssessments = employeeAssessments.filter(
    (a) => 
      a.status.trim().toLowerCase() === "completed" || 
      a.status === "Completed"
  );

  const pendingAssessments = employeeAssessments.filter(
    (a) => 
      a.status.trim().toLowerCase() === "pending" || 
      a.status === "Pending"
  );

  // Detailed logging for debugging
  console.log('Completed Assessments:', completedAssessments);
  console.log('Pending Assessments:', pendingAssessments);

  // Comprehensive error handling
  if (completedAssessments.length === 0) {
    // Provide more informative message
    if (pendingAssessments.length > 0) {
      // If there are pending assessments
      handleAlert(
        `There are ${pendingAssessments.length} pending assessments for this employee. Please complete them first.`, 
        'warning'
      );
    } else {
      // If no assessments at all
      handleAlert(
        "No assessments found for this employee. Please create an assessment first.", 
        'error'
      );
    }
    return;
  }

  // Sort completed assessments by date (most recent first)
  const sortedCompletedAssessments = completedAssessments.sort((a, b) => 
    new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
  );

  // If multiple completed assessments, show selection
  if (sortedCompletedAssessments.length > 1) {
    // Option 1: Show modal with assessment selection
    setMultipleAssessments(sortedCompletedAssessments);
    setShowAssessmentSelectionModal(true);
  } else {
    // If only one completed assessment, directly open for evaluation
    handleOpenModal(sortedCompletedAssessments[0]);
  }
};
  
  // New state for multiple assessments
  const [managerAssessments, setManagerAssessments] = useState([]);
  const [multipleAssessments, setMultipleAssessments] = useState([]);
  const [showAssessmentSelectionModal, setShowAssessmentSelectionModal] = useState(false);
  
// New modal for assessment selection
const AssessmentSelectionModal = () => (
  <Modal 
    open={showAssessmentSelectionModal} 
    onClose={() => setShowAssessmentSelectionModal(false)}
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    }}>
      <Typography variant="h6" component="h2">
        Select Assessment to Evaluate
      </Typography>
      {multipleAssessments.map((assessment, index) => (
        <Button
          key={assessment._id}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            handleOpenModal(assessment);
            setShowAssessmentSelectionModal(false);
          }}
        >
          Assessment {index + 1} - {new Date(assessment.assessmentFormSentOn).toLocaleDateString()}
        </Button>
      ))}
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setShowAssessmentSelectionModal(false)}
      >
        Cancel
      </Button>
    </Box>
  </Modal>
);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssessment(null);
    setNewSkillRatings({});
  };

  const handleRatingChange = (skillName, newRating) => {
    setNewSkillRatings((prevRatings) => ({
      ...prevRatings,
      [skillName]: newRating,
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "text-green-600";
      case "in progress": return "text-yellow-600";
      case "pending": return "text-red-600";
      default: return "text-gray-600";
    }
  };


  return (
    <BoxComponent>
      {(isAssessmentsLoading || isSelectedAssessmentLoading) && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}
      
      <HeadingOneLineInfo
        heading={"Skill Evaluation"}
        info={"View and assess your team's skills to drive growth and development."}
      />
      
      <Grid
        container
        spacing={2}
        lg={12}
        xs={12}
        sx={{ my: 1, justifyContent: "space-between" }}
      >
        <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
          <Grid item lg={4}>
            <TextField
              placeholder="Search Employee"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            />
          </Grid>
        </Grid>
      </Grid>

      <AssessmentSelectionModal />


      <Box>
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                <th scope="col" className="!text-left pl-8 py-3">Assessment Date Assigned</th>
                <th scope="col" className="!text-left pl-8 py-3">Assessment Sent To</th>
                <th scope="col" className="!text-left pl-8 py-3">Manager Name</th>
                <th scope="col" className="!text-left pl-8 py-3">Status</th>
                <th scope="col" className="!text-left pl-8 py-3">Skill Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {assessments.length > 0 ? (
                assessments.map((assessment, idx) => (
                  <tr className="!font-medium border-b" key={assessment.srNo}>
                    <td className="!text-left pl-8 py-3">{idx + 1}</td>
                    <td className="py-3 pl-8">
                      {new Date(assessment.assessmentFormSentOn).toLocaleDateString()}
                    </td>
                    <td className="py-3 pl-8">{assessment.employeeName}</td>
                    <td className="py-3 pl-8">{assessment.managerName}</td>
                    <td className={`py-3 pl-8 ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </td>
                    <td
                      className="py-3 pl-8 cursor-pointer text-blue-500"
                      onClick={() => handleEvaluateSkills(assessment)}
                    >
                      Evaluate Skills
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No assessments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal for Skill Evaluation */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              className="modal-container"
              sx={{
                padding: "20px",
                maxWidth: "500px",
                margin: "auto",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <h3>
                Evaluate Skills for{" "}
                {selectedAssessment
                  ? selectedAssessment.employeeName
                  : "Loading..."}
              </h3>

              <div>
                {selectedAssessment?.selectedSkills &&
                selectedAssessment.selectedSkills.length > 0 ? (
                  selectedAssessment.selectedSkills.map((skill, index) => (
                    <Box key={index} sx={{ marginBottom: "15px" }}>
                      <div>{skill.skillName}</div>
                      <div>
                        <Rating value={skill.rating} readOnly size="small" />
                      </div>
                      <div>
                        <Rating
                          value={
                            newSkillRatings[skill.skillName] ||
                            skill.mgr_rating
                          }
                          onChange={(_, newValue) =>
                            handleRatingChange(skill.skillName, newValue)
                          }
                          size="small"
                        />
                      </div>
                    </Box>
                  ))
                ) : (
                  <p>
                    No skills found!! Please Complete your pending Assessment
                    first.
                  </p>
                )}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitRatings}
                sx={{ marginTop: "15px" }}
              >
                Submit Ratings
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                sx={{ marginTop: "15px", marginLeft: "10px" }}
              >
                Close
              </Button>
            </Box>
          </Modal>

          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
          >
            <div>
              <Typography variant="body2">
                Showing page {currentPage} of {assessments.length} pages
              </Typography>
            </div>

            <Pagination
              count={assessments.length}
              page={currentPage}
              color="primary"
              shape="rounded"
              siblingCount={0}
              boundaryCount={0}
              hidePrevButton={currentPage === 1}
              hideNextButton={currentPage === assessments.length}
              onChange={(event, value) => setCurrentPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                />
              )}
            />
          </Stack>
        </div>
      </Box>

      <br />
      <br />
      <br />
      <Box>
        <FetchEvaluateAssSkills />
      </Box>
    </BoxComponent>
  );
};

export default OlddSkillsLookup;







// ___________
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Rating } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   Pagination,
//   PaginationItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { Modal } from "@mui/material";
// import { CSVLink } from "react-csv";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useNavigate, useParams } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Card from "../../peformance/components/Card";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";

// const OlddSkillsLookup = () => {
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   // const orgId = useParams().organisationId;
//   const { organisationId } = useParams();
//   const navigate = useNavigate();
//   const [org, setOrg] = useState();
//   // const [nameSearch, setNameSearch] = useState("");
//   // const [locationSearch, setLocationSearch] = useState("");
//   // const [deptSearch, setDeptSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [assessments, setAssessments] = useState([]);
//   const [error, setError] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [selectedAssessment, setSelectedAssessment] = useState(null);
//   const [newSkillRatings, setNewSkillRatings] = useState({});
//   // const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
//   // const [isLoadingCompletedAssessment, setIsLoadingCompletedAssessment] = useState(false);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         setIsLoading(true);
//         console.log("ashu API Response:", response.data.data);

//         setAssessments(response.data.data);
//         setTotalPages(response.data.totalPages);
//         setIsLoading(false);
//       } catch (error) {
//         setIsLoading(false);
//         setError(
//           error.response?.data?.message || "Failed to fetch assessment details"
//         );
//       }
//     };
//     const fetchCompletedManagerAssessment = async () => {
//       if (openModal && employeeId && organisationId) {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
//             // `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );

//           console.log("Assessment API Response:", response.data);
//           if (response.data.data && response.data.data.selectedSkills) {
//             setSelectedAssessment(response.data.data);
//           } else {
//             console.log("No completed assessments found for the employee.");
//             setSelectedAssessment(null);
//           }

//           setIsLoading(false);
//         } catch (error) {
//           setIsLoading(false);
//           setError(
//             error.response?.data?.message ||
//               "Failed to fetch completed assessment"
//           );
//           console.error("Error fetching assessment:", error);
//         }
//       }
//     };

    
//     fetchAssessments();
//     // fetchCompletedManagerAssessment();
//   }, [
//     organisationId,
//     authToken,
//     currentPage,
//     openModal,
//     employeeId,
//     setSelectedAssessment,
//   ]);
  

//   // Submit the ratings
//   const handleSubmitRatings = async () => {
//     if (!selectedAssessment || !selectedAssessment.selectedSkills) return;

//     const ratings = selectedAssessment.selectedSkills.map((skill) => ({
//       skillId: skill.skillId,
//       skillName: skill.skillName,
//       rating: skill.rating,
//       mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
//     }));

//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${selectedAssessment?._id}`,
//         // { ratings },
//         { selectedSkills: ratings },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("Manager Assessment submitted successfully:", response.data);
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error submitting manager ratings:", error);
//       setError("Failed to submit ratings");
//     }
//   };

//   const handleOpenModal = (assessment) => {
//     console.log("Opening modal for assessment:", assessment);
//     setEmployeeId(assessment.employeeId?._id);
//     setNewSkillRatings({}); // Clear previous ratings
//     setSelectedAssessment({
//       ...assessment,
//       selectedSkills: assessment.selectedSkills || [],
//     });
//     // setSelectedAssessment(null);
//     setOpenModal(true);
//   };

//   const handleEvaluateSkills = (assessment) => {
//     const employeeId = assessment.employeeId._id;
//     setEmployeeId(employeeId);
//     console.log("Employee ID:", employeeId);

//     // Filter completed assessments for the selected employee
//     const completedAssessments = assessments.filter(
//       (assessment) =>
//         assessment.employeeId._id === employeeId &&
//         (assessment.status.trim().toLowerCase() === "completed" ||
//           assessment.status === "Completed")
//     );

//     // Log the filtered assessments
//     console.log("Completed Assessments:", completedAssessments);

//     // Check if there are any completed assessments
//     if (completedAssessments.length === 0) {
//       console.log("No completed assessments found for the employee");
//       alert("No completed assessments found for the employee.");
//       return;
//     }

//     // If there are completed assessments, handle the logic for evaluation
//     const assessmentToEvaluate = completedAssessments[0]; // Assuming you want the first completed assessment
//     console.log("Assessment to Evaluate:", assessmentToEvaluate);

//     // Example: Open modal to evaluate skills or perform other actions
//     handleOpenModal(assessmentToEvaluate);
//   };
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAssessment(null);
//     setNewSkillRatings({});
//   };

//   // const handleRatingChange = (skillName, value) => {
//   //   setNewSkillRatings({
//   //     ...newSkillRatings,
//   //     [skillName]: value,
//   //   });
//   // };
//   const handleRatingChange = (skillName, newRating) => {
//     setNewSkillRatings((prevRatings) => ({
//       ...prevRatings,
//       [skillName]: newRating,
//     }));
//   };

//   // Status Color Mapping
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "text-green-600";
//       case "in progress":
//         return "text-yellow-600";
//       case "pending":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <>
//       <BoxComponent>
//         {isLoading && (
//           <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//             <CircularProgress />
//           </div>
//         )}
//         <HeadingOneLineInfo
//           heading={"Skill Evaluation "}
//           info={
//             "View and assess your team's skills to drive growth and development."
//           }
//         />
//         <Grid
//           container
//           spacing={2}
//           lg={12}
//           xs={12}
//           sx={{ my: 1, justifyContent: "space-between" }}
//         >
//           <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
//             <Grid item lg={4}>
//               <TextField
//                 // onChange={(e) => handleSearchChange("name", e.target.value)}
//                 placeholder="Search Employee"
//                 variant="outlined"
//                 size="small"
//                 sx={{ bgcolor: "white" }}
//               />
//             </Grid>
//           </Grid>
//         </Grid>

//         <Box>
//           <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//             {isLoading && (
//               <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//                 <CircularProgress />
//               </div>
//             )}

//             <table className="min-w-full bg-white text-left !text-sm font-light">
//               <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <tr className="!font-semibold">
//                   <th scope="col" className="!text-left pl-8 py-3">
//                     Sr. No
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("assessmentFormSentOn")}
//                   >
//                     Assessment Date Assigned
//                     {/* {sortBy === "assessmentFormSentOn" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("employeeName")}
//                   >
//                     Assessment Sent To
//                     {/* {sortBy === "employeeName" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("managerName")}
//                   >
//                     Manager Name
//                     {/*{sortBy === "managerName" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("status")}
//                   >
//                     Status
//                     {/* {sortBy === "status" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>

//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("status")}
//                   >
//                     Skill Evaluation
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {assessments.length > 0 ? (
//                   assessments.map((assessment, idx) => (
//                     <tr className="!font-medium border-b" key={assessment.srNo}>
//                       <td className="!text-left pl-8 py-3">{idx + 1}</td>
//                       <td className="py-3 pl-8">
//                         {new Date(
//                           assessment.assessmentFormSentOn
//                         ).toLocaleDateString()}
//                       </td>
//                       <td className="py-3 pl-8">{assessment.employeeName}</td>
//                       <td className="py-3 pl-8">{assessment.managerName}</td>
//                       {/* <td className="py-3 pl-8">{assessment.status}</td> */}

//                       <td
//                         className={`py-3 pl-8 ${getStatusColor(
//                           assessment.status
//                         )}`}
//                       >
//                         {assessment.status}
//                       </td>

//                       <td
//                         className="py-3 pl-8 cursor-pointer text-blue-500"
//                         onClick={() => handleEvaluateSkills(assessment)}
//                       >
//                         Evaluate Skills
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-3">
//                       No assessments found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {/* // Modal for Skill Evaluation */}
//             <Modal open={openModal} onClose={handleCloseModal}>
//               <Box
//                 className="modal-container"
//                 sx={{
//                   padding: "20px",
//                   maxWidth: "500px",
//                   margin: "auto",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                 }}
//               >
//                 {/* <h3>Evaluate Skills for {selectedAssessment?.employeeName}</h3> */}
//                 <h3>
//                   Evaluate Skills for{" "}
//                   {selectedAssessment
//                     ? selectedAssessment.employeeName
//                     : "Loading..."}
//                 </h3>

//                 <div>
//                   {selectedAssessment?.selectedSkills &&
//                   selectedAssessment.selectedSkills.length > 0 ? (
//                     selectedAssessment.selectedSkills.map((skill, index) => (
//                       <Box key={index} sx={{ marginBottom: "15px" }}>
//                         <div>{skill.skillName}</div>
//                         {/*
//                         <TextField
//                           label=" Employee Rating"
//                           type="number"
//                           value={
//                             newSkillRatings[skill.skillName] || skill.rating
//                           }
//                         />

//                         <TextField
//                           label="Manager Rating (1-5)"
//                           type="number"
//                           value={
//                             newSkillRatings[skill.skillName] || skill.mgr_rating
//                           }
//                           onChange={(e) =>
//                             handleRatingChange(skill.skillName, e.target.value)
//                           }
//                           inputProps={{
//                             min: 1,
//                             max: 5,
//                           }}
//                           sx={{ width: "100%" }}
//                         /> */}

//                         <div>
//                           <Rating value={skill.rating} readOnly size="small" />
//                         </div>

//                         <div>
//                           <Rating
//                             value={
//                               newSkillRatings[skill.skillName] ||
//                               skill.mgr_rating
//                             }
//                             onChange={(_, newValue) =>
//                               handleRatingChange(skill.skillName, newValue)
//                             }
//                             size="small"
//                           />
//                         </div>
//                       </Box>
//                     ))
//                   ) : (
//                     <p>
//                       No skills found!! Please Complete your pending Assessment
//                       first.
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSubmitRatings}
//                   sx={{ marginTop: "15px" }}
//                 >
//                   Submit Ratings
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={handleCloseModal}
//                   sx={{ marginTop: "15px", marginLeft: "10px" }}
//                 >
//                   Close
//                 </Button>
//               </Box>
//             </Modal>
//             <Stack
//               direction={"row"}
//               className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//             >
//               <div>
//                 <Typography variant="body2">
//                   Showing page {currentPage} of {totalPages} pages
//                 </Typography>
//               </div>

//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 color="primary"
//                 shape="rounded"
//                 siblingCount={0}
//                 boundaryCount={0}
//                 hidePrevButton={currentPage === 1}
//                 hideNextButton={currentPage === totalPages}
//                 onChange={(event, value) => setCurrentPage(value)}
//                 renderItem={(item) => (
//                   <PaginationItem
//                     {...item}
//                     components={{
//                       previous: ArrowBackIcon,
//                       next: ArrowForwardIcon,
//                     }}
//                   />
//                 )}
//               />
//             </Stack>
//           </div>
//         </Box>

//         <br />
//         <br />
//         <br />
//         <Box>
//           <FetchEvaluateAssSkills />
//         </Box>
//       </BoxComponent>
//     </>
//   );
// };

// export default OlddSkillsLookup;




//backup
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Rating } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   Pagination,
//   PaginationItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { Modal } from "@mui/material";
// import { CSVLink } from "react-csv";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useNavigate, useParams } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Card from "../../peformance/components/Card";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";

// const OlddSkillsLookup = () => {
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   // const orgId = useParams().organisationId;
//   const { organisationId } = useParams();
//   const navigate = useNavigate();
//   const [org, setOrg] = useState();
//   // const [nameSearch, setNameSearch] = useState("");
//   // const [locationSearch, setLocationSearch] = useState("");
//   // const [deptSearch, setDeptSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [assessments, setAssessments] = useState([]);
//   const [error, setError] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [selectedAssessment, setSelectedAssessment] = useState(null);
//   const [newSkillRatings, setNewSkillRatings] = useState({});
//   // const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
//   // const [isLoadingCompletedAssessment, setIsLoadingCompletedAssessment] = useState(false);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         setIsLoading(true);
//         console.log("ashu API Response:", response.data.data);

//         setAssessments(response.data.data);
//         setTotalPages(response.data.totalPages);
//         setIsLoading(false);
//       } catch (error) {
//         setIsLoading(false);
//         setError(
//           error.response?.data?.message || "Failed to fetch assessment details"
//         );
//       }
//     };
//     const fetchCompletedManagerAssessment = async () => {
//       if (openModal && employeeId && organisationId) {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
//             // `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );

//           console.log("Assessment API Response:", response.data);
//           if (response.data.data && response.data.data.selectedSkills) {
//             setSelectedAssessment(response.data.data);
//           } else {
//             console.log("No completed assessments found for the employee.");
//             setSelectedAssessment(null);
//           }

//           setIsLoading(false);
//         } catch (error) {
//           setIsLoading(false);
//           setError(
//             error.response?.data?.message ||
//               "Failed to fetch completed assessment"
//           );
//           console.error("Error fetching assessment:", error);
//         }
//       }
//     };

    
//     fetchAssessments();
//     fetchCompletedManagerAssessment();
//   }, [
//     organisationId,
//     authToken,
//     currentPage,
//     openModal,
//     employeeId,
//     setSelectedAssessment,
//   ]);
  

//   // Submit the ratings
//   const handleSubmitRatings = async () => {
//     if (!selectedAssessment || !selectedAssessment.selectedSkills) return;

//     const ratings = selectedAssessment.selectedSkills.map((skill) => ({
//       skillId: skill.skillId,
//       skillName: skill.skillName,
//       rating: skill.rating,
//       mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
//     }));

//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${selectedAssessment?._id}`,
//         // { ratings },
//         { selectedSkills: ratings },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("Manager Assessment submitted successfully:", response.data);
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error submitting manager ratings:", error);
//       setError("Failed to submit ratings");
//     }
//   };

//   const handleOpenModal = (assessment) => {
//     console.log("Opening modal for assessment:", assessment);
//     setEmployeeId(assessment.employeeId?._id);
//     setNewSkillRatings({}); // Clear previous ratings
//     setSelectedAssessment({
//       ...assessment,
//       selectedSkills: assessment.selectedSkills || [],
//     });
//     // setSelectedAssessment(null);
//     setOpenModal(true);
//   };

//   const handleEvaluateSkills = (assessment) => {
//     const employeeId = assessment.employeeId._id;
//     setEmployeeId(employeeId);
//     console.log("Employee ID:", employeeId);

//     // Filter completed assessments for the selected employee
//     const completedAssessments = assessments.filter(
//       (assessment) =>
//         assessment.employeeId._id === employeeId &&
//         (assessment.status.trim().toLowerCase() === "completed" ||
//           assessment.status === "Completed")
//     );

//     // Log the filtered assessments
//     console.log("Completed Assessments:", completedAssessments);

//     // Check if there are any completed assessments
//     if (completedAssessments.length === 0) {
//       console.log("No completed assessments found for the employee");
//       alert("No completed assessments found for the employee.");
//       return;
//     }

//     // If there are completed assessments, handle the logic for evaluation
//     const assessmentToEvaluate = completedAssessments[0]; // Assuming you want the first completed assessment
//     console.log("Assessment to Evaluate:", assessmentToEvaluate);

//     // Example: Open modal to evaluate skills or perform other actions
//     handleOpenModal(assessmentToEvaluate);
//   };
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAssessment(null);
//     setNewSkillRatings({});
//   };

//   // const handleRatingChange = (skillName, value) => {
//   //   setNewSkillRatings({
//   //     ...newSkillRatings,
//   //     [skillName]: value,
//   //   });
//   // };
//   const handleRatingChange = (skillName, newRating) => {
//     setNewSkillRatings((prevRatings) => ({
//       ...prevRatings,
//       [skillName]: newRating,
//     }));
//   };

//   // Status Color Mapping
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "text-green-600";
//       case "in progress":
//         return "text-yellow-600";
//       case "pending":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <>
//       <BoxComponent>
//         {isLoading && (
//           <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//             <CircularProgress />
//           </div>
//         )}
//         <HeadingOneLineInfo
//           heading={"Skill Evaluation "}
//           info={
//             "View and assess your team's skills to drive growth and development."
//           }
//         />
//         <Grid
//           container
//           spacing={2}
//           lg={12}
//           xs={12}
//           sx={{ my: 1, justifyContent: "space-between" }}
//         >
//           <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
//             <Grid item lg={4}>
//               <TextField
//                 // onChange={(e) => handleSearchChange("name", e.target.value)}
//                 placeholder="Search Employee"
//                 variant="outlined"
//                 size="small"
//                 sx={{ bgcolor: "white" }}
//               />
//             </Grid>
//           </Grid>
//         </Grid>

//         <Box>
//           <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//             {isLoading && (
//               <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//                 <CircularProgress />
//               </div>
//             )}

//             <table className="min-w-full bg-white text-left !text-sm font-light">
//               <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <tr className="!font-semibold">
//                   <th scope="col" className="!text-left pl-8 py-3">
//                     Sr. No
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("assessmentFormSentOn")}
//                   >
//                     Assessment Date Assigned
//                     {/* {sortBy === "assessmentFormSentOn" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("employeeName")}
//                   >
//                     Assessment Sent To
//                     {/* {sortBy === "employeeName" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("managerName")}
//                   >
//                     Manager Name
//                     {/*{sortBy === "managerName" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>
//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("status")}
//                   >
//                     Status
//                     {/* {sortBy === "status" &&
//               (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
//                   </th>

//                   <th
//                     scope="col"
//                     className="!text-left pl-8 py-3"
//                     // onClick={() => handleSort("status")}
//                   >
//                     Skill Evaluation
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {assessments.length > 0 ? (
//                   assessments.map((assessment, idx) => (
//                     <tr className="!font-medium border-b" key={assessment.srNo}>
//                       <td className="!text-left pl-8 py-3">{idx + 1}</td>
//                       <td className="py-3 pl-8">
//                         {new Date(
//                           assessment.assessmentFormSentOn
//                         ).toLocaleDateString()}
//                       </td>
//                       <td className="py-3 pl-8">{assessment.employeeName}</td>
//                       <td className="py-3 pl-8">{assessment.managerName}</td>
//                       {/* <td className="py-3 pl-8">{assessment.status}</td> */}

//                       <td
//                         className={`py-3 pl-8 ${getStatusColor(
//                           assessment.status
//                         )}`}
//                       >
//                         {assessment.status}
//                       </td>

//                       <td
//                         className="py-3 pl-8 cursor-pointer text-blue-500"
//                         onClick={() => handleEvaluateSkills(assessment)}
//                       >
//                         Evaluate Skills
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-3">
//                       No assessments found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {/* // Modal for Skill Evaluation */}
//             <Modal open={openModal} onClose={handleCloseModal}>
//               <Box
//                 className="modal-container"
//                 sx={{
//                   padding: "20px",
//                   maxWidth: "500px",
//                   margin: "auto",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                 }}
//               >
//                 {/* <h3>Evaluate Skills for {selectedAssessment?.employeeName}</h3> */}
//                 <h3>
//                   Evaluate Skills for{" "}
//                   {selectedAssessment
//                     ? selectedAssessment.employeeName
//                     : "Loading..."}
//                 </h3>

//                 <div>
//                   {selectedAssessment?.selectedSkills &&
//                   selectedAssessment.selectedSkills.length > 0 ? (
//                     selectedAssessment.selectedSkills.map((skill, index) => (
//                       <Box key={index} sx={{ marginBottom: "15px" }}>
//                         <div>{skill.skillName}</div>
//                         {/*
//                         <TextField
//                           label=" Employee Rating"
//                           type="number"
//                           value={
//                             newSkillRatings[skill.skillName] || skill.rating
//                           }
//                         />

//                         <TextField
//                           label="Manager Rating (1-5)"
//                           type="number"
//                           value={
//                             newSkillRatings[skill.skillName] || skill.mgr_rating
//                           }
//                           onChange={(e) =>
//                             handleRatingChange(skill.skillName, e.target.value)
//                           }
//                           inputProps={{
//                             min: 1,
//                             max: 5,
//                           }}
//                           sx={{ width: "100%" }}
//                         /> */}

//                         <div>
//                           <Rating value={skill.rating} readOnly size="small" />
//                         </div>

//                         <div>
//                           <Rating
//                             value={
//                               newSkillRatings[skill.skillName] ||
//                               skill.mgr_rating
//                             }
//                             onChange={(_, newValue) =>
//                               handleRatingChange(skill.skillName, newValue)
//                             }
//                             size="small"
//                           />
//                         </div>
//                       </Box>
//                     ))
//                   ) : (
//                     <p>
//                       No skills found!! Please Complete your pending Assessment
//                       first.
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSubmitRatings}
//                   sx={{ marginTop: "15px" }}
//                 >
//                   Submit Ratings
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={handleCloseModal}
//                   sx={{ marginTop: "15px", marginLeft: "10px" }}
//                 >
//                   Close
//                 </Button>
//               </Box>
//             </Modal>
//             <Stack
//               direction={"row"}
//               className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//             >
//               <div>
//                 <Typography variant="body2">
//                   Showing page {currentPage} of {totalPages} pages
//                 </Typography>
//               </div>

//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 color="primary"
//                 shape="rounded"
//                 siblingCount={0}
//                 boundaryCount={0}
//                 hidePrevButton={currentPage === 1}
//                 hideNextButton={currentPage === totalPages}
//                 onChange={(event, value) => setCurrentPage(value)}
//                 renderItem={(item) => (
//                   <PaginationItem
//                     {...item}
//                     components={{
//                       previous: ArrowBackIcon,
//                       next: ArrowForwardIcon,
//                     }}
//                   />
//                 )}
//               />
//             </Stack>
//           </div>
//         </Box>

//         <br />
//         <br />
//         <br />
//         <Box>
//           <FetchEvaluateAssSkills />
//         </Box>
//       </BoxComponent>
//     </>
//   );
// };

// export default OlddSkillsLookup;

