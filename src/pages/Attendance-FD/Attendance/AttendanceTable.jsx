import React, { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StudentAttendanceCalendar from "./StudentAttendanceCalendar";

const AttendanceTable = ({ studentList }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleCalendarOpen = (student) => {
    setSelectedStudent(student);
  };

  const handleCalendarClose = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="px-6 py-8">
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th className="py-3 w-2/12">Student ID</th>
            <th className="py-3 w-3/12">Name</th>
            <th className="py-3 w-2/12">Class</th>
            <th className="py-3 w-2/12">Division</th>
            <th className="py-3 w-2/12 text-center">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {studentList?.map((student) => (
            <tr
              key={student.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-4">{student.id}</td>
              <td className="py-4">{student.name}</td>
              <td className="py-4">{student.class}</td>
              <td className="py-4">{student.division}</td>
              <td className="py-4 text-center">
                <CalendarMonthIcon
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleCalendarOpen(student)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-4xl">
            <h2 className="text-lg font-bold mb-4">
              Attendance for {selectedStudent.name}
            </h2>
            <StudentAttendanceCalendar
              studentData={selectedStudent}
              punches={selectedStudent.attendance}
              onClose={handleCalendarClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
