// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//     // Add more departments as required
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//       // Add other sub-options as necessary
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["ID", "Name", "Email", "Phone Number", "Address"],
//       policies: ["Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//       // Add more checkbox options as necessary
//     }),
//     []
//   );

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     // Reset checkboxes and sub-options when department changes
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption"); // Clear subOption field when department changes
//       setCheckboxOptions([]); // Clear checkboxes when department changes
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     // Set checkboxes based on the selected sub-option
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     console.log("Submitted data:", data);
//     // Send data to backend here
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report "
//           />

//           {/* <div className="w-full bg-white p-6"> */}

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             autoComplete="off"
//             className="flex w-full flex-col gap-1"
//           >

//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>
//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-2 ">
//                 <label className="font-medium">Select fieled to include in your report</label>
//                 {checkboxOptions.map((option, index) => (
//                   <div key={index} className="flex items-center ">
//                     <input className="transform scale-100"
//                       type="checkbox"
//                       value={option}
//                       {...control.register("checkboxes")}
//                       id={option}
//                     />
//                     <label htmlFor={option} className="ml-2">
//                       {option}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {/* Submit and Cancel Buttons */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               {/* <BasicButton
//                 variant="outlined"
//                 title="Cancel"
//                 onClick={() => {}}
//               /> */}
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//     // Add more departments as required
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//       // Add other sub-options as necessary
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["Document Name", "Employee Name", "Email Address", "Phone Number", "Address"],
//       policies: ["Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//       // Add more checkbox options as necessary
//     }),
//     []
//   );

//   // Checkbox label-to-backend value mapping
//   const checkboxMapping = {
//     "Document Name": "doc_name",
//     "Employee Name": "emp_name",
//     "Email Address": "email",
//     "Phone Number": "phone_number",
//     "Address": "address",
//     // Add more mappings as necessary
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     // Reset checkboxes and sub-options when department changes
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption"); // Clear subOption field when department changes
//       setCheckboxOptions([]); // Clear checkboxes when department changes
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     // Set checkboxes based on the selected sub-option
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map the selected checkboxes to the backend values
//     const backendData = {
//       ...data,
//       checkboxes: data.checkboxes.map((item) => checkboxMapping[item] || item), // Convert frontend labels to backend values
//     };
//     console.log("Submitted data:", backendData);
//     // Send backendData to the server (you can replace this with your API call)
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             autoComplete="off"
//             className="flex w-full flex-col gap-1"
//           >
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>
//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-2 ">
//                 <label className="font-medium">Select fields to include in your report</label>
//                 {checkboxOptions.map((option, index) => {
//                   const backendValue = checkboxMapping[option];

//                   return (
//                     <div key={index} className="flex items-center ">
//                       <Controller
//                         name="checkboxes" // Form field name
//                         control={control}
//                         render={({ field }) => (
//                           <div>
//                             <input
//                               type="checkbox"
//                               id={option}
//                               value={backendValue} // Send backend value
//                               {...field} // Spread the controller's field properties
//                               className="transform scale-100"
//                             />
//                             <label htmlFor={option} className="ml-2">
//                               {option} {/* Display frontend label */}
//                             </label>
//                           </div>
//                         )}
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//     // Add more departments as required
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["Document Name", "Email", "Phone Number", "Address"],
//       policies: ["Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Mapping frontend display values to backend keys
//   const checkboxMapping = {
//     "Document Name": "doc_name",
//     "Email": "email",
//     "Phone":"p1",
//     "Phone Number": "phone_number",
//     "Address": "address",
//     "Name": "name",
//     "Zone 1": "zone_1",
//     "1":"10"
//     // Add other mappings as necessary
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map frontend values (checkbox labels) to backend keys
//     const mappedData = {
//       ...data,
//       checkboxes: data.checkboxes.map((field) => checkboxMapping[field]),
//     };

//     console.log("Submitted data:", mappedData);
//     // Send data to backend here
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report "
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-2">
//                 <label className="font-medium">Select fields to include in your report</label>
//                 {checkboxOptions.map((option, index) => (
//                   <div key={index} className="flex items-center">
//                     <input
//                       className="transform scale-100"
//                       type="checkbox"
//                       value={option}
//                       {...control.register("checkboxes")}
//                       id={option}
//                     />
//                     <label htmlFor={option} className="ml-2">
//                       {option}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["Document Name","Name", "Email", "Phone Number", "Address"],
//       policies: ["Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Contextual Mapping for checkboxes based on sub-option
//   const getCheckboxMapping = (subOption) => {
//     if (subOption === "document") {
//       return {
//         "Document Name": "na",  // Map "Document Name" to "na"
//         "Name":"omkar",
//         "Email": "email",
//         "Phone Number": "phone_number",
//         "Address": "address",
//       };
//     }

//     if (subOption === "policies") {
//       return {
//         "Name": "akash",  // Map "Name" in Policies to "nam"
//         "Email": "email",
//         "Phone": "phone",
//       };
//     }

//     // Add more sub-option cases if necessary
//     return {};
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map frontend values (checkbox labels) to backend keys based on sub-option
//     const mappedData = {
//       ...data,
//       checkboxes: data.checkboxes.map((field) => getCheckboxMapping(subOptionValue)[field]),
//     };

//     console.log("Mapped data for submission:", mappedData);
//     // Send mapped data to backend here
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-2">
//                 <label className="font-medium">Select fields to include in your report</label>
//                 {checkboxOptions.map((option, index) => (
//                   <div key={index} className="flex items-center">
//                     <input
//                       className="transform scale-100"
//                       type="checkbox"
//                       value={option}
//                       {...control.register("checkboxes")}
//                       id={option}
//                     />
//                     <label htmlFor={option} className="ml-2">
//                       {option}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["First Name","Last Name", "Email","Document Name","Department Name","Phone","Location","Company Email","Gender",],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name":"first_name",
//       "Last Name":"last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name":"departmentName",
//       "Phone":"phone_number",
//       "Location":"worklocation",
//       "Company Email":"companyemail",
//       "Gender":"gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map selected checkboxes to backend keys with unique mapping per subOption
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option); // true if selected, false if not
//       }
//       return acc;
//     }, {});

//     // Combine all the selected data into a final object to send to the backend
//     const finalDataToSend = {
//       department: data.department.value,    // Send the selected department
//       subOption: data.subOption.value,      // Send the selected sub-option
//       checkboxes: checkboxesWithTrueFalse,  // Send the checkbox selections (true/false)
//     };

//     console.log("Data to send to backend:", finalDataToSend);
//     // Send finalDataToSend to the backend here, for example via an API call
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-2">
//                 <label className="font-medium">Select fields to include in your report</label>
//                 {checkboxOptions.map((option, index) => (
//                   <div key={index} className="flex items-center">
//                     <input
//                       className="transform scale-100"
//                       type="checkbox"
//                       value={option}
//                       {...control.register("checkboxes")}
//                       id={option}
//                     />
//                     <label htmlFor={option} className="ml-2">
//                       {option}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { useParams } from "react-router-dom";

// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../../State/Function/Main";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   // Zod schema
//   // const user = getCurrentUser();
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);
//  console.log(orgId);
//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["First Name","Last Name", "Email","Document Name","Department Name","Phone","Location","Company Email","Gender"],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name":"first_name",
//       "Last Name":"last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name":"departmentName",
//       "Phone":"phone_number",
//       "Location":"worklocation",
//       "Company Email":"companyemail",
//       "Gender":"gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map selected checkboxes to backend keys with unique mapping per subOption
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option); // true if selected, false if not
//       }
//       return acc;
//     }, {});

//     // Combine all the selected data into a final object to send to the backend
//     const finalDataToSend = {
//       department: data.department.value,    // Send the selected department
//       subOption: data.subOption.value,      // Send the selected sub-option
//       checkboxes: checkboxesWithTrueFalse,  // Send the checkbox selections (true/false)
//       organisationId:orgId
//     };

//       // Mutation to update notification count
//         const mutation = useMutation(
//             ({ employeeId, punchId }) => {
//                 return axios.patch(
//                     `${process.env.REACT_APP_API}/route//MisReport/add/${orgId}`,
//                     { notificationCount: 0, selectedPunchId: punchId },
//                     {
//                         headers: {
//                             Authorization: useAuthToken,
//                         },
//                     }
//                 );
//             },
//             {
//                 onSuccess: () => {
//                     // Refetch the punch notifications after updating notification count
//                     handleAlert(true, "error", data.message);
//                 },
//                 onError: (error) => {
//                     console.error("Error updating notification count:", error);
//                 },
//             }
//         );

//     console.log("Data to send to backend:", finalDataToSend);
//     // Send finalDataToSend to the backend here, for example via an API call
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {/* Checkbox Selection for Sub-options */}
// {subOptionValue && checkboxOptions.length > 0 && (
//   <div className="flex flex-col gap-4 mb-4">
//     {/* Title Section */}
//     <div className=" font-semibold text-gray-500 text-md ">
//       Select fields to include in your report
//     </div>

//     {/* Checkboxes in two columns */}
//     <div className="flex gap-4 pl-2">
//       {/* First Column: Display first 7 checkboxes */}
//       <div className="w-1/3">
//         {checkboxOptions.slice(0, 7).map((option, index) => (
//           <div key={index} className="flex items-center text-xl mb-2">
//             <input
//               className="transform scale-125"
//               type="checkbox"
//               value={option}
//               {...control.register("checkboxes")}
//               id={option}
//             />
//             <label htmlFor={option} className="ml-2">
//               {option}
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* Second Column: Display next set of checkboxes (7 to 14) */}
//       <div className="w-1/3">
//         {checkboxOptions.slice(7, 14).map((option, index) => (
//           <div key={index} className="flex items-center text-xl mb-2">
//             <input
//               className="transform scale-125"
//               type="checkbox"
//               value={option}
//               {...control.register("checkboxes")}
//               id={option}
//             />
//             <label htmlFor={option} className="ml-2">
//               {option}
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )}

//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { useParams } from "react-router-dom";

// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../../State/Function/Main";
// import { useMutation } from "react-query";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);

//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["First Name", "Last Name", "Email", "Document Name", "Department Name", "Phone", "Location", "Company Email", "Gender"],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name": "first_name",
//       "Last Name": "last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name": "departmentName",
//       "Phone": "phone_number",
//       "Location": "worklocation",
//       "Company Email": "companyemail",
//       "Gender": "gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Get the auth token at the top level of the component
//   const authToken = useAuthToken();

//   // Handle form submission
//   const onSubmit = (data) => {
//     // Map selected checkboxes to backend keys with unique mapping per subOption
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option); // true if selected, false if not
//       }
//       return acc;
//     }, {});

//     // Combine all the selected data into a final object to send to the backend
//     const finalDataToSend = {
//       department: data.department.value,    // Send the selected department
//       subOption: data.subOption.value,      // Send the selected sub-option
//       checkboxes: checkboxesWithTrueFalse,  // Send the checkbox selections (true/false)
//       organisationId: orgId,                // Include the organisation ID
//     };

//     // Mutation to update notification count
//     mutation.mutate(finalDataToSend);  // Pass finalDataToSend to the mutation function
//   };

//   // Mutation hook to send data to the backend
//   const mutation = useMutation(
//     (finalData) => {
//       return axios.post(
//         `${process.env.REACT_APP_API}/route/MisReport/add/${orgId}`,
//         finalData,  // Send finalData to the backend
//         {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         }
//       );
//     },
//     {
//       onSuccess: (data) => {
//         handleAlert(true, "success", "success");
//       },
//       onError: (error) => {
//         console.error("Error:", error);
//         handleAlert(true, "error", "Failed");
//       },
//     }
//   );

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Department Selection */}
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {/* Sub-option Selection */}
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {/* Checkbox Selection for Sub-options */}
//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className=" font-semibold text-gray-500 text-md ">
//                   Select fields to include in your report
//                 </div>
//                 <div className="flex gap-4 pl-2">
//                   {/* First Column: Display first 7 checkboxes */}
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(0, 7).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Second Column: Display next set of checkboxes */}
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(7, 14).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useQuery, useMutation } from "react-query";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../../State/Function/Main";

// // Define the schema using Zod for validation
// const MISchema = z.object({
//   department: z.object({
//     label: z.string().nonempty({ message: "Department is required" }),
//     value: z.string().nonempty({ message: "Value is required" }),
//   }),
//   subOption: z.object({
//     label: z.string(),
//     value: z.string(),
//   }),
//   checkboxes: z.array(z.string()).optional(),
// });

// const SetupMis = () => {
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField, // This will help to reset the checkboxes field when needed
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: ["First Name", "Last Name", "Email", "Document Name", "Department Name", "Phone", "Location", "Company Email", "Gender"],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name": "first_name",
//       "Last Name": "last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name": "departmentName",
//       "Phone": "phone_number",
//       "Location": "worklocation",
//       "Company Email": "companyemail",
//       "Gender": "gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Get the auth token at the top level of the component
//   const authToken = useAuthToken();

//   // Define the fetchMISRecord function
//   const fetchMISRecord = async (organisationId) => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/MisReport/get/${organisationId}`,
//       {
//         headers: {
//           Authorization:  `${authToken}`,
//         },
//       }
//     );
//     return response.data;
//   };

//   // Use `useQuery` to fetch the MIS record data
//   const { data, isLoading, error } = useQuery(
//     ["misRecord", orgId],  // Cache key based on orgId
//     () => fetchMISRecord(orgId),  // Fetch data using the fetchMISRecord function
//     {
//       enabled: !!orgId,  // Only run query if orgId is available
//     }
//   );

//   // Handle form submission
//   const onSubmit = (data) => {
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option); // true if selected, false if not
//       }
//       return acc;
//     }, {});

//     const finalDataToSend = {
//       department: data.department.value,    // Send the selected department
//       subOption: data.subOption.value,      // Send the selected sub-option
//       checkboxes: checkboxesWithTrueFalse,  // Send the checkbox selections (true/false)
//       organisationId: orgId,                // Include the organisation ID
//     };

//     // Mutation to update notification count
//     mutation.mutate(finalDataToSend);
//   };

//   // Mutation hook to send data to the backend
//   const mutation = useMutation(
//     (finalData) => {
//       return axios.post(
//         `${process.env.REACT_APP_API}/route/MisReport/add/${orgId}`,
//         finalData,
//         {
//           headers: {
//             Authorization:  `${authToken}`,
//           },
//         }
//       );
//     },
//     {
//       onSuccess: (data) => {
//         handleAlert(true, "success", "success");
//       },
//       onError: (error) => {
//         console.error("Error:", error);
//         handleAlert(true, "error", "Failed");
//       },
//     }
//   );

//   // Handle loading, error, and success states for the fetched data
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className=" font-semibold text-gray-500 text-md ">
//                   Select fields to include in your report
//                 </div>
//                 <div className="flex gap-4 pl-2">
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(0, 7).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="w-1/3">
//                     {checkboxOptions.slice(7, 14).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { useQuery, useMutation } from "react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// // Define the schema using Zod for validation
// const MISchema = z.object({
//   department: z.object({
//     label: z.string().nonempty({ message: "Department is required" }),
//     value: z.string().nonempty({ message: "Value is required" }),
//   }),
//   subOption: z.object({
//     label: z.string(),
//     value: z.string(),
//   }),
//   checkboxes: z.array(z.string()).optional(),
// });

// const SetupMis = () => {
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField,
//     setValue, // Use setValue to update form state
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [], // Default checkboxes empty
//     },
//   });

//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Fetch MIS data to prefill previously selected data
//   const { data, isLoading, error } = useQuery(
//     ["misRecord", orgId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/MisReport/get/${orgId}`,
//         {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: !!orgId,
//     }
//   );

//   useEffect(() => {
//     // Prefill the checkboxes when data is fetched
//     if (data?.data?.length > 0) {
//       const fetchedData = data.data[0]; // Assuming only one record
//       setValue("department", { value: fetchedData.department, label: fetchedData.department });
//       setValue("subOption", { value: fetchedData.subOption, label: fetchedData.subOption });

//       // Set the previously selected checkboxes
//       const selectedCheckboxes = Object.keys(fetchedData.checkboxes || {});
//       setValue("checkboxes", selectedCheckboxes);
//     }
//   }, [data, setValue]);

//   // Handle form submission
//   const onSubmit = (formData) => {
//     // Build the final data to send to the API
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = formData.checkboxes.includes(option); // true if selected, false if not
//       }
//       return acc;
//     }, {});

//     const finalDataToSend = {
//       department: formData.department.value, // Send the selected department
//       subOption: formData.subOption.value, // Send the selected sub-option
//       checkboxes: checkboxesWithTrueFalse, // Send the checkbox selections (true/false)
//       organisationId: orgId, // Include the organisation ID
//     };

//     mutation.mutate(finalDataToSend);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Mis Record"
//             info="Choose the fields you want to include in your report"
//           />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//                 error={errors.department}
//               />

//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                   error={errors.subOption}
//                 />
//               )}
//             </div>

//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className=" font-semibold text-gray-500 text-md">
//                   Select fields to include in your report
//                 </div>
//                 <div className="flex gap-4 pl-2">
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(0, 7).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="w-1/3">
//                     {checkboxOptions.slice(7, 14).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../../State/Function/Main";
// import { useMutation } from "react-query";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);

//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField,
//     setValue,
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: [
//         "First Name",
//         "Last Name",
//         "Email",
//         "Document Name",
//         "Department Name",
//         "Phone",
//         "Location",
//         "Company Email",
//         "Gender",
//       ],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name": "first_name",
//       "Last Name": "last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name": "departmentName",
//       "Phone": "phone_number",
//       "Location": "worklocation",
//       "Company Email": "companyemail",
//       "Gender": "gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Get the auth token at the top level of the component
//   const authToken = useAuthToken();

//   // Fetch the MIS data and pre-select checkboxes
//   useEffect(() => {
//     const fetchMisData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/MisReport/get/${orgId}`, {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         });
//         const misData = response.data.data;
//         console.log("MIS Data:", misData);

//         const currentMisRecord = misData.find(
//           (record) => record.department === departmentValue && record.subOption === subOptionValue

//         );
//         console.log("Current MIS Record:", currentMisRecord);

//         if (currentMisRecord) {
//           const checkboxValues = Object.keys(currentMisRecord.checkboxes).filter(
//             (key) => currentMisRecord.checkboxes[key] === true
//           );
//           console.log("Checkbox values", checkboxValues);

//           resetField("checkboxes");
//           setValue("checkboxes", checkboxValues);
//         }
//       } catch (error) {
//         console.error("Error fetching MIS data", error);
//       }
//     };

//     fetchMisData();
//   }, [orgId, departmentValue, subOptionValue, authToken, resetField, setValue]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option);
//       }
//       return acc;
//     }, {});

//     const finalDataToSend = {
//       department: data.department.value,
//       subOption: data.subOption.value,
//       checkboxes: checkboxesWithTrueFalse,
//       organisationId: orgId,
//     };

//     mutation.mutate(finalDataToSend);
//   };

//   const mutation = useMutation(
//     (finalData) => {
//       return axios.post(
//         `${process.env.REACT_APP_API}/route/MisReport/add/${orgId}`,
//         finalData,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );
//     },
//     {
//       onSuccess: (data) => {
//         handleAlert(true, "success", "Success");
//       },
//       onError: (error) => {
//         console.error("Error:", error);
//         handleAlert(true, "error", "Failed");
//       },
//     }
//   );

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo heading="Mis Record" info="Choose the fields you want to include in your report" />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//               />
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                 />
//               )}
//             </div>

//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className=" font-semibold text-gray-500 text-md ">Select fields to include in your report</div>
//                 <div className="flex gap-4 pl-2">
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(0, 7).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(7, 14).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import Setup from "../../SetUpOrganization/Setup";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../../State/Function/Main";
// import { useMutation } from "react-query";

// // Define the schema using Zod for validation
// const SetupMis = () => {
//   const orgId = useParams().organisationId;
//   const { handleAlert } = useContext(TestContext);

//   const MISchema = z.object({
//     department: z.object({
//       label: z.string().nonempty({ message: "Department is required" }),
//       value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     subOption: z.object({
//       label: z.string(),
//       value: z.string(),
//     }),
//     checkboxes: z.array(z.string()).optional(),
//   });

//   // useForm hook
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     resetField,
//     setValue,
//   } = useForm({
//     resolver: zodResolver(MISchema),
//     defaultValues: {
//       department: undefined,
//       subOption: undefined,
//       checkboxes: [],
//     },
//   });

//   // Options for departments
//   const departments = [
//     { label: "Department", value: "department" },
//     { label: "Performance", value: "performance" },
//     { label: "GeoFencing", value: "geoFencing" },
//     { label: "Record", value: "record" },
//   ];

//   // UseMemo to initialize sub-options based on department selection
//   const subOptions = useMemo(
//     () => ({
//       record: [
//         { label: "Document uploaded by employee", value: "document" },
//         { label: "Policies", value: "policies" },
//         { label: "Letters", value: "letters" },
//       ],
//       geoFencing: [
//         { label: "Set Zones", value: "setZones" },
//         { label: "View Logs", value: "viewLogs" },
//       ],
//       performance: [
//         { label: "Organisation", value: "organisation" },
//         { label: "List", value: "list" },
//       ],
//     }),
//     []
//   );

//   // UseMemo to initialize checkboxes based on sub-option selection
//   const checkboxes = useMemo(
//     () => ({
//       document: [
//         "First Name",
//         "Last Name",
//         "Email",
//         "Document Name",
//         "Department Name",
//         "Phone",
//         "Location",
//         "Company Email",
//         "Gender",
//       ],
//       policies: ["First Name", "Email", "Phone"],
//       setZones: ["Zone 1", "Zone 2", "Zone 3"],
//       viewLogs: ["1"],
//       letters: ["1", "2", "3", "4", "5"],
//       organisation: ["A", "B", "C", "D"],
//       list: ["al", "om"],
//     }),
//     []
//   );

//   // Define a mapping for the user-friendly checkbox names to backend keys, unique per subOption
//   const checkboxMapping = {
//     document: {
//       "First Name": "first_name",
//       "Last Name": "last_name",
//       "Email": "email",
//       "Document Name": "selectedValue",
//       "Department Name": "departmentName",
//       "Phone": "phone_number",
//       "Location": "worklocation",
//       "Company Email": "companyemail",
//       "Gender": "gender",
//     },
//     policies: {
//       "Name": "POLICIES_NAME",
//       "Email": "POLICIES_EMAIL",
//       "Phone": "POLICIES_PHONE",
//     },
//     setZones: {
//       "Zone 1": "ZONE_1",
//       "Zone 2": "ZONE_2",
//       "Zone 3": "ZONE_3",
//     },
//     viewLogs: {
//       "1": "LOG_1",
//     },
//     letters: {
//       "1": "LETTER_1",
//       "2": "LETTER_2",
//       "3": "LETTER_3",
//       "4": "LETTER_4",
//       "5": "LETTER_5",
//     },
//     organisation: {
//       "A": "ORG_A",
//       "B": "ORG_B",
//       "C": "ORG_C",
//       "D": "ORG_D",
//     },
//     list: {
//       "al": "LIST_AL",
//       "om": "LIST_OM",
//     },
//   };

//   // State management for dynamic sub-options and checkboxes
//   const [subOptionsList, setSubOptionsList] = useState([]);
//   const [checkboxOptions, setCheckboxOptions] = useState([]);

//   // Watch the department and subOption values
//   const departmentValue = watch("department")?.value;
//   const subOptionValue = watch("subOption")?.value;

//   // Whenever department or sub-option changes, update the form state
//   useEffect(() => {
//     if (departmentValue) {
//       setSubOptionsList(subOptions[departmentValue] || []);
//       resetField("subOption");
//       setCheckboxOptions([]);
//     }
//   }, [departmentValue, subOptions, resetField]);

//   useEffect(() => {
//     if (subOptionValue && checkboxes[subOptionValue]) {
//       setCheckboxOptions(checkboxes[subOptionValue]);
//     }
//   }, [subOptionValue, checkboxes]);

//   // Get the auth token at the top level of the component
//   const authToken = useAuthToken();

//   // Fetch the MIS data and pre-select checkboxes
//   useEffect(() => {
//     const fetchMisData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/MisReport/get/${orgId}`, {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         });
//         const misData = response.data.data;

//         // Find the current MIS record based on department and sub-option
//         const currentMisRecord = misData.find(
//           (record) => record.department === departmentValue && record.subOption === subOptionValue
//         );

//         if (currentMisRecord) {
//           const selectedCheckboxes = Object.keys(currentMisRecord.checkboxes).filter(
//             (key) => currentMisRecord.checkboxes[key] === true
//           );

//           // Map selectedCheckboxes to the display options
//           const selectedCheckboxDisplayNames = selectedCheckboxes.map((checkboxKey) => {
//             const checkboxName = Object.keys(checkboxMapping[subOptionValue] || {}).find(
//               (key) => checkboxMapping[subOptionValue][key] === checkboxKey
//             );
//             return checkboxName;
//           });

//           // Set the selected checkboxes in the form
//           resetField("checkboxes");
//           setValue("checkboxes", selectedCheckboxDisplayNames);
//         }
//       } catch (error) {
//         console.error("Error fetching MIS data", error);
//       }
//     };

//     fetchMisData();
//   }, [orgId, departmentValue, subOptionValue, authToken, resetField, setValue]);

//   // Handle form submission
//   const onSubmit = (data) => {
//     const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
//       const backendKey = checkboxMapping[subOptionValue]?.[option];
//       if (backendKey) {
//         acc[backendKey] = data.checkboxes.includes(option);
//       }
//       return acc;
//     }, {});

//     const finalDataToSend = {
//       department: data.department.value,
//       subOption: data.subOption.value,
//       checkboxes: checkboxesWithTrueFalse,
//       organisationId: orgId,
//     };

//     mutation.mutate(finalDataToSend);
//   };

//   const mutation = useMutation(
//     (finalData) => {
//       return axios.post(
//         `${process.env.REACT_APP_API}/route/MisReport/add/${orgId}`,
//         finalData,
//         {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         }
//       );
//     },
//     {
//       onSuccess: (data) => {
//         handleAlert(true, "success", "Success");
//       },
//       onError: (error) => {
//         console.error("Error:", error);
//         handleAlert(true, "error", "Failed");
//       },
//     }
//   );

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo heading="Mis Record" info="Choose the fields you want to include in your report" />

//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex w-full flex-col gap-1">
//             <div className="grid grid-cols-2 gap-4">
//               <AuthInputFiled
//                 name="department"
//                 control={control}
//                 type="select"
//                 placeholder="Select Department"
//                 label="Select Your Module *"
//                 options={departments}
//                 errors={errors}
//               />
//               {departmentValue && (
//                 <AuthInputFiled
//                   name="subOption"
//                   control={control}
//                   type="select"
//                   placeholder="Select Report Type"
//                   label="Select Report Type *"
//                   options={subOptionsList}
//                   errors={errors}
//                 />
//               )}
//             </div>

//             {subOptionValue && checkboxOptions.length > 0 && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className=" font-semibold text-gray-500 text-md ">Select fields to include in your report</div>
//                 <div className="flex gap-4 pl-2">
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(0, 7).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="w-1/3">
//                     {checkboxOptions.slice(7, 14).map((option, index) => (
//                       <div key={index} className="flex items-center text-xl mb-2">
//                         <input
//                           className="transform scale-125"
//                           type="checkbox"
//                           value={option}
//                           {...control.register("checkboxes")}
//                           id={option}
//                         />
//                         <label htmlFor={option} className="ml-2">
//                           {option}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-4 w-full justify-start pt-4">
//               <BasicButton type="submit" title="Submit" />
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default SetupMis;
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import Setup from "../../SetUpOrganization/Setup";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import { TestContext } from "../../../State/Function/Main";
import { useMutation } from "react-query";

// Define the schema using Zod for validation
const SetupMis = () => {
  const orgId = useParams().organisationId;
  const { handleAlert } = useContext(TestContext);

  const MISchema = z.object({
    department: z.object({
      label: z.string().nonempty({ message: "Department is required" }),
      value: z.string().nonempty({ message: "Value is required" }),
    }),
    subOption: z.object({
      label: z.string(),
      value: z.string(),
    }),
    checkboxes: z.array(z.string()).optional(),
  });

  // useForm hook
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    resetField,
    setValue,
  } = useForm({
    resolver: zodResolver(MISchema),
    defaultValues: {
      department: undefined,
      subOption: undefined,
      checkboxes: [],
    },
  });

  // Options for departments
  const departments = [
    { label: "Department", value: "department" },
    { label: "Performance", value: "performance" },
    { label: "GeoFencing", value: "geoFencing" },
    { label: "Remote Punch", value: "remotepunch" },

    { label: "Record", value: "record" },
    { label: "Advance Salary", value: "advancesalary" },
    {label: "Loan Management", value: "loanmanagement" },
    { label: "Food And Catering", value: "foodandcatering" },
  ];

  // UseMemo to initialize sub-options based on department selection
  const subOptions = useMemo(
    () => ({
      record: [
        { label: "Document uploaded by employee", value: "document" },
        { label: "Policies And Procedure", value: "policies" },
        { label: "Letters", value: "letters" },
      ],

      foodandcatering: [
        { label: "Vendor Profile Report ", value: "vendorreports" },
        { label: "Employee Order Report ", value: "employeeorderreports" },
        { label: "Order Report", value: "orderreports" },
        { label: "Menu Report", value: "menureports" },
      ],

      advancesalary: [
        { label: "Advance Salary Report", value: "advancesalaryreport"}
      ],

      geoFencing: [
        { label: "Set Zones", value: "setZones" },
        { label: "View Logs", value: "viewLogs" },
      ],
      remotepunch: [
        { label: "Remote Pumch Report", value: "setRemotePunches" },
        
      ],

      loanmanagement:[
       
        { label: "Loan Type Report", value: "loantypereport" },
        { label: "Employee Loan Report", value: "loanemployeereport" },
      
      ],
      performance: [
        { label: "Organisation", value: "organisation" },
        { label: "List", value: "list" },
      ],
    }),
    []
  );

  // UseMemo to initialize checkboxes based on sub-option selection
  const checkboxes = useMemo(
    () => ({
      document: [
        "First Name",
        "Last Name",
        "Email",
        // "Document Name",
        "Department Name",
        "Phone",
        "Location",
        "Company Email",
        "Gender",
      ],
      policies: [
        "View Policies",
        "Applicable Date",
        "Updated Date",
        "Active Status",
      ],
      letters: [
        "Title",
        "View Letter",
        "Letter Status",
        "Employee Name",
        "Hr Name",
        "Manager Name",
        "Applicable Date",
        "Status",
      ],
      vendorreports: [
        "First Name",
        "Last Name",
        "Email",
        "Gender",
        // "Department Name",
        "Phone",
        "Location",
        "Company Name",
        "Bank Account Number",
        "Selected Frequency of Menu Update",
        // "Document Uploaded By Vendor",
        // "View Document",
        "Pan Card Number",
       
      ],
      orderreports: ["Company Name","Vendor Name","Total Orders Placed","Total Revenue Generated:","Top 3 Ordered Menu Items"],
      menureports:["Vendor Name","List Of Menu Items","Preparation Time","Price","Veg/Non-Veg","Cuisine Type","Available","Category"],
      employeeorderreports: ["Employee Name","Company Name","Vendor Name","Order Menu","Price","Quantity","Discount","Grand Total","Status","Placed At","Updated At","Rating","Review"],
      setRemotePunches:   ["Employee Name","Punch In Time","Punch Out Time","Distance Travelled","Status"],
      advancesalaryreport: ["Employee Name","Email","Total Salary","Advance Salary","No Of Month","Start Date","End Date","Status"],
      loantypereport: ["Loan Name","Minimum Loan Value","Maximum Loan Value","Rate Of Intrest"],
      loanemployeereport: ["Employee Name","Email","Loan Type","Rate Of Intrest","Loan Amount Applied","Disbursement Date","Completion Date","No of EMI","Loan Amount Paid Monthly","Total Deduction Montly","Loan Status"],
      setZones: ["Zone 1", "Zone 2", "Zone 3"],
      viewLogs: ["1"],

      organisation: ["A", "B", "C", "D"],
      list: ["al", "om"],
    }),
    []
  );

  // Memoize checkbox mapping to prevent unnecessary re-renders
  const checkboxMapping = useMemo(
    () => ({
      document: {
        "First Name": "first_name",
        "Last Name": "last_name",
        Email: "email",
        // "Document Name": "selectedValue",
        "Department Name": "departmentName",
        Phone: "phone_number",
        Location: "worklocation",
        "Company Email": "companyemail",
        Gender: "gender",
      },

      vendorreports: {
        "First Name": "first_name",
        "Last Name": "last_name",
        "Email": "email",
        // "Department Name": "departmentName",
        "Phone": "phone_number",
        "Gender": "gender",
        "Location": "address",
        "Company Name": "companyname",
        "Bank Account Number": "bank_account_no",
        "Selected Frequency of Menu Update": "selectedFrequency",
        // "Document Uploaded By Vendor": "selectedValue",
        // "View Document" : "url",
        "Pan Card Number": "pan_card_number",
      },

      orderreports: {
        "Company Name": "company_name",
        "Vendor Name": "vendor_name",
        "Total Orders Placed": "total_orders_placed",
        "Total Revenue Generated:": "total_revenue_generated",
        "Top 3 Ordered Menu Items": "top_3_ordered_menu_items",
      },

      menureports: {
        "Vendor Name": "vendor_name",
        "List Of Menu Items": "name",
        "Preparation Time": "preparationTime",
        "Price": "price",
        "Veg/Non-Veg": "isVeg",
        "Cuisine Type": "cuisineType",
        "Available": "available",
        "Category": "category"
      },

      employeeorderreports:{
        "Employee Name": "employee_name",
        "Company Name": "company_name",
        "Vendor Name": "vendor_name",
        "Order Menu": "name",
        "Price": "price",
        "Quantity":"quantity",
        "Discount": "discount",
        "Grand Total": "grandTotal",
        "Status": "status",
        "Placed At": "placedAt",
        "Updated At": "updatedAt",
        "Rating": "rating",
        "Review": "review",
      },

      policies: {
        "View Policies": "url",
        "Applicable Date": "applicableDate",
        "Updated Date": "updatedAt",
        "Active Status": "isActive",
      },

      letters: {
        "Title": "title",
        "View Letter": "url",
        "Letter Status": "docstatus",
        "Employee Name": "empidd",
        "Hr Name": "hrid",
        "Manager Name": "managerId",
        "Applicable Date": "applicableDate",
        "Status": "isActive",
      },

      setRemotePunches: {
        "Employee Name": "employee_name",
        "Punch In Time": "punch_in_time",
        "Punch Out Time": "punch_out_time",
        "Distance": "distance",
        "Distance Travelled": "distance_travelled",
        "Status": "status",
},

advancesalaryreport: {
       "Employee Name": "employee_name",
        "Email": "email",
        "Total Salary": "totalSalary",
        "Advance Salary": "advancedSalaryAmounts",
        "No Of Month": "noOfMonth",
        "Start Date": "advanceSalaryStartingDate",
        "End Date": "advanceSalaryEndingDate",
        "Status": "status",
},


loantypereport:{
        "Loan Name": "loanName",
        "Minimum Loan Value": "loanValue",
        "Maximum Loan Value": "maxLoanValue",
        "Rate Of Intrest": "rateOfInterest",

},

loanemployeereport:{
        "Employee Name": "employeeName",
        "Email": "email",
        "Loan Type": "loanType",
        "Rate Of Intrest": "rateOfInterest",
        "Loan Amount Applied": "loanAmount",
        "Disbursement Date": "loanDisbursementDate",
        "Completion Date": "loanCompletedDate",
        "No of EMI": "noOfEmi",
        "Loan Amount Paid Monthly": "totalDeduction",
        "Total Deduction Montly": "totalDeductionMonthly",
        "Loan Status": "loanStatus",
        },
    

      setZones: {
        "Zone 1": "ZONE_1",
        "Zone 2": "ZONE_2",
        "Zone 3": "ZONE_3",
      },
      viewLogs: {
        1: "LOG_1",
      },

      organisation: {
        A: "ORG_A",
        B: "ORG_B",
        C: "ORG_C",
        D: "ORG_D",
      },
      list: {
        al: "LIST_AL",
        om: "LIST_OM",
      },
    }),
    []
  );

  // State management for dynamic sub-options and checkboxes
  const [subOptionsList, setSubOptionsList] = useState([]);
  const [checkboxOptions, setCheckboxOptions] = useState([]);

  // Watch the department and subOption values
  const departmentValue = watch("department")?.value;
  const subOptionValue = watch("subOption")?.value;

  // Whenever department or sub-option changes, update the form state
  useEffect(() => {
    if (departmentValue) {
      setSubOptionsList(subOptions[departmentValue] || []);
      resetField("subOption");
      setCheckboxOptions([]);
    }
  }, [departmentValue, subOptions, resetField]);

  useEffect(() => {
    if (subOptionValue && checkboxes[subOptionValue]) {
      setCheckboxOptions(checkboxes[subOptionValue]);
    }
  }, [subOptionValue, checkboxes]);

  // Get the auth token at the top level of the component
  const authToken = useAuthToken();

  // Fetch the MIS data and pre-select checkboxes
  useEffect(() => {
    const fetchMisData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/MisReport/get/${orgId}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        const misData = response.data.data;

        // Find the current MIS record based on department and sub-option
        const currentMisRecord = misData.find(
          (record) =>
            record.department === departmentValue &&
            record.subOption === subOptionValue
        );

        if (currentMisRecord) {
          const selectedCheckboxes = Object.keys(
            currentMisRecord.checkboxes
          ).filter((key) => currentMisRecord.checkboxes[key] === true);

          // Map selectedCheckboxes to the display options
          const selectedCheckboxDisplayNames = selectedCheckboxes.map(
            (checkboxKey) => {
              const checkboxName = Object.keys(
                checkboxMapping[subOptionValue] || {}
              ).find(
                (key) => checkboxMapping[subOptionValue][key] === checkboxKey
              );
              return checkboxName;
            }
          );

          // Set the selected checkboxes in the form
          resetField("checkboxes");
          setValue("checkboxes", selectedCheckboxDisplayNames);
        }
      } catch (error) {
        console.error("Error fetching MIS data", error);
      }
    };

    fetchMisData();
  }, [
    orgId,
    departmentValue,
    subOptionValue,
    authToken,
    resetField,
    setValue,
    checkboxMapping,
  ]); // Add checkboxMapping here

  // Handle form submission
  const onSubmit = (data) => {
    const checkboxesWithTrueFalse = checkboxOptions.reduce((acc, option) => {
      const backendKey = checkboxMapping[subOptionValue]?.[option];
      if (backendKey) {
        acc[backendKey] = data.checkboxes.includes(option);
      }
      return acc;
    }, {});

    const finalDataToSend = {
      department: data.department.value,
      subOption: data.subOption.value,
      checkboxes: checkboxesWithTrueFalse,
      organisationId: orgId,
    };

    mutation.mutate(finalDataToSend);
  };

  const mutation = useMutation(
    (finalData) => {
      return axios.post(
        `${process.env.REACT_APP_API}/route/MisReport/add/${orgId}`,
        finalData,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        handleAlert(true, "success", "Record Updated Successfully");
      },
      onError: (error) => {
        console.error("Error:", error);
        handleAlert(true, "error", "Failed");
      },
    }
  );

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <HeadingOneLineInfo
            heading="Mis Record"
            info="Choose the fields you want to include in your report"
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex w-full flex-col gap-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <AuthInputFiled
                name="department"
                control={control}
                type="select"
                placeholder="Select Department"
                label="Select Your Module *"
                options={departments}
                errors={errors}
              />
              {departmentValue && (
                <AuthInputFiled
                  name="subOption"
                  control={control}
                  type="select"
                  placeholder="Select Report Type"
                  label="Select Report Type *"
                  options={subOptionsList}
                  errors={errors}
                />
              )}
            </div>

            {subOptionValue && checkboxOptions.length > 0 && (
              <div className="flex flex-col gap-4 mb-4">
                <div className=" font-semibold text-gray-500 text-md ">
                  Select fields to include in your report
                </div>
                <div className="flex gap-4 pl-2">
                  <div className="w-1/3">
                    {checkboxOptions.slice(0, 7).map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xl mb-2"
                      >
                        <input
                          className="transform scale-125"
                          type="checkbox"
                          value={option}
                          {...control.register("checkboxes")}
                          id={option}
                        />
                        <label htmlFor={option} className="ml-2">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3">
                    {checkboxOptions.slice(7, 14).map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xl mb-2"
                      >
                        <input
                          className="transform scale-125"
                          type="checkbox"
                          value={option}
                          {...control.register("checkboxes")}
                          id={option}
                        />
                        <label htmlFor={option} className="ml-2">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full justify-start pt-4">
              <BasicButton type="submit" title="Submit" />
            </div>
          </form>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default SetupMis;
