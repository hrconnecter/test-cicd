import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
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
  Modal,
} from "@mui/material";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";

const OlddSkillsLookup = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [newSkillRatings, setNewSkillRatings] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const groupAssessmentsByEmployee = (assessments) => {
    const grouped = {};
    assessments.forEach((assessment) => {
      const employeeId = assessment.employeeId._id;
      if (!grouped[employeeId]) {
        grouped[employeeId] = {
          ...assessment,
          allAssessments: [assessment],
        };
      } else {
        grouped[employeeId].allAssessments.push(assessment);
      }
    });
    return Object.values(grouped);
  };

  const { data: assessments = [], isLoading: isAssessmentsLoading } = useQuery(
    ["assessments", organisationId, currentPage],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data;
    },
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const submitRatingsMutation = useMutation(
    async (ratingData) => {
      const { assessmentId, ratings } = ratingData;
      if (!assessmentId) {
        throw new Error("Assessment ID is required");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${assessmentId}`,
        { selectedSkills: ratings },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["assessments"]);
        handleCloseModal();
        handleAlert("Ratings submitted successfully", "success");
      },
      onError: (error) => {
        handleAlert(error.message || "Error submitting ratings", "error");
      },
    }
  );

  const handleSubmitRatings = () => {
    const currentAssessment =
      selectedAssessment.allAssessments[selectedAssessmentIndex];
    if (!currentAssessment?.selectedSkills) return;

    const ratings = currentAssessment.selectedSkills.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      rating: skill.rating,
      mgr_rating: newSkillRatings[skill.skillName] || skill.managerRating,
    }));

    submitRatingsMutation.mutate({
      assessmentId: currentAssessment.assessmentId,
      ratings,
    });
  };

  const handleOpenModal = (employeeData) => {
    const employeeId = employeeData.employeeId._id;

    setEmployeeId(employeeId);
    setNewSkillRatings({});
    setSelectedAssessmentIndex(0);
    setSelectedAssessment({
      employeeName: employeeData.employeeName,
      employeeId: employeeId,
      allAssessments: employeeData.allAssessments,
    });
    setOpenModal(true);
  };

  const handleEvaluateSkills = (employeeData) => {
    const completedAssessments = employeeData.allAssessments.filter(
      (a) =>
        a.status.trim().toLowerCase() === "completed" ||
        a.status === "Completed"
    );

    if (completedAssessments.length === 0) {
      handleAlert(
        "No completed assessments found for the employee.",
        "warning"
      );
      return;
    }

    handleOpenModal(employeeData);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssessment(null);
    setNewSkillRatings({});
    setSelectedAssessmentIndex(0);
  };

  const handleRatingChange = (skillName, newRating) => {
    // Find the skill being rated
    const currentAssessment =
      selectedAssessment?.allAssessments[selectedAssessmentIndex];
    const skill = currentAssessment?.selectedSkills.find(
      (s) => s.skillName === skillName
    );

    if (skill?.managerRating && !newSkillRatings[skillName]) {
      // Show a warning message
      handleAlert(
        `You have already assessed the skill "${skillName}". Do you want to re-assess it?`,
        "warning"
      );
    }
    setNewSkillRatings((prevRatings) => ({
      ...prevRatings,
      [skillName]: newRating,
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "in progress":
        return "text-yellow-600";
      case "pending":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Add this filter function before the return statement
  const filteredAssessments = assessments.filter((assessment) => {
    const employeeName = assessment.employeeName.toLowerCase();
    const searchTerm = searchQuery.toLowerCase();
    return employeeName.includes(searchTerm);
  });
  return (
    <>
      {isAssessmentsLoading && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ bgcolor: "white" }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Box>
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Sr. No
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Latest Assessment Date
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Employee Name
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Manager Name
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Status
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            {/* {groupAssessmentsByEmployee(filteredAssessments).map((employeeData, idx) => ( */}

            <tbody>
              {assessments.length > 0 ? (
                // groupAssessmentsByEmployee(assessments).map((employeeData, idx) => (
                groupAssessmentsByEmployee(filteredAssessments).map(
                  (employeeData, idx) => (
                    <tr
                      className="!font-medium border-b"
                      key={employeeData.employeeId._id}
                    >
                      <td className="!text-left pl-8 py-3">{idx + 1}</td> 
                      <td className="py-3 pl-8">
                        {new Date(
                          employeeData.assessmentFormSentOn
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 pl-8">{employeeData.employeeName}</td>
                      <td className="py-3 pl-8">{employeeData.managerName}</td>
                      <td
                        className={`py-3 pl-8 ${getStatusColor(
                          employeeData.status
                        )}`}
                      >
                        {employeeData.status}
                      </td>
                      <td
                        className="py-3 pl-8 cursor-pointer text-blue-500"
                        onClick={() => handleEvaluateSkills(employeeData)}
                      >
                        Evaluate Skills ({employeeData.allAssessments.length}{" "}
                        assessments)
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No assessments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              className="modal-container"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                maxWidth: "600px",
                width: "90%",
                backgroundColor: "white",
                borderRadius: "8px",
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <h3 className="text-xl font-bold mb-4">
                Evaluate Skills for {selectedAssessment?.employeeName}
              </h3>

              {selectedAssessment?.allAssessments && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Select Assessment:
                  </Typography>
                  <select
                    value={selectedAssessmentIndex}
                    onChange={(e) =>
                      setSelectedAssessmentIndex(Number(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                  >
                    {selectedAssessment.allAssessments.map(
                      (assessment, idx) => (
                        <option key={idx} value={idx}>
                          {new Date(
                            assessment.assessmentFormSentOn
                          ).toLocaleDateString()}{" "}
                          - {assessment.status}
                        </option>
                      )
                    )}
                  </select>
                </Box>
              )}

              <div className="space-y-4">
                {selectedAssessment?.allAssessments[
                  selectedAssessmentIndex
                ]?.selectedSkills.map((skill, index) => (
                  <Box key={index} className="p-3 border rounded">
                    <div className="font-semibold mb-2">{skill.skillName}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="min-w-[120px]">Employee Rating:</span>
                      <Rating value={skill.rating} readOnly size="small" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="min-w-[120px]">Manager Rating:</span>
                      <Rating
                        value={
                          newSkillRatings[skill.skillName] ||
                          skill.managerRating ||
                          0
                        }
                        onChange={(_, newValue) =>
                          handleRatingChange(skill.skillName, newValue)
                        }
                        size="small"
                      />
                    </div>
                    {skill.managerRating &&
                      !newSkillRatings[skill.skillName] && (
                        <Typography
                          variant="body2"
                          sx={{ color: "red", mt: 1, fontSize: "0.875rem" }}
                        >
                          Warning: You have already rated this skill.
                          Reassessing will overwrite the existing rating.
                        </Typography>
                      )}
                  </Box>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitRatings}
                >
                  Submit Ratings
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </div>
            </Box>
          </Modal>

          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
          >
            <div>
              <Typography variant="body2">
                Showing page {currentPage} of{" "}
                {Math.ceil(assessments.length / 10)} pages
              </Typography>
            </div>

            <Pagination
              count={Math.ceil(assessments.length / 10)}
              page={currentPage}
              color="primary"
              shape="rounded"
              siblingCount={0}
              boundaryCount={0}
              hidePrevButton={currentPage === 1}
              hideNextButton={
                currentPage === Math.ceil(assessments.length / 10)
              }
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

      {/* <br />
      <br /> */}
      {/* <Box>
        <FetchEvaluateAssSkills />
      </Box> */}
    </>
  );
};

export default OlddSkillsLookup;

// import React, { useState, useContext } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// // import UserProfile from "../../../hooks/UserData/useUser";

// // Existing imports
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Rating } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Pagination,
//   PaginationItem,
//   Stack,
//   TextField,
//   Typography,
//   Modal,
// } from "@mui/material";

// // import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// // import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";
// // import useHook from '../../../hooks/UserProfile/useHook';

// const OlddSkillsLookup = () => {
//   // const { useGetCurrentRole } = UserProfile();
//   // const role = useGetCurrentRole();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();

//   // const { UserInformation } = useHook();
//   // const employeeId = UserInformation?._id;

//   const [currentPage, setCurrentPage] = useState(1);
//   const [openModal, setOpenModal] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [newSkillRatings, setNewSkillRatings] = useState({});
//   const [selectedAssessment, setSelectedAssessment] = useState(null);

//   // Fetch Assessments Query
//   const {
//     data: assessments = [],
//     isLoading: isAssessmentsLoading,
//     // error: assessmentsError
//   } = useQuery(
//     ["assessments", organisationId, currentPage],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       console.log("Assessments Response:", response.data);
//       console.log("Assessments Count:", response.data.data.length);
//       return response.data.data;
//     },
//     {
//       keepPreviousData: true,
//       staleTime: 5000,
//     }
//   );

//   // Fetch Completed Manager Assessment Query
//   // const {
//   //   data: completedAssessmentData,
//   //   isLoading: isSelectedAssessmentLoading,
//   //   refetch: refetchSelectedAssessment
//   // } = useQuery(
//   //   ['completedManagerAssessment', employeeId, organisationId],
//   //   async () => {
//   //     if (!openModal || !employeeId) return null;

//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
//   //       {
//   //         headers: { Authorization: authToken }
//   //       }
//   //     );
//   //     console.log('Completed Assessment Response:', response.data);
//   //     console.log('Selected Skills:', response.data.data?.selectedSkills);
//   //     return response.data.data;
//   //   },
//   //   {
//   //     enabled: openModal && !!employeeId,
//   //     onSuccess: (data) => {
//   //       if (data && data.selectedSkills) {
//   //         setSelectedAssessment(data);
//   //         console.log('Completed Assessment Data:', data);
//   //       }
//   //     }
//   //   }
//   // );

//   // Submit Manager Ratings Mutation
//   // const submitRatingsMutation = useMutation(
//   //   async (ratingData) => {
//   //     const { assessmentId, ratings } = ratingData;

//   //     console.log('Submitting Ratings:', {
//   //       assessmentId,
//   //       ratings
//   //     });
//   //     const response = await axios.put(
//   //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating`,
//   //       { selectedSkills: ratings },
//   //       {
//   //         headers: {
//   //           Authorization: authToken,
//   //           'Content-Type': 'application/json'
//   //         }
//   //       }
//   //     );
//   //     console.log('Submit Ratings Response:', response.data);
//   //     return response.data;
//   //   },
//   //   {
//   //     onSuccess: (data) => {
//   //       queryClient.invalidateQueries(['assessments']);
//   //       queryClient.invalidateQueries(['completedManagerAssessment']);
//   //       handleCloseModal();
//   //       console.log('Ratings Submission Successful:', data);
//   //       handleAlert('Ratings submitted successfully', 'success');
//   //     },
//   //     onError: (error) => {
//   //       console.error("Error submitting ratings:", error);
//   //       handleAlert("Error submitting ratings", "error");
//   //     }
//   //   }
//   // );
//   const submitRatingsMutation = useMutation(
//     async (ratingData) => {
//       const { assessmentId, ratings } = ratingData;

//       if (!assessmentId) {
//         throw new Error("Assessment ID is required");
//       }

//       console.log("Submitting Ratings:", {
//         assessmentId,
//         ratings,
//       });

//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${assessmentId}`,
//         { selectedSkills: ratings },
//         {
//           headers: {
//             Authorization: authToken,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Submit Ratings Response:", response.data);
//       return response.data;
//     },
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries(["assessments"]);
//         handleCloseModal();
//         console.log("Ratings Submission Successful:", data);
//         handleAlert("Ratings submitted successfully", "success");
//       },
//       onError: (error) => {
//         console.error("Error submitting ratings:", error);
//         handleAlert(error.message || "Error submitting ratings", "error");
//       },
//     }
//   );
//   // Handler Methods
//   const handleSubmitRatings = () => {
//     if (!selectedAssessment?.selectedSkills) return;

//     console.log("Selected Assessment:", selectedAssessment);
//     console.log("Assessment ID:", selectedAssessment.assessmentId);

//     const ratings = selectedAssessment.selectedSkills.map((skill) => ({
//       skillId: skill.skillId,
//       skillName: skill.skillName,
//       rating: skill.rating,
//       mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
//     }));

//     // Always use assessmentId
//     submitRatingsMutation.mutate({
//       assessmentId: selectedAssessment.assessmentId,
//       ratings,
//     });
//   };

//   const handleOpenModal = (assessment) => {
//     const employeeId = assessment.employeeId?._id || assessment.employeeId;
//     setEmployeeId(employeeId);
//     setNewSkillRatings({});

//     // Use the actual assessmentId from the API response
//     setSelectedAssessment({
//       _id: assessment.assessmentId,
//       assessmentId: assessment.assessmentId,
//       employeeName: assessment.employeeName,
//       employeeId: assessment.employeeId,
//       selectedSkills: assessment.selectedSkills.map((skill) => ({
//         ...skill,
//         skillId: skill.skillId,
//         skillName: skill.skillName,
//         rating: skill.rating,
//         mgr_rating: skill.managerRating,
//       })),
//       assessmentFormSentOn: assessment.assessmentFormSentOn,
//       status: assessment.status,
//       overallRating: assessment.overallRating,
//       srNo: assessment.srNo,
//     });

//     setOpenModal(true);
//   };

//   // const handleEvaluateSkills = (assessment) => {

//   //   console.log('Assessment for Evaluation:', assessment);
//   //   const employeeId =
//   //   assessment.employeeId?._id ||
//   //   assessment.employeeId ||
//   //   assessment.employeeId;

//   //   const completedAssessments = assessments.filter(
//   //     (a) =>
//   //       a.employeeId._id === employeeId &&
//   //       (a.status.trim().toLowerCase() === "completed" ||
//   //        a.status === "Completed")
//   //   );

//   //   if (completedAssessments.length === 0) {
//   //     alert("No completed assessments found for the employee.");
//   //     return;
//   //   }

//   //   const assessmentToEvaluate = completedAssessments.sort((a, b) =>
//   //     new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
//   //   )[0];

//   //   handleOpenModal(assessmentToEvaluate);
//   // };

//   const handleEvaluateSkills = (assessment) => {
//     console.log("Assessment for Evaluation:", assessment);

//     const completedAssessments = assessments.filter(
//       (a) =>
//         a.employeeId._id === assessment.employeeId._id &&
//         (a.status.trim().toLowerCase() === "completed" ||
//           a.status === "Completed")
//     );

//     if (completedAssessments.length === 0) {
//       alert("No completed assessments found for the employee.");
//       return;
//     }

//     const assessmentToEvaluate = completedAssessments.sort(
//       (a, b) =>
//         new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
//     )[0];

//     handleOpenModal(assessmentToEvaluate);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAssessment(null);
//     setNewSkillRatings({});
//   };

//   const handleRatingChange = (skillName, newRating) => {
//     setNewSkillRatings((prevRatings) => ({
//       ...prevRatings,
//       [skillName]: newRating,
//     }));
//   };

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
//     // <BoxComponent>
//     <>
//       {isAssessmentsLoading && (
//         <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//           <CircularProgress />
//         </div>
//       )}

//       {/* <HeadingOneLineInfo
//         heading={"Skill Evaluation"}
//         info={"View and assess your team's skills to drive growth and development."}
//       /> */}

//       <Grid
//         container
//         spacing={2}
//         lg={12}
//         xs={12}
//         sx={{ my: 1, justifyContent: "space-between" }}
//       >
//         <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
//           <Grid item lg={4}>
//             <TextField
//               placeholder="Search Employee"
//               variant="outlined"
//               size="small"
//               sx={{ bgcolor: "white" }}
//             />
//           </Grid>
//         </Grid>
//       </Grid>

//       <Box>
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="!font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Sr. No
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Assessment Date Assigned
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Assessment Sent To
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Manager Name
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Status
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Skill Evaluation
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <tr className="!font-medium border-b" key={assessment.srNo}>
//                     <td className="!text-left pl-8 py-3">{idx + 1}</td>
//                     <td className="py-3 pl-8">
//                       {new Date(
//                         assessment.assessmentFormSentOn
//                       ).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 pl-8">{assessment.employeeName}</td>
//                     <td className="py-3 pl-8">{assessment.managerName}</td>
//                     <td
//                       className={`py-3 pl-8 ${getStatusColor(
//                         assessment.status
//                       )}`}
//                     >
//                       {assessment.status}
//                     </td>
//                     <td
//                       className="py-3 pl-8 cursor-pointer text-blue-500"
//                       onClick={() => handleEvaluateSkills(assessment)}
//                     >
//                       Evaluate Skills
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-3">
//                     No assessments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <Modal open={openModal} onClose={handleCloseModal}>
//             <Box
//               className="modal-container"
//               sx={{
//                 padding: "20px",
//                 maxWidth: "500px",
//                 margin: "auto",
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//               }}
//             >
//               <h3>
//                 Evaluate Skills for{" "}
//                 {selectedAssessment?.employeeName || "Loading..."}
//               </h3>

//               <div>
//                 {selectedAssessment?.selectedSkills &&
//                 selectedAssessment.selectedSkills.length > 0 ? (
//                   selectedAssessment.selectedSkills.map((skill, index) => (
//                     <Box key={index}>
//                       <div>{skill.skillName}</div>
//                       <div>
//                         Employee Rating
//                         <Rating value={skill.rating} readOnly size="small" />
//                       </div>
//                       <div>
//                         Manager Rating
//                         <Rating
//                           value={
//                             newSkillRatings[skill.skillName] ||
//                             skill.mgr_rating ||
//                             0
//                           }
//                           onChange={(_, newValue) =>
//                             handleRatingChange(skill.skillName, newValue)
//                           }
//                           size="small"
//                         />
//                       </div>
//                     </Box>
//                   ))
//                 ) : (
//                   <p>No skills found!!</p>
//                 )}
//               </div>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmitRatings}
//                 sx={{ marginTop: "15px" }}
//               >
//                 Submit Ratings
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleCloseModal}
//                 sx={{ marginTop: "15px", marginLeft: "10px" }}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Modal>

//           <Stack
//             direction={"row"}
//             className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//           >
//             <div>
//               <Typography variant="body2">
//                 Showing page {currentPage} of {assessments.length} pages
//               </Typography>
//             </div>

//             <Pagination
//               count={assessments.length}
//               page={currentPage}
//               color="primary"
//               shape="rounded"
//               siblingCount={0}
//               boundaryCount={0}
//               hidePrevButton={currentPage === 1}
//               hideNextButton={currentPage === assessments.length}
//               onChange={(event, value) => setCurrentPage(value)}
//               renderItem={(item) => (
//                 <PaginationItem
//                   {...item}
//                   components={{
//                     previous: ArrowBackIcon,
//                     next: ArrowForwardIcon,
//                   }}
//                 />
//               )}
//             />
//           </Stack>
//         </div>
//       </Box>

//       {/* <br /> */}
//       <br />
//       <br />
//       <Box>
//         <FetchEvaluateAssSkills />
//       </Box>
//       {/* </BoxComponent> */}
//     </>
//   );
// };

// export default OlddSkillsLookup;

//i wanna implement one functionallity, in the table ,if one employee have more than one assessment then it shows ,redudant employee name and details into td into table  (this is not user friendly interface ).. if similar employeeid  i mean same employee have have multiple assessment , when click on modal inside that shows different Asessmsnt details... changes ui and functionallity accordingly ..make sure not affect on my existing  code

//above backup code NEW YEAR
// import React, { useState, useContext } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// // import UserProfile from "../../../hooks/UserData/useUser";

// // Existing imports
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Rating } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Pagination,
//   PaginationItem,
//   Stack,
//   TextField,
//   Typography,
//   Modal,
// } from "@mui/material";

// // import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// // import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";
// // import useHook from '../../../hooks/UserProfile/useHook';

// const OlddSkillsLookup = () => {
//   // const { useGetCurrentRole } = UserProfile();
//   // const role = useGetCurrentRole();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();

//   // const { UserInformation } = useHook();
//   // const employeeId = UserInformation?._id;

//   const [currentPage, setCurrentPage] = useState(1);
//   const [openModal, setOpenModal] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [newSkillRatings, setNewSkillRatings] = useState({});
//   const [selectedAssessment, setSelectedAssessment] = useState(null);

//   // Fetch Assessments Query
//   const {
//     data: assessments = [],
//     isLoading: isAssessmentsLoading,
//     // error: assessmentsError
//   } = useQuery(
//     ["assessments", organisationId, currentPage],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       console.log("Assessments Response:", response.data);
//       console.log("Assessments Count:", response.data.data.length);
//       return response.data.data;
//     },
//     {
//       keepPreviousData: true,
//       staleTime: 5000,
//     }
//   );

//   // Fetch Completed Manager Assessment Query
//   // const {
//   //   data: completedAssessmentData,
//   //   isLoading: isSelectedAssessmentLoading,
//   //   refetch: refetchSelectedAssessment
//   // } = useQuery(
//   //   ['completedManagerAssessment', employeeId, organisationId],
//   //   async () => {
//   //     if (!openModal || !employeeId) return null;

//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
//   //       {
//   //         headers: { Authorization: authToken }
//   //       }
//   //     );
//   //     console.log('Completed Assessment Response:', response.data);
//   //     console.log('Selected Skills:', response.data.data?.selectedSkills);
//   //     return response.data.data;
//   //   },
//   //   {
//   //     enabled: openModal && !!employeeId,
//   //     onSuccess: (data) => {
//   //       if (data && data.selectedSkills) {
//   //         setSelectedAssessment(data);
//   //         console.log('Completed Assessment Data:', data);
//   //       }
//   //     }
//   //   }
//   // );

//   // Submit Manager Ratings Mutation
//   // const submitRatingsMutation = useMutation(
//   //   async (ratingData) => {
//   //     const { assessmentId, ratings } = ratingData;

//   //     console.log('Submitting Ratings:', {
//   //       assessmentId,
//   //       ratings
//   //     });
//   //     const response = await axios.put(
//   //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating`,
//   //       { selectedSkills: ratings },
//   //       {
//   //         headers: {
//   //           Authorization: authToken,
//   //           'Content-Type': 'application/json'
//   //         }
//   //       }
//   //     );
//   //     console.log('Submit Ratings Response:', response.data);
//   //     return response.data;
//   //   },
//   //   {
//   //     onSuccess: (data) => {
//   //       queryClient.invalidateQueries(['assessments']);
//   //       queryClient.invalidateQueries(['completedManagerAssessment']);
//   //       handleCloseModal();
//   //       console.log('Ratings Submission Successful:', data);
//   //       handleAlert('Ratings submitted successfully', 'success');
//   //     },
//   //     onError: (error) => {
//   //       console.error("Error submitting ratings:", error);
//   //       handleAlert("Error submitting ratings", "error");
//   //     }
//   //   }
//   // );
//   const submitRatingsMutation = useMutation(
//     async (ratingData) => {
//       const { assessmentId, ratings } = ratingData;

//       if (!assessmentId) {
//         throw new Error("Assessment ID is required");
//       }

//       console.log("Submitting Ratings:", {
//         assessmentId,
//         ratings,
//       });

//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${assessmentId}`,
//         { selectedSkills: ratings },
//         {
//           headers: {
//             Authorization: authToken,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Submit Ratings Response:", response.data);
//       return response.data;
//     },
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries(["assessments"]);
//         handleCloseModal();
//         console.log("Ratings Submission Successful:", data);
//         handleAlert("Ratings submitted successfully", "success");
//       },
//       onError: (error) => {
//         console.error("Error submitting ratings:", error);
//         handleAlert(error.message || "Error submitting ratings", "error");
//       },
//     }
//   );
//   // Handler Methods
//   const handleSubmitRatings = () => {
//     if (!selectedAssessment?.selectedSkills) return;

//     console.log("Selected Assessment:", selectedAssessment);
//     console.log("Assessment ID:", selectedAssessment.assessmentId);

//     const ratings = selectedAssessment.selectedSkills.map((skill) => ({
//       skillId: skill.skillId,
//       skillName: skill.skillName,
//       rating: skill.rating,
//       mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
//     }));

//     // Always use assessmentId
//     submitRatingsMutation.mutate({
//       assessmentId: selectedAssessment.assessmentId,
//       ratings,
//     });
//   };

//   const handleOpenModal = (assessment) => {
//     const employeeId = assessment.employeeId?._id || assessment.employeeId;
//     setEmployeeId(employeeId);
//     setNewSkillRatings({});

//     // Use the actual assessmentId from the API response
//     setSelectedAssessment({
//       _id: assessment.assessmentId,
//       assessmentId: assessment.assessmentId,
//       employeeName: assessment.employeeName,
//       employeeId: assessment.employeeId,
//       selectedSkills: assessment.selectedSkills.map((skill) => ({
//         ...skill,
//         skillId: skill.skillId,
//         skillName: skill.skillName,
//         rating: skill.rating,
//         mgr_rating: skill.managerRating,
//       })),
//       assessmentFormSentOn: assessment.assessmentFormSentOn,
//       status: assessment.status,
//       overallRating: assessment.overallRating,
//       srNo: assessment.srNo,
//     });

//     setOpenModal(true);
//   };

//   // const handleEvaluateSkills = (assessment) => {

//   //   console.log('Assessment for Evaluation:', assessment);
//   //   const employeeId =
//   //   assessment.employeeId?._id ||
//   //   assessment.employeeId ||
//   //   assessment.employeeId;

//   //   const completedAssessments = assessments.filter(
//   //     (a) =>
//   //       a.employeeId._id === employeeId &&
//   //       (a.status.trim().toLowerCase() === "completed" ||
//   //        a.status === "Completed")
//   //   );

//   //   if (completedAssessments.length === 0) {
//   //     alert("No completed assessments found for the employee.");
//   //     return;
//   //   }

//   //   const assessmentToEvaluate = completedAssessments.sort((a, b) =>
//   //     new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
//   //   )[0];

//   //   handleOpenModal(assessmentToEvaluate);
//   // };

//   const handleEvaluateSkills = (assessment) => {
//     console.log("Assessment for Evaluation:", assessment);

//     const completedAssessments = assessments.filter(
//       (a) =>
//         a.employeeId._id === assessment.employeeId._id &&
//         (a.status.trim().toLowerCase() === "completed" ||
//           a.status === "Completed")
//     );

//     if (completedAssessments.length === 0) {
//       alert("No completed assessments found for the employee.");
//       return;
//     }

//     const assessmentToEvaluate = completedAssessments.sort(
//       (a, b) =>
//         new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
//     )[0];

//     handleOpenModal(assessmentToEvaluate);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAssessment(null);
//     setNewSkillRatings({});
//   };

//   const handleRatingChange = (skillName, newRating) => {
//     setNewSkillRatings((prevRatings) => ({
//       ...prevRatings,
//       [skillName]: newRating,
//     }));
//   };

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
//     // <BoxComponent>
//     <>
//       {isAssessmentsLoading && (
//         <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//           <CircularProgress />
//         </div>
//       )}

//       {/* <HeadingOneLineInfo
//         heading={"Skill Evaluation"}
//         info={"View and assess your team's skills to drive growth and development."}
//       /> */}

//       <Grid
//         container
//         spacing={2}
//         lg={12}
//         xs={12}
//         sx={{ my: 1, justifyContent: "space-between" }}
//       >
//         <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
//           <Grid item lg={4}>
//             <TextField
//               placeholder="Search Employee"
//               variant="outlined"
//               size="small"
//               sx={{ bgcolor: "white" }}
//             />
//           </Grid>
//         </Grid>
//       </Grid>

//       <Box>
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="!font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Sr. No
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Assessment Date Assigned
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Assessment Sent To
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Manager Name
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Status
//                 </th>
//                 <th scope="col" className="!text-left pl-8 py-3">
//                   Skill Evaluation
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <tr className="!font-medium border-b" key={assessment.srNo}>
//                     <td className="!text-left pl-8 py-3">{idx + 1}</td>
//                     <td className="py-3 pl-8">
//                       {new Date(
//                         assessment.assessmentFormSentOn
//                       ).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 pl-8">{assessment.employeeName}</td>
//                     <td className="py-3 pl-8">{assessment.managerName}</td>
//                     <td
//                       className={`py-3 pl-8 ${getStatusColor(
//                         assessment.status
//                       )}`}
//                     >
//                       {assessment.status}
//                     </td>
//                     <td
//                       className="py-3 pl-8 cursor-pointer text-blue-500"
//                       onClick={() => handleEvaluateSkills(assessment)}
//                     >
//                       Evaluate Skills
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-3">
//                     No assessments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <Modal open={openModal} onClose={handleCloseModal}>
//             <Box
//               className="modal-container"
//               sx={{
//                 padding: "20px",
//                 maxWidth: "500px",
//                 margin: "auto",
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//               }}
//             >
//               <h3>
//                 Evaluate Skills for{" "}
//                 {selectedAssessment?.employeeName || "Loading..."}
//               </h3>

//               <div>
//                 {selectedAssessment?.selectedSkills &&
//                 selectedAssessment.selectedSkills.length > 0 ? (
//                   selectedAssessment.selectedSkills.map((skill, index) => (
//                     <Box key={index}>
//                       <div>{skill.skillName}</div>
//                       <div>
//                         Employee Rating
//                         <Rating value={skill.rating} readOnly size="small" />
//                       </div>
//                       <div>
//                         Manager Rating
//                         <Rating
//                           value={
//                             newSkillRatings[skill.skillName] ||
//                             skill.mgr_rating ||
//                             0
//                           }
//                           onChange={(_, newValue) =>
//                             handleRatingChange(skill.skillName, newValue)
//                           }
//                           size="small"
//                         />
//                       </div>
//                     </Box>
//                   ))
//                 ) : (
//                   <p>No skills found!!</p>
//                 )}
//               </div>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmitRatings}
//                 sx={{ marginTop: "15px" }}
//               >
//                 Submit Ratings
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleCloseModal}
//                 sx={{ marginTop: "15px", marginLeft: "10px" }}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Modal>

//           <Stack
//             direction={"row"}
//             className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//           >
//             <div>
//               <Typography variant="body2">
//                 Showing page {currentPage} of {assessments.length} pages
//               </Typography>
//             </div>

//             <Pagination
//               count={assessments.length}
//               page={currentPage}
//               color="primary"
//               shape="rounded"
//               siblingCount={0}
//               boundaryCount={0}
//               hidePrevButton={currentPage === 1}
//               hideNextButton={currentPage === assessments.length}
//               onChange={(event, value) => setCurrentPage(value)}
//               renderItem={(item) => (
//                 <PaginationItem
//                   {...item}
//                   components={{
//                     previous: ArrowBackIcon,
//                     next: ArrowForwardIcon,
//                   }}
//                 />
//               )}
//             />
//           </Stack>
//         </div>
//       </Box>

//       {/* <br /> */}
//       <br />
//       <br />
//       <Box>
//         <FetchEvaluateAssSkills />
//       </Box>
//       {/* </BoxComponent> */}
//     </>
//   );
// };

// export default OlddSkillsLookup;

// import React, { useState, useContext } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// // import UserProfile from "../../../hooks/UserData/useUser";

// // Existing imports
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Rating } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Pagination,
//   PaginationItem,
//   Stack,
//   TextField,
//   Typography,
//   Modal
// } from "@mui/material";

// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// // import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";
// // import useHook from '../../../hooks/UserProfile/useHook';

// const OlddSkillsLookup = () => {
//   // const { useGetCurrentRole } = UserProfile();
//   // const role = useGetCurrentRole();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();

// // const { UserInformation } = useHook();
// // const employeeId = UserInformation?._id;

//   const [currentPage, setCurrentPage] = useState(1);
//   const [openModal, setOpenModal] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [newSkillRatings, setNewSkillRatings] = useState({});
//   const [selectedAssessment, setSelectedAssessment] = useState(null);

//   // Fetch Assessments Query
//   const {
//     data: assessments = [],
//     isLoading: isAssessmentsLoading,
//     // error: assessmentsError
//   } = useQuery(
//     ['assessments', organisationId, currentPage],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       console.log('Assessments Response:', response.data);
//       console.log('Assessments Count:', response.data.data.length);
//       return response.data.data;
//     },
//     {
//       keepPreviousData: true,
//       staleTime: 5000
//     }
//   );
// //   //see above api , console log of  Assessmsnet Response is {
// //     "message": "Assessment details retrieved successfully.",
// //     "data": [
// //         {
// //             "srNo": 1,
// //             "assessmentFormSentOn": "2024-12-11T04:28:34.879Z",
// //             "employeeId": {
// //                 "_id": "67481de1005d0337b9ace818",
// //                 "first_name": "Adesh",
// //                 "last_name": "Rathod"
// //             },
// //             "employeeName": "Adesh Rathod",
// //             "managerName": "Manager user",
// //             "status": "Completed",
// //             "selectedSkills": [
// //                 {
// //                     "skillName": "Pokkie",
// //                     "rating": 5,
// //                     "managerRating": 4
// //                 },
// //                 {
// //                     "skillName": "skill 1",
// //                     "rating": 1,
// //                     "managerRating": 4
// //                 }
// //             ],
// //             "overallRating": 3.5
// //         },
// //         {
// //             "srNo": 2,
// //             "assessmentFormSentOn": "2024-12-11T06:42:19.933Z",
// //             "employeeId": {
// //                 "_id": "674b107e1405c76f6492f0f8",
// //                 "first_name": "Prachi",
// //                 "last_name": "Bhagat"
// //             },
// //             "employeeName": "Prachi Bhagat",
// //             "managerName": "Manager user",
// //             "status": "Completed",
// //             "selectedSkills": [
// //                 {
// //                     "skillName": "Angular",
// //                     "rating": 5,
// //                     "managerRating": null
// //                 },
// //                 {
// //                     "skillName": "Nodejs",
// //                     "rating": 5,
// //                     "managerRating": 5
// //                 },
// //                 {
// //                     "skillName": "ExpressJs",
// //                     "rating": 5,
// //                     "managerRating": null
// //                 }
// //             ],
// //             "overallRating": 3.3333333333333335
// //         },
// //         {
// //             "srNo": 3,
// //             "assessmentFormSentOn": "2024-12-11T06:54:25.822Z",
// //             "employeeId": {
// //                 "_id": "67481de1005d0337b9ace818",
// //                 "first_name": "Adesh",
// //                 "last_name": "Rathod"
// //             },
// //             "employeeName": "Adesh Rathod",
// //             "managerName": "Manager user",
// //             "status": "Completed",
// //             "selectedSkills": [
// //                 {
// //                     "skillName": "Angular",
// //                     "rating": 5,
// //                     "managerRating": null
// //                 },
// //                 {
// //                     "skillName": "Nodejs",
// //                     "rating": 4,
// //                     "managerRating": null
// //                 },
// //                 {
// //                     "skillName": "ExpressJs",
// //                     "rating": 3,
// //                     "managerRating": null
// //                 }
// //             ],
// //             "overallRating": 2
// //         },
// //         {
// //             "srNo": 4,
// //             "assessmentFormSentOn": "2024-12-18T05:24:55.032Z",
// //             "employeeId": {
// //                 "_id": "674b107e1405c76f6492f0f8",
// //                 "first_name": "Prachi",
// //                 "last_name": "Bhagat"
// //             },
// //             "employeeName": "Prachi Bhagat",
// //             "managerName": "Manager user",
// //             "status": "Completed",
// //             "selectedSkills": [
// //                 {
// //                     "skillName": "ReactJs",
// //                     "rating": 1,
// //                     "managerRating": 5
// //                 },
// //                 {
// //                     "skillName": "CSS",
// //                     "rating": 1,
// //                     "managerRating": 4
// //                 },
// //                 {
// //                     "skillName": "Nodejs",
// //                     "rating": 1,
// //                     "managerRating": 2
// //                 }
// //             ],
// //             "overallRating": 2.3333333333333335
// //         }
// //     ]
// // }
// // //in table i see all data , when click on  evaluate skills then resepective employyes ,assessment will show in the modal when open ..example .. "selectedSkills": [
// //                 {
// //                     "skillName": "ReactJs",
// //                     "rating": 1,
// //                     "managerRating": 5
// //                 },
// //                 {
// //                     "skillName": "CSS",
// //                     "rating": 1,
// //                     "managerRating": 4
// //                 },
// //                 {
// //                     "skillName": "Nodejs",
// //                     "rating": 1,
// //                     "managerRating": 2
// //                 }
// //             ], ..

//   // Fetch Completed Manager Assessment Query
//   // const {
//   //   data: completedAssessmentData,
//   //   isLoading: isSelectedAssessmentLoading,
//   //   refetch: refetchSelectedAssessment
//   // } = useQuery(
//   //   ['completedManagerAssessment', employeeId, organisationId],
//   //   async () => {
//   //     if (!openModal || !employeeId) return null;

//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/completed-manager-assessment`,
//   //       {
//   //         headers: { Authorization: authToken }
//   //       }
//   //     );
//   //     console.log('Completed Assessment Response:', response.data);
//   //     console.log('Selected Skills:', response.data.data?.selectedSkills);
//   //     return response.data.data;
//   //   },
//   //   {
//   //     enabled: openModal && !!employeeId,
//   //     onSuccess: (data) => {
//   //       if (data && data.selectedSkills) {
//   //         setSelectedAssessment(data);
//   //         console.log('Completed Assessment Data:', data);
//   //       }
//   //     }
//   //   }
//   // );

//   // Submit Manager Ratings Mutation
//   const submitRatingsMutation = useMutation(
//     async (ratingData) => {
//       const { assessmentId, ratings } = ratingData;

//       console.log('Submitting Ratings:', {
//         assessmentId,
//         ratings
//       });
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/submit-managerRating/${assessmentId}`,
//         { selectedSkills: ratings },
//         {
//           headers: {
//             Authorization: authToken,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       console.log('Submit Ratings Response:', response.data);
//       return response.data;
//     },
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries(['assessments']);
//         queryClient.invalidateQueries(['completedManagerAssessment']);
//         handleCloseModal();
//         console.log('Ratings Submission Successful:', data);
//         handleAlert('Ratings submitted successfully', 'success');
//       },
//       onError: (error) => {
//         console.error("Error submitting ratings:", error);
//         handleAlert("Error submitting ratings", "error");
//       }
//     }
//   );

//   // Handler Methods
//   const handleSubmitRatings = () => {
//     if (!selectedAssessment?.selectedSkills) return;
//     console.log('Selected Assessment:', selectedAssessment);
//     console.log('Assessment ID:', selectedAssessment._id);

//     const ratings = selectedAssessment.selectedSkills.map((skill) => ({
//       skillId: skill.skillId,
//       skillName: skill.skillName,
//       rating: skill.rating,
//       mgr_rating: newSkillRatings[skill.skillName] || skill.mgr_rating,
//     }));

//     submitRatingsMutation.mutate({
//       assessmentId: selectedAssessment._id,
//       ratings
//     });
//   };

//   const handleOpenModal = (assessment) => {
//     const employeeId = assessment.employeeId?._id || assessment.employeeId;
//     setEmployeeId(employeeId);
//     setNewSkillRatings({});
//     setSelectedAssessment({
//       ...assessment,
//       _id: assessment._id || assessment.assessmentId,
//       selectedSkills: assessment.selectedSkills || [],
//     });
//     setOpenModal(true);
//   };

//   const handleEvaluateSkills = (assessment) => {

//     console.log('Assessment for Evaluation:', assessment);
//     const employeeId =
//     assessment.employeeId?._id ||
//     assessment.employeeId ||
//     assessment.employeeId;

//     const completedAssessments = assessments.filter(
//       (a) =>
//         a.employeeId._id === employeeId &&
//         (a.status.trim().toLowerCase() === "completed" ||
//          a.status === "Completed")
//     );

//     if (completedAssessments.length === 0) {
//       alert("No completed assessments found for the employee.");
//       return;
//     }

//     const assessmentToEvaluate = completedAssessments.sort((a, b) =>
//       new Date(b.assessmentFormSentOn) - new Date(a.assessmentFormSentOn)
//     )[0];

//     handleOpenModal(assessmentToEvaluate);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAssessment(null);
//     setNewSkillRatings({});
//   };

//   const handleRatingChange = (skillName, newRating) => {
//     setNewSkillRatings((prevRatings) => ({
//       ...prevRatings,
//       [skillName]: newRating,
//     }));
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed": return "text-green-600";
//       case "in progress": return "text-yellow-600";
//       case "pending": return "text-red-600";
//       default: return "text-gray-600";
//     }
//   };

//   return (
//     <BoxComponent>
//       {(isAssessmentsLoading ) && (
//         <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//           <CircularProgress />
//         </div>
//       )}

//       {/* <HeadingOneLineInfo
//         heading={"Skill Evaluation"}
//         info={"View and assess your team's skills to drive growth and development."}
//       /> */}

//       <Grid
//         container
//         spacing={2}
//         lg={12}
//         xs={12}
//         sx={{ my: 1, justifyContent: "space-between" }}
//       >
//         <Grid container item spacing={2} lg={8} sx={{ flexGrow: 1 }}>
//           <Grid item lg={4}>
//             <TextField
//               placeholder="Search Employee"
//               variant="outlined"
//               size="small"
//               sx={{ bgcolor: "white" }}
//             />
//           </Grid>
//         </Grid>
//       </Grid>

//       <Box>
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="!font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="!text-left pl-8 py-3">Assessment Date Assigned</th>
//                 <th scope="col" className="!text-left pl-8 py-3">Assessment Sent To</th>
//                 <th scope="col" className="!text-left pl-8 py-3">Manager Name</th>
//                 <th scope="col" className="!text-left pl-8 py-3">Status</th>
//                 <th scope="col" className="!text-left pl-8 py-3">Skill Evaluation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <tr className="!font-medium border-b" key={assessment.srNo}>
//                     <td className="!text-left pl-8 py-3">{idx + 1}</td>
//                     <td className="py-3 pl-8">
//                       {new Date(assessment.assessmentFormSentOn).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 pl-8">{assessment.employeeName}</td>
//                     <td className="py-3 pl-8">{assessment.managerName}</td>
//                     <td className={`py-3 pl-8 ${getStatusColor(assessment.status)}`}>
//                       {assessment.status}
//                     </td>
//                     <td
//                       className="py-3 pl-8 cursor-pointer text-blue-500"
//                       onClick={() => handleEvaluateSkills(assessment)}
//                     >
//                       Evaluate Skills
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-3">
//                     No assessments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Modal for Skill Evaluation */}
//           <Modal open={openModal} onClose={handleCloseModal}>
//             <Box
//               className="modal-container"
//               sx={{
//                 padding: "20px",
//                 maxWidth: "500px",
//                 margin: "auto",
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//               }}
//             >
//               <h3>
//                 Evaluate Skills for{" "}
//                 {selectedAssessment
//                   ? selectedAssessment.employeeName
//                   : "Loading..."}
//               </h3>

//               <div>
//                 {selectedAssessment?.selectedSkills &&
//                 selectedAssessment.selectedSkills.length > 0 ? (
//                   selectedAssessment.selectedSkills.map((skill, index) => (
//                     <Box key={index} sx={{ marginBottom: "15px" }}>
//                       <div>{skill.skillName}</div>
//                       <div>
//                         <Rating value={skill.rating} readOnly size="small" />
//                       </div>
//                       <div>
//                         <Rating
//                           value={
//                             newSkillRatings[skill.skillName] ||
//                             skill.mgr_rating
//                           }
//                           onChange={(_, newValue) =>
//                             handleRatingChange(skill.skillName, newValue)
//                           }
//                           size="small"
//                         />
//                       </div>
//                     </Box>
//                   ))
//                 ) : (
//                   <p>
//                     No skills found!! Please Complete your pending Assessment
//                     first.
//                   </p>
//                 )}
//               </div>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmitRatings}
//                 sx={{ marginTop: "15px" }}
//               >
//                 Submit Ratings
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleCloseModal}
//                 sx={{ marginTop: "15px", marginLeft: "10px" }}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Modal>

//           <Stack
//             direction={"row"}
//             className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//           >
//             <div>
//               <Typography variant="body2">
//                 Showing page {currentPage} of {assessments.length} pages
//               </Typography>
//             </div>

//             <Pagination
//               count={assessments.length}
//               page={currentPage}
//               color="primary"
//               shape="rounded"
//               siblingCount={0}
//               boundaryCount={0}
//               hidePrevButton={currentPage === 1}
//               hideNextButton={currentPage === assessments.length}
//               onChange={(event, value) => setCurrentPage(value)}
//               renderItem={(item) => (
//                 <PaginationItem
//                   {...item}
//                   components={{
//                     previous: ArrowBackIcon,
//                     next: ArrowForwardIcon,
//                   }}
//                 />
//               )}
//             />
//           </Stack>
//         </div>
//       </Box>

//       {/* <br /> */}
//       <br />
//       <br />
//       <Box>
//         <FetchEvaluateAssSkills />
//       </Box>
//     </BoxComponent>
//   );
// };

// export default OlddSkillsLookup;
