/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Rating,
  Grid,
  Paper,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router";
import useAuthToken from "../../../hooks/Token/useAuth";
import { TextField, Autocomplete } from "@mui/material";
import AssessmentDetails from "./AssessmentDetails";

const SendAssessment = ({ mutate }) => {
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [employees, setEmployees] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);

  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);

  const toggleAssessmentDetails = () => {
    setShowAssessmentDetails(!showAssessmentDetails);
  };

  const formSchema = z.object({
    employeeName: z.string().min(3, { message: "Employee name is required" }),
    employeeId: z.string().min(1, { message: "Employee ID is required" }),
    department: z.string().optional(),
    manager: z.string().optional(),
    managerId: z.string().min(1, { message: "Manager ID is required" }),
    selectedSkills: z
      .array(
        z.object({
          skillName: z.string(),
          skillId: z.string(),
          rating: z.number().min(0).max(5),
        })
      )
      .min(1, { message: "At least one skill must be selected" }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      employeeName: "",
      employeeId: "",
      department: "",
      manager: "",
      managerId: "",
      selectedSkills: [],
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    fetchAssessmentSetup();
    fetchEmployees(searchQuery);
    fetchSkills();
    fetchManagerData();
  }, [organisationId, searchQuery]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const transformedSkills = response.data.data.map((skill) => ({
        skillName: skill.skillName,
        skillId: skill._id,
      }));
      setSkills(transformedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
    }
  };

  const fetchAssessmentSetup = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assessment/setup/organization/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setIsAssessmentEnabled(response.data.isAssessmentEnabled || true);
    } catch (error) {
      console.error("Error fetching assessment setup:", error);
    }
  };

  const fetchEmployees = async (nameSearch = "") => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        {
          params: {
            nameSearch,
          },
          headers: {
            Authorization: authToken,
          },
        }
      );
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const fetchManagerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setManagerData(response.data.manager);
    } catch (error) {
      console.error("Error fetching manager data:", error);
      setManagerData([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendAssessment = async (formData) => {
    try {
      const preparedData = {
        ...formData,
        employeeId: formData.employeeId,
        managerId: formData.managerId,
        assessmentDetails: formData.assessmentDetails || "Assessment details",
        selectedSkills: formData.selectedSkills.map((skill) => ({
          skillId: skill.skillId,
          skillName: skill.skillName,
          rating: skill.rating,
        })),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/sendAssessment`,
        preparedData,
        {
          headers: { Authorization: authToken },
        }
      );
      const enrichedResponse = {
        ...response.data,
        data: {
          ...response.data.data,
          employeeName: formData.employeeName,
          department: formData.department,
          manager: formData.manager,
        },
      };

      alert("Assessment sent successfully!");
      console.log("enrichedResponse", enrichedResponse);
    } catch (error) {
      console.error("Error sending assessment:", error);
      alert("Failed to send assessment.");
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data on Submit:", data);
    if (!data.employeeId || !data.managerId || !data.selectedSkills.length) {
      alert("Please ensure all required fields are filled.");
      return;
    }
    try {
      console.log("Selected Employee ID:", data.employeeId);
      console.log("Form Data:", data);
      await sendAssessment(data);
      await mutate(data);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  //   add this into <div className=" p-6 ">
  //
  //             <h2 className="text-2xl font-bold text-gray-800">Send Assessment</h2>
  //             <p className="text-gray-600 mt-2">
  //               Here you can send assessments to Employee.
  //               <
  //             </p>
  //         </div> for understanding
  return (
    <>
      <p className="text-xl font-bold text-gray-800">Send Assessment  <br /> <span className="text-gray-600 text-sm ">Here you can send assessments to Employee. </span> </p>     
      {/* <p className="text-gray-600 ">  Here you can send assessments to Employee.{" "} </p> */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {isAssessmentEnabled && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Side-by-Side Employee and Manager Autocomplete */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) =>
                        `${option.first_name} ${option.last_name}`
                      }
                      onChange={(_, selectedEmployee) => {
                        if (selectedEmployee) {
                          setValue("employeeId", selectedEmployee._id);
                          setValue(
                            "employeeName",
                            `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                          );
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="Select Employee"
                          variant="outlined"
                          fullWidth
                          error={!!errors.employeeName}
                          helperText={errors.employeeName?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="manager"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={managerData}
                      getOptionLabel={(option) =>
                        `${option.first_name} ${option.last_name}`
                      }
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setValue("managerId", newValue._id);
                          setValue(
                            "manager",
                            `${newValue.first_name} ${newValue.last_name}`
                          );
                        } else {
                          setValue("managerId", "");
                          setValue("manager", "");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="Select Manager"
                          variant="outlined"
                          fullWidth
                          error={!!errors.manager}
                          helperText={errors.manager?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                    />
                  )}
                />
              </Grid>

              {/* Skills Autocomplete */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.skillName}
                  onChange={(_, selected) => {
                    const formattedSkills = selected.map((skill) => ({
                      skillName: skill.skillName,
                      skillId: skill.skillId,
                      rating: 0,
                    }));
                    setValue("selectedSkills", formattedSkills);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Skills"
                      variant="outlined"
                      error={!!errors.selectedSkills}
                      helperText={errors.selectedSkills?.message}
                    />
                  )}
                />
              </Grid>

              {/* Skill Ratings
              {watch("selectedSkills").map((skill, index) => (
                <Grid 
                  item 
                  xs={12} 
                  key={skill.skillId} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}
                >
                  <Typography variant="body1">{skill.skillName}</Typography>
                  <Rating
                    value={skill.rating}
                    onChange={(_, newValue) =>
                      setValue(`selectedSkills.${index}.rating`, newValue)
                    }
                  />
                </Grid>
              ))} */}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Send Assessment
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {/* Assessment Details Section */}
        {/* <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Assessment Details
        </Typography>
        <AssessmentDetails />
      </Box> */}

        <Box
          sx={{
            marginTop: 3,
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "black",
              }}
            >
              Assessment Details
            </Typography>

            <Button
              variant="contained"
              color={showAssessmentDetails ? "secondary" : "primary"}
              onClick={toggleAssessmentDetails}
            >
              {showAssessmentDetails ? "Hide Details" : "Show Details"}
            </Button>
          </Box>

          <Collapse in={showAssessmentDetails}>
            <AssessmentDetails />
          </Collapse>
        </Box>
      </Box>
    </>
  );
};

export default SendAssessment;
