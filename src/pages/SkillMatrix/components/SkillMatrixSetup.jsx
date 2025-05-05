/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// // /* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Badge, DriveFileRenameOutline } from "@mui/icons-material";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../../hooks/Token/useAuth";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import Setup from "../../SetUpOrganization/Setup";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";

const SkillMatrixSetup = () => {
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [packageType, setPackageType] = useState("");

  const skillSchema = z.object({
    skills: z.array(
      z.object({
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
      })
    ),
  });

  const methods = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: [
        {
          skillName: "",
          skillDescription: "",
          groupName: "",
          subGroupName: "",
        },
      ],
    },
  });

  const addSkillField = () => {
    const currentSkills = methods.getValues("skills");
    methods.setValue("skills", [
      ...currentSkills,
      {
        skillName: "",
        skillDescription: "",
        groupName: "",
        subGroupName: "",
      },
    ]);
  };

  const removeSkillField = (index) => {
    const currentSkills = methods.getValues("skills");
    const newSkills = currentSkills.filter((_, i) => i !== index);
    methods.setValue("skills", newSkills);
  };

  useEffect(() => {
    const savedAssessmentState = localStorage.getItem("isAssessmentEnabled");
    if (savedAssessmentState !== null) {
      setIsAssessmentEnabled(savedAssessmentState === "true");
    }
  }, []);

  const fetchSkills = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return Array.isArray(response.data) ? response.data : [];
  };

  const { data: existingSkills = [] } = useQuery(["skills"], fetchSkills);

  const updateAssessmentSetup = async ({
    organizationId,
    isAssessmentEnabled,
  }) => {
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

  const { mutate } = useMutation(updateAssessmentSetup, {
    onSuccess: () => {
      toast.success("Assessment setup updated successfully!");
      queryClient.invalidateQueries(["skills"]);
    },
    onError: () => {
      toast.error("Error updating the assessment setup.");
    },
  });

  const skillMutation = useMutation(
    async (data) => {
      const results = [];
      for (const skill of data.skills) {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
          skill,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        results.push(response.data);
      }
      return results;
    },
    {
      onSuccess: (responses) => {
        queryClient.invalidateQueries(["skills"]);
        toast.success(`Successfully added ${responses.length} skills`);
        setOpenPopup(false);
        methods.reset({
          skills: [
            {
              skillName: "",
              skillDescription: "",
              groupName: "",
              subGroupName: "",
            },
          ],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Error adding skills");
      },
    }
  );

  const onSubmit = (data) => {
    skillMutation.mutate(data);
  };

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
  useEffect(() => {
    fetchPackageType();
  }, []);

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center p-4">
            <HeadingOneLineInfo
              className="!my-3"
              // heading="Skill Matrix"
              heading={`Skill Matrix ( ${packageType} )`}
              info="Setup skill matrix for your organisation."
            />

            <Tooltip
              title="Click here to add new skills to your organization"
              arrow
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenPopup(true)}
                className="w-full sm:w-auto mb-4 bg-blue-900 hover:bg-blue-700 text-white"
              >
                Add Skills
              </Button>
            </Tooltip>
          </div>

          <ReusableModal
            heading="Add Multiple Skills"
            subHeading="Add new skills to your organisation"
            open={openPopup}
            onClose={() => setOpenPopup(false)}
          >
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="overflow-auto"
              >
                {methods.watch("skills").map((_, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle1" className="font-medium">
                        Skill #{index + 1}
                      </Typography>
                      <div className="flex gap-2">
                        {index === methods.watch("skills").length - 1 && (
                          <Tooltip title="Add new skill field" arrow>
                            <IconButton
                              onClick={addSkillField}
                              size="small"
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {methods.watch("skills").length > 1 && (
                          <Tooltip title="Remove this skill" arrow>
                            <IconButton
                              onClick={() => removeSkillField(index)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <Controller
                      control={methods.control}
                      name={`skills.${index}.groupName`}
                      render={({ field }) => (
                        <AuthInputFiled
                          {...field}
                          icon={DriveFileRenameOutline}
                          type="text"
                          placeholder="eg. Technical Skills"
                          label="Group Name *"
                          error={
                            methods.formState.errors?.skills?.[index]?.groupName
                          }
                        />
                      )}
                    />

                    <Controller
                      control={methods.control}
                      name={`skills.${index}.skillName`}
                      render={({ field }) => (
                        <AuthInputFiled
                          {...field}
                          icon={Badge}
                          type="text"
                          placeholder="eg. React Development"
                          label="Skill Name *"
                          error={
                            methods.formState.errors?.skills?.[index]?.skillName
                          }
                        />
                      )}
                    />

                    <Controller
                      control={methods.control}
                      name={`skills.${index}.skillDescription`}
                      render={({ field }) => (
                        <AuthInputFiled
                          {...field}
                          icon={DriveFileRenameOutline}
                          type="text"
                          placeholder="Skill description"
                          label="Description"
                          multiline
                          rows={2}
                          error={
                            methods.formState.errors?.skills?.[index]
                              ?.skillDescription
                          }
                        />
                      )}
                    />
                  </div>
                ))}

                {/* <div className="flex flex-col gap-3 mt-4">
                  <Button
                    onClick={() => {
                      setOpenPopup(false);
                      methods.reset({
                        skills: [
                          {
                            skillName: "",
                            skillDescription: "",
                            groupName: "",
                            subGroupName: "",
                          },
                        ],
                      });
                    }}

                    variant="outlined"
                    className="bg-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit"  variant="contained">
                    Save Skills
                  </Button>
                </div> */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="mt-4"
                >
                  Save Skills
                </Button>
              </form>
            </FormProvider>
          </ReusableModal>

          <div className="px-4 rounded-lg ">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAssessmentEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsAssessmentEnabled(checked);
                    localStorage.setItem(
                      "isAssessmentEnabled",
                      checked.toString()
                    );
                    mutate({
                      organizationId: organisationId,
                      isAssessmentEnabled: checked,
                    });
                  }}
                  className="text-blue-600"
                />
              }
              label={
                <Tooltip title="Click here to allow send assessments" arrow>
                  <Typography variant="subtitle1" className="font-medium">
                    Enable Assessments
                  </Typography>
                </Tooltip>
              }
            />

            {isAssessmentEnabled && (
              // <Typography
              //   variant="body2"
              //   className="mt-1 text-gray-600 ml-7  p-3 rounded-md"
              // >
              //   Managers can send assessment forms to employees reporting to
              //   them.
              // </Typography>

              <p className=" text-gray-500  tracking-tight ">
                Managers can send assessment forms to employees reporting to
                them.
              </p>
            )}
          </div>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;
