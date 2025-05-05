import { create } from "zustand";

const useEmployeeState = create((set) => {
  return {
    first_name: undefined,
    machineid: undefined,
    last_name: undefined,
    email: undefined,
    phone_number: undefined,
    address: undefined,
    citizenship: undefined,
    adhar_card_number: undefined,
    pan_card_number: undefined,
    gender: undefined,
    bank_account_no: undefined,
    date_of_birth: undefined,
    password: undefined,
    confirmPassword: undefined,
    designation: undefined,
    worklocation: undefined,
    deptname: undefined,
    employmentType: undefined,
    empId: undefined,
    mgrempid: undefined,
    joining_date: undefined,
    salarystructure: undefined,
    dept_cost_center_no: undefined,
    companyemail: undefined,
    profile: [],
    shift_allocation: undefined,
    data: undefined,
    pwd: false,
    uanNo: undefined,
    esicNo: undefined,
    expenseApprover: null,

    // Setter function for updating multiple properties at once
    setStep2Data: (remotePunching) => {
      set({ ...remotePunching });
    },

    setStep3Data: (data) => {
      set({ data: { ...data } });
    },
    setStep1Data: (orgName) => {
      set({
        ...orgName,
      });
    },

    updateField: (fieldName, value) => {
      set((state) => ({
        ...state,
        [fieldName]: value,
      }));
    },
    setExpenseApprover: (approver) => set({ expenseApprover: approver }),
    
    emptyState: () => {
      set({
        first_name: undefined,
        last_name: undefined,
        email: undefined, 
        phone_number: undefined,
        address: undefined,
        citizenship: undefined,
        adhar_card_number: undefined,
        pan_card_number: undefined,
        gender: undefined,
        bank_account_no: undefined,
        date_of_birth: undefined,
        password: undefined,
        confirmPassword: undefined,
        designation: undefined,
        worklocation: undefined,
        deptname: undefined,
        employmentType: undefined,
        empId: undefined,
        mgrempid: undefined,
        joining_date: undefined,
        salarystructure: undefined,
        dept_cost_center_no: undefined,
        companyemail: undefined,
        profile: [],
        shift_allocation: undefined,
        data: undefined,
        pwd: false,
        uanNo: undefined,
        esicNo: undefined,
        expenseApprover: null,
      });
    },
  };
});

export default useEmployeeState;
