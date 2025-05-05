import { Button, CircularProgress, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store"
import useGetUser from "../../../hooks/Token/useUser"
import useSelfieFaceDetect from "./useSelfieFaceDetect"
import FaceDetectionLoader from "./FaceDetectionLoader"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"

const PhotoCaptureForm = ({ setOpen, activity, setActivity, showToggleOnMobile = false }) => {
  const { media } = useSelfieStore()
  const photoRef = useRef()
  const videoRef = useRef()
  const { authToken } = useGetUser()

  const { id, organisationId } = useParams()
  const orgId = id || organisationId

  const { loading, setLoading, isFaceDetectionLoading, employeeOrgId } = useSelfieFaceDetect()

  const [isInGeoFence, setIsInGeoFence] = useState(false)
  const [imageCaptured, setImageCaptured] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  console.log("videoReady", videoReady)
  const [employeeName, setEmployeeName] = useState("")
  const [loadingGeoFence, setLoadingGeoFence] = useState(true)
  const [geoFenceError, setGeoFenceError] = useState("")
  const [faceComparisonError, setFaceComparisonError] = useState("") 


  useEffect(() => {
    const video = videoRef.current
    if (video && media) {
      video.srcObject = media
    }

    return () => {
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks()
        tracks.forEach((track) => track.stop()) // Stop all media tracks
        video.srcObject = null
      }
    }
  }, [media])

  const fetchEmployeeLocation = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/route/get-geo-circle-employee/${organisationId}`, {
      headers: {
        Authorization: authToken,
      },
    })

    return response.data
  }



  // Function to calculate the distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180
    const R = 6371e3 // Radius of the Earth in meters
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) // Distance in meters
  }

 useQuery({
    queryKey: [`employee-geo-fence-area-attendence`],
    queryFn: fetchEmployeeLocation,
    enabled: window.location.pathname.includes("/selfi-attendance"),
    retry: false,
    onSuccess: (data) => {
      setLoadingGeoFence(true);
      
  
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
  
          const distance = calculateDistance(
            latitude,
            longitude,
            data.area.center.coordinates[0],
            data.area.center.coordinates[1]
          );
  
          const isWithinGeoFence = distance <= data.area.radius;
          setIsInGeoFence(isWithinGeoFence);
  
          if (!isWithinGeoFence) {
            setGeoFenceError(
              "Cannot make attendance as you are not in geofencing. Kindly come into geofencing and try again."
            );
          } else {
            setGeoFenceError("");
          }
  
          setLoadingGeoFence(false);
        },
        (error) => {
          console.error("Error fetching live location:", error);
          setLoadingGeoFence(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
  
      return () => {
        if (watchId !== undefined) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    },

    onError: (error) => {
      if (error?.response?.data?.message === "No GeoCircle found for this employee.") {
        setGeoFenceError(
          "Cannot make attendance as you are not added in any geo fence to make attendence make contact with hr and add yourself in geo fence area."
        );
        setLoadingGeoFence(false);
        return;
      }
    }
  })


  const handleActivityChange = (event, newActivity) => {
    if (newActivity) setActivity(newActivity)
  }

  const takePicture = async () => {
    if (window.location.pathname.includes("/selfi-attendance")) {
      if (!isInGeoFence) {
        setGeoFenceError(
          "Cannot make attendance as you are not in geofencing. Kindly come into geofencing and try again.",
        )
        return
      }
    }

    setGeoFenceError("") // Clear any previous error
    setLoading(true)
    setImageCaptured(true)
    const width = 640
    const height = 480
    const photo = photoRef.current
    const video = videoRef.current
    photo.width = width
    photo.height = height
    const ctx = photo.getContext("2d")
    ctx.drawImage(video, 0, 0, photo.width, photo.height)
    const dataUrl = photo.toDataURL("image/png")
    const imgBlob = await (await fetch(dataUrl)).blob()
    try {
      await compareFaces(imgBlob, activity)
    } catch (error) {
      console.error("Error during face comparison:", error)
    } finally {
      setLoading(false)
    }
  }

  const compareFaces = async (capturedImage, activity) => {
    if (!(capturedImage instanceof Blob)) {
      console.error("Captured image is not a valid Blob.")
      return
    }
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("image", capturedImage, "captured-image.png")
      formData.append("organizationId", orgId)
      formData.append("activity", activity)
      formData.append("employeeId", activity)

      const response = await axios.post(
        window.location.pathname.includes("/selfi-attendance")
          ? `${process.env.REACT_APP_API}/route/face-model/compare-employee-fd`
          : `${process.env.REACT_APP_API}/route/face-model/compare-organization`,
        formData,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      if (!response.data.success) {
        setFaceComparisonError(response.data.message || "Face match failed!") // Set face comparison error
        setEmployeeName("")
      } else {
        console.log("Face match successful!")
        console.log("Attendance:", response.data.attendance)
        if (window.location.pathname.includes("/selfi-attendance")) {
          setEmployeeName(`Attendance successfully marked for ${activity === "Punch In" ? "Arrival" : "Departure"}`)
        } else {
          setEmployeeName(`${response.data.employee.first_name} ${response.data.employee.last_name}`)
        }
        setFaceComparisonError("") // Clear any previous face comparison error
      }
    } catch (error) {
      console.error("Error comparing faces:", error)
      setFaceComparisonError(error?.response?.data?.message) // Set face comparison error
      setEmployeeName("")
    } finally {
      setIsUploading(false)
      // clearImage() 
    }
  }


  const clearImage = () => {
    const photo = photoRef.current
    const ctx = photo.getContext("2d")
    ctx.clearRect(0, 0, photo.width, photo.height)
    setImageCaptured(false)
    setEmployeeName("")
    setFaceComparisonError("")
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 w-full max-w-md mx-auto" noValidate>
      {/* Toggle Buttons - Only visible on  mobile screens */}
      {showToggleOnMobile && (
        <div className="lg:hidden w-full">
          <ToggleButtonGroup
            value={activity}
            exclusive
            onChange={handleActivityChange}
            aria-label="Punch Activity"
            className="w-full"
            sx={{
              "& .MuiToggleButton-root": {
                flex: 1,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                borderColor: "#e5e7eb",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                backgroundColor: "#3b82f6",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              },
              "& .MuiToggleButtonGroup-grouped": {
                margin: "0 4px",
                "&:not(:first-of-type)": {
                  borderRadius: "0.5rem",
                },
                "&:first-of-type": {
                  borderRadius: "0.5rem",
                },
              },
            }}
          >
            <ToggleButton value="Punch In">Punch In</ToggleButton>
            <ToggleButton value="Punch Out">Punch Out</ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}

      {/* Camera View */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200">
        <video
          ref={videoRef}
          autoPlay
          onLoadedData={() => setVideoReady(true)}
          className={`w-full h-full object-cover ${imageCaptured ? "hidden" : ""}`}
          id="client-video"
        ></video>
        {employeeOrgId?.employee?.faceRecognition && (
          <FaceDetectionLoader isLoading={isFaceDetectionLoading || loading} />
        )}
        <canvas ref={photoRef} className={`w-full h-full ${!imageCaptured ? "hidden" : ""}`} id="client-photo" />
      </div>

      {/* Geofence Error */}
      {window.location.pathname.includes("/selfi-attendance") && geoFenceError && (
        <div className="text-center font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {geoFenceError}
        </div>
      )}

      {/* Face Comparison Error */}
      {faceComparisonError && (
        <div className="text-center font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {faceComparisonError}
        </div>
      )}

      {/* Employee Name or Attendance Success Message */}
      {employeeName && (
        <div className="text-center font-medium text-green-600 bfg-green-50 p-3 rounded-lg border border-green-200">
          {employeeName}
        </div>
      )}

      {/* Loading Geofence Status */}
      {window.location.pathname.includes("/selfi-attendance") && loadingGeoFence && (
        <div className="text-center font-medium text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <span>Checking location...</span>
        </div>
      )}

      {/* Action Buttons */}

        <div className="flex w-full justify-between gap-3">
          <Button
            onClick={clearImage}
            variant="contained"
            color="error"
            disabled={!imageCaptured || (window.location.pathname.includes("/selfi-attendance") && loadingGeoFence)}
            sx={{
              borderRadius: "0.5rem",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
              },
            }}
          >
            Clear
          </Button>
          <Button
            onClick={takePicture}
            variant="contained"
            disabled={imageCaptured || (window.location.pathname.includes("/selfi-attendance") && loadingGeoFence)}
            sx={{
              borderRadius: "0.5rem",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              backgroundColor: "#3b82f6",
              "&:hover": {
                backgroundColor: "#2563eb",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
              },
            }}
          >
            Capture
          </Button>
          <Button
            onClick={() => compareFaces(imageCaptured, activity)}
            variant="contained"
            color="success"
            disabled={!imageCaptured || (window.location.pathname.includes("/selfi-attendance") && loadingGeoFence)}
            sx={{
              borderRadius: "0.5rem",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
              },
            }}
          >
            {isUploading ? <CircularProgress size={20} style={{ color: "white" }} /> : activity}
          </Button>
        </div>
    </form>
  )
}

export default PhotoCaptureForm
