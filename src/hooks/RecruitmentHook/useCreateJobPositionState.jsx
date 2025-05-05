import { create } from "zustand";

const useCreateJobPositionState = create((set) => ({
  // Step 1 fields
  jobTitle: undefined,//*
  jobRole: undefined,//*
  department: undefined,//*
  JobIndustry: undefined,//*
  experienceRequired: undefined,//*
  jobType: undefined,
  education: undefined,
  vacancies: 1,
  location: undefined,
  modeOfWorking: undefined,
  workingShift: undefined,
  requiredSkill: undefined,

  // Step 2 fields
  additionalBenefits: undefined,
  language: undefined,
  additionalDocument: undefined,
  jobDescription: undefined,
  hrAssigned: undefined,
  createdBy: undefined,
  jobPostedDate: undefined,
  termsAndCondition: undefined,

  // Step 3 fields
  addQuestions: [],

  setStep1Data: (data) => {
    set((state) => ({
      ...state,
      jobTitle: data.jobTitle,
      jobRole: data.jobRole,
      department: data.department,
      JobIndustry: data.JobIndustry,
      experienceRequired: data.experienceRequired,
      vacancies: data.vacancies,
      jobType: data.jobType,
      education: data.education,
      location: data.location,
      modeOfWorking: data.modeOfWorking,
      workingShift: data.workingShift,
      requiredSkill: data.requiredSkill,
    }));
  },

  setStep2Data: (data) => {
    console.log("data", data);

    set((state) => ({
      ...state,
      additionalBenefits: data.additionalBenefits,
      language: data.language,
      additionalDocument: data.additionalDocument,
      jobDescription: data.jobDescription,
      hrAssigned: data.hrAssigned,
      createdBy: data.createdBy,
      jobPostedDate: data.jobPostedDate,
      termsAndCondition: data.termsAndCondition,
    }));
  },

  // Step 3 handler
  setStep3Data: (data) => {
    set((state) => ({
      ...state,
      addQuestions: data?.addQuestions || [],
    }));
  },

  emptyState: () => {
    set({
      jobTitle: undefined,
      jobRole: undefined,
      department: undefined,
      JobIndustry: undefined,
      experienceRequired: undefined,
      vacancies: undefined,
      jobType: undefined,
      education: undefined,
      location: undefined,
      modeOfWorking: undefined,
      workingShift: undefined,
      requiredSkill: undefined,

      additionalBenefits: undefined,
      language: undefined,
      additionalCertificate: undefined,
      jobDescription: undefined,
      hrAssigned: undefined,
      createdBy: undefined,
      jobPostedDate: undefined,
      termsAndCondition: undefined,

      addQuestions: [],
    });
  },
}));

export default useCreateJobPositionState;