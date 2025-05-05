import { create } from "zustand";

const useEmployeeStore = create((set) => ({
  savedEmployees: [],
  savedManagers: {}, // A map to associate employee IDs with manager IDs

  addEmployee: (employee, managerId) =>
    set((state) => ({
      savedEmployees: [...state.savedEmployees, employee],
      savedManagers: { ...state.savedManagers, [employee._id]: managerId },
    })),

  removeEmployee: (employeeId) =>
    set((state) => {
      const updatedManagers = { ...state.savedManagers };
      delete updatedManagers[employeeId];
      return {
        savedEmployees: state.savedEmployees.filter(
          (emp) => emp._id !== employeeId
        ),
        savedManagers: updatedManagers,
      };
    }),

  clearEmployees: () =>
    set({ savedEmployees: [], savedManagers: {} }),
}));

export default useEmployeeStore;





// import { create } from "zustand";

// const useEmployeeStore = create((set) => ({
//   savedEmployee: null, // Only one employee
//   savedManager: null, // A single manager associated with the employee

//   addEmployee: (employee, managerId) =>
//     set(() => ({
//       savedEmployee: employee, // Replace the employee
//       savedManager: managerId, // Replace the manager
//     })),

//   removeEmployee: () =>
//     set(() => ({
//       savedEmployee: null, // Clear the employee
//       savedManager: null,  // Clear the manager
//     })),

//   clearEmployee: () =>
//     set(() => ({
//       savedEmployee: null,
//       savedManager: null,
//     })),
// }));

// export default useEmployeeStore;
