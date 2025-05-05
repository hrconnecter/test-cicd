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

// Validation Schema
const applicationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  resume: z.any().optional(),
  jobPosition: z.string().min(1, "Job Position is required"),
  coverLetter: z.string().min(1, "Cover Letter is required").optional(),
  experience: z.string().min(1, "Experience is required").optional(),
  education: z.string().min(1, "Education is required").optional(),
  certifications: z.string().min(1, "Certifications are required").optional(),
  skills: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().optional(),
    })
  ),
});

const EmpApplyNow = () => {
  const { vacancyId, organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const applicantId = user?._id;
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { setJobId } = useApplyJobPositionState();
  const { control, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      jobPosition: "Software Engineer",
      questions: [],
    },
  });

  const { errors } = formState;
  console.log("errors in recruitment", errors);
  // useMutation for API call
  const mutation = useMutation(
    (data) => {
      return axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open/${vacancyId}/apply`,
        data,
        {
          headers: { Authorization: authToken },
        }
      );
    },
    {
      onSuccess: (response) => {
        handleAlert(true, "success", "Job application submitted successfully!");
        navigate(`/organisation/${organisationId}/open-job-position`);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "An error occurred while applying."
        );
      },
    }
  );

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/addResume`,
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

    return url.split("?")[0]; // Return URL without query parameters
  };

  useEffect(() => {
    if (vacancyId) {
      setJobId(vacancyId);
      setValue("jobPosition", "Software Engineer");
    }
  }, [vacancyId, setValue, setJobId]);

  // Fetch job details and additional questions
  const { data: vacancyData } = useQuery(
    ["jobOpening", vacancyId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open/${vacancyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!vacancyId,
    }
  );

  const { addQuestions = [] } = vacancyData || {}; // Extract addQuestions from vacancyData

  const handleQuestionChange = (questionId, value) => {
    const currentQuestions = getValues("questions") || [];

    // Check if the question already exists
    const updatedQuestions = currentQuestions.some(
      (q) => q.questionId === questionId
    )
      ? currentQuestions.map((q) =>
          q.questionId === questionId ? { ...q, answer: value } : q
        )
      : [...currentQuestions, { questionId, answer: value }];

    setValue("questions", updatedQuestions, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log("Submitting data:", data); // Debugging line

    const file = data.resume;
    let fileUrl = null;

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
      }

      try {
        fileUrl = await uploadVendorDocument(file);
      } catch (error) {
        alert("File upload failed. Please try again.");
        return;
      }
    }

    const formData = {
      ...data,
      resume: fileUrl || null,
      applicantId,
      jobId: vacancyId,
      applicationStatus: "Applied",
    };

    console.log("Final formData before submission:", formData); // Debugging line

    mutation.mutate(formData);
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading="Job Apply"
        info="Here you can apply for the job"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <Grid container>
          {/* Form Fields */}
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="first_name"
              label="First Name*"
              control={control}
              type="text"
              placeholder="Enter your first name"
              icon={People}
              errors={errors}
              error={errors.first_name?.message}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="last_name"
              label="Last Name*"
              control={control}
              type="text"
              placeholder="Enter your last name"
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
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              errors={errors}
              error={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="phone"
              label="Phone Number*"
              control={control}
              type="text"
              placeholder="Enter your phone number"
              icon={Phone}
              errors={errors}
              error={errors.phone?.message}
            />
          </Grid>

          {/* Additional Questions */}
          {addQuestions.map((question) => {
            const selectedAnswer =
              getValues("questions")?.find((q) => q.questionId === question._id)
                ?.answer || "";

            return (
              <Grid item xs={12} key={question._id}>
                <div className="question-container">
                  <label>{question.questionText}</label>

                  {/* Text Input for Open-Ended Questions */}
                  {question.questionType === "text" && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedAnswer}
                      onChange={(e) =>
                        handleQuestionChange(question._id, e.target.value)
                      }
                    />
                  )}

                  {/* Multiple Choice (Radio Buttons) */}
                  {question.questionType === "multiple-choice" && (
                    <RadioGroup
                      value={selectedAnswer}
                      onChange={(e) =>
                        handleQuestionChange(question._id, e.target.value)
                      }
                    >
                      {question.options?.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </Grid>
            );
          })}
        </Grid>

        {/* Submit Button */}
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
