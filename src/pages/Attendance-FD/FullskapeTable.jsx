import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetStudents from "./hooks/useGetStudents";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { z } from "zod";
import { useQueryClient } from "react-query"; // Import the useQueryClient hook from react-query
import useAuthToken from "../../hooks/Token/useAuth";
import { Button } from "@mui/material";


const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  class: z.string().min(1, "Class is required"),
  parentEmail: z.string().email("Invalid email address"),
  parentPhoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  studentPhoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  division: z.string().min(1, "Division is required"),
  PRN: z.string().min(1, "PRN is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
        <p className="text-sm mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const FullskapeTableComponent = ({ setValue, watch, addedEmployee = [], zoneId, openStudentModal, setOpenStudentModal }) => {
  const { students } = useGetStudents(zoneId);
  const [filters, setFilters] = useState({ name: "", class: "", division: "" });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeletedialogOpen, setdeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [originalStudent, setOriginalStudent] = useState(null);
  const [errors, setErrors] = useState({}); // State for validation errors


  const authToken = useAuthToken();

  useEffect(() => {
    if (!students) return;

    const filtered = students.filter((student) => {
      return (
        (filters.name === "" || student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.class === "" || student.class?.toLowerCase().includes(filters.class.toLowerCase())) &&
        (filters.division === "" || student.division?.toLowerCase().includes(filters.division.toLowerCase()))
      );
    });

    setFilteredStudents(filtered);
  }, [students, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setPreviewImage(student.imageUrl || null);
    setOriginalStudent({ ...student });
    setDialogOpen(true);
  };

  const uploadStudentImage = async (file) => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    try {
      const { data: { url } } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return url.split("?")[0];
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw new Error("Failed to upload the image.");
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    try {
      const uploadedImageUrl = await uploadStudentImage(file);
      setEditingStudent((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingStudent || !originalStudent) return;

    try {
      // Validate editingStudent with zod
      studentSchema.parse(editingStudent);

      const updatedFields = Object.keys(editingStudent).reduce((changes, key) => {
        if (editingStudent[key] !== originalStudent[key]) {
          changes[key] = editingStudent[key];
        }
        return changes;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        setDialogOpen(false);
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API}/route/fullskape/students/${zoneId}/${editingStudent._id}`,
        updatedFields
      );

      setFilteredStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? { ...student, ...updatedFields }
            : student
        )
      );

      setEditingStudent(null);
      setPreviewImage(null);
      setDialogOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and set validation errors
        const zodErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(zodErrors);
      } else {
        console.error("Error updating student:", error);
      }
    }
  };

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setdeleteDialogOpen(true);
  };
  const queryClient = useQueryClient(); // Initialize the queryClient

  const handleDelete = async (studentId) => {
    
    
    try {
      // Perform the delete request
      await axios.delete(
        `${process.env.REACT_APP_API}/route/fullskape/students/${zoneId}/${studentId}`
      );
  
      // Invalidate the query that fetches students so it will refetch
      await queryClient.invalidateQueries(["getStudents"]); // Invalidate the "getStudents" query with the zoneId as a key
  
      // Optionally update the local state if needed
      setFilteredStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
    <ConfirmationDialog
      open={isDeletedialogOpen && studentToDelete}
      onClose={() => setdeleteDialogOpen(false)}
      onConfirm={() => handleDelete(studentToDelete)}
      message="Are you sure you want to delete this student?"
    />
      {/* Confirmation Dialog and other components */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[100000]">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Student Details</h2>
            <div className="mb-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover mb-2"
                />
              )}
              <input type="file" onChange={handleImageChange} />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={editingStudent?.name || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="text"
                value={editingStudent?.class || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Class"
              />
              {errors.class && <p className="text-red-500 text-sm">{errors.class}</p>}

              <input
                type="text"
                value={editingStudent?.parentEmail || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, parentEmail: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Parent Email"
              />
              {errors.parentEmail && <p className="text-red-500 text-sm">{errors.parentEmail}</p>}

              <input
                type="text"
                value={editingStudent?.parentPhoneNumber || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, parentPhoneNumber: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Parent Phone Number"
              />
              {errors.parentPhoneNumber && <p className="text-red-500 text-sm">{errors.parentPhoneNumber}</p>}

              <input
                type="text"
                value={editingStudent?.studentPhoneNumber || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, studentPhoneNumber: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Student Phone Number"
              />
              {errors.studentPhoneNumber && <p className="text-red-500 text-sm">{errors.studentPhoneNumber}</p>}

              <input
                type="text"
                value={editingStudent?.division || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, division: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="Division"
              />
              {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}

              <input
                type="text"
                value={editingStudent?.PRN || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, PRN: e.target.value })}
                className="border rounded p-2 w-full"
                placeholder="PRN"
              />
              {errors.PRN && <p className="text-red-500 text-sm">{errors.PRN}</p>}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded ml-2 hover:bg-gray-400"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* <AddStudentDialog
        open={openStudentModal}
        onClose={() => setOpenStudentModal(false)}
        zoneId={zoneId}
        authToken={authToken}
        handleAlert={(message, type) => {
          console.log(`Alert: ${message} | Type: ${type}`);
        }}
        queryClient={queryClient}
      /> */}

      {/* Table and other content */}
      <div className="flex gap-4 mb-6 items-center justify-between">
        <div className="flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="class"
            placeholder="Filter by class"
            value={filters.class}
            onChange={handleFilterChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="division"
            placeholder="Filter by division"
            value={filters.division}
            onChange={handleFilterChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenStudentModal(true)}
          className="ml-auto"
        >
          Add Student
        </Button>
      </div>


      <table className="w-full bg-white border border-gray-200 text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Class</th>
            <th className="p-4">Parent Email</th>
            <th className="p-4">Parent Phone</th>
            <th className="p-4">Student Phone</th>
            <th className="p-4">Division</th>
            <th className="p-4">PRN</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id} className="border-b">
              <td className="p-4">
                {student.imageUrl ? (
                  <img
                    src={student.imageUrl}
                    alt="Student"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-4">{student.name}</td>
              <td className="p-4">{student.class}</td>
              <td className="p-4">{student.parentEmail}</td>
              <td className="p-4">{student.parentPhoneNumber}</td>
              <td className="p-4">{student.studentPhoneNumber}</td>
              <td className="p-4">{student.division}</td>
              <td className="p-4">{student.PRN}</td>
              <td className="p-6 flex gap-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDelete(student._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FullskapeTableComponent;
