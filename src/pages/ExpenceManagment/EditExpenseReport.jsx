/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import { useContext, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Select from "react-select";
// import DatePicker from "react-datepicker";


// const EditExpenseReport = () => {

//   const navigate = useNavigate();
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();
//   const { reportId, organisationId } = useParams();


//   // Form data state
//   const [formData, setFormData] = useState({
//     reportName: "",
//     reportDate: new Date(),
//     reportType: "",
//     reportFor: "",
//     expenses: [],
//     totalAmount: 0,
//     status: "PENDING",
//     paymentStatus: "PENDING"
//   });
//   // Fetch report data
//   const { data: report, isLoading: reportLoading } = useQuery(
//     ["expenseReport", reportId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.expenseReport;
//     },
//     {
//       onSuccess: (data) => {
//         setFormData({
//           reportName: data.reportName,
//           reportDate: new Date(data.reportDate),
//           reportType: data.reportType,
//           expenses: data.expenses.map(exp => ({
//             ...exp,
//             startDate: new Date(exp.startDate),
//             endDate: new Date(exp.endDate),
//             category: exp.category
//           }))
//         });
//        }
//     }
//   ); 
 
// // Fetch categories with organizationId
// const { data: categories } = useQuery(
//     ["expenseCategories", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.categories;
//     },
//     {
//       enabled: !!organisationId
//     }
//   );
//  // Fetch approvers with organizationId
//  const { data: approvers } = useQuery(
//     ["expenseApprovers", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/approvers/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.data.approvers;
//     },
//     {
//       enabled: !!organisationId
//     }
//   ); 
 
//   // Update mutation
//   const updateMutation = useMutation(
//     async (updatedData) => {
//       const response = await axios.put(
//         // `${process.env.REACT_APP_API}/route/expense/report/${reportId}`,
//         //  `${process.env.REACT_APP_API}/expense/${organisationId}/report/${reportId}`,
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         updatedData,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("employeeReports");
//         handleAlert(true, "success", "Report updated successfully");
//         navigate(-1);
//       },
//       onError: (error) => {
//         const errorMessage = error.response?.data?.message || "Failed to update report";
//       handleAlert(true, "error", errorMessage);
//       console.error("Update error:", error);
//       }
//     }
//   );



//   // Handle file upload with improved error handling and file validation
// const handleFileUpload = async (file, expenseIndex) => {
//   try {
//     // Validate file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       handleAlert(true, "error", "File size should not exceed 5MB");
//       return;
//     }

//     const { data: { url, key } } = await axios.get(
//       `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );

//     await axios.put(url, file, {
//       headers: { 
//         "Content-Type": file.type,
//         "Cache-Control": "public, max-age=31536000"
//       },
//     });

//     const cleanUrl = url.split('?')[0];
//     const newAttachment = {
//       url: cleanUrl,
//       name: file.name,
//       type: file.type,
//       key,
//       contentDisposition: 'inline'
//     };

//     const updatedExpenses = [...formData.expenses];
//     updatedExpenses[expenseIndex].attachments = [
//       ...(updatedExpenses[expenseIndex].attachments || []),
//       newAttachment
//     ];
    
//     setFormData({ ...formData, expenses: updatedExpenses });
//     handleAlert(true, "success", "File uploaded successfully");
//   } catch (error) {
//     console.error("Upload error:", error);
//     handleAlert(true, "error", "Failed to upload file. Please try again.");
//   }
// };


//   // Handle expense field updates
//   const handleExpenseChange = (index, field, value) => {
//     const updatedExpenses = [...formData.expenses];
//     updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
//     setFormData({ ...formData, expenses: updatedExpenses });
//   };

//   const handleSubmit = () => {
//     const submitData = {
//       ...formData,
//       expenses: formData.expenses.map(exp => ({
//         ...exp,
//         startDate: exp.startDate.toISOString(),
//         endDate: exp.endDate.toISOString()
//       }))
//     };
//     updateMutation.mutate(submitData);
//   };

//   if (reportLoading) return <div>Loading...</div>;

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo
//         heading="Edit Expense Report"
//         info="Update your expense report details here"
//       />

//       <div className="mt-6 space-y-6">
//         {/* Report Details Section */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           {/* <h2 className="text-lg font-medium mb-4">Report Details</h2> */}
//           <h2 className=" text-xl font-semibold mb-6 text-gray-800 flex items-center">Report Details</h2>
       
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Report Name</label>
//               <input
//                 type="text"
//                 value={formData.reportName}
//                 onChange={(e) => setFormData({...formData, reportName: e.target.value})}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Report Date</label>
//               <DatePicker
//                 selected={formData.reportDate}
//                 onChange={(date) => setFormData({...formData, reportDate: date})}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Expenses Section */}
//         {formData.expenses.map((expense, index) => (
//           <div key={expense._id || index} className="bg-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">Expense {index + 1}</h3>

            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Expense Name</label>
//                 <input
//                   type="text"
//                   value={expense.expenseName}
//                   onChange={(e) => handleExpenseChange(index, 'expenseName', e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Category</label>
//                 <Select
//   value={{
//     value: expense.category._id,
//     label: expense.category.name
//   }}
//   onChange={(selected) => handleExpenseChange(index, 'category', {
//     _id: selected.value,
//     name: selected.label
//   })}
//   options={categories?.map(cat => ({
//     value: cat._id,
//     label: cat.name
//   }))}
//   className="mt-1 block w-full"
//   isSearchable={true}
// />

//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                 <input
//                   type="number"
//                   value={expense.amount}
//                   onChange={(e) => handleExpenseChange(index, 'amount', Number(e.target.value))}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Region</label>
//                 <input
//                   type="text"
//                   value={expense.region}
//                   onChange={(e) => handleExpenseChange(index, 'region', e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Start Date</label>
//                 <DatePicker
//                   selected={expense.startDate}
//                   onChange={(date) => handleExpenseChange(index, 'startDate', date)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">End Date</label>
//                 <DatePicker
//                   selected={expense.endDate}
//                   onChange={(date) => handleExpenseChange(index, 'endDate', date)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   value={expense.description}
//                   onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
//                   rows="3"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Approver</label>
  


// <Select
//   value={{
//     value: expense.approver,
//     label: approvers && Array.isArray(approvers) && approvers.find(app => app._id === expense.approver)
//       ? `${approvers.find(app => app._id === expense.approver).first_name} ${approvers.find(app => app._id === expense.approver).last_name}`
//       : ''
//   }}
//   onChange={(selected) => handleExpenseChange(index, 'approver', selected.value)}
//   options={approvers && Array.isArray(approvers) ? approvers.map(app => ({
//     value: app._id,
//     label: `${app.first_name} ${app.last_name}`
//   })) : []}
//   className="mt-1 block w-full"
// />

//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Attachments</label>
//                 <div className="space-y-2">
//                   {expense.attachments?.map((att, idx) => (
//                     <div key={idx} className="flex items-center space-x-2">
//                       <a
//                         href={att.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-500 hover:underline"
//                       >
//                         Attachment {idx + 1}
//                       </a>
//                     </div>
//                   ))}
//                   <input
//                     type="file"
//                     onChange={(e) => handleFileUpload(e.target.files[0], index)}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={updateMutation.isLoading}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//           >
//             {updateMutation.isLoading ? "Updating..." : "Update Report"}
//           </button>
//         </div>
//       </div>
//     </BoxComponent>
//   );
// };

// export default EditExpenseReport;


//✅
// import { useContext, useState, useEffect ,useMemo} from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import UserProfile from "../../hooks/UserData/useUser";
// import DynamicExpenseFields from '../../components/ExpenseFields/DynamicExpenseFields';

// const EditExpenseReport = () => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId, reportId } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { getCurrentUser } = UserProfile();
//   const currentUser = getCurrentUser();
//   const [selectedCategory, setSelectedCategory] = useState(null);
  
//   // Add state for tracking expense being edited
//   const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [reportTotal, setReportTotal] = useState(0);

//   const ExpenseSchema = z.object({
//     reportDetails: z.object({
//       reportName: z.string().min(1, { message: "Report name is required" }),
//       reportDate: z.string().min(1, { message: "Report date is required" }),
//       reportType: z.object({
//         value: z.string().min(1, { message: "Report type is required" }),
//         label: z.string().min(1, { message: "Report type is required" }),
//       }),
//       reportApprover: z.object({
//         value: z.string(),
//         label: z.string(),
//       }).optional()
//     }),
//     // Expense fields
//     expenseName: z.string().min(1, "Expense name is required"),
//     category: z.object({
//       value: z.string().min(1, "Category value is required"),
//       label: z.string().min(1, "Category label is required"),
//     }),
//     approver: z.object({
//       value: z.string(),
//       label: z.string(),
//     }).optional(),
//     startDate: z.string().min(1, "Start date is required"),
//     endDate: z.string().min(1, "End date is required"),
//     description: z.string().min(10, "Description must be at least 10 characters"),
//     amount: z.string().min(1, "Amount is required"),
//     region: z.string().min(1, "Region is required"),
//     attachments: z.any().transform((files) => (files ? Array.from(files) : [])).optional(),
//     relatedEvent: z.string().optional(),
//     dynamicFields: z.object({}).optional()
//   });

//   const methods = useForm({
//     resolver: zodResolver(ExpenseSchema),
//     defaultValues: {
//       reportDetails: {
//         reportName: "",
//         reportDate: "",
//         reportType: { value: "", label: "" },
//         reportApprover: { value: "", label: "" },
//       },
//       expenseName: "",
//       category: null,
//       approver: { value: "", label: "" },
//       startDate: "",
//       endDate: "",
//       description: "",
//       amount: "",
//       region: "",
//       attachments: undefined,
//       relatedEvent: "",
//       dynamicFields: {}
//     },
//   });

//   const selectedCategoryValue = methods.watch('category');

//   // Fetch report data
//   const { data: reportData, isLoading: isReportLoading } = useQuery(
//     ["expenseReport", organisationId, reportId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.expenseReport;
//     },
//     {
//       onSuccess: (data) => {
//         console.log("Fetched report data:", data);
//       }
//     }
//   );

//   // Fetch categories
//   const { data: categoriesData } = useQuery(
//     ["expenseCategories", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Fetch approvers
//   const { data: approversData } = useQuery(
//     ["expenseApprovers", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Fetch report types
//   const { data: reportTypesData } = useQuery(
//     ["reportTypes", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/reportTypes/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Map categories to options
//   const categoryOptions = useMemo(() => {
//     return categoriesData?.categories?.map((cat) => ({
//       label: cat.name,
//       value: cat._id,
//       dynamicFields: cat.dynamicFields,
//       type: cat.type
//     })) || [];
//   }, [categoriesData]);

//   // Map approvers to options
//   const approverOptions = useMemo(() => {
//     const employees = approversData?.employees || [];
    
//     return employees
//       .filter(emp => emp.expenseApprover) 
//       .map(emp => ({
//         value: emp.expenseApprover._id,
//         label: `${emp.expenseApprover.first_name} ${emp.expenseApprover.last_name}`
//       }));
//   }, [approversData]);

//   // Effect to set up form when report data is loaded
//   useEffect(() => {
//     if (reportData && categoryOptions.length > 0) {
//       // Set up report details
//       methods.setValue("reportDetails.reportName", reportData.reportName);
//       methods.setValue("reportDetails.reportDate", reportData.reportDate.split("T")[0]);
//       methods.setValue("reportDetails.reportType", {
//         value: reportData.reportType,
//         label: reportData.reportType
//       });
      
//       if (reportData.approver) {
//         methods.setValue("reportDetails.reportApprover", {
//           value: reportData.approver,
//           label: approverOptions.find(app => app.value === reportData.approver)?.label || ""
//         });
//       }

//       // Format expenses
//       const formattedExpenses = reportData.expenses.map(expense => {
//         // Find the full category object
//         const categoryId = typeof expense.category === 'object' ? expense.category._id : expense.category;
//         const categoryObj = categoryOptions.find(cat => cat.value === categoryId);
        
//         return {
//           _id: expense._id,
//           expenseId: expense.expenseId,
//           expenseName: expense.expenseName,
//           category: {
//             value: categoryId,
//             label: categoryObj?.label || (typeof expense.category === 'object' ? expense.category.name : "")
//           },
//           amount: expense.amount.toString(),
//           startDate: expense.startDate.split("T")[0],
//           endDate: expense.endDate.split("T")[0],
//           description: expense.description,
//           approver: expense.approver ? {
//             value: expense.approver,
//             label: approverOptions.find(app => app.value === expense.approver)?.label || ""
//           } : null,
//           region: expense.region,
//           attachments: expense.attachments || [],
//           relatedEvent: expense.relatedEvent || "",
//           dynamicFields: expense.dynamicFields || {}
//         };
//       });

//       setExpenses(formattedExpenses);
//       setReportTotal(calculateReportTotal(formattedExpenses));
//     }
//   }, [reportData, categoryOptions, approverOptions, methods]);

//   // Effect to update selected category when category changes
//   useEffect(() => {
//     if (selectedCategoryValue) {
//       const category = categoriesData?.categories?.find(
//         cat => cat._id === selectedCategoryValue.value
//       );
//       setSelectedCategory(category);
//     }
//   }, [selectedCategoryValue, categoriesData]);

//   // Handle file upload
//   const handleFileExpenseUpload = async (files) => {
//     if (!files || files.length === 0) return [];
  
//     const uploadedFiles = [];
//     for (const file of files) {
//       if (file.size > 5 * 1024 * 1024) {
//         handleAlert(true, "error", "File size should not exceed 5MB");
//         continue;
//       }
  
//       try {
//         const { data: { url, key } } = await axios.get(
//           `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
//           { headers: { Authorization: authToken } }
//         );
  
//         await axios.put(url, file, {
//           headers: {
//             "Content-Type": file.type,
//             "Cache-Control": "public, max-age=31536000"
//           }
//         });
  
//         uploadedFiles.push({
//           url: url.split("?")[0],
//           name: file.name,
//           type: file.type,
//           key,
//           contentDisposition: "inline"
//         });
//       } catch (error) {
//         console.error("File upload error:", error);
//       }
//     }
//     return uploadedFiles;
//   };

//   // Calculate report total
//   const calculateReportTotal = (expensesList) => {
//     return expensesList.reduce((sum, expense) => {
//       const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
//       return sum + amount;
//     }, 0);
//   };

//   // Handle adding/updating expense
//   const handleAddExpense = async (values) => {
//     // Validate report details
//     const reportFields = [
//       'reportDetails.reportName',
//       'reportDetails.reportDate',
//       'reportDetails.reportType'
//     ];

//     const reportValid = await methods.trigger(reportFields);

//     // Validate expense fields
//     const expenseFields = [
//       'expenseName',
//       'category',
//       'amount', 
//       'startDate',
//       'endDate',
//       'description',
//       'region'
//     ];
  
//     const expenseValid = await methods.trigger(expenseFields);

//     if (!reportValid) {
//       handleAlert(true, "error", "Please fill all required report details");
//       return;
//     }

//     if (!expenseValid) {
//       handleAlert(true, "error", "Please fill all required expense fields");
//       return;
//     }
  
//     setIsSubmitting(true);
//     try {
//       let attachments = [];
//       if (values.attachments && values.attachments.length > 0) {
//         attachments = await handleFileExpenseUpload(values.attachments);
//       }
  
//       const newExpense = {
//         ...values,
//         amount: parseFloat(values.amount),
//         attachments,
//         dynamicFields: values.dynamicFields || {}
//       };
  
//       let updatedExpenses;
//       if (editingExpenseIndex !== null) {
//         updatedExpenses = [...expenses];
//         // Preserve _id and expenseId if they exist
//         if (updatedExpenses[editingExpenseIndex]._id) {
//           newExpense._id = updatedExpenses[editingExpenseIndex]._id;
//         }
//         if (updatedExpenses[editingExpenseIndex].expenseId) {
//           newExpense.expenseId = updatedExpenses[editingExpenseIndex].expenseId;
//         }
//         updatedExpenses[editingExpenseIndex] = newExpense;
//         setExpenses(updatedExpenses);
//         setEditingExpenseIndex(null);
//       } else {
//         updatedExpenses = [...expenses, newExpense];
//         setExpenses(updatedExpenses);
//       }
  
//       setReportTotal(calculateReportTotal(updatedExpenses));
  
//       // Reset form fields except report details
//       const currentReportDetails = methods.getValues("reportDetails");
//       methods.reset({
//         reportDetails: currentReportDetails,
//       });
//     } catch (error) {
//       handleAlert(true, "error", "Failed to add expense");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle editing an expense
//   const handleEditExpenseInReport = (index) => {
//     const expenseToEdit = expenses[index];
//     setEditingExpenseIndex(index);
  
//     methods.reset({
//       ...expenseToEdit,
//       amount: expenseToEdit.amount.toString(),
//       reportDetails: methods.getValues("reportDetails"),
//       dynamicFields: expenseToEdit.dynamicFields || {}
//     });

//     // Find and set the selected category
//     if (expenseToEdit.category) {
//       const categoryId = expenseToEdit.category.value;
//       const category = categoriesData?.categories?.find(cat => cat._id === categoryId);
//       setSelectedCategory(category);
//     }
//   };

//   // Handle removing an expense
//   const handleRemoveExpense = (index) => {
//     if (window.confirm("Are you sure you want to remove this expense?")) {
//       const updatedExpenses = expenses.filter((_, i) => i !== index);
//       setExpenses(updatedExpenses);
//       setReportTotal(calculateReportTotal(updatedExpenses));
//     }
//   };

//   // Update report mutation
//   const updateReportMutation = useMutation(
//     async (reportData) => {
//       return axios.put(
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         reportData,
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         handleAlert(true, "success", "Report updated successfully");
//         queryClient.invalidateQueries(["expenseReport", organisationId, reportId]);
//         navigate(`/organisation/${organisationId}/ExpenseManagment`);
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.response?.data?.message || "Error updating report");
//         setIsSubmitting(false);
//       }
//     }
//   );


//   // Handle form submission
//   const handleSubmit = async () => {
//     if (expenses.length === 0) {
//       handleAlert(true, "error", "Please add at least one expense");
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const reportDetails = methods.getValues("reportDetails");
      
//       // Format expenses for submission
//       const formattedExpenses = expenses.map(expense => ({
//         _id: expense._id, // Include _id if it exists (for existing expenses)
//         expenseId: expense.expenseId, // Include expenseId if it exists
//         expenseName: expense.expenseName,
//         category: expense.category.value,
//         startDate: expense.startDate,
//         endDate: expense.endDate,
//         description: expense.description,
//         amount: parseFloat(expense.amount),
//         approver: expense.approver?.value || null,
//         region: expense.region,
//         attachments: expense.attachments || [],
//         relatedEvent: expense.relatedEvent || "",
//         dynamicFields: expense.dynamicFields || {}
//       }));

//       const reportData = {
//         reportName: reportDetails.reportName,
//         reportDate: reportDetails.reportDate,
//         reportType: reportDetails.reportType.value,
//         reportFor: currentUser._id,
//         reportApprover: reportDetails.reportApprover?.value || null,
//         expenses: formattedExpenses,
//         totalAmount: reportTotal
//       };

//       await updateReportMutation.mutateAsync(reportData);
//     } catch (error) {
//       console.error("Error updating report:", error);
//       handleAlert(true, "error", "Failed to update report");
//       setIsSubmitting(false);
//     }
//   };

//   if (isReportLoading) {
//     return <div className="flex justify-center items-center h-full">Loading...</div>;
//   }

//   return (
//     <BoxComponent>
//       <div className="h-[90vh] overflow-y-auto p-6">
//         <HeadingOneLineInfo
//           heading="Edit Expense Report"
//           info="Update your expense report details and expenses"
//         />

//         <FormProvider {...methods}>
//           <form onSubmit={methods.handleSubmit(handleAddExpense)} className="space-y-6">
//             {/* Report Details Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Report Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <AuthInputFiled
//                   name="reportDetails.reportName"
//                   label="Report Name"
//                   required
//                   placeholder="Enter report name"
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportDate"
//                   label="Report Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportType"
//                   label="Report Type"
//                   type="select"
//                   options={reportTypesData?.types?.map(type => ({
//                     value: type.value,
//                     label: type.label
//                   })) || []}
//                   required
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportApprover"
//                   label="Report Approver"
//                   type="select"
//                   options={approverOptions}
//                 />
//               </div>
//             </div>

//             {/* Add/Edit Expense Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">
//                 {editingExpenseIndex !== null ? "Edit Expense" : "Add Expense"}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <AuthInputFiled
//                   name="expenseName"
//                   label="Expense Name"
//                   required
//                   placeholder="Enter expense name"
//                 />
//                 <AuthInputFiled
//                   name="category"
//                   label="Category"
//                   type="select"
//                   options={categoryOptions}
//                   required
//                 />
//                 <AuthInputFiled
//                   name="startDate"
//                   label="Start Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="endDate"
//                   label="End Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="amount"
//                   label="Amount"
//                   type="number"
//                   required
//                   placeholder="Enter amount"
//                 />
//                 <AuthInputFiled
//                   name="region"
//                   label="Region"
//                   required
//                   placeholder="Enter region"
//                 />
//                 <div className="md:col-span-2">
//                   <AuthInputFiled
//                     name="description"
//                     label="Description"
//                     multiline
//                     rows={3}
//                     required
//                     placeholder="Enter description"
//                   />
//                 </div>
//                 <AuthInputFiled
//                   name="approver"
//                   label="Expense Approver"
//                   type="select"
//                   options={approverOptions}
//                 />
//                 <AuthInputFiled
//                   name="relatedEvent"
//                   label="Related Event"
//                   placeholder="Enter related event"
//                 />
//                 <AuthInputFiled
//                   name="attachments"
//                   label="Attachments"
//                   type="file"
//                   multiple
//                 />
//               </div>

//               {/* Dynamic Fields Section */}
//               {selectedCategory && (
//                 <div className="mt-4">
//                   <h3 className="text-md font-medium mb-2">Category Specific Fields</h3>
//                   <DynamicExpenseFields 
//                     category={selectedCategory} 
//                     register={methods.register}
//                     setValue={methods.setValue}
//                     getValues={methods.getValues}
//                     errors={methods.formState.errors}
//                     watch={methods.watch}
//                   />
//                 </div>
//               )}

//               <div className="mt-4 flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                   disabled={isSubmitting}
//                 >
//                   {editingExpenseIndex !== null ? "Update Expense" : "Add Expense"}
//                 </button>
//               </div>
//             </div>

//             {/* Expenses List Section */}
//             {expenses.length > 0 && (
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold mb-4">Expenses</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date Range
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {expenses.map((expense, index) => (
//                         <tr key={index}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {expense.expenseName}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {expense.category.label}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {new Date(expense.startDate).toLocaleDateString()} - {new Date(expense.endDate).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             ₹{expense.amount}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <button
//                               type="button"
//                               onClick={() => handleEditExpenseInReport(index)}
//                               className="text-indigo-600 hover:text-indigo-900 mr-3"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveExpense(index)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-gray-50">
//                         <td colSpan="3" className="px-6 py-4 text-right font-medium">
//                           Total:
//                         </td>
//                         <td className="px-6 py-4 font-medium">₹{reportTotal.toFixed(2)}</td>
//                         <td></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(`/organisation/${organisationId}/ExpenseManagment`)}
//                 className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
//                 disabled={isSubmitting || expenses.length === 0}
//               >
//                 {isSubmitting ? "Updating..." : "Update Report"}
//               </button>
//             </div>
//           </form>
//         </FormProvider>
//       </div>
//     </BoxComponent>
//   );
// };

// export default EditExpenseReport;

///DEV QA 
// import { useContext, useState, useEffect, useMemo } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import UserProfile from "../../hooks/UserData/useUser";
// import DynamicExpenseFields from '../../components/ExpenseFields/DynamicExpenseFields';

// const EditExpenseReport = () => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId, reportId } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { getCurrentUser } = UserProfile();
//   const currentUser = getCurrentUser();
//   const [selectedCategory, setSelectedCategory] = useState(null);
  
//   // Add state for tracking expense being edited
//   const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [reportTotal, setReportTotal] = useState(0);

//   const ExpenseSchema = z.object({
//     reportDetails: z.object({
//       reportName: z.string().min(1, { message: "Report name is required" }),
//       reportDate: z.string().min(1, { message: "Report date is required" }),
//       reportType: z.object({
//         value: z.string().min(1, { message: "Report type is required" }),
//         label: z.string().min(1, { message: "Report type is required" }),
//       }),
//       reportApprover: z.object({
//         value: z.string(),
//         label: z.string(),
//       }).optional()
//     }),
//     // Expense fields
//     expenseName: z.string().min(1, "Expense name is required"),
//     category: z.object({
//       value: z.string().min(1, "Category value is required"),
//       label: z.string().min(1, "Category label is required"),
//     }),
//     approver: z.object({
//       value: z.string(),
//       label: z.string(),
//     }).optional(),
//     startDate: z.string().min(1, "Start date is required"),
//     endDate: z.string().min(1, "End date is required"),
//     description: z.string().min(10, "Description must be at least 10 characters"),
//     amount: z.string().min(1, "Amount is required"),
//     region: z.string().min(1, "Region is required"),
//     attachments: z.any().transform((files) => (files ? Array.from(files) : [])).optional(),
//     relatedEvent: z.string().optional(),
//     dynamicFields: z.object({}).optional()
//   });

//   const methods = useForm({
//     resolver: zodResolver(ExpenseSchema),
//     defaultValues: {
//       reportDetails: {
//         reportName: "",
//         reportDate: "",
//         reportType: { value: "", label: "" },
//         reportApprover: { value: "", label: "" },
//       },
//       expenseName: "",
//       category: null,
//       approver: { value: "", label: "" },
//       startDate: "",
//       endDate: "",
//       description: "",
//       amount: "",
//       region: "",
//       attachments: undefined,
//       relatedEvent: "",
//       dynamicFields: {}
//     },
//   });

//   const selectedCategoryValue = methods.watch('category');
//   const { formState: { errors } } = methods;

//   // Fetch report data
//   const { data: reportData, isLoading: isReportLoading } = useQuery(
//     ["expenseReport", organisationId, reportId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.expenseReport;
//     },
//     {
//       onSuccess: (data) => {
//         console.log("Fetched report data:", data);
//       }
//     }
//   );

//   // Fetch categories
//   const { data: categoriesData } = useQuery(
//     ["expenseCategories", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Fetch approvers
//   const { data: approversData } = useQuery(
//     ["expenseApprovers", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Fetch report types
//   const { data: reportTypesData } = useQuery(
//     ["reportTypes", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/reportTypes/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     }
//   );

//   // Map categories to options
//   const categoryOptions = useMemo(() => {
//     return categoriesData?.categories?.map((cat) => ({
//       label: cat.name,
//       value: cat._id,
//     })) || [];
//   }, [categoriesData]);

//   // Map approvers to options
//   const approverOptions = useMemo(() => {
//     const employees = approversData?.employees || [];
    
//     return employees
//       .filter(emp => emp.expenseApprover) 
//       .map(emp => ({
//         value: emp.expenseApprover._id,
//         label: `${emp.expenseApprover.first_name} ${emp.expenseApprover.last_name}`
//       }));
//   }, [approversData]);

//   // Effect to set up form when report data is loaded
//   useEffect(() => {
//     if (reportData && categoryOptions.length > 0) {
//       // Set up report details
//       methods.setValue("reportDetails.reportName", reportData.reportName);
//       methods.setValue("reportDetails.reportDate", reportData.reportDate.split("T")[0]);
//       methods.setValue("reportDetails.reportType", {
//         value: reportData.reportType,
//         label: reportData.reportType
//       });
      
//       if (reportData.approver) {
//         methods.setValue("reportDetails.reportApprover", {
//           value: reportData.approver,
//           label: approverOptions.find(app => app.value === reportData.approver)?.label || ""
//         });
//       }

//       // Format expenses
//       const formattedExpenses = reportData.expenses.map(expense => {
//         // Find the full category object
//         const categoryId = typeof expense.category === 'object' ? expense.category._id : expense.category;
//         const categoryObj = categoryOptions.find(cat => cat.value === categoryId);
        
//         return {
//           _id: expense._id,
//           expenseId: expense.expenseId,
//           expenseName: expense.expenseName,
//           category: {
//             value: categoryId,
//             label: categoryObj?.label || (typeof expense.category === 'object' ? expense.category.name : "")
//           },
//           amount: expense.amount.toString(),
//           startDate: expense.startDate.split("T")[0],
//           endDate: expense.endDate.split("T")[0],
//           description: expense.description,
//           approver: expense.approver ? {
//             value: expense.approver,
//             label: approverOptions.find(app => app.value === expense.approver)?.label || ""
//           } : null,
//           region: expense.region,
//           attachments: expense.attachments || [],
//           relatedEvent: expense.relatedEvent || "",
//           dynamicFields: expense.dynamicFields || {}
//         };
//       });

//       setExpenses(formattedExpenses);
//       setReportTotal(calculateReportTotal(formattedExpenses));
//     }
//   }, [reportData, categoryOptions, approverOptions, methods]);

//   // Effect to update selected category when category changes
//   useEffect(() => {
//     if (selectedCategoryValue) {
//       const category = categoriesData?.categories?.find(
//         cat => cat._id === selectedCategoryValue.value
//       );
//       setSelectedCategory(category);
//     }
//   }, [selectedCategoryValue, categoriesData]);

//   // Handle file upload
//   const handleFileExpenseUpload = async (files) => {
//     if (!files || files.length === 0) return [];
  
//     const uploadedFiles = [];
//     for (const file of files) {
//       if (file.size > 5 * 1024 * 1024) {
//         handleAlert(true, "error", "File size should not exceed 5MB");
//         continue;
//       }
  
//       try {
//         const { data: { url, key } } = await axios.get(
//           `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
//           { headers: { Authorization: authToken } }
//         );
  
//         await axios.put(url, file, {
//           headers: {
//             "Content-Type": file.type,
//             "Cache-Control": "public, max-age=31536000"
//           }
//         });
  
//         uploadedFiles.push({
//           url: url.split("?")[0],
//           name: file.name,
//           type: file.type,
//           key,
//           contentDisposition: "inline"
//         });
//       } catch (error) {
//         console.error("File upload error:", error);
//       }
//     }
//     return uploadedFiles;
//   };

//   // Calculate report total
//   const calculateReportTotal = (expensesList) => {
//     return expensesList.reduce((sum, expense) => {
//       const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
//       return sum + amount;
//     }, 0);
//   };

//   // Handle adding/updating expense
//   const handleAddExpense = async (values) => {
//     // Validate report details
//     const reportFields = [
//       'reportDetails.reportName',
//       'reportDetails.reportDate',
//       'reportDetails.reportType'
//     ];

//     const reportValid = await methods.trigger(reportFields);

//     // Validate expense fields
//     const expenseFields = [
//       'expenseName',
//       'category',
//       'amount', 
//       'startDate',
//       'endDate',
//       'description',
//       'region'
//     ];
  
//     const expenseValid = await methods.trigger(expenseFields);

//     if (!reportValid) {
//       handleAlert(true, "error", "Please fill all required report details");
//       return;
//     }

//     if (!expenseValid) {
//       handleAlert(true, "error", "Please fill all required expense fields");
//       return;
//     }
  
//     setIsSubmitting(true);
//     try {
//       let attachments = [];
//       if (values.attachments && values.attachments.length > 0) {
//         attachments = await handleFileExpenseUpload(values.attachments);
//       }
  
//  // Ensure dynamicFields is properly captured
//  const dynamicFields = values.dynamicFields || {};
//  // Log for debugging
//  console.log("Dynamic fields captured:", dynamicFields);

//       const newExpense = {
//         ...values,
//         amount: parseFloat(values.amount),
//         attachments,
//         dynamicFields: dynamicFields
//       };
  
//       let updatedExpenses;
//       if (editingExpenseIndex !== null) {
//         updatedExpenses = [...expenses];
//         // Preserve _id and expenseId if they exist
//         if (updatedExpenses[editingExpenseIndex]._id) {
//           newExpense._id = updatedExpenses[editingExpenseIndex]._id;
//         }
//         if (updatedExpenses[editingExpenseIndex].expenseId) {
//           newExpense.expenseId = updatedExpenses[editingExpenseIndex].expenseId;
//         }
//         updatedExpenses[editingExpenseIndex] = newExpense;
//         setExpenses(updatedExpenses);
//         setEditingExpenseIndex(null);
//       } else {
//         updatedExpenses = [...expenses, newExpense];
//         setExpenses(updatedExpenses);
//       }
  
//       setReportTotal(calculateReportTotal(updatedExpenses));
  
//       // Reset form fields except report details
//       const currentReportDetails = methods.getValues("reportDetails");
//       methods.reset({
//         reportDetails: currentReportDetails,
//       });
//     } catch (error) {
//       handleAlert(true, "error", "Failed to add expense");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle editing an expense
//   const handleEditExpenseInReport = (index) => {
//     const expenseToEdit = expenses[index];
//     setEditingExpenseIndex(index);
  
//     methods.reset({
//       ...expenseToEdit,
//       amount: expenseToEdit.amount.toString(),
//       reportDetails: methods.getValues("reportDetails"),
//       dynamicFields: expenseToEdit.dynamicFields || {}
//     });

//     // Find and set the selected category
//     if (expenseToEdit.category) {
//       const categoryId = expenseToEdit.category.value;
//       const category = categoriesData?.categories?.find(cat => cat._id === categoryId);
//       setSelectedCategory(category);
//     }
//   };

//   // Handle removing an expense
//   const handleRemoveExpense = (index) => {
//     if (window.confirm("Are you sure you want to remove this expense?")) {
//       const updatedExpenses = expenses.filter((_, i) => i !== index);
//       setExpenses(updatedExpenses);
//       setReportTotal(calculateReportTotal(updatedExpenses));
//     }
//   };

//   // Update report mutation
//   const updateReportMutation = useMutation(
//     async (reportData) => {
//       return axios.put(
//         `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
//         reportData,
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         handleAlert(true, "success", "Report updated successfully");
//         queryClient.invalidateQueries(["expenseReport", organisationId, reportId]);
//         navigate(`/organisation/${organisationId}/ExpenseManagment`);
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.response?.data?.message || "Error updating report");
//         setIsSubmitting(false);
//       }
//     }
//   );

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (expenses.length === 0) {
//       handleAlert(true, "error", "Please add at least one expense");
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const reportDetails = methods.getValues("reportDetails");
      
//       // Format expenses
//       // Format expenses for submission
//       const formattedExpenses = expenses.map(expense => ({
//         _id: expense._id, // Include _id if it exists (for existing expenses)
//         expenseId: expense.expenseId, // Include expenseId if it exists
//         expenseName: expense.expenseName,
//         // category: expense.category.value,
//         category: typeof expense.category === 'object' ? expense.category.value : expense.category,
//         startDate: expense.startDate,
//         endDate: expense.endDate,
//         description: expense.description,
//         amount: parseFloat(expense.amount),
//         approver: expense.approver?.value || null,
//         region: expense.region,
//         attachments: expense.attachments || [],
//         relatedEvent: expense.relatedEvent || "",
//         dynamicFields: expense.dynamicFields || {}
//       }));

//       const reportData = {
//         reportName: reportDetails.reportName,
//         reportDate: reportDetails.reportDate,
//         reportType: reportDetails.reportType.value,
//         reportFor: currentUser._id,
//         reportApprover: reportDetails.reportApprover?.value || null,
//         expenses: formattedExpenses,
//         totalAmount: reportTotal
//       };

//       await updateReportMutation.mutateAsync(reportData);
//     } catch (error) {
//       console.error("Error updating report:", error);
//       handleAlert(true, "error", "Failed to update report");
//       setIsSubmitting(false);
//     }
//   };

//   if (isReportLoading) {
//     return <div className="flex justify-center items-center h-full">Loading...</div>;
//   }

//   return (
//     <BoxComponent>
//       <div className="h-[90vh] overflow-y-auto p-6">
//         <HeadingOneLineInfo
//           heading="Edit Expense Report"
//           info="Update your expense report details and expenses"
//         />

//         <FormProvider {...methods}>
//           <form onSubmit={methods.handleSubmit(handleAddExpense)} className="space-y-6">
//             {/* Report Details Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Report Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <AuthInputFiled
//                   name="reportDetails.reportName"
//                   label="Report Name"
//                   required
//                   placeholder="Enter report name"
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportDate"
//                   label="Report Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportType"
//                   label="Report Type"
//                   type="select"
//                   options={reportTypesData?.types?.map(type => ({
//                     value: type.value,
//                     label: type.label
//                   })) || []}
//                   required
//                 />
//                 <AuthInputFiled
//                   name="reportDetails.reportApprover"
//                   label="Report Approver"
//                   type="select"
//                   options={approverOptions}
//                 />
//               </div>
//             </div>

//             {/* Add/Edit Expense Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">
//                 {editingExpenseIndex !== null ? "Edit Expense" : "Add Expense"}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <AuthInputFiled
//                   name="expenseName"
//                   label="Expense Name"
//                   required
//                   placeholder="Enter expense name"
//                 />
//                 <AuthInputFiled
//                   name="category"
//                   label="Category"
//                   type="select"
//                   options={categoryOptions}
//                   required
//                 />
//                 <AuthInputFiled
//                   name="startDate"
//                   label="Start Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="endDate"
//                   label="End Date"
//                   type="date"
//                   required
//                 />
//                 <AuthInputFiled
//                   name="amount"
//                   label="Amount"
//                   type="number"
//                   required
//                   placeholder="Enter amount"
//                 />
//                 <AuthInputFiled
//                   name="region"
//                   label="Region"
//                   required
//                   placeholder="Enter region"
//                 />
//                 <div className="md:col-span-2">
//                   <AuthInputFiled
//                     name="description"
//                     label="Description"
//                     multiline
//                     rows={3}
//                     required
//                     placeholder="Enter description"
//                   />
//                 </div>
//                 <AuthInputFiled
//                   name="approver"
//                   label="Expense Approver"
//                   type="select"
//                   options={approverOptions}
//                 />
//                 <AuthInputFiled
//                   name="relatedEvent"
//                   label="Related Event"
//                   placeholder="Enter related event"
//                 />
//                 <AuthInputFiled
//                   name="attachments"
//                   label="Attachments"
//                   type="file"
//                   multiple
//                 />
//               </div>

//               {/* Dynamic Fields Section */}
//               {selectedCategory && (
//                 <div className="mt-4">
//                   <h3 className="text-md font-medium mb-2">Category Specific Fields</h3>
//                   <DynamicExpenseFields 
//                     category={selectedCategory} 
//                     register={methods.register}
//                     setValue={methods.setValue}
//                     getValues={methods.getValues}
//                     errors={methods.formState.errors}
//                     watch={methods.watch}
//                   />
//                 </div>
//               )}

//               <div className="mt-4 flex justify-end">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                   disabled={isSubmitting}
//                 >
//                   {editingExpenseIndex !== null ? "Update Expense" : "Add Expense"}
//                 </button>
//               </div>
//             </div>

//             {/* Expenses List Section */}
//             {expenses.length > 0 && (
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold mb-4">Expenses</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date Range
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {expenses.map((expense, index) => (
//                         <tr key={index}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {expense.expenseName}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {expense.category.label}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {new Date(expense.startDate).toLocaleDateString()} - {new Date(expense.endDate).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             ₹{expense.amount}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <button
//                               type="button"
//                               onClick={() => handleEditExpenseInReport(index)}
//                               className="text-indigo-600 hover:text-indigo-900 mr-3"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveExpense(index)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-gray-50">
//                         <td colSpan="3" className="px-6 py-4 text-right font-medium">
//                           Total:
//                         </td>
//                         <td className="px-6 py-4 font-medium">₹{reportTotal.toFixed(2)}</td>
//                         <td></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(`/organisation/${organisationId}/ExpenseManagment`)}
//                 className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
//                 disabled={isSubmitting || expenses.length === 0}
//               >
//                 {isSubmitting ? "Updating..." : "Update Report"}
//               </button>
//             </div>
//           </form>
//         </FormProvider>
//       </div>
//     </BoxComponent>
//   );
// };

// export default EditExpenseReport;


//NEW
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect, useMemo } from "react";
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
import DynamicExpenseFields from '../../components/ExpenseFields/DynamicExpenseFields';
import RemotePunchingFetcher from "../../components/ExpenseFields/RemotePunchingFetcher";
import { Button, Typography } from "@mui/material";

const EditExpenseReport = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId, reportId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCurrentUser } = UserProfile();
  const currentUser = getCurrentUser();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLimitExceeded, setCategoryLimitExceeded] = useState(false);
  
  // Add state for tracking expense being edited
  const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);
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
      reportApprover: z.object({
        value: z.string(),
        label: z.string(),
      }).optional().nullable(),
    }),
    // Expense fields
    expenseName: z.string().min(1, "Expense name is required"),
    category: z.object({
      value: z.string().min(1, "Category value is required"),
      label: z.string().min(1, "Category label is required"),
    }),
    approver: z.object({
      value: z.string(),
      label: z.string(),
    }).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    amount: z.string().min(1, "Amount is required"),
    region: z.string().min(1, "Region is required"),
    attachments: z.any().transform((files) => (files ? Array.from(files) : [])).optional(),
    relatedEvent: z.string().optional(),
    
    isRemotePunchingAllowance: z.boolean().optional(),
    remotePunchingDetails: z.object({
      date: z.string().optional(),
      km: z.number().optional(),
      allowancePerKm: z.number().optional(),
      currency: z.string().optional(),
    }).optional(),
    
    dynamicFields: z.object({
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
    }).optional(),
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
        reportApprover: null,
      },
      expenseName: "",
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

  const selectedCategoryValue = methods.watch('category');
  const { formState: { errors } } = methods;

  // Fetch report data
  const { data: reportData, isLoading: isReportLoading } = useQuery(
    ["expenseReport", organisationId, reportId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data.expenseReport;
    },
    {
      onSuccess: (data) => {
        console.log("Fetched report data:", data);
      }
    }
  );

  // Fetch categories
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

  // Fetch approvers
  const { data: approversData } = useQuery(
    ["expenseApprovers", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  // Fetch report types
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

  // Fetch remote punch settings
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

  // Map categories to options
  const categoryOptions = useMemo(() => {
    return categoriesData?.categories?.map((cat) => ({
      label: cat.name,
      value: cat._id,
    })) || [];
  }, [categoriesData]);

  // Map approvers to options
  const approverOptions = useMemo(() => {
    const employees = approversData?.employees || [];
    
    return employees
      .filter(emp => emp.expenseApprover) 
      .map(emp => ({
        value: emp.expenseApprover._id,
        label: `${emp.expenseApprover.first_name} ${emp.expenseApprover.last_name}`
      }));
  }, [approversData]);

  // Effect to update selected category when category changes
  useEffect(() => {
    if (selectedCategoryValue) {
      const category = categoriesData?.categories?.find(
        cat => cat._id === selectedCategoryValue.value
      );
      setSelectedCategory(category);
      setCategoryLimitExceeded(false);

      if (category?.name === 'Hotel') {
        methods.setValue('startDate', '');
        methods.setValue('endDate', '');
      }
    }
  }, [selectedCategoryValue, categoriesData, methods]);

  // Effect to set up form when report data is loaded
  useEffect(() => {
    if (reportData && categoryOptions.length > 0) {
      // Set up report details
      methods.setValue("reportDetails.reportName", reportData.reportName);
      methods.setValue("reportDetails.reportDate", reportData.reportDate.split("T")[0]);
      methods.setValue("reportDetails.reportType", {
        value: reportData.reportType,
        label: reportData.reportType
      });
      
      if (reportData.approver) {
        methods.setValue("reportDetails.reportApprover", {
          value: reportData.approver,
          label: approverOptions.find(app => app.value === reportData.approver)?.label || ""
        });
      } else {
        methods.setValue("reportDetails.reportApprover", null);
      }

      // Format expenses
      const formattedExpenses = reportData.expenses.map(expense => {
        // Find the full category object
        const categoryId = typeof expense.category === 'object' ? expense.category._id : expense.category;
        const categoryObj = categoryOptions.find(cat => cat.value === categoryId);
        
        // Process dynamic fields to handle select fields properly
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
          _id: expense._id,
          expenseId: expense.expenseId,
          expenseName: expense.expenseName,
          category: {
            value: categoryId,
            label: categoryObj?.label || (typeof expense.category === 'object' ? expense.category.name : "")
          },
          amount: expense.amount.toString(),
          startDate: expense.startDate ? expense.startDate.split("T")[0] : "",
          endDate: expense.endDate ? expense.endDate.split("T")[0] : "",
          description: expense.description,
          approver: expense.approver ? {
            value: expense.approver,
            label: approverOptions.find(app => app.value === expense.approver)?.label || ""
          } : null,
          region: expense.region,
          attachments: expense.attachments || [],
          relatedEvent: expense.relatedEvent || "",
          dynamicFields: processedDynamicFields,
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
    }
  }, [reportData, categoryOptions, approverOptions, methods]);

  // Validate expense amount against category limit
  const validateExpenseAmount = (amount, category) => {
    if (!category || !category.maxAmount) return true;

    const numAmount = Number(amount);
    const maxAmount = Number(category.maxAmount);

    return numAmount <= maxAmount;
  };

  // Effect to check amount against category limit
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
  }, [methods.watch("amount"), selectedCategory, handleAlert]);

  // Handle file upload
  const handleFileExpenseUpload = async (files) => {
    if (!files || files.length === 0) return [];
  
    const uploadedFiles = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        handleAlert(true, "error", "File size should not exceed 5MB");
        continue;
      }
  
      try {
        const { data: { url, key } } = await axios.get(
          `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
          { headers: { Authorization: authToken } }
        );
  
        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=31536000"
          }
        });
  
        uploadedFiles.push({
          url: url.split("?")[0],
          name: file.name,
          type: file.type,
          key,
          contentDisposition: "inline"
        });
      } catch (error) {
        console.error("File upload error:", error);
      }
    }
    return uploadedFiles;
  };

  // Calculate report total
  const calculateReportTotal = (expensesList) => {
    return expensesList.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      return sum + amount;
    }, 0);
  };

  // Handle adding/updating expense
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
        dynamicFields: values.dynamicFields || {},
        approver: reportApprover
      };

      let updatedExpenses;
      if (editingExpenseIndex !== null) {
        updatedExpenses = [...expenses];
        // Preserve _id and expenseId if they exist
        if (updatedExpenses[editingExpenseIndex]._id) {
          newExpense._id = updatedExpenses[editingExpenseIndex]._id;
        }
        if (updatedExpenses[editingExpenseIndex].expenseId) {
          newExpense.expenseId = updatedExpenses[editingExpenseIndex].expenseId;
        }
        updatedExpenses[editingExpenseIndex] = newExpense;
        setExpenses(updatedExpenses);
        setEditingExpenseIndex(null);
        setReportTotal(calculateReportTotal(updatedExpenses));
      } else {
        updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
        setReportTotal(calculateReportTotal(updatedExpenses));
      }

      // Reset form fields except report details
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

  // Handle editing an expense
  const handleEditExpenseInReport = (index) => {
    const expenseToEdit = expenses[index];
    setEditingExpenseIndex(index);
    
    const reportApprover = methods.getValues("reportDetails.reportApprover");

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
        amount: expenseToEdit.amount.toString(),
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

  // Handle removing an expense
  const handleRemoveExpense = (index) => {
    if (window.confirm("Are you sure you want to remove this expense?")) {
      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
      setReportTotal(calculateReportTotal(updatedExpenses));
    }
  };

  // Update report mutation
  const updateReportMutation = useMutation(
    async (reportData) => {
      return axios.put(
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
        reportData,
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Report updated successfully");
        queryClient.invalidateQueries(["expenseReport", organisationId, reportId]);
        navigate(`/organisation/${organisationId}/ExpenseManagment`);
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error updating report";
        handleAlert(true, "error", errorMessage);
        setIsSubmitting(false);
      }
    }
  );

  // Handle form submission
  const handleSubmit = async () => {
    if (expenses.length === 0) {
      handleAlert(true, "error", "Please add at least one expense");
      return;
    }

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

    setIsSubmitting(true);
    
    try {
      const reportDetails = methods.getValues("reportDetails");
      const reportApprover = reportDetails.reportApprover?.value || null;
      
      // Process expenses for submission
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
          _id: expense._id, // Include _id if exists
          expenseId: expense.expenseId, // Include expenseId if exists
          expenseName: expense.expenseName,
          category: typeof expense.category === 'object' ? expense.category.value : expense.category,
          dynamicFields: processedDynamicFields,
          startDate: expense.startDate || null,
          endDate: expense.endDate || null,
          description: expense.description,
          amount: parseFloat(expense.amount),
          approver: reportApprover,
          region: expense.region,
          attachments: expense.attachments || [],
          relatedEvent: expense.relatedEvent || "",
          status: "PENDING",
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
        reportFor: currentUser._id,
        reportApprover: reportApprover,
        organizationId: organisationId,
        employeeId: currentUser._id,
        creatorRole: currentUser.profile,
        expenses: processedExpenses,
        status: "PENDING",
        totalAmount: reportTotal,
        isReport: true,
      };

      await updateReportMutation.mutateAsync(reportData);
    } catch (error) {
      console.error("Error updating report:", error);
      handleAlert(true, "error", "Failed to update report");
      setIsSubmitting(false);
    }
  };

  if (isReportLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <BoxComponent>
      <div className="h-[90vh] overflow-y-auto p-6">
        <HeadingOneLineInfo
          heading="Edit Expense Report"
          info="Update your expense report details and expenses"
        />

        <FormProvider {...methods}>
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
                  errors={errors}
                  error={errors?.reportDetails?.reportType}
                  helperText={errors?.reportDetails?.reportType?.message}
                  isClearable={true}
                />
                <AuthInputFiled
                  name="reportDetails.reportApprover"
                  label="Approver"
                  type="select"
                  options={approverOptions}
                  placeholder="Select Approver"
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingExpenseIndex !== null ? "Edit Expense" : "Add Expense"}
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

                    <div
                      className={`${
                        categoryLimitExceeded ? "border-red-500" : ""
                      }`}
                    >
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
                              <div className="p-3 rounded-md">
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

                    {!isHotelCategory() && (
                      <>
                        <AuthInputFiled
                          name="startDate"
                          label="Start Date "
                          type="date"
                          required={!isHotelCategory()}
                          errors={errors}
                          error={errors.startDate}
                        />
                        <AuthInputFiled
                          name="endDate"
                          label="End Date "
                          type="date"
                          required={!isHotelCategory()}
                          errors={errors}
                          error={errors.endDate}
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
                    <AuthInputFiled
                      name="region"
                      label="Region *"
                      required
                      errors={errors}
                      error={errors.region}
                      placeholder="Add region"
                    />
                    <AuthInputFiled
                      name="attachments"
                      label="Attachments "
                      type="Typefile"
                      required
                      errors={errors}
                      error={errors.attachments}
                      helperText="Upload receipts (Max 5MB each, PDF/JPEG/PNG)"
                    />
                  </div>
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

            {/* Submit Button */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => {
                  navigate(`/organisation/${organisationId}/ExpenseManagment`);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting || expenses.length === 0}
              >
                {isSubmitting ? "Processing..." : "Update Report"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </BoxComponent>
  );
};

export default EditExpenseReport;










// Now i wanna cross check , the update  expense report functionallity is working properly or not >check api >Request URL:
// http://localhost:4000/route/expense/66a9fcd5a2ab524009bc86c9/report/67de9981d8f7b820436a0e8a
// Request Method:
// PUT
// Status Code:
// 200 OK >Payload>{
//     "reportName": "Saturday Exp Check ",
//     "reportDate": "2025-03-22",
//     "reportType": "TRAVEL",
//     "reportFor": "66ebb3b353648e2f0592afee",
//     "reportApprover": null,
//     "organizationId": "66a9fcd5a2ab524009bc86c9",
//     "employeeId": "66ebb3b353648e2f0592afee",
//     "creatorRole": [
//         "Employee"
//     ],
//     "expenses": [
//         {
//             "_id": "67de9981d8f7b820436a0e8b",
//             "expenseId": "REID300226",
//             "expenseName": "Travel Accomodation V2",
//             "category": "67dbb4f3bdb88c8b067d2cb8",
//             "dynamicFields": {
//                 "clientProjectName": "AEGIS PROJECT V2",
//                 "transportationType": "Flight",
//                 "ticketNumber": "FLIGHT2222222222",
//                 "travelClass": "Economy"
//             },
//             "startDate": "2025-03-13",
//             "endDate": "2025-03-13",
//             "description": "ARGAN REPORT OF EXPENSE",
//             "amount": 4350,
//             "approver": null,
//             "region": "maharashtra",
//             "attachments": [],
//             "relatedEvent": "ARGAN REPORT OF EXPENSE",
//             "status": "PENDING",
//             "firstLevelStatus": "PENDING",
//             "finalStatus": "PENDING",
//             "isRemotePunchingAllowance": true,
//             "remotePunchingDetails": {
//                 "date": "2025-03-13",
//                 "km": 43,
//                 "allowancePerKm": 100,
//                 "currency": "INR"
//             }
//         },
//         {
//             "_id": "67de9981d8f7b820436a0e8c",
//             "expenseId": "REID300227",
//             "expenseName": "fOOD V2",
//             "category": "67dbb4f3bdb88c8b067d2cc9",
//             "dynamicFields": {
//                 "restaurantName": "AP RESTRO",
//                 "mealType": "breakfast",
//                 "restaurantAddress": "456 Oak St, Townsvil",
//                 "transportationType": "Flight",
//                 "clientProjectName": "AEGIS PROJECT",
//                 "ticketNumber": "FLIGHT2222222222",
//                 "travelClass": "Economy"
//             },
//             "startDate": "2025-03-22",
//             "endDate": "2025-03-22",
//             "description": "ARGAN REPORT OF EXPENSE",
//             "amount": 550,
//             "approver": null,
//             "region": "maharashtra",
//             "attachments": [],
//             "relatedEvent": "Meeting",
//             "status": "PENDING",
//             "firstLevelStatus": "PENDING",
//             "finalStatus": "PENDING",
//             "isRemotePunchingAllowance": false,
//             "remotePunchingDetails": {
//                 "date": "",
//                 "km": 0,
//                 "allowancePerKm": 0,
//                 "currency": ""
//             }
//         },
//         {
//             "_id": "67de9981d8f7b820436a0e8d",
//             "expenseId": "REID300228",
//             "expenseName": "Hotel Stay",
//             "category": "67dbb4f3bdb88c8b067d2cc0",
//             "dynamicFields": {
//                 "hotelName": "Hotel Tip Top",
//                 "checkInDate": "2025-03-22T00:00:00.000Z",
//                 "checkOutDate": "2025-03-22T00:00:00.000Z",
//                 "hotelAddress": "Pune , Maharashtra 441105",
//                 "checkInTime": "10:00 am",
//                 "checkOutTime": "10:00 am",
//                 "numberOfNights": 1,
//                 "roomType": "Single",
//                 "restaurantName": "AP RESTRO",
//                 "mealType": "breakfast",
//                 "restaurantAddress": "456 Oak St, Townsvil"
//             },
//             "startDate": "2025-03-22T00:00:00.000Z",
//             "endDate": "2025-03-22T00:00:00.000Z",
//             "description": "ARGAN REPORT OF EXPENSE",
//             "amount": 2100,
//             "approver": null,
//             "region": "maharashtra",
//             "attachments": [],
//             "relatedEvent": "",
//             "status": "PENDING",
//             "firstLevelStatus": "PENDING",
//             "finalStatus": "PENDING",
//             "isRemotePunchingAllowance": false,
//             "remotePunchingDetails": {
//                 "date": "",
//                 "km": 0,
//                 "allowancePerKm": 0,
//                 "currency": ""
//             }
//         }
//     ],
//     "status": "PENDING",
//     "totalAmount": 7000,
//     "isReport": true
// } Response>{
//     "success": true,
//     "expenseReport": {
//         "_id": "67de9981d8f7b820436a0e8a",
//         "employeeId": "66ebb3b353648e2f0592afee",
//         "expenseName": "Saturday Exp Check ",
//         "isRemotePunchingAllowance": false,
//         "currency": "INR",
//         "approver": null,
//         "firstLevelStatus": "PENDING",
//         "finalStatus": "PENDING",
//         "isReport": true,
//         "reportName": "Saturday Exp Check ",
//         "reportDate": "2025-03-22T00:00:00.000Z",
//         "reportType": "TRAVEL",
//         "reportFor": "66ebb3b353648e2f0592afee",
//         "expenses": [
//             {
//                 "dynamicFields": {
//                     "clientProjectName": "AEGIS PROJECT V2",
//                     "transportationType": "Flight",
//                     "ticketNumber": "FLIGHT2222222222",
//                     "travelClass": "Economy"
//                 },
//                 "remotePunchingDetails": {
//                     "date": "2025-03-13",
//                     "km": 43,
//                     "allowancePerKm": 100,
//                     "currency": "INR"
//                 },
//                 "employeeId": "66ebb3b353648e2f0592afee",
//                 "expenseName": "Travel Accomodation V2",
//                 "category": "67dbb4f3bdb88c8b067d2cb8",
//                 "currency": "INR",
//                 "categoryType": "custom",
//                 "isRemotePunchingAllowance": true,
//                 "startDate": "2025-03-13T00:00:00.000Z",
//                 "endDate": "2025-03-13T00:00:00.000Z",
//                 "description": "ARGAN REPORT OF EXPENSE",
//                 "amount": 4350,
//                 "approver": null,
//                 "region": "maharashtra",
//                 "attachments": [],
//                 "relatedEvent": "ARGAN REPORT OF EXPENSE",
//                 "status": "PENDING",
//                 "firstLevelStatus": "PENDING",
//                 "finalStatus": "PENDING",
//                 "_id": "67de9981d8f7b820436a0e8b",
//                 "createdAt": "2025-03-22T11:33:27.826Z"
//             },
//             {
//                 "dynamicFields": {
//                     "clientProjectName": "AEGIS PROJECT",
//                     "transportationType": "Flight",
//                     "ticketNumber": "FLIGHT2222222222",
//                     "travelClass": "Economy",
//                     "restaurantName": "AP RESTRO",
//                     "mealType": "breakfast",
//                     "restaurantAddress": "456 Oak St, Townsvil"
//                 },
//                 "remotePunchingDetails": {
//                     "date": "",
//                     "km": 0,
//                     "allowancePerKm": 0,
//                     "currency": ""
//                 },
//                 "employeeId": "66ebb3b353648e2f0592afee",
//                 "expenseName": "fOOD V2",
//                 "category": "67dbb4f3bdb88c8b067d2cc9",
//                 "currency": "INR",
//                 "categoryType": "custom",
//                 "isRemotePunchingAllowance": false,
//                 "startDate": "2025-03-22T00:00:00.000Z",
//                 "endDate": "2025-03-22T00:00:00.000Z",
//                 "description": "ARGAN REPORT OF EXPENSE",
//                 "amount": 550,
//                 "approver": null,
//                 "region": "maharashtra",
//                 "attachments": [],
//                 "relatedEvent": "Meeting",
//                 "status": "PENDING",
//                 "firstLevelStatus": "PENDING",
//                 "finalStatus": "PENDING",
//                 "_id": "67de9981d8f7b820436a0e8c",
//                 "createdAt": "2025-03-22T11:33:27.827Z"
//             },
//             {
//                 "dynamicFields": {
//                     "hotelName": "Hotel Tip Top",
//                     "checkInDate": "2025-03-22T00:00:00.000Z",
//                     "checkOutDate": "2025-03-22T00:00:00.000Z",
//                     "hotelAddress": "Pune , Maharashtra 441105",
//                     "checkInTime": "10:00 am",
//                     "checkOutTime": "10:00 am",
//                     "numberOfNights": 1,
//                     "roomType": "Single",
//                     "restaurantName": "AP RESTRO",
//                     "mealType": "breakfast",
//                     "restaurantAddress": "456 Oak St, Townsvil"
//                 },
//                 "remotePunchingDetails": {
//                     "date": "",
//                     "km": 0,
//                     "allowancePerKm": 0,
//                     "currency": ""
//                 },
//                 "employeeId": "66ebb3b353648e2f0592afee",
//                 "expenseName": "Hotel Stay",
//                 "category": "67dbb4f3bdb88c8b067d2cc0",
//                 "currency": "INR",
//                 "categoryType": "custom",
//                 "isRemotePunchingAllowance": false,
//                 "startDate": "2025-03-22T00:00:00.000Z",
//                 "endDate": "2025-03-22T00:00:00.000Z",
//                 "description": "ARGAN REPORT OF EXPENSE",
//                 "amount": 2100,
//                 "approver": null,
//                 "region": "maharashtra",
//                 "attachments": [],
//                 "relatedEvent": "",
//                 "status": "PENDING",
//                 "firstLevelStatus": "PENDING",
//                 "finalStatus": "PENDING",
//                 "_id": "67de9981d8f7b820436a0e8d",
//                 "createdAt": "2025-03-22T11:33:27.829Z"
//             }
//         ],
//         "totalAmount": 7000,
//         "status": "PENDING",
//         "paymentStatus": "PENDING",
//         "organizationId": "66a9fcd5a2ab524009bc86c9",
//         "createdBy": "66ebb3b353648e2f0592afee",
//         "attachments": [],
//         "createdAt": "2025-03-22T11:05:37.285Z",
//         "updatedAt": "2025-03-22T11:33:27.814Z",
//         "expenseId": "EID000282",
//         "__v": 0
//     }
// }