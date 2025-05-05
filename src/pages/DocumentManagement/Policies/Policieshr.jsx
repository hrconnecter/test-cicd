/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
// import React from "react";
// import { Button, Container, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { useContext, useEffect, useState,useCallback } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import {
//   getSignedUrlForOrgDocs,
//   uploadFile,
// } from "../../../services/docManageS3";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
// import DocListemp from "./DocListemp";
// import html2canvas from "html2canvas";
// import { useParams } from "react-router-dom";
// import { z } from "zod";

// // Import SunEditor and its styles
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css';
// import plugins from 'suneditor/src/plugins';

// const Policieshr = () => {
//   const { authToken } = useGetUser();
//   const { getCurrentUser } = UserProfile();
//   const [loading, setLoading] = useState(false);
//   const { organisationId } = useParams();
  
//   // Create a state to store the editor instance instead of using a ref
//   const [editor, setEditor] = useState(null);

//   // Define a Zod schema to validate the form fields
//   const documentSchema = z.object({
//     title: z.string().min(1, { message: "Title is required" }),
//     details: z.string().min(1, { message: "Details are required" }),
//     applicableDate: z.string(),
//     activeDate: z.string(),
//     status: z.enum(['draft', 'active', 'inactive']).default('draft')
//   });

//   const { data } = useSubscriptionGet({
//     organisationId: organisationId,
//   });

//   const orgname = data?.organisation?.orgName;
//   const web_url = data?.organisation?.web_url;

//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   // const [isEditorUpdating, setIsEditorUpdating] = useState(false);

//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/org/ss/${organisationId}/getdocs/policies`,
//       {
//         headers: { Authorization: authToken },
//       } 
//     );

//     return response.data.doc;
//   });

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//     activeDate: "",
//     documentStatus: "draft",
//     type: "Policies and Procedures",
//   });

//   // SunEditor configuration
//   // const getSunEditorOptions = () => ({
//   //   plugins: plugins,
//   //   buttonList: [
//   //     ['undo', 'redo'],
//   //     ['font', 'fontSize', 'formatBlock'],
//   //     ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
//   //     ['removeFormat'],
//   //     ['fontColor', 'hiliteColor'],
//   //     ['outdent', 'indent'],
//   //     ['align', 'horizontalRule', 'list', 'lineHeight'],
//   //     ['table', 'image'],
//   //     ['fullScreen', 'showBlocks'],
//   //   ],
//   //   height: '250px',
//   //   width: '100%',
//   //   minHeight: '200px',
//   //   maxHeight: '400px',
//   //   imageUploadSizeLimit: 5242880, // 5MB
//   //   imageAccept: '.jpg, .jpeg, .png, .gif',

//   //   table: {
//   //     // Table selection settings
//   //     maxWidth: '100%',
//   //     defaultWidth: '100%',
//   //     defaultHeight: 100,
//   //     // Default attributes for inserting the table
//   //     defaultAttributes: {
//   //       width: '100%',
//   //       border: '1px solid #ddd',
//   //       borderCollapse: 'collapse'
//   //     },
//   //     // Default attributes for the table cell
//   //     defaultCellAttributes: {
//   //       style: 'border: 1px solid #ddd; padding: 8px;'
//   //     }
//   //   },
//   // //   // Image settings
//   // //   imageResizing: true,
//   // //   imageWidth: '100%',
//   // //   imageFileInput: true,
//   // //   imageUrlInput: true,
//   // //   imageGallery: false,
//   // //   autoFocus: false,
//   // // // Preserve the last selection range
//   // // historyStackDelayTime: 400,
//   // // // Disable auto save to prevent cursor reset
//   // // disableToolbar: false,
//   // // disableResizeObserver: true,
//   // // // Set a higher value for the delay time to reduce cursor reset frequency
//   // // resizingBarMinHeight: '0px'
//   // });
// // SunEditor configuration
// const getSunEditorOptions = () => ({
//   plugins: plugins,
//   buttonList: [
//     ['undo', 'redo'],
//     ['font', 'fontSize', 'formatBlock'],
//     ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
//     ['removeFormat'],
//     ['fontColor', 'hiliteColor'],
//     ['outdent', 'indent'],
//     ['align', 'horizontalRule', 'list', 'lineHeight'],
//     ['table', 'image'],
//     ['fullScreen', 'showBlocks'],
//   ],
//   height: '250px',
//   width: '100%',
//   minHeight: '200px',
//   maxHeight: '400px',
//   imageUploadSizeLimit: 5242880, // 5MB
//   imageAccept: '.jpg, .jpeg, .png, .gif',
  
//   // Enhanced image handling
//   imageFileInput: true,
//   imageUrlInput: true,
//   imageResizing: true,
//   imageWidth: '100%',
//   imageSizeOnlyPercentage: false,
  
//   // Table settings
//   table: {
//     maxWidth: '100%',
//     defaultWidth: '100%',
//     defaultHeight: 100,
//     defaultAttributes: {
//       width: '100%',
//       border: '1px solid #ddd',
//       borderCollapse: 'collapse'
//     },
//     defaultCellAttributes: {
//       style: 'border: 1px solid #ddd; padding: 8px;'
//     }
//   },
  
//   // Improved editor performance
//   historyStackDelayTime: 400,
//   charCounter: true,
//   charCounterType: 'char',
//   charCounterLabel: 'Characters: ',
  
//   // Ensure content is properly saved
//   callBackSave: function(contents) {
//     console.log('Content saved:', contents);
//   }
// });

 

//   // Handle editor initialization
//   const handleEditorInitialized = (sunEditor) => {
//     setEditor(sunEditor);
//     console.log("SunEditor initialized successfully");
//   };

  

 

//   // Handle image upload
//   // const handleImageUploadBefore = async (files, info, uploadHandler) => {
//   //   try {
//   //     // Get signed URL for image upload
//   //     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//   //       documentName: files[0].name,
//   //     });

//   //     // Upload the image
//   //     await uploadFile(signedUrlResponse.url, files[0]);

//   //     // Get the clean URL (without query parameters)
//   //     const imageUrl = signedUrlResponse.url.split("?")[0];

//   //     // Tell SunEditor the upload is complete and provide the URL
//   //     const response = {
//   //       result: [
//   //         {
//   //           url: imageUrl,
//   //           name: files[0].name,
//   //           size: files[0].size
//   //         }
//   //       ]
//   //     };

//   //     uploadHandler(response);
//   //   } catch (error) {
//   //     console.error("Error uploading image:", error);
//   //     return false;
//   //   }
//   // };
//   // Handle image upload
// const handleImageUploadBefore = async (files, info, uploadHandler) => {
//   try {
//     if (!files || files.length === 0) {
//       console.error("No files to upload");
//       return false;
//     }
    
//     setLoading(true); // Show loading indicator during upload
    
//     // Get signed URL for image upload
//     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//       documentName: `image_${Date.now()}_${files[0].name}`, // Ensure unique name
//     });

//     if (!signedUrlResponse || !signedUrlResponse.url) {
//       console.error("Failed to get signed URL for upload");
//       setLoading(false);
//       return false;
//     }

//     // Upload the image
//     const uploadResult = await uploadFile(signedUrlResponse.url, files[0]);
    
//     if (!uploadResult) {
//       console.error("Failed to upload image");
//       setLoading(false);
//       return false;
//     }

//     // Get the clean URL (without query parameters)
//     const imageUrl = signedUrlResponse.url.split("?")[0];
    
//     console.log("Image uploaded successfully:", imageUrl);

//     // Tell SunEditor the upload is complete and provide the URL
//     const response = {
//       result: [
//         {
//           url: imageUrl,
//           name: files[0].name,
//           size: files[0].size
//         }
//       ]
//     };

//     setLoading(false);
//     uploadHandler(response);
//     return response;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     setLoading(false);
    
//     // Show error alert
//     setAppAlert({
//       alert: true,
//       type: "error",
//       msg: "Error uploading image: " + error.message,
//     });
    
//     return false;
//   }
// };


//   const handleEditDocument = async (id) => {
//     try {
//       setDocId(id.toString());
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       const document = response.data.doc;
//       console.log("Document to edit:", document);

//       const formattedApplicableDate = new Date(document.applicableDate)
//         .toISOString()
//         .split("T")[0];
    
//       const formattedActiveDate = document.activeDate ? 
//         new Date(document.activeDate).toISOString().split("T")[0] : 
//         formattedApplicableDate;

//     //   const formattedApplicableDate = document.applicableDate ? 
//     //   new Date(document.applicableDate).toISOString().split("T")[0] : 
//     //   new Date().toISOString().split("T")[0];
  
//     // const formattedActiveDate = document.activeDate ? 
//     //   new Date(document.activeDate).toISOString().split("T")[0] : 
//     //   formattedApplicableDate;
  
    
//       // Update the state with the formatted date
//       setNewDocument({
//         title: document.title,
//         details: document.details,
//         applicableDate: formattedApplicableDate,
//         activeDate: formattedActiveDate,
//         type: document.type,
//         documentStatus: document.documentStatus
//       });
//       // setNewDocument({
//       //   title: document.title || "",
//       //   details: document.details || "",
//       //   applicableDate: formattedApplicableDate,
//       //   activeDate: formattedActiveDate,
//       //   type: document.type || "Policies and Procedures",
//       //   documentStatus: document.documentStatus || "draft"
//       // });

//     } catch (error) {
//       console.error("Error while fetching document for editing:", error);
//     }
//   };

//   const handleDeleteDoc = async (id) => {
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Deleted Successfully",
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setNewDocument((prevState) => ({
//       ...prevState,
//       applicableDate: today,
//     }));
//   }, []);

//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };

//   // const handleCreateDocument = async () => {
//   //   try {
//   //     setLoading(true);  

//   //     // Validate the newDocument using Zod schema
//   //     const validationResult = documentSchema.safeParse(newDocument);

//   //     if (!validationResult.success) {
//   //       setAppAlert({
//   //         alert: true,
//   //         type: "error",
//   //         msg: validationResult.error.errors[0].message,
//   //       });
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     // Check if editor is properly initialized
//   //     if (!editor) {
//   //       console.error("SunEditor is not initialized");
//   //       setAppAlert({
//   //         alert: true,
//   //         type: "error",
//   //         msg: "Editor not initialized properly. Please try again.",
//   //       });
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     // Get the HTML content from SunEditor
//   //     const editorContent = editor.getContents();
      
//   //     // Create a temporary div to render the editor content
//   //     const tempDiv = document.createElement('div');
//   //     tempDiv.innerHTML = editorContent;
//   //     tempDiv.style.width = '100%';
//   //     tempDiv.style.padding = '20px';
//   //     document.body.appendChild(tempDiv);

//   //     // Capture the rendered content
//   //     const canvas = await html2canvas(tempDiv, {
//   //       scale: 2,
//   //       logging: false,
//   //       useCORS: true,
//   //     });

//   //     // Remove the temporary div
//   //     document.body.removeChild(tempDiv);

//   //     // Create a new jsPDF instance
//   //     const doc = new jsPDF("p", "mm", "a4");

//   //     // Set margins and page dimensions
//   //     const margin = 11;
//   //     const pageWidth = doc.internal.pageSize.width;
//   //     const pageHeight = doc.internal.pageSize.height;
//   //     const contentHeight = pageHeight - 45;

//   //     // Split the canvas into multiple sections
//   //     const imgProps = canvas.getContext("2d").canvas;
//   //     const imgWidth = imgProps.width;
//   //     const imgHeight = imgProps.height;

//   //     // Calculate how many pages are needed
//   //     const imgPageHeight = contentHeight * (imgWidth / pageWidth);
//   //     let currentY = 0;
//   //     let pageNumber = 1;

//   //     // Function to add headers only on the first page
//   //     const addHeader = (doc, pageNumber) => {
//   //       if (pageNumber === 1) {
//   //         doc.setFontSize(18);
//   //         doc.setTextColor(0, 102, 204);
//   //         doc.text(`${orgname}`, pageWidth / 2, margin + 10, null, null, "center");

//   //         doc.setFontSize(12);
//   //         doc.setTextColor(0, 0, 0);
//   //         doc.text(`${newDocument.type}`, pageWidth / 2, margin + 20, null, null, "center");
//   //         doc.text(` Date: ${newDocument.applicableDate}`, pageWidth - margin - 45, margin + 20);

//   //         // Add a line below the header
//   //         doc.setLineWidth(0.5);
//   //         doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
         
//   //         // Set title in center
//   //         doc.setFontSize(14);
//   //         doc.setTextColor(128, 128, 128);
//   //         doc.text(`Title: ${newDocument.title}`, pageWidth / 2, margin + 35, null, null, "center");
//   //       }
//   //     };

//   //     // Function to add a dynamic footer with a horizontal line above it on each page
//   //     const addFooter = (doc, footerText) => {
//   //       doc.setFontSize(10);
//   //       doc.setTextColor(128, 128, 128);

//   //       // Add a horizontal line above the footer
//   //       const footerYPosition = pageHeight - 15;
//   //       doc.setLineWidth(0.5);
//   //       doc.line(margin, footerYPosition - 5, pageWidth - margin, footerYPosition - 5);

//   //       // Add dynamic footer text centered at the bottom of the page
//   //       doc.text(footerText, pageWidth / 2, footerYPosition, null, null, "center");
//   //     };

//   //     // Loop through content and add to pages
//   //     while (currentY < imgHeight) {
//   //       if (currentY > 0) {
//   //         doc.addPage();
//   //         pageNumber++;
//   //       }

//   //       // Add header only for the first page
//   //       addHeader(doc, pageNumber);

//   //       // Calculate the vertical starting position of content
//   //       const contentYPosition = (pageNumber === 1) ? margin + 35.70 : margin;

//   //       // Create a temporary canvas for the current section
//   //       const canvasSection = document.createElement("canvas");
//   //       const context = canvasSection.getContext("2d");

//   //       canvasSection.width = imgWidth;
//   //       canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);

//   //       // Copy the relevant section of the original canvas
//   //       context.drawImage(
//   //         canvas,
//   //         0,
//   //         currentY,
//   //         imgWidth,
//   //         canvasSection.height,
//   //         0,
//   //         0,
//   //         imgWidth,
//   //         canvasSection.height
//   //       );

//   //       // Convert the section to an image
//   //       const sectionData = canvasSection.toDataURL("image/png");

//   //       // Add the section to the PDF with a corrected Y position
//   //       doc.addImage(
//   //         sectionData,
//   //         "PNG",
//   //         margin,
//   //         contentYPosition,
//   //         pageWidth - 2 * margin,
//   //         (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
//   //       );

//   //       currentY += canvasSection.height;

//   //       // Add dynamic footer to the page
//   //       const footerText = `For more information, visit ${web_url} (Page ${pageNumber})`;
//   //       addFooter(doc, footerText);
//   //     }

//   //     // Get the PDF as a data URI
//   //     const pdfDataUri = doc.output("datauristring");

//   //     // Upload the PDF to the server
//   //     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//   //       documentName: `${newDocument.title}`,
//   //     });

//   //     const blob = await fetch(pdfDataUri).then((res) => res.blob());
//   //     await uploadFile(signedUrlResponse.url, blob);

//   //     await axios.post(
//   //       `${process.env.REACT_APP_API}/route/org/${organisationId}/adddocuments`,
//   //       {
//   //         title: newDocument.title,
//   //         details: newDocument.details,
//   //         applicableDate: newDocument.applicableDate,
//   //         activeDate: newDocument.activeDate,
//   //         status: 'draft',
//   //         type: newDocument.type,
//   //         url: signedUrlResponse.url.split("?")[0],
//   //       },
//   //       {
//   //         headers: { Authorization: authToken },
//   //       }
//   //     );
      
//   //     querClient.invalidateQueries("getOrgDocs");
//   //     setLoading(false);
//   //     setAppAlert({
//   //       alert: true,
//   //       type: "success",
//   //       msg: "Document Created Successfully",
//   //     });
     
//   //     setNewDocument({
//   //       title: "",
//   //       details: "",
//   //       applicableDate: new Date().toISOString().split("T")[0],
//   //       activeDate: "",
//   //       documentStatus: "draft",
//   //       type: "Policies and Procedures",
//   //     });

//   //     // Clear the editor
//   //     if (editor) {
//   //       editor.setContents('');
//   //     }

//   //   } catch (error) {
//   //     setLoading(false);
//   //     console.error("Error while uploading document and saving data:", error);
//   //     setAppAlert({
//   //       alert: true,
//   //       type: "error",
//   //       msg: "Error creating document: " + error.message,
//   //     });
//   //   }
//   // };


//   // const generatePDF = async (editorContent) => {
//   //   // Create a temporary div to render the editor content
//   //   const tempDiv = document.createElement('div');
//   //   tempDiv.innerHTML = editorContent;
//   //   tempDiv.style.width = '100%';
//   //   tempDiv.style.padding = '20px';
//   //   document.body.appendChild(tempDiv);
  
//   //   // Wait for images to load before capturing
//   //   const images = tempDiv.querySelectorAll('img');
//   //   if (images.length > 0) {
//   //     await Promise.all(Array.from(images).map(img => {
//   //       return new Promise((resolve) => {
//   //         if (img.complete) {
//   //           resolve();
//   //         } else {
//   //           img.onload = resolve;
//   //           img.onerror = resolve; // Continue even if image fails to load
//   //         }
//   //       });
//   //     }));
//   //   }
  
//   //   // Ensure tables are properly styled
//   //   const tables = tempDiv.querySelectorAll('table');
//   //   tables.forEach(table => {
//   //     table.style.width = '100%';
//   //     table.style.borderCollapse = 'collapse';
      
//   //     const cells = table.querySelectorAll('th, td');
//   //     cells.forEach(cell => {
//   //       cell.style.border = '1px solid #ddd';
//   //       cell.style.padding = '8px';
//   //       cell.style.textAlign = 'left';
//   //     });
//   //   });
  
//   //   // Capture the rendered content with higher quality settings
//   //   const canvas = await html2canvas(tempDiv, {
//   //     scale: 2,
//   //     logging: false,
//   //     useCORS: true,
//   //     allowTaint: true,
//   //     backgroundColor: '#ffffff',
//   //     height: tempDiv.scrollHeight,
//   //     windowHeight: tempDiv.scrollHeight,
//   //     scrollY: -window.scrollY,
//   //   });
  
//   //   // Remove the temporary div
//   //   document.body.removeChild(tempDiv);
  
//   //   // Create a new jsPDF instance
//   //   const doc = new jsPDF("p", "mm", "a4");
  
//   //   // Set margins and page dimensions
//   //   const margin = 11;
//   //   const pageWidth = doc.internal.pageSize.width;
//   //   const pageHeight = doc.internal.pageSize.height;
//   //   const contentHeight = pageHeight - 45;
  
//   //   // Split the canvas into multiple sections
//   //   const imgProps = canvas.getContext("2d").canvas;
//   //   const imgWidth = imgProps.width;
//   //   const imgHeight = imgProps.height;
  
//   //   // Calculate how many pages are needed
//   //   const imgPageHeight = contentHeight * (imgWidth / pageWidth);
//   //   let currentY = 0;
//   //   let pageNumber = 1;
  
//   //   // Function to add headers only on the first page
//   //   const addHeader = (doc, pageNumber) => {
//   //     if (pageNumber === 1) {
//   //       doc.setFontSize(18);
//   //       doc.setTextColor(0, 102, 204);
//   //       doc.text(`${orgname}`, pageWidth / 2, margin + 10, null, null, "center");
  
//   //       doc.setFontSize(12);
//   //       doc.setTextColor(0, 0, 0);
//   //       doc.text(`${newDocument.type}`, pageWidth / 2, margin + 20, null, null, "center");
//   //       doc.text(` Date: ${newDocument.applicableDate}`, pageWidth - margin - 45, margin + 20);
  
//   //       // Add a line below the header
//   //       doc.setLineWidth(0.5);
//   //       doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
       
//   //       // Set title in center
//   //       doc.setFontSize(14);
//   //       doc.setTextColor(128, 128, 128);
//   //       doc.text(`Title: ${newDocument.title}`, pageWidth / 2, margin + 35, null, null, "center");
//   //     }
//   //   };
  
//   //   // Function to add a dynamic footer with a horizontal line above it on each page
//   //   const addFooter = (doc, footerText) => {
//   //     doc.setFontSize(10);
//   //     doc.setTextColor(128, 128, 128);
  
//   //     // Add a horizontal line above the footer
//   //     const footerYPosition = pageHeight - 15;
//   //     doc.setLineWidth(0.5);
//   //     doc.line(margin, footerYPosition - 5, pageWidth - margin, footerYPosition - 5);
  
//   //     // Add dynamic footer text centered at the bottom of the page
//   //     doc.text(footerText, pageWidth / 2, footerYPosition, null, null, "center");
//   //   };
  
//   //   // Loop through content and add to pages
//   //   while (currentY < imgHeight) {
//   //     if (currentY > 0) {
//   //       doc.addPage();
//   //       pageNumber++;
//   //     }
  
//   //     // Add header only for the first page
//   //     addHeader(doc, pageNumber);
  
//   //     // Calculate the vertical starting position of content
//   //     const contentYPosition = (pageNumber === 1) ? margin + 35.70 : margin;
  
//   //     // Create a temporary canvas for the current section
//   //     const canvasSection = document.createElement("canvas");
//   //     const context = canvasSection.getContext("2d");
  
//   //     canvasSection.width = imgWidth;
//   //     canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);
  
//   //     // Copy the relevant section of the original canvas
//   //     context.drawImage(
//   //       canvas,
//   //       0,
//   //       currentY,
//   //       imgWidth,
//   //       canvasSection.height,
//   //       0,
//   //       0,
//   //       imgWidth,
//   //       canvasSection.height
//   //     );
  
//   //     // Convert the section to an image
//   //     const sectionData = canvasSection.toDataURL("image/png");
  
//   //     // Add the section to the PDF with a corrected Y position
//   //     doc.addImage(
//   //       sectionData,
//   //       "PNG",
//   //       margin,
//   //       contentYPosition,
//   //       pageWidth - 2 * margin,
//   //       (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
//   //     );
  
//   //     currentY += canvasSection.height;
  
//   //     // Add dynamic footer to the page
//   //     const footerText = `For more information, visit ${web_url} (Page ${pageNumber})`;
//   //     addFooter(doc, footerText);
//   //   }
  
//   //   return doc.output("datauristring");
//   // };
//   const generatePDF = async (editorContent) => {
//     // Create a temporary div to render the editor content
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = editorContent;
//     tempDiv.style.width = '100%';
//     tempDiv.style.padding = '20px';
//     document.body.appendChild(tempDiv);
  
//     // Process all images to ensure they're loaded before capturing
//     const images = tempDiv.querySelectorAll('img');
//     if (images.length > 0) {
//       await Promise.all(Array.from(images).map(img => {
//         return new Promise((resolve, reject) => {
//           // Set crossOrigin to anonymous to handle CORS issues
//           img.crossOrigin = "anonymous";
          
//           // If image is already loaded
//           if (img.complete) {
//             // Check if the image has loaded successfully
//             if (img.naturalWidth === 0) {
//               console.warn("Image failed to load:", img.src);
//               // Replace with placeholder or remove
//               img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
//             }
//             resolve();
//           } else {
//             // Set up event handlers for loading or error
//             img.onload = () => {
//               resolve();
//             };
//             img.onerror = () => {
//               console.warn("Image failed to load:", img.src);
//               // Replace with placeholder
//               img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
//               resolve();
//             };
            
//             // Handle potential CORS issues by trying to load via proxy if needed
//             const originalSrc = img.src;
//             if (originalSrc.startsWith('http') && !originalSrc.includes(window.location.hostname)) {
//               // Try to use the original URL first
//               img.src = originalSrc;
//             }
//           }
//         });
//       }));
//     }
  
//     // Ensure tables are properly styled
//     const tables = tempDiv.querySelectorAll('table');
//     tables.forEach(table => {
//       table.style.width = '100%';
//       table.style.borderCollapse = 'collapse';
      
//       const cells = table.querySelectorAll('th, td');
//       cells.forEach(cell => {
//         cell.style.border = '1px solid #ddd';
//         cell.style.padding = '8px';
//         cell.style.textAlign = 'left';
//       });
//     });
  
//     // Capture the rendered content with higher quality settings
//     const canvas = await html2canvas(tempDiv, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: '#ffffff',
//       height: tempDiv.scrollHeight,
//       windowHeight: tempDiv.scrollHeight,
//       scrollY: -window.scrollY,
//       onclone: function(clonedDoc) {
//         // Additional processing on the cloned document if needed
//         const clonedImages = clonedDoc.querySelectorAll('img');
//         clonedImages.forEach(img => {
//           img.style.maxWidth = '100%';
//           img.style.height = 'auto';
//         });
//       }
//     });
  
//     // Remove the temporary div
//     document.body.removeChild(tempDiv);
  
//     // Create a new jsPDF instance
//     const doc = new jsPDF("p", "mm", "a4");
  
//     // Set margins and page dimensions
//     const margin = 11;
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const contentHeight = pageHeight - 45;
  
//     // Split the canvas into multiple sections
//     const imgProps = canvas.getContext("2d").canvas;
//     const imgWidth = imgProps.width;
//     const imgHeight = imgProps.height;
  
//     // Calculate how many pages are needed
//     const imgPageHeight = contentHeight * (imgWidth / pageWidth);
//     let currentY = 0;
//     let pageNumber = 1;
  
//     // Function to add headers only on the first page
//     const addHeader = (doc, pageNumber) => {
//       if (pageNumber === 1) {
//         doc.setFontSize(18);
//         doc.setTextColor(0, 102, 204);
//         doc.text(`${orgname}`, pageWidth / 2, margin + 10, null, null, "center");
  
//         doc.setFontSize(12);
//         doc.setTextColor(0, 0, 0);
//         doc.text(`${newDocument.type}`, pageWidth / 2, margin + 20, null, null, "center");
//         doc.text(` Date: ${newDocument.applicableDate}`, pageWidth - margin - 45, margin + 20);
  
//         // Add a line below the header
//         doc.setLineWidth(0.5);
//         doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
       
//         // Set title in center
//         doc.setFontSize(14);
//         doc.setTextColor(128, 128, 128);
//         doc.text(`Title: ${newDocument.title}`, pageWidth / 2, margin + 35, null, null, "center");
//       }
//     };
  
//     // Function to add a dynamic footer with a horizontal line above it on each page
//     const addFooter = (doc, footerText) => {
//       doc.setFontSize(10);
//       doc.setTextColor(128, 128, 128);
  
//       // Add a horizontal line above the footer
//       const footerYPosition = pageHeight - 15;
//       doc.setLineWidth(0.5);
//       doc.line(margin, footerYPosition - 5, pageWidth - margin, footerYPosition - 5);
  
//       // Add dynamic footer text centered at the bottom of the page
//       doc.text(footerText, pageWidth / 2, footerYPosition, null, null, "center");
//     };
  
//     // Loop through content and add to pages
//     while (currentY < imgHeight) {
//       if (currentY > 0) {
//         doc.addPage();
//         pageNumber++;
//       }
  
//       // Add header only for the first page
//       addHeader(doc, pageNumber);
  
//       // Calculate the vertical starting position of content
//       const contentYPosition = (pageNumber === 1) ? margin + 35.70 : margin;
  
//       // Create a temporary canvas for the current section
//       const canvasSection = document.createElement("canvas");
//       const context = canvasSection.getContext("2d");
  
//       canvasSection.width = imgWidth;
//       canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);
  
//       // Copy the relevant section of the original canvas
//       context.drawImage(
//         canvas,
//         0,
//         currentY,
//         imgWidth,
//         canvasSection.height,
//         0,
//         0,
//         imgWidth,
//         canvasSection.height
//       );
  
//       // Convert the section to an image
//       const sectionData = canvasSection.toDataURL("image/png", 1.0); // Use higher quality
  
//       // Add the section to the PDF with a corrected Y position
//       doc.addImage(
//         sectionData,
//         "PNG",
//         margin,
//         contentYPosition,
//         pageWidth - 2 * margin,
//         (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
//       );
  
//       currentY += canvasSection.height;
  
//       // Add dynamic footer to the page
//       const footerText = `For more information, visit ${web_url} (Page ${pageNumber})`;
//       addFooter(doc, footerText);
//     }
  
//     return doc.output("datauristring");
//   };
  
//   const handleCreateDocument = async () => {
//     try {
//       setLoading(true);  
  
//       // Validate the newDocument using Zod schema
//       const validationResult = documentSchema.safeParse(newDocument);
  
//       if (!validationResult.success) {
//         setAppAlert({
//           alert: true,
//           type: "error",
//           msg: validationResult.error.errors[0].message,
//         });
//         setLoading(false);
//         return;
//       }
  
//       // Check if editor is properly initialized
//       if (!editor) {
//         console.error("SunEditor is not initialized");
//         setAppAlert({
//           alert: true,
//           type: "error",
//           msg: "Editor not initialized properly. Please try again.",
//         });
//         setLoading(false);
//         return;
//       }
  
//       // Get the HTML content from SunEditor
//       const editorContent = editor.getContents();
  
      
//       // Generate PDF from editor content
//       const pdfDataUri = await generatePDF(editorContent);
  
//       // Upload the PDF to the server
//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });
  
//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);
  
//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/${organisationId}/adddocuments`,
//         {
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           activeDate: newDocument.activeDate,
//           status: 'draft',
//           type: newDocument.type,
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
      
//       querClient.invalidateQueries("getOrgDocs");
//       setLoading(false);
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Created Successfully",
//       });
     
//       setNewDocument({
//         title: "",
//         details: "",
//         applicableDate: new Date().toISOString().split("T")[0],
//         activeDate: "",
//         documentStatus: "draft",
//         type: "Policies and Procedures",
//       });
  
//       // Clear the editor
//       if (editor) {
//         editor.setContents('');
//       }
  
//     } catch (error) {
//       setLoading(false);
//       console.error("Error while uploading document and saving data:", error);
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Error creating document: " + error.message,
//       });
//     }
//   };
  
//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setNewDocument((prevState) => ({
//       ...prevState,
//       updatedAt: today,
//     }));
//   }, []);

//   // const handleUpdateDocument = async () => {
//   //   try {
//   //     const updatedAt = new Date().toISOString().split("T")[0];
//   //     setLoading(true);

//   //     // Check if editor is properly initialized
//   //     if (!editor) {
//   //       console.error("SunEditor is not initialized");
//   //       setAppAlert({
//   //         alert: true,
//   //         type: "error",
//   //         msg: "Editor not initialized properly. Please try again.",
//   //       });
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     // Get the HTML content from SunEditor
//   //     const editorContent = editor.getContents();
       
//   //     // Create a temporary div to render the editor content
//   //     const tempDiv = document.createElement('div');
//   //     tempDiv.innerHTML = editorContent;
//   //     tempDiv.style.width = '100%';
//   //     tempDiv.style.padding = '20px';
//   //     document.body.appendChild(tempDiv);

//   //     // Capture the rendered content
//   //     const canvas = await html2canvas(tempDiv, {
//   //       scale: 2,
//   //       logging: false,
//   //       useCORS: true,
//   //     });

//   //     // Remove the temporary div
//   //     document.body.removeChild(tempDiv);

//   //     // Create a new jsPDF instance
//   //     const doc = new jsPDF("p", "mm", "a4");

//   //     // Set margins and page dimensions
//   //     const margin = 11;
//   //     const pageWidth = doc.internal.pageSize.width;
//   //     const pageHeight = doc.internal.pageSize.height;
//   //     const contentHeight = pageHeight - 45;

//   //     // Split the canvas into multiple sections
//   //     const imgProps = canvas.getContext("2d").canvas;
//   //     const imgWidth = imgProps.width;
//   //     const imgHeight = imgProps.height;

//   //     // Calculate how many pages are needed
//   //     const imgPageHeight = contentHeight * (imgWidth / pageWidth);
//   //     let currentY = 0;
//   //     let pageNumber = 1;

//   //     // Function to add headers only on the first page
//   //     const addHeader = (doc, pageNumber) => {
//   //       if (pageNumber === 1) {
//   //         doc.setFontSize(18);
//   //         doc.setTextColor(0, 102, 204);
//   //         doc.text(`${orgname}`, pageWidth / 2, margin + 10, null, null, "center");

//   //         doc.setFontSize(12);
//   //         doc.setTextColor(0, 0, 0);
//   //         doc.text(`${newDocument.type}`, pageWidth / 2, margin + 20, null, null, "center");
//   //         doc.text(` Date: ${newDocument.applicableDate}`, pageWidth - margin - 45, margin + 20);

//   //         // Add a line below the header
//   //         doc.setLineWidth(0.5);
//   //         doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
         
//   //         // Set title in center
//   //         doc.setFontSize(14);
//   //         doc.setTextColor(128, 128, 128);
//   //         doc.text(`Title: ${newDocument.title}`, pageWidth / 2, margin + 35, null, null, "center");
//   //       }
//   //     };

//   //     // Function to add a dynamic footer with a horizontal line above it on each page
//   //     const addFooter = (doc, footerText) => {
//   //       doc.setFontSize(10);
//   //       doc.setTextColor(128, 128, 128);

//   //       // Add a horizontal line above the footer
//   //       const footerYPosition = pageHeight - 15;
//   //       doc.setLineWidth(0.5);
//   //       doc.line(margin, footerYPosition - 5, pageWidth - margin, footerYPosition - 5);

//   //       // Add dynamic footer text centered at the bottom of the page
//   //       doc.text(footerText, pageWidth / 2, footerYPosition, null, null, "center");
//   //     };

//   //     // Loop through content and add to pages
//   //     while (currentY < imgHeight) {
//   //       if (currentY > 0) {
//   //         doc.addPage();
//   //         pageNumber++;
//   //       }

//   //       // Add header only for the first page
//   //       addHeader(doc, pageNumber);

//   //       // Calculate the vertical starting position of content
//   //       const contentYPosition = (pageNumber === 1) ? margin + 35.70 : margin;

//   //       // Create a temporary canvas for the current section
//   //       const canvasSection = document.createElement("canvas");
//   //       const context = canvasSection.getContext("2d");

//   //       canvasSection.width = imgWidth;
//   //       canvasSection.height = Math.min(imgPageHeight, imgHeight - currentY);

//   //       // Copy the relevant section of the original canvas
//   //       context.drawImage(
//   //         canvas,
//   //         0,
//   //         currentY,
//   //         imgWidth,
//   //         canvasSection.height,
//   //         0,
//   //         0,
//   //         imgWidth,
//   //         canvasSection.height
//   //       );

//   //       // Convert the section to an image
//   //       const sectionData = canvasSection.toDataURL("image/png");

//   //       // Add the section to the PDF with a corrected Y position
//   //       doc.addImage(
//   //         sectionData,
//   //         "PNG",
//   //         margin,
//   //         contentYPosition,
//   //         pageWidth - 2 * margin,
//   //         (pageWidth - 2 * margin) * (canvasSection.height / imgWidth)
//   //       );

//   //       currentY += canvasSection.height;

//   //       // Add dynamic footer to the page
//   //       const footerText = `For more information, visit ${web_url} (Page ${pageNumber})`;
//   //       addFooter(doc, footerText);
//   //     }

//   //     // Get the PDF as a data URI
//   //     const pdfDataUri = doc.output("datauristring");

//   //     // Upload the PDF to the server
//   //     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//   //       documentName: `${newDocument.title}`,
//   //     });

//   //     const blob = await fetch(pdfDataUri).then((res) => res.blob());
//   //     await uploadFile(signedUrlResponse.url, blob);

//   //     await axios.patch(
//   //       `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//   //       {
//   //         type: newDocument.type,
//   //         title: newDocument.title,
//   //         details: newDocument.details,
//   //         applicableDate: newDocument.applicableDate,
//   //         activeDate: newDocument.activeDate,
//   //         documentStatus: newDocument.documentStatus,
//   //         updatedAt: updatedAt,
//   //         url: signedUrlResponse.url.split("?")[0],
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: authToken,
//   //         },
//   //       }
//   //     );

//   //     setDocId("");
//   //     setNewDocument({
//   //       title: "",
//   //       details: "",
//   //       applicableDate: new Date().toISOString().split("T")[0],
//   //       activeDate: "",
//   //       documentStatus: "draft",
//   //       type: "Policies and Procedures",
//   //     });

//   //     // Clear the editor
//   //     if (editor) {
//   //       editor.setContents('');
//   //     }

//   //     querClient.invalidateQueries("getOrgDocs");
//   //     setLoading(false);
//   //     setAppAlert({
//   //       alert: true,
//   //       type: "success",
//   //       msg: "Document Updated Successfully",
//   //     });
//   //   } catch (error) {
//   //     setLoading(false);
//   //     console.error("Error while updating document:", error);
//   //     setAppAlert({
//   //       alert: true,
//   //       type: "error",
//   //       msg: "Error updating document: " + error.message,
//   //     });
//   //   }
//   // };
 
//   // Effect to update editor content when document changes
//   // Similarly update handleUpdateDocument:



// const handleUpdateDocument = async () => {
//   try {
//     const updatedAt = new Date().toISOString().split("T")[0];
//     setLoading(true);

//     // Check if editor is properly initialized
//     if (!editor) {
//       console.error("SunEditor is not initialized");
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Editor not initialized properly. Please try again.",
//       });
//       setLoading(false);
//       return;
//     }

//     // Get the HTML content from SunEditor
//     const editorContent = editor.getContents();
    
//     // Generate PDF from editor content
//     const pdfDataUri = await generatePDF(editorContent);

//     // Upload the PDF to the server
//     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//       documentName: `${newDocument.title}`,
//     });

//     const blob = await fetch(pdfDataUri).then((res) => res.blob());
//     await uploadFile(signedUrlResponse.url, blob);

//     await axios.patch(
//       `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//       {
//         type: newDocument.type,
//         title: newDocument.title,
//         details: newDocument.details,
//         applicableDate: newDocument.applicableDate,
//         activeDate: newDocument.activeDate,
//         documentStatus: newDocument.documentStatus,
//         updatedAt: updatedAt,
//         url: signedUrlResponse.url.split("?")[0],
//       },
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );

//     setDocId("");
//     setNewDocument({
//       title: "",
//       details: "",
//       applicableDate: new Date().toISOString().split("T")[0],
//       activeDate: "",
//       documentStatus: "draft",
//       type: "Policies and Procedures",
//     });

//     // Clear the editor
//     if (editor) {
//       editor.setContents('');
//     }

//     querClient.invalidateQueries("getOrgDocs");
//     setLoading(false);
//     setAppAlert({
//       alert: true,
//       type: "success",
//       msg: "Document Updated Successfully",
//     });
//   } catch (error) {
//     setLoading(false);
//     console.error("Error while updating document:", error);
//     setAppAlert({
//       alert: true,
//       type: "error",
//       msg: "Error updating document: " + error.message,
//     });
//   }
// };
  
  
//   useEffect(() => {
//     if (editor && newDocument.details) {
//       editor.setContents(newDocument.details);
//     }
//   }, [editor, newDocument.details,docId]);

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo heading={"Add Policies and Procedures"} info={"You can manage policies and procedures here."}/>
   
//       {/* Circular Loader */}
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-95 z-50">
//           <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
//         </div>
//       )}
          
//       <div className="w-full h-full flex flex-col sm:flex-row justify-around gap-6 bg-gray-50 min-h-screen">
//         {/* Left Section (Document List) */}
//         <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4">
//           <DocListemp
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             onViewPDF={handleViewPDF}
//             data={data2}
//           />
//         </Container>

//         {/* Right Section (Document Form) */}
//         <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
//           <div id="document-content">
//             <div
//               style={{ borderBottom: "2px solid gray" }}
//               className="w-full flex justify-center mb-6"
//             >
//               <Typography className="!font-semibold !text-xl">
//                 {docId ? "Update Record" : "Create Record"} 
//               </Typography>
//             </div>

//             <div className="mb-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Type *
//               </label>
//               <select
//                 value={newDocument.type}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, type: e.target.value })
//                 }
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
//               >
//                 <option value="Policies and Procedures">
//                   Policies and Procedures
//                 </option>
//               </select>
//             </div>

//             <div className="mb-6">
//               <TextField
//                 label="Title *"
//                 size="small"
//                 value={newDocument.title || ""}
//                 onChange={(e) =>
//                   setNewDocument((newDocument) => ({ ...newDocument, title: e.target.value }))
//                 }
//                 fullWidth
//                 margin="normal"
//                 className="bg-gray-100"
//               />

//               {/* SunEditor Component - Using getSunEditorInstance to properly initialize the editor */}
//               {/* <div className="w-full mb-9">
//                 <SunEditor
//                   getSunEditorInstance={handleEditorInitialized}
//                   setContents={newDocument.details}
//                   onChange={(content) => {
//                     setNewDocument({ ...newDocument, details: content });
//                   }}
//                   setOptions={getSunEditorOptions()}
//                   onImageUploadBefore={handleImageUploadBefore}
//                 />
//               </div> */}

// {/* <div className="w-full mb-9">
//    <SunEditor
//      getSunEditorInstance={handleEditorInitialized}
//      setContents={newDocument.details || ""}
//      defaultValue={newDocument.details || ""}
//      onChange={(content) => {
//        setNewDocument((prev) => ({ ...prev, details: content }));
//      }}
//      setOptions={getSunEditorOptions()}
//      onImageUploadBefore={handleImageUploadBefore}
//    />
//  </div> */}

// <div className="w-full mb-9">
//   <SunEditor
//     getSunEditorInstance={handleEditorInitialized}
//     setContents={newDocument.details || ""}
//     defaultValue={newDocument.details || ""}
//     onChange={(content) => {
//       setNewDocument((prev) => ({ ...prev, details: content }));
//     }}
//     setOptions={getSunEditorOptions()}
//     onImageUploadBefore={handleImageUploadBefore}
//     setDefaultStyle="font-family: Arial; font-size: 14px;"
//     placeholder="Enter document content here..."
//     // Add key to force re-initialization when docId changes
//     key={`editor-${docId || 'new'}`}
//   />
// </div>



//               <TextField
//                 label="Applicable Date *"
//                 size="small"
//                 type="date"
//                 value={newDocument.applicableDate}
//                 onChange={(e) =>
//                   setNewDocument({
//                     ...newDocument,
//                     applicableDate: e.target.value,
//                   })
//                 }
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   min: new Date().toISOString().split("T")[0],
//                 }}
//                 className="bg-gray-100"
//               />

//               <TextField
//                 label="Active Date *"
//                 size="small"
//                 type="date"
//                 value={newDocument.activeDate}
//                 onChange={(e) =>
//                   setNewDocument({
//                     ...newDocument,
//                     activeDate: e.target.value,
//                   })
//                 }
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   min: new Date().toISOString().split("T")[0],
//                 }}
//                 className="bg-gray-100"
//               />
//             </div>
//           </div>

//           {/* Submit/Update Button Section */}
//           <div className="flex gap-2 mt-3 justify-center">
//             {!docId ? (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleCreateDocument}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//               >
//                 Submit
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleUpdateDocument}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//               >
//                 Update
//               </Button>
//             )}
//           </div>
//         </Container>
//       </div>
//     </BoxComponent>
//   );
// };

// export default Policieshr;


//NEW UI 
//suneditor
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Container, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import {
  getSignedUrlForOrgDocs,
  uploadFile,
} from "../../../services/docManageS3";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../../hooks/UserData/useUser";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import html2canvas from "html2canvas";
import DocListemp from "./DocListemp";
import { useParams } from "react-router-dom";
import { z } from "zod";
  
// Import SunEditor and its styles
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';

// Import signature pad for digital signatures
import SignaturePad from 'react-signature-canvas';

const Policieshr = () => {
  const { authToken } = useGetUser();
  const { getCurrentUser } = UserProfile();
  const [loading, setLoading] = useState(false);
  const { organisationId } = useParams();
  
  // Create a state to store the editor instance
  const [editor, setEditor] = useState(null);

  // Define a Zod schema to validate the form fields
  const documentSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    details: z.string().min(1, { message: "Details are required" }),
    applicableDate: z.string(),
    activeDate: z.string(),
    status: z.enum(['draft', 'active', 'inactive']).default('draft')
  });

  const { data } = useSubscriptionGet({
    organisationId: organisationId,
  });

  const orgname = data?.organisation?.orgName;
  const web_url = data?.organisation?.web_url;

  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);

  // Signature related states
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState('');
  const signaturePadRef = useRef(null);

  // Watermark related states
  const [watermarkDialogOpen, setWatermarkDialogOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState('#888888');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(-45);
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkImage, setWatermarkImage] = useState('');
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'

  const { data: data2 } = useQuery(`getOrgDocs`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/ss/${organisationId}/getdocs/policies`,
      {
        headers: { Authorization: authToken },
      } 
    );

    return response.data.doc;
  });

  const [newDocument, setNewDocument] = useState({
    title: "",
    details: "",
    applicableDate: "",
    activeDate: "",
    documentStatus: "draft",
    type: "Policies and Procedures",
  });

  // SunEditor configuration
  const getSunEditorOptions = () => ({
    plugins: plugins,
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['fontColor', 'hiliteColor'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'image'],
      ['fullScreen', 'showBlocks'],
      // Custom buttons will be added via the toolbar
    ],
    height: '250px',
    width: '100%',
    minHeight: '200px',
    maxHeight: '400px',
    imageUploadSizeLimit: 5242880, // 5MB
    imageAccept: '.jpg, .jpeg, .png, .gif',
    
    // Enhanced image handling
    imageFileInput: true,
    imageUrlInput: true,
    imageResizing: true,
    imageWidth: '100%',
    imageSizeOnlyPercentage: false,
    
    // Table settings
    table: {
      maxWidth: '100%',
      defaultWidth: '100%',
      defaultHeight: 100,
      defaultAttributes: {
        width: '100%',
        border: '1px solid #ddd',
        borderCollapse: 'collapse'
      },
      defaultCellAttributes: {
        style: 'border: 1px solid #ddd; padding: 8px;'
      }
    },
    
    // Improved editor performance
    historyStackDelayTime: 400,
    charCounter: true,
    charCounterType: 'char',
    charCounterLabel: 'Characters: ',
    
    // Ensure content is properly saved
    callBackSave: function(contents) {
      console.log('Content saved:', contents);
    }
  });

  // Handle editor initialization
  const handleEditorInitialized = (sunEditor) => {
    setEditor(sunEditor);
    console.log("SunEditor initialized successfully");
    
    // Add custom buttons to the toolbar
    // if (sunEditor) {
    //   // Add signature button
    //   sunEditor.addModule([{
    //     name: 'signature',
    //     display: 'command',
    //     title: 'Insert Signature',
    //     buttonClass: '',
    //     innerHTML: '<span style="font-size: 14px;">✍️</span>',
    //     onclick: () => {
    //       setSignatureDialogOpen(true);
    //     }
    //   }]);
      
    //   // Add watermark button
    //   sunEditor.addModule([{
    //     name: 'watermark',
    //     display: 'command',
    //     title: 'Add Watermark',
    //     buttonClass: '',
    //     innerHTML: '<span style="font-size: 14px;">🔒</span>',
    //     onclick: () => {
    //       setWatermarkDialogOpen(true);
    //     }
    //   }]);
    // }
  };

  // Handle image upload
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
            size: files[0].size
          }
        ]
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
        const signatureDataUrl = signaturePadRef.current.toDataURL('image/png');
        
        // Convert data URL to blob
        const blob = await fetch(signatureDataUrl).then(res => res.blob());
        
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
  const addWatermark = () => {
    if (!editor) return;
    
    if (watermarkType === 'text') {
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
    } else if (watermarkType === 'image' && watermarkImage) {
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

  // Handle watermark image upload
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
      setWatermarkType('image');
      
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
      console.log("Document to edit:", document);

      const formattedApplicableDate = new Date(document.applicableDate)
        .toISOString()
        .split("T")[0];
    
      const formattedActiveDate = document.activeDate ? 
        new Date(document.activeDate).toISOString().split("T")[0] : 
        formattedApplicableDate;
    
      // Update the state with the formatted date
      setNewDocument({
        title: document.title,
        details: document.details,
        applicableDate: formattedApplicableDate,
        activeDate: formattedActiveDate,
        type: document.type,
        documentStatus: document.documentStatus
      });
      
      // Set the editor content
      if (editor) {
        editor.setContents(document.details || '');
      }
    } catch (error) {
      console.error("Error while fetching document for editing:", error);
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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNewDocument((prevState) => ({
      ...prevState,
      applicableDate: today,
    }));
  }, []);

  // Function to open the PDF in a new tab
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("PDF URL is not available.");
    }
  };

  const generatePDF = async (editorContent) => {
    // Create a temporary div to render the editor content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    tempDiv.style.width = '100%';
    tempDiv.style.padding = '20px';
    document.body.appendChild(tempDiv);
  
    // Process all images to ensure they're loaded before capturing
    const images = tempDiv.querySelectorAll('img');
    if (images.length > 0) {
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
          // Set crossOrigin to anonymous to handle CORS issues
          img.crossOrigin = "anonymous";
          
          // If image is already loaded
          if (img.complete) {
            // Check if the image has loaded successfully
            if (img.naturalWidth === 0) {
              console.warn("Image failed to load:", img.src);
              // Replace with placeholder or remove
              img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
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
              img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
              resolve();
            };
            
            // Handle potential CORS issues by trying to load via proxy if needed
            const originalSrc = img.src;
            if (originalSrc.startsWith('http') && !originalSrc.includes(window.location.hostname)) {
              // Try to use the original URL first
              img.src = originalSrc;
            }
          }
        });
      }));
    }
  
    // Ensure tables are properly styled
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.style.textAlign = 'left';
      });
    });
  
    // Capture the rendered content with higher quality settings
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: tempDiv.scrollHeight,
      windowHeight: tempDiv.scrollHeight,
      scrollY: -window.scrollY,
      onclone: function(clonedDoc) {
        // Additional processing on the cloned document if needed
        const clonedImages = clonedDoc.querySelectorAll('img');
        clonedImages.forEach(img => {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        });
      }
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
        doc.text(`${orgname}`, pageWidth / 2, margin + 10, null, null, "center");
  
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${newDocument.type}`, pageWidth / 2, margin + 20, null, null, "center");
        doc.text(` Date: ${newDocument.applicableDate}`, pageWidth - margin - 45, margin + 20);
  
        // Add a line below the header
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
       
        // Set title in center
        doc.setFontSize(14);
        doc.setTextColor(128, 128, 128);
        doc.text(`Title: ${newDocument.title}`, pageWidth / 2, margin + 35, null, null, "center");
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
      const footerText = `For more information, visit ${web_url || "our website"} (Page ${pageNumber})`; // Dynamic footer text
      addFooter(doc, footerText);
    }

    return doc;
  };

  const handleCreateDocument = async () => {
    try {
      // Validate the document data
      const validationResult = documentSchema.safeParse({
        ...newDocument,
        details: editor ? editor.getContents() : ""
      });

      if (!validationResult.success) {
        // Extract the error messages
        const errorMessages = validationResult.error.errors.map((err) => {
          return `${err.path.join(".")}: ${err.message}`;
        });

        setAppAlert({
          alert: true,
          type: "error",
          msg: errorMessages.join("\n"),
        });
        return;
      }

      setLoading(true);

      // Get the editor content
      const editorContent = editor.getContents();
      
      // Generate the PDF
      const doc = await generatePDF(editorContent);
      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      // Save the document data to the server
      await axios.post(
        `${process.env.REACT_APP_API}/route/org/${organisationId}/adddocuments`,
        {
          title: newDocument.title,
          details: editorContent,
          applicableDate: newDocument.applicableDate,
          activeDate: newDocument.activeDate || newDocument.applicableDate,
          documentStatus: newDocument.documentStatus,
          type: newDocument.type,
          url: signedUrlResponse.url.split("?")[0],
        },
        {
          headers: { Authorization: authToken },
        }
      );

      // Reset the form
      setNewDocument({
        title: "",
        details: "",
        applicableDate: new Date().toISOString().split("T")[0],
        activeDate: "",
        documentStatus: "draft",
        type: "Policies and Procedures",
      });
      
      // Clear the editor
      if (editor) {
        editor.setContents("");
      }
      
      setDocId("");
      setLoading(false);
      
      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Created Successfully",
      });
      
      // Refresh the document list
      querClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      console.error("Error while creating document:", error);
      setLoading(false);
      
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error creating document: " + (error.message || "Unknown error"),
      });
    }
  };

  const handleUpdateDocument = async () => {
    try {
      // Validate the document data
      const validationResult = documentSchema.safeParse({
        ...newDocument,
        details: editor ? editor.getContents() : ""
      });

      if (!validationResult.success) {
        // Extract the error messages
        const errorMessages = validationResult.error.errors.map((err) => {
          return `${err.path.join(".")}: ${err.message}`;
        });

        setAppAlert({
          alert: true,
          type: "error",
          msg: errorMessages.join("\n"),
        });
        return;
      }

      setLoading(true);

      // Get the editor content
      const editorContent = editor.getContents();
      
      // Generate the PDF
      const doc = await generatePDF(editorContent);
      const pdfDataUri = doc.output("datauristring");

      // Upload the generated PDF to your server
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      // Update the document data on the server
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          title: newDocument.title,
          details: editorContent,
          applicableDate: newDocument.applicableDate,
          activeDate: newDocument.activeDate || newDocument.applicableDate,
          documentStatus: newDocument.documentStatus,
          url: signedUrlResponse.url.split("?")[0],
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Reset the form
      setNewDocument({
        title: "",
        details: "",
        applicableDate: new Date().toISOString().split("T")[0],
        activeDate: "",
        documentStatus: "draft",
        type: "Policies and Procedures",
      });
      
      // Clear the editor
      if (editor) {
        editor.setContents("");
      }
      
      setDocId("");
      setLoading(false);
      
      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });
      
      // Refresh the document list
      querClient.invalidateQueries("getOrgDocs");
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

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/toggle-document-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Refresh the document list
      querClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      console.error("Error toggling status:", error);
      
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error toggling document status: " + (error.message || "Unknown error"),
      });
    }
  };

  // Function to handle content change in SunEditor
  const handleEditorChange = (content) => {
    setNewDocument(prev => ({
      ...prev,
      details: content
    }));
  };

  // Function to clear the form
  const handleClearForm = () => {
    setDocId("");
    setNewDocument({
      title: "",
      details: "",
      applicableDate: new Date().toISOString().split("T")[0],
      activeDate: "",
      documentStatus: "draft",
      type: "Policies and Procedures",
    });
    
    // Clear the editor
    if (editor) {
      editor.setContents("");
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Policies and Procedures"}
        info={"You can manage company documents here"}
      />
      <div className="w-full h-full flex flex-col sm:flex-row justify-around gap-6 bg-gray-50 min-h-screen">
        {/* Circular Loader */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Left Section (Document List) */}
        <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4">
          <Typography variant="h6" className="mb-4 font-semibold">
            Document List
          </Typography>
          
          <div className="space-y-4">
            {data2?.map((doc) => (
              <div
                key={doc._id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Type: {doc.type}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Date: {new Date(doc.applicableDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Status: {doc.documentStatus}
                    </Typography>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditDocument(doc._id)}
                      className="min-w-0 px-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewPDF(doc.url)}
                      className="min-w-0 px-2"
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteDoc(doc._id)}
                      className="min-w-0 px-2"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color={doc.documentStatus === "active" ? "success" : "warning"}
                      onClick={() => handleStatusToggle(doc._id, doc.documentStatus)}
                      className="min-w-0 px-2"
                    >
                      {doc.documentStatus === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {(!data2 || data2.length === 0) && (
              <Typography variant="body1" className="text-center text-gray-500 my-8">
                No documents found. Create your first document!
              </Typography>
            )}
          </div>
        </Container>

        {/* Right Section (Create/Update Record) */}
        <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
          <div
            style={{ borderBottom: "2px solid gray" }}
            className="w-full flex justify-center mb-6"
          >
            <Typography className="!font-semibold !text-xl">
              {docId ? "Update " : "Create "}
            </Typography>
          </div>

          <div className="mb-4">
            <TextField
              label="Title"
              size="small"
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />

            <div className="mb-4">
              <TextField
                label="Document Type"
                size="small"
                value={newDocument.type}
                onChange={(e) =>
                  setNewDocument((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                fullWidth
                margin="normal"
              />

              <div className="mt-4 mb-2">
                <Typography variant="subtitle2" className="mb-1">
                  Document Content
                </Typography>
                
                {/* Custom toolbar buttons for signature and watermark */}
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
                
                {/* SunEditor Component */}
                <SunEditor
                  setContents={newDocument.details}
                  onChange={handleEditorChange}
                  setOptions={getSunEditorOptions()}
                  onImageUploadBefore={handleImageUploadBefore}
                  getSunEditorInstance={handleEditorInitialized}
                  setDefaultStyle="font-family: Arial; font-size: 14px;"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <TextField
                  label="Applicable Date"
                  size="small"
                  type="date"
                  value={newDocument.applicableDate}
                  onChange={(e) =>
                    setNewDocument({
                      ...newDocument,
                      applicableDate: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Active Date"
                  size="small"
                  type="date"
                  value={newDocument.activeDate || ""}
                  onChange={(e) =>
                    setNewDocument({
                      ...newDocument,
                      activeDate: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              {/* <div className="mt-4">
                <Typography variant="subtitle2" className="mb-1">
                  Document Status
                </Typography>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      value="draft"
                      checked={newDocument.documentStatus === "draft"}
                      onChange={() =>
                        setNewDocument({
                          ...newDocument,
                          documentStatus: "draft",
                        })
                      }
                    />
                    <span className="ml-2 text-gray-700">Draft</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      value="active"
                      checked={newDocument.documentStatus === "active"}
                      onChange={() =>
                        setNewDocument({
                          ...newDocument,
                          documentStatus: "active",
                        })
                      }
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      value="inactive"
                      checked={newDocument.documentStatus === "inactive"}
                      onChange={() =>
                        setNewDocument({
                          ...newDocument,
                          documentStatus: "inactive",
                        })
                      }
                    />
                    <span className="ml-2 text-gray-700">Inactive</span>
                  </label>
                </div>
              </div> */}
            </div>
          </div>

          <div className="flex gap-2 mt-3 justify-center">
            {!docId ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleCreateDocument}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create "}
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleUpdateDocument}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update "}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearForm}
                  className="ml-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>

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
            <div className="border border-gray-300 rounded-md" style={{ touchAction: 'none' }}>
              <SignaturePad
                ref={signaturePadRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "signature-canvas w-full border border-gray-300 rounded-md"
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
                  checked={watermarkType === 'text'}
                  onChange={() => setWatermarkType('text')}
                />
                <span className="ml-2 text-gray-700">Text Watermark</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  value="image"
                  checked={watermarkType === 'image'}
                  onChange={() => setWatermarkType('image')}
                />
                <span className="ml-2 text-gray-700">Image Watermark</span>
              </label>
            </div>

            {watermarkType === 'text' ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Watermark Text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Opacity (0-1)"
                    type="number"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rotation (degrees)"
                    type="number"
                    value={watermarkRotation}
                    onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{ min: -180, max: 180, step: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
              </Grid>
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
                        style={{ maxWidth: '200px', maxHeight: '100px' }} 
                      />
                    </div>
                    
                    <Grid container spacing={2} className="mt-2">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Opacity (0-1)"
                          type="number"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 0, max: 1, step: 0.1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Rotation (degrees)"
                          type="number"
                          value={watermarkRotation}
                          onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          size="small"
                          inputProps={{ min: -180, max: 180, step: 5 }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <Typography variant="subtitle2" className="mb-2">
                Watermark Preview:
              </Typography>
              <div className="relative border border-gray-300 bg-white rounded-md p-8 min-h-[100px] flex justify-center items-center">
                {watermarkType === 'text' ? (
                  <div 
                    style={{
                      opacity: watermarkOpacity,
                      color: watermarkColor,
                      fontSize: `${watermarkSize}px`,
                      transform: `rotate(${watermarkRotation}deg)`,
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      whiteSpace: 'nowrap'
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
                      maxWidth: '80%',
                      maxHeight: '80%'
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
            disabled={watermarkType === 'image' && !watermarkImage}
          >
            Add Watermark
          </Button>
        </DialogActions>
      </Dialog>
    </BoxComponent>
  );
};

export default Policieshr;