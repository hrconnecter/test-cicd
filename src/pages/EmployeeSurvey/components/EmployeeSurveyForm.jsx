import { useContext, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  CircularProgress,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  TextField,
  MenuItem,
  Select as MuiSelect,
  InputLabel,
  FormHelperText,
} from "@mui/material"
import { UseContext } from "../../../State/UseState/UseContext"
import UserProfile from "../../../hooks/UserData/useUser"
import DOMPurify from "dompurify"
import { useQuery, useMutation } from "react-query"
import { TestContext } from "../../../State/Function/Main"
import useGetUser from "../../../hooks/Token/useUser"
import BoxComponent from "../../../components/BoxComponent/BoxComponent"
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo"

const EmployeeSurveyForm = () => {
  // Hooks
  const navigate = useNavigate()
  const { handleAlert } = useContext(TestContext)
  const { surveyId, responseId } = useParams()

  // Get Cookies
  const { cookies } = useContext(UseContext)
  const authToken = cookies["aegis"]
  const { decodedToken: decoded } = useGetUser()

  // Get organizationId
  const { getCurrentUser } = UserProfile()
  const user = getCurrentUser()
  const organisationId = decoded?.user?.organizationId

  // Form state
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get question Form
  const {
    data: surveyData,
    error,
    isLoading,
  } = useQuery(["survey", organisationId, surveyId, authToken], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-open-survey/${surveyId}`,
    )
    return response.data
  })


  const {  isLoading: isLoading1 } = useQuery(
    ["singleResponseSurvey", organisationId, surveyId, responseId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-response-survey/${surveyId}/${responseId}`,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      return response.data
    },
    {
      enabled: !!surveyId && !!responseId && !!organisationId,
      onSuccess: (data) => {
        // Initialize form values from existing response
        const initialValues = {}
        data.questions.forEach((q, index) => {
          if (q.questionType !== "Checkboxes") {
            // q.options?.forEach((option, optIndex) => {
            //   initialValues[`question_${index}_option_${optIndex}`] =
            //     q.answer && Array.isArray(q.answer) && q.answer.includes(option)
            // })
            initialValues[`answer_${index}`] = q.answer || ""
          }
        })
        setFormValues(initialValues)

        surveyData.questions.forEach((q, index) => {
          if (q.questionType === "Checkboxes") {
            q.options?.forEach((option, optIndex) => {
              setFormValues((prev) => ({
                ...prev,
                [`question_${index}_option_${optIndex}`]:
                  data.questions[index].answer && Array.isArray(data.questions[index].answer) && data.questions[index].answer.includes(option),
              }))
            })
          }})

      }
    },
  )

  // Initialize form values when survey data is loaded
  useEffect(() => {
    if (surveyData && !responseId) {
      const initialValues = {}
      surveyData.questions.forEach((q, index) => {
        if (q.questionType === "Checkboxes") {
          q.options?.forEach((option, optIndex) => {
            initialValues[`question_${index}_option_${optIndex}`] = false
          })
        } else {
          initialValues[`answer_${index}`] = ""
        }
      })
      setFormValues(initialValues)
    }
  }, [surveyData, responseId])

  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    let isValid = true

    if (!surveyData) return false

    surveyData.questions.forEach((q, index) => {
      if (q.required) {
        if (q.questionType === "Checkboxes") {
          // Check if at least one checkbox is selected
          const hasChecked = q.options.some((_, optIndex) => formValues[`question_${index}_option_${optIndex}`])

          if (!hasChecked) {
            errors[`question_${index}`] = "At least one option must be selected"
            isValid = false
          }
        } else {
          // For other field types
          const value = formValues[`answer_${index}`]
          if (!value || value === "") {
            errors[`answer_${index}`] = "This field is required"
            isValid = false
          }
        }
      }
    })

    setFormErrors(errors)
    return isValid
  }

  // Post Data
  const mutation = useMutation(
    async (data) => {
      let response
      if (data.isUpdate) {
        // Update response survey
        response = await axios.put(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-employee-survey-response-form/${responseId}`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          },
        )
      } else {
        // Add new response survey
        response = await axios.post(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-response-form`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          },
        )
      }
      return response
    },
    {
      onSuccess: (response) => {
        if (response.status === 201 || response.status === 200) {
          navigate(`/organisation/${organisationId}/employee-survey`)
        }
        handleAlert(true, "success", "Saved survey response successfully")
      },
      onError: (error) => {
        console.error("Error submitting survey responses:", error)
        if (error?.response?.status === 400) {
          handleAlert(true, "error", error?.response?.data?.error)
        }
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    },
  )

  const handleSubmit = (responseStatus, isUpdate = false) => {
    setIsSubmitting(true)

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false)
      handleAlert(true, "error", "Please fill all required fields")
      return
    }

    const data = {
      surveyId: surveyData._id,
      title: surveyData.title,
      description: surveyData.description,
      questions: surveyData.questions.map((q, index) => {
        let answer

        if (q.questionType === "Checkboxes") {
          // For checkboxes, collect all selected options
          answer = q.options.filter((_, optIndex) => formValues[`question_${index}_option_${optIndex}`])
        } else {
          answer = formValues[`answer_${index}`]
        }

        return {
          questionId: q?._id,
          questionType: q?.questionType,
          question: q?.question,
          answer: answer,
        }
      }),
      responseStatus: responseStatus,
      employeeId: user._id,
      isUpdate: isUpdate,
      employeeCredential: surveyData?.employeeCredential,
    }

    mutation.mutate(data)
  }

  if (isLoading || isLoading1) {
    return <CircularProgress />
  }

  if (error) {
    return <div>Error fetching survey data</div>
  }

  const handleClose = () => {
    navigate(`/organisation/${organisationId}/employee-survey`)
  }

  return (
    <BoxComponent sx={{ px: "2%" }}>
      <HeadingOneLineInfo heading="Employee Survey" info="Here you can fill survey" />
      <div className="bg-gray-50 min-h-screen h-auto font-family">
        <section className="md:px-8 flex space-x-2 md:py-6">
          <article className="w-full rounded-lg bg-white">
            <div className="w-full md:px-5 px-1">
              <div className="w-full mt-4 p-4">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(surveyData?.title || "") }}></div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(surveyData?.description || "") }}></div>
                <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-1 space-y-2 flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {surveyData?.questions.map((q, index) => (
                      <div key={q._id} className="mb-6">
                        <div>
                          <p className="text-xl mb-4">
                            {q.question} {q.required && <span className="text-red-500">*</span>}
                          </p>
                        </div>
                        <div>
                          {q.questionType === "Short Answer" && (
                            <>
                              <TextField
                                fullWidth
                                id={`answer_${index}`}
                                name={`answer_${index}`}
                                value={formValues[`answer_${index}`] || ""}
                                onChange={(e) => handleInputChange(`answer_${index}`, e.target.value)}
                                placeholder="Enter answer"
                                error={!!formErrors[`answer_${index}`]}
                                helperText={formErrors[`answer_${index}`]}
                                inputProps={{ maxLength: 100 }}
                              />
                            </>
                          )}

                          {q.questionType === "Paragraph" && (
                            <>
                              <TextField
                                fullWidth
                                id={`answer_${index}`}
                                name={`answer_${index}`}
                                value={formValues[`answer_${index}`] || ""}
                                onChange={(e) => handleInputChange(`answer_${index}`, e.target.value)}
                                placeholder="Enter detailed answer"
                                multiline
                                rows={4}
                                error={!!formErrors[`answer_${index}`]}
                                helperText={formErrors[`answer_${index}`]}
                                inputProps={{ maxLength: 150 }}
                              />
                            </>
                          )}

                          {q.questionType === "Checkboxes" && (
                            <>
                              {q.options.map((option, optIndex) => (
                                  <div key={optIndex} className="space-y-1 flex items-center">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={formValues[`question_${index}_option_${optIndex}`] || false}
                                        onChange={(e) =>
                                          handleInputChange(`question_${index}_option_${optIndex}`, e.target.checked)
                                        }
                                        name={`question_${index}_option_${optIndex}`}
                                      />
                                    }
                                    label={option}
                                  />
                                </div>
                              ))}
                              {formErrors[`question_${index}`] && (
                                <FormHelperText error>{formErrors[`question_${index}`]}</FormHelperText>
                              )}
                            </>
                          )}

                          {q.questionType === "Dropdown" && (
                            <>
                              <FormControl fullWidth error={!!formErrors[`answer_${index}`]}>
                                <InputLabel id={`dropdown-label-${index}`}>Select an option</InputLabel>
                                <MuiSelect
                                  labelId={`dropdown-label-${index}`}
                                  id={`answer_${index}`}
                                  value={formValues[`answer_${index}`] || ""}
                                  onChange={(e) => handleInputChange(`answer_${index}`, e.target.value)}
                                  label="Select an option"
                                >
                                  {q.options.map((option, optIndex) => (
                                    <MenuItem key={optIndex} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </MuiSelect>
                                {formErrors[`answer_${index}`] && (
                                  <FormHelperText>{formErrors[`answer_${index}`]}</FormHelperText>
                                )}
                              </FormControl>
                            </>
                          )}

                          {q.questionType === "Date" && (
                            <>
                              <TextField
                                fullWidth
                                id={`answer_${index}`}
                                name={`answer_${index}`}
                                type="date"
                                value={formValues[`answer_${index}`] || ""}
                                onChange={(e) => handleInputChange(`answer_${index}`, e.target.value)}
                                error={!!formErrors[`answer_${index}`]}
                                helperText={formErrors[`answer_${index}`]}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </>
                          )}

                          {q.questionType === "Multi-choice" && (
                            <>
                              <FormControl component="fieldset" error={!!formErrors[`answer_${index}`]}>
                                <RadioGroup
                                  name={`answer_${index}`}
                                  value={formValues[`answer_${index}`] || ""}
                                  onChange={(e) => handleInputChange(`answer_${index}`, e.target.value)}
                                >
                                  {q.options.map((option, optIndex) => (
                                    <FormControlLabel
                                      key={optIndex}
                                      value={option}
                                      control={<Radio />}
                                      label={option}
                                    />
                                  ))}
                                </RadioGroup>
                                {formErrors[`answer_${index}`] && (
                                  <FormHelperText>{formErrors[`answer_${index}`]}</FormHelperText>
                                )}
                              </FormControl>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4 justify-end">
                    {responseId ? (
                      <>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubmit("End", true)}
                          disabled={isSubmitting}
                        >
                          Submit
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleSubmit("Complete Survey", true)}
                          disabled={isSubmitting}
                        >
                          Save For Now
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubmit("End")}
                          disabled={isSubmitting}
                        >
                          Submit
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleSubmit("Complete Survey")}
                          disabled={isSubmitting}
                        >
                          Save For Now
                        </Button>
                      </>
                    )}
                    <Button onClick={handleClose} variant="outlined" color="error" disabled={isSubmitting}>
                      Close
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </article>
        </section>
      </div>
    </BoxComponent>
  )
}

export default EmployeeSurveyForm

