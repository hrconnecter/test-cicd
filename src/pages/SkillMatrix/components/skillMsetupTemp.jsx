/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../../hooks/Token/useAuth";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import Setup from "../../SetUpOrganization/Setup";
const SkillMatrixSetup = () => {
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);
  const [packageType, setPackageType] = useState("");
  // const [limits, setLimits] = useState({
  //   employeeCount: 0,
  //   skillCount: 0
  // });

  // Fetch initial state of the checkbox from localStorage (if exists)
  const [counts, setCounts] = useState({
    currentSkills: 0,
    currentEmployees: 0,
  });

  useEffect(() => {
    const savedAssessmentState = localStorage.getItem("isAssessmentEnabled");
    if (savedAssessmentState !== null) {
      setIsAssessmentEnabled(savedAssessmentState === "true");
    }
  }, []);
  const skillSchema = z.object({
    skillName: z
      .string()
      .min(1, "Skill name is required")
      .max(50, "Max 50 characters allowed"),
    skillDescription: z
      .string()
      .max(200, "Maximum 200 characters allowed")
      .optional(),
    groupName: z.string().min(5, "Group name is required"),
    subGroupName: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
  });

  // Fetch skills from API
  const fetchSkills = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log("datadata:", response.data);
    const data = response.data;
    return Array.isArray(data) ? data : []; // Ensure data is an array
  };

  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery(["skills"], fetchSkills);

  const [openPopup, setOpenPopup] = useState(false);

  // Function to call updateAssessmentSetup API
  const updateAssessmentSetup = async ({
    organizationId,
    isAssessmentEnabled,
  }) => {
    console.log("Updating assessment setup with:", {
      organizationId,
      isAssessmentEnabled,
    }); // Debugging: Log the payload being sent

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/assessment/setup/organization/${organizationId}`,
      { isAssessmentEnabled },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  // Mutation for updating the assessment setup
  const { mutate } = useMutation(updateAssessmentSetup, {
    onSuccess: () => {
      toast.success("Assessment setup updated successfully!");
      queryClient.invalidateQueries(["skills"]);
    },
    onError: () => {
      toast.error("Error updating the assessment setup.");
    },
  });

  const handleAssessmentToggle = (event) => {
    const checked = event.target.checked;
    console.log("checked", checked);

    setIsAssessmentEnabled(checked);

    // setIsAssessmentEnabled(checked);
    //  mutate(organisationId , checked);
    localStorage.setItem("isAssessmentEnabled", checked.toString());
    mutate({ organizationId: organisationId, isAssessmentEnabled: checked });
  };

  console.log("isAssessmentEnabled", isAssessmentEnabled);

  // const fetchPackageType = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/organization/${organisationId}`,
  //       {
  //         headers: { Authorization: authToken },
  //       }
  //     );

  //     // Check packages array for SkillMatrix
  //     const skillMatrixPackage = response.data.packages.find(
  //       (pkg) =>
  //         pkg.value === "Basic SkillMatrix" ||
  //         pkg.value === "Advanced SkillMatrix"
  //     );
  //     console.log("Found package:", skillMatrixPackage?.value);
  //     setPackageType(skillMatrixPackage?.value || null);
  //   } catch (error) {
  //     console.error("Error fetching package type:", error);
  //   }
  // };
  // const fetchPackageType = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/org/get/${organisationId}`,
  //       {
  //         headers: { Authorization: authToken },
  //       }
  //     );

  //     const skillMatrixPackage = response.data.packages.find(
  //       (pkg) =>
  //         pkg.value === "Basic SkillMatrix" ||
  //         pkg.value === "Advanced SkillMatrix"
  //     );
  //     alert("skillMatrixPackage", skillMatrixPackage);
  //     console.log("Found package:", skillMatrixPackage?.value);
  //     setPackageType(skillMatrixPackage?.value || null);
  //   } catch (error) {
  //     console.error("Error fetching package type:", error);
  //   }
  // };

  const fetchPackageType = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/subscription/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      console.log("Packages:", response.data?.organisation?.packages);

      const skillMatrixPackage = response.data?.organisation?.packages?.find(
        (pkg) => pkg === "Basic SkillMatrix" || pkg === "Advanced SkillMatrix"
      );

      console.log("Found package:", skillMatrixPackage);
      setPackageType(skillMatrixPackage || null);
    } catch (error) {
      console.error("Error fetching package type:", error);
    }
  };

  // const fetchLimits = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/skill-matrix/limits`,
  //       {
  //         headers: { Authorization: authToken }
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching limits:", error);
  //     return { employeeCount: 0, skillCount: 0 };
  //   }
  // };
  useEffect(() => {
    fetchPackageType();
  }, []);

  // useEffect(() => {
  //   if (packageType === 'Basic SkillMatrix') {
  //     fetchLimits().then(limits => {
  //       // Show limits in UI
  //       console.log('Current limits:', limits);
  //     });
  //   }
  // }, [packageType]);
  // useEffect(() => {
  //   if (packageType === 'Basic SkillMatrix') {
  //     fetchLimits().then(limitsData => {
  //       setLimits(limitsData);
  //     });
  //   }
  // }, [packageType]);

  // Add Skill API
  const addSkill = async (data) => {
    console.log("Submitted Data:", data);

    // if (packageType === 'Basic SkillMatrix') {
    //   const { employeeCount, skillCount } = await fetchLimits();

    //   if (employeeCount > 10) {
    //     alert('Employee limit exceeded. Please upgrade to Advanced SkillMatrix');
    //     return;
    //   }

    //   if (skillCount >= 250) {
    //     alert('Skill limit reached. Please upgrade to Advanced SkillMatrix');
    //     return;
    //   }
    // }
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  // const mutation = useMutation(addSkill, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["skills"]);
  //     toast.success("Skill added successfully!");
  //     console.log("Skill created successfully");

  //   },
  //   onError: (error) => {
  //     if (error.response?.status === 403) {
  //       toast.error(error.response.data.message); // Will show the limit exceeded message
  //     } else {
  //       toast.error("Error adding the skill. Please try again.");
  //     }
  //   },
  // });

  const mutation = useMutation(addSkill, {
    onSuccess: (response) => {
      console.log("Skill creation success. Full response:", response);
      console.log("Updated counts:", {
        skills: response.data?.currentSkillCount,
        employees: response.data?.currentEmployeeCount,
      });

      queryClient.invalidateQueries(["skills"]);
      toast.success("Skill added successfully!");
      // Update counts from response
      if (response.data?.currentSkillCount !== undefined) {
        console.log("Updating counts with:", response.data);
        setCounts({
          currentSkills: response.data.currentSkillCount,
          currentEmployees: response.data.currentEmployeeCount,
        });
      }
    },
    onError: (error) => {
      console.error("Full error details:", error.response?.data);
      if (error.response?.status === 403) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error adding the skill. Please try again.");
      }
    },
  });

  const onSubmit = (data) => {
    console.log("Submitting skill data:", data);
    mutation.mutate({
      groupName: data.groupName,
      subGroupName: data.subGroupName || "",
      skillName: data.skillName,
      skillDescription: data.skillDescription || "",
    });
    setOpenPopup(false);
  };
  <br />;
 
  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Skill Matrix "
              // heading={`Skill Matrix ( ${packageType} )`}
              info="Setup Skill Matrix For Your Organisation."
            />
          </div>
          {/* <div>
            {packageType && (
              <div className=" bg-gray-50 rounded-md"> */}
          {/* <Typography variant="h6">
                  Current Package: {packageType}
                </Typography> */}

          {/* <h4>Current Package: {packageType}</h4> */}
          {/* {packageType === "Basic SkillMatrix" && (
                  <>
                    <Typography variant="body2">
          Limited to 10 employees and 250 skills
        </Typography>
        <Typography variant="body2">
          Current Skills: {counts.currentSkills}/250
        </Typography>
        <Typography variant="body2">
          Current Employees: {counts.currentEmployees}/10
        </Typography>
                  </>
                )} */}
          {/* {packageType === "Advanced SkillMatrix" && (
                  <>
                    <Typography variant="body2">
                      Limited to 1000 employees and Unlimited skills
                    </Typography>
                    <Typography variant="body2">
          Current Skills: {counts.currentSkills}/95
        </Typography>
        <Typography variant="body2">
          Current Employees: {counts.currentEmployees}/2
        </Typography>
                  </>
                )} */}
          {/* </div>
            )}
          </div> */}

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPopup(true)}
            className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
          >
            Add Skill
          </Button>

          {/* Add Skill Dialog */}
          <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogContent className="space-y-4">
              <Controller
                control={control}
                name="groupName"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Group Name"
                    {...field}
                    error={!!errors.groupName}
                    helperText={errors.groupName?.message}
                    margin="dense"
                    className="border border-gray-300 rounded-md p-2"
                  />
                )}
              />
              <Controller
                control={control}
                name="subGroupName"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Sub-Group Name"
                    {...field}
                    error={!!errors.subGroupName}
                    helperText={errors.subGroupName?.message}
                    margin="dense"
                    className="border border-gray-300 rounded-md p-2"
                  />
                )}
              />
              <Controller
                control={control}
                name="skillName"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Skill Name"
                    {...field}
                    error={!!errors.skillName}
                    helperText={errors.skillName?.message}
                    margin="dense"
                    className="border border-gray-300 rounded-md p-2"
                  />
                )}
              />

              <Controller
                control={control}
                name="skillDescription"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Skill Description"
                    {...field}
                    error={!!errors.skillDescription}
                    helperText={errors.skillDescription?.message}
                    margin="dense"
                    className="border border-gray-300 rounded-md p-2"
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenPopup(false)}
                color="secondary"
                size="medium"
                className="text-gray-600"
              >
                Cancel
              </Button>

              {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              className="px-8"
            >
              Submit Assessment
            </Button> */}
              <Button
                onClick={handleSubmit(onSubmit)}
                color="primary"
                variant="contained"
                size="medium"
                className="bg-blue-500 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAssessmentEnabled}
                onChange={handleAssessmentToggle}
                className="text-blue-600 mt-4 font-semibold"
              />
            }
            label="Enable Assessments"
            className="mt-4"
          />

          {isAssessmentEnabled && (
            <Typography
              variant="body2"
              color="textSecondary"
              className="mt-2 text-gray-600"
            >
              Managers can send assessment forms to employees reporting to them.
            </Typography>
          )}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;
