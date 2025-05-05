/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import { useMemo } from "react";
import DynamicExpenseFields from "../../components/ExpenseFields/DynamicExpenseFields";
import RemotePunchingFetcher from "../../components/ExpenseFields/RemotePunchingFetcher";
import { Button, Typography } from "@mui/material";
const CreateExpense = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCurrentUser } = UserProfile();
  const currentUser = getCurrentUser();
  const [selectedDraft, setSelectedDraft] = useState(null);
  // const [isReportMode, setIsReportMode] = useState(false);
  const [isReportMode, setIsReportMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLimitExceeded, setCategoryLimitExceeded] = useState(false);
  // Add state for tracking expense being edited
  const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [reportTotal, setReportTotal] = useState(0);


const isHotelCategory = () => {
  return selectedCategory?.name === 'Hotel';
};

  const ExpenseSchema = z.object({
    reportDetails: z.object({
      reportName: z.string().min(1, { message: "Report name is required" }),
      reportDate: z.string().min(1, { message: "Report date is required" }),
      reportType: z.object({
        value: z.string().min(1, { message: "Report type is required" }),
        label: z.string().min(1, { message: "Report type is required" }),
      }),
      reportFor: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .optional(),
      reportApprover: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .optional().nullable(),

      // reportApprover: z.object({
      //   value: z.string().min(1, { message: "Approver is required" }),
      //   label: z.string().min(1, { message: "Approver is required" }),
      // }),
    }),
    // Expense fields
    expenseName: z.string().min(1, "Expense name is required"),
    category: z.object({
      value: z.string().min(1, "Category value is required"),
      label: z.string().min(1, "Category label is required"),
    }),

    // approver: z.object({
    //   value: z.string().min(1, "Approver value is required"),
    //   label: z.string().min(1, "Approver label is required"),
    // }),

    approver: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .optional(),

    // startDate: z.string().min(1, "Start date is required"),
    // endDate: z.string().min(1, "End date is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    amount: z.string().min(1, "Amount is required"),
    region: z.string().min(1, "Region is required"),
    attachments: z
      .any()
      .transform((files) => (files ? Array.from(files) : []))
      .optional(),
    relatedEvent: z.string().optional(),

  isRemotePunchingAllowance: z.boolean().optional(),
  remotePunchingDetails: z.object({
    date: z.string().optional(),
    km: z.number().optional(),
    allowancePerKm: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),

    dynamicFields: z
      .object({
        // Travel fields
        travelMedium: z.string().optional(),
        travelSource: z.string().optional(),
        travelDestination: z.string().optional(),
        clientProjectName: z.string().optional(),
        transportationType: z.string().optional(),
        ticketNumber: z.string().optional(),
        travelClass: z.string().optional(),

        // Hotel fields
        hotelName: z.string().optional(),
        checkInDate: z.string().optional(),
        checkOutDate: z.string().optional(),
        hotelAddress: z.string().optional(),
        checkInTime: z.string().optional(),
        checkOutTime: z.string().optional(),
        numberOfNights: z.string().optional(),
        roomType: z.string().optional(),

        // Food fields
        restaurantName: z.string().optional(),
        mealType: z.string().optional(),
        restaurantAddress: z.string().optional(),
        numberOfAttendees: z.string().optional(),
        attendeeDetails: z.string().optional(),
      })
      .optional(),
  }).refine(data => {
    // If Hotel category, don't validate startDate and endDate
    if (data.category?.label === 'Hotel') {
      return true;
    }
    // Otherwise, ensure startDate and endDate are provided
    return !!data.startDate && !!data.endDate;
  }, {
    message: "Start date and end date are required for non-hotel expenses",
    path: ['startDate', 'endDate']
  });

  const methods = useForm({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      reportDetails: {
        reportName: "",
        reportDate: "",
        reportType: { value: "", label: "" },
        reportFor: { value: "", label: "" },
        // reportApprover: { value: "", label: "" }, 
        reportApprover: null, // Set to null instead of empty object
      },
      expenseName: "",
      // category: { value: "", label: "" },
      category: null,
      approver: { value: "", label: "" },
      startDate: "",
      endDate: "",
      description: "",
      amount: "",
      region: "",
      attachments: undefined,
      relatedEvent: "",
      dynamicFields: {},
      
    isRemotePunchingAllowance: false,
    remotePunchingDetails: {
    date: "",
    km: 0,
    allowancePerKm: 0,
    currency: ""
  },

    },
  });
  // const { formState: { errors } } = methods;
  const selectedCategoryValue = methods.watch("category");

  const {
    control,
    formState: { errors },
  } = methods;

  const { data: draftsData, isLoading: isDraftsLoading } = useQuery(
    ["draftExpenses", organisationId],
    async () => {
      const [expenseResponse, reportResponse] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API}/route/expense/drafts/${organisationId}`,
          { headers: { Authorization: authToken } }
        ),
        axios.get(
          `${process.env.REACT_APP_API}/route/expense/report/drafts/${organisationId}`,
          { headers: { Authorization: authToken } }
        ),
      ]);

      return {
        expenses: expenseResponse.data.draftExpenses || [],
        reports: reportResponse.data.draftReports || [],
      };
    }
  );

  const { data: categoriesData } = useQuery(
    ["expenseCategories", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  useEffect(() => {
    console.log("AP Categories loaded:", categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    if (selectedCategoryValue) {
      const category = categoriesData?.categories?.find(
        (cat) => cat._id === selectedCategoryValue.value
      );
      console.log("Selected Category:", category);
      setSelectedCategory(category);
      setCategoryLimitExceeded(false);

      if (category?.name === 'Hotel') {
        methods.setValue('startDate', '');
        methods.setValue('endDate', '');
      }
    }
  }, [selectedCategoryValue, categoriesData]);

  const validateExpenseAmount = (amount, category) => {
    if (!category || !category.maxAmount) return true;

    const numAmount = Number(amount);
    const maxAmount = Number(category.maxAmount);

    return numAmount <= maxAmount;
  };
  useEffect(() => {
    const currentAmount = methods.watch("amount");
    const currentCategory = selectedCategory;

    if (currentAmount && currentCategory && currentCategory.maxAmount) {
      const isValid = validateExpenseAmount(currentAmount, currentCategory);
      setCategoryLimitExceeded(!isValid);

      // Show warning if limit exceeded
      if (!isValid) {
        handleAlert(
          true,
          "warning",
          `Amount exceeds the maximum limit of ${currentCategory.maxAmount} ${
            currentCategory.currency || "INR"
          } for this category`
        );
      }
    }
  }, [methods.watch("amount"), selectedCategory]);

  const { data: approversData } = useQuery(
    ["expenseApprovers", organisationId],
    async () => {
      const response = await axios.get(
        // `${process.env.REACT_APP_API}/route/expense/approvers/${organisationId}`,
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  // New queries for report functionality
  const { data: reportTypesData } = useQuery(
    ["reportTypes", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/reportTypes/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  const { data: employeesData } = useQuery(
    ["employees", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organisation/employees/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

const { data: remotePunchSettings } = useQuery(
  ["remote-punch-allowance", organisationId],
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/${organisationId}/remote-punch-allowance`,
        { headers: { Authorization: authToken } }
      );
      return response.data.remotePunchAllowance;
    } catch (error) {
      console.error("Error fetching remote punch allowance settings:", error);
      return null;
    }
  },
  {
    enabled: !!organisationId && !!authToken,
  }
);
  // Add category change handler
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    // Reset dynamic fields when category changes
    methods.setValue("dynamicFields", {});
  };

  const categoryOptions =
    categoriesData?.categories?.map((cat) => ({
      label: cat.name,
      value: cat._id,
    })) || [];

  // Map approvers including those from additionalInfo
  // const approverOptions = useMemo(() => {
  //   const approvers = approversData?.data?.approvers || [];
  //   return approvers.map((app) => ({
  //     value: app._id,
  //     label: `${app.first_name} ${app.last_name}`,
  //   }));
  // }, [approversData]);

  //pagi api
  // const approverOptions = useMemo(() => {
  //   console.log("Fetched approversData:", approversData);

  //   const employees = approversData?.employees || [];

  //   return employees
  //     .filter((emp) => emp.expenseApprover)
  //     .map((emp) => ({
  //       value: emp.expenseApprover._id, // ✅ Now it's an object, so get the ID
  //       label: `${emp.expenseApprover.first_name} ${emp.expenseApprover.last_name}`, // ✅ Correctly access names
  //     }));
  // }, [approversData]);

  const approverOptions = useMemo(() => {
    console.log("Fetched approversData:", approversData);
  
    const employees = approversData?.employees || [];
  
    return employees
      .filter(emp => typeof emp.expenseApprover === "string")
      .map(emp => {
        // Find the actual user object whose _id matches the expenseApprover ID
        const approver = employees.find(
          (e) => e._id === emp.expenseApprover
        );
  
        return {
          value: approver?._id || emp.expenseApprover,
          label: `${approver?.first_name || "Unknown"} ${approver?.last_name || ""}`.trim()
        };
      })
      .filter(option => option.label !== "Unknown"); // Optional: filter incomplete ones
  }, [approversData]);
  
  const handleFileExpenseUpload = async (files) => {
    if (!files || files.length === 0) return [];

    const uploadedFiles = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        handleAlert(true, "error", "File size should not exceed 5MB");
        continue;
      }

      try {
        const {
          data: { url, key },
        } = await axios.get(
          `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
          { headers: { Authorization: authToken } }
        );

        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=31536000",
          },
        });

        uploadedFiles.push({
          url: url.split("?")[0],
          name: file.name,
          type: file.type,
          key,
          contentDisposition: "inline",
        });
      } catch (error) {
        console.error("File upload error:", error);
      }
    }
    return uploadedFiles;
  };

  
  
  const handleEditExpenseInReport = (index) => {
    const expenseToEdit = expenses[index];
    setEditingExpenseIndex(index);

    const reportApprover = methods.getValues("reportDetails.reportApprover");


    const processedDynamicFields = {};
    if (expenseToEdit.dynamicFields) {
      Object.entries(expenseToEdit.dynamicFields).forEach(([key, value]) => {
        // For select fields that need to be objects with label/value
        if (['roomType', 'mealType', 'transportationType', 'travelClass'].includes(key) && value) {
          // If already an object with label/value, use it as is
          if (value && typeof value === 'object' && 'value' in value) {
            processedDynamicFields[key] = value;
          } else {
            // Otherwise, create a label/value object
            processedDynamicFields[key] = {
              label: value,
              value: value
            };
          }
        } else {
          processedDynamicFields[key] = value;
        }
      });
    }
    
    if (expenseToEdit.category.label === 'Hotel') {
      // For Hotel expenses, the dates might be in dynamicFields
      methods.reset({
        ...expenseToEdit,
        amount: expenseToEdit.amount.toString(),
        reportDetails: methods.getValues("reportDetails"),
        dynamicFields: expenseToEdit.dynamicFields || {},
        isRemotePunchingAllowance: expenseToEdit.isRemotePunchingAllowance || false,
    remotePunchingDetails: expenseToEdit.remotePunchingDetails || {
      date: "",
      km: 0,
      allowancePerKm: 0,
      currency: ""
    },
    approver: reportApprover
      });
    } else {
    methods.reset({
      ...expenseToEdit,
      amount: expenseToEdit.amount.toString(), // Convert number to string
      reportDetails: methods.getValues("reportDetails"),
      dynamicFields: expenseToEdit.dynamicFields || {},
      approver: reportApprover,
      isRemotePunchingAllowance: expenseToEdit.isRemotePunchingAllowance || false,
      remotePunchingDetails: expenseToEdit.remotePunchingDetails || {
        date: "",
        km: 0,
        allowancePerKm: 0,
        currency: ""
      },
    });
  }
  };

  const handleAddExpense = async (values) => {
    if (selectedCategory && selectedCategory.maxAmount) {
      const isValid = validateExpenseAmount(values.amount, selectedCategory);
      if (!isValid) {
        handleAlert(
          true,
          "error",
          `Expense amount exceeds the maximum limit of ${
            selectedCategory.maxAmount
          } ${selectedCategory.currency || "INR"} for category ${
            selectedCategory.name
          }`
        );
        return; // Prevent submission
      }
    }

    // Add currency from the selected category
    const expenseWithCurrency = {
      ...values,
      currency: selectedCategory?.currency || "INR",
    };
    // Add Report Details validation
    const reportFields = [
      "reportDetails.reportName",
      "reportDetails.reportDate",
      "reportDetails.reportType",
      // "reportDetails.reportApprover",
    ];

    const reportValid = await methods.trigger(reportFields);

      // Add special handling for Hotel category
  if (selectedCategory?.name === 'Hotel') {
    // For Hotel category, use checkInDate and checkOutDate as startDate and endDate
    if (values.dynamicFields?.checkInDate) {
      values.startDate = values.dynamicFields.checkInDate;
    }
    if (values.dynamicFields?.checkOutDate) {
      values.endDate = values.dynamicFields.checkOutDate;
    }
  }
    const expenseFields = [
      "expenseName",
      "category",
      "amount",
      // "startDate",
      // "endDate",
      "description",
      "region",
      "attachments",
    ];

     // Add startDate and endDate validation only for non-hotel categories
  if (selectedCategory?.name !== 'Hotel') {
    expenseFields.push('startDate', 'endDate');
  }

    const expenseValid = await methods.trigger(expenseFields);

    if (!reportValid) {
      handleAlert(true, "error", "Please fill all required report details");
      return;
    }

    if (!expenseValid) {
      handleAlert(true, "error", "Please fill all required expense fields");
      return;
    }

    const reportApprover = methods.getValues("reportDetails.reportApprover") || null;
  
    // Check if report approver exists
    // if (!reportApprover || !reportApprover.value) {
    //   // handleAlert(true, "error", "Please select an approver in Report Details");
    //   return;
    // }
  

    setIsSubmitting(true);
    try {
      let attachments = [];
      if (values.attachments && values.attachments.length > 0) {
        attachments = await handleFileExpenseUpload(values.attachments);
      }

      const newExpense = {
        ...values,
        amount: parseFloat(values.amount),
        attachments,
        // dynamicFields: selectedCategory?.type === 'default' ? values.dynamicFields : {}
        dynamicFields: values.dynamicFields || {},
        approver: reportApprover
      };

      let updatedExpenses;
      if (editingExpenseIndex !== null) {
        updatedExpenses = [...expenses];
        updatedExpenses[editingExpenseIndex] = newExpense;
        setExpenses(updatedExpenses);
        setEditingExpenseIndex(null);
        setReportTotal(calculateReportTotal(updatedExpenses));
      } else {
        updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
        setReportTotal(calculateReportTotal(updatedExpenses));
      }

      const currentReportDetails = methods.getValues("reportDetails");
      methods.reset({
        reportDetails: currentReportDetails,
      });
    } catch (error) {
      handleAlert(true, "error", "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateReportTotal = (expensesList) => {
    return expensesList.reduce((sum, expense) => {
      const amount =
        typeof expense.amount === "string"
          ? parseFloat(expense.amount)
          : expense.amount;
      return sum + amount;
    }, 0);
  };

  // const handleRemoveExpense = (index) => {
  //   const updatedExpenses = expenses.filter((_, i) => i !== index);
  //   setExpenses(updatedExpenses);
  //   setReportTotal(calculateReportTotal(updatedExpenses));
  // };
  //friday
  const handleRemoveExpense = (index) => {
    if (window.confirm("Are you sure you want to remove this expense?")) {
      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
      setReportTotal(calculateReportTotal(updatedExpenses));
    }
  };

  const handleEditDraft = (draft) => {
    setSelectedDraft(draft);
    methods.reset({
      expenseName: draft.expenseName,
      category: {
        value: draft.category._id,
        label: draft.category.name,
      },
      approver: {
        value: draft.approver._id,
        label: draft.approver.name,
      },
      startDate: draft.startDate.split("T")[0],
      endDate: draft.endDate.split("T")[0],
      description: draft.description,
      amount: draft.amount.toString(),
      region: draft.region,
      relatedEvent: draft.relatedEvent || "",
    });
  };

  // const createExpenseMutation = useMutation(
  //   async ({ data, isDraft }) => {
  //     let attachments = [];

  //     if (data.attachments.length > 0) {
  //       attachments = await handleFileExpenseUpload(data.attachments);
  //     }

  //     const expenseData = {
  //       ...data,
  //       category: data.category.value,
  //       approver: data.approver.value,
  //       organizationId: organisationId,
  //       employeeId: getCurrentUser()._id,
  //       // attachments: [attachments],
  //       attachments,
  //       status: isDraft ? "DRAFT" : "PENDING",
  //     };

  //     const endpoint = selectedDraft
  //       ? `${process.env.REACT_APP_API}/route/expense/draft/update/${organisationId}/${selectedDraft._id}`
  //       : `${process.env.REACT_APP_API}/route/expense/create/${organisationId}`;

  //     const method = selectedDraft ? axios.put : axios.post;
  //     return method(endpoint, expenseData, {
  //       headers: { Authorization: authToken },
  //     });
  //   },
  //   {
  //     onSuccess: (response, variables) => {
  //       const message = selectedDraft
  //         ? "Expense updated successfully"
  //         : variables.isDraft
  //         ? "Expense saved as draft"
  //         : "Expense created successfully";
  //       handleAlert(true, "success", message);
  //       queryClient.invalidateQueries(["expenses", organisationId]);
  //       queryClient.invalidateQueries(["draftExpenses", organisationId]);
  //       setSelectedDraft(null);
  //       methods.reset();
  //       navigate(`/organisation/${organisationId}/ExpenseManagment`);
  //     },
  //     onError: (error) => {
  //       handleAlert(
  //         true,
  //         "error",
  //         error.response?.data?.message || "Error processing expense"
  //       );
  //     },
  //     onSettled: () => setIsSubmitting(false),
  //   }
  // );

  // 💹
  // Modified createReportMutation to use existing URLs
  // const createReportMutation = useMutation(
  //   async ({ reportDetails, expenses, isDraft = false }) => {
  //     const reportData = {
  //       ...reportDetails,
  //       organizationId: organisationId,
  //       employeeId: currentUser._id,
  //       expenses: expenses.map((expense) => ({
  //         ...expense,
  //         category: expense.category.value,
  //         approver: expense.approver?.value,
  //         attachments: expense.attachments.map((att) => ({
  //           url: att.url,
  //           name: att.name,
  //           type: att.type,
  //         })),
  //       })),
  //       status: isDraft ? "DRAFT" : "PENDING",
  //       totalAmount: reportTotal,
  //     };

  //     const endpoint = selectedDraft
  //       ? `${process.env.REACT_APP_API}/route/expense/report/update/${organisationId}/${selectedDraft._id}`
  //       : `${process.env.REACT_APP_API}/route/expense/report/create/${organisationId}`;

  //     return axios[selectedDraft ? "put" : "post"](endpoint, reportData, {
  //       headers: { Authorization: authToken },
  //     });
  //   },
  //   // ... rest of the mutation options
  // );

  //monday
  const createExpenseMutation = useMutation(
    async ({ data, isDraft }) => {
      let attachments = [];

      if (data.attachments && data.attachments.length > 0) {
        attachments = await handleFileExpenseUpload(data.attachments);
      }

      const expenseData = {
        ...data,
        category: data.category.value,
        approver: data.approver.value,
        organizationId: organisationId,
        employeeId: getCurrentUser()._id,
        attachments, // Empty array if no attachments are provided
        status: isDraft ? "DRAFT" : "PENDING",
      };

      const endpoint = selectedDraft
        ? `${process.env.REACT_APP_API}/route/expense/draft/update/${organisationId}/${selectedDraft._id}`
        : `${process.env.REACT_APP_API}/route/expense/create/${organisationId}`;

      const method = selectedDraft ? axios.put : axios.post;
      return method(endpoint, expenseData, {
        headers: { Authorization: authToken },
      });
    },
    {
      onSuccess: (response, variables) => {
        const message = selectedDraft
          ? "Expense updated successfully"
          : variables.isDraft
          ? "Expense saved as draft"
          : "Expense created successfully";
        handleAlert(true, "success", message);
        queryClient.invalidateQueries(["expenses", organisationId]);
        queryClient.invalidateQueries(["draftExpenses", organisationId]);
        setSelectedDraft(null);
        methods.reset();
        navigate(`/organisation/${organisationId}/ExpenseManagment`);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Error processing expense"
        );
      },
      onSettled: () => setIsSubmitting(false),
    }
  );

  // const createReportMutation = useMutation(
  //   async ({ reportDetails, expenses, isDraft = false }) => {
  //     // Validate expenses array is not empty
  //     if (!expenses.length) {
  //       throw new Error("Cannot submit report without expenses");
  //     }

  //     // Ensure total amount matches expenses
  //     const calculatedTotal = expenses.reduce(
  //       (sum, exp) => sum + Number(exp.amount),
  //       0
  //     );

  //     const processedExpenses = expenses.map((expense) => ({
  //       ...expense,
  //       category: expense.category.value,
  //       approver: expense.approver?.value,
  //       attachments: expense.attachments || [], // Ensure attachments are included
  //       startDate: expense.startDate,
  //       endDate: expense.endDate,
  //       description: expense.description,
  //       amount: expense.amount,
  //       region: expense.region,
  //       relatedEvent: expense.relatedEvent || "",
  //     }));

  //     const reportData = {
  //       reportName: reportDetails.reportName,
  //       reportDate: reportDetails.reportDate,
  //       reportType: reportDetails.reportType.value,
  //       reportFor: reportDetails.reportFor?.value || "",
  //       reportApprover: reportDetails.reportApprover?.value || "",
  //       organizationId: organisationId,
  //       employeeId: currentUser._id,
  //       expenses: processedExpenses,
  //       status: isDraft ? "DRAFT" : "PENDING",
  //       totalAmount: reportTotal,
  //       attachments: [], // Report level attachments if needed
  //     };

  //     console.log(" AP Sending report data:", reportData); // Log the payload

  //     const endpoint = selectedDraft
  //       ? `${process.env.REACT_APP_API}/route/expense/report/update/${organisationId}/${selectedDraft._id}`
  //       : `${process.env.REACT_APP_API}/route/expense/report/create/${organisationId}`;

  //     const response = await axios[selectedDraft ? "put" : "post"](
  //       endpoint,
  //       reportData,
  //       {
  //         headers: { Authorization: authToken },
  //       }
  //     );

  //     console.log(" AP Response received:", response.data); // Log the response
  //     return response.data;
  //   },
  //   {
  //     onSuccess: (data) => {
  //       console.log(" AP Mutation successful:", data);

  //       // Rest of success handling
  //       setIsSubmitting(false); // Reset submission state
  //       handleAlert(true, "success", "Report submitted successfully");

  //       methods.reset({
  //         reportDetails: {
  //           reportName: "",
  //           reportDate: "",
  //           reportType: { value: "", label: "" },
  //           reportFor: { value: "", label: "" },
  //           reportApprover: { value: "", label: "" },
  //         },
  //         expenseName: "",
  //         category: { value: "", label: "" },
  //         amount: "",
  //         startDate: "",
  //         endDate: "",
  //         description: "",
  //         approver: { value: "", label: "" },
  //         region: "",
  //         attachments: [],
  //         relatedEvent: "",
  //       });

  //       setExpenses([]);
  //       setReportTotal(0);
  //       setSelectedDraft(null);
  //       queryClient.invalidateQueries(["expenses", organisationId]);
  //       queryClient.invalidateQueries(["draftExpenses", organisationId]);
  //       // methods.reset();
  //       // navigate(`/organisation/${organisationId}/ExpenseManagment`);
  //     },
  //   }
  // );
  //friday
  // const createReportMutation = useMutation(
  //   async ({ reportDetails, expenses, isDraft = false }) => {
  //     if (!expenses.length) {
  //       throw new Error("Cannot submit report without expenses");
  //     }

  //     const processedExpenses = expenses.map((expense) => ({
  //       ...expense,
  //       category: expense.category.value,
  //       approver: expense.approver?.value,
  //       attachments: expense.attachments || [],
  //     }));

  //     const reportData = {
  //       reportName: reportDetails.reportName,
  //       reportDate: reportDetails.reportDate,
  //       reportType: reportDetails.reportType.value,
  //       reportApprover: reportDetails.reportApprover?.value,
  //       organizationId: organisationId,
  //       employeeId: currentUser._id,
  //       expenses: processedExpenses,
  //       status: isDraft ? "DRAFT" : "PENDING",
  //       totalAmount: reportTotal,
  //     };

  //     const endpoint = selectedDraft
  //       ? `${process.env.REACT_APP_API}/route/expense/report/update/${organisationId}/${selectedDraft._id}`
  //       : `${process.env.REACT_APP_API}/route/expense/report/create/${organisationId}`;

  //     return axios[selectedDraft ? "put" : "post"](endpoint, reportData, {
  //       headers: { Authorization: authToken },
  //     });
  //   },

  //   {
  //     onSuccess: (data) => {
  //       handleAlert(true, "success", "Report submitted successfully");
  //       queryClient.invalidateQueries(["expenses", organisationId]);
  //       queryClient.invalidateQueries(["draftExpenses", organisationId]);
  //       setExpenses([]);
  //       setReportTotal(0);
  //       setSelectedDraft(null);
  //       methods.reset();
  //       setIsSubmitting(false); // Reset submission state

  //     },
  //     onError: (error) => {
  //       handleAlert(true, "error", error.response?.data?.message || "Error processing report");
  //       setIsSubmitting(false); // Reset submission state on error
  //     }
  //   }

  // );
  //friday v2
  const createReportMutation = useMutation(
    async ({ reportDetails, expenses, isDraft = false }) => {
      if (!expenses.length) {
        throw new Error("Cannot submit report without expenses");
      }

      const reportApprover = reportDetails.reportApprover?.value || null;

      // MAIN
      // const processedExpenses = expenses.map((expense) => ({
      //   _id: expense._id, // Include if exists
      //   expenseName: expense.expenseName,
      //   category: expense.category.value,
      //   startDate: expense.startDate,
      //   endDate: expense.endDate,
      //   description: expense.description,
      //   amount: parseFloat(expense.amount),
      //   // approver: expense.approver?.value || null,
      //   approver: reportApprover,
      //   region: expense.region,
      //   attachments: expense.attachments || [],
      //   relatedEvent: expense.relatedEvent || "",
      //   status: isDraft ? "DRAFT" : "PENDING",
      //   firstLevelStatus: "PENDING",
      //   finalStatus: "PENDING",
      //   dynamicFields: expense.dynamicFields || {},
      //   // Add remote punching allowance details
      // isRemotePunchingAllowance: expense.isRemotePunchingAllowance || false,
      // remotePunchingDetails: expense.remotePunchingDetails || null,
      // }));

      // In your submit function, add this processing for dynamic fields
const processedExpenses = expenses.map((expense) => {
  // Process dynamic fields to extract values from select objects
  const processedDynamicFields = {};
  
  if (expense.dynamicFields) {
    Object.entries(expense.dynamicFields).forEach(([key, value]) => {
      // If the value is an object with a 'value' property (select field), use that value
      if (value && typeof value === 'object' && 'value' in value) {
        processedDynamicFields[key] = value.value;
      } else {
        processedDynamicFields[key] = value;
      }
    });
  }
  
  return {
    _id: expense._id, // Include if exists
    expenseName: expense.expenseName,
    category: expense.category.value,
    dynamicFields: processedDynamicFields, // Use processed dynamic fields
    // startDate: expense.startDate,
    // endDate: expense.endDate,
    startDate: expense.startDate || null, // Handle empty startDate
    endDate: expense.endDate || null, // Handle empty endDate
    description: expense.description,
    amount: parseFloat(expense.amount),
    approver: reportApprover,
    region: expense.region,
    attachments: expense.attachments || [],
    relatedEvent: expense.relatedEvent || "",
    status: isDraft ? "DRAFT" : "PENDING",
    firstLevelStatus: "PENDING",
    finalStatus: "PENDING",
    isRemotePunchingAllowance: expense.isRemotePunchingAllowance || false,
    remotePunchingDetails: expense.remotePunchingDetails || null,
  };
});


      const reportData = {
        reportName: reportDetails.reportName,
        reportDate: reportDetails.reportDate,
        reportType: reportDetails.reportType.value,
        // reportApprover: reportDetails.reportApprover?.value,
        // reportApprover: reportDetails.reportApprover?.value || null,
        reportApprover: reportApprover,
        organizationId: organisationId,
        employeeId: currentUser._id,
        creatorRole: currentUser.profile,
        expenses: processedExpenses,
        status: isDraft ? "DRAFT" : "PENDING",
        totalAmount: reportTotal,
        isReport: true,
      };

      const endpoint = selectedDraft
        ? `${process.env.REACT_APP_API}/route/expense/report/update/${organisationId}/${selectedDraft._id}`
        : `${process.env.REACT_APP_API}/route/expense/report/create/${organisationId}`;

      return axios[selectedDraft ? "put" : "post"](endpoint, reportData, {
        headers: { Authorization: authToken },
      });
    },
    {
      onSuccess: (data) => {
        handleAlert(true, "success", "Report submitted successfully");
        queryClient.invalidateQueries(["expenses", organisationId]);
        queryClient.invalidateQueries(["draftExpenses", organisationId]);

        // Clear all form data including report details
        methods.reset({
          reportDetails: {
            reportName: "",
            reportDate: "",
            reportType: { value: "", label: "" },
            reportApprover: { value: "", label: "" },
          },
          expenseName: "",
          category: { value: "", label: "" },
          amount: "",
          startDate: "",
          endDate: "",
          description: "", 
          approver: { value: "", label: "" },
          region: "",
          attachments: [],
          relatedEvent: "",
        });
        setExpenses([]);
        setReportTotal(0);
        setSelectedDraft(null);
        methods.reset();
        setIsSubmitting(false);
        // navigate(`/organisation/${organisationId}/ExpenseManagment`);
      },
      onError: (error) => {
        // handleAlert(true, "error", error.response?.data?.message || "Error processing report");
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error processing report";

        handleAlert(true, "error", errorMessage);
        setIsSubmitting(false);
      },
    }
  );

 
  const handleEditReportDraft = (draft) => {
    setIsReportMode(true);
    setSelectedDraft(draft);

    // Set report details
    methods.reset({
      reportDetails: {
        reportName: draft.reportName || "",
        reportDate: draft.reportDate ? draft.reportDate.split("T")[0] : "",
        reportType: {
          value: draft.reportType || "",
          label: draft.reportType || "",
        },
        reportApprover: draft.approver
          ? {
              value: draft.approver._id || "",
              label: `${draft.approver.first_name || ""} ${
                draft.approver.last_name || ""
              }`,
            }
          // : { value: "", label: "" }, 
          : null,
      },
    });

    // Format expenses with proper category handling
    const formattedExpenses = draft.expenses.map((expense) => {
      // Find matching category from categoryOptions
      const matchingCategory = categoryOptions.find(
        (cat) => cat.value === expense.category
      ) || {
        value: expense.category,
        label: categoriesData?.categories?.find(cat => cat._id === expense.category)?.name || "",
      };
      const processedDynamicFields = {};
      if (expense.dynamicFields) {
        Object.entries(expense.dynamicFields).forEach(([key, value]) => {
          // For select fields that need to be objects with label/value
          if (['roomType', 'mealType', 'transportationType', 'travelClass'].includes(key) && value) {
            processedDynamicFields[key] = {
              label: value,
              value: value
            };
          } else {
            processedDynamicFields[key] = value;
          }
        });
      }


      return {
        expenseName: expense.expenseName || "",
        // category: matchingCategory || {
        //   value: expense.category,
        //   label:
        //     categoryOptions.find((cat) => cat.value === expense.category)
        //       ?.label || "",
        // },
        category: matchingCategory,
        amount: (expense.amount || 0).toString(),
        startDate: expense.startDate ? expense.startDate.split("T")[0] : "",
        endDate: expense.endDate ? expense.endDate.split("T")[0] : "",
        description: expense.description || "",
        approver: expense.approver
          ? {
              value: expense.approver._id || "",
              label: `${expense.approver.first_name || ""} ${
                expense.approver.last_name || ""
              }`,
            }
          : { value: "", label: "" },
        region: expense.region || "",
        attachments: expense.attachments || [],
        relatedEvent: expense.relatedEvent || "",
        dynamicFields: expense.dynamicFields || {},
        isRemotePunchingAllowance: expense.isRemotePunchingAllowance || false,
        remotePunchingDetails: expense.remotePunchingDetails || {
          date: "",
          km: 0,
          allowancePerKm: 0,
          currency: ""
        }
      };
    });

    setExpenses(formattedExpenses);
    setReportTotal(calculateReportTotal(formattedExpenses));
  };

  const handleDeleteReportDraft = async (draftId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/expense/report/draft/${organisationId}/${draftId}`,
        { headers: { Authorization: authToken } }
      );
      queryClient.invalidateQueries(["draftExpenses", organisationId]);
      handleAlert(true, "success", "Report draft deleted successfully");
    } catch (error) {
      handleAlert(true, "error", "Failed to delete report draft");
    }
  };

  const handleSubmitDraft = async (draftId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/expense/draft/${draftId}/submit`,
        {},
        { headers: { Authorization: authToken } }
      );
      queryClient.invalidateQueries(["draftExpenses", organisationId]);
      handleAlert(true, "success", "Draft submitted successfully");
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response?.data?.message || "Error submitting draft"
      );
    }
  };

  const handleSubmit = async (data, isDraft = false) => {
    if (isReportMode && expenses.length > 0) {
      // Check if any expense exceeds its category limit
      const invalidExpenses = [];

      for (const expense of expenses) {
        const category = categoriesData?.categories?.find(
          (cat) => cat._id === expense.category.value
        );

        if (category && category.maxAmount) {
          const isValid = validateExpenseAmount(expense.amount, category);
          if (!isValid) {
            invalidExpenses.push({
              name: expense.expenseName,
              amount: expense.amount,
              limit: category.maxAmount,
              currency: category.currency || "INR",
            });
          }
        }
      }

      // If any invalid expenses found, prevent submission and show alert
      if (invalidExpenses.length > 0) {
        const errorMessages = invalidExpenses
          .map(
            (exp) =>
              `"${exp.name}" (${exp.amount}) exceeds limit of ${exp.limit} ${exp.currency}`
          )
          .join(", ");

        handleAlert(true, "error", `Cannot submit: ${errorMessages}`);
        return;
      }
    }

    setIsSubmitting(true);
    if (isReportMode) {
      createReportMutation.mutate({
        reportDetails: data.reportDetails || methods.getValues("reportDetails"),
        // expenses,
        expenses: expenses.map((expense) => ({
          ...expense,
          dynamicFields: expense.dynamicFields || {},
        })),
        isDraft,
      });
    } else {
      // createExpenseMutation.mutate({ data, isDraft });
      createExpenseMutation.mutate({
        ...data,
        dynamicFields: data.dynamicFields || {},
        isDraft,
      });
    }
  };

  return (
    <BoxComponent>
      <div className="flex flex-col justify-between w-full md:ml-4">
        <div className="flex justify-between items-center mb-4">
          <HeadingOneLineInfo
            // heading={isReportMode ? "Create Expense Report" : selectedDraft ? "Edit Draft Expense" : "Create Expense"}
            // info={isReportMode ? "Create a new expense report" : selectedDraft ? "Edit your draft expense" : "Create and submit new expense reports"}
            heading={
              isReportMode
                ? "Create Expense Report"
                : selectedDraft
                ? "Edit Draft Expense"
                : "Create Expense"
            }
            info={
              isReportMode
                ? "Create a new expense report"
                : selectedDraft
                ? "Edit your draft expense"
                : "Create and submit new expense reports"
            }
          />
        </div>

        <FormProvider {...methods}>
          {isReportMode ? (
            <form className="space-y-6">
              {/* Report Details Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800-4">
                  Report Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <AuthInputFiled
                    name="reportDetails.reportName"
                    label="Report Name *"
                    required
                    placeholder="Enter report name"
                  />
                  <AuthInputFiled
                    name="reportDetails.reportDate"
                    label="Report Date *"
                    type="date"
                    required
                  />
                  <AuthInputFiled
                    name="reportDetails.reportType"
                    label="Report Type *"
                    type="select"
                    options={reportTypesData?.types || []}
                    placeholder="Select Report Type"
                    required
                    // control={control}

                    errors={errors}
                    error={errors?.reportDetails?.reportType}
                    helperText={errors?.reportDetails?.reportType?.message}
                    isClearable={true}
                  />
                 
                  <AuthInputFiled
                    name="reportDetails.reportApprover"
                    // label="Approver *"
                    label="Approver"
                    type="select"
                    options={approverOptions}
                    placeholder="Select Approver"
                    // required
                    //  control={control}
                    errors={errors}
                    isClearable={true}
                    error={errors?.reportDetails?.reportApprover}
                    helperText={errors?.reportDetails?.reportApprover?.message}
                  />
                </div>
              </div>

              {/* Expenses Section */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Side - Expenses Summary */}
                <div className="w-full md:w-1/3">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Expenses Summary
                      </h3>
                      <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Total Items: {expenses.length}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {expenses.map((expense, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {expense.expenseName}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {expense.category.label}
                              </p>
                              <p className="text-lg font-bold text-blue-600 mt-2">
                                ₹{expense.amount}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditExpenseInReport(index)}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveExpense(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {expenses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-lg">No expenses added yet</p>
                          <p className="text-sm mt-2">
                            Add your first expense using the form
                          </p>
                        </div>
                      )}
                      <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-700">
                            Total Amount:
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{reportTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Separator Line */}
                <div className="hidden md:block w-px bg-gray-200 mx-4"></div>

                {/* Right Side - Add Expense Form */}
                <div className="w-full md:w-2/3">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800  mb-4">
                      Add Expense
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <AuthInputFiled
                        name="expenseName"
                        label="Expense Name *"
                        required
                        placeholder="Enter expense name"
                        errors={errors}
                        error={errors.expenseName}
                      />

                      <AuthInputFiled
                        name="category"
                        label="Category"
                        type="select"
                        options={categoryOptions}
                        required
                      />

                      {/*     
                      <AuthInputFiled
                        name="amount"
                        label="Amount*"
                        type="number"
                        required
                        placeholder="Enter amount"
                        errors={errors}
                        error={errors.amount}
                      /> */}

                      <div
                        className={`${
                          categoryLimitExceeded ? "border-red-500" : ""
                        }`}
                      >
                        {/* <AuthInputFiled
                          name="amount"
                          label={`Amount${
                            selectedCategory?.maxAmount
                              ? ` (Limit: ${
                                  selectedCategory.currency || "INR"
                                } ${selectedCategory.maxAmount})`
                              : ""
                          }`}
                          type="number"
                          required
                          placeholder="Enter amount"
                          errors={errors}
                          error={errors.amount || categoryLimitExceeded}
                          helperText={
                            categoryLimitExceeded
                              ? `Exceeds limit of ${
                                  selectedCategory?.maxAmount
                                } ${selectedCategory?.currency || "INR"}`
                              : ""
                          }
                        /> */}
<AuthInputFiled
  name="amount"
  label={`Amount${
    selectedCategory?.maxAmount
      ? ` (Limit: ${
          selectedCategory.currency || "INR"
        } ${selectedCategory.maxAmount})`
      : ""
  }`}
  type="number"
  required
  placeholder="Enter amount"
  errors={errors}
  error={errors.amount || categoryLimitExceeded}
  helperText={
    categoryLimitExceeded
      ? `Exceeds limit of ${
          selectedCategory?.maxAmount
        } ${selectedCategory?.currency || "INR"}`
      : ""
  }
  inputProps={{
    readOnly: methods.watch("isRemotePunchingAllowance"),
  }}
/>

{selectedCategory?.name === "Travel" && 
 remotePunchSettings?.enableAllowance && (
  <div className="col-span-3 ">
     <div className="flex items-center space-x-4">
    <RemotePunchingFetcher
      authToken={authToken}
      employeeId={currentUser._id}
      organisationId={organisationId}
      allowanceAmount={remotePunchSettings.allowanceAmount}
      currency={remotePunchSettings.currency}
       className="flex-1" 
    />
    {methods.watch("isRemotePunchingAllowance") && (
      <div className=" p-3 rounded-md ">
        {/* <Typography variant="body2">
          <strong>Remote Punching Allowance Applied:</strong> {methods.watch("remotePunchingDetails.km")} KM × 
          {methods.watch("remotePunchingDetails.allowancePerKm")} {methods.watch("remotePunchingDetails.currency")} = 
          {methods.watch("amount")} {methods.watch("remotePunchingDetails.currency")}
        </Typography> */}
        <Button
         variant="outlined" 
          size="small" 
          color="primary" 
          fullWidth
          onClick={() => {
            methods.setValue("isRemotePunchingAllowance", false);
            methods.setValue("amount", "");
          }}
         className="flex-1"
        >
          Remove Allowance
        </Button>
      </div>

    )}
  </div>
  </div>

)}
                      </div>

                      {selectedCategory?.type === "default" && (
                        <div className="col-span-3">
                          <DynamicExpenseFields category={selectedCategory} />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <AuthInputFiled
                        name="relatedEvent"
                        label="Related Event"
                        placeholder="Enter related event"
                        errors={errors}
                        error={errors.relatedEvent}
                      />

                      {/* <AuthInputFiled
                        name="startDate"
                        label="Start Date *"
                        type="date"
                        required
                        errors={errors}
                        error={errors.startDate}
                      />
                      <AuthInputFiled
                        name="endDate"
                        label="End Date *"
                        type="date"
                        required
                        errors={errors}
                        error={errors.endDate}
                      /> */}


{!isHotelCategory() && (
    <>
      <AuthInputFiled
        name="startDate"
        label="Start Date "
        type="date"
        required={!isHotelCategory()}
        // errors={errors}
        // error={errors.startDate}
      />
      <AuthInputFiled
        name="endDate"
        label="End Date "
        type="date"
        required={!isHotelCategory()}
        // errors={errors}
        // error={errors.endDate}
      />
    </>
  )}
  
  {/* If there are only 1 or 2 fields showing in this row, add an empty div to maintain grid layout */}
  {isHotelCategory() && (
    <>
      <div></div>
      <div></div>
    </>
  )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* <AuthInputFiled
                        // name="approver"
                        name="reportDetails.reportApprover"
                        // label="Approver *"
                        label="Approver"
                        type="select"
                        options={approverOptions}
                        required
                        errors={errors}
                        // error={errors.approver}
                        error={errors?.reportDetails?.reportApprover}
                        isClearable={true}
                      /> */}
                      <AuthInputFiled
                        name="region"
                        label="Region *"
                        required
                        errors={errors}
                        error={errors.region}
                        placeholder="Add region"
                      />
                      {/* <div className="md:col-span-2"> */}
                      {/* <AuthInputFiled
                        name="attachments"
                        label="Attachments"
                        type="file"
                        inputProps={{
                          accept: ".pdf,.jpg,.jpeg,.png",
                          onChange: (e) => {
                            const files = e.target.files;
                            if (files.length > 0) {
                              methods.setValue("attachments", files[0]);
                            }
                          },
                        }}
                        helperText="Upload receipts and supporting documents"
                      /> */}

                      {/* <AuthInputFiled
  name="attachments"
  label="Attachments"
  type="file"
  inputProps={{
    accept: ".pdf,.jpg,.jpeg,.png",
    onChange: async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          handleAlert(true, "error", "File size should not exceed 5MB");
          return;
        }
        methods.setValue("attachments", file);
      }
    },
  }}
  helperText="Upload receipts and supporting documents (Max 5MB)"
/> */}
                      {/* <AuthInputFiled
  name="attachments"
  label="Attachments"
  type="file"
  inputProps={{
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
    // onChange: (e) => {
    //   const files = e.target.files;
    //   methods.setValue("attachments", files);
    // },
    onChange: (e) => {
      const files = e.target.files;
      const validFiles = Array.from(files).filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });
      
      if (validFiles.length !== files.length) {
        handleAlert(true, "error", "Invalid files detected (max 5MB, PDF/JPEG/PNG only)");
      }
      
      methods.setValue("attachments", validFiles);
    }


  }}
  helperText="Upload receipts (Max 5MB each, PDF/JPEG/PNG)"
/> */}

                      {/* // Modify the attachments input section to display uploaded files */}
                      <AuthInputFiled
                        name="attachments"
                        label="Attachments "
                        type="Typefile"
                        // inputProps={{
                        //   accept: ".pdf,.jpg,.jpeg,.png",
                        //   multiple: true,
                        //   onChange: (e) => {
                        //     const files = e.target.files;
                        //     const validFiles = Array.from(files).filter((file) => {
                        //       const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                        //       return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
                        //     });
                        //     methods.setValue("attachments", files);
                        //   },
                        // }}
                        required
                        // control={control}
                        errors={errors}
                        error={errors.attachments}
                        helperText="Upload receipts (Max 5MB each, PDF/JPEG/PNG)"
                      />
                      {/* // In the form where attachments are handled */}
                      {/* <div className="attachment-list mt-4">
  {expenses.map((expense, index) => (
    expense.attachments?.map((attachment, attIndex) => (
      <AttachmentPreview 
        key={`${index}-${attIndex}`}
        attachment={attachment}
      />
    ))
  ))}
</div> */}
                    </div>
                    {/* </div> */}
                    <div className="md:col-span-2">
                      <AuthInputFiled
                        name="description"
                        label="Description *"
                        multiline
                        rows={4}
                        required
                        errors={errors}
                        error={errors.description}
                        placeholder="Enter expense description"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const values = methods.getValues();
                        handleAddExpense(values);
                      }}
                      className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary"
                    >
                      {editingExpenseIndex !== null
                        ? "Update Expense"
                        : "Add Expense to Report"}
                    </button>

                    
                  </div>
                </div>
              </div>
              {/* </div> */}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setIsReportMode(false);
                    setExpenses([]);
                    methods.reset();
                    navigate(
                      `/organisation/${organisationId}/ExpenseManagment`
                    );
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white"
                  onClick={() => {
                    const formData = methods.getValues();
                    handleSubmit(
                      {
                        reportDetails: formData.reportDetails,
                        ...formData,
                      },
                      true
                    );
                  }}
                  disabled={isSubmitting || expenses.length === 0}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                  onClick={() => {
                    const formData = methods.getValues();
                    handleSubmit(
                      {
                        reportDetails: formData.reportDetails,
                        ...formData,
                      },
                      false
                    );
                  }}
                  disabled={isSubmitting || expenses.length === 0}
                >
                  {isSubmitting ? "Processing..." : "Submit Report"}
                  {/* issues in submiting , need to fix this  after sucessfully  submit the report , still its showing Processing...*/}
                </button>
              </div>
            </form>
          ) : (
            // Single Expense Mode
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuthInputFiled
                  name="expenseName"
                  label="Expense Name"
                  required
                  placeholder="Enter expense name"
                />

                <AuthInputFiled
                  name="amount"
                  label="Amount"
                  type="number"
                  required
                  placeholder="Enter amount"
                />
                <AuthInputFiled
                  name="relatedEvent"
                  label="Related Event"
                  placeholder="Enter related Event"
                />
                <AuthInputFiled
                  name="startDate"
                  label="Start Date"
                  type="date"
                  // required
                />
                <AuthInputFiled
                  name="endDate"
                  label="End Date"
                  type="date"
                  // required
                />
                <AuthInputFiled
                  name="approver"
                  label="Approver"
                  type="select"
                  options={approverOptions}
                  required
                />
                <AuthInputFiled
                  name="region"
                  label="Add region"
                  required
                  placeholder="Add region"
                />
                {/* <AuthInputFiled
                  name="attachments" 
                  label="Attachments"
                  type="file"
                  inputProps={{
                    accept: ".pdf,.jpg,.jpeg,.png",
                    onChange: (e) => {
                      const files = e.target.files;
                      if (files.length > 0) {
                        methods.setValue("attachments", files[0]);
                      }
                    },
                  }}
                  helperText="Upload receipts and supporting documents"
                /> */}

                {/* <AuthInputFiled
  name="attachments"
  label="Attachments"
  type="file"
  inputProps={{
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
    // onChange: (e) => {
    //   const files = e.target.files;
    //   methods.setValue("attachments", files);
    // },

    onChange: (e) => {
      const files = e.target.files;
      const validFiles = Array.from(files).filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });
      
      if (validFiles.length !== files.length) {
        handleAlert(true, "error", "Invalid files detected (max 5MB, PDF/JPEG/PNG only)");
      }
      
      methods.setValue("attachments", validFiles);
    }
  }}
  helperText="Upload receipts (Max 5MB each, PDF/JPEG/PNG)"
/>
 */}
                {/* // Modify the attachments input section to display uploaded files */}
                <AuthInputFiled
                  name="attachments"
                  label="Attachments"
                  type="file"
                  inputProps={{
                    accept: ".pdf,.jpg,.jpeg,.png",
                    multiple: true,
                    onChange: (e) => {
                      const files = e.target.files;
                      const validFiles = Array.from(files).filter((file) => {
                        const validTypes = [
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                        ];
                        return (
                          validTypes.includes(file.type) &&
                          file.size <= 5 * 1024 * 1024
                        );
                      });
                      methods.setValue("attachments", validFiles);
                    },
                  }}
                  helperText="Upload receipts (Max 5MB each, PDF/JPEG/PNG)"
                />
                

                <div className="md:col-span-2">
                  <AuthInputFiled
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    required
                    placeholder="Enter expense description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setSelectedDraft(null);
                    methods.reset();
                    navigate(
                      `/organisation/${organisationId}/ExpenseManagment`
                    );
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white"
                  onClick={() =>
                    methods.handleSubmit((data) => handleSubmit(data, true))()
                  }
                  disabled={isSubmitting}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                  onClick={() =>
                    methods.handleSubmit((data) => handleSubmit(data, false))()
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : selectedDraft
                    ? "Update Expense"
                    : "Create Expense"}
                </button>
              </div>
            </form>
          )}
        </FormProvider>
      </div>
      <br />
      <hr />

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800  mb-4">
            Draft Items
            <br />{" "}
            <span className="text-gray-600 text-sm">
              View and manage your saved expense report drafts before final
              submission
            </span>
          </h2>

          <button
            onClick={() => setShowDrafts(!showDrafts)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center gap-2"
          >
            {showDrafts ? "Hide Drafts" : "Show Drafts"}
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                showDrafts ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {showDrafts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftsData?.reports?.map((draft) => (
              <div
                key={draft._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    {draft.reportName}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-sm">Total Amount:</span>
                      <span className="text-lg font-medium text-emerald-600">
                        ₹{draft.totalAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-sm">Items:</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {draft.expenses.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleEditReportDraft(draft)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReportDraft(draft._id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BoxComponent>
  );
};

export default CreateExpense;

