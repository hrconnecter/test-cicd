/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Tooltip, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DriveFileRenameOutline, AttachMoney } from "@mui/icons-material";

import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Setup from "../SetUpOrganization/Setup";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../components/Modal/component";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import RemotePunchAllowanceSection from "./remoteallowance";

// Currency options for dropdown
const currencyOptions = [
  { label: "INR (₹)", value: "INR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
  { label: "CAD (C$)", value: "CAD" },
  { label: "AUD (A$)", value: "AUD" },
  { label: "SGD (S$)", value: "SGD" },
];

const ApprovalFlowSection = ({
  organisationId,
  authToken,
  handleAlert,
  queryClient,
}) => {
  console.log("✅ApprovalFlowSection props:", { organisationId, authToken });
  const [approvalSettings, setApprovalSettings] = useState({
    requireSecondLevel: false,
  });
  console.log("✅Current approval settings:", approvalSettings);
  console.log("✅Current approval settings:", approvalSettings);

  const updateApprovalSettingsMutation = useMutation(
    async (settings) => {
      console.log("✅Updating approval settings with:", settings);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organisation/${organisationId}/approval-flow`,
        settings,
        { headers: { Authorization: authToken } }
      );
      console.log("✅Update response:", response.data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("✅Mutation successful:", data);
        handleAlert(true, "success", "Approval settings updated successfully");
        queryClient.invalidateQueries(["approval-settings"]);
      },
      onError: (error) => {
        console.error("✅Mutation error:", error);
      },
    }
  );

  const { data: initialSettings } = useQuery(
    ["approval-settings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organisation/${organisationId}/approval-flow`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("Fetched initial settings:", data);
        setApprovalSettings({
          requireSecondLevel: data.approvalFlow.requireSecondLevel,
        });
      },
    }
  );

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <Typography variant="h6" className="mb-4">
        Expense Approval Flow Settings
      </Typography>

      <div className="flex items-center justify-between w-full p-4 rounded-lg shadow-md">
        {/* Checkbox Label */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={approvalSettings.requireSecondLevel}
            onChange={(e) => {
              setApprovalSettings((prev) => ({
                ...prev,
                requireSecondLevel: e.target.checked,
              }));
            }}
            className="form-checkbox h-5 w-5 text-primary"
          />
          <span className="text-gray-700 text-sm font-medium">
            Enable Second Level Approval Flow
          </span>
        </label>

        {/* Save Button (Aligned to the Right) */}
        <Button
          variant="contained"
          onClick={() =>
            updateApprovalSettingsMutation.mutate(approvalSettings)
          }
          disabled={updateApprovalSettingsMutation.isLoading}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400"
        >
          {updateApprovalSettingsMutation.isLoading
            ? "Saving..."
            : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

const SetupExpenseManagment = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const categorySchema = z.object({
    categories: z.array(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().optional(),
        type: z.string(),
        dynamicFields: z.array(z.string()).optional(),
        maxAmount: z.string().min(1, "Maximum amount is required"),

        currency: z.union([
          z.string().min(1, "Currency is required"),
          z.object({
            label: z.string().optional(),
            value: z.string().optional(),
            symbol: z.string().optional(),
          }),
        ]),
      })
    ),
  });

  const methods = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categories: [
        {
          name: "",
          description: "",
          type: "custom",
          dynamicFields: [],
          maxAmount: "",
          // currency: "",
          currency: "INR",
        },
      ],
    },
  });

  const defaultCategories = {
    categories: [
      {
        name: "Travel",
        description: "Travel related expenses",
        type: "default",
        maxAmount: "10000",
        currency: "INR",
        dynamicFields: [
          // {
          //   fieldName: 'travelMedium',
          //   fieldType: 'text',
          //   required: true
          // },

          {
            fieldName: "transportationType",
            fieldType: "select",
            required: false,
            options: ["Flight", "Train", "Bus", "Car", "Other"],
          },
          {
            fieldName: "travelSource",
            fieldType: "text",
            required: true,
          },
          {
            fieldName: "travelDestination",
            fieldType: "text",
            required: true,
          },
          // New fields
          {
            fieldName: "clientProjectName",
            fieldType: "text",
            required: false,
          },

          {
            fieldName: "ticketNumber",
            fieldType: "text",
            required: false,
          },
          {
            fieldName: "travelClass",
            fieldType: "select",
            required: false,
            options: [
              "Economy",
              "Business",
              "First Class",
              "AC",
              "Non-AC",
              "Sleeper",
              "General",
            ],
          },
        ],
      },
      {
        name: "Hotel",
        description: "Hotel accommodation expenses",
        type: "default",
        maxAmount: "10000",
        currency: "INR",
        dynamicFields: [
          {
            fieldName: "hotelName",
            fieldType: "text",
            required: true,
          },
          {
            fieldName: "checkInDate",
            fieldType: "date",
            required: true,
          },
          {
            fieldName: "checkOutDate",
            fieldType: "date",
            required: true,
          },
          // New fields
          {
            fieldName: "hotelAddress",
            fieldType: "text",
            required: false,
          },
          {
            fieldName: "checkInTime",
            fieldType: "text",
            required: false,
          },
          {
            fieldName: "checkOutTime",
            fieldType: "text",
            required: false,
          },
          {
            fieldName: "numberOfNights",
            fieldType: "number",
            required: false,
          },
          {
            fieldName: "roomType",
            fieldType: "select",
            required: false,
            options: ["Single", "Double", "Deluxe", "Suite"],
          },
        ],
      },
      {
        name: "Food",
        description: "Food and meal expenses",
        type: "default",
        maxAmount: "2000",
        currency: "INR",
        dynamicFields: [
          {
            fieldName: "restaurantName",
            fieldType: "text",
            required: true,
          },
          {
            fieldName: "mealType",
            fieldType: "select",
            required: true,
            options: ["breakfast", "lunch", "dinner"],
          },
          // Removed billAmount as requested
          // New fields
          {
            fieldName: "restaurantAddress",
            fieldType: "text",
            required: false,
          },
          {
            fieldName: "numberOfAttendees",
            fieldType: "number",
            required: false,
          },
          {
            fieldName: "attendeeDetails",
            fieldType: "text",
            required: false,
          },
        ],
      },
    ],
    isDefault: true,
  };

  const { data: existingCategories } = useQuery(
    ["expense-categories", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    }
  );
  const { data: currencyOptionsData } = useQuery(
    ["currency-options"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/currency-options`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.currencies;
    }
  );

  // Use the fetched currency options or fallback to the local ones
  const availableCurrencies = currencyOptionsData || currencyOptions;

  const createCategoryMutation = useMutation(
    async (data) => {
      if (data.isDefault) {
        return axios.post(
          `${process.env.REACT_APP_API}/route/organisation/${organisationId}/create/expense/category`,
          { categories: defaultCategories, isDefault: true },
          { headers: { Authorization: authToken } }
        );
      } else {
        const categoryData = data.categories.map((category) => ({
          name: category.name,
          description: category.description,
          type: "custom",
          maxAmount: category.maxAmount,
          // currency: typeof category.currency === 'object' ? category.currency.value : category.currency,
          currency:
            typeof category.currency === "object"
              ? category.currency.value
              : category.currency,
          organizationId: organisationId,
        }));
        return axios.post(
          `${process.env.REACT_APP_API}/route/organisation/${organisationId}/create/expense/category`,
          { categories: categoryData, isDefault: false },
          { headers: { Authorization: authToken } }
        );
      }
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Categories added successfully");
        queryClient.invalidateQueries(["expense-categories"]);
        setOpenModal(false);
        methods.reset({
          categories: [
            {
              name: "",
              description: "",
              type: "custom",
              dynamicFields: [],
              maxAmount: "",
              currency: "INR",
            },
          ],
        });
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Error adding categories"
        );
      },
    }
  );

  const addCategoryField = () => {
    const currentCategories = methods.getValues("categories");
    methods.setValue("categories", [
      ...currentCategories,
      {
        name: "",
        description: "",
        type: "custom",
        dynamicFields: [],
        maxAmount: "",
        currency: "INR",
      },
    ]);
  };

  const removeCategoryField = (index) => {
    const currentCategories = methods.getValues("categories");
    methods.setValue(
      "categories",
      currentCategories.filter((_, i) => i !== index)
    );
  };

  // const onSubmit = (data) => {
  //   console.log("Form data before submission:", JSON.stringify(data, null, 2));

  //   const processedData = {
  //     ...data,
  //     categories: data.categories.map((category) => ({
  //       ...category,
  //       // currency: typeof category.currency === 'object' ? category.currency.value : category.currency
  //       currency:
  //         typeof category.currency === "object"
  //           ? category.currency.value
  //           : category.currency,
  //     })),
  //   };

  //   createCategoryMutation.mutate(processedData);
  // };

  const onSubmit = (data) => {
    console.log("Form data before submission:", JSON.stringify(data, null, 2));

    // Check if any required fields are missing
    const missingFields = data.categories.some(
      (cat) => !cat.name || !cat.maxAmount || !cat.currency
    );

    if (missingFields) {
      console.error("Missing required fields in form data");
      handleAlert(true, "error", "Please fill all required fields");
      return;
    }

    const processedData = {
      ...data,
      categories: data.categories.map((category) => {
        console.log("Processing category:", category);
        return {
          ...category,
          currency:
            typeof category.currency === "object"
              ? category.currency.value
              : category.currency,
        };
      }),
    };

    console.log("Processed data:", JSON.stringify(processedData, null, 2));
    createCategoryMutation.mutate(processedData);
  };

  const deleteCategoryMutation = useMutation(
    async (categoryId) => {
      return axios.delete(
        `${process.env.REACT_APP_API}/route/expense/category/${categoryId}`,
        {
          headers: { Authorization: authToken },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Category deleted successfully");
        queryClient.invalidateQueries(["expense-categories"]);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Error deleting category"
        );
      },
    }
  );

  const updateCategoryMutation = useMutation(
    async ({ categoryId, data }) => {
      // Prepare the update data
      const updateData = {
        name: data.name,
        description: data.description,
        maxAmount: Number(data.maxAmount || 0),
        currency:
          typeof data.currency === "object"
            ? data.currency.value
            : data.currency,
        // Preserve the original type
        type: editingCategory.type,
        // Preserve dynamic fields if they exist
        dynamicFields: editingCategory.dynamicFields || [],
      };

      return axios.put(
        `${process.env.REACT_APP_API}/route/expense/category/${categoryId}`,
        updateData,
        {
          headers: { Authorization: authToken },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Category updated successfully");
        queryClient.invalidateQueries(["expense-categories"]);
        setEditModalOpen(false);
      },
      onError: (error) => {
        console.error("Update error:", error);
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Error updating category"
        );
      },
    }
  );

  const editMethods = useForm({
    defaultValues: {
      name: "",
      description: "",
      maxAmount: "",
      currency: "INR",
    },
  });

  // const handleEditClick = (category) => {
  //   setEditingCategory(category);
  //   editMethods.reset({
  //     name: category.name,
  //     description: category.description,
  //     // maxAmount: category.maxAmount || "",
  //     // currency:
  //     //   typeof category.currency === "object"
  //     //     ? category.currency.value
  //     //     : category.currency || "INR",

  //     maxAmount: category.maxAmount ? category.maxAmount.toString() : "",
  //     currency: category.currency || "INR",
  //   });
  //   setEditModalOpen(true);
  // };
  const handleEditClick = (category) => {
    setEditingCategory(category);

    let currencyOption = { label: category.currency, value: category.currency };

    if (availableCurrencies && category.currency) {
      const matchingOption = availableCurrencies.find(
        (option) => option.value === category.currency
      );

      if (matchingOption) {
        currencyOption = matchingOption;
      }
    }

    console.log("Setting currency option:", currencyOption); // Debug log

    // Use the data we already have, with defaults for missing fields
    editMethods.reset({
      name: category.name || "",
      description: category.description || "",
      // Set default values for potentially missing fields
      maxAmount: category.maxAmount ? category.maxAmount.toString() : "0",
      currency: currencyOption,
    });

    setEditModalOpen(true);
  };

  const fetchCategoryById = async (categoryId) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/expense/category/${categoryId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.category;
  };

  const handleDeleteClick = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  // Helper function to format currency display
  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      case "SGD":
        return "S$";
      default:
        return currencyCode;
    }
  };

  const defaultCategoriesExist = useMemo(() => {
    if (
      !existingCategories?.categories ||
      existingCategories.categories.length === 0
    ) {
      return false;
    }

    // Check if any category has type 'default'
    return existingCategories.categories.some(
      (category) => category.type === "default"
    );
  }, [existingCategories]);

  return (
    <BoxComponent>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="flex justify-between items-center mb-6">
            <HeadingOneLineInfo
              heading="Expense Categories"
              info="Setup expense categories efficiently."
            />
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={() => {
                  createCategoryMutation.mutate({ isDefault: true });
                }}
                className="bg-white hover:bg-gray-50"
                disabled={defaultCategoriesExist} // Disable if default categories exist
                title={
                  defaultCategoriesExist
                    ? "Default categories already added"
                    : "Add default categories"
                }
              >
                Add Default Categories
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                className="bg-blue-900 hover:bg-blue-700"
              >
                Add Category
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-left text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Sr. No
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Category Name
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Max Amount
                  </th>
                  {/* <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Currency
                  </th> */}
                  {/* <th scope="col" className="whitespace-nowrap !text-left pl-8 py-2">Dynamic Fields</th> */}
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap !text-left pl-8 py-2"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {existingCategories?.categories?.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b transition duration-300 ease-in-out hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap pl-8 py-1">{index + 1}</td>
                    <td className="whitespace-nowrap pl-8 py-1">
                      {category.name}
                    </td>
                    <td className="whitespace-nowrap pl-8 py-1">
                      {category.type}
                    </td>

                    <td className="whitespace-nowrap pl-8 py-1">
                      {category.maxAmount ? category.maxAmount : "-"}
                    </td>

                    {/* <td className="whitespace-nowrap pl-8 py-1">
  {category.currency ? getCurrencySymbol(category.currency) : '-'}
</td>  */}

                    <td className="whitespace-nowrap pl-8 py-1">
                      {category.description
                        ? category.description.length > 20
                          ? `${category.description.substring(0, 20)}...`
                          : category.description
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap pl-8 py-1">
                      {/* REPLACE THIS ENTIRE BLOCK */}
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(category)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(category._id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!existingCategories?.categories ||
              existingCategories.categories.length === 0) && (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <p>No categories found. Please add a category.</p>
              </section>
            )}
          </div>

          <ReusableModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            heading="Add Expense Categories"
            subHeading="Create new expense categories with approval workflows"
          >
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {methods.watch("categories").map((_, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle1" className="font-medium">
                        Category #{index + 1}
                      </Typography>
                      <div className="flex gap-2">
                        {index === methods.watch("categories").length - 1 && (
                          <Tooltip title="Add new category" arrow>
                            <IconButton
                              onClick={addCategoryField}
                              color="primary"
                              size="small"
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {methods.watch("categories").length > 1 && (
                          <Tooltip title="Remove category" arrow>
                            <IconButton
                              onClick={() => removeCategoryField(index)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <AuthInputFiled
                      name={`categories.${index}.name`}
                      label="Category Name"
                      required
                      placeholder="Enter category name"
                      icon={DriveFileRenameOutline}
                    />

                    <AuthInputFiled
                      name={`categories.${index}.description`}
                      label="Description"
                      multiline
                      rows={2}
                      placeholder="Category description"
                      icon={DriveFileRenameOutline}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <AuthInputFiled
                        name={`categories.${index}.maxAmount`}
                        label="Maximum Amount Limit"
                        required
                        type="number"
                        placeholder="Enter maximum amount"
                        icon={AttachMoney}
                      />

                      {/* <AuthInputFiled
                        name={`categories.${index}.currency`}
                        label="Currency"
                        required
                        type="select"
                        options={availableCurrencies}
                        icon={AttachMoney}
                        // Make sure the component knows how to handle the selected value
                        onChange={(selectedOption) => {
                          methods.setValue(
                            `categories.${index}.currency`,
                            selectedOption
                          );
                        }}
                      /> */}
                      {/* <AuthInputFiled
  name="currency"
  label="Currency"
  required
  type="select"
  options={availableCurrencies || currencyOptions}
  icon={AttachMoney}
  // Make sure the component knows how to handle the selected value
  onChange={(selectedOption) => {
    editMethods.setValue("currency", selectedOption);
  }}
/> */}
                      <AuthInputFiled
                        name="currency"
                        label="Currency"
                        required
                        type="select"
                        options={availableCurrencies || currencyOptions}
                        icon={AttachMoney}
                        defaultValue={editMethods.getValues("currency")} // Add this line
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    onClick={() => setOpenModal(false)}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={createCategoryMutation.isLoading}
                  >
                    {createCategoryMutation.isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </ReusableModal>

          <ReusableModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              editMethods.reset();
            }}
            heading="Edit Expense Category"
          >
            <FormProvider {...editMethods}>
              <form
                onSubmit={editMethods.handleSubmit((data) =>
                  updateCategoryMutation.mutate({
                    categoryId: editingCategory._id,
                    data: {
                      name: data.name,
                      description: data.description,
                      maxAmount: data.maxAmount,
                      // currency: data.currency
                      currency:
                        typeof data.currency === "object"
                          ? data.currency.value
                          : data.currency,
                      type: editingCategory.type,
                      dynamicFields: editingCategory.dynamicFields || [],
                    },
                  })
                )}
              >

                {/* Default Category Badge */}
      {editingCategory?.type === "default" && (
        <div className="bg-gray-200 text-gray-700 text-sm p-2 rounded-md flex items-center mb-2">
          🔒 This is a &nbsp;<b>System-defined Category</b> .Name & Description cannot be edited.
        </div>
      )}

      {/* Category Name - ReadOnly for Default Categories with Tooltip */}
      <Tooltip
        title={
          editingCategory?.type === "default"
            ? "This is a default category. You cannot edit its name."
            : ""
        }
        arrow
      >
        <div>
          <AuthInputFiled
            name="name"
            label="Category Name"
            required
            placeholder="Enter category name"
            icon={DriveFileRenameOutline}
            readOnly={editingCategory?.type === "default"} // Disable editing if default
            className={editingCategory?.type === "default" ? " cursor-not-allowed" : ""}
          />
        </div>
      </Tooltip>

      {/* Description - ReadOnly for Default Categories with Tooltip */}
      <Tooltip
        title={
          editingCategory?.type === "default"
            ? "This is a default category. You cannot edit its description."
            : ""
        }
        arrow
      >
        <div>
          <AuthInputFiled
            name="description"
            label="Description"
            multiline
            rows={2}
            placeholder="Category description"
            icon={DriveFileRenameOutline}
            readOnly={editingCategory?.type === "default"}
            className={editingCategory?.type === "default" ? " cursor-not-allowed" : ""}
          />
        </div>
      </Tooltip>

              

                {/* <AuthInputFiled
                  name="name"
                  label="Category Name"
                  required
                  placeholder="Enter category name"
                  icon={DriveFileRenameOutline}
                  readOnly={editingCategory?.type === "default"}
                  
                />
                <AuthInputFiled
                  name="description"
                  label="Description"
                  multiline
                  rows={2}
                  placeholder="Category description"
                  icon={DriveFileRenameOutline}
                  readOnly={editingCategory?.type === "default"}
                /> */}

                {/* New fields for edit modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <AuthInputFiled
                    name="maxAmount"
                    label="Maximum Amount Limit"
                    required
                    type="number"
                    placeholder="Enter maximum amount"
                    icon={AttachMoney}
                  />

                  <AuthInputFiled
                    name="currency"
                    label="Currency"
                    required
                    type="select"
                    options={currencyOptions || availableCurrencies}
                    icon={AttachMoney}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    onClick={() => setEditModalOpen(false)}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updateCategoryMutation.isLoading}
                  >
                    {updateCategoryMutation.isLoading
                      ? "Updating..."
                      : "Update "}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </ReusableModal>

          <ApprovalFlowSection
            organisationId={organisationId}
            authToken={authToken}
            handleAlert={handleAlert}
            queryClient={queryClient}
          />

          <RemotePunchAllowanceSection
            organisationId={organisationId}
            authToken={authToken}
            handleAlert={handleAlert}
            queryClient={queryClient}
          />
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default SetupExpenseManagment;
