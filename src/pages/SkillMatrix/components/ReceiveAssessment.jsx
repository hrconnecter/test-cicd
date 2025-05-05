/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Button, Rating, Typography, Box, Paper } from "@mui/material";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const ReceiveAssessment = () => {
  const queryClient = useQueryClient();
  const { organisationId, employeeId } = useParams();
  const authToken = useAuthToken();
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Fetch the received assessment details
  const fetchReceivedAssessments = async () => {
    if (!organisationId || !employeeId) {
      console.error("Organization ID or Employee ID is missing.");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/employee/${employeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const data = response.data.data;
      setSelectedAssessment(data); // Set the assessment data
    } catch (error) {
      console.error("Error fetching received assessments:", error);
      setSelectedAssessment(null);
    }
  };

  useEffect(() => {
    fetchReceivedAssessments();
  }, [organisationId, employeeId]);

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      ratings: [],
    },
  });

  // Handle form submission
  const submitAssessment = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/submitAssessment/${selectedAssessment._id}/${employeeId}`,
        { ratings: data.ratings },
        {
          headers: { Authorization: authToken },
        }
      );
      alert("Assessment submitted successfully!");
      queryClient.invalidateQueries("receivedAssessments");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Failed to submit assessment.");
    }
  };

  const onSubmit = (data) => {
    submitAssessment(data);
  };
  const ratings = watch("ratings");
  return (
    <div className=" ">
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Manager's Assessment"}
          info={
            "Complete your pending assessments by rating your skills based on self-evaluation"
          }
        />

        <div className="p-4">
          {selectedAssessment ? (
            <Paper elevation={3} className="p-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Skill Evaluation for {selectedAssessment.employeeName}
                </h2>

                <p className="text-lg text-gray-600">
                  Please rate your skills based on your self-assessment.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-3"
              >
                <div>
                  {selectedAssessment.selectedSkills.map((skill, index) => (
                    <Box
                      key={index}
                      className="flex items-center space-x-4 mb-2"
                    >
                      <Typography variant="body1" style={{ width: "150px" }}>
                        {skill.skillName}
                      </Typography>
                      <Rating
                        value={
                          ratings.find((r) => r.skillId === skill.skillId)
                            ?.rating || 0
                        }
                        onChange={(_, newValue) => {
                          if (newValue !== null) {
                            const existingRatingIndex = ratings.findIndex(
                              (r) => r.skillId === skill.skillId
                            );

                            if (existingRatingIndex > -1) {
                              const updatedRatings = [...ratings];
                              updatedRatings[existingRatingIndex] = {
                                ...ratings[existingRatingIndex],
                                rating: newValue,
                              };
                              setValue("ratings", updatedRatings);
                            } else {
                              setValue("ratings", [
                                ...ratings,
                                {
                                  skillId: skill.skillId,
                                  skillName: skill.skillName,
                                  rating: newValue,
                                },
                              ]);
                            }
                          }
                        }}
                      />
                    </Box>
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  // fullWidth
                  size="medium"
                  className="px-8"
                  sx={{ marginTop: 3 }}
                >
                  Submit Assessment
                </Button>
              </form>
            </Paper>
          ) : (
            <Typography variant="body1">
              No assessment available for you at the moment.
            </Typography>
          )}
        </div>
      </BoxComponent>
    </div>
  );
};

export default ReceiveAssessment;
