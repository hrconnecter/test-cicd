import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const OpenSurveyList = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  // Get organizationId
  const param = useParams();
  const organisationId = param?.organisationId;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //states
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [currentSurveyId, setCurrentSurveyId] = useState(null);

  // Get the current date
  const currentDate = new Date();

  // Get open surveys
  const {
    data: surveys,
    isLoading,
    isError,
  } = useQuery(
    ["openSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-open-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Get response surveys
  const { data: responseSurvey } = useQuery(
    ["responseSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Handle form navigation
  const handleSurveyForm = (surveyId, responseId) => {
    navigate(
      `/organisation/${organisationId}/survey-form/${surveyId}/${responseId}`
    );
  };

  // Handle form navigation
  const handleTakeSurvey = (surveyId) => {
    navigate(`/organisation/${organisationId}/survey-form/${surveyId}`);
  };

  // Match surveys with their responses
  const matchedResponses = surveys?.map((survey) => {
    const responses = responseSurvey?.filter(
      (response) => response.surveyId === survey?._id
    );
    return {
      ...survey,
      responses: responses || [],
    };
  });

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setCurrentSurveyId(id);
  };

  const handleDeleteConfirmation = (surveyId) => {
    setDeleteConfirmation(surveyId);
  };

  const handleCloseIcon = () => {
    setAnchorEl(null);
    setCurrentSurveyId(null);
  };

  const handleShowSurvey = (surveyId) => {
    navigate(`/organisation/${organisationId}/view-survey/${surveyId}`);
  };

  const handleEditSurvey = (surveyId) => {
    navigate(`/organisation/${organisationId}/update-survey/${surveyId}`);
  };

  //delete created survey
  const deleteMutation = useMutation(
    (surveyId) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/delete-draft-survey/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("openSurveys");
        handleAlert(true, "success", "Employee survey deleted successfully");
      },
      onError: () => {
        handleAlert(true, "error", "Failed to delete the survey");
      },
    }
  );

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteConfirmation);
    handleCloseConfirmation();
  };

  // Fetch a single survey data
  const fetchSingleSurvey = async (surveyId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey-surveyId/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching survey:", error);
      throw error;
    }
  };

  //handleSurveyDetails function
  const handleSurveyDetails = (surveyId) => {
    navigate(`/organisation/${organisationId}/survey-details/${surveyId}`);
  };

  // Generate Excel function
  const generateExcelForSurvey = (surveys) => {
    if (!surveys || surveys.length === 0) return;

    // Extract title and description from the first survey
    const title = surveys[0].title;
    const description = surveys[0].description;

    // Extract all questions from the surveys
    const questionSet = new Set();
    surveys.forEach((survey) => {
      survey.questions.forEach((q) => questionSet.add(q.question));
    });

    const questions = Array.from(questionSet);

    // Create the header rows
    const headers = [
      ["Title", "Description"],
      [title, description],
      [],
      questions,
    ];

    // Prepare the data rows
    const data = surveys.map((survey) => {
      const row = questions.map((q) => {
        const question = survey.questions.find((qn) => qn.question === q);
        return question ? question.answer : "N/A";
      });
      return row;
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Data");

    // Write to file
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  // Handle Excel click function
  const handleExcelClick = async (surveyId) => {
    try {
      const survey = await fetchSingleSurvey(surveyId);
      generateExcelForSurvey(survey);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  return (
    <section className="py-0 mb-10">
      {/* <div className="border-t-[.5px] border-gray-300"></div> */}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="flex justify-center p-4 text-red-500">
          Error fetching data
        </div>
      ) : surveys && surveys?.length > 0 ? (
        <div className="overflow-auto border-[.5px] border-gray-200 mt-4">
          <table className="w-full table-auto border border-collapse min-w-full bg-white text-left text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="font-semibold">
                <th scope="col" className="text-left px-2 w-max py-3 text-sm">
                  Title
                </th>
                <th scope="col" className="py-3 text-sm px-2">
                  Start Date
                </th>
                <th scope="col" className="py-3 text-sm px-2">
                  End Date
                </th>
                <th scope="col" className="py-3 text-sm px-2">
                  Created By
                </th>
                {role !== "Employee" && (
                  <th scope="col" className="py-3 text-sm px-2">
                    Actions
                  </th>
                )}
                {role === "Employee" && (
                  <th scope="col" className="py-3 text-sm px-2">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {matchedResponses?.map((survey, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 bg-white font-medium border-b"
                >
                  <td className="text-left cursor-pointer py-4 px-2 text-sm w-[70px]">
                    {DOMPurify.sanitize(survey?.title, {
                      USE_PROFILES: { html: false },
                    })}
                  </td>
                  <td className="text-left cursor-pointer py-4 px-2 text-sm">
                    {survey &&
                      format(
                        new Date(survey?.employeeSurveyStartingDate),
                        "PP"
                      )}
                  </td>
                  <td className="text-left cursor-pointer py-4 px-2 text-sm">
                    {survey &&
                      format(new Date(survey?.employeeSurveyEndDate), "PP")}
                  </td>
                  <td className="text-left cursor-pointer py-4 px-2 text-sm">
                    {survey && survey.creatorId
                      ? `${survey.creatorId.first_name} ${survey.creatorId.last_name}`
                      : ""}
                  </td>
                  {role !== "Employee" && (
                    <>
                      <td className="text-left cursor-pointer py-4 px-2 text-sm">
                        <MoreVert
                          onClick={(e) => handleClick(e, survey._id)}
                          className="cursor-pointer"
                        />
                        <Menu
                          elevation={2}
                          anchorEl={anchorEl}
                          open={Boolean(
                            anchorEl && currentSurveyId === survey._id
                          )}
                          onClose={handleCloseIcon}
                        >
                          <Tooltip title="View Survey">
                            <MenuItem
                              onClick={() => handleShowSurvey(survey._id)}
                            >
                              <VisibilityOutlinedIcon
                                color="primary"
                                aria-label="view"
                                style={{ color: "grey", marginRight: "10px" }}
                              />
                              View
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <MenuItem
                              onClick={() => handleSurveyDetails(survey._id)}
                            >
                              View Details
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Generate Excel">
                            <MenuItem
                              onClick={() => handleExcelClick(survey._id)}
                            >
                              Generate Excel
                            </MenuItem>
                          </Tooltip>
                          {currentDate <
                            new Date(survey.employeeSurveyStartingDate) && (
                            <Tooltip title="Edit Survey">
                              <MenuItem
                                onClick={() => handleEditSurvey(survey._id)}
                              >
                                <EditIcon
                                  color="primary"
                                  aria-label="edit"
                                  style={{
                                    color: "#2196f3",
                                    marginRight: "10px",
                                  }}
                                />
                                Edit
                              </MenuItem>
                            </Tooltip>
                          )}
                          {currentDate <
                            new Date(survey.employeeSurveyStartingDate) && (
                            <Tooltip title="Delete Survey">
                              <MenuItem
                                onClick={() =>
                                  handleDeleteConfirmation(survey._id)
                                }
                              >
                                <DeleteOutlineIcon
                                  color="primary"
                                  aria-label="delete"
                                  style={{
                                    color: "#f50057",
                                    marginRight: "10px",
                                  }}
                                />
                                Delete
                              </MenuItem>
                            </Tooltip>
                          )}
                        </Menu>
                      </td>
                    </>
                  )}
                  {!(role === "Super-Admin" || role === "HR") && (
                    <td className="text-left cursor-pointer py-4 px-2 text-sm">
                      {survey?.responses?.length > 0 ? (
                        <div>
                          {survey?.responses[0]?.responseStatus === "End" ? (
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleSurveyForm(
                                  survey?._id,
                                  survey?.responses[0]?._id
                                )
                              }
                              sx={{ textTransform: "none", width: "auto" }}
                              disabled
                            >
                              {survey.responses[0].responseStatus}
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleSurveyForm(
                                  survey?._id,
                                  survey?.responses[0]?._id
                                )
                              }
                              sx={{ textTransform: "none", width: "auto" }}
                            >
                              {survey?.responses[0]?.responseStatus}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => handleTakeSurvey(survey?._id)}
                          sx={{ textTransform: "none", width: "auto" }}
                        >
                          Take Survey
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="py-6 w-full px-4">
          <p>No data available</p>
        </section>
      )}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this survey, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default OpenSurveyList;
