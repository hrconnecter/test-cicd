import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";
import { Email } from "@mui/icons-material";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";

// Setup the localizer
const localizer = momentLocalizer(moment);

const CalendarInterviewSchedule = () => {
  const { authToken } = useGetUser();
  const { applicantId, organisationId, jobId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const selfApplicantID = user?._id;
  const { handleAlert } = useContext(TestContext);

  const [selectedCell, setSelectedCell] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      employeeName: "",
      notes: "",
      from: "",
      hiringManagerTo: "",
      to: "",
      time: "",
    },
  });

  //employee list
  const { data: employee } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.employees;
    }
  );
  const employeeEmail = employee
    ? employee?.map((emp) => ({
        label: emp.email,
        value: emp.email,
      }))
    : [];

  //get specific application data
  const { data: application } = useQuery(
    ["jobApplicationDetails", organisationId, jobId, applicantId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicantId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data;
    },
    { enabled: !!authToken }
  );
  console.log("xyzapplication", application);

  //interview sheduled by HR
  const scheduleInterviewMutation = useMutation(
    async (payload) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicantId}/interview/hiring`,
        payload,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Interview scheduled successfully!");
        setDialogOpen(false);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          "Failed to schedule the interview. Try again."
        );
      },
    }
  );

  //Date and time format
  const formatDate = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const formatDateToISOString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString) => {
    const momentTime = moment(timeString, "HH:mm");
    return momentTime.format("hh:mm A");
  };

  const formattedDate = (data) => {
    if (!data) return "Invalid Date";

    const date = new Date(data);
    if (isNaN(date)) return "Invalid Date";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  //handle submit
  const onSubmit = (data) => {
    const selectedDate = new Date(
      selectedCell.year,
      selectedCell.month - 1,
      selectedCell.date
    );
    const formattedDate = formatDateToISOString(selectedDate);
    const formattedTime = data.time
      ? formatTime(data.time)
      : formatTime(selectedCell.time);

    const payload = {
      date: formattedDate,
      time: formattedTime,
      day: selectedCell.day,
      scheduledBy: data?.from,
      interviewer: data.hiringManagerTo[0]?.value,
      interviewDescription: data.notes,
      applicantEmail: data?.to,
    };
    scheduleInterviewMutation.mutate(payload);
  };

  // Handle slot selection
  const handleSelectSlot = ({ start }) => {
    const day = moment(start).format("dddd");
    const date = moment(start).format("DD");
    const month = moment(start).month() + 1;
    const year = moment(start).format("YYYY");
    const time = moment(start).format("hh:mm A");

    console.log("selectedCell", { day, date, month, year, time });

    setSelectedCell({ day, date, month, year, time });
    setDialogOpen(true);
  };

  // Close dialogs
  const closeDialog = () => {
    setDialogOpen(false);
    reset();
    setSelectedCell({});
  };

  //applicant side view
  const { data: applicantData } = useQuery(
    ["allicantData", organisationId, selfApplicantID],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/applicant/${selfApplicantID}/applied-jobs`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data?.data;
    },
    { enabled: !!authToken }
  );
  console.log("applicantData", applicantData);

  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const applicantAcceptRejectISchedule = useMutation(
    async (payload) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/interview-schedule-accept-reject/${selectedInterview?._id}`,
        payload,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(
          true,
          "success",
          "Interview scheduled status accept/reject"
        );
      },
      onError: (error) => {
        handleAlert(true, "error", "Failed. Try again.");
      },
    }
  );

  const handleInterviewStatus = (status) => {
    if (selectedInterview) {
      const payload = {
        status: status,
      };
      applicantAcceptRejectISchedule.mutate(payload);
    }
  };

  const handleSelectEvent = (event) => {
    if (event.specificApplicantData) {
      const applicant = event.specificApplicantData;
      setSelectedInterview(applicant);
      setDialogOpen1(true);
    }
  };

  //interviewer side view
  const { data: interviewerData } = useQuery(
    ["interviewerData", organisationId, user?.email],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/interviewer`,
        {
          params: { interviewer: user?.email },
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    { enabled: !!authToken && !!user?.email }
  );

  console.log("interviewerData", interviewerData);

  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [selectedInterview1, setSelectedInterview1] = useState(null);
  console.log("selectedInterview1", selectedInterview1);

  const handleSelectEvent1 = (event) => {
    if (event.interviewer) {
      const interviewDetails = interviewerData?.jobApplications?.find(
        (app) => app?.interviewDetails?.date === event.start.toISOString()
      );
      if (interviewDetails) {
        setSelectedInterview1(interviewDetails);
        setDialogOpen2(true);
      }
    }
  };

  const interviewerAcceptRejectISchedule = useMutation(
    async (payload) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/interview-schedule-accept-reject/interviewer/${selectedInterview1?._id}`,
        payload,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(
          true,
          "success",
          "Interviewer scheduled status accept/reject"
        );
      },
      onError: (error) => {
        handleAlert(true, "error", "Failed. Try again.");
      },
    }
  );

  const handleInterviewStatus1 = (status) => {
    if (selectedInterview1) {
      const payload = {
        status: status,
      };
      interviewerAcceptRejectISchedule.mutate(payload);
    }
  };
  const events = [
    // Single event for the primary application
    {
      title: `${application?.interviewDetails?.interviewer}`,
      start: new Date(application?.interviewDetails?.date), // Convert to Date object
      end: new Date(
        new Date(application?.interviewDetails?.date).getTime() + 30 * 60 * 1000
      ), // Assuming 30-minute interview
      time: application?.interviewDetails?.time,
      applicantEmail: application?.interviewDetails?.applicantEmail,
    },
    // Add applicant-specific events if interviewDetails exists
    ...(applicantData
      ?.map((applicant) => {
        const interviewDetails = applicant?.interviewDetails;

        return interviewDetails
          ? {
              title: `${interviewDetails?.interviewer}`,
              applicantEmail: interviewDetails?.applicantEmail,
              time: interviewDetails?.time,
              start: new Date(interviewDetails?.date),
              end: new Date(
                new Date(interviewDetails?.date).getTime() + 30 * 60 * 1000
              ),
              specificApplicantData: applicant,
            }
          : null;
      })
      .filter((event) => event !== null) || []), // Filter out null values

    //manager to view interview self shedule
    ...(interviewerData?.jobApplications?.map((interview) => ({
      title: `${interview?.interviewDetails?.interviewer}`,
      start: new Date(interview?.interviewDetails?.date),
      end: new Date(
        new Date(interview?.interviewDetails?.date).getTime() + 30 * 60 * 1000
      ),
      interviewer: interview?.interviewDetails?.interviewer,
      applicantEmail: interview?.interviewDetails?.applicantEmail,
      time: interview?.interviewDetails?.time,
    })) || []),
  ].filter(Boolean); // Remove any null/undefined events
  const handleCombinedEventSelect = (event) => {
    handleSelectEvent(event); // Call the first handler
    handleSelectEvent1(event); // Call the second handler
  };

  //
  useEffect(() => {
    if (application) {
      setValue(
        "employeeName",
        `${application?.applicantId?.first_name} ${application?.applicantId?.last_name}`
      );
      setValue("from", `${user?.email}`);
      setValue("hiringManagerTo", `${application?.jobId?.createdBy?.email}`);
      setValue("to", `${application?.applicantId?.email}`);
    }
  }, [application, setValue, user]);

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        selectable
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleCombinedEventSelect}
        components={{
          event: ({ event }) => (
            <div>
              <strong>{event.title}</strong>
              <br />
              <span>{event.applicantEmail}</span>
              <br />
              <span>{event.time}</span>
            </div>
          ),
        }}
      />

      {/* Dialog for Scheduling Interview */}
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            maxWidth: "none",
          },
        }}
        open={dialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <p>
            <strong>Day:</strong> {selectedCell.day}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {selectedCell.year && selectedCell.month && selectedCell.date
              ? formatDate(
                  selectedCell.date,
                  selectedCell.month,
                  selectedCell.year
                ) // Call the formatDate function
              : "Invalid Date"}
          </p>

          {/* Form for Interview Details */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AuthInputFiled
              className="bg-white"
              name="employeeName"
              control={control}
              type="text"
              placeholder="Employee Name"
              label="Employee Name*"
              maxLimit={100}
              errors={errors}
              error={errors.employeeName}
              value={
                application?.applicantId?.first_name +
                " " +
                application?.applicantId?.last_name
              }
            />
            <AuthInputFiled
              name="from"
              icon={Email}
              control={control}
              type="text"
              placeholder="Email"
              label="from*"
              value={user?.email}
              maxLimit={15}
              errors={errors}
              error={!!errors.from}
              helperText={errors.from ? errors.from.message : ""}
            />
            <AuthInputFiled
              name="hiringManagerTo"
              icon={Email}
              control={control}
              type="autocomplete"
              placeholder="Hiring Manager*"
              label="Hiring Manager*"
              maxLimit={15}
              isMulti={true}
              optionlist={employeeEmail ? employeeEmail : []}
              error={!!errors.hiringManagerTo}
              errors={errors}
            />
            <AuthInputFiled
              name="to"
              icon={Email}
              control={control}
              type="text"
              placeholder="To"
              label="Employee*"
              value={application?.email}
              errors={errors}
              error={!!errors.to}
              helperText={errors.to ? errors.to.message : ""}
            />
            <AuthInputFiled
              name="notes"
              control={control}
              type="textarea"
              placeholder="Notes"
              label="Notes"
              errors={errors}
              error={errors.notes}
            />

            {/* Time Input */}
            <Controller
              control={control}
              name="time"
              rules={{ required: "Time is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Time"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  type="time"
                  error={!!errors.time}
                  helperText={errors.time ? errors.time.message : ""}
                />
              )}
            />

            {/* Submit Button */}
            <DialogActions>
              <Button onClick={closeDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Applicant side */}
      <Dialog
        open={dialogOpen1}
        onClose={() => setDialogOpen1(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Interview Status
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ height: "400px" }}>
            {/* Left Section: Job Details */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%", // Ensure Paper takes full height of the grid item
                  maxHeight: "100%", // Set max height to ensure it's 400px
                  overflowY: "auto", // Enable vertical scrolling if content overflows
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Job Details
                </Typography>
                <Typography variant="body1">
                  <strong>Job Title:</strong>{" "}
                  {selectedInterview?.jobId?.jobTitle}
                </Typography>
                <Typography variant="body1">
                  <strong>Job Role:</strong> {selectedInterview?.jobId?.jobRole}
                </Typography>
                <Typography variant="body1">
                  <strong>Required Experience:</strong>{" "}
                  {selectedInterview?.jobId?.experienceRequired}
                </Typography>
                <Typography variant="body1">
                  <strong>Mode of Working:</strong>{" "}
                  {selectedInterview?.jobId?.modeOfWorking}
                </Typography>
                <Typography variant="body1">
                  <strong>Job Description:</strong>{" "}
                  {selectedInterview?.jobId?.jobDescription}
                </Typography>
              </Paper>
            </Grid>

            {/* Right Section: Interview Details */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",

                  height: "100%",
                  maxHeight: "100%",
                  overflowY: "auto", // Enable vertical scrolling if content overflows
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Interview Details
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {formattedDate(selectedInterview?.interviewDetails?.date)}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong>{" "}
                  {selectedInterview?.interviewDetails?.time}
                </Typography>
                <Typography variant="body1">
                  <strong>Interviewer:</strong>{" "}
                  {selectedInterview?.interviewDetails?.interviewer}
                </Typography>
                <Typography variant="body1">
                  <strong>Interview Description:</strong>{" "}
                  {selectedInterview?.interviewDetails?.interviewDescription ||
                    "N/A"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ padding: "16px" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                onClick={() => handleInterviewStatus("Accepted")}
                variant="contained"
                color="primary"
                sx={{ width: "120px" }}
              >
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => handleInterviewStatus("Rejected")}
                variant="contained"
                color="secondary"
                sx={{ width: "120px" }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* Interviewer side */}
      <Dialog
        open={dialogOpen2}
        onClose={() => setDialogOpen2(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Interviewer
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ height: "300px" }}>
            {/* Left Section: Job Details */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%", // Ensure Paper takes full height of the grid item
                  maxHeight: "100%", // Set max height to ensure it's 400px
                  overflowY: "auto", // Enable vertical scrolling if content overflows
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Job Details
                </Typography>
                <Typography variant="body1">
                  <strong>Job Title:</strong>{" "}
                  {selectedInterview1?.jobId?.jobTitle}
                </Typography>
                <Typography variant="body1">
                  <strong>Job Role:</strong>{" "}
                  {selectedInterview1?.jobId?.jobRole}
                </Typography>
                <Typography variant="body1">
                  <strong>Required Experience:</strong>{" "}
                  {selectedInterview1?.jobId?.experienceRequired}
                </Typography>
                <Typography variant="body1">
                  <strong>Mode of Working:</strong>{" "}
                  {selectedInterview1?.jobId?.modeOfWorking}
                </Typography>
                <Typography variant="body1">
                  <strong>Job Description:</strong>{" "}
                  {selectedInterview1?.jobId?.jobDescription}
                </Typography>
              </Paper>
            </Grid>

            {/* Right Section: Interview Details */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",

                  height: "100%",
                  maxHeight: "100%",
                  overflowY: "auto", // Enable vertical scrolling if content overflows
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Interview Details
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {formattedDate(selectedInterview1?.interviewDetails?.date)}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong>{" "}
                  {selectedInterview1?.interviewDetails?.time}
                </Typography>
                <Typography variant="body1">
                  <strong>Interviewer:</strong>{" "}
                  {selectedInterview1?.interviewDetails?.interviewer}
                </Typography>
                <Typography variant="body1">
                  <strong>Applicant Employee:</strong>{" "}
                  {selectedInterview1?.interviewDetails?.applicantEmail}
                </Typography>
                <Typography variant="body1">
                  <strong>Interview Description:</strong>{" "}
                  {selectedInterview1?.interviewDetails?.interviewDescription ||
                    "N/A"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ padding: "16px" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                onClick={() => handleInterviewStatus1("Accepted")}
                variant="contained"
                color="primary"
                sx={{ width: "120px" }}
              >
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => handleInterviewStatus1("Rejected")}
                variant="contained"
                color="secondary"
                sx={{ width: "120px" }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalendarInterviewSchedule;
