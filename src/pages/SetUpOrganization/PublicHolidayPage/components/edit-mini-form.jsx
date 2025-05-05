/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { zodResolver } from "@hookform/resolvers/zod";
import { BeachAccess, HolidayVillage } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import usePublicHoliday from "./usePublicHoliday";
import { TestContext } from "../../../../State/Function/Main";
 
const EditHolidayMiniForm = ({ onClose, itemData }) => {
  const { locations, data } = usePublicHoliday();
 
  const {handleAlert} = useContext(TestContext)
 
 
  const formSchema = z.object({
    holidayName: z.string(),
    holidayDate: z.string(),
    holidayType: z.enum(["Optional", "Mandatory"]),
    holidayRegion: z.array(z.object({
      label: z.string().optional(),
      value: z.string().optional(),
    })),
  });
 
  const { editPublicHoliday } = usePublicHoliday();
 
  const { handleSubmit, control, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      holidayName: itemData?.name,
      holidayDate: moment(itemData?.date).format("YYYY-MM-DD"),
      holidayType: itemData?.type,
      holidayRegion: Array.isArray(itemData?.location) ? itemData?.location?.map(i => ({
       
        label: i?.shortName,
        value: i?._id,
      })) : [itemData?.location],
    },
  });
 
 
 
  const { errors, isDirty } = formState;
 
  const onSubmit = async (data) => {
    const dataMain = {
      name: data.holidayName,
      date: data.holidayDate,
      type: data.holidayType,
      location: data.holidayRegion?.map(val => val?.value),
    };
    editPublicHoliday({
      data: dataMain,
      onClose,
      selectedHolidayId: itemData._id,
    });

    // handleAlert(true , "success" , "Holiday Updated Successfully")
  };
  const isHoliday = (date) => {
    // Ensure date is a Date object
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate)) {
      console.error("Invalid date provided to isHoliday");
      return false;
    }
 
    // Convert the date to be checked to the start of the day in local time for accurate comparison
    // Adjust the holiday date to the start of the day in local time before comparison
    return data.some((holiday) => {
      const holidayDateLocal = new Date(holiday.date).toLocaleDateString();
      const dateLocal = validDate.toLocaleDateString();
      return holidayDateLocal === dateLocal;
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthInputFiled
        name="holidayName"
        icon={BeachAccess}
        control={control}
        type="text"
        placeholder="Holiday Name"
        label="Holiday Name *"
        errors={errors}
        error={errors.holidayName}
      />
      <AuthInputFiled
        name="holidayDate"
        icon={HolidayVillage}
        control={control}
        type="date"
        placeholder="Holiday Date"
        label="Holiday Date *"
        errors={errors}
        error={errors.holidayDate}
        shouldDisableDate={isHoliday}
      />
      <AuthInputFiled
        name="holidayType"
        icon={HolidayVillage}
        control={control}
        type="selectItem"
        placeholder="Holiday Type"
        label="Holiday Type *"
        errors={errors}
        error={errors.holidayType}
        options={[
          { value: "Optional", label: "Optional" },
          { value: "Mandatory", label: "Mandatory" },
        ]}
      />
      <AuthInputFiled
        name="holidayRegion"
        icon={HolidayVillage}
        control={control}
        type="select"
        isMulti={true}
        placeholder="Holiday Region"
        label="Holiday Region *"
        errors={errors}
        error={errors.holidayRegion}
        options={locations?.map((location) => ({
          value: location._id,
          label: location.shortName,
        }))}
      />
      <Button
        fullWidth
        disabled={!isDirty}
        type="submit"
        variant="contained"
        color="primary"
      >
        Add Holiday
      </Button>
    </form>
  );
};
 
export default EditHolidayMiniForm;