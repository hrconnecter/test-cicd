import React, { useContext, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useNavigate, useParams } from "react-router-dom";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import { CircularProgress, Button, Box } from "@mui/material";
import BasicButton from "../../../components/BasicButton";

const Test3 = ({ prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const hrId = user?._id;
  const queryClient = useQueryClient();

  const {
    jobTitle,
    jobRole,
    department,
    JobIndustry,
    experienceRequired,
    jobType,
    education,
    vacancies,
    location,
    modeOfWorking,
    workingShift,
    requiredSkill,
    additionalBenefits,
    language,
    additionalDocument,
    jobDescription,
    hrAssigned,
    createdBy,
    jobPostedDate,
    termsAndCondition,
    addQuestions,
  } = useCreateJobPositionState();
  console.log("hrAssigned", hrAssigned);

  const [isDraft, setIsDraft] = useState(false);
  console.log("isDraft", isDraft, setIsDraft);
  // const handleSaveDraft = () => {
  //   setIsDraft(true);
  //   handleSubmit.mutate({ isSaveDraft: true });
  // };

  // const handleSubmit = useMutation(
  //   (overrideData = {}) => {
  //     const jobPositionData = {
  //       jobTitle,
  //       jobRole,
  //       department: department?.value,
  //       JobIndustry,
  //       experienceRequired: experienceRequired?.value,
  //       jobType: jobType?.value,
  //       education,
  //       vacancies,
  //       location: location?.value,
  //       modeOfWorking: modeOfWorking?.value,
  //       workingShift: workingShift?.value,
  //       requiredSkill,
  //       additionalBenefits,
  //       language,
  //       additionalDocument,
  //       jobDescription: jobDescription,
  //       createdBy: createdBy?.value,
  //       hrAssigned: hrAssigned?.value,
  //       jobPostedDate,
  //       termsAndCondition,
  //       addQuestions,
  //       isSaveDraft: overrideData.isSaveDraft ?? false, // Accept override
  //     };
  //     let apiEndpoint = "";

  //     if (role === "Manager" && vacancyId) {
  //       apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${vacancyId}`;
  //     } else if (role === "Manager") {
  //       apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/mr-create-job-position`;
  //     } else if (vacancyId) {
  //       apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/vacancy/${vacancyId}`;
  //     } else {
  //       apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/hr-create-job-position`;
  //     }

  //     // Determine whether to PATCH or POST
  //     if (vacancyId) {
  //       // PATCH for editing an existing vacancy
  //       return axios.patch(apiEndpoint, jobPositionData, {
  //         headers: { Authorization: authToken },
  //       });
  //     } else {
  //       // POST for creating a new vacancy
  //       return axios.post(apiEndpoint, jobPositionData, {
  //         headers: { Authorization: authToken },
  //       });
  //     }
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["job-position"] });
  //       handleAlert(true, "success", "Job vacancy save successfully!");
  //       if (role === "Manager") {
  //         navigate(`/organisation/${organisationId}/mr-open-job-vacancy-list`);
  //       } else {
  //         navigate(`/organisation/${organisationId}/manager-open-job-vacancy`);
  //       }
  //     },
  //     onError: (error) => {
  //       handleAlert(
  //         true,
  //         "error",
  //         error.response?.data?.message ||
  //           "An error occurred while creating the job vacancy."
  //       );
  //     },
  //   }
  // );
  const handleSubmit = useMutation(
    (overrideData = {}) => {
      const jobPositionData = {
        jobTitle,
        jobRole,
        department: department?.value,
        JobIndustry,
        experienceRequired: experienceRequired?.value,
        jobType: jobType?.value,
        education,
        vacancies,
        location: location?.value,
        modeOfWorking: modeOfWorking?.value,
        workingShift: workingShift?.value,
        requiredSkill,
        additionalBenefits,
        language,
        additionalDocument,
        jobDescription,
        createdBy: createdBy?.value,
        hrAssigned: hrAssigned?.value,
        jobPostedDate,
        termsAndCondition,
        addQuestions,
        isSaveDraft: overrideData.isSaveDraft ?? false,
      };

      let apiEndpoint = "";

      if (role === "Manager" && vacancyId) {
        apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${vacancyId}`;
      } else if (role === "Manager") {
        apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/mr-create-job-position`;
      } else if (vacancyId) {
        apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/vacancy/${vacancyId}`;
      } else {
        apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/hr-create-job-position`;
      }

      return vacancyId
        ? axios.patch(apiEndpoint, jobPositionData, {
            headers: { Authorization: authToken },
          })
        : axios.post(apiEndpoint, jobPositionData, {
            headers: { Authorization: authToken },
          });
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["job-position"] });
        handleAlert(
          true,
          "success",
          variables?.isSaveDraft
            ? "Job vacancy save successfully!"
            : "Job vacancy submit successfully!"
        );
        if (role === "Manager") {
          navigate(`/organisation/${organisationId}/mr-open-job-vacancy-list`);
        } else {
          navigate(`/organisation/${organisationId}/manager-open-job-vacancy`);
        }
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message ||
            "An error occurred while creating the job vacancy."
        );
      },
    }
  );

  return (
    <>
      {handleSubmit.isLoading && (
        <div className="flex items-center justify-center fixed inset-0 bg-black/20">
          <CircularProgress />
        </div>
      )}

      <div className="w-full mt-4">
        <h1 className="text-2xl mb-4 font-bold">Confirm Details</h1>

        <div className="">
          {/* Job Details */}
          <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
            Job Details
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField label="Job Title" value={jobTitle} />
            <DetailField label="Job Role" value={jobRole} />
            <DetailField label="Department" value={department?.label} />
            <DetailField label="Job Industry" value={JobIndustry} />
            <DetailField label="Experience" value={experienceRequired?.label} />
            <DetailField label="Job Type" value={jobType?.label} />
            <DetailField label="Education" value={education} />
            <DetailField label="Vacancies" value={vacancies} />
            <DetailField label="Location" value={location?.label} />
            <DetailField label="Mode of Working" value={modeOfWorking?.label} />
            <DetailField label="Working Shift" value={workingShift?.label} />
            <DetailField
              label="Required Skills"
              value={requiredSkill?.map((skill) => skill.label).join(", ")}
            />
          </div>

          {/* Additional Info */}
          <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
            Additional Info
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField
              label="Benefits"
              value={additionalBenefits
                ?.map((benefit) => benefit.label)
                .join(", ")}
            />
            <DetailField
              label="language"
              value={language?.map((lang) => lang.label).join(", ")}
            />
            {role === "Manager" ? (
              <DetailField label="Assigned HR" value={hrAssigned?.label} />
            ) : (
              <DetailField label="Hiring Manager" value={createdBy?.label} />
            )}
            <Box sx={{ height: "100px", overflowY: "auto" }}>
              <DetailField label="Job Description" value={jobDescription} />
            </Box>
            <DetailField label="Posted Date" value={jobPostedDate} />
            <DetailField
              label="Additional Document"
              value={additionalDocument?.name || ""}
            />
          </div>

          {/* addition que */}
          <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
            Additional Questions
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField
              label="addQuestions"
              value={addQuestions?.map((ques) => ques.questionText).join(", ")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <BasicButton title="Prev" type="submit" onClick={prevStep} />
          <div className="flex gap-4">
            {role === "Manager" ? null : (
              <Button
                variant="outlined"
                color="primary"
                // onClick={handleSaveDraft}
                onClick={() => handleSubmit.mutate({ isSaveDraft: true })}
              >
                Save for Later
              </Button>
            )}
            <BasicButton
              title="Submit"
              type="submit"
              onClick={() => handleSubmit.mutate()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Component for Repeated Fields
const DetailField = ({ label, value }) => (
  <div>
    <h1 className="text-gray-500 text-sm">{label}</h1>
    <p>{value || "-"}</p>
  </div>
);

export default Test3;
