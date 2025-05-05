import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { People, Phone, Mail } from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useApplyJobPositionState from "../../hooks/RecruitmentHook/useApplyJobPositionState";
import UserProfile from "../../hooks/UserData/useUser";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import WorkIcon from "@mui/icons-material/Work";

const applicationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  resume: z.any().optional(),
  jobPosition: z.string().min(1, "Job Position is required"),
  // coverLetter: z.string().min(1, "Cover Letter is required"),
  experience: z.string().min(1, "Experience is required"),
  education: z.string().min(1, "Education is required"),
  // certifications: z.string().min(1, "Certifications are required"),
  skills: z.array(z.object({ label: z.string(), value: z.string() })),
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().optional(),
    })
  ),
  documents: z.any().optional(), // New field for dynamic documents
});

const EmpApplyNow = () => {
  const { vacancyId, organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { setJobId } = useApplyJobPositionState();
  const navigate = useNavigate();

  const applicantId = user?._id;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    // register,
    // watch,
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      jobPosition: "Software Engineer",
      questions: [],
      documents: {},
    },
  });

  // Fetch job details
  const { data: vacancyData } = useQuery(
    ["jobOpening", vacancyId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open-hiring/${vacancyId}`
      );
      return response.data.data;
    },
    {
      enabled: !!vacancyId,
    }
  );

  const { addQuestions = [], requiredDocuments = [] } = vacancyData || {};

  useEffect(() => {
    if (vacancyId) {
      setJobId(vacancyId);
      setValue("jobPosition", "Software Engineer");
    }
  }, [vacancyId, setJobId, setValue]);

  const mutation = useMutation(
    (data) => {
      return axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open-hiring/${vacancyId}/apply`,
        data
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Job application submitted successfully!");
        navigate(
          `/organisation/${organisationId}/view-job-details-hiring/${vacancyId}`
        );
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Application failed."
        );
      },
    }
  );

  const uploadFileToS3 = async (file, fileType = "addResume") => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFileHiring/${fileType}`,
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

    return url.split("?")[0]; // Remove query params
  };

  const onSubmit = async (data) => {
    try {
      // Handle resume
      let resumeUrl = null;
      if (data.resume && data.resume.type === "application/pdf") {
        resumeUrl = await uploadFileToS3(data.resume);
      }

      // Upload dynamic documents
      const uploadedDocs = {};
      const documentFields = data.documents || {};
      for (const docLabel in documentFields) {
        const file = documentFields[docLabel];
        if (file) {
          const url = await uploadFileToS3(file, "uploadDoc");
          uploadedDocs[docLabel] = url;
        }
      }

      const formData = {
        ...data,
        resume: resumeUrl,
        applicantId,
        jobId: vacancyId,
        applicationStatus: "Applied",
        documents: uploadedDocs,
      };

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      handleAlert(true, "error", "File upload failed.");
    }
  };

  const handleQuestionChange = (questionId, value) => {
    const prev = getValues("questions") || [];
    const index = prev.findIndex((q) => q.questionId === questionId);
    const updated = [...prev];

    if (index !== -1) {
      updated[index] = { ...updated[index], answer: value };
    } else {
      updated.push({ questionId, answer: value });
    }

    setValue("questions", updated, { shouldValidate: true });
  };

  return (
    <BoxComponent sx={{ p: "3%" }}>
      <HeadingOneLineInfo
        heading="Apply for Job"
        info="Fill in your details to apply"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="first_name"
              label="First Name*"
              control={control}
              icon={People}
              errors={errors}
              error={errors.first_name?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="last_name"
              label="Last Name*"
              control={control}
              icon={People}
              errors={errors}
              error={errors.last_name?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="email"
              label="Email*"
              control={control}
              icon={Mail}
              errors={errors}
              error={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="phone"
              label="Phone*"
              control={control}
              icon={Phone}
              errors={errors}
              error={errors.phone?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="experience"
              label="Experience*"
              control={control}
              errors={errors}
              error={errors.experience?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="education"
              label="Education*"
              control={control}
              errors={errors}
              error={errors.education?.message}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <AuthInputFiled
              name="coverLetter"
              label="Cover Letter*"
              control={control}
              multiline
              rows={4}
              errors={errors}
              error={errors.coverLetter?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AuthInputFiled
              name="certifications"
              label="Certifications*"
              control={control}
              errors={errors}
              error={errors.certifications?.message}
            />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <AuthInputFiled
              name="skills"
              label="Skills"
              icon={WorkIcon}
              control={control}
              type="autocomplete"
              isMulti
              placeholder="Select Skills"
              errors={errors}
              error={errors.skills}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel className="text-md mb-2" htmlFor="resume-upload">
                Resume (PDF)
              </FormLabel>
              <input
                id="resume-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={(e) =>
                  setValue(`resume`, e.target.files[0], {
                    shouldValidate: true,
                  })
                }
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </FormControl>
          </Grid>
          {/* Dynamic Document Fields */}
          {requiredDocuments.map((docLabel) => (
            <Grid item xs={12} md={6} key={docLabel}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor={`file-upload-${docLabel}`}
                  className="text-md mb-2"
                >
                  {`${docLabel}*`}
                </FormLabel>
                <input
                  id={`file-upload-${docLabel}`}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={(e) =>
                    setValue(`documents.${docLabel}`, e.target.files[0], {
                      shouldValidate: true,
                    })
                  }
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </FormControl>
            </Grid>
          ))}

          {/* Additional Questions */}
          {addQuestions.map((question) => (
            <Grid item xs={12} key={question._id}>
              <label>{question.questionText}</label>
              {question.questionType === "text" ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={
                    getValues("questions")?.find(
                      (q) => q.questionId === question._id
                    )?.answer || ""
                  }
                  onChange={(e) =>
                    handleQuestionChange(question._id, e.target.value)
                  }
                />
              ) : question.questionType === "multiple-choice" ? (
                <RadioGroup
                  value={
                    getValues("questions")?.find(
                      (q) => q.questionId === question._id
                    )?.answer || ""
                  }
                  onChange={(e) =>
                    handleQuestionChange(question._id, e.target.value)
                  }
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              ) : null}
            </Grid>
          ))}
        </Grid>

        <div className="flex justify-end mt-4">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </BoxComponent>
  );
};

export default EmpApplyNow;
