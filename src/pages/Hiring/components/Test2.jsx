import React, { useContext, useEffect, useState } from "react";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import WorkIcon from "@mui/icons-material/Work";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import { useParams } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import DOMPurify from "dompurify";
import { Description, People } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BasicButton from "../../../components/BasicButton";
import { FaRegEye } from "react-icons/fa";

const Test2 = ({ isLastStep, nextStep, prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const hrId = user?._id;
  const organisationId = useParams("");
  const {
    setStep2Data,
    additionalBenefits,
    language,
    jobPostedDate,
    additionalDocument,
    jobDescription,
    createdBy,
    hrAssigned,
  } = useCreateJobPositionState();

  const { onBoardManageroptions, HrOptions } = useEmpOption(organisationId);

  const JobPositionSchema = (role) => {
    const baseSchema = z.object({
      jobPostedDate: z.string(),
      additionalBenefits: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      language: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      additionalDocument: z.any().optional(),
      jobDescription: z.string().min(1, "Description is required"),
    });

    if (role === "HR") {
      return baseSchema.extend({
        createdBy: z
          .object({
            label: z.string(),
            value: z.string(),
          })
          .refine(
            (data) => !!data.value,
            "Hiring Manager selection is required"
          ),
      });
    } else {
      return baseSchema.extend({
        hrAssigned: z
          .object({
            label: z.string(),
            value: z.string(),
          })
          .refine((data) => !!data.value, "HR selection is required"),
      });
    }
  };

  const defaultValues = {
    jobPostedDate: jobPostedDate || "",
    additionalBenefits: additionalBenefits || [],
    language: language || [],
    additionalDocument: additionalDocument || null,
    termsAndCondition: "",
    jobDescription: jobDescription || "",
  };

  // Add conditional fields based on role
  if (role === "HR") {
    defaultValues.createdBy = createdBy || undefined;
  } else {
    defaultValues.hrAssigned = hrAssigned || undefined;
  }

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: zodResolver(JobPositionSchema(role)),
  });

  const { errors } = formState;

  const { data: vacancyData } = useQuery(
    ["JobSpecificVacancy", organisationId?.vacancyId, hrId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/manager/hr/vacancies/${organisationId?.vacancyId}/hiring`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response?.data?.data;
    },
    {
      enabled: Boolean(organisationId?.vacancyId),
      onSuccess: (data) => console.log("Vacancy Data:", data),
      onError: (error) => {
        console.error("Error fetching vacancy:", error);
      },
    }
  );
  console.log("vacancyData in test2", vacancyData);

  const [isChecked, setIsChecked] = useState(false);

  const { data: termsConditionData } = useQuery(
    ["terms-condition"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/get-terms-condition`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response?.data?.data || { termsAndCondition: "" };
    },
    {
      enabled: Boolean(organisationId?.organisationId && authToken),
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || "An unexpected error occurred.";
        console.error("Error fetching terms and conditions:", errorMessage);
        alert(errorMessage);
      },
    }
  );

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/addCertificate`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return url.split("?")[0];
  };

  const onSubmit = async (data) => {
    console.log("finaldata", data);

    const file = data.additionalDocument;
    let fileUrl = null;

    if (file && !vacancyData?.additionalDocument) {
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
      }
      try {
        fileUrl = await uploadVendorDocument(file);
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
        return;
      }
    } else {
      fileUrl = vacancyData?.additionalDocument;
    }

    const modifiedData = {
      ...data,
      termsAndCondition: termsConditionData?.termsAndCondition || "",
      additionalDocument: fileUrl || null,
    };

    setStep2Data(modifiedData);
    nextStep();
  };

  useEffect(() => {
    if (vacancyData) {
      const formattedDate =
        vacancyData?.jobPostedDate &&
        !isNaN(new Date(vacancyData.jobPostedDate).getTime())
          ? new Date(vacancyData.jobPostedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
      setValue("jobPostedDate", formattedDate);

      const benefits =
        vacancyData.additionalBenefits?.map((benefit) => ({
          label: benefit.label,
          value: benefit?._id,
        })) || [];
      setValue("additionalBenefits", benefits);
      const lang =
        vacancyData.language?.map((lange) => ({
          label: lange.label,
          value: lange?._id,
        })) || [];
      setValue("language", lang);
      setValue("termsAndCondition", termsConditionData?.termsAndCondition);
      setValue("createdBy", {
        label: `${vacancyData.createdBy?.first_name} ${vacancyData.createdBy?.last_name}`, // Combine first_name and last_name
        value: vacancyData.createdBy?._id,
      });
      setValue("hrAssigned", {
        label: `${vacancyData.hrAssigned?.first_name} ${vacancyData.hrAssigned?.last_name}`, // Combine first_name and last_name
        value: vacancyData.hrAssigned?._id,
      });
      setValue("additionalDocument", vacancyData.additionalDocument);
      setValue("jobDescription", vacancyData.jobDescription);
    }
  }, [vacancyData, setValue, termsConditionData]);

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex space-y-2 flex-1 flex-col"
      >
        <Grid container>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="additionalBenefits"
              icon={WorkIcon}
              control={control}
              type="autocomplete"
              placeholder="Additional Benefits"
              label="Additional Benefits"
              isMulti={true}
              errors={errors}
              error={errors.additionalBenefits}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="language"
              icon={WorkIcon}
              control={control}
              type="autocomplete"
              placeholder="Language"
              label="Language"
              isMulti={true}
              errors={errors}
              error={errors.language}
            />
          </Grid>
          {role === "HR" && (
            <Grid item xs={12} md={4}>
              <AuthInputFiled
                name="jobPostedDate"
                icon={CalendarTodayIcon}
                control={control}
                type="date"
                placeholder="Select Job Post Date"
                label="Job Post Date*"
                errors={errors}
                error={errors.jobPostedDate}
              />
            </Grid>
          )}

          {role === "HR" ? (
            <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
              <AuthInputFiled
                name="createdBy"
                icon={People}
                control={control}
                type="select"
                placeholder="Select Hiring Manager"
                label="Hiring Manager*"
                options={onBoardManageroptions}
                errors={errors}
                error={errors.createdBy?.message}
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <AuthInputFiled
                name="hrAssigned"
                icon={People}
                control={control}
                type="select"
                placeholder="Select HR"
                label="Assigned HR *"
                errors={errors}
                error={errors.hrAssigned?.message}
                options={HrOptions}
              />
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            <AuthInputFiled
              name="jobDescription"
              icon={Description}
              control={control}
              type="textarea"
              placeholder="Job Description"
              label="Job Description*"
              errors={errors}
              error={errors.jobDescription}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="block font-semibold text-gray-500 text-md">
              Upload PDF Document
            </label>
            {vacancyData?.additionalDocument ? (
              <div className="mt-2">
                <a
                  href={vacancyData.additionalDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex text-blue-500 gap-2"
                >
                  <FaRegEye className="my-1" /> View Document
                </a>
                <p className="text-sm text-gray-500">
                  Upload a new document to replace the existing one.
                </p>
              </div>
            ) : null}
            <input
              type="file"
              accept="application/pdf" // Change to accept PDF files
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setValue("additionalDocument", file); // Assuming you're setting the PDF file in the form value
                }
              }}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500"
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <div
              className="flex items-center space-x-2 cursor-pointer mt-3"
              onClick={() => setIsChecked(!isChecked)}
            >
              {isChecked ? (
                <KeyboardArrowUpIcon className="cursor-pointer" />
              ) : (
                <KeyboardArrowDownIcon className="cursor-pointer" />
              )}
              <label className="block font-semibold text-gray-500 text-md">
                Terms and Conditions*
              </label>
            </div>

            {/* Display Terms and Conditions Content Conditionally */}
            {isChecked && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      termsConditionData?.termsAndCondition ||
                        "No terms and conditions available."
                    ),
                  }}
                ></div>
              </div>
            )}
          </Grid>
        </Grid>

        {/* Navigation Buttons */}
        <div className="flex items-end w-full justify-between">
          <BasicButton title="Prev" type="submit" onClick={prevStep} />
          <BasicButton title="Next" type="submit" disabled={isLastStep} />
        </div>
      </form>
    </div>
  );
};

export default Test2;
