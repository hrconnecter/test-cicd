/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import AuthInputFiled from "../InputFileds/AuthInputFiled";
import { useFormContext } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const DynamicExpenseFields = ({ category, control }) => {
  console.log("Rendering fields for category:", category);

  const { watch } = useFormContext();
  const isRemotePunchingAllowance = watch("isRemotePunchingAllowance");

  if (!category?.dynamicFields?.length) return null;
  // Helper function to format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Function to determine if a field should be hidden
  const shouldHideField = (fieldName) => {
    // Hide Travel Source and Travel Destination when Remote Punching Allowance is enabled
    if (isRemotePunchingAllowance && category.name === "Travel") {
      return fieldName === "travelSource" || fieldName === "travelDestination";
    }
    return false;
  };

  // Function to render time picker for check-in and check-out times
  const renderTimeField = (field, fieldName) => {
    return (
      <Controller
        name={`dynamicFields.${field.fieldName}`}
        control={control}
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formatFieldName(field.fieldName)}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <TimePicker
                value={value ? new Date(`2022-01-01T${value}`) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    const hours = newValue
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const minutes = newValue
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    onChange(`${hours}:${minutes}`);
                  } else {
                    onChange("");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    placeholder={`Select ${formatFieldName(field.fieldName)}`}
                    className="bg-white"
                  />
                )}
              />
            </div>
          </LocalizationProvider>
        )}
      />
    );
  };

  // Group fields by type for better organization
  const getFieldGroups = () => {
    if (category.name === "Travel") {
      return [
        {
          title: "Basic Travel Information",
          fields: category.dynamicFields.filter(
            (field) =>
              [
                "transportationType",
                "travelSource",
                "travelDestination",
              ].includes(field.fieldName)
            // ['travelMedium', 'travelSource', 'travelDestination'].includes(field.fieldName)
          ),
        },
        {
          title: "Project & Transportation Details",
          fields: category.dynamicFields.filter((field) =>
            ["clientProjectName", "ticketNumber", "travelClass"].includes(
              field.fieldName
            )
          ),
        },
      ];
    } else if (category.name === "Hotel") {
      return [
        {
          title: "Hotel Information",
          fields: category.dynamicFields.filter((field) =>
            ["hotelName", "hotelAddress"].includes(field.fieldName)
          ),
        },
        {
          title: "Stay Details",
          fields: category.dynamicFields.filter((field) =>
            [
              "checkInDate",
              "checkOutDate",
              "checkInTime",
              "checkOutTime",
              "numberOfNights",
              "roomType",
            ].includes(field.fieldName)
          ),
        },
      ];
    } else if (category.name === "Food") {
      return [
        {
          title: "Restaurant Information",
          fields: category.dynamicFields.filter((field) =>
            ["restaurantName", "mealType", "restaurantAddress"].includes(
              field.fieldName
            )
          ),
        },

        // {
        //   title: 'Attendee Information',
        //   fields: category.dynamicFields.filter(field =>
        //     ['numberOfAttendees', 'attendeeDetails'].includes(field.fieldName)
        //   )
        // }
      ];
    }

    // For custom categories or fallback, return all fields in one group
    return [{ title: "Category Details", fields: category.dynamicFields }];
  };

  const fieldGroups = getFieldGroups();

  // Filter out empty groups
  const nonEmptyGroups = fieldGroups.filter((group) => group.fields.length > 0);

  // If we have no groups with fields, just render all fields without grouping
  if (nonEmptyGroups.length === 0 && category.dynamicFields.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {category.dynamicFields
          .filter((field) => !shouldHideField(field.fieldName))
          // .map((field) => (
          .map((field) =>
            field.fieldName === "checkInTime" ||
            field.fieldName === "checkOutTime" ? (
              renderTimeField(field, field.fieldName)
            ) : (
              <AuthInputFiled
                key={field._id || field.fieldName}
                control={control}
                name={`dynamicFields.${field.fieldName}`}
                label={formatFieldName(field.fieldName)}
                type={field.fieldType}
                required={field.required}
                options={
                  field.fieldType === "select"
                    ? field.options?.map((opt) => ({ label: opt, value: opt }))
                    : undefined
                }
              />
            )
          )}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {nonEmptyGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="border-t pt-4 first:border-t-0 first:pt-0"
        >
          <h3 className="text-md font-medium text-gray-700 mb-3">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {group.fields
              .filter((field) => !shouldHideField(field.fieldName))
              // .map((field) => (
              .map((field) =>
                field.fieldName === "checkInTime" ||
                field.fieldName === "checkOutTime" ? (
                  renderTimeField(field, field.fieldName)
                ) : (
                  <AuthInputFiled
                    key={field._id || field.fieldName}
                    control={control}
                    name={`dynamicFields.${field.fieldName}`}
                    label={formatFieldName(field.fieldName)}
                    type={field.fieldType}
                    required={field.required}
                    isClearable={true}
                    options={
                      field.fieldType === "select"
                        ? field.options?.map((opt) => ({
                            label: opt,
                            value: opt,
                          }))
                        : undefined
                    }
                  />
                )
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicExpenseFields;
