/* eslint-disable no-unused-vars */
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiEmotions, LocationOn } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../../components/BasicButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const organizationSchema = z.object({
  isVisibleAttendanceCalenderGeo: z.boolean(),
  geoFencing: z.boolean(),
  faceRecognition: z.boolean(),
});

const MiniFormGeo = ({ data, mutate }) => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      isVisibleAttendanceCalenderGeo:
        data?.remotePunchingObject?.isVisibleAttendanceCalenderGeo || false,
      geoFencing: data?.remotePunchingObject?.geoFencing || false,
      faceRecognition: data?.remotePunchingObject?.faceRecognition || false,
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      allowanceQuantity: Number(formData.allowanceQuantity),
    };
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
        <AuthInputFiled
          name="geoFencing"
          icon={LocationOn}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing"
          label="Geo Fencing"
          errors={errors}
          error={errors.geoFencing}
          descriptionText={
            "Enabling Geo Fencing will allow the employee to punch in only from the allowed location."
          }
        />
        <AuthInputFiled
          name="isVisibleAttendanceCalenderGeo"
          icon={CalendarMonthIcon}
          control={control}
          type="checkbox"
          placeholder="Visible In Attendance Calender"
          label="Visible In Attendance Calender"
          errors={errors}
          error={errors.isVisibleAttendanceCalenderGeo}
          descriptionText={
            "Enabling then allow to show Geofencing and Remote Punching in Attendance Calender."
          }
        />
        <AuthInputFiled
          name="faceRecognition"
          icon={EmojiEmotions}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing Face Recognition"
          label="Geo Fencing Face Recognition"
          errors={errors}
          error={errors.faceRecognition}
          descriptionText={
            "Enabling Face Recognition will allow the employee to geo fencing in only after face recognition."
          }
        />
      </div>
      <div className="w-full flex justify-end">
        <BasicButton type="submit" title="Apply" />
      </div>
    </form>
  );
};

export default MiniFormGeo;
