import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const departmentLabels = [
  "Engineering",
  "IT",
  "Sales",
  "Marketing",
  "Administration",
  "Accounting",
];

const departmentData = [10, 12, 6, 4, 3, 3];

const data = {
  labels: departmentLabels,
  datasets: [
    {
      label: "Employee Count",
      data: departmentData,
      backgroundColor: "#3B82F6",
      borderRadius: 4,
      barThickness: 24,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
      },
      grid: {
        color: "#E5E7EB",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const employees = [
  {
    name: "Sahil Konkani",
    email: "sahil.konkani@argantechnology.com",
    department: "Information Technology",
    designation: "Automation Tester",
  },
  {
    name: "Mohit Solanki",
    email: "mohit.solanki@argantechnology.com",
    department: "Engineering Service",
    designation: "Design Engineer",
  },
  {
    name: "Omkar Kokil",
    email: "omkar.kokil@argantechnology.com",
    department: "Information Technology",
    designation: "Software Developer",
  },
  {
    name: "Adesh Rathod",
    email: "adesh.rathod@argantechnology.com",
    department: "Information Technology",
    designation: "Software Developer",
  },
  {
    name: "Payal Warrakar",
    email: "payal.warrakar@argantechnology.com",
    department: "Accounting",
    designation: "Accountant Admin",
  },
  {
    name: "Yash Chavan",
    email: "yash.chavan@argantechnology.com",
    department: "Engineering Service",
    designation: "Design Engineer",
  },
  {
    name: "Poonam Paul",
    email: "poonam.paul@argantechnology.com",
    department: "Sales",
    designation: "Sales Representative",
  },
];

export default function DepartmentEmployeeUI() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Employee count by department</h2>
          <Bar data={data} options={options} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Employee details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Department</th>
                  <th className="text-left px-4 py-2">Designation</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-sm hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{emp.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{emp.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{emp.department}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{emp.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
