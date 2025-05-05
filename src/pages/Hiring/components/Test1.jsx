import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { Grid } from "@mui/material";
import { Work } from "@mui/icons-material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BasicButton from "../../../components/BasicButton";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";
import WorkIcon from "@mui/icons-material/Work";
import { DiOpenshift } from "react-icons/di";
import SchoolIcon from "@mui/icons-material/School";
import { IoLocationSharp } from "react-icons/io5";

const experienceOptions = [
  { label: "0-2 Years", value: "0-2 Years" },
  { label: "2-4 Years", value: "2-4 Years" },
  { label: "4-6 Years", value: "4-6 Years" },
  { label: "6-8 Years", value: "6-8 Years" },
  { label: "8+ Years", value: "8+ Years" },
];

const jobTypeOptions = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Contractor", value: "Contractor" },
  { label: "Consultant", value: "Consultant" },
  { label: "Vendor", value: "Vendor" },
  { label: "Freelancer", value: "Freelancer" },
  { label: "Internship", value: "Internship" },
  { label: "Apprenticeship", value: "Apprenticeship" },
  { label: "Temporary", value: "Temporary" },
  { label: "Seasonal", value: "Seasonal" },
  { label: "Partial", value: "Partial" },
  { label: "Shift-based", value: "Shift-based" },
  { label: "Commission-based", value: "Commission-based" },
  { label: "On-call", value: "On-call" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

const modeOfWorkingOptions = [
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "On-site", value: "On-site" },
  { label: "Field Work", value: "Field Work" },
  { label: "Work From Anywhere", value: "Work From Anywhere" },
];

const shiftOptions = [
  { label: "Morning Shift", value: "Morning Shift" },
  { label: "Afternoon Shift", value: "Afternoon Shift" },
  { label: "Evening Shift", value: "Evening Shift" },
  { label: "Night Shift", value: "Night Shift" },
  { label: "Split Shift", value: "Split Shift" },
  { label: "Rotational Shift", value: "Rotational Shift" },
  { label: "Weekend Shift", value: "Weekend Shift" },
  { label: "Flexible Shift", value: "Flexible Shift" },
  { label: "Graveyard Shift", value: "Graveyard Shift" },
];

const Test1 = ({ nextStep, isLastStep }) => {
  const organisationId = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;
  const { authToken } = useGetUser();

  const { data: vacancyData, isFetching } = useQuery(
    ["JobSpecificVacancyHiring", organisationId?.vacancyId, hrId],
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
      refetchOnMount: false,
      enabled: Boolean(organisationId?.vacancyId),
      onSuccess: (data) => console.log("Vacancy Data:", data),
      onError: (error) => {
        console.error("Error fetching vacancy:", error);
      },
    }
  );

  const {
    setStep1Data,
    jobTitle,
    jobRole,
    department,
    JobIndustry,
    experienceRequired,
    jobType,
    location,
    modeOfWorking,
    workingShift,
    education,
    requiredSkill,
    vacancies,
  } = useCreateJobPositionState();
  console.log("experienceRequired", experienceRequired);

  const { Departmentoptions, locationoption } = useEmpOption(organisationId);

  // Form Schema
  const JobPositionSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    jobRole: z.string().min(1, "Job role is required"),
    department: z.object({
      label: z.string(),
      value: z.string(),
    }),
    JobIndustry: z.string().min(1, "Job industry is required"),
    experienceRequired: z.object({
      label: z.string(),
      value: z.string(),
    }),
    jobType: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    vacancies: z.preprocess(
      (val) => (val !== "" ? Number(val) : undefined),
      z.number().min(1, "Vacancies must be a greater than zero").optional()
    ),
    education: z.string().optional(),
    modeOfWorking: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    workingShift: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    requiredSkill: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    location: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
  });

  const { control, formState, handleSubmit, setValue, reset } = useForm({
    resolver: zodResolver(JobPositionSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      jobType: data.jobType,
    };
    setStep1Data(formattedData);
    nextStep();
  };

  useEffect(() => {
    if (vacancyData) {
      console.log("vacancyData", vacancyData);

      setValue("jobTitle", jobTitle ? jobTitle : vacancyData?.jobTitle);
      setValue("jobRole", jobRole ? jobRole : vacancyData?.jobRole);

      setValue("department", {
        label: vacancyData.department?.departmentName,
        value: vacancyData.department?._id,
      });
      setValue(
        "JobIndustry",
        JobIndustry ? JobIndustry : vacancyData?.JobIndustry
      );

      setValue(
        "experienceRequired",
        vacancyData.experienceRequired
          ? {
              label: vacancyData.experienceRequired,
              value: vacancyData.experienceRequired,
            }
          : undefined
      );
      setValue(
        "jobType",
        vacancyData.jobType
          ? { label: vacancyData.jobType, value: vacancyData.jobType }
          : undefined
      );
      if (vacancyData?.location?.city && vacancyData?.location?._id) {
        const locationValue = {
          label: vacancyData.location.city,
          value: vacancyData.location._id,
        };
        setValue("location", locationValue);
      } else {
        setValue("location", undefined);
      }
      setValue("education", education ? education : vacancyData?.education);
      setValue(
        "modeOfWorking",
        vacancyData.modeOfWorking
          ? {
              label: vacancyData.modeOfWorking,
              value: vacancyData.modeOfWorking,
            }
          : undefined
      );

      setValue(
        "workingShift",
        vacancyData.workingShift
          ? { label: vacancyData.workingShift, value: vacancyData.workingShift }
          : undefined
      );
      const requiredSkills =
        vacancyData.requiredSkill?.map((skill) => ({
          label: skill.label,
          value: skill?._id,
        })) || [];
      setValue("requiredSkill", requiredSkills);
      setValue("vacancies", vacancies ? vacancies : vacancyData?.vacancies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacancyData, isFetching]);

  useEffect(() => {
    if (jobType) {
      setValue("jobType", jobType);
    }
    if (location) {
      setValue("location", location);
    }
    if (modeOfWorking) {
      setValue("modeOfWorking", modeOfWorking);
    }
    if (workingShift) {
      setValue("workingShift", workingShift);
    }
    if (education) {
      setValue("education", education);
    }
    if (vacancies) {
      setValue("vacancies", vacancies);
    }
    if (requiredSkill && requiredSkill.length > 0) {
      setValue(
        "requiredSkill",
        requiredSkill.map((skill) => ({
          label: skill.label,
          value: skill._id,
        }))
      );
    }
    if (experienceRequired) {
      setValue("experienceRequired", experienceRequired); // Restore saved jobType
    }
  }, [
    experienceRequired,
    jobType,
    workingShift,
    location,
    modeOfWorking,
    education,
    requiredSkill,
    vacancies,
    setValue,
  ]);

  useEffect(() => {
    reset({
      jobTitle,
      jobRole,
      department,
      JobIndustry,
      jobType,
      experienceRequired,
      vacancies,
      education,
      modeOfWorking,
      workingShift,
      requiredSkill: requiredSkill || [],
      location,
    });
  }, [
    reset,
    jobTitle,
    jobRole,
    department,
    JobIndustry,
    jobType,
    workingShift,
    location,
    modeOfWorking,
    education,
    requiredSkill,
    vacancies,
    experienceRequired,
  ]);

  return (
    <div className="w-full mt-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <Grid container>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2, xs: 0 } }}>
            <AuthInputFiled
              name="jobTitle"
              icon={Work}
              control={control}
              type="text"
              placeholder="Job Title"
              label="Job Title*"
              errors={errors}
              error={errors.jobTitle}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="jobRole"
              icon={Work}
              control={control}
              type="text"
              placeholder="Job Role"
              label="Job Role*"
              errors={errors}
              error={errors.jobRole}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="department"
              icon={ApartmentIcon}
              control={control}
              type="select"
              placeholder="Select Department"
              label="Department*"
              options={Departmentoptions}
              errors={errors}
              error={errors.department?.message}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="JobIndustry"
              icon={Work}
              control={control}
              type="text"
              placeholder="Job Industry"
              label="Job Industry*"
              errors={errors}
              error={errors.JobIndustry}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="experienceRequired"
              icon={Work}
              control={control}
              type="select"
              placeholder="Experience"
              label="Experience Required*"
              options={experienceOptions}
              errors={errors}
              error={errors.experienceRequired}
              value={experienceRequired}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="jobType"
              icon={WorkIcon}
              control={control}
              type="select"
              placeholder="Job Type"
              label="Job Type"
              errors={errors}
              error={errors?.jobType?.message} // Will not display error if undefined
              options={jobTypeOptions}
              value={jobType}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="education"
              icon={SchoolIcon}
              control={control}
              type="text"
              placeholder="Education"
              label="Education"
              errors={errors}
              error={errors.education}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="vacancies"
              icon={Work}
              control={control}
              type="number"
              placeholder="Number of Vacancies"
              label="Vacancies"
              readOnly={false}
              errors={errors}
              error={errors.vacancies}
              min={0}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="requiredSkill"
              icon={WorkIcon}
              control={control}
              type="autocomplete"
              placeholder="Required Skills"
              label="Required Skills"
              isMulti={true}
              errors={errors}
              error={errors.requiredSkill}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="modeOfWorking"
              icon={WorkIcon}
              control={control}
              type="select"
              placeholder="Mode of Working"
              label="Mode of Working"
              errors={errors}
              error={errors.modeOfWorking?.message}
              options={modeOfWorkingOptions}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
            <AuthInputFiled
              name="workingShift"
              icon={DiOpenshift}
              control={control}
              type="select"
              placeholder="Shift"
              label="Shift"
              errors={errors}
              error={errors.workingShift?.message}
              options={shiftOptions}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="location"
              control={control}
              type="select"
              placeholder="Select Location"
              label="Select Location"
              icon={IoLocationSharp}
              options={locationoption}
              errors={errors}
              error={errors.location?.message}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <BasicButton title="Next" type="submit" disabled={isLastStep} />
        </div>
      </form>
    </div>
  );
};

export default Test1;
