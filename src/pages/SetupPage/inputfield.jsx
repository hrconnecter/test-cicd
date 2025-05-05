// import { Checkbox, FormControlLabel } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import Setup from "../SetUpOrganization/Setup";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BasicButton from "../../components/BasicButton";
// const Inputfield = () => {
//   const { organisationId } = useParams("");
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];

//   const [inputDetail, setinputDetail] = useState([]);

//   useEffect(() => {
//     const fetchInputFieldData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         setinputDetail(response.data.inputField.inputDetail);
//       } catch (error) {
//         console.error("Error fetching input fields:", error);
//       }
//     };

//     fetchInputFieldData();
//   }, [authToken, organisationId]);

//   const handleInputFieldChange = (field) => {
//     const updatedInputField = inputDetail.map((inputField) => {
//       if (inputField.label === field.label) {
//         // Toggle the isActive property
//         return { ...inputField, isActive: !inputField.isActive };
//       }
//       return inputField;
//     });

//     setinputDetail(updatedInputField);
//   };

//   const sendRequestToBackend = async () => {
//     try {
//       const updatedInputDetails = inputDetail.map((field) => ({
//         inputDetailId: field._id, // Assuming you have a unique ID for each input detail
//         isActive: field.isActive,
//         label: field.label,
//       }));

//       // Send a PUT request to update the input fields
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/inputfield/update/${organisationId}`,
//         { inputDetails: updatedInputDetails },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       handleAlert(true, "success", response.data.message);
//     } catch (error) {
//       // Handle errors
//       handleAlert("Failed to apply changes", "error");
//     }
//   };

//   return ( 
//     <>
//       <BoxComponent sx={{ p: 0 }}>
//         <Setup>
//           <div className="h-[90vh] overflow-y-auto scroll px-3">
//             <HeadingOneLineInfo
//               className="!my-3"
//               heading="Additional Employee Data"
//               info=" Select checkbox to know additional information about your
//                   employee."
//             />
//             <div>
//               {inputDetail.map((field, _id) => (
//                 <div
//                   key={_id}
//                   className="flex justify-between py-1"
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={field.isActive}
//                         onChange={() => handleInputFieldChange(field)}
//                       />
//                     }
//                     label={field.label}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="py-2 w-full">
//               <BasicButton title="Submit" onClick={sendRequestToBackend} />
//             </div>
//           </div>
//         </Setup> </BoxComponent>
//     </>
//   );
// };

// export default Inputfield;


import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const Inputfield = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];

  const [inputDetail, setinputDetail] = useState([]);
  const [enableAssetManagement, setEnableAssetManagement] = useState(false);

  useEffect(() => {
    const fetchInputFieldData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setinputDetail(response.data.inputField.inputDetail);
        
        // Check if asset management is already enabled
        const orgSettingsResponse = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/settings/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setEnableAssetManagement(orgSettingsResponse.data.enableAssetManagement || false);
      } catch (error) {
        console.error("Error fetching input fields:", error);
      }
    };

    fetchInputFieldData();
  }, [authToken, organisationId]);

  const handleInputFieldChange = (field) => {
    const updatedInputField = inputDetail.map((inputField) => {
      if (inputField.label === field.label) {
        // Toggle the isActive property
        return { ...inputField, isActive: !inputField.isActive };
      }
      return inputField;
    });

    setinputDetail(updatedInputField);
  };

  const handleAssetManagementToggle = () => {
    setEnableAssetManagement(!enableAssetManagement);
  };

  const sendRequestToBackend = async () => {
    try {
      const updatedInputDetails = inputDetail.map((field) => ({
        inputDetailId: field._id,
        isActive: field.isActive,
        label: field.label,
      }));

      // Send a PUT request to update the input fields
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/inputfield/update/${organisationId}`,
        { inputDetails: updatedInputDetails },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      
      // Update organization settings for asset management
      await axios.put(
        `${process.env.REACT_APP_API}/route/organization/settings/${organisationId}`,
        { enableAssetManagement },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      
      handleAlert(true, "success", response.data.message);
    } catch (error) {
      // Handle errors
      handleAlert(true, "error", "Failed to apply changes");
    }
  };

  return ( 
    <>
      <BoxComponent sx={{ p: 0 }}>
        <Setup>
          <div className="h-[90vh] overflow-y-auto scroll px-3">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Additional Employee Data"
              info="Select checkbox to know additional information about your employee."
            />
            <div>
              {inputDetail.map((field, _id) => (
                <div
                  key={_id}
                  className="flex justify-between py-1"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.isActive}
                        onChange={() => handleInputFieldChange(field)}
                      />
                    }
                    label={field.label}
                  />
                </div>
              ))}
              
              {/* Asset Management Toggle */}
              <div className="flex justify-between py-1 mt-4 border-t pt-4">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enableAssetManagement}
                      onChange={handleAssetManagementToggle}
                    />
                  }
                  label="Enable Asset Management"
                />
              </div>
              {enableAssetManagement && (
                <div className="ml-6 text-sm text-gray-600">
                  This will add an Asset tab to the Employee module for tracking company assets assigned to employees.
                </div>
              )}
            </div>
            <div className="py-2 w-full">
              <BasicButton title="Submit" onClick={sendRequestToBackend} />
            </div>
          </div>
        </Setup>
      </BoxComponent>
    </>
  );
};

export default Inputfield;

