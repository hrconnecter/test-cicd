/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Select from "react-select";
import DatePicker from "react-datepicker";

const EditExpenseReport = () => {
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { reportId, organisationId } = useParams();

  // Form data state
  const [formData, setFormData] = useState({
    reportName: "",
    reportDate: new Date(),
    reportType: "",
    reportFor: "",
    expenses: [],
    totalAmount: 0,
    status: "PENDING",
    paymentStatus: "PENDING"
  });

  // Existing query and mutation logic...
  // [Previous queries and mutations remain unchanged]
 // Fetch report data
 const { data: report, isLoading: reportLoading } = useQuery(
    ["expenseReport", reportId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data.expenseReport;
    },
    {
      onSuccess: (data) => {
        setFormData({
          reportName: data.reportName,
          reportDate: new Date(data.reportDate),
          reportType: data.reportType,
          expenses: data.expenses.map(exp => ({
            ...exp,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
            category: exp.category
          }))
        });
       }
    }
  );
 
// Fetch categories with organizationId
const { data: categories } = useQuery(
    ["expenseCategories", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data.categories;
    },
    {
      enabled: !!organisationId
    }
  );
 // Fetch approvers with organizationId
 const { data: approvers } = useQuery(
    ["expenseApprovers", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/approvers/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data.data.approvers;
    },
    {
      enabled: !!organisationId
    }
  );

  // Update mutation
  const updateMutation = useMutation(
    async (updatedData) => {
      const response = await axios.put(
        // `${process.env.REACT_APP_API}/route/expense/report/${reportId}`,
        //  `${process.env.REACT_APP_API}/expense/${organisationId}/report/${reportId}`,
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
        updatedData,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employeeReports");
        handleAlert(true, "success", "Report updated successfully");
        navigate(-1);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "Failed to update report";
      handleAlert(true, "error", errorMessage);
      console.error("Update error:", error);
      }
    }
  );



  // Handle file upload with improved error handling and file validation
const handleFileUpload = async (file, expenseIndex) => {
  try {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      handleAlert(true, "error", "File size should not exceed 5MB");
      return;
    }

    const { data: { url, key } } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/ExpenseDocument`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: { 
        "Content-Type": file.type,
        "Cache-Control": "public, max-age=31536000"
      },
    });

    const cleanUrl = url.split('?')[0];
    const newAttachment = {
      url: cleanUrl,
      name: file.name,
      type: file.type,
      key,
      contentDisposition: 'inline'
    };

    const updatedExpenses = [...formData.expenses];
    updatedExpenses[expenseIndex].attachments = [
      ...(updatedExpenses[expenseIndex].attachments || []),
      newAttachment
    ];
    
    setFormData({ ...formData, expenses: updatedExpenses });
    handleAlert(true, "success", "File uploaded successfully");
  } catch (error) {
    console.error("Upload error:", error);
    handleAlert(true, "error", "Failed to upload file. Please try again.");
  }
};


  // Handle expense field updates
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      expenses: formData.expenses.map(exp => ({
        ...exp,
        startDate: exp.startDate.toISOString(),
        endDate: exp.endDate.toISOString()
      }))
    };
    updateMutation.mutate(submitData);
  };

  if (reportLoading) return <div>Loading...</div>;
  

  return (
    <BoxComponent>
      <div className="flex flex-col justify-between w-full md:ml-4">
        <div className="flex justify-between items-center mb-4">
          <HeadingOneLineInfo
            heading="Edit Expense Report"
            info="Update your expense report details and expenses"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Summary Panel */}
          <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Report Summary
                </h3>
                <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Total Items: {formData.expenses.length}
                </span>
              </div>

              <div className="space-y-4">
                {formData.expenses.map((expense, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{expense.expenseName}</p>
                        <p className="text-sm text-gray-600 mt-1">{expense.category.name}</p>
                        <p className="text-lg font-bold text-blue-600 mt-2">₹{expense.amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{formData.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

       
{/* Right Side - Edit Form */}
<div className="w-full md:w-2/3">
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Report Name</label>
        <input
          type="text"
          value={formData.reportName}
          onChange={(e) => setFormData({...formData, reportName: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Date</label>
        <DatePicker
          selected={formData.reportDate}
          onChange={(date) => setFormData({...formData, reportDate: date})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Type</label>
        {/* <Select
          value={{ value: formData.reportType, label: formData.reportType }}
          onChange={(selected) => setFormData({...formData, reportType: selected.value})}
          options={reportTypesData?.types?.map(type => ({
            value: type,
            label: type
          })) || []}
          className="mt-1"
        /> */}
      </div>
    </div>

    {/* Expenses Section */}
    {formData.expenses.map((expense, index) => (
      <div key={expense._id || index} className="mt-8 border-t pt-6">
        <h4 className="text-lg font-semibold mb-4">Expense {index + 1}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Expense form fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Expense Name</label>
    <input
      type="text"
      value={expense.expenseName}
      onChange={(e) => handleExpenseChange(index, 'expenseName', e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter expense name"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Category</label>
    <Select
      value={{
        value: expense.category._id,
        label: expense.category.name
      }}
      onChange={(selected) => handleExpenseChange(index, 'category', {
        _id: selected.value,
        name: selected.label
      })}
      options={categories?.map(cat => ({
        value: cat._id,
        label: cat.name
      }))}
      className="mt-1"
      placeholder="Select category"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Amount</label>
    <input
      type="number"
      value={expense.amount}
      onChange={(e) => handleExpenseChange(index, 'amount', Number(e.target.value))}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter amount"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Region</label>
    <input
      type="text"
      value={expense.region}
      onChange={(e) => handleExpenseChange(index, 'region', e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter region"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <DatePicker
      selected={expense.startDate}
      onChange={(date) => handleExpenseChange(index, 'startDate', date)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <DatePicker
      selected={expense.endDate}
      onChange={(date) => handleExpenseChange(index, 'endDate', date)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">Description</label>
    <textarea
      value={expense.description}
      onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
      rows="3"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter expense description"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Approver</label>
    <Select
      value={{
        value: expense.approver,
        label: approvers?.find(app => app._id === expense.approver)
          ? `${approvers.find(app => app._id === expense.approver).first_name} ${approvers.find(app => app._id === expense.approver).last_name}`
          : ''
      }}
      onChange={(selected) => handleExpenseChange(index, 'approver', selected.value)}
      options={approvers?.map(app => ({
        value: app._id,
        label: `${app.first_name} ${app.last_name}`
      })) || []}
      className="mt-1"
      placeholder="Select approver"
    />
  </div>

  <div className="md:col-span-3">
    <label className="block text-sm font-medium text-gray-700">Attachments</label>
    <div className="mt-2 flex items-center space-x-4">
      {expense.attachments?.map((att, attIndex) => (
        <div key={attIndex} className="flex items-center space-x-2">
          <a
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {att.name || `Attachment ${attIndex + 1}`}
          </a>
        </div>
      ))}
      <input
        type="file"
        onChange={(e) => handleFileUpload(e.target.files[0], index)}
        className="mt-1"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  </div>
</div>
{/* Action Buttons */}
<div className="flex justify-end gap-3 mt-6">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="px-4 py-2 border rounded-md hover:bg-gray-100 text-gray-700"
  >
    Cancel
  </button>

  <button
    onClick={handleSubmit}
    disabled={updateMutation.isLoading}
    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
  >
    {updateMutation.isLoading ? (
      <div className="flex items-center">
        <span className="mr-2">Updating...</span>
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    ) : (
      "Update Report"
    )}
  </button>
</div>


          
        </div>
      </div>
    ))}
  </div>
</div>



        </div>
      </div>
    </BoxComponent>
  );
};

export default EditExpenseReport;
