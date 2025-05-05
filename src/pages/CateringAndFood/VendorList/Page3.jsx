

import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
// import UploadDocumentModal from "../../DocumentManagement/components/UploadDocumentModal";

// import useOrgGeo from "../../Geo-Fence/useOrgGeo";

import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
import ReusableModal from "../../../components/Modal/component";

import Uploaddocument from "../VendorSignUp/Uploaddocument";
import Addlocation from "../VendorSignUp/Addlocation";
//  import useOrgGeo from "../../Geo-Fence/useOrgGeo";

// import { useState } from "react";

const Page3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // define state, hook and other if needed
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data, document } = useVendorState();
  const VendorSchema = z.object({}).catchall(z.any().optional());
  // State for validation
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [isLocationAdded, setIsLocationAdded] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");


  console.log("document789", document);

  // define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(VendorSchema),
  });

  const { createModalOpen, setCreateModalOpen } = useVendorState();

  // for upload the document
  //  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const [open, setOpen] = useState(false);
  // const { data1 } = useOrgGeo();
  const { data: locationData } = useGetCurrentLocation();

  // to define the onSubmit function
  const onSubmit = (testData) => {
    if (!isDocumentUploaded || !isLocationAdded) {
      setWarningMessage("Please upload a document and add a location before proceeding.");
      return;
    }
    console.log("Test 3", testData);
    setStep3Data(testData);
    nextStep();
  };

  const { errors } = formState;
  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 flex-col"
      >
        {/* <div className="grid grid-cols-2 w-full gap-3"> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>
              {input.isActive && (
                <AuthInputFiled
                  name={input.label}
                  placeholder={input.label}
                  label={input.placeholder}
                  icon={ContactMail}
                  control={control}
                  type={input.inputType}
                  errors={errors}
                  error={errors.label}
                  className="text-sm"
                />
              )}
            </>
          ))}
        </div>


        <div className="flex flex-col items-center w-full space-y-4">
          <div className="w-full flex justify-center">
            <Button
              className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64" // Set a fixed width
              variant="contained"
              onClick={() => {
                handleCreateModalOpen();
                setIsDocumentUploaded(true); // Simulate document upload
              }}
            >
              <Add /> 
              Upload Document * 
            </Button>
          </div>

          <div className="w-full flex justify-center">
            <Button
              className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64" // Set the same fixed width
              variant="contained"
              size="medium"
              onClick={() => {
                setOpen(true);
                setIsLocationAdded(true); // Simulate location addition

              }}
            >
              <Add />
              Add Location *
            </Button>
          </div>
        </div>

        {warningMessage && (
          <p className="text-red-500 text-center mt-4">{warningMessage}</p>
        )}



        <ReusableModal
          open={open}
          heading={"Add Vendor Location"}
          subHeading={"You can add vendor location using Map "}
          onClose={() => setOpen(false)}
        >
          <Addlocation onClose={() => setOpen(false)} data={locationData} />
        </ReusableModal>

        {/* for create */}
        <Uploaddocument
          handleClose={handleCreateModalClose}
          open={createModalOpen}
        />

        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep||!isDocumentUploaded || !isLocationAdded}
            className={`!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white ${
              isDocumentUploaded && isLocationAdded
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page3;






// import { zodResolver } from "@hookform/resolvers/zod";
// import { ContactMail } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material";
// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// // import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
// import { Button } from "@mui/material";
// import { Add } from "@mui/icons-material";
// import ReusableModal from "../../../components/Modal/component";

// import Addlocation from "../VendorSignUp/Addlocation";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import Uploaddocument from "../VendorSignUp/Uploaddocument";
 
// const Page3 = ({ isLastStep, nextStep, prevStep }) => {
//   // const organisationId = useParams("");
//   const { employeeId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { setStep3Data, data, document, setDocument } = useVendorState();
//   const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
//   const [isLocationAdded, setIsLocationAdded] = useState(false);
//   const [warningMessage, setWarningMessage] = useState("");

//   const VendorSchema = z.object({}).catchall(z.any().optional());
//   const { control, formState, handleSubmit, setValue } = useForm({
//     defaultValues: {
//       ...data,
//     },
//     resolver: zodResolver(VendorSchema),
//   });

//   // Fetch previously uploaded documents
//   const { isLoading } = useQuery(
//     ["employeeId", employeeId],
//     async () => {
//       if (employeeId !== null && employeeId !== undefined) {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
  
//         return response.data;
//       }
//     },
  
//     {
//       onSuccess: (data) => {
//         if (data && data.documents) {
//           setDocument(data.documents); // Store fetched documents in the state
//           setIsDocumentUploaded(true); // Set as uploaded if documents exist
//         }
//       },
//     }
//   );

//   const handleCreateModalOpen = () => setIsDocumentUploaded(true);

//   const onSubmit = (testData) => {
//     if (!isDocumentUploaded || !isLocationAdded) {
//       setWarningMessage("Please upload a document and add a location before proceeding.");
//       return;
//     }
//     console.log("Page 3 Data:", testData);
//     setStep3Data(testData);
//     nextStep();
//   };

//   const { errors } = formState;

//   if (loadingDocuments) {
//     return (
//       <div className="flex h-[40vh] items-center justify-center">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full mt-4">
//       <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-col space-y-4"
//       >
//         {/* Dynamically rendered fields */}
//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           {uploadedDocuments?.fields?.map((input, index) => (
//             <AuthInputFiled
//               key={index}
//               name={input.label}
//               placeholder={input.label}
//               label={input.placeholder}
//               icon={ContactMail}
//               control={control}
//               type={input.inputType}
//               errors={errors}
//               error={errors[input.label]}
//               className="text-sm"
//             />
//           ))}
//         </div>

//         <div className="flex flex-col items-center w-full space-y-4">
//           <div className="w-full flex justify-center">
//             <Button
//               className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64"
//               variant="contained"
//               onClick={() => {
//                 handleCreateModalOpen();
//                 setIsDocumentUploaded(true);
//               }}
//             >
//               <Add />
//               Upload Document *
//             </Button>
//           </div>

//           <div className="w-full flex justify-center">
//             <Button
//               className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64"
//               variant="contained"
//               size="medium"
//               onClick={() => setIsLocationAdded(true)}
//             >
//               <Add />
//               Add Location *
//             </Button>
//           </div>
//         </div>

//         {warningMessage && (
//           <p className="text-red-500 text-center mt-4">{warningMessage}</p>
//         )}

//         {/* Reusable Modals */}
//         <ReusableModal
//           open={isLocationAdded}
//           heading={"Add Vendor Location"}
//           subHeading={"You can add vendor location using Map"}
//           onClose={() => setIsLocationAdded(false)}
//         >
//           <Addlocation data={uploadedDocuments?.locationData} />
//         </ReusableModal>

//         <Uploaddocument
//           open={isDocumentUploaded}
//           handleClose={() => setIsDocumentUploaded(false)}
//         />

//         <div className="flex items-end justify-between w-full">
//           <button
//             type="button"
//             onClick={prevStep}
//             className="px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
//           >
//             Prev
//           </button>
//           <button
//             type="submit"
//             disabled={!isDocumentUploaded || !isLocationAdded}
//             className={`px-6 py-1 text-md font-semibold text-white rounded-md ${
//               isDocumentUploaded && isLocationAdded
//                 ? "bg-blue-500 hover:bg-blue-600"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page3;
