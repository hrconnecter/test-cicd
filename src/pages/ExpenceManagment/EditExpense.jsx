/* eslint-disable no-unused-vars */
// src/pages/Expense/EditExpense.js
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

const EditExpense = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId, expenseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCurrentUser } = UserProfile();
  const currentUser = getCurrentUser();

  const ExpenseSchema = z.object({
    expenseName: z.string().min(1, "Expense name is required"),
    category: z.object({
      value: z.string().min(1, "Category value is required"),
      label: z.string().min(1, "Category label is required"),
    }),
    approver: z.object({
      value: z.string().min(1, "Approver value is required"),
      label: z.string().min(1, "Approver label is required"),
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    amount: z.string().min(1, "Amount is required"),
    region: z.string().min(1, "Region is required"),
    attachments: z
      .any()
      .transform((files) => (files?.[0] ? Array.from(files) : []))
      .optional(),
    relatedEvent: z.string().optional(),
  });

//   const { data: expenseData, isLoading: isExpenseLoading } = useQuery(
//     ["expense", expenseId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/${expenseId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.expense;
//     }
//   );


const { data: expenseData, isLoading } = useQuery(
    ["expense", expenseId],
    async () => {
      const formData = new FormData();
      formData.append('expenseId', expenseId);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/${expenseId}`,
        { 
          headers: { Authorization: authToken },
          data: formData
        }
      );
      console.log('API Response:', response.data);
      return response.data;
    }
  );
  const updateExpenseMutation = useMutation(
    async ({ data, isDraft }) => {
      const formData = new FormData();
      
      // Append all expense data
      formData.append('expenseName', data.expenseName);
      formData.append('category', data.category.value);
      formData.append('approver', data.approver.value);
      formData.append('startDate', data.startDate);
      formData.append('endDate', data.endDate);
      formData.append('description', data.description);
      formData.append('amount', data.amount);
      formData.append('region', data.region);
      formData.append('status', isDraft ? 'DRAFT' : 'PENDING');
  
      // Handle file attachments
      if (data.attachments instanceof File) {
        formData.append('attachments', data.attachments);
      }
  
      return axios.put(
        `${process.env.REACT_APP_API}/route/expense/${expenseId}`,
        formData,
        { 
          headers: { 
            Authorization: authToken,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
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

  const { data: approversData } = useQuery(
    ["expenseApprovers", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/approvers/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  const methods = useForm({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      expenseName: "",
      category: { value: "", label: "" },
      approver: { value: "", label: "" },
      startDate: "",
      endDate: "",
      description: "",
      amount: "",
      region: "",
      attachments: undefined,
      relatedEvent: "",
    }
  });

  useEffect(() => {
    if (expenseData) {
      methods.reset({
        expenseName: expenseData.expenseName,
        category: {
          value: expenseData.category._id,
          label: expenseData.category.name
        },
        approver: {
          value: expenseData.approver._id,
          label: `${expenseData.approver.first_name} ${expenseData.approver.last_name}`
        },
        startDate: expenseData.startDate.split('T')[0],
        endDate: expenseData.endDate.split('T')[0],
        description: expenseData.description,
        amount: expenseData.amount.toString(),
        region: expenseData.region,
        relatedEvent: expenseData.relatedEvent || ""
      });
    }
  }, [expenseData, methods]);

  const categoryOptions = categoriesData?.categories?.map((cat) => ({
    label: cat.name,
    value: cat._id,
  })) || [];

  const approverOptions = approversData?.data?.approvers?.map((app) => ({
    label: app.name,
    value: app.id,
  })) || [];

  const handleFileExpenseUpload = async (file, selectedValue) => {
    const { data: { url } } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: { "Content-Type": file.type }
    });

    return {
      name: file.name,
      url: url.split("?")[0],
      selectedValue: selectedValue,
    };
  };

  

//   const updateExpenseMutation = useMutation(
//     async ({ data, isDraft }) => {
//       let attachments = [];
//       if (data.attachments instanceof File) {
//         attachments = await handleFileExpenseUpload(data.attachments, data.category.value);
//       }

//       const updateData = {
//         ...data,
//         category: data.category.value,
//         approver: data.approver.value,
//         attachments: attachments.length ? [attachments] : expenseData.attachments,
//         status: isDraft ? 'DRAFT' : 'PENDING'
//       };

//       return axios.put(
//         `${process.env.REACT_APP_API}/route/expense/${expenseId}`,
//         updateData,
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: (response, variables) => {
//         const message = variables.isDraft ? "Expense saved as draft" : "Expense updated successfully";
//         handleAlert(true, "success", message);
//         queryClient.invalidateQueries(["expenses", organisationId]);
//         queryClient.invalidateQueries(["draftExpenses", organisationId]);
//         navigate(`/organisation/${organisationId}/ExpenseManagment`);
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.response?.data?.message || "Error updating expense");
//       },
//       onSettled: () => setIsSubmitting(false)
//     }
//   );

  const handleSubmit = async (data, isDraft = false) => {
    setIsSubmitting(true);
    updateExpenseMutation.mutate({ data, isDraft });
  };

  if (isLoading) {
    return (
      <BoxComponent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading expense data...</div>
        </div>
      </BoxComponent>
    );
  }

  return (
    <BoxComponent>
      <div className="flex flex-col justify-between w-full md:ml-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Edit Expense"}
            info={"Update expense details"}
          />
        </div>

        <FormProvider {...methods}>
          <form className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuthInputFiled
                name="expenseName"
                label="Expense Name"
                required
                placeholder="Enter expense name"
              />

              <AuthInputFiled
                name="category"
                label="Category"
                type="select"
                options={categoryOptions}
                required
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
                required
                placeholder="Enter related Event"
              />

              <AuthInputFiled
                name="startDate"
                label="Start Date"
                type="date"
                required
              />

              <AuthInputFiled
                name="endDate"
                label="End Date"
                type="date"
                required
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

              <AuthInputFiled
                name="attachments"
                label="Attachments"
                type="file"
                inputProps={{
                  accept: ".pdf,.jpg,.jpeg,.png",
                  onChange: (e) => {
                    const files = e.target.files;
                    if (files.length > 0) {
                      methods.setValue('attachments', files[0]);
                    }
                  }
                }}
                helperText="Upload receipts and supporting documents"
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

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => navigate(`/organisation/${organisationId}/ExpenseManagment`)}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white"
                onClick={() => methods.handleSubmit((data) => handleSubmit(data, true))()}
                disabled={isSubmitting}
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                onClick={() => methods.handleSubmit((data) => handleSubmit(data, false))()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Expense"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </BoxComponent>
  );
};

export default EditExpense;
