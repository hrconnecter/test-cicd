/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField, Typography, Alert } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
import DataTable from "./components/DataTable";
import DocList from "./components/DocList";
import Options from "./components/Options";
import { useParams } from "react-router-dom";
import useLetterWorkflowStore from "./components/useletterworkflow";
import useEmployeeStore from "./components/useEmployeeStore";
import UserProfile from "../../hooks/UserData/useUser";

import { z } from "zod";
import html2canvas from "html2canvas";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
//v1
import { letterTemplates } from "../../data/letterTemplates";

// Define the validation schema
const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // details: z.string().min(1, "Details are required"),
  applicableDate: z.string().min(1, "Applicable date is required"),
  header: z.string().min(1, "Header is required"),
  footer: z.string().min(1, "Footer is required"),
  // letterType: z.string().min(1, "Letter Type is required"),
});

const DocManageAuth = () => {
  // const { authToken } = useGetUser();
  // to get current user information and user role
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log("user1111", user);
  const Hrid = user._id;
  const { organisationId } = useParams();
  console.log("organisationId:", organisationId);
  const [option, setOption] = useState("");
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);
  const [letterTypes, setLetterTypes] = useState([]);
  const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type
  const setLetterWorkflow = useLetterWorkflowStore(
    (state) => state.setLetterWorkflow
  );
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [managerId, setManagerId] = useState("");
  const { savedEmployees } = useEmployeeStore(); // Get employees from Zustand
  const { savedManagers } = useEmployeeStore(); // Destructure savedManagers from the store
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [employeeSelected, setEmployeeSelected] = useState(false); // New state to track if employee is selected

  //v1
  const loadLetterTemplate = (letterType) => {
    // Check if a template exists for the selected letter type
    if (letterTemplates[letterType]) {
      const template = letterTemplates[letterType];

      // Update the document state with the template data
      setNewDocument({
        ...newDocument,
        header: template.header,
        title: template.title,
        details: template.details,
        footer: template.footer,
      });
    }
  };

  const { data: data2 } = useQuery(`getOrgDocs`, async () => {
    const response = await axios.get(
      // `${process.env.REACT_APP_API}/route/org/${organisationId}/getdocs/letters`,
      `${process.env.REACT_APP_API}/route/org/${organisationId}/getdocs/letters?type=Letter`, // Add type filter

      {
        headers: { Authorization: authToken },
      }
    );

    return response.data.doc;
  });

  console.log(data2);

  const [newDocument, setNewDocument] = useState({
    header: "",
    footer: "",
    details: "",
    title: "",
    applicableDate: "",
  });
  console.log("type", newDocument);

  //v1
  // Modify the handleSelectChange function to load the template when a letter type is selected
  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setSelectedLetterType(selectedType); // Update the selected letter type

    // Load the template for the selected letter type
    loadLetterTemplate(selectedType);
  };

  useEffect(() => {
    const fetchLetterWorkflow = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );

        // Extract letter types and update Zustand store
        const fetchedLetterTypes = Object.keys(response.data);
        setLetterTypes(fetchedLetterTypes); // Save letter types for dropdown

        fetchedLetterTypes.forEach((letterType) => {
          const workflowStatus = response.data[letterType].workflow;
          setLetterWorkflow(letterType, workflowStatus);
        });
      } catch (error) {
        console.error("Error fetching letter workflow:", error);
        // Optionally, you could set an error state here to display a message to the user
      }
    };

    if (organisationId && authToken) {
      fetchLetterWorkflow();
    }
  }, [organisationId, authToken, setLetterWorkflow]); //

  const handleEditDocument = async (id) => {
    try {
      setDocId(id.toString());
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
        {
          headers: { Authorization: authToken },
        }
      );
      const document = response.data.doc;
      console.log("Dc", document);
      // Convert the applicableDate to the 'YYYY-MM-DD' format
      const formattedDate = new Date(document.applicableDate)
        .toISOString()
        .split("T")[0];

      // Update the state with the formatted date
      setNewDocument({
        selectedLetterType: document.letterType, // Make sure this is set correctly
        header: document.header,
        title: document.title,
        details: document.details,
        applicableDate: formattedDate, // Set the formatted date here
        type: document.type,
        footer: document.footer,
      });
      
      // Set the employee as selected if we're editing a document
      if (document.empidd) {
        setSelectedEmployee(document.empidd);
        setEmployeeSelected(true);
      }
    } catch (error) {
      console.error("Error while fetching document for editing:", error);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Deleted Successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/toggle-document-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        queryClient.invalidateQueries("getOrgDocs");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  useEffect(() => {
    setDocId("");
    setNewDocument({
      title: "",
      details: "",
      applicableDate: "",
    });
    // Reset employee selection when changing options
    if (option !== "emp") {
      setSelectedEmployee("");
      setEmployeeSelected(false);
    }
  }, [option]);

  //v1
  const personalizeTemplate = (templateContent, employeeData) => {
    if (!employeeData) return templateContent;

    let personalized = templateContent;

    // Replace placeholders with actual employee data
    if (employeeData.first_name) {
      personalized = personalized.replace(
        /\[Employee Name\]/g,
        employeeData.first_name
      );
    }

    // Add more replacements as needed based on available employee data
    return personalized;
  };

  const handleSelectEmployee = (e) => {
    const selectedEmployeeId = e.target.value;
    setSelectedEmployee(selectedEmployeeId);
    setEmployeeSelected(true); // Set employee as selected

    // Find the selected employee's data
    const employeeData = savedEmployees?.find(
      (emp) => emp._id === selectedEmployeeId
    );

    // Update manager ID
    const managerId = savedManagers[selectedEmployeeId];
    setManagerId(managerId);

    // If we have a letter type selected, personalize the template for this employee
    if (
      selectedLetterType &&
      letterTemplates[selectedLetterType] &&
      employeeData
    ) {
      const template = letterTemplates[selectedLetterType];

      setNewDocument({
        ...newDocument,
        details: personalizeTemplate(template.details, employeeData),
      });
    }
  };

  const handleCreateDocument = async () => {
    try {
      // Validate the document data
      const validationResult = documentSchema.safeParse(newDocument);

      if (!validationResult.success) {
        // Extract the error messages
        const errorMessages = validationResult.error.errors.map((err) => {
          // Format the error message
          const fieldName = err.path.join(".");
          return `${fieldName}: ${err.message}`;
        });
        // Add spacing between errors
        const formattedErrorMessages = errorMessages.join("\n\n"); // Add double new lines for spacing

        // Set the error messages as the alert content
        setAppAlert({
          alert: true,
          type: "error",
          msg: formattedErrorMessages, // Pass the formatted string with spacing
        });

        return;
      }

      // Proceed if validation passes
      console.log("Validation succeeded:", validationResult.data);

      setLoading(true);

      // Select the ReactQuill container and render it as an image using html2canvas
      const element = document.querySelector(".ql-editor");
      if (!element) {
        alert("ReactQuill container not found");
        return;
      }

      // Get the original height of the content
      const originalHeight = element.scrollHeight;
      const originalStyle = element.style.cssText;

      // Temporarily modify the element to show full content
      element.style.height = `${originalHeight}px`;
      element.style.overflow = "visible";

      // Capture the full content
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        height: originalHeight, // Set explicit height
        windowHeight: originalHeight,
        scrollY: -window.scrollY, // Compensate for scroll position
      });

      // Restore original styling
      element.style.cssText = originalStyle;

      // Create a new jsPDF instance
      const doc = new jsPDF("p", "mm", "a4");

      // Set margins and page dimensions
      const margin = 11;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentHeight = pageHeight - 50; // Leave space for headers and footers

      // Split the canvas into multiple sections
      const imgProps = canvas.getContext("2d").canvas;
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate how many pages are needed
      const imgPageHeight = contentHeight * (imgWidth / pageWidth);
      let currentY = 0;
      let pageNumber = 1;

      // Function to add headers only on the first page
      const addHeader = (doc, pageNumber) => {
        if (pageNumber === 1) {
          doc.setFontSize(18);
          doc.setTextColor(0, 102, 204);
          doc.text(
            `${newDocument.header}`,
            pageWidth / 2,
            margin + 10,
            null,
            null,
            "center"
          );

          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${selectedLetterType}`,
            pageWidth / 2,
            margin + 20,
            null,
            null,
            "center"
          );
          doc.text(
            ` Date: ${newDocument.applicableDate}`,
            pageWidth - margin - 45,
            margin + 20
          );

          // Add a line below the header
          doc.setLineWidth(0.5);
          doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

          // Set title in center
          doc.setFontSize(14);
          doc.setTextColor(128, 128, 128); // Set text color for title to gray
          doc.text(
            `Title: ${newDocument.title}`,
            pageWidth / 2,
            margin + 35,
            null,
            null,
            "center"
          );
        }
      };

      // Function to add a dynamic footer with a horizontal line above it on each page
      const addFooter = (doc, footerText) => {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128); // Gray color for footer text

        // Add a horizontal line above the footer
        const footerYPosition = pageHeight - 15;
        doc.setLineWidth(0.5);
        doc.line(
          margin,
          footerYPosition - 5,
          pageWidth - margin,
          footerYPosition - 5
        );

        // Add dynamic footer text centered at the bottom of the page
        doc.text(
          footerText,
          pageWidth / 2,
          footerYPosition,
          null,
          null,
          "center"
        );
      };

      // Loop through content and add to pages
      while (currentY < imgHeight) {
        if (currentY > 0) {
          doc.addPage();
          pageNumber++;
        }

        // Add header only for the first page
        addHeader(doc, pageNumber);

        // Calculate the vertical starting position of content
        const contentYPosition = pageNumber === 1 ? margin + 35.7 : margin; // Increased spacing for title

        // Create a temporary canvas for the current section
        const canvasSection = document.createElement("canvas");
        const context = canvasSection.getContext("2d");

        canvasSection.width = imgWidth;
        canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);

        // Copy the relevant section of the original canvas
        context.drawImage(
          canvas,
          0,
          currentY,
          imgWidth,
          canvasSection.height,
          0,
          0,
          imgWidth,
          canvasSection.height
        );

        // Convert the section to an image
        const sectionData = canvasSection.toDataURL("image/png");

        // Add the section to the PDF with a corrected Y position
        doc.addImage(
          sectionData,
          "PNG",
          margin,
          contentYPosition, // Adjusted starting Y position
          pageWidth - 2 * margin,
          (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
        );

        currentY += canvasSection.height;

        // Add dynamic footer to the page
        const footerText = `For more information, visit ${newDocument.footer} (Page ${pageNumber})`; // Dynamic footer text
        addFooter(doc, footerText);
      }

      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      await axios.post(
        `${process.env.REACT_APP_API}/route/org/${organisationId}/adddocuments`,
        {
          hrid: Hrid,
          managerId: managerId, // Send the managerId along with document data
          empidd: selectedEmployee,
          type: "Letter", // Ensure this is always set to "Letter"
          letterType: selectedLetterType, // Send the selected letter type
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header, // Send header to backend
          footer: newDocument.footer, // Send footer to backend
          url: signedUrlResponse.url.split("?")[0],
          documentType: "letter", // Add this field to explicitly mark as letter
        },
        {
          headers: { Authorization: authToken },
        }
      );
      setNewDocument({});
      setLoading(false);
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Created Successfully",
      });

      setDocId("");
      // Reset all fields after successful creation
      setSelectedEmployee(""); 
      setSelectedLetterType("");
      setEmployeeSelected(false); // Reset employee selection state

      console.log("Document uploaded and data saved successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // If validation fails, handle errors
        console.log("errorzod", error);
        error.errors.forEach((err) => {
          setAppAlert({
            alert: true,
            type: "error",
            msg: err.message,
          });
        });
      } else {
        console.error("Error while uploading document and saving data:", error);
      }
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setNewDocument((prevState) => ({
      ...prevState,
      updatedAt: today, // Add today's date
    }));
  }, []);

  const handleUpdateDocument = async () => {
    try {
      setLoading(true);

      // Select the ReactQuill container and render it as an image using html2canvas
      const element = document.querySelector(".ql-editor");

      if (!element) {
        alert("ReactQuill container not found");
        return;
      }

      // Get the original height of the content
      const originalHeight = element.scrollHeight;
      const originalStyle = element.style.cssText;

      // Temporarily modify the element to show full content
      element.style.height = `${originalHeight}px`;
      element.style.overflow = "visible";

      // Capture the full content
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        height: originalHeight, // Set explicit height
        windowHeight: originalHeight,
        scrollY: -window.scrollY, // Compensate for scroll position
      });

      // Restore original styling
      element.style.cssText = originalStyle;

      // Create a new jsPDF instance
      const doc = new jsPDF("p", "mm", "a4");

      // Set margins and page dimensions
      const margin = 11;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentHeight = pageHeight - 50; // Leave space for headers and footers

      // Split the canvas into multiple sections
      const imgProps = canvas.getContext("2d").canvas;
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate how many pages are needed
      const imgPageHeight = contentHeight * (imgWidth / pageWidth);
      let currentY = 0;
      let pageNumber = 1;

      // Function to add headers only on the first page
      const addHeader = (doc, pageNumber) => {
        if (pageNumber === 1) {
          doc.setFontSize(18);
          doc.setTextColor(0, 102, 204);
          doc.text(
            `${newDocument.header}`,
            pageWidth / 2,
            margin + 10,
            null,
            null,
            "center"
          );

          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${selectedLetterType}`,
            pageWidth / 2,
            margin + 20,
            null,
            null,
            "center"
          );
          doc.text(
            ` Date: ${newDocument.applicableDate}`,
            pageWidth - margin - 45,
            margin + 20
          );

          // Add a line below the header
          doc.setLineWidth(0.5);
          doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

          // Set title in center
          doc.setFontSize(14);
          doc.setTextColor(128, 128, 128); // Set text color for title to gray
          doc.text(
            `Title: ${newDocument.title}`,
            pageWidth / 2,
            margin + 35,
            null,
            null,
            "center"
          );
        }
      };

      // Function to add a dynamic footer with a horizontal line above it on each page
      const addFooter = (doc, footerText) => {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128); // Gray color for footer text

        // Add a horizontal line above the footer
        const footerYPosition = pageHeight - 15;
        doc.setLineWidth(0.5);
        doc.line(
          margin,
          footerYPosition - 5,
          pageWidth - margin,
          footerYPosition - 5
        );

        // Add dynamic footer text centered at the bottom of the page
        doc.text(
          footerText,
          pageWidth / 2,
          footerYPosition,
          null,
          null,
          "center"
        );
      };

      // Loop through content and add to pages
      while (currentY < imgHeight) {
        if (currentY > 0) {
          doc.addPage();
          pageNumber++;
        }

        // Add header only for the first page
        addHeader(doc, pageNumber);

        // Calculate the vertical starting position of content
        const contentYPosition = pageNumber === 1 ? margin + 35.7 : margin; // Increased spacing for title

        // Create a temporary canvas for the current section
        const canvasSection = document.createElement("canvas");
        const context = canvasSection.getContext("2d");

        canvasSection.width = imgWidth;
        canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);

        // Copy the relevant section of the original canvas
        context.drawImage(
          canvas,
          0,
          currentY,
          imgWidth,
          canvasSection.height,
          0,
          0,
          imgWidth,
          canvasSection.height
        );

        // Convert the section to an image
        const sectionData = canvasSection.toDataURL("image/png");

        // Add the section to the PDF with a corrected Y position
        doc.addImage(
          sectionData,
          "PNG",
          margin,
          contentYPosition, // Adjusted starting Y position
          pageWidth - 2 * margin,
          (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
        );

        currentY += canvasSection.height;

        // Add dynamic footer to the page
        const footerText = `For more information, visit ${newDocument.footer} (Page ${pageNumber})`; // Dynamic footer text
        addFooter(doc, footerText);
      }

      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          letterType: selectedLetterType,
          header: newDocument.header, // Send header to backend
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          url: signedUrlResponse.url.split("?")[0],
          footer: newDocument.footer, // Send footer to backend
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);

      querClient.invalidateQueries("getOrgDocs");
      setLoading(false);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });
    } catch (error) {
      console.error("Error while updating document:", error);
    }
  };

  useEffect(() => {
    if (savedEmployees?.length === 1 && !selectedEmployee) {
      const singleEmployee = savedEmployees[0];
      setSelectedEmployee(singleEmployee._id); // Keep the employee ID
      setManagerId(savedManagers[singleEmployee._id]); // Set the manager ID
      setEmployeeSelected(true); // Set employee as selected
    }
  }, [savedEmployees, selectedEmployee, savedManagers]);

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Add Letter"}
        info={"You can manage company letters here"}
      />
      {/* Left Section (Document List or Options) */}
      {option === "emp" && (
        <>
          <DataTable 
            setOption={setOption} 
            onSelectEmployee={(employeeId) => {
              setSelectedEmployee(employeeId);
              setEmployeeSelected(true);
              setOption(""); // Return to main view after selecting employee
            }}
          />
        </>
      )}

      {option !== "emp" && (
        <div className="w-full h-full flex flex-col sm:flex-row justify-around gap-6 bg-gray-50 min-h-screen">
          {/* Circular Loader */}
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-95 z-50">
              <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Left Section - Document List or Options */}
          <Container
            className={`w-full ${
              option === "emp" ? "sm:w-full" : "sm:w-1/2"
            } h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
          >
            {option !== "" && (
              <div
                onClick={() => setOption("")}
                className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
              >
                <ArrowBackIcon />
              </div>
            )}

            {option === "doc" && (
              <DocList
                onEdit={handleEditDocument}
                onDelete={handleDeleteDoc}
                data={data2}
              />
            )}
            {option === "" && (
              <div>
                <p className="font-semibold pb-2">
                  Select an employee from the employee list, create a
                  personalized letter for them, get it approved by the manager
                  if required, and then send it to the employee.
                </p>
                <Options setOption={setOption} />
                
                {/* Display selected employee information if available */}
                {selectedEmployee && savedEmployees && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-medium text-blue-800">Selected Employee:</h3>
                    <p className="text-blue-700">
                      {savedEmployees.find(emp => emp._id === selectedEmployee)?.first_name || "Employee"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Container>

          {/* Right Section (Create/Update Record) */}
          {option !== "emp" && (
            <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
              <div id="document-content">
                <div
                  style={{ borderBottom: "2px solid gray" }}
                  className="w-full flex justify-center mb-6"
                >
                  <Typography className="!font-semibold !text-xl">
                    {docId ? "Update Record" : "Create Record"}
                  </Typography>
                </div>

                {!employeeSelected && !docId ? (
                  // Display message when no employee is selected
                  <div className="flex flex-col items-center justify-center h-64">
                    <Alert severity="info" className="mb-4">
                      Please select an employee from the Employee List first
                    </Alert>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOption("emp")}
                      className="mt-4"
                    >
                      Go to Employee List
                    </Button>
                  </div>
                ) : (
                  // Display
                  // Display form when employee is selected
                  <>
                    {/* Send To Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="sendTo"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Send To *
                      </label>

                      <select
                        id="sendTo"
                        onChange={handleSelectEmployee}
                        value={selectedEmployee} // This ensures the dropdown reflects the selected employee by ID
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          Select an Employee
                        </option>
                        {savedEmployees?.map((employee) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.first_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Dropdown */}
                    <div className="mb-4">
                      {/* Label for Letter Type */}
                      <label
                        htmlFor="letterType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Letter Type **
                      </label>
                      <select
                        id="letterType"
                        value={selectedLetterType}
                        onChange={handleSelectChange}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          Select a Letter Type
                        </option>
                        {letterTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <TextField
                        label="Header *"
                        size="small"
                        value={newDocument.header || ""}
                        onChange={(e) =>
                          setNewDocument((newDocument) => ({
                            ...newDocument,
                            header: e.target.value,
                          }))
                        }
                        fullWidth
                        margin="normal"
                        className="bg-gray-100"
                      />

                      <div className="mb-4">
                        <TextField
                          label="Title *"
                          size="small"
                          value={newDocument.title || ""}
                          onChange={(e) =>
                            setNewDocument((newDocument) => ({
                              ...newDocument,
                              title: e.target.value,
                            }))
                          }
                          fullWidth
                          margin="normal"
                          className="bg-gray-100"
                        />

                        <div style={{ width: "100%", maxWidth: "668px" }}>
                          <ReactQuill
                            className="h-[450px] mb-9"
                            theme="snow"
                            value={newDocument.details}
                            onChange={(value) =>
                              setNewDocument((newDocument) => ({
                                ...newDocument,
                                details: value,
                              }))
                            }
                            modules={{
                              toolbar: [
                                [{ font: [] }],
                                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                ["bold", "italic", "underline"],
                                [{ list: "bullet" }],
                                [{ align: [] }],
                                ["clean"],
                              ],
                            }}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <TextField
                          label="Footer *"
                          size="small"
                          value={newDocument.footer || ""}
                          onChange={(e) =>
                            setNewDocument((newDocument) => ({
                              ...newDocument,
                              footer: e.target.value,
                            }))
                          }
                          fullWidth
                          margin="normal"
                          className="bg-gray-100"
                        />
                      </div>

                      <TextField
                        label="Applicable Date *"
                        size="small"
                        type="date"
                        value={newDocument.applicableDate || ""}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            applicableDate: e.target.value,
                          })
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // Prevent past dates
                        }}
                        className="bg-gray-100"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Submit/Update Button Section - Only show if employee is selected */}
              {employeeSelected && (
                <div className="flex gap-2 mt-3 justify-center">
                  {!docId ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCreateDocument}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleUpdateDocument}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
                    >
                      Update
                    </Button>
                  )}
                </div>
              )}
            </Container>
          )}
        </div>
      )}
    </BoxComponent>
  );
};

export default DocManageAuth;

