/* eslint-disable no-unused-vars */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField, Typography, Alert } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
import DataTable from "./components/DataTable";
import DocList from "./components/DocList";
import Options from "./components/Options";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useLetterWorkflowStore from "./components/useletterworkflow";
import useEmployeeStore from "./components/useEmployeeStore";
import UserProfile from "../../hooks/UserData/useUser";
import { z } from "zod";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import { letterTemplates } from "../../data/letterTemplates";
import { ReactComponent as DocManSvg } from "../../../src/assets/docMan2.svg";

// Import SunEditor and its styles (replacing ReactQuill)
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import plugins from "suneditor/src/plugins";

// Import SignaturePad for digital signatures
import SignaturePad from "react-signature-canvas";

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
  const { setAppAlert } = useContext(UseContext);
  const [letterTypes, setLetterTypes] = useState([]);
  const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type
  const setLetterWorkflow = useLetterWorkflowStore(
    (state) => state.setLetterWorkflow
  );
  const { letterWorkflow } = useLetterWorkflowStore();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [managerId, setManagerId] = useState("");
  const { savedEmployees, clearEmployees, addEmployee } = useEmployeeStore(); // Get employees from Zustand
  const { savedManagers } = useEmployeeStore(); // Destructure savedManagers from the store
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [employeeSelected, setEmployeeSelected] = useState(false); // New state to track if employee is selected

  // SunEditor state
  const [editor, setEditor] = useState(null);

  // Dialog states for signature and watermark
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [watermarkDialogOpen, setWatermarkDialogOpen] = useState(false);

  // Signature related states
  const signaturePadRef = useRef(null);

  // Watermark related states
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkColor, setWatermarkColor] = useState("#888888");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(-45);
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkImage, setWatermarkImage] = useState("");
  const [watermarkType, setWatermarkType] = useState("text"); // 'text' or 'image'

  // Original state variables from DocManageAuth.jsx
  const [docId, setDocId] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docDetails, setDocDetails] = useState("");
  const [docType, setDocType] = useState("Policies and Procedures");
  const [docDate, setDocDate] = useState("");
  const [docStatus, setDocStatus] = useState("draft");
  const [docUrl, setDocUrl] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  // const isDocumentEditable = () => {
  //   if (!docId) return true; // New document is always editable
  //   const document = data2?.find((doc) => doc._id === docId);
  //   return document?.docstatus === "To Do";
  // };

  //sat
  // Fix for the isDocumentEditable function
  const isDocumentEditable = () => {
    if (!docId) return true; // New document is always editable
    const document = data2?.find((doc) => doc._id === docId);
    return document?.docstatus === "To Do";
  };

  // const loadLetterTemplate = (letterType) => {
  //   // Check if a template exists for the selected letter type
  //   if (letterTemplates[letterType]) {
  //     const template = letterTemplates[letterType];

  //     // Update the document state with the template data
  //     setNewDocument({
  //       ...newDocument,
  //       header: template.header,
  //       title: template.title,
  //       details: template.details,
  //       footer: template.footer,
  //     });

  //     // If we have an editor instance, set its contents
  //     if (editor) {
  //       editor.setContents(template.details);
  //     }
  //   }
  // };
  //sat
  // Fix for the loadLetterTemplate function
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

      // Also update docDetails for compatibility with existing code
      setDocDetails(template.details);
      setDocTitle(template.title);

      // If we have an editor instance, set its contents
      if (editor) {
        editor.setContents(template.details);
      }
    }
  };

  // Fetch documents
  const { data: documents } = useQuery("getOrgDocs", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/${organisationId}/getdocs/letters?type=Letter`, // Add type filter
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.doc;
  });
  console.log(documents);

  const [newDocument, setNewDocument] = useState({
    header: "",
    footer: "",
    details: "",
    title: "",
    applicableDate: "",
  });
  console.log("type", newDocument);

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

  // Set current date when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDocDate(today);
  }, []);

  // SunEditor configuration
  const getSunEditorOptions = () => ({
    plugins: plugins,
    buttonList: [
      ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["removeFormat"],
      ["fontColor", "hiliteColor"],
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "lineHeight"],
      ["table", "image", "link"],
      ["fullScreen", "showBlocks"],
    ],
    height: "400px",
    width: "100%",
    minHeight: "300px",
    maxHeight: "600px",
    imageUploadSizeLimit: 5242880, // 5MB
    imageAccept: ".jpg, .jpeg, .png, .gif",

    // Enhanced image handling
    imageFileInput: true,
    imageUrlInput: true,
    imageResizing: true,
    imageWidth: "100%",
    imageSizeOnlyPercentage: false,

    // Table settings
    table: {
      maxWidth: "100%",
      defaultWidth: "100%",
      defaultHeight: 100,
      defaultAttributes: {
        width: "100%",
        border: "1px solid #ddd",
        borderCollapse: "collapse",
      },
      defaultCellAttributes: {
        style: "border: 1px solid #ddd; padding: 8px;",
      },
    },

    // Improved editor performance
    historyStackDelayTime: 15000, //ADD SECONDS
    charCounter: true,
    charCounterType: "char",
    charCounterLabel: "Characters: ",
  });

  // Handle editor initialization
  const handleEditorInitialized = (sunEditor) => {
    setEditor(sunEditor);
    console.log("SunEditor initialized successfully");
  };

  // Handle editor content change
  const handleEditorChange = (content) => {
    setDocDetails(content);
    setNewDocument((prev) => ({
      ...prev,
      details: content,
    }));
  };

  // Handle image upload for SunEditor
  const handleImageUploadBefore = async (files, info, uploadHandler) => {
    try {
      if (!files || files.length === 0) {
        console.error("No files to upload");
        return false;
      }

      setLoading(true); // Show loading indicator during upload

      // Get signed URL for image upload
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `image_${Date.now()}_${files[0].name}`, // Ensure unique name
      });

      if (!signedUrlResponse || !signedUrlResponse.url) {
        console.error("Failed to get signed URL for upload");
        setLoading(false);
        return false;
      }

      // Upload the image
      const uploadResult = await uploadFile(signedUrlResponse.url, files[0]);

      if (!uploadResult) {
        console.error("Failed to upload image");
        setLoading(false);
        return false;
      }

      // Get the clean URL (without query parameters)
      const imageUrl = signedUrlResponse.url.split("?")[0];

      console.log("Image uploaded successfully:", imageUrl);

      // Tell SunEditor the upload is complete and provide the URL
      const response = {
        result: [
          {
            url: imageUrl,
            name: files[0].name,
            size: files[0].size,
          },
        ],
      };

      setLoading(false);
      uploadHandler(response);
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);

      // Show error alert
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error uploading image: " + error.message,
      });

      return false;
    }
  };

  // Signature handling functions
  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const saveSignature = async () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      try {
        setLoading(true);

        // Get signature as data URL
        const signatureDataUrl = signaturePadRef.current.toDataURL("image/png");

        // Convert data URL to blob
        const blob = await fetch(signatureDataUrl).then((res) => res.blob());

        // Get signed URL for signature upload
        const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
          documentName: `signature_${Date.now()}.png`,
        });

        // Upload the signature
        await uploadFile(signedUrlResponse.url, blob);

        // Get the clean URL (without query parameters)
        const signatureUrl = signedUrlResponse.url.split("?")[0];

        // Insert the signature into the editor
        if (editor) {
          const imgTag = `<div class="signature-container" style="margin: 10px 0; display: inline-block;">
            <img src="${signatureUrl}" alt="Digital Signature" style="max-width: 200px; height: auto;"/>
            <div style="border-top: 1px solid #000; margin-top: 5px; font-style: italic; color: #666; font-size: 12px;">Digital Signature</div>
          </div>`;

          editor.insertHTML(imgTag);
        }

        // Close the dialog
        setSignatureDialogOpen(false);
        setLoading(false);

        // Show success message
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Signature added successfully",
        });
      } catch (error) {
        console.error("Error saving signature:", error);
        setLoading(false);

        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error adding signature: " + error.message,
        });
      }
    } else {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Please draw a signature first",
      });
    }
  };

  // Handle signature file upload
  const handleSignatureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Get signed URL for signature upload
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `signature_${Date.now()}_${file.name}`,
      });

      // Upload the signature
      await uploadFile(signedUrlResponse.url, file);

      // Get the clean URL (without query parameters)
      const signatureUrl = signedUrlResponse.url.split("?")[0];

      // Insert the signature into the editor
      if (editor) {
        const imgTag = `<div class="signature-container" style="margin: 10px 0; display: inline-block;">
                   <img src="${signatureUrl}" alt="Digital Signature" style="max-width: 200px; height: auto;"/>
          <div style="border-top: 1px solid #000; margin-top: 5px; font-style: italic; color: #666; font-size: 12px;">Digital Signature</div>
        </div>`;

        editor.insertHTML(imgTag);
      }

      // Close the dialog
      setSignatureDialogOpen(false);
      setLoading(false);

      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Signature added successfully",
      });
    } catch (error) {
      console.error("Error uploading signature:", error);
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error adding signature: " + error.message,
      });
    }
  };

  // Watermark handling functions
  const handleWatermarkImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Get signed URL for watermark upload
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `watermark_${Date.now()}_${file.name}`,
      });

      // Upload the watermark
      await uploadFile(signedUrlResponse.url, file);

      // Get the clean URL (without query parameters)
      const watermarkUrl = signedUrlResponse.url.split("?")[0];

      // Set the watermark image URL
      setWatermarkImage(watermarkUrl);
      setWatermarkType("image");

      setLoading(false);
    } catch (error) {
      console.error("Error uploading watermark image:", error);
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error uploading watermark image: " + error.message,
      });
    }
  };

  const addWatermark = () => {
    if (!editor) return;

    if (watermarkType === "text") {
      // Add text watermark
      const watermarkHTML = `
        <div class="watermark-container" style="position: relative; width: 100%; margin: 20px 0; text-align: center; min-height: 100px;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; pointer-events: none; z-index: 1;">
            <div style="opacity: ${watermarkOpacity}; color: ${watermarkColor}; font-size: ${watermarkSize}px; transform: rotate(${watermarkRotation}deg); white-space: nowrap; font-weight: bold; font-family: Arial, sans-serif;">
              ${watermarkText}
            </div>
          </div>
          <div style="position: relative; z-index: 2; min-height: 100px;">
            <p><br></p>
          </div>
        </div>
      `;

      editor.insertHTML(watermarkHTML);
    } else if (watermarkType === "image" && watermarkImage) {
      // Add image watermark
      const watermarkHTML = `
        <div class="watermark-container" style="position: relative; width: 100%; margin: 20px 0; text-align: center; min-height: 100px;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; pointer-events: none; z-index: 1;">
            <img src="${watermarkImage}" style="opacity: ${watermarkOpacity}; max-width: 50%; max-height: 50%; transform: rotate(${watermarkRotation}deg);" alt="Watermark" />
          </div>
          <div style="position: relative; z-index: 2; min-height: 100px;">
            <p><br></p>
          </div>
        </div>
      `;

      editor.insertHTML(watermarkHTML);
    } else {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Please select a watermark image first",
      });
      return;
    }

    // Close the dialog
    setWatermarkDialogOpen(false);

    // Show success message
    setAppAlert({
      alert: true,
      type: "success",
      msg: "Watermark added successfully",
    });
  };

  // Generate PDF from editor content
  const generatePDF = async (editorContent) => {
    // Create a temporary div to render the editor content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorContent;
    tempDiv.style.width = "100%";
    tempDiv.style.padding = "20px";
    document.body.appendChild(tempDiv);

    // Process all images to ensure they're loaded before capturing
    const images = tempDiv.querySelectorAll("img");
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve, reject) => {
            // Set crossOrigin to anonymous to handle CORS issues
            img.crossOrigin = "anonymous";

            // If image is already loaded
            if (img.complete) {
              // Check if the image has loaded successfully
              if (img.naturalWidth === 0) {
                console.warn("Image failed to load:", img.src);
                // Replace with placeholder or remove
                img.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
              }
              resolve();
            } else {
              // Set up event handlers for loading or error
              img.onload = () => {
                resolve();
              };
              img.onerror = () => {
                console.warn("Image failed to load:", img.src);
                // Replace with placeholder
                img.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                resolve();
              };
            }
          });
        })
      );
    }

    // Ensure tables are properly styled
    const tables = tempDiv.querySelectorAll("table");
    tables.forEach((table) => {
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      const cells = table.querySelectorAll("td, th");
      cells.forEach((cell) => {
        cell.style.border = "1px solid #ddd";
        cell.style.padding = "8px";
        cell.style.textAlign = "left";
      });
    });

    // Capture the rendered content with higher quality settings
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      height: tempDiv.scrollHeight,
      windowHeight: tempDiv.scrollHeight,
      scrollY: -window.scrollY,
      onclone: function (clonedDoc) {
        // Additional processing on the cloned document if needed
        const clonedImages = clonedDoc.querySelectorAll("img");
        clonedImages.forEach((img) => {
          img.style.maxWidth = "100%";
          img.style.height = "auto";
        });
      },
    });

    // Remove the temporary div
    document.body.removeChild(tempDiv);

    // Create a new jsPDF instance
    const doc = new jsPDF("p", "mm", "a4");

    // Set margins and page dimensions
    const margin = 11;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentHeight = pageHeight - 45;

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
          `Document Management`,
          pageWidth / 2,
          margin + 10,
          null,
          null,
          "center"
        );

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `${docType}`,
          pageWidth / 2,
          margin + 20,
          null,
          null,
          "center"
        );
        doc.text(`Date: ${docDate}`, pageWidth - margin - 45, margin + 20);

        // Add a line below the header
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

        // Set title in center
        doc.setFontSize(14);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Title: ${docTitle}`,
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
      doc.setTextColor(128, 128, 128);

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
      const contentYPosition = pageNumber === 1 ? margin + 35.7 : margin;

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
      const sectionData = canvasSection.toDataURL("image/png", 1.0); // Use higher quality

      // Add the section to the PDF with a corrected Y position
      doc.addImage(
        sectionData,
        "PNG",
        margin,
        contentYPosition,
        pageWidth - 2 * margin,
        (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
      );

      currentY += canvasSection.height;

      // Add dynamic footer to the page
      const footerText = `Document Management System (Page ${pageNumber})`;
      addFooter(doc, footerText);
    }

    return doc;
  };

  // Original functions from DocManageAuth.jsx
  // const handleEditDocument = async (id) => {
  //   try {
  //     setDocId(id);
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
  //       {
  //         headers: { Authorization: authToken },
  //       }
  //     );
  //     const document = response.data.doc;
  //     setDocTitle(document.title);
  //     setDocDetails(document.details);
  //     setDocType(document.type);
  //     setDocDate(new Date(document.applicableDate).toISOString().split("T")[0]);
  //     setDocStatus(document.documentStatus);
  //     setDocUrl(document.url);

  //     // Set the content in SunEditor
  //     if (editor) {
  //       editor.setContents(document.details);
  //     }
  //   } catch (error) {
  //     console.error("Error while fetching document for editing:", error);
  //     setAppAlert({
  //       alert: true,
  //       type: "error",
  //       msg: "Error fetching document: " + error.message,
  //     });
  //   }
  // };

  //new version
  const handleEditDocument = async (id) => {
    try {
      setDocId(id);
      console.log("✅ Editing document with ID:", id);

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
        {
          headers: { Authorization: authToken },
        }
      );

      const document = response.data.doc;
      console.log("✅ Document data for editing:", document);

      // Format the date properly
      const formattedDate = new Date(document.applicableDate)
        .toISOString()
        .split("T")[0];

      // Set all the form fields
      setNewDocument({
        header: document.header || "",
        title: document.title || "",
        details: document.details || "",
        applicableDate: formattedDate,
        footer: document.footer || "",
      });

      // Set the letter type
      setSelectedLetterType(document.letterType || "");

      // Set the editor content
      if (editor) {
        editor.setContents(document.details || "");
      }

      // Set the employee data
      if (document.empidd) {
        setSelectedEmployee(document.empidd);
        setEmployeeSelected(true);

        // Fetch employee data and add to store
        try {
          const empResponse = await axios.get(
            `${process.env.REACT_APP_API}/route/employee/get/letters1/${organisationId}`,
            {
              headers: { Authorization: authToken },
            }
          );

          if (empResponse.data && empResponse.data.employees) {
            const matchingEmployee = empResponse.data.employees.find(
              (emp) => emp._id === document.empidd
            );

            if (matchingEmployee) {
              // Get manager ID
              const managerIdResponse = await axios.get(
                `${process.env.REACT_APP_API}/route/org/getManager/${document.empidd}`,
                {
                  headers: { Authorization: authToken },
                }
              );

              const managerId = managerIdResponse.data.id;

              // Clear existing employees and add the new one
              clearEmployees();
              addEmployee(matchingEmployee, managerId);
              setManagerId(managerId);
            }
          }
        } catch (error) {
          console.error("❌ Error fetching employee data:", error);
          // Create a placeholder employee as fallback
          const placeholderEmployee = {
            _id: document.empidd,
            first_name: `Employee ${document.empidd.substring(0, 6)}`,
            last_name: "",
          };

          clearEmployees();
          addEmployee(placeholderEmployee, document.managerId);
          setManagerId(document.managerId);
        }
      }

      console.log("✅ Form fields set successfully for editing");
    } catch (error) {
      console.error("❌ Error while fetching document for editing:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error fetching document: " + error.message,
      });
    }
  };

  const handleSendToManager = async (docId) => {
    try {
      setLoading(true);

      // Update document status to Pending (for manager approval)
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
        { docId, newStatus: "Pending" },
        { headers: { Authorization: authToken } }
      );

      querClient.invalidateQueries("getOrgDocs");
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document sent to manager for approval",
      });
    } catch (error) {
      console.error("Error sending document to manager:", error);
      setLoading(false);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to send document to manager",
      });
    }
  };

  // Handler for sending document to employee
  const handleSendToEmployee = async (docId) => {
    try {
      setLoading(true);

      // Find the document from the data
      const document = data2.find((doc) => doc._id === docId);

      if (!document) {
        throw new Error("Document not found");
      }

      // Send the document to the employee
      await axios.post(
        `${process.env.REACT_APP_API}/route/org/updatearr/${docId}`,
        {
          employeeId: [document.empidd],
        },
        {
          headers: { Authorization: authToken },
        }
      );

      // Update document status
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
        { docId, newStatus: "Send" },
        { headers: { Authorization: authToken } }
      );

      querClient.invalidateQueries("getOrgDocs");
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document sent to employee successfully",
      });
    } catch (error) {
      console.error("Error sending document to employee:", error);
      setLoading(false);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to send document to employee",
      });
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      queryClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Deleted Successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error deleting document: " + error.message,
      });
    }
  };

  //sat working v2
  // const handleSelectDocument = async (id) => {
  //   try {
  //     // Use the same logic as handleEditDocument but for view-only documents
  //     setDocId(id.toString());
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
  //       {
  //         headers: { Authorization: authToken },
  //       }
  //     );
  //     const document = response.data.doc;
  //     console.log("Document data for selection:", document);

  //     // Convert the applicableDate to the 'YYYY-MM-DD' format
  //     const formattedDate = new Date(document.applicableDate)
  //       .toISOString()
  //       .split("T")[0];

  //     // Update the document form fields
  //     setNewDocument({
  //       header: document.header,
  //       title: document.title,
  //       details: document.details,
  //       applicableDate: formattedDate,
  //       type: document.type,
  //       footer: document.footer,
  //     });
  //     setSelectedLetterType(document.letterType);

  //     // Set the content in SunEditor if available
  //     if (editor) {
  //       editor.setContents(document.details || "");
  //     }

  //     // If we have an employee ID in the document
  //     if (document.empidd) {
  //       console.log("Employee ID from document:", document.empidd);

  //       // First, clear any existing employees in the store to avoid conflicts
  //       clearEmployees();

  //       try {
  //         // Fetch employee data using the same endpoint that DataTable uses
  //         const empResponse = await axios.get(
  //           `${process.env.REACT_APP_API}/route/employee/get/letters1/${organisationId}`,
  //           {
  //             headers: { Authorization: authToken },
  //           }
  //         );

  //         console.log("Employee list response:", empResponse.data);

  //         // Check if we have employees in the response
  //         if (
  //           empResponse.data &&
  //           empResponse.data.employees &&
  //           Array.isArray(empResponse.data.employees)
  //         ) {
  //           // Find the employee with matching ID
  //           const matchingEmployee = empResponse.data.employees.find(
  //             (emp) => emp._id === document.empidd
  //           );

  //           if (matchingEmployee) {
  //             console.log("Found matching employee:", matchingEmployee);

  //             // Get manager ID for this employee
  //             const managerIdResponse = await axios.get(
  //               `${process.env.REACT_APP_API}/route/org/getManager/${document.empidd}`,
  //               {
  //                 headers: { Authorization: authToken },
  //               }
  //             );

  //             const managerId = managerIdResponse.data.id;
  //             console.log("Manager ID for employee:", managerId);

  //             // Add to Zustand store
  //             addEmployee(matchingEmployee, managerId);
  //             setSelectedEmployee(document.empidd);
  //             setEmployeeSelected(true);
  //             setManagerId(managerId);
  //           } else {
  //             console.error("Employee not found in the list");

  //             // Create a placeholder with ID as name (last resort)
  //             const placeholderEmployee = {
  //               _id: document.empidd,
  //               first_name: `Employee ${document.empidd.substring(0, 6)}`,
  //               last_name: "",
  //             };

  //             addEmployee(placeholderEmployee, document.managerId);
  //             setSelectedEmployee(document.empidd);
  //             setEmployeeSelected(true);
  //             setManagerId(document.managerId);
  //           }
  //         } else {
  //           console.error("No employees array found in response");

  //           // Create a placeholder as last resort
  //           const placeholderEmployee = {
  //             _id: document.empidd,
  //             first_name: `Employee ${document.empidd.substring(0, 6)}`,
  //             last_name: "",
  //           };

  //           addEmployee(placeholderEmployee, document.managerId);
  //           setSelectedEmployee(document.empidd);
  //           setEmployeeSelected(true);
  //           setManagerId(document.managerId);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching employee data:", error);

  //         // Create a placeholder as last resort
  //         const placeholderEmployee = {
  //           _id: document.empidd,
  //           first_name: `Employee ${document.empidd.substring(0, 6)}`,
  //           last_name: "",
  //         };

  //         addEmployee(placeholderEmployee, document.managerId);
  //         setSelectedEmployee(document.empidd);
  //         setEmployeeSelected(true);
  //         setManagerId(document.managerId);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error while selecting document:", error);
  //     setAppAlert({
  //       alert: true,
  //       type: "error",
  //       msg: "Failed to load document data",
  //     });
  //   }
  // };

  const handleSelectDocument = async (id) => {
    try {
      // Use the same logic as handleEditDocument but for view-only documents
      setDocId(id.toString());
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
        {
          headers: { Authorization: authToken },
        }
      );
      const document = response.data.doc;
      console.log("Document data for selection:", document);

      // Convert the applicableDate to the 'YYYY-MM-DD' format
      const formattedDate = new Date(document.applicableDate)
        .toISOString()
        .split("T")[0];

      // Update the document form fields
      setNewDocument({
        header: document.header,
        title: document.title,
        details: document.details,
        applicableDate: formattedDate,
        type: document.type,
        footer: document.footer,
      });
      setSelectedLetterType(document.letterType);

      // Set the content in SunEditor if available
      if (editor) {
        editor.setContents(document.details || "");
      }

      // If we have an employee ID in the document
      if (document.empidd) {
        console.log("Employee ID from document:", document.empidd);

        // First, clear any existing employees in the store to avoid conflicts
        clearEmployees();

        try {
          // Fetch employee data using the same endpoint that DataTable uses
          const empResponse = await axios.get(
            `${process.env.REACT_APP_API}/route/employee/get/letters1/${organisationId}`,
            {
              headers: { Authorization: authToken },
            }
          );

          console.log("Employee list response:", empResponse.data);

          // Check if we have employees in the response
          if (
            empResponse.data &&
            empResponse.data.employees &&
            Array.isArray(empResponse.data.employees)
          ) {
            // Find the employee with matching ID
            const matchingEmployee = empResponse.data.employees.find(
              (emp) => emp._id === document.empidd
            );

            if (matchingEmployee) {
              console.log("Found matching employee:", matchingEmployee);

              // Get manager ID for this employee
              const managerIdResponse = await axios.get(
                `${process.env.REACT_APP_API}/route/org/getManager/${document.empidd}`,
                {
                  headers: { Authorization: authToken },
                }
              );

              const managerId = managerIdResponse.data.id;
              console.log("Manager ID for employee:", managerId);

              // Add to Zustand store
              addEmployee(matchingEmployee, managerId);
              setSelectedEmployee(document.empidd);
              setEmployeeSelected(true);
              setManagerId(managerId);
            } else {
              console.error("Employee not found in the list");

              // Create a placeholder with ID as name (last resort)
              const placeholderEmployee = {
                _id: document.empidd,
                first_name: `Employee ${document.empidd.substring(0, 6)}`,
                last_name: "",
              };

              addEmployee(placeholderEmployee, document.managerId);
              setSelectedEmployee(document.empidd);
              setEmployeeSelected(true);
              setManagerId(document.managerId);
            }
          } else {
            console.error("No employees array found in response");

            // Create a placeholder as last resort
            const placeholderEmployee = {
              _id: document.empidd,
              first_name: `Employee ${document.empidd.substring(0, 6)}`,
              last_name: "",
            };

            addEmployee(placeholderEmployee, document.managerId);
            setSelectedEmployee(document.empidd);
            setEmployeeSelected(true);
            setManagerId(document.managerId);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);

          // Create a placeholder as last resort
          const placeholderEmployee = {
            _id: document.empidd,
            first_name: `Employee ${document.empidd.substring(0, 6)}`,
            last_name: "",
          };

          addEmployee(placeholderEmployee, document.managerId);
          setSelectedEmployee(document.empidd);
          setEmployeeSelected(true);
          setManagerId(document.managerId);
        }
      }
    } catch (error) {
      console.error("Error while selecting document:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to load document data",
      });
    }
  };

  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "PDF URL is not available.",
      });
    }
  };

  useEffect(() => {
    const fetchManagerId = async () => {
      if (selectedEmployee) {
        try {
          console.log("Fetching manager ID for employee:", selectedEmployee);
          const managerIdResponse = await axios.get(
            `${process.env.REACT_APP_API}/route/org/getManager/${selectedEmployee}`,
            {
              headers: { Authorization: authToken },
            }
          );

          if (managerIdResponse.data && managerIdResponse.data.id) {
            setManagerId(managerIdResponse.data.id);
            console.log("✅ Manager ID set:", managerIdResponse.data.id);
          } else {
            console.warn("⚠️ No manager ID found for employee");
            setManagerId("");
          }
        } catch (error) {
          console.error("❌ Error fetching manager ID:", error);
          setManagerId("");
        }
      }
    };

    fetchManagerId();
  }, [selectedEmployee, authToken]);
  //sat 3
  // Update the handleCreateDocument function to handle managerId correctly
  const handleCreateDocument = async () => {
    try {
      // Validate inputs using the document schema
      try {
        documentSchema.parse({
          title: newDocument.title,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header,
          footer: newDocument.footer,
        });
      } catch (validationError) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: validationError.errors[0].message,
        });
        return;
      }

      if (!selectedEmployee) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please select an employee",
        });
        return;
      }

      if (!selectedLetterType) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please select a letter type",
        });
        return;
      }

      setLoading(true);

      // Get the editor content
      const editorContent = editor ? editor.getContents() : newDocument.details;

      // Generate the PDF
      const doc = await generatePDF(editorContent);
      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}_${Date.now()}.pdf`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      console.log(
        "✅ PDF uploaded successfully, URL:",
        signedUrlResponse.url.split("?")[0]
      );

      // Prepare the request payload
      const payload = {
        hrid: Hrid,
        managerId: managerId,
        empidd: selectedEmployee,
        type: "Letter",
        letterType: selectedLetterType,
        title: newDocument.title,
        details: editorContent,
        applicableDate: newDocument.applicableDate,
        activeDate: newDocument.applicableDate,
        documentStatus: "To Do",
        header: newDocument.header,
        footer: newDocument.footer,
        url: signedUrlResponse.url.split("?")[0],
        documentType: "letter",
        organisationId: organisationId,
      };

      // Only add managerId if it's not empty
      if (managerId) {
        payload.managerId = managerId; // The API will handle it as an array
        console.log("✅ Including manager ID in payload:", managerId);
      }

      console.log("✅ Sending payload:", payload);

      // Save the document data to the server
      await axios.post(
        `${process.env.REACT_APP_API}/route/org/${organisationId}/adddocuments`,
        payload,
        {
          headers: { Authorization: authToken },
        }
      );

      console.log("✅ Document created successfully");

      // Reset the form
      setDocId("");
      setNewDocument({
        header: "",
        footer: "",
        details: "",
        title: "",
        applicableDate: "",
      });
      setSelectedLetterType("");

      // Clear the editor
      if (editor) {
        editor.setContents("");
      }

      setLoading(false);

      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Created Successfully",
      });

      // Refresh the document list
      queryClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      console.error("❌ Error while creating document:", error);
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error creating document: " + (error.message || "Unknown error"),
      });
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setNewDocument((prevState) => ({
      ...prevState,
      updatedAt: today, // Add today's date
    }));
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeSelected(true);
    } else {
      setEmployeeSelected(false);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    console.log("✅ Current state - selectedEmployee:", selectedEmployee);
    console.log("✅ Current state - employeeSelected:", employeeSelected);
    console.log("✅ Current state - option:", option);
  }, [selectedEmployee, employeeSelected, option]);

  // const handleUpdateDocument = async () => {
  //   try {
  //     // Validate inputs
  //     if (!docTitle.trim()) {
  //       setAppAlert({
  //         alert: true,
  //         type: "error",
  //         msg: "Title is required",
  //       });
  //       return;
  //     }

  //     if (!docDetails.trim()) {
  //       setAppAlert({
  //         alert: true,
  //         type: "error",
  //         msg: "Document content is required",
  //       });
  //       return;
  //     }

  //     setLoading(true);

  //     // Get the editor content
  //     const editorContent = editor ? editor.getContents() : docDetails;

  //     // Generate the PDF
  //     const doc = await generatePDF(editorContent);
  //     const pdfDataUri = doc.output("datauristring");

  //     // Upload the generated PDF to your server
  //     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
  //       documentName: `${docTitle}`,
  //     });
  //     const blob = await fetch(pdfDataUri).then((res) => res.blob());
  //     await uploadFile(signedUrlResponse.url, blob);

  //     // Update the document data on the server
  //     await axios.patch(
  //       `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
  //       {
  //         title: docTitle,
  //         details: editorContent,
  //         applicableDate: docDate,
  //         activeDate: docDate,
  //         documentStatus: docStatus,
  //         type: docType,
  //         url: signedUrlResponse.url.split("?")[0],
  //       },
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );

  //     // Reset the form
  //     setDocId("");
  //     setDocTitle("");
  //     setDocDetails("");
  //     setDocType("Policies and Procedures");
  //     setDocDate(new Date().toISOString().split("T")[0]);
  //     setDocStatus("draft");
  //     setDocUrl("");

  //     // Clear the editor
  //     if (editor) {
  //       editor.setContents("");
  //     }

  //     setLoading(false);

  //     // Show success message
  //     setAppAlert({
  //       alert: true,
  //       type: "success",
  //       msg: "Document Updated Successfully",
  //     });

  //     // Refresh the document list
  //     queryClient.invalidateQueries("getOrgDocs");
  //   } catch (error) {
  //     console.error("Error while updating document:", error);
  //     setLoading(false);

  //     setAppAlert({
  //       alert: true,
  //       type: "error",
  //       msg: "Error updating document: " + (error.message || "Unknown error"),
  //     });
  //   }
  // };
  //sat working
  //   const handleUpdateDocument = async () => {
  //   try {
  //     // Validate inputs using the document schema
  //     try {
  //       documentSchema.parse({
  //         title: newDocument.title,
  //         // details: newDocument.details,
  //         applicableDate: newDocument.applicableDate,
  //         header: newDocument.header,
  //         footer: newDocument.footer,
  //         // letterType: selectedLetterType,
  //       });
  //     } catch (validationError) {
  //       setAppAlert({
  //         alert: true,
  //         type: "error",
  //         msg: validationError.errors[0].message,
  //       });
  //       return;
  //     }

  //     setLoading(true);

  //     // Get the editor content
  //     const editorContent = editor ? editor.getContents() : newDocument.details;

  //     // Generate the PDF
  //     const doc = await generatePDF(editorContent);
  //     const pdfDataUri = doc.output("datauristring");

  //     // Upload the generated PDF to your server
  //     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
  //       documentName: `${newDocument.title}_${Date.now()}.pdf`,
  //     });
  //     const blob = await fetch(pdfDataUri).then((res) => res.blob());
  //     await uploadFile(signedUrlResponse.url, blob);

  //     // Update the document data on the server
  //     await axios.patch(
  //       `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
  //       {
  //         title: newDocument.title,
  //         details: editorContent,
  //         applicableDate: newDocument.applicableDate,
  //         activeDate: newDocument.applicableDate,
  //         documentStatus: "To Do",
  //         type: "Letter",
  //         url: signedUrlResponse.url.split("?")[0],
  //         header: newDocument.header,
  //         footer: newDocument.footer,
  //         letterType: selectedLetterType,
  //       },
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );

  //     // Reset the form
  //     setDocId("");
  //     setNewDocument({
  //       header: "",
  //       footer: "",
  //       details: "",
  //       title: "",
  //       applicableDate: "",
  //     });
  //     setSelectedLetterType("");

  //     // Clear the editor
  //     if (editor) {
  //       editor.setContents("");
  //     }

  //     setLoading(false);

  //     // Show success message
  //     setAppAlert({
  //       alert: true,
  //       type: "success",
  //       msg: "Document Updated Successfully",
  //     });

  //     // Refresh the document list
  //     queryClient.invalidateQueries("getOrgDocs");
  //   } catch (error) {
  //     console.error("Error while updating document:", error);
  //     setLoading(false);

  //     setAppAlert({
  //       alert: true,
  //       type: "error",
  //       msg: "Error updating document: " + (error.message || "Unknown error"),
  //     });
  //   }
  // };
  const handleUpdateDocument = async () => {
    try {
      // Validate inputs using the document schema
      try {
        documentSchema.parse({
          title: newDocument.title,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header,
          footer: newDocument.footer,
        });
      } catch (validationError) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: validationError.errors[0].message,
        });
        return;
      }

      setLoading(true);

      // Get the editor content
      const editorContent = editor ? editor.getContents() : newDocument.details;

      // Generate the PDF
      const doc = await generatePDF(editorContent);
      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}_${Date.now()}.pdf`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      // Prepare the payload
      const payload = {
        title: newDocument.title,
        details: editorContent,
        applicableDate: newDocument.applicableDate,
        activeDate: newDocument.applicableDate,
        documentStatus: "To Do",
        type: "Letter",
        url: signedUrlResponse.url.split("?")[0],
        header: newDocument.header,
        footer: newDocument.footer,
        letterType: selectedLetterType,
      };

      if (managerId) {
        payload.managerId = [managerId]; // Send as array to match backend expectation
        console.log("✅ Including manager ID in update payload:", managerId);
      }

      // Update the document data on the server
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        payload,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Reset the form
      setDocId("");
      setNewDocument({
        header: "",
        footer: "",
        details: "",
        title: "",
        applicableDate: "",
      });
      setSelectedLetterType("");

      // Clear the editor
      if (editor) {
        editor.setContents("");
      }

      setLoading(false);

      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });

      // Refresh the document list
      queryClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      console.error("Error while updating document:", error);
      setLoading(false);

      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error updating document: " + (error.message || "Unknown error"),
      });
    }
  };

  const handleClearForm = () => {
    setDocId("");
    setDocTitle("");
    setDocDetails("");
    setDocType("Policies and Procedures");
    setDocDate(new Date().toISOString().split("T")[0]);
    setDocStatus("draft");
    setDocUrl("");

    // Clear the editor
    if (editor) {
      editor.setContents("");
    }
  };

  // Handle letter type selection
  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setSelectedLetterType(selectedType);
    loadLetterTemplate(selectedType);
  };

  // Update editor content when document changes
  useEffect(() => {
    if (editor && docDetails) {
      editor.setContents(docDetails);
    }
  }, [editor, docDetails]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any resources if needed
      if (editor) {
        // Any cleanup needed for SunEditor
      }
    };
  }, [editor]);

  // Reset form when option changes
  // useEffect(() => {
  //   // Reset document ID and form fields
  //   setDocId("");

  //   // Reset all form fields completely
  //   setNewDocument({
  //     header: "",
  //     footer: "",
  //     details: "",
  //     title: "",
  //     applicableDate: "",
  //   });

  //   // Reset selection states
  //   setSelectedLetterType("");

  //   // Reset employee selection when changing options
  //   if (option !== "emp") {
  //     setSelectedEmployee("");
  //     setEmployeeSelected(false);
  //   }
  // }, [option]);
  //sat v2
  useEffect(() => {
    // Reset document ID and form fields
    setDocId("");

    // Reset all form fields completely
    setNewDocument({
      header: "",
      footer: "",
      details: "",
      title: "",
      applicableDate: "",
    });

    // Reset selection states
    setSelectedLetterType("");

    // Only reset employee selection when changing to employee list view
    if (option === "emp") {
      // Don't reset here, as we want to maintain selection when returning from emp list
    }
  }, [option]);

  // Personalize template for selected employee
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

  // const handleSelectEmployee = (e) => {
  //   const selectedEmployeeId = e.target.value;
  //   setSelectedEmployee(selectedEmployeeId);
  //   setEmployeeSelected(true); // Set employee as selected

  //   // Find the selected employee's data
  //   const employeeData = savedEmployees?.find(
  //     (emp) => emp._id === selectedEmployeeId
  //   );

  //   // Update manager ID
  //   const managerId = savedManagers[selectedEmployeeId];
  //   setManagerId(managerId);

  //   // If we have a letter type selected, personalize the template for this employee
  //   if (
  //     selectedLetterType &&
  //     letterTemplates[selectedLetterType] &&
  //     employeeData
  //   ) {
  //     const template = letterTemplates[selectedLetterType];

  //     setNewDocument({
  //       ...newDocument,
  //       details: personalizeTemplate(template.details, employeeData),
  //     });

  //     // Update the editor content if available
  //     if (editor) {
  //       editor.setContents(personalizeTemplate(template.details, employeeData));
  //     }
  //   }
  // };

  // Get the data for the document list

  //sat
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

      // Update both the newDocument state and docDetails state
      setNewDocument({
        ...newDocument,
        header: template.header,
        title: template.title,
        details: personalizeTemplate(template.details, employeeData),
        footer: template.footer,
      });

      setDocDetails(personalizeTemplate(template.details, employeeData));

      // Update the editor content if available
      if (editor) {
        editor.setContents(personalizeTemplate(template.details, employeeData));
      }
    }
  };

  const { data: data2 } = useQuery(["getOrgDocs", organisationId], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/${organisationId}/getdocs/letters?type=Letter`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.doc;
  });

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Add Letter "}
          info={"You can manage company letters here"}
        />
        {/* Left Section (Document List or Options) */}
        {option === "emp" && (
          // <>
          <DataTable
            setOption={setOption}
            onSelectEmployee={(employeeId) => {
              console.log("✅ Employee selected:", employeeId);
              setSelectedEmployee(employeeId);
              setEmployeeSelected(true);
              console.log("✅ employeeSelected set to:", true);
              setOption(""); // Return to main view after selecting employee
              console.log("✅ Option set to empty string");
              //sat2
              // if (employeeId) {

              //   console.log("✅ Fetching manager ID for employee:", employeeId);
              //          axios.get(
              //     `${process.env.REACT_APP_API}/route/org/getManager/${employeeId}`,
              //     {
              //       headers: { Authorization: authToken },
              //     }
              //   )
              //   .then(response => {
              //     console.log("✅ Manager ID fetched successfully:", response.data.id);
              //     setManagerId(response.data.id);
              //   })
              //   .catch(error => {
              //     console.error(" ✅Error fetching manager ID:", error);
              //   });
              // }
            }}
          />
          // </>
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
                  onViewPDF={handleViewPDF}
                  onSelect={handleSelectDocument}
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
                    <Typography variant="h6" className="font-semibold mb-4">
                      {docId ? "Update Document" : "Create New Document"}
                    </Typography>
                  </div>

                  {docId && (
                    <div className="mb-4">
                      <div
                        className={`px-3 py-2 rounded-md ${
                          data2?.find((doc) => doc._id === docId)?.docstatus ===
                          "To Do"
                            ? "bg-yellow-50 border border-yellow-200"
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Pending"
                            ? "bg-blue-50 border border-blue-200"
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Accepted"
                            ? "bg-green-50 border border-green-200"
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Send"
                            ? "bg-purple-50 border border-purple-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "To Do"
                                ? "bg-yellow-500"
                                : data2?.find((doc) => doc._id === docId)
                                    ?.docstatus === "Pending"
                                ? "bg-blue-500"
                                : data2?.find((doc) => doc._id === docId)
                                    ?.docstatus === "Accepted"
                                ? "bg-green-500"
                                : data2?.find((doc) => doc._id === docId)
                                    ?.docstatus === "Send"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          <Typography variant="body2" className="font-medium">
                            Status:{" "}
                            <span className="font-bold">
                              {data2?.find((doc) => doc._id === docId)
                                ?.docstatus || "Unknown"}
                            </span>
                          </Typography>
                        </div>
                        <Typography
                          variant="caption"
                          className="block mt-1 ml-5 text-gray-600"
                        >
                          {data2?.find((doc) => doc._id === docId)
                            ?.docstatus === "To Do"
                            ? "This document is in draft/To Do mode and can be edited."
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Pending"
                            ? "This document is awaiting manager approval and cannot be edited."
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Accepted"
                            ? "This document has been approved by the manager and is ready to be sent to the employee."
                            : data2?.find((doc) => doc._id === docId)
                                ?.docstatus === "Send"
                            ? "This document has been sent to the employee."
                            : "Document status is Closed."}
                        </Typography>
                      </div>
                    </div>
                  )}

                  {!employeeSelected && !docId ? (
                    // Display message when no employee is selected
                    <div className="flex flex-col items-center justify-center h-64">
                      {console.log(
                        "✅ Rendering placeholder - Go to Employee List"
                      )}
                      <div className="w-full max-w-[200px] mt-8 mb-4 pt-8">
                        <DocManSvg className="w-full h-auto" />
                      </div>

                      <Alert severity="info" className="mb-4 mt-4">
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
                    // Display form when employee is selected
                    <>
                      {console.log("✅ Rendering form for selected employee")}
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
                          value={selectedEmployee}
                          className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                            !isDocumentEditable() ? "bg-gray-50" : "bg-gray-100"
                          }`}
                          disabled={!!docId} // Disable changing employee when editing
                        >
                          <option value="" disabled>
                            Select an Employee
                          </option>
                          {savedEmployees?.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                              {employee.first_name} {employee.last_name || ""}
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
                          Letter Type *
                        </label>
                        {/* <select
                          id="letterType"
                          value={selectedLetterType}
                          onChange={handleSelectChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!!docId} // Disable when editing any existing document
                        >
                          <option value="" disabled>
                            Select a Letter Type
                          </option>
                          {letterTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select> */}
                        {/* new ver */}
                        <select
                          id="letterType"
                          value={selectedLetterType || ""}
                          onChange={handleSelectChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!!docId} // Disable when editing any existing document
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
                          // onChange={(e) =>
                          //   setNewDocument((newDocument) => ({
                          //     ...newDocument,
                          //     header: e.target.value,
                          //   }))
                          // }
                          //new ver
                          onChange={(e) =>
                            setNewDocument((prev) => ({
                              ...prev,
                              header: e.target.value,
                            }))
                          }
                          disabled={!isDocumentEditable()}
                          fullWidth
                          margin="normal"
                          className={`${
                            !isDocumentEditable() ? "bg-gray-50" : "bg-gray-100"
                          }`}
                        />

                        <div className="mb-4">
                          <TextField
                            label="Title *"
                            size="small"
                            value={newDocument.title || ""}
                            // onChange={(e) =>
                            //   setNewDocument((newDocument) => ({
                            //     ...newDocument,
                            //     title: e.target.value,
                            //   }))
                            // }
                            //new ver
                            onChange={(e) =>
                              setNewDocument((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            disabled={!isDocumentEditable()}
                            fullWidth
                            margin="normal"
                            className={`${
                              !isDocumentEditable()
                                ? "bg-gray-50"
                                : "bg-gray-100"
                            }`}
                          />

                          <div style={{ width: "100%", maxWidth: "668px" }}>
                            {/* Custom toolbar buttons for signature and watermark */}
                            {isDocumentEditable() && (
                              <div className="flex space-x-2 mb-2">
                                {/* <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setSignatureDialogOpen(true)}
                                  className="text-xs"
                                >
                                  ✍️ Add Signature
                                </Button> */}
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setWatermarkDialogOpen(true)}
                                  className="text-xs"
                                >
                                  🔒 Add Watermark
                                </Button>
                              </div>
                            )}

                            {/* SunEditor Component */}
                            <SunEditor
                              setContents={newDocument.details}
                              onChange={handleEditorChange}
                              setOptions={getSunEditorOptions()}
                              onImageUploadBefore={handleImageUploadBefore}
                              getSunEditorInstance={handleEditorInitialized}
                              setDefaultStyle="font-family: Arial; font-size: 14px;"
                              placeholder="Enter document content here..."
                              disable={!isDocumentEditable()}
                            />
                          </div>

                          <TextField
                            label="Footer *"
                            size="small"
                            value={newDocument.footer || ""}
                            // onChange={(e) =>
                            //   setNewDocument((newDocument) => ({
                            //     ...newDocument,
                            //     footer: e.target.value,
                            //   }))
                            // }
                            //new ver
                            onChange={(e) =>
                              setNewDocument((prev) => ({
                                ...prev,
                                footer: e.target.value,
                              }))
                            }
                            disabled={!isDocumentEditable()}
                            fullWidth
                            margin="normal"
                            className={`${
                              !isDocumentEditable()
                                ? "bg-gray-50"
                                : "bg-gray-100"
                            }`}
                          />
                        </div>

                        <TextField
                          label="Applicable Date *"
                          size="small"
                          type="date"
                          value={newDocument.applicableDate || ""}
                          // onChange={(e) =>
                          //   setNewDocument({
                          //     ...newDocument,
                          //     applicableDate: e.target.value,
                          //   })
                          // }
                          //new ver
                          onChange={(e) =>
                            setNewDocument((prev) => ({
                              ...prev,
                              applicableDate: e.target.value,
                            }))
                          }
                          disabled={!isDocumentEditable()}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0], // Prevent past dates
                          }}
                          className={`${
                            !isDocumentEditable() ? "bg-gray-50" : "bg-gray-100"
                          }`}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Submit/Update Button Section - Only show if employee is selected */}
                {employeeSelected && (
                  <div className="flex gap-2 mt-3 justify-center">
                    {console.log(
                      "✅ Rendering submit button - employeeSelected:",
                      employeeSelected
                    )}
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
                      <>
                        {/* If document status is "To Do", show Update button */}
                        {isDocumentEditable() && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleUpdateDocument}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
                          >
                            Update
                          </Button>
                        )}

                        {/* Show Send to Manager button if appropriate */}
                        {isDocumentEditable() &&
                          letterWorkflow[selectedLetterType]?.workflow ===
                            true && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSendToManager(docId)}
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition duration-300"
                            >
                              Send to Manager
                            </Button>
                          )}

                        {/* Show Send to Employee button if appropriate */}
                        {/* Show Send to Employee button if appropriate */}
                        {((isDocumentEditable() &&
                          letterWorkflow[selectedLetterType]?.workflow ===
                            false) ||
                          data2?.find((doc) => doc._id === docId)?.docstatus ===
                            "Accepted") && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSendToEmployee(docId)}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md transition duration-300"
                          >
                            Send to Employee
                          </Button>
                        )}
                        {/* Clear button to reset the form */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleClearForm}
                          className="ml-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                          Clear
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Container>
            )}
          </div>
        )}
      </BoxComponent>

      {/* Signature Dialog */}
      <Dialog
        open={signatureDialogOpen}
        onClose={() => setSignatureDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Digital Signature</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              Draw your signature below:
            </Typography>
            <div
              className="border border-gray-300 rounded-md"
              style={{ touchAction: "none" }}
            >
              <SignaturePad
                ref={signaturePadRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className:
                    "signature-canvas w-full border border-gray-300 rounded-md",
                }}
                backgroundColor="rgb(255, 255, 255)"
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button
                variant="outlined"
                size="small"
                onClick={clearSignature}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={saveSignature}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Signature
              </Button>
            </div>
          </div>

          <Typography variant="subtitle2" className="mt-4 mb-2">
            Or upload a signature image:
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignatureDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Watermark Dialog */}
      <Dialog
        open={watermarkDialogOpen}
        onClose={() => setWatermarkDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Watermark</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              Watermark Type:
            </Typography>
            <div className="flex space-x-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  value="text"
                  checked={watermarkType === "text"}
                  onChange={() => setWatermarkType("text")}
                />
                <span className="ml-2 text-gray-700">Text Watermark</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  value="image"
                  checked={watermarkType === "image"}
                  onChange={() => setWatermarkType("image")}
                />
                <span className="ml-2 text-gray-700">Image Watermark</span>
              </label>
            </div>

            {watermarkType === "text" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Watermark Text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Text Color"
                  type="color"
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Opacity (0-1)"
                  type="number"
                  value={watermarkOpacity}
                  onChange={(e) =>
                    setWatermarkOpacity(
                      Math.max(0, Math.min(1, parseFloat(e.target.value)))
                    )
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                />
                <TextField
                  label="Rotation (degrees)"
                  type="number"
                  value={watermarkRotation}
                  onChange={(e) =>
                    setWatermarkRotation(parseInt(e.target.value))
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  inputProps={{ min: -180, max: 180, step: 5 }}
                />
                <TextField
                  label="Font Size (px)"
                  type="number"
                  value={watermarkSize}
                  onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 12, max: 120, step: 2 }}
                />
              </div>
            ) : (
              <div>
                <Typography variant="subtitle2" className="mt-2 mb-2">
                  Upload Watermark Image:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkImageUpload}
                  className="w-full border border-gray-300 rounded-md p-2"
                />

                {watermarkImage && (
                  <div className="mt-4">
                    <Typography variant="subtitle2" className="mb-2">
                      Preview:
                    </Typography>
                    <div className="border border-gray-300 rounded-md p-2 flex justify-center">
                      <img
                        src={watermarkImage}
                        alt="Watermark Preview"
                        style={{ maxWidth: "200px", maxHeight: "100px" }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <TextField
                        label="Opacity (0-1)"
                        type="number"
                        value={watermarkOpacity}
                        onChange={(e) =>
                          setWatermarkOpacity(
                            Math.max(0, Math.min(1, parseFloat(e.target.value)))
                          )
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 1, step: 0.1 }}
                      />
                      <TextField
                        label="Rotation (degrees)"
                        type="number"
                        value={watermarkRotation}
                        onChange={(e) =>
                          setWatermarkRotation(parseInt(e.target.value))
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        size="small"
                        inputProps={{ min: -180, max: 180, step: 5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <Typography variant="subtitle2" className="mb-2">
                Watermark Preview:
              </Typography>
              <div className="relative border border-gray-300 bg-white rounded-md p-8 min-h-[100px] flex justify-center items-center">
                {watermarkType === "text" ? (
                  <div
                    style={{
                      opacity: watermarkOpacity,
                      color: watermarkColor,
                      fontSize: `${watermarkSize}px`,
                      transform: `rotate(${watermarkRotation}deg)`,
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {watermarkText}
                  </div>
                ) : watermarkImage ? (
                  <img
                    src={watermarkImage}
                    alt="Watermark"
                    style={{
                      opacity: watermarkOpacity,
                      transform: `rotate(${watermarkRotation}deg)`,
                      maxWidth: "80%",
                      maxHeight: "80%",
                    }}
                  />
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    Please upload an image for the watermark
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWatermarkDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={addWatermark}
            color="primary"
            variant="contained"
            disabled={watermarkType === "image" && !watermarkImage}
          >
            Add Watermark
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocManageAuth;


