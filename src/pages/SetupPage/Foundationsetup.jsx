import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import * as z from "zod";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { TestContext } from "../../State/Function/Main";
import Setup from "../SetUpOrganization/Setup";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import GeoSelfieTab from "./SelfieAttendence/GeoSelfieTab";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import BasicButton from "../../components/BasicButton";

// Validation Schema
const Foundationschema = z.object({
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  workingHours1: z.string().optional(),
  workingHours: z
    .union([
      z.string().nonempty().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 24, {
        message: "Hours must be a number between 1 and 24",
      }),
      z.literal(""),
      z.undefined(),
    ]),
  organizationId: z.string().nonempty("Organization ID is required"),
  hourlyWages: z.boolean().default(false),
});


export const fetchFoundationSetup = async (organizationId) => {
  const response = await fetch(`${process.env.REACT_APP_API}/route/foundation-setup/${organizationId}`);
  if (!response.ok) throw new Error("No setup found");
  return response.json();
};

const saveFoundationSetup = async (data) => {
  const response = await fetch(`${process.env.REACT_APP_API}/route/foundation-setup/${data.organizationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to save settings");
  return response.json();
};

const FoundationSetup = () => {
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { id, organisationId } = useParams();
  const organizationId = id || organisationId;

  const { data } = useSubscriptionGet({
    organisationId
  });



  const { data: existingSetup, isLoading } = useQuery(["foundationSetup", organizationId], () => fetchFoundationSetup(organizationId), {
    enabled: !!organizationId,
  });

  const mutation = useMutation({
    mutationFn: saveFoundationSetup,
    onSuccess: () => {
      queryClient.invalidateQueries(["foundationSetup", organizationId]);
      handleAlert(true, "success", "Attendance settings saved successfully.");
    },
    onError: () => {
      handleAlert(true, "error", "Failed to save attendance settings.");
    },
  });

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
      checkInTime: "",
      checkOutTime: "",
      workingHours: "",
      workingHours1: "",
      organizationId: organizationId || "",
      hourlyWages: existingSetup?.hourlyWages ?? false,
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      workingHours: data.workingHours ? Number(data.workingHours) : undefined,
      hourlyWages: data.hourlyWages === true,
      organizationId,
    })
  }

  const [selectedSection, setSelectedSection] = useState(() =>
    existingSetup?.checkInTime && existingSetup?.checkOutTime
      ? "section1"
      : existingSetup?.workingHours
      ? "section2"
      : "section1"
  );
  
  useEffect(() => {
    if (existingSetup) {
      setValue("checkInTime", existingSetup.checkInTime || "");
      setValue("checkOutTime", existingSetup.checkOutTime || "");
      setValue("workingHours", existingSetup.workingHours != null ? existingSetup.workingHours.toString() : "");
      setValue("hourlyWages", existingSetup.hourlyWages ?? false);
  
      if (existingSetup.checkInTime && existingSetup.checkOutTime) {
        setSelectedSection("section1");
      } else if (existingSetup.workingHours) {
        setSelectedSection("section2");
      } else {
        setSelectedSection("section1");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  


  const checkInTime = watch("checkInTime");
  const checkOutTime = watch("checkOutTime");
  // const workingHours = watch("workingHours");
  const workingHours1 = watch("workingHours1");
  const hourlyWages = watch("hourlyWages");
  
  useEffect(() => {
    if (selectedSection === "section1") {
      setValue("workingHours", "");
    } else {
      setValue("checkInTime", "");
      setValue("checkOutTime", "");
      setValue("workingHours1", "");
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedSection === "section1" && checkInTime && workingHours1) {
      const inTime = new Date(`2000-01-01T${checkInTime}`);
      const updatedOutTime = new Date(inTime.getTime() + Number(workingHours1) * 60 * 60 * 1000);
      setValue("checkOutTime", updatedOutTime.toTimeString().slice(0, 5));
    }
  }, [checkInTime, workingHours1, selectedSection, setValue]);

  useEffect(() => {
    if (selectedSection === "section1" && checkInTime && checkOutTime) {
      const inTime = new Date(`2000-01-01T${checkInTime}`);
      const outTime = new Date(`2000-01-01T${checkOutTime}`);
      const diffHours = (outTime - inTime) / (1000 * 60 * 60);
      setValue("workingHours1", diffHours.toFixed(2)); // Keeping precision up to 2 decimal places
    }
  }, [checkInTime, checkOutTime, selectedSection, setValue]);



  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="flex items-center justify-between">

          <HeadingOneLineInfo
            className="!my-3"
            heading="Attendance Setup"
            info="Configure check-in and check-out times, working hours, and face recognition settings."
            />

           
            </div>
          <div className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            {isLoading ? (
              <p>Loading existing setup...</p>
            ) : (

              data?.organisation?.packages?.includes("Selfie punch geofencing") ?
              <GeoSelfieTab />
       
            
              :
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-4 mb-4">
                <label>
                  <input
                    type="radio"
                    value="section1"
                    checked={selectedSection === "section1"}
                    onChange={() => setSelectedSection("section1")}
                  /> Check In/Out Time
                </label>
                <label>
                  <input
                    type="radio"
                    value="section2"
                    checked={selectedSection === "section2"}
                    onChange={() => setSelectedSection("section2")}
                  /> Only Working Hours
                </label>
              </div>
            
              {/* Section 1 Inputs */}
              {selectedSection === "section1" && (
                <>
                  <AuthInputFiled name="checkInTime" control={control} type="time" label="Check-in Time" errors={errors} />
                  <AuthInputFiled name="checkOutTime" control={control} type="time" label="Check-out Time" errors={errors} />
                  <AuthInputFiled name="workingHours1" control={control} type="text" label="Working Hours" errors={errors} />
                </>
              )}
            
              {/* Section 2 Inputs */}
              {selectedSection === "section2" && (
                <AuthInputFiled name="workingHours" control={control} type="text" label="Working Hours" errors={errors} />
              )}
            
              {/* Make hourlyWages checkbox always visible */}
              <div className="flex items-center mt-4">
                   <input
                     type="checkbox"
                     id="hourlyWages"
                     {...register("hourlyWages")}
                     checked={hourlyWages} // Ensures controlled input
                     onChange={(e) => setValue("hourlyWages", e.target.checked)}
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

          
            )}
          </div>
        </div>
      </Setup>

    </BoxComponent>
  );
};


export default FoundationSetup;
