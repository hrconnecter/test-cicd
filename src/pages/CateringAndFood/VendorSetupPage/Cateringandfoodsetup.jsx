// import React, { useContext, useState, useEffect } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { FormControlLabel, Checkbox, Button } from "@mui/material"; // Import Material-UI components

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image",
//   ];

//   useEffect(() => {
//     // Fetch the vendor setup data on component mount
//     const fetchVendorSetupData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
//         );
//         const setupData = response.data.data;

//         // Populate the formData with the fetched data
//         setFormData({
//           vendorUpload: setupData.vendorUpload,
//           menuApproval: setupData.menuApproval,
//           hrApproval: setupData.hrApproval,
//           selectedDocuments: setupData.selectedDocuments,
//         });
//       } catch (error) {
//         console.error("Error fetching vendor setup data:", error);
//         setAppAlert({
//           alert: true,
//           type: "error",
//         });
//       }
//     };

//     fetchVendorSetupData();
//   }, [organisationId, setAppAlert]);

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       console.log(response.data.message); // Check the response structure here
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center">
//             <HeadingOneLineInfo
//               heading={"Food And Catering "}
//               info={"Vendor document and menu management settings"}
//             />
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
//             {/* Vendor Upload Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can vendors upload documents on their own?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             {/* Menu Approval Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can menu prices be approved by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             {/* Select Documents */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select documents that can be uploaded by vendors:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div
//                   key={index}
//                   className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.selectedDocuments.includes(option)}
//                         onChange={() => handleDocumentChange(option)}
//                         name={option}
//                       />
//                     }
//                     label={option}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* HR Approval Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Do documents uploaded by vendors need approval by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               sx={{ bgcolor: "#1414FE" }}
//             >
//               submit
//             </Button>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default CateringAndFoodSetup;




// import React, { useContext, useState, useEffect } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { FormControlLabel, Checkbox, Button } from "@mui/material"; // Import Material-UI components

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image",
//   ];

//   useEffect(() => {
//     // Fetch the vendor setup data on component mount
//     const fetchVendorSetupData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
//         );
//         const setupData = response.data.data;

//         // Populate the formData with the fetched data
//         setFormData({
//           vendorUpload: setupData.vendorUpload,
//           menuApproval: setupData.menuApproval,
//           hrApproval: setupData.hrApproval,
//           selectedDocuments: setupData.selectedDocuments,
//         });
//       } catch (error) {
//         console.error("Error fetching vendor setup data:", error);
//         setAppAlert({
//           alert: true,
//           type: "error",
//         });
//       }
//     };

//     fetchVendorSetupData();
//   }, [organisationId, setAppAlert]);

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleCheckboxChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       console.log(response.data.message); // Check the response structure here
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center">
//             <HeadingOneLineInfo
//               heading={"Food And Catering "}
//               info={"Vendor document and menu management settings"}
//             />
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
//             {/* Vendor Upload Checkbox */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can vendors upload documents on their own?
//               </label>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.vendorUpload}
//                     onChange={() => handleCheckboxChange("vendorUpload", !formData.vendorUpload)}
//                     name="vendorUpload"
//                   />
//                 }
//                 label="Yes"
//               />
//             </div>

//             {/* Menu Approval Checkbox */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can menu prices be approved by HR?
//               </label>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.menuApproval}
//                     onChange={() => handleCheckboxChange("menuApproval", !formData.menuApproval)}
//                     name="menuApproval"
//                   />
//                 }
//                 label="Yes"
//               />
//             </div>

//             {/* Select Documents */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select documents that can be uploaded by vendors:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div
//                   key={index}
//                   className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.selectedDocuments.includes(option)}
//                         onChange={() => handleDocumentChange(option)}
//                         name={option}
//                       />
//                     }
//                     label={option}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* HR Approval Checkbox */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Do documents uploaded by vendors need approval by HR?
//               </label>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.hrApproval}
//                     onChange={() => handleCheckboxChange("hrApproval", !formData.hrApproval)}
//                     name="hrApproval"
//                   />
//                 }
//                 label="Yes"
//               />
//             </div>

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               sx={{ bgcolor: "#1414FE" }}
//             >
//               Submit
//             </Button>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default CateringAndFoodSetup;




// import React, { useContext, useState, useEffect } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { FormControlLabel, Checkbox, Button } from "@mui/material"; // Import Material-UI components

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image",
//   ];

//   useEffect(() => {
//     // Fetch the vendor setup data on component mount
//     const fetchVendorSetupData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
//         );
//         const setupData = response.data.data;

//         // Populate the formData with the fetched data
//         setFormData({
//           vendorUpload: setupData.vendorUpload,
//           menuApproval: setupData.menuApproval,
//           hrApproval: setupData.hrApproval,
//           selectedDocuments: setupData.selectedDocuments,
//         });
//       } catch (error) {
//         console.error("Error fetching vendor setup data:", error);
//         setAppAlert({
//           alert: true,
//           type: "error",
//         });
//       }
//     };

//     fetchVendorSetupData();
//   }, [organisationId, setAppAlert]);

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleCheckboxChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       console.log(response.data.message); // Check the response structure here
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center">
//             <HeadingOneLineInfo
//               heading={"Food And Catering"}
//               info={"Vendor document and menu management settings"}
//             />
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
//             {/* Vendor Upload Checkbox */}
//             <div>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.vendorUpload}
//                     onChange={() => handleCheckboxChange("vendorUpload", !formData.vendorUpload)}
//                     name="vendorUpload"
//                   />
//                 }
//                 label="Vendors are allowed to upload documents themselves."
//                 labelPlacement="start" // Moves the checkbox to the left
//               />
//             </div>

//             {/* Menu Approval Checkbox */}
//             <div>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.menuApproval}
//                     onChange={() => handleCheckboxChange("menuApproval", !formData.menuApproval)}
//                     name="menuApproval"
//                   />
//                 }
//                 label="HR can approve menu prices."
//                 labelPlacement="start" // Moves the checkbox to the left
//               />
//             </div>

//             {/* Select Documents */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select the documents that vendors are allowed to upload:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div key={index} className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]">
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.selectedDocuments.includes(option)}
//                         onChange={() => handleDocumentChange(option)}
//                         name={option}
//                       />
//                     }
//                     label={option}
//                     labelPlacement="start" // Moves the checkbox to the left
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* HR Approval Checkbox */}
//             <div>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formData.hrApproval}
//                     onChange={() => handleCheckboxChange("hrApproval", !formData.hrApproval)}
//                     name="hrApproval"
//                   />
//                 }
//                 label="Documents uploaded by vendors need approval by HR."
//                 labelPlacement="start" // Moves the checkbox to the left
//               />
//             </div>

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               sx={{ bgcolor: "#1414FE" }}
//             >
//               Submit
//             </Button>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default CateringAndFoodSetup;




// import React, { useContext, useState, useEffect } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { FormControlLabel, Checkbox, Button } from "@mui/material";

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image",
//   ];

//   useEffect(() => {
//     const fetchVendorSetupData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
//         );
//         const setupData = response.data.data;

//         setFormData({
//           vendorUpload: setupData.vendorUpload,
//           menuApproval: setupData.menuApproval,
//           hrApproval: setupData.hrApproval,
//           selectedDocuments: setupData.selectedDocuments,
//         });
//       } catch (error) {
//         console.error("Error fetching vendor setup data:", error);
//         setAppAlert({
//           alert: true,
//           type: "error",
//         });
//       }
//     };

//     fetchVendorSetupData();
//   }, [organisationId, setAppAlert]);

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleCheckboxChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center">
//             <HeadingOneLineInfo
//               heading={"Food And Catering"}
//               info={"Vendor document and menu management settings"}
//             />
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
//             {/* Vendor Upload Checkbox */}
//             <div className="flex items-center mb-4">
//               <Checkbox
//                 checked={formData.vendorUpload}
//                 onChange={() =>
//                   handleCheckboxChange("vendorUpload", !formData.vendorUpload)
//                 }
//                 name="vendorUpload"
//               />
//               <span>Vendors are allowed to upload documents themselves.</span>
//             </div>

//             {/* Menu Approval Checkbox */}
//             <div className="flex items-center mb-4">
//               <Checkbox
//                 checked={formData.menuApproval}
//                 onChange={() =>
//                   handleCheckboxChange("menuApproval", !formData.menuApproval)
//                 }
//                 name="menuApproval"
//               />
//               <span>HR can approve menu prices.</span>
//             </div>

//             {/* Select Documents */}
//             <div className="mb-4">
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select the documents that vendors are allowed to upload:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <Checkbox
//                     checked={formData.selectedDocuments.includes(option)}
//                     onChange={() => handleDocumentChange(option)}
//                     name={option}
//                   />
//                   <span>{option}</span>
//                 </div>
//               ))}
//             </div>

//             {/* HR Approval Checkbox */}
//             <div className="flex items-center mb-4">
//               <Checkbox
//                 checked={formData.hrApproval}
//                 onChange={() =>
//                   handleCheckboxChange("hrApproval", !formData.hrApproval)
//                 }
//                 name="hrApproval"
//               />
//               <span>Documents uploaded by vendors need approval by HR.</span>
//             </div>

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               sx={{ bgcolor: "#1414FE" }}
//             >
//               Submit
//             </Button>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default CateringAndFoodSetup;



import React, { useContext, useState, useEffect } from "react";
import Setup from "../../SetUpOrganization/Setup";
import axios from "axios";
import { useParams } from "react-router-dom";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { UseContext } from "../../../State/UseState/UseContext";
import { Checkbox, Skeleton, Button } from "@mui/material";

const CateringAndFoodSetup = () => {
  const [formData, setFormData] = useState({
    vendorUpload: false,
    menuApproval: false,
    hrApproval: false,
    selectedDocuments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { organisationId } = useParams();
  const { setAppAlert } = useContext(UseContext);

  const documentOptions = [
    "Bank Account",
    "Food Catering License",
    "Aadhar",
    "PAN",
    "Shop Image",
  ];

  useEffect(() => {
    const fetchVendorSetupData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
        );
        const setupData = response.data.data;

        setFormData({
          vendorUpload: setupData.vendorUpload,
          menuApproval: setupData.menuApproval,
          hrApproval: setupData.hrApproval,
          selectedDocuments: setupData.selectedDocuments,
        });
      } catch (error) {
        console.error("Error fetching vendor setup data:", error);
        setAppAlert({
          alert: true,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorSetupData();
  }, [organisationId, setAppAlert]);

  const handleDocumentChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocuments: prev.selectedDocuments.includes(option)
        ? prev.selectedDocuments.filter((doc) => doc !== option)
        : [...prev.selectedDocuments, option],
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
        { formData }
      );

      setAppAlert({
        alert: true,
        type: "success",
        msg: response.data.message,
      });
    } catch (error) {
      console.error("API error:", error.response);

      setAppAlert({
        show: true,
        type: "error",
        msg: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
  
      <BoxComponent sx={{ p: 0 }}>
        <Setup>
          <div className="h-[90vh] overflow-y-auto scroll px-3">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Food And Catering"
              info="Vendor document and menu management settings"
            />
            {isLoading ? (
              <div>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={20} className="my-2" />
                ))}
                <Skeleton variant="rectangular" height={20} width="100px" className="my-4" />
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={formData.vendorUpload}
                    onChange={() =>
                      handleCheckboxChange("vendorUpload", !formData.vendorUpload)
                    }
                    name="vendorUpload"
                  />
                  <span className="text-m">Vendors are allowed to upload documents themselves.</span>
                </div>
    
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={formData.menuApproval}
                    onChange={() =>
                      handleCheckboxChange("menuApproval", !formData.menuApproval)
                    }
                    name="menuApproval"
                  />
                  <span className="text-m">HR can approve menu prices.</span>
                </div>
    
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={formData.hrApproval}
                    onChange={() =>
                      handleCheckboxChange("hrApproval", !formData.hrApproval)
                    }
                    name="hrApproval"
                  />
                  <span className="text-m">Documents uploaded by vendors need approval by HR.</span>
                </div>
    

                <div className="py-2">
                  <label className="block text-m font-medium text-gray-700 mb-2">
                    Select the documents that vendors are allowed to upload:
                  </label>
                  {documentOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={formData.selectedDocuments.includes(option)}
                        onChange={() => handleDocumentChange(option)}
                        name={option}
                      />
                      <span className="text-m">{option}</span>
                    </div>
                  ))}
                </div>
    
             
                <div className="py-4">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ bgcolor: "#1414FE" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Setup>
      </BoxComponent>
    );
};

export default CateringAndFoodSetup;
