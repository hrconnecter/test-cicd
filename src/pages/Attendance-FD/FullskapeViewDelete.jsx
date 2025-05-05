
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import axios from "axios";
// import React, { useState, useContext } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useQuery, useQueryClient } from "react-query";
// import { ErrorMessage } from '@hookform/error-message'; 
// // import useStudentListStore from "./useStudentListStore";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { TestContext } from "../../State/Function/Main";
// import FullskapeTableComponent from "./FullskapeTable";
// import useAuthToken from "../../hooks/Token/useAuth";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";


// const StudentSchema = z.object({
//   name: z
//     .string()
//     .min(1, "Student Name is required")
//     .max(50, "Student Name cannot exceed 50 characters"),
//   parentPhoneNumber: z
//     .string()
//     .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
//   parentEmail: z.string().email("Enter a valid email address"),
//   division: z
//     .string()
//     .min(1, "Division is required")
//     .max(10, "Division cannot exceed 10 characters"),
//   PRN: z
//     .string()
//     .regex(/^[A-Za-z0-9]{5,15}$/, "Enter a valid PRN (5-15 alphanumeric characters)"),
//   studentPhoneNumber: z
//     .string()
//     .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
//   class: z
//     .string()
//     .min(1, "Class is required")
//     .max(10, "Class cannot exceed 10 characters"),
//   studentImage: z
//     .instanceof(File, "Please upload a valid image.") // Ensure it's a File object
//     .refine((file) => file && file.size <= 5 * 1024 * 1024, "File size should be less than 5MB") // Limit file size
//     .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Only JPEG or PNG images are allowed."), // Restrict file types
// });

// // Fetch added employee in geofence area
// const fetchAddedStudents = async (zoneId) => {
//   const { data } = await axios.get(
//     `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
//   );
//   console.log("fetchAddedEmployee", data);
//   return data?.data;
// };

// const FullskapeViewDelete = ({ onClose, zoneId }) => {
//   const { register, setValue, watch } = useForm();
//   // const { incrementPage, decrementPage, employeeList, page } = useStudentListStore();

//   const [openStudentModal, setOpenStudentModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [ setLocalStudents] = useState([]);
//   const [imageUrl, setImageUrl] = useState(null);
//   const { handleAlert } = useContext(TestContext);

//   const [loading, setLoading] = useState(false); // Add loading state


//   const queryClient = useQueryClient();

//   const onSubmit = (data) => {
//     const selected = Object.entries(data).reduce((acc, [key, value]) => {
//       if (value !== false) {
//         acc[key] = value;
//       }
//       return acc;
//     }, {});
//     // const selectedId = Object.keys(selected).filter((key) => key !== "selectAll");
//     // addEmployeeToCircleMutate({ zoneId, employeeId: selectedId, onClose });
//     console.log(selected);
    
//   };

//   // Handle file change for image upload
//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(URL.createObjectURL(file)); // Preview the image
//       try {
//         const uploadedImageUrl = await uploadStudentImage(file); // Upload and get the URL
//         setImageUrl(uploadedImageUrl); // Store the URL for the payload
//       } catch (error) {
//         console.error("Image upload failed:", error.message);
//       }
//     }
//   };

//   const authToken = useAuthToken();

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       name: "",
//       parentPhoneNumber: "",
//       parentEmail: "",
//       studentPhoneNumber: "",
//       class: "",
//       division: "",
//       PRN: "",
//     },
//     resolver: zodResolver(StudentSchema),
//   });

//   const uploadStudentImage = async (file) => {
//     if (!file) {
//       throw new Error("No file provided for upload.");
//     }

//     try {
//       const { data: { url } } = await axios.get(
//         `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         }
//       );

//       await axios.put(url, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       return url.split("?")[0];
//     } catch (error) {
//       console.error("Image upload failed:", error.message);
//       throw new Error("Failed to upload the image.");
//     }
//   };

//   const handleAddStudent = async (formData) => {
//     setLoading(true); // Start loading
//     try {
//       if (!imageUrl) {
//         setLoading(false); // Stop loading
//         return handleAlert(true, "warning", "Student image is required.");
//       }
  
//       const payload = { ...formData, imageUrl };
  
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
//         payload,
//         { headers: { Authorization: authToken } }
//       );
  
//       if (response.data.success) {
//         reset();
//         setSelectedImage(null);
//         setImageUrl(null);
//         setOpenStudentModal(false);
  
//         await queryClient.invalidateQueries(["getStudents"]);
//         handleAlert(true, "success", "Student added successfully!");
//       } else {
//         const backendError = response.data.error;
//         if (backendError === "No face detected in the image.") {
//           return handleAlert(true, "error", "No face detected in the uploaded image. Please try again with a clear image.");
//         } else {
//           return handleAlert(true, "error", "Server error. Please try again.");
//         }
//       }
//     } catch (error) {
//       console.error("Failed to add student:", error.message);
  
//       if (error.response?.data?.error) {
//         const backendError = error.response.data.error;
//         if (backendError === "No face detected in the image.") {
//           return handleAlert(true, "error", "No face detected in the uploaded image. Please try again with a clear image.");
//         } else if (backendError === "Student with this PRN already exists.") {
//           return handleAlert(true, "error", "Student with this PRN already exists.");
//         }
//       }
  
//       return handleAlert(true, "error", "Server error. Please try again.");
//     } finally {
//       setLoading(false); // Stop loading after API call
//     }
//   };
//   // const {students} = useGetStudents(zoneId);

//   const { data: students } = useQuery(
//     ["addedStudents", zoneId],
//     () => fetchAddedStudents(zoneId),
//     {
//       enabled: !!zoneId,
//       onSuccess: (data) => console.log("Fetched addedStudents:", data),
//     }
//   );

 

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="flex gap-4 flex-col overflow-scroll"
//     >
//       <div className="flex flex-col gap-4  overflow-auto h-auto">
//         <FullskapeTableComponent
//           register={register}
//           setValue={setValue}
//           watch={watch}
//           addedEmployee={students}
//           zoneId={zoneId}
//           openStudentModal ={openStudentModal}
//           setOpenStudentModal = {setOpenStudentModal}
//         />
//       </div>
//       {/* <div className="flex flex-row-reverse items-center">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenStudentModal(true)}
//         >
//           Add Student
//         </Button>
       
//       </div> */}
      

//       <Dialog
//         open={openStudentModal}
//         onClose={() => setOpenStudentModal(false)}
//       >
//         <DialogTitle>Add Student</DialogTitle>
//         <form onSubmit={handleSubmit(handleAddStudent)}>
//           <DialogContent>
//             {/* Input Fields */}
//             <AuthInputFiled
//               name="name"
//               control={control}
//               type="text"
//               placeholder="Student Name"
//               label="Student Name *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="parentPhoneNumber"
//               control={control}
//               type="text"
//               placeholder="Parent's Contact Number"
//               label="Parent's Contact Number *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="parentEmail"
//               control={control}
//               type="email"
//               placeholder="Parent's Email"
//               label="Parent's Email *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="studentPhoneNumber"
//               control={control}
//               type="text"
//               placeholder="Student's Contact Number"
//               label="Student's Contact Number *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="class"
//               control={control}
//               type="text"
//               placeholder="Class"
//               label="Class *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="division"
//               control={control}
//               type="text"
//               placeholder="Division"
//               label="Division *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="PRN"
//               control={control}
//               type="text"
//               placeholder="PRN"
//               label="PRN *"
//               errors={errors}
//             />
//           <div className="space-y-1">
//           <label className="font-semibold text-gray-500 text-md">
//             Upload Student Image *
//           </label>
//           <Controller
//             control={control}
//             name="studentImage"
//             render={({ field }) => (
//               <div
//                 className={`${
//                   selectedImage ? "border-blue-500" : "border-gray-200"
//                 } flex rounded-md items-center px-2 bg-white py-1 border-[.5px]`}
//               >
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png"
//                   id="studentImage"
//                   className="border-none bg-white w-full outline-none px-2"
//                   onChange={(e) => {
//                     handleImageChange(e); // Handle image change and upload
//                     field.onChange(e.target.files[0]); // Update form field value
//                   }}
//                 />
//               </div>
//             )}
//           />

//           <div className="h-4 w-[200px]">
//             <ErrorMessage
//               errors={errors}
//               name="studentImage"
//               render={({ message }) => (
//                 <p className="text-sm text-red-500">{message}</p>
//               )}
//             />
//           </div>
//         </div>

//           </DialogContent>
//           <DialogActions>
//             <Button 
//             style={{ width: '25vw' }} 
//             onClick={() => setOpenStudentModal(false)} 
//             disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button 
//             style={{ width: '25vw' }} 
//             type="submit" 
//             variant="contained" 
//             disabled={loading}
//             >
//               Add
//             </Button>
//           </DialogActions>
//         </form>

//       </Dialog>
//     </form>
//   );
// };

// export default FullskapeViewDelete;
