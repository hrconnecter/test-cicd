
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";


// Define Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  cuisineType: z.string().min(1, "Cuisine type is required."),
  description: z.string().optional(),
  price: z.string().min(1, "Price must be a positive number."),
  ingredients: z.string().optional(),
  category: z.string().min(1, "Category is required."),
  //  isVeg: z.string().min(1, "categeory is required."),
  isVeg: z.string().min(1, "Veg/Non-Veg  is required."),
  available: z.string().min(1, "Availability is required."),
  preparationTime: z.string().min(1, "preparationTime  is required."),
  customizations: z.string().optional(),
  maxQuantity: z
    .string()
    .regex(/^\d+$/, "Maximum quantity must be a non-negative integer."),
  // image: z.instanceof(File).optional(),
  image: z
  .instanceof(File, { message: "Image file is required." })
  .refine((file) => file.size <= 1 * 1024 * 1024, {
    message: "Image size must not exceed 1MB.",
  })
  .optional(),
});

console.log("formSchema",formSchema)

const Addmenu = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const navigate = useNavigate();
  const { empId, orgId } = useParams();

  const { handleAlert } = useContext(TestContext);


  const { control, formState, handleSubmit, reset, setValue, clearErrors, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cuisineType: "",
      description: "",
      isVeg: true, // Ensure boolean default value
      price: "",
      ingredients: "",
      category: "",
      preparationTime: "",
      customizations: "",
      maxQuantity: "",
      available: true, // Ensure boolean default value
      image: null,
    },
  });
  
  console.log("watchhh", watch("isVeg"));

  const { errors, isDirty } = formState;

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${user.vendorId}`,
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

    return url.split("?")[0]; // Return URL without query parameters
  };

  const onSubmit = async (data) => {
    try {
      // Ensure correct boolean values
      const isVegBool = data.isVeg === "true" || data.isVeg === true;
      const availableBool = data.available === "true" || data.available === true;
  
      // Update values in the form state
      setValue("isVeg", isVegBool);
      setValue("available", availableBool);
  
      // Validate Image Size
      if (data.image && data.image.size > 1 * 1024 * 1024) {
        handleAlert(true, "warning", "Image size must not exceed 1MB.");
        return;
      }
  
      // Upload Image if available
      let imageUrl = null;
      if (data.image) {
        try {
          imageUrl = await uploadVendorDocument(data.image);
        } catch (error) {
          console.error("Error uploading image:", error);
          handleAlert(true, "error", "Failed to upload image. Please try again.");
          return;
        }
      }
  
      // Prepare final data object
      const updatedData = {
        ...data,
        isVeg: isVegBool,
        available: availableBool,
        image: imageUrl,
        vendorid: user._id,
      };
  
      // Send Data to API
      await axios.post(
        `${process.env.REACT_APP_API}/route/menu/add`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
  
      // Success Handling
      toast.success("Menu item added successfully");
      reset();
      navigate(`/vendor/${orgId}/${empId}/list-menu`);
    } catch (error) {
      console.error("Error adding menu item:", error);
      handleAlert(true, "error", "Failed to add menu item. Please try again.");
    }
  };
  

  return (
    <BoxComponent>
     <HeadingOneLineInfo heading={" Menu Item"}  info={"Add menu items here, which will be visible to customers"}/>
    <div className="p-4">
  

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg"
        noValidate
        autoComplete="off"
      >
        {/* Row with Two Input Fields */}
        <div className="flex space-x-4">
          <AuthInputField
            name="name"
            control={control}
            label="Item Name *"
            errors={errors}
            placeholder="e.g. Pizza"
            className="flex-1" // Take equal space
          />
          <AuthInputField
            name="cuisineType"
            control={control}
            label="Cuisine Type *"
            errors={errors}
            placeholder="e.g. Italian"
            className="flex-1" // Take equal space
          />
        </div>

        {/* Row with Two Input Fields */}
        <div className="flex space-x-4">
          <AuthInputField
            name="description"
            control={control}
            label="Description"
            errors={errors}
            placeholder="Describe the item..."
            className="flex-1" // Take equal space
          />
          <AuthInputField
            name="price"
            control={control}
            label="Price *"
            type="number"
            errors={errors}
            placeholder="e.g. 10.99"
            className="flex-1" // Take equal space
          />
        </div>

        {/* Row with Two Input Fields */}
        <div className="flex space-x-4">
          <AuthInputField
            name="ingredients"
            control={control}
            label="Ingredients"
            as="textarea"
            errors={errors}
            placeholder="List ingredients here..."
            rows={3}
            className="flex-1" // Take equal space
          />
          <AuthInputField
            name="category"
            control={control}
            label="Course Type *"
            errors={errors}
            placeholder="e.g. Main Course"
            className="flex-1" // Take equal space
          />
        </div>

        {/* Row with Two Input Fields */}
        <div className="flex space-x-4">
          <AuthInputField
            name="preparationTime"
            control={control}
            label="Preparation Time *"
            type="number"
            errors={errors}
            error={errors.preparationTime}
            placeholder="e.g. 30 "
            className="flex-1" // Take equal space
          />
          
          <AuthInputField
            name="customizations"
            control={control}
            label="Customizations"
            errors={errors}
            placeholder="e.g. Extra toppings"
            className="flex-1" // Take equal space
          />
        </div>

        <div className="flex space-x-4">
          <AuthInputField
            name="maxQuantity"
            control={control}
            label="Maximum Quantity *"
            type="number"
            errors={errors}
            placeholder="e.g. 100"
            className="flex-1" // Take equal space
          />

        <div className="flex-1">
          <label className="block text-gray-700">
            Upload Image *
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setValue("image", file); // Update the form value
                clearErrors("image"); // Clear the error for the image field
              }
            }}
            className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>
        </div>

        <div className="flex space-x-4 justify-center">

        <AuthInputField
            name="isVeg"
            control={control}
            type="switch"
            label="Veg *"
            errors={errors}
            error={errors.isVeg?.message} // Ensure error is passed
            onChange={(e) => setValue("isVeg", e.target.checked, { shouldValidate: true })} 
            descriptionText="By default its Veg."
            className="flex-1"
          />

          <AuthInputField
            name="available"
            control={control}
            type="switch"
            label="Available *"
            errors={errors}
            error={errors.available}
            onChange={(e) => setValue("available", e.target.checked)} // Ensure boolean value
            descriptionText="By default its available."
            className="flex-1"
          />

        </div>

        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
    </BoxComponent>
  );
};

export default Addmenu;
