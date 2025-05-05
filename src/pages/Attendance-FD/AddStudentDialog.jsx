// import React, { useState } from "react";
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ErrorMessage } from "@hookform/error-message";
// import axios from "axios";
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
//     .instanceof(File, "Please upload a valid image.")
//     .refine((file) => file && file.size <= 5 * 1024 * 1024, "File size should be less than 5MB")
//     .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Only JPEG or PNG images are allowed."),
// });

// const AddStudentDialog = ({ open, onClose, zoneId, authToken, handleAlert, queryClient }) => {
//   const [loading, setLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [openStudentModal, setOpenStudentModal] = useState(false);


//   const { control, handleSubmit, formState: { errors }, reset } = useForm({
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

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(URL.createObjectURL(file));
//       try {
//         const uploadedImageUrl = await uploadStudentImage(file);
//         setImageUrl(uploadedImageUrl);
//       } catch (error) {
//         console.error("Image upload failed:", error.message);
//       }
//     }
//   };

//   const uploadStudentImage = async (file) => {
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
//       await axios.put(url, file, { headers: { "Content-Type": file.type } });
//       return url.split("?")[0];
//     } catch (error) {
//       console.error("Image upload failed:", error.message);
//       throw new Error("Failed to upload the image.");
//     }
//   };

//   const handleAddStudent = async (formData) => {
//     setLoading(true);
//     try {
//       if (!imageUrl) {
//         setLoading(false);
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
//         onClose();
//         await queryClient.invalidateQueries(["getStudents"]);
//         handleAlert(true, "success", "Student added successfully!");
//       } else {
//         return handleAlert(true, "error", response.data.error || "Server error. Please try again.");
//       }
//     } catch (error) {
//       console.error("Failed to add student:", error.message);
//       handleAlert(true, "error", "Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
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
//   );
// };

// export default AddStudentDialog;
