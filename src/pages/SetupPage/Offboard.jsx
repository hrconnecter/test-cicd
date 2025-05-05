import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Edit, Info, Remove, Visibility } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import axios from "axios";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as z from "zod";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../components/Modal/component";
import useEmpOption from "../../hooks/Employee-OnBoarding/useEmpOption";
import useAuthToken from "../../hooks/Token/useAuth";
import Setup from "../SetUpOrganization/Setup";
import { CircularProgress } from "@mui/material";

const schema = z.object({
  department: z.object({
    value: z.string(),
    label: z.string(),
  }),
  isExitInterview: z.boolean(),
  questions: z
    .array(
      z.object({
        text: z.string().nonempty("Question text is required"),
        answers: z
          .array(z.string().nonempty("Answer is required"))
          .length(4, "Four answers are required"),
      })
    )
    .min(1, "At least one question is required"),
});

const Offboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editData, setEditData] = useState(null);
  const organisationId = useParams("");
  const { Departmentoptions } = useEmpOption(organisationId);
  const authToken = useAuthToken();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      department: "",
      isExitInterview: false,
      questions: [{ text: "", answers: ["", "", "", ""] }],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleCreateOffboard = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null);
    reset();
  };

  const handleQuestionModalClose = () => {
    setIsQuestionModalOpen(false);
  };

  const mutation = useMutation((data) => {
    const url = `${process.env.REACT_APP_API}/route/setup/offboardquetions/${organisationId.organisationId}`;
    return axios.post(url, data, {
      headers: {
        Authorization: authToken,
      },
    });
  });

  const { data: offboardingData, refetch , isLoading } = useQuery(
    "fetchOffboardingData",
    () =>
      axios
        .get(
          `${process.env.REACT_APP_API}/route/setup/offboardquetions/${organisationId.organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        )
        .then((res) => res.data)
  );

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        console.log("Question with answers submitted successfully");
        reset();
        setIsModalOpen(false);
        refetch();
      },
      onError: (error) => {
        console.error("Error submitting question with answers:", error);
      },
    });
  };

  const handleViewQuestions = (questions) => {
    setSelectedQuestions(questions);
    setIsQuestionModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    const department = Departmentoptions.find(
      (opt) => opt.value === item.department
    );
    setValue("department", department);
    setValue("isExitInterview", item.isExitInterview);
    setValue("questions", item.questions);
    setIsModalOpen(true);
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="flex items-center justify-between">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Employee Offboarding "
              info="By adding the interview questions perform the exit interview for employees."
            />
            <BasicButton title="Add" onClick={handleCreateOffboard} />
          </div>
          {
isLoading ?
            <div>
              <CircularProgress />
            </div>            
           : offboardingData?.data?.length === 0 ?            
             <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                          <article className="flex items-center mb-1 text-red-500 gap-2">
                            <Info className="!text-2xl" />
                            <h1 className="text-lg font-semibold">Add Offboarding option </h1>
                          </article>
                          <p>No offboarding options found. Please add offboarding option.</p>
                        </section>
            :
            <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th className="py-3 pl-8">Department</th>
                <th className="py-3 pl-8">Exit Interview</th>
                <th className="py-3 pl-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offboardingData?.data?.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 pl-8">
                    {
                      Departmentoptions.find(
                        (opt) => opt.value === item.department
                      )?.label
                    }
                  </td>
                  <td className="py-3 pl-8">
                    {item.isExitInterview ? "Yes" : "No"}
                  </td>
                  <td className="py-3 pl-8 flex gap-2">
                    <button
                      onClick={() => handleViewQuestions(item.questions)}
                      className="text-blue-500"
                    >
                      <Visibility />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500"
                    >
                      <Edit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
      </Setup>
      <ReusableModal
        heading={
          editData ? "Edit Offboarding Settings" : "Add Offboarding Settings"
        }
        open={isModalOpen}
        className="md:!w-[600px]  !w-[80%] !h-[70vh] "
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthInputFiled
            name="department"
            control={control}
            type="select"
            placeholder="Department"
            label="Select Department  *"
            errors={errors}
            error={errors.department}
            options={Departmentoptions}
          />
          <AuthInputFiled
            name="isExitInterview"
            control={control}
            type="switch"
            placeholder="Department"
            label="Exit Interview"
            descriptionText={
              "This will enable exit interview for the employee offboarding time"
            }
            errors={errors}
            error={errors.isExitInterview}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="mt-4 border p-4 rounded-md ">
              <h3 className="text-base !font-sans font-semibold mb-2">
                Create New Question
              </h3>
              <AuthInputFiled
                name={`questions.${index}.text`}
                label="Question Text"
                control={control}
                type="text"
                placeholder="Question Text"
                errors={errors}
                error={errors.questions?.[index]?.text}
              />
              <div className="grid grid-cols-2 gap-4">
                {field.answers.map((answer, answerIndex) => (
                  <AuthInputFiled
                    key={answerIndex}
                    name={`questions.${index}.answers.${answerIndex}`}
                    label={`Answer ${answerIndex + 1}`}
                    control={control}
                    type="text"
                    placeholder={`Answer ${answerIndex + 1}`}
                    errors={errors}
                    error={errors.questions?.[index]?.answers?.[answerIndex]}
                  />
                ))}
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center gap-2 text-red-500 mt-2"
                >
                  <Remove /> Remove Question
                </button>
              )}
            </div>
          ))}
          <div className="my-4">
            <button
              type="button"
              onClick={() => append({ text: "", answers: ["", "", "", ""] })}
              className="flex items-center gap-2 text-primary"
            >
              <Add /> Add Another Question
            </button>
          </div>
          <div className="flex justify-end gap-4">

            <BasicButton 
            title={"Cancel"}
            onClick={handleModalClose}
            variant="outlined"
            color={"danger"}
            />
          <BasicButton
            type="submit"
            title={
              editData
              ? "Update "
              : "Save"
            }
            />
            </div>
        </form>
      </ReusableModal>
      <ReusableModal
        heading={"View Questions"}
        open={isQuestionModalOpen}
        onClose={handleQuestionModalClose}
      >
        <ol className="p-4 max-h-[70vh] overflow-y-auto !list-decimal !list-inside">
          {selectedQuestions.map((question, index) => (
            <div key={index} className="mb-6">
              <li className="font-semibold text-xl mb-2">{question.text}</li>
              <div className="flex flex-wrap gap-2">
                {question.answers.map((answer, answerIndex) => (
                  <Chip key={answerIndex} variant="outlined" label={answer} />
                ))}
              </div>
            </div>
          ))}
        </ol>
      </ReusableModal>
    </BoxComponent>
  );
};

export default Offboard;
