import React, { useContext, useState, useEffect } from "react";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicButton from "../../../components/BasicButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import useGetUser from "../../../hooks/Token/useUser";
import { TestContext } from "../../../State/Function/Main";

const AdditionalQue = ({ isLastStep, nextStep, prevStep }) => {
  const { setStep3Data } = useCreateJobPositionState();
  const { handleAlert } = useContext(TestContext);

  const JobPositionSchema = z.object({
    addQuestions: z.array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        questionType: z.string().min(1, "Question type is required"),
        options: z.array(z.string()).optional(),
        isRequired: z.boolean().default(false),
      })
    ),
  });

  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      addQuestions: [],
    },
    resolver: zodResolver(JobPositionSchema),
  });

  const [questions, setQuestions] = useState([]);

  // Fetching vacancy data
  const organisationId = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;
  const { authToken } = useGetUser();

  const { data: vacancyData, isFetching } = useQuery(
    ["JobSpecificVacancy", organisationId?.vacancyId, hrId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/manager/hr/vacancies/${organisationId?.vacancyId}`,
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
  console.log("vacancyData", vacancyData);
  useEffect(() => {
    if (vacancyData) {
      setValue(
        "addQuestions",
        vacancyData.addQuestions || [
          { questionText: "", questionType: "", options: [] },
        ]
      );
      setQuestions(vacancyData.addQuestions || []);
    }
    // eslint-disable-next-line
  }, [vacancyData, isFetching]);

  // const onSubmit = (data) => {
  //   console.log("SubmittedData", data);
  //   setStep3Data(data);
  //   nextStep();
  // };
  const onSubmit = (data) => {
    const isInvalid = data.addQuestions.some(
      (q) =>
        q.questionType === "multiple-choice" &&
        (!q.options || q.options.length === 0)
    );

    if (isInvalid) {
      handleAlert(
        true,
        "warning",
        "Please add at least one option for all multiple-choice questions."
      );
      return; // Stop form submission
    }

    console.log("SubmittedData", data);
    setStep3Data(data);
    nextStep();
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", questionType: "", options: [] },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleChangeQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    setValue("addQuestions", updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
    setValue("addQuestions", updatedQuestions);
  };

  const handleChangeOption = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
    setValue("addQuestions", updatedQuestions);
  };

  const handleRemoveOption = (index, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options = updatedQuestions[index].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
    setValue("addQuestions", updatedQuestions);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="space-y-4">
              {/* Flex container for question text (9 columns) and select dropdown (3 columns) */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={question.questionText}
                    onChange={(e) =>
                      handleChangeQuestion(
                        index,
                        "questionText",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>

                <div className="col-span-3">
                  <select
                    value={question.questionType}
                    onChange={(e) =>
                      handleChangeQuestion(
                        index,
                        "questionType",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Select Type</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                <div className="col-span-1 flex items-center justify-center">
                  {/* Remove button with delete icon */}
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="flex items-center space-x-2 text-red-500 text-sm"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Options section for multiple-choice */}
              {question.questionType === "multiple-choice" && (
                <div className="space-y-3 mt-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleChangeOption(index, optionIndex, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                      <IconButton
                        style={{ padding: "5px" }}
                        onClick={() => handleRemoveOption(index, optionIndex)}
                      >
                        <CloseIcon style={{ fontSize: "18px" }} />
                      </IconButton>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className="text-blue-500 text-sm"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="text-blue-500 text-sm mt-4"
          >
            Add Question
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <BasicButton title="Prev" type="button" onClick={prevStep} />
          <BasicButton title="Next" type="submit" disabled={isLastStep} />
        </div>
      </form>
    </div>
  );
};

export default AdditionalQue;
