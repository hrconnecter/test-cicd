import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import React, { useContext, useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useCreateEmployeeSurveyState from "../../../hooks/EmployeeSurvey/EmployeeSurvey";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import { Email } from "@mui/icons-material";

const CreateNewSurvey = ({ isEditable }) => {
  //hooks
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { id } = useParams();

  //states
  const [questions, setQuestions] = useState([
    {
      question: "",
      questionType: "Short Answer",
      options: [],
      required: false,
    },
  ]);
  const [showSelectAll, setShowSelectAll] = useState(false);
  const [questionTypeSelected, setQuestionTypeSelected] = useState(
    Array.from({ length: questions.length }, () => "Short Answer")
  );
  const [surveyData, setSurveyData] = useState();
  const [employeeCredential, setEmployeeCredential] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSavingForLater, setIsSavingForLater] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState([]);

  //get organisationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const param = useParams();
  const organisationId = param?.organisationId;

  //get authToken
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //get useCreateEmployeeSurveyState
  const {
    title,
    description,
    employeeSurveyStartingDate,
    employeeSurveyEndDate,
    to,
    from,
    subject,
    body,
  } = useCreateEmployeeSurveyState();

  //useForm
  const { control,  handleSubmit, setValue, watch, trigger } =
    useForm({
      defaultValues: {
        title,
        description,
        employeeSurveyStartingDate,
        employeeSurveyEndDate,
        to,
        communication: undefined,
        from,
        subject,
        body,
      },
    });

  //Get Organisation Perticular Data
  useEffect(() => {
    (async () => {
   await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${organisationId}`
      );
    })();
  }, [organisationId]);

  // Fetch single survey data
  const { isLoading } = useQuery(
    ["singleDraftSurvey", id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-draft-survey/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {

        setSurveyData(data);
        if (data) {
          setValue("title", data?.title);
          setValue("description", data?.description);
          setValue(
            "employeeSurveyStartingDate",
            dayjs(data?.employeeSurveyStartingDate).format("YYYY-MM-DD")
          );
          setValue(
            "employeeSurveyEndDate",
            dayjs(data?.employeeSurveyEndDate).format("YYYY-MM-DD")
          );
          setQuestions(
            data?.questions?.map((q) => ({
              question: q.question,
              questionType: q.questionType || "Short Answer",
              options: q.options?.map((opt) => ({
                title: opt?.title,
                checked: false,
              })),
              required: q.required,
            }))
          );

          const transformedToField = data.to.map((option) => ({
            label: option.value,
            value: option.value,
          }));

          setValue("to", transformedToField);
          const communicationValue = data.communication.map((item) => ({
            label: item.label,
            value: item.value,
          }));
          setValue("communication", communicationValue[0]);
          setValue("from", {label: data?.from , value: data?.from});
          setEmployeeCredential(data?.employeeCredential);
        }
      },
      enabled: !!id,
    }
  );

  //Add and Update employee survey
  const mutation = useMutation(
    async (formData) => {
      let response;
      if (id) {
        // Update survey
        response = await axios.put(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-employee-survey/${id}`,
          formData,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } else {
        // Add new survey
        response = await axios.post(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-form`,
          formData,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      }
      return response;
    },
    {
      onSuccess: (response) => {
        console.log("response in survey", response);
        if (response.status === 201 || response.status === 200) {
          navigate(`/organisation/${organisationId}/employee-survey`);
        }
        handleAlert(true, "success", "Saved employee survey successfully");
      },
      onError: (error) => {
        console.error("Error submitting form", error);
      },
    }
  );

  //handleQuestionTypeChange function
  const handleQuestionTypeChange = (index, event) => {
    const selectedType = event.target.value;
    const newQuestions = [...questions];
    newQuestions[index].questionType = selectedType;
    newQuestions[index].options = [];
    setQuestions(newQuestions);
    const updatedSelected = [...questionTypeSelected];
    updatedSelected[index] = selectedType !== "";
    setQuestionTypeSelected(updatedSelected);
  };

  //handleAddOption function
  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ title: "", checked: false });
    setQuestions(newQuestions);
  };

  //handleOptionChange function
  const handleOptionChange = (qIndex, oIndex, key, value) => {
    const newQuestions = [...questions];
    if (key === "title") {
      newQuestions[qIndex].options[oIndex].title = value;
      // Remove error if option title is not empty
      if (value) {
        const newErrors = { ...errors };
        delete newErrors[`option-${qIndex}-${oIndex}`];
        setErrors(newErrors);
      }
    } else if (key === "checked") {
      newQuestions[qIndex].options[oIndex].checked =
        !newQuestions[qIndex].options[oIndex].checked;
    } else if (key === "radio") {
      newQuestions[qIndex].options.forEach((opt, index) => {
        opt.checked = index === oIndex;
      });
    }
    setQuestions(newQuestions);
  };

  //handleRequiredChange function
  const handleRequiredChange = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].required = !newQuestions[index].required;
    setQuestions(newQuestions);
  };

  //handleAddQuestion function
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        questionType: "Short Answer",
        options: [],
        required: false,
      },
    ]);
    setQuestionTypeSelected([...questionTypeSelected, "Short Answer"]);
  };

  //handleRemoveQuestion function
  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  //handleQuestionChange function
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);

    // Remove error if question is not empty
    if (event.target.value) {
      const newErrors = { ...errors };
      delete newErrors[`question-${index}`];
      setErrors(newErrors);
    }
  };

  //handleCopyQuestion function
  const handleCopyQuestion = (index) => {
    const newQuestions = [...questions];
    const copiedQuestion = { ...newQuestions[index] };
    newQuestions.splice(index + 1, 0, copiedQuestion);
    setQuestions(newQuestions);
  };

  //handleSuffleQuestion function
  const handleSuffleQuestion = (index) => {
    const newQuestions = [...questions];
    if (index > 0) {
      const shuffledQuestion = newQuestions[index];
      newQuestions.splice(index, 1);
      newQuestions.splice(index - 1, 0, shuffledQuestion);
      setQuestions(newQuestions);
    }
  };

  //get employee in to field
  const { data: employee } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.employees;
    }
  );
  console.log("employee in communication", employee);

  const employeeEmail = employee
    ? employee?.map((emp) => ({
        label: emp.email,
        value: emp.email,
      }))
    : [];

  //handleSelectAll function
  const handleSelectAll = async (fieldName) => {
    await setValue(fieldName, employeeEmail);
    await trigger(fieldName);
  };

  //renderAnswerInput function
  const renderAnswerInput = (qIndex) => {
    const { questionType, options } = questions[qIndex];
    console.log("options" , questions[qIndex]);
    const handleRemoveOption = (qIndex, oIndex) => {
      const newQuestions = [...questions];
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    };

    switch (questionType) {
      case "Short Answer":
      case "Paragraph":
        return (
          <TextField
            id="answer-input"
            label={
              questionType === "Short Answer"
                ? "Short-answer text"
                : "Long-answer text"
            }
            placeholder={`Enter ${questionType} Answer`}
            fullWidth
            variant="standard"
            disabled
          />
        );
      case "Checkboxes":
      case "Dropdown":
        return (
          <div>
            {options?.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {questionType === "Checkboxes" ? (
                  <Checkbox
                    checked={option.checked}
                    onChange={() =>
                      handleOptionChange(qIndex, index, "checked")
                    }
                    disabled
                  />
                ) : null}
                <TextField
                  value={option?.title
                   }
                  onChange={(e) =>
                    handleOptionChange(qIndex, index, "title", e.target.value)
                  }
                  fullWidthfrom
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  disabled={!isEditable}
                />
                {isEditable && (
                  <IconButton
                    onClick={() => handleRemoveOption(qIndex, index)}
                    aria-label="remove option"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            ))}
            {isEditable && (
              <div className="mt-2">
                <Button
                  onClick={() => handleAddOption(qIndex)}
                  aria-label="add option"
                >
                  Add Options
                </Button>
              </div>
            )}
          </div>
        );
      case "Date":
        return (
          <TextField
            id="date-input"
            label="Select Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
            sx={{ mt: "20px" }}
          />
        );
      case "Multi-choice":
        return (
          <div>
            {options?.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Radio
                  checked={option.checked}
                  onChange={() => handleOptionChange(qIndex, index, "radio")}
                  disabled
                />
                <TextField
                  value={option.title}
                  onChange={(e) =>
                    handleOptionChange(qIndex, index, "title", e.target.value)
                  }
                  fullWidth
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  disabled={!isEditable}
                />
                {isEditable && (
                  <IconButton
                    onClick={() => handleRemoveOption(qIndex, index)}
                    aria-label="remove option"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            ))}
            {isEditable && (
              <Button
                onClick={() => handleAddOption(qIndex)}
                aria-label="add option"
              >
                Add Options
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const validateForm = (data) => {
    console.log("questions" , data)
    const newErrors = {};
    if (!data.title) newErrors.title = "Title is required";
    if (!data.description) newErrors.description = "Description is required";
    if (!data.employeeSurveyStartingDate) newErrors.employeeSurveyStartingDate = "Start date is required";
    if (!data.employeeSurveyEndDate) newErrors.employeeSurveyEndDate = "End date is required";
    if (!data.communication) newErrors.communication = "Communication type is required";
    if (!data.from?.label) newErrors.from = "From field is required";
    if (!data.to || data.to.length === 0) newErrors.to = "At least one recipient is required";

    console.log("questions", !data.title, !data.description, !data.employeeSurveyStartingDate , !data.employeeSurveyEndDate , !data.communication , !data.from?.label , !data.to || data.to.length === 0);
  
  
    questions.forEach((q, index) => {
      if (!q.question) {
        newErrors[`question-${index}`] = "Question is required";
      }
      if (q.questionType === "Checkboxes" || q.questionType === "Multi-choice") {
        q.options.forEach((opt, optIndex) => {
          if (!opt.title) {
            newErrors[`option-${index}-${optIndex}`] = "Option is required";
          }
        });
      }
    });
  

    console.log("questions" , newErrors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmitForm = (data, status) => {
    setIsSubmitting(true);
    if (!validateForm(data)) {
      console.log("Form validation failed");
      setIsSubmitting(false);
      return;
    }
  
    const formData = {
      title: data.title,
      description: data.description,
      questions: questions?.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        options: q.options?.map((opt) => opt.title),
        required: q.required,
      })),
      employeeSurveyStartingDate: data.employeeSurveyStartingDate,
      employeeSurveyEndDate: data.employeeSurveyEndDate,
      to: data.to?.map((option) => option),
      creatorId: user?._id,
      status: status,
      from: data?.from?.label,
      communication: data?.communication,
      employeeCredential: employeeCredential,
    };
  
    mutation.mutate(formData, {
      onError: (error) => {
        console.error("Error submitting form", error);
        setIsSubmitting(false);
      },
      onSuccess: () => {
        setIsSubmitting(false);
      }
    });
  };
  

  //handleClose function
  const handleClose = () => {
    navigate(`/organisation/${organisationId}/employee-survey`);
  };

  //handleSaveForLater function
  const handleSaveForLater = (data) => {
    setIsSavingForLater(true);
    const formData = {
      title: data.title,
      description: data.description,
      employeeSurveyStartingDate: data.employeeSurveyStartingDate,
      employeeSurveyEndDate: data.employeeSurveyEndDate,
      questions,
      to: data.to,
      from: data.from,
      responseStatus: false,
      communication: data.communication,
      employeeCredential: employeeCredential,
    };

    mutation.mutate(formData, {
      onError: (error) => {
        handleAlert(true, "error", error?.response?.data?.message);
        setIsSavingForLater(false);
      },
      onSuccess: () => {
        setIsSavingForLater(false);
      }
    });
  };

  //communication email id for from filed
  const { data: communicationType } = useQuery(
    ["communication-type", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  const communicationTypes = communicationType
    ? Array.from(
        new Set(communicationType?.map((type) => type.communication[0]))
      ).map((label) => {
        const type = communicationType?.find(
          (type) => type.communication[0] === label
        );
        return {
          label,
          value: label,
          email: type.email,
        };
      })
    : [];

    const selectedCommunication = watch("communication");
    useEffect(()=> {
      const emails = communicationType
      ?.filter((type) => type.communication[0] === selectedCommunication?.label)
      ?.map((type) => type.email);
    
    setFilteredEmails(emails);
    } ,[selectedCommunication , communicationType])



  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={
          id
            ? isEditable
              ? "Edit Employee Survey"
              : "View Employee Survey"
            : "Create Employee Survey"
        }
        info={`Here you can ${
          id ? (isEditable ? "edit" : "view") : "create"
        } employee survey form`}
      />
      {isLoading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full mt-4 ">
            <form
              onSubmit={handleSubmit((data) => handleSubmitForm(data, true))}
              className="w-full flex flex-col space-y-4"
            >
              {isEditable ? (
                <>
                  <div className="w-full">
                    <AuthInputFiled
                      className="bg-white"
                      name="title"
                      control={control}
                      type="textEditor"
                      placeholder="Title"
                      label="Title*"
                      maxLimit={100}
                      errors={errors}
                      error={errors.title}
                      readOnly={!isEditable}
                      onChange={(e) => {
                        setValue("title", e.target.value);
                        if (e.target.value) {
                          const newErrors = { ...errors };
                          delete newErrors.title;
                          setErrors(newErrors);
                        }
                      }}
                    />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                  </div>
                  <div className="w-full">
                    <AuthInputFiled
                      name="description"
                      control={control}
                      type="textEditor"
                      placeholder="Description"
                      label="Description*"
                      maxLimit={1000}
                      errors={errors}
                      error={errors.description}
                      readOnly={!isEditable}
                      onChange={(e) => {
                        setValue("description", e.target.value);
                        if (e.target.value) {
                          const newErrors = { ...errors };
                          delete newErrors.description;
                          setErrors(newErrors);
                        }
                      }}
                    />
                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(surveyData?.title || ""),
                    }}
                  ></div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(surveyData?.description || ""),
                    }}
                  ></div>
                </>
              )}

              {questions?.map((q, index) => (
                <div className="grid grid-cols-1 w-full" key={index}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <label className="font-semibold text-gray-500 text-md">
                        Question {index + 1}
                      </label>
                      <div>
                        <label className=" font-semibold text-gray-500 text-md">
                          Question Type*
                        </label>
                        <br />
                        <Select
                          style={{
                            width: "200px",
                            height: "42px",
                            backgroundColor: "white",
                          }}
                          labelId={`question-type-label-${index}`}
                          id={`question-type-select-${index}`}
                          value={q.questionType || "Short Answer"}
                          onChange={(e) => handleQuestionTypeChange(index, e)}
                          disabled={!isEditable}
                        >
                          <MenuItem value="" disabled>
                            Select Question Type
                          </MenuItem>
                          <MenuItem value="Short Answer">Short Answer</MenuItem>
                          <MenuItem value="Paragraph">Paragraph</MenuItem>
                          <MenuItem value="Checkboxes">Checkboxes</MenuItem>
                          <MenuItem value="Dropdown">Dropdown</MenuItem>
                          <MenuItem value="Date">Date</MenuItem>
                          <MenuItem value="Multi-choice">Multi-choice</MenuItem>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <div>
                        <TextField
                          placeholder="Enter Question"
                          variant="standard"
                          fullWidth
                          value={q.question}
                          onChange={(e) => handleQuestionChange(index, e)}
                          error={!!errors[`question-${index}`]}
                          helperText={errors[`question-${index}`]}
                          disabled={!isEditable}
                        />
                      </div>
                    </div>
                    {renderAnswerInput(index)}
                    <div className="flex justify-end">
                      {isEditable && (
                        <>
                          {index > 0 && (
                            <IconButton
                              onClick={() => handleSuffleQuestion(index)}
                              aria-label="shuffle question"
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleCopyQuestion(index)}
                            aria-label="copy question"
                          >
                            <FileCopyIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveQuestion(index)}
                            aria-label="remove question"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={q.required}
                                onChange={() => handleRequiredChange(index)}
                                name={`required-${index}`}
                                color="primary"
                              />
                            }
                            label="Required"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isEditable && (
                <div className="flex gap-4 mt-4 justify-end">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </Button>
                </div>
              )}
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                style={{ marginTop: "30px" }}
              >
                <AuthInputFiled
                  name="employeeSurveyStartingDate"
                  icon={WorkIcon}
                  control={control}
                  type="date"
                  placeholder="dd-mm-yyyy"
                  label="Start date*"
                  errors={errors}
                  error={errors.employeeSurveyStartingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  disabled={!isEditable}
                  onChange={(e) => {
                    setValue("employeeSurveyStartingDate", e.target.value);
                    if (e.target.value) {
                      const newErrors = { ...errors };
                      delete newErrors.employeeSurveyStartingDate;
                      setErrors(newErrors);
                    }
                  }}
                />
                <AuthInputFiled
                  name="employeeSurveyEndDate"
                  icon={WorkIcon}
                  control={control}
                  type="date"
                  placeholder="dd-mm-yyyy"
                  label="End date*"
                  errors={errors}
                  error={errors.employeeSurveyEndDate}
                  min={
                    watch("employeeSurveyStartingDate")
                      ? new Date(
                          new Date(
                            watch("employeeSurveyStartingDate")
                          ).getTime() +
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                  disabled={!isEditable}
                  onChange={(e) => {
                    setValue("employeeSurveyEndDate", e.target.value);
                    if (e.target.value) {
                      const newErrors = { ...errors };
                      delete newErrors.employeeSurveyEndDate;
                      setErrors(newErrors);
                    }
                  }}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="communication"
                  icon={GroupIcon}
                  control={control}
                  type="select"
                  placeholder="Communication Type*"
                  label="Communication Type*"
                  readOnly={false}
                  maxLimit={15}
                  errors={errors}
                  error={errors.communication}
                  options={communicationTypes }
               
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="from"
                  icon={Email}
                  control={control}
                  type="select"
                  placeholder="From *"
                  label="From *"
                  errors={errors}
                  error={errors.from}
                  options={filteredEmails?.map((email) => ({ label: email, value: email }))}
                  onChange={(e) => {
                    setValue("from", e.target.value);
                    if (e.target.value) {
                      const newErrors = { ...errors };
                      delete newErrors.from;
                      setErrors(newErrors);
                    }
                  }}
                />
              </div>
              {isEditable && (
                <div className="space-y-2 ">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showSelectAll}
                        onChange={(e) => setShowSelectAll(e.target.checked)}
                      />
                    }
                    label="Do you want to select all employee emails?"
                  />
                </div>
              )}

              {showSelectAll && (
                <div className="space-y-2 ">
                  <Button
                    variant="outlined"
                    onClick={() => handleSelectAll("to")}
                  >
                    Select All
                  </Button>
                </div>
              )}
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="to"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="To"
                  label="To*"
                  maxLimit={15}
                  isMulti={true}
                  errors={errors}
                  optionlist={employeeEmail ? employeeEmail : []}
                  error={!!errors.to}
                  helperText={errors.to ? errors.to.message : ""}
                  readOnly={!isEditable}
                  onChange={(e) => {
                    setValue("to", e.target.value);
                    if (e.target.value) {
                      const newErrors = { ...errors };
                      delete newErrors.to;
                      setErrors(newErrors);
                    }
                  }}
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employeeCredential}
                      onChange={(e) => setEmployeeCredential(e.target.checked)}
                    />
                  }
                  label="Employee name confidential"
                />
              </div>
              {isEditable && (
                <div className="flex flex-col xs:flex-row gap-4 mt-4 justify-end">
                  <button
                    type="submit"
                    className={`flex justify-center items-center text-lg gap-2 rounded-md h-[40px] px-6 font-semibold text-white bg-[#1414fe] hover:bg-[#0f0fcf] active:bg-[#0b0bb0] transition-all duration-300 disabled:bg-gray-400`}
                    disabled={isSubmitting} // Disable button while loading
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : (
                      "Submit"
                    )}
                  </button>

                  <BasicButton
                    title={"Save For Now"}
                    type="button"
                    onClick={handleSubmit(handleSaveForLater)}
                    variant="outlined"
                    disabled={isSavingForLater} // Disable button while loading
                  >
                    {isSavingForLater ? (
                      <CircularProgress size={20} style={{ color: "black" }} />
                    ) : (
                      "Save For Now"
                    )}
                  </BasicButton>

                  <BasicButton
                    title="Cancel"
                    onClick={handleClose}
                    variant="outlined"
                    color={"danger"}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </BoxComponent>
  );
};

export default CreateNewSurvey;
