import React from "react";
import { Controller } from "react-hook-form";
import { TextField, Typography} from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";


const AuthInputField = ({
    label,
    name,
    type = "text",
    placeholder,
    control,
    errors,
    className = "",
  }) => {
    return (
      <div className={`flex items-center space-y-3 space-x-2 w-full ${className}`}>
        <label
          htmlFor={name}
          className="font-semibold text-gray-700 text-sm w-1/3 text-left pr-4 "
        >
          {label}
        </label>
        <div className="flex-1 ">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <TextField
                sx={{
                  "& .MuiInputBase-input": {
                    // Add your custom styles here
                    fontSize: "1rem", // Example: Adjust font size
                    color: "black", // Example: Adjust text color
                    padding : "8px",
borderColor:"#E7E7E7",
fontStyle:"italic"
                  },
                }}
                {...field}
                id={name}
                placeholder={placeholder}
                type={type}
                variant="outlined"
                fullWidth
                error={!!errors[name]}
              />
              
            )}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <Typography variant="caption" color="error">
                {message}
              </Typography>
            )}
          />
        </div>
      </div>
    );
  };
  

export default AuthInputField;
