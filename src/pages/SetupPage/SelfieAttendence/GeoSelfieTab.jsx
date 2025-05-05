import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import * as z from "zod"
import { Tabs, Tab, Box } from "@mui/material"
import { useState as useReactState } from "react" // Avoid conflict with existing useState import
import FoundationModal from "./FoundationModal"
import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation"
import ReusableModal from "../../../components/Modal/component"
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled"
import { TestContext } from "../../../State/Function/Main"
import BasicButton from "../../../components/BasicButton"
import GeoFenceCard from "./GeoFenceCard"

// Validation Schema
const Foundationschema = z.object({
  geocheckInTime: z.string().optional(),
  geocheckOutTime: z.string().optional(),
  geoworkingHours1: z.string().optional(),
  geoworkingHours: z.union([
    z
      .string()
      .nonempty()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 24, {
        message: "Hours must be a number between 1 and 24",
      }),
    z.literal(""),
    z.undefined(),
  ]),
  organizationId: z.string().nonempty("Organization ID is required"),
  geohourlyWages: z.boolean().default(false),
})

export const fetchFoundationSetup = async (organizationId) => {
  const response = await fetch(`${process.env.REACT_APP_API}/route/foundation-setup/${organizationId}`)
  if (!response.ok) throw new Error("No setup found")
  return response.json()
}

const saveFoundationSetup = async (data) => {
  const response = await fetch(`${process.env.REACT_APP_API}/route/foundation-setup/${data.organizationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error("Failed to save settings")
  return response.json()
}

const GeoSelfieTab = () => {
  const { handleAlert } = useContext(TestContext)
  const queryClient = useQueryClient()
  const { id, organisationId } = useParams()
  const [openGeoFencing, setOpenGeoFencing] = React.useState(false)
  const organizationId = id || organisationId
  const { data: locationData } = useGetCurrentLocation()
  const [tabIndex, setTabIndex] = useReactState(0)

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const { data: existingSetup, isLoading } = useQuery(
    ["foundationSetup", organizationId],
    () => fetchFoundationSetup(organizationId),
    {
      enabled: !!organizationId,
      retryOnMount: false,
      retry: false,
    },
  )

  const mutation = useMutation({
    mutationFn: saveFoundationSetup,
    onSuccess: () => {
      queryClient.invalidateQueries(["foundationSetup", organizationId])
      handleAlert(true, "success", "Attendance settings saved successfully.")
    },
    onError: () => {
      handleAlert(true, "error", "Failed to save attendance settings.")
    },
  })

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Foundationschema),
    defaultValues: {
      geocheckInTime: "",
      geocheckOutTime: "",
      geoworkingHours: "",
      geoworkingHours1: "",
      organizationId: organizationId || "",
      geohourlyWages: existingSetup?.hourlyWages ?? false,
    },
  })

  const [selectedSection, setSelectedSection] = useState(() =>
    existingSetup?.checkInTime && existingSetup?.checkOutTime
      ? "section1"
      : existingSetup?.workingHours
        ? "section2"
        : "section1",
  )

  useEffect(() => {
    if (existingSetup) {
      setValue("geocheckInTime", existingSetup.checkInTime || "")
      setValue("geocheckOutTime", existingSetup.checkOutTime || "")
      setValue("geoworkingHours", existingSetup.workingHours != null ? existingSetup.workingHours.toString() : "")
      setValue("geohourlyWages", existingSetup.hourlyWages ?? false)

      if (existingSetup.checkInTime && existingSetup.checkOutTime) {
        setSelectedSection("section1")
      } else if (existingSetup.workingHours) {
        setSelectedSection("section2")
      } else {
        setSelectedSection("section1")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const geocheckInTime = watch("geocheckInTime")
  const geocheckOutTime = watch("geocheckOutTime")
  // const workingHours = watch("workingHours");
  const geoworkingHours1 = watch("geoworkingHours1")
  const geohourlyWages = watch("geohourlyWages")

  useEffect(() => {
    if (selectedSection === "section1") {
      setValue("geoworkingHours", "")
    } else {
      setValue("geocheckInTime", "")
      setValue("geocheckOutTime", "")
      setValue("geoworkingHours1", "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedSection === "section1" && geocheckInTime && geoworkingHours1) {
      const inTime = new Date(`2000-01-01T${geocheckInTime}`);
      const updatedOutTime = new Date(inTime.getTime() + Number(geoworkingHours1) * 60 * 60 * 1000);
      setValue("checkOutTime", updatedOutTime.toTimeString().slice(0, 5));
    }
  }, [geocheckInTime, geoworkingHours1, selectedSection, setValue]);
  
  useEffect(() => {
    if (selectedSection === "section1" && geocheckInTime && geocheckOutTime) {
      const inTime = new Date(`2000-01-01T${geocheckInTime}`);
      const outTime = new Date(`2000-01-01T${geocheckOutTime}`);
      const diffHours = (outTime - inTime) / (1000 * 60 * 60);
      setValue("geoworkingHours1", diffHours.toFixed(2)); // Keeping precision up to 2 decimal places
    }
  }, [geocheckInTime, geocheckOutTime, selectedSection, setValue]);
  

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      workingHours: data.workingHours ? Number(data.workingHours) : undefined,
      hourlyWages: data.geohourlyWages, // Ensure this is sent as a boolean
      organizationId,
    })
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Attendance Form" />
          <Tab label="Geo Fencing" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <div className="py-6 px-8 w-full">
        {tabIndex === 0 &&
          (isLoading ? (
            <p>Loading existing setup...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-4 mb-4">
                <label>
                  <input
                    type="radio"
                    value="section1"
                    checked={selectedSection === "section1"}
                    onChange={() => setSelectedSection("section1")}
                  />{" "}
                  Check In/Out Time
                </label>
                <label>
                  <input
                    type="radio"
                    value="section2"
                    checked={selectedSection === "section2"}
                    onChange={() => setSelectedSection("section2")}
                  />{" "}
                  Only Working Hours
                </label>
              </div>
              {/* Section 1 Inputs */}
              {selectedSection === "section1" && (
                <>
                  <AuthInputFiled
                    name="geocheckInTime"
                    control={control}
                    type="time"
                    label="Check-in Time"
                    errors={errors}
                  />
                  <AuthInputFiled
                    name="geocheckOutTime"
                    control={control}
                    type="time"
                    label="Check-out Time"
                    errors={errors}
                  />
                  <AuthInputFiled
                    name="geoworkingHours1"
                    control={control}
                    type="text"
                    label="Working Hours"
                    errors={errors}
                  />
                </>
              )}

              {/* Section 2 Inputs */}
              {selectedSection === "section2" && (
                <AuthInputFiled
                  name="geoworkingHours"
                  control={control}
                  type="text"
                  label="Working Hours"
                  errors={errors}
                />
              )}

              {/* Make hourlyWages checkbox always visible */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="geohourlyWages"
                  name="geohourlyWages"
                  {...register("hourlyWages")}
                  checked={geohourlyWages} // Ensures controlled input
                  onChange={(e) => setValue("geohourlyWages", e.target.checked)}

                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hourlyWages" className="ml-2 text-gray-700">
                  Hourly Wages
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <BasicButton title="Save Settings" type="submit" />
              </div>
            </form>
          ))}
        {tabIndex === 1 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">GeoFence</h2>
              <BasicButton title="Add Geo Fence" onClick={() => setOpenGeoFencing(true)} />
            </div>
            <div className="flex flex-wrap gap-4 overflow-auto py-4">
              {!existingSetup ? (
                <div className="w-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">No GeoFencing zones added</h3>
                    <p className="text-gray-500 mb-4">Kindly add the foundation setup first to add GeoFencing zones</p>
                    <BasicButton title="Setup Foundation" onClick={() => setTabIndex(0)} />
                  </div>
                </div>
              ) : !existingSetup.geoFencing || existingSetup.geoFencing.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">No Geo Fence Areas</h3>
                    <p className="text-gray-500 mb-4">
                      There are no geo fence areas defined yet. Add your first geo fence area.
                    </p>
                    <BasicButton title="Add Geo Fence Area" onClick={() => setOpenGeoFencing(true)} />
                  </div>
                </div>
              ) : (
                existingSetup.geoFencing.map((item, index) => <GeoFenceCard key={index} item={item} />)
              )}
            </div>
          </>
        )}
      </div>

      <ReusableModal
        open={openGeoFencing}
        heading={"Add Geo Fencing"}
        subHeading={"Here you can activate geofencing for a specific zone"}
        onClose={() => setOpenGeoFencing(false)}
      >
        <FoundationModal onClose={() => setOpenGeoFencing(false)} data={locationData} />
      </ReusableModal>
    </>
  )
}

export default GeoSelfieTab

