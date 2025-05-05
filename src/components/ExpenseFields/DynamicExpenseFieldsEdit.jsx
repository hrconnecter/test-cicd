/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect } from 'react';
// import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// const DynamicExpenseFields = ({ 
//   category, 
//   register, 
//   setValue, 
//   getValues, 
//   errors,
//   watch
// }) => {
//   const dynamicFields = category?.dynamicFields || [];
//   const dynamicFieldValues = watch('dynamicFields') || {};
  
//   // Initialize dynamic fields with existing values
//   useEffect(() => {
//     if (category && dynamicFields.length > 0) {
//       console.log("Setting up dynamic fields for category:", category.name);
      
//       // Initialize dynamicFields object if it doesn't exist
//       if (!getValues('dynamicFields')) {
//         setValue('dynamicFields', {});
//       }
      
//       const currentValues = getValues('dynamicFields') || {};
//       console.log("Current dynamic field values:", currentValues);
      
//       // For each field in the category, ensure it exists in the form values
//       dynamicFields.forEach(field => {
//         const fieldName = field.fieldName;
        
//         // Only set default value if the field doesn't exist yet
//         if (currentValues[fieldName] === undefined) {
//           // Initialize with empty value based on field type
//           let defaultValue;
//           switch (field.fieldType) {
//             case 'number':
//               defaultValue = '';
//               break;
//             case 'date':
//               defaultValue = null;
//               break;
//             case 'select':
//               defaultValue = '';
//               break;
//             default:
//               defaultValue = '';
//           }
          
//           console.log(`Initializing field ${fieldName} with default value:`, defaultValue);
//           setValue(`dynamicFields.${fieldName}`, defaultValue);
//         } else {
//           console.log(`Field ${fieldName} already has value:`, currentValues[fieldName]);
//         }
//       });
//     }
//   }, [category, dynamicFields, setValue, getValues]);
  
//   // Log when dynamic field values change
//   useEffect(() => {
//     console.log("Dynamic field values updated:", dynamicFieldValues);
//   }, [dynamicFieldValues]);

//   if (!category || !dynamicFields.length) {
//     return null;
//   }

//   const handleDateChange = (fieldName, date) => {
//     console.log(`Setting date field ${fieldName} to:`, date);
//     setValue(`dynamicFields.${fieldName}`, date);
//   };

//   const handleSelectChange = (fieldName, event) => {
//     console.log(`Setting select field ${fieldName} to:`, event.target.value);
//     setValue(`dynamicFields.${fieldName}`, event.target.value);
//   };

//   const handleTextChange = (fieldName, event) => {
//     console.log(`Setting text field ${fieldName} to:`, event.target.value);
//     setValue(`dynamicFields.${fieldName}`, event.target.value);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//       {dynamicFields.map((field) => {
//         const fieldName = field.fieldName;
//         const isRequired = field.required;
//         const fieldLabel = fieldName
//           .replace(/([A-Z])/g, ' $1')
//           .replace(/^./, str => str.toUpperCase())
//           .trim();
        
//         // Get current value
//         const fieldValue = dynamicFieldValues[fieldName];
        
//         switch (field.fieldType) {
//           case 'text':
//             return (
//               <div key={fieldName}>
//                 <TextField
//                   fullWidth
//                   label={fieldLabel}
//                   required={isRequired}
//                   value={fieldValue || ''}
//                   onChange={(e) => handleTextChange(fieldName, e)}
//                   error={!!errors?.dynamicFields?.[fieldName]}
//                   helperText={errors?.dynamicFields?.[fieldName]?.message}
//                   variant="outlined"
//                   size="small"
//                   className="mb-4"
//                 />
//               </div>
//             );
            
//           case 'number':
//             return (
//               <div key={fieldName}>
//                 <TextField
//                   fullWidth
//                   label={fieldLabel}
//                   required={isRequired}
//                   type="number"
//                   value={fieldValue || ''}
//                   onChange={(e) => handleTextChange(fieldName, e)}
//                   error={!!errors?.dynamicFields?.[fieldName]}
//                   helperText={errors?.dynamicFields?.[fieldName]?.message}
//                   variant="outlined"
//                   size="small"
//                   className="mb-4"
//                 />
//               </div>
//             );
            
//           case 'date':
//             return (
//               <div key={fieldName}>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label={fieldLabel}
//                     value={fieldValue ? new Date(fieldValue) : null}
//                     onChange={(date) => handleDateChange(fieldName, date)}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         fullWidth
//                         required={isRequired}
//                         error={!!errors?.dynamicFields?.[fieldName]}
//                         helperText={errors?.dynamicFields?.[fieldName]?.message}
//                         variant="outlined"
//                         size="small"
//                         className="mb-4"
//                       />
//                     )}
//                   />
//                 </LocalizationProvider>
//               </div>
//             );
            
//           case 'select':
//             return (
//               <div key={fieldName}>
//                 <FormControl 
//                   fullWidth 
//                   required={isRequired}
//                   error={!!errors?.dynamicFields?.[fieldName]}
//                   size="small"
//                   className="mb-4"
//                 >
//                   <InputLabel>{fieldLabel}</InputLabel>
//                   <Select
//                     value={fieldValue || ''}
//                     onChange={(e) => handleSelectChange(fieldName, e)}
//                     label={fieldLabel}
//                   >
//                     {field.options?.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors?.dynamicFields?.[fieldName] && (
//                     <FormHelperText>{errors.dynamicFields[fieldName].message}</FormHelperText>
//                   )}
//                 </FormControl>
//               </div>
//             );
            
//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// };

// export default DynamicExpenseFields;



import React, { useEffect } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DynamicExpenseFields = ({ 
  category, 
  register, 
  setValue, 
  getValues, 
  errors,
  watch
}) => {
  const dynamicFields = category?.dynamicFields || [];
  const dynamicFieldValues = watch('dynamicFields') || {};
  
  // Initialize dynamic fields with existing values
  useEffect(() => {
    if (category && dynamicFields.length > 0) {
      console.log("Setting up dynamic fields for category:", category.name);
      
      // Initialize dynamicFields object if it doesn't exist
      if (!getValues('dynamicFields')) {
        setValue('dynamicFields', {});
      }
      
      const currentValues = getValues('dynamicFields') || {};
      console.log("Current dynamic field values:", currentValues);
      
      // For each field in the category, ensure it exists in the form values
      dynamicFields.forEach(field => {
        const fieldName = field.fieldName;
        
        // Register each dynamic field with react-hook-form
        register(`dynamicFields.${fieldName}`);
        
        // Only set default value if the field doesn't exist yet
        if (currentValues[fieldName] === undefined) {
          // Initialize with empty value based on field type
          let defaultValue;
          switch (field.fieldType) {
            case 'number':
              defaultValue = '';
              break;
            case 'date':
              defaultValue = null;
              break;
            case 'select':
              defaultValue = '';
              break;
            default:
              defaultValue = '';
          }
          
          console.log(`Initializing field ${fieldName} with default value:`, defaultValue);
          setValue(`dynamicFields.${fieldName}`, defaultValue);
        } else {
          console.log(`Field ${fieldName} already has value:`, currentValues[fieldName]);
        }
      });
    }
  }, [category, dynamicFields, setValue, getValues, register]);
  
  // Log when dynamic field values change
  useEffect(() => {
    console.log("Dynamic field values updated:", dynamicFieldValues);
    console.log("Current form values:", getValues());
  }, [dynamicFieldValues, getValues]);

  if (!category || !dynamicFields.length) {
    return null;
  }

  const handleDateChange = (fieldName, date) => {
    console.log(`Setting date field ${fieldName} to:`, date);
    setValue(`dynamicFields.${fieldName}`, date);
    // Log updated form values for debugging
    console.log("Updated form values after date change:", getValues());
  };

  const handleSelectChange = (fieldName, event) => {
    console.log(`Setting select field ${fieldName} to:`, event.target.value);
    setValue(`dynamicFields.${fieldName}`, event.target.value);
    // Log updated form values for debugging
    console.log("Updated form values after select change:", getValues());
  };

  const handleTextChange = (fieldName, event) => {
    console.log(`Setting text field ${fieldName} to:`, event.target.value);
    setValue(`dynamicFields.${fieldName}`, event.target.value);
    // Log updated form values for debugging
    console.log("Updated form values after text change:", getValues());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {dynamicFields.map((field) => {
        const fieldName = field.fieldName;
        const isRequired = field.required;
        const fieldLabel = fieldName
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        // Get current value
        const fieldValue = dynamicFieldValues[fieldName];
        
        switch (field.fieldType) {
          case 'text':
            return (
              <div key={fieldName}>
                <TextField
                  fullWidth
                  label={fieldLabel}
                  required={isRequired}
                  value={fieldValue || ''}
                  onChange={(e) => handleTextChange(fieldName, e)}
                  error={!!errors?.dynamicFields?.[fieldName]}
                  helperText={errors?.dynamicFields?.[fieldName]?.message}
                  variant="outlined"
                  size="small"
                  className="mb-4"
                />
              </div>
            );
            
          case 'number':
            return (
              <div key={fieldName}>
                <TextField
                  fullWidth
                  label={fieldLabel}
                  required={isRequired}
                  type="number"
                  value={fieldValue || ''}
                  onChange={(e) => handleTextChange(fieldName, e)}
                  error={!!errors?.dynamicFields?.[fieldName]}
                  helperText={errors?.dynamicFields?.[fieldName]?.message}
                  variant="outlined"
                  size="small"
                  className="mb-4"
                />
              </div>
            );
            
          case 'date':
            return (
              <div key={fieldName}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={fieldLabel}
                    value={fieldValue ? new Date(fieldValue) : null}
                    onChange={(date) => handleDateChange(fieldName, date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required={isRequired}
                        error={!!errors?.dynamicFields?.[fieldName]}
                        helperText={errors?.dynamicFields?.[fieldName]?.message}
                        variant="outlined"
                        size="small"
                        className="mb-4"
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            );
            
          case 'select':
            return (
              <div key={fieldName}>
                <FormControl 
                  fullWidth 
                  required={isRequired}
                  error={!!errors?.dynamicFields?.[fieldName]}
                  size="small"
                  className="mb-4"
                >
                  <InputLabel>{fieldLabel}</InputLabel>
                  <Select
                    value={fieldValue || ''}
                    onChange={(e) => handleSelectChange(fieldName, e)}
                    label={fieldLabel}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.dynamicFields?.[fieldName] && (
                    <FormHelperText>{errors.dynamicFields[fieldName].message}</FormHelperText>
                  )}
                </FormControl>
              </div>
            );
            
          case 'datetime':
            return (
              <div key={fieldName}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={fieldLabel}
                    value={fieldValue ? new Date(fieldValue) : null}
                    onChange={(date) => handleDateChange(fieldName, date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required={isRequired}
                        error={!!errors?.dynamicFields?.[fieldName]}
                        helperText={errors?.dynamicFields?.[fieldName]?.message}
                        variant="outlined"
                        size="small"
                        className="mb-4"
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicExpenseFields;
