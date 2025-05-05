import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestContext } from "../../State/Function/Main";
import FullskapeTableComponent from "./FullskapeTable";
import useAuthToken from "../../hooks/Token/useAuth";
import AuthInputField from "./Authinputfield";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";

const StudentSchema = z.object({
  name: z.string().min(1, "Student Name is required").max(50, "Student Name cannot exceed 50 characters"),
  parentPhoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  parentEmail: z.string().email("Enter a valid email address"),
  division: z
    .string()
    .min(1, "Division is required")
    .max(10, "Division cannot exceed 10 characters"),
  PRN: z
    .string()
    .regex(/^[A-Za-z0-9]{5,15}$/, "Enter a valid PRN (5-15 alphanumeric characters)"),
  studentPhoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  class: z
    .string()
    .min(1, "Class is required")
    .max(10, "Class cannot exceed 10 characters"),
  studentImage: z
    .instanceof(File, "Please upload a valid image.")
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "File size should be less than 5MB")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Only JPEG or PNG images are allowed."),
});

const FullskapeViewDelete = ({ onClose, zoneId }) => {
  const { register, setValue, watch } = useForm();
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false); // Loading state for image upload
  const { handleAlert } = useContext(TestContext);
  const [loading, setLoading] = useState(false); // Loading state for adding student
  const queryClient = useQueryClient();
  const authToken = useAuthToken();

  console.log(selectedImage);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      parentPhoneNumber: "",
      parentEmail: "",
      studentPhoneNumber: "",
      class: "",
      division: "",
      PRN: "",
    },
    resolver: zodResolver(StudentSchema),
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setLoadingImage(true);
      try {
        const uploadedImageUrl = await uploadStudentImage(file);
        setImageUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Image upload failed:", error.message);
        handleAlert(true, "error", "Image upload failed. Please try again.");
      } finally {
        setLoadingImage(false);
      }
    }
  };

  const uploadStudentImage = async (file) => {
    const { data: { url } } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return url.split("?")[0];
  };

  const handleAddStudent = async (formData) => {
    setLoading(true);
    try {
      if (!imageUrl) {
        setLoading(false);
        return handleAlert(true, "warning", "Student image is required.");
      }

      const payload = { ...formData, imageUrl };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
        payload,
        { headers: { Authorization: authToken } }
      );

      if (response.data.success) {
        reset();
        setSelectedImage(null);
        setImageUrl(null);
        setOpenStudentModal(false);
        await queryClient.invalidateQueries(["getStudents"]);
        handleAlert(true, "success", "Student added successfully!");
      } else {
        handleAlert(true, "error", response.data.error || "Server error. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add student:", error.message);
      handleAlert(true, "error", error.response?.data?.error || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="flex gap-2 flex-col overflow-scroll"
    >
      <div className="flex flex-col gap-2  overflow-auto h-auto">
        <FullskapeTableComponent
          register={register}
          setValue={setValue}
          watch={watch}
          addedEmployee={[]}
          zoneId={zoneId}
          openStudentModal={openStudentModal}
          setOpenStudentModal={setOpenStudentModal}
        />
      </div>

      <Dialog
        open={openStudentModal}
        onClose={() => setOpenStudentModal(false)}
      >
        <DialogTitle>Add Student</DialogTitle>
        <form onSubmit={handleSubmit(handleAddStudent)}>
        <DialogContent>
          <div className="flex flex-col space-y-1">
            {[
              { name: "name", label: "Name" },
              { name: "parentPhoneNumber", label: "Parent's Contact Number" },
              { name: "parentEmail", label: "Parent's Email" },
              { name: "studentPhoneNumber", label: "Student's Contact Number" },
              { name: "class", label: "Class" },
              { name: "division", label: "Division" },
              { name: "PRN", label: "PRN" },
            ].map(({ name, label }) => (
              <AuthInputField
                key={name}
                name={name}
                control={control}
                type={name === "parentEmail" ? "email" : "text"}
                placeholder={label}
                label={`${label} *`}
                errors={errors}
              />
            ))}

          <div className="flex items-center space-y-2 space-x-2 w-full">
            <Typography variant="body1" className="font-semibold text-gray-700 text-sm w-1/3 text-left pr-4">
              Student Image *
            </Typography>
            <div className="flex-1 flex items-center space-x-2">
              <Controller
                control={control}
                name="studentImage"
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                      handleImageChange(e);
                      field.onChange(e.target.files[0]);
                    }}
                  />
                )}
              />
              {loadingImage && <CircularProgress size={20} />}
            </div>
          </div>
          <ErrorMessage
            errors={errors}
            name="studentImage"
            render={({ message }) => (
              <Typography variant="caption" color="error" className="pl-[calc(33%+1rem)]">
                {message}
              </Typography>
            )}
          />

          </div>
        </DialogContent>

          <DialogActions>
            <Button
              style={{ width: "25vw" }}
              onClick={() => setOpenStudentModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              style={{ width: "25vw" }}
              type="submit"
              variant="contained"
              disabled={loading || loadingImage}
            >
              {loading ? <CircularProgress size={20} /> : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </form>
  );
};

export default FullskapeViewDelete;
