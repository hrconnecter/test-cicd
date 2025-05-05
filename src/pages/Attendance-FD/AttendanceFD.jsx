
import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import PhotoCaptureForm from "./components/PhotoCaptureForm"
import MarkAttendance from "./components/MarkAttendance"
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo"

const AttendanceFD = () => {
  const [activity, setActivity] = useState("Punch In") // Default to Punch In

  return (
    <div className="min-h-screen bg-gray-50">
      <div >
        {/* Header - visible on all screens */}

        <div className="lg:m-0  m-2">

        <HeadingOneLineInfo
          info={"Use your camera to quickly mark your attendance with facial recognition"}
          heading={"Employee Attendance"}
          />

          </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left-side activity selection - visible only on desktop */}
          <Box
            className="hidden  lg:flex flex-col w-full lg:w-1/4 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "#1e293b",
                textAlign: "center",
              }}
            >
              Select Activity
            </Typography>

            <div className="space-y-3">
              <Button
                variant={activity === "Punch In" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActivity("Punch In")}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  "&.MuiButton-contained": {
                    backgroundColor: "#3b82f6",
                    "&:hover": {
                      backgroundColor: "#2563eb",
                      boxShadow: "none",
                    },
                  },
                }}
                startIcon={
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-xs">IN</span>
                  </div>
                }
              >
                Punch In
              </Button>

              <Button
                variant={activity === "Punch Out" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => setActivity("Punch Out")}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  "&.MuiButton-contained": {
                    backgroundColor: "#f43f5e",
                    "&:hover": {
                      backgroundColor: "#e11d48",
                      boxShadow: "none",
                    },
                  },
                }}
                startIcon={
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                    <span className="text-xs">OUT</span>
                  </div>
                }
              >
                Punch Out
              </Button>
            </div>

            {/* Additional information */}
            {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Typography variant="body2" sx={{ color: "#3b82f6", fontWeight: 500 }}>
                Today's Status
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
                Last punch: <span className="font-medium">09:15 AM (In)</span>
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Working hours: <span className="font-medium">4h 20m</span>
              </Typography>
            </div> */}
          </Box>

          {/* Main content - Camera */}
          <Box className="w-full lg:w-3/4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Title - only visible on desktop */}
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: "#1e293b",
                textAlign: "center",
                display: { xs: "none", lg: "block" },
              }}
            >
              {activity === "Punch In" ? "Mark Your Arrival" : "Mark Your Departure"}
            </Typography>

            <div className="flex justify-center">
              {/* Pass a prop to indicate if we're on mobile view */}
              <PhotoCaptureForm activity={activity} setActivity={setActivity} showToggleOnMobile={true} />
            </div>
          </Box>
        </div>

      
          <MarkAttendance />
      </div>
    </div>
  )
}

export default AttendanceFD

