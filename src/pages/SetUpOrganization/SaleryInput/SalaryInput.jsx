import { Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import SalaryInputFieldsModal from "../../../components/Modal/SalaryInputFields/SalaryInputFieldsModal";
import Setup from "../Setup";
import SkeletonSalaryInput from "./SkeletonSalaryInput";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";




// Add this constant after imports
const FINANCIAL_YEAR_OPTIONS = [
  {
    value: "jan-dec",
    label: "January - December (Calendar Year)",
    countries: "USA, China, Russia, Brazil, Germany, France, South Korea"
  },
  {
    value: "apr-mar",
    label: "April - March",
    countries: "India, UK, Canada, Japan, Australia, New Zealand, Pakistan"
  },
  {
    value: "jul-jun",
    label: "July - June",
    countries: "Australia (Corporate), Egypt, Kenya, Bangladesh, Myanmar"
  },
  {
    value: "oct-sep",
    label: "October - September",
    countries: "US Government, Thailand, Laos"
  },
  {
    value: "mar21-mar20",
    label: "March 21 - March 20",
    countries: "Iran (Persian Calendar)"
  },
  {
    value: "jul16-jul15",
    label: "July 16 - July 15",
    countries: "Nepal"
  }
];

const SalaryInput = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [salaryInputId, setempTypeId] = useState(null);
  // const [selectedTemplate, setSelectedTemplate] = useState(null);
  // Handle PopOver
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const openPop = Boolean(anchorEl) && selectedTemplate !== null;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);


  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");

  const { data: financialYearData } = useQuery(
    ["financialYear", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/organization/${organisationId}/financial-year`,
        // `${process.env.REACT_APP_API}/route/organization/${organisationId}/financial-year`,
        {
          headers: { Authorization: authToken }
        }
      );
      return response.data;
    }
  );
  
  const financialYearMutation = useMutation(
    (yearFormat) => 
      axios.post(
        `${process.env.REACT_APP_API}/organization/${organisationId}/financial-year`,
        // `${process.env.REACT_APP_API}/route/organization/${organisationId}/financial-year`,
        { yearFormat },
        { headers: { Authorization: authToken } }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["financialYear"]);
        handleAlert(true, "success", "Financial year updated successfully");
      }
    }
  );
  

  // const Popid = openPop ? "simple-popover" : undefined;
  const handleOpen = () => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  const handleEditModalOpen = (salaryInputId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", salaryInputId]);
    setempTypeId(salaryInputId);
  };

  // const handlePopClick = (event, template) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedTemplate(template);
  // };

  // const handlePopClose = () => {
  //   setAnchorEl(null);
  // setSelectedTemplate(null);
  // };

  // Delete Query
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  // Delete Query
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/salary-template/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("salaryTemplates");
        handleAlert(true, "success", "Salary Template  deleted succesfully.");
      },
    }
  );

  // Get Query
  const { data: salaryTemplate, isLoading } = useQuery(
    ["salaryTemplates", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  ); 

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
      
<div className="mb-6 bg-white rounded-lg shadow-md p-4">
  <HeadingOneLineInfo
    heading="Financial Year Configuration"
    info="Select the financial year format that aligns with your organisation's accounting period"
    className="mb-4"
  />
  <FormControl fullWidth>
    <InputLabel>Financial Year Format</InputLabel>
    <Select
      value={selectedFinancialYear || financialYearData?.data?.yearFormat || ""}
      onChange={(e) => {
        setSelectedFinancialYear(e.target.value);
        financialYearMutation.mutate(e.target.value);
      }}
      label="Financial Year Format"
    >
      {FINANCIAL_YEAR_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <div className="py-2">
            <div className="font-medium">{option.label}</div>
            <div className="text-sm text-gray-500">
              Common in: {option.countries}
            </div>
          </div>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</div>


        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3" 
              heading="Salary Template"
              info="Create the salary templates which can be added while creating salary to define different salary components"
            />
            <BasicButton title="Add salary template" onClick={handleOpen} />
          </div>
          {isLoading ? (
            <SkeletonSalaryInput />
          ) : salaryTemplate?.salaryTemplates?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Sr. No
                    </th>
                    <th className="whitespace-nowrap !text-left pl-8 py-3">
                      Template Name
                    </th>
                    <th className="whitespace-nowrap !text-left pl-8 py-3">
                      Template Description
                    </th>
                    <th className="whitespace-nowrap !text-left pl-8 py-3">
                      Employment Type
                    </th>
                    {/* <th className="whitespace-nowrap !text-left pl-8 py-3">Salary Structure</th> */}
                    <th className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryTemplate?.salaryTemplates?.map((item, id) => (
                    <tr
                      className={`
                      ${id % 2 === 0} 
                      !font-medium border-b`}
                      key={id}
                    >
                      <td className="whitespace-nowrap !text-left pl-8">
                        {id + 1}
                      </td>
                      <td className="whitespace-nowrap pl-8">{item.name}</td>
                      <td className="whitespace-nowrap pl-8">
                        <h1 className="truncate w-[200px]">
                          {!item?.desc ? "No description" : item.desc}
                        </h1>
                      </td>
                      <td className="whitespace-nowrap pl-8">
                        {item?.empType?.title}
                      </td>
                      {/* <td className="whitespace-nowrap pl-8">
                        <Tooltip title="Click to get Salary structure">
                          <IconButton
                            aria-describedby={Popid}
                            onClick={(event) => handlePopClick(event, item)}
                          >
                            <MoreHoriz className="!text-[19px] text-black" />
                          </IconButton>
                        </Tooltip>
                      </td> */}
                      <td className="whitespace-nowrap pl-8">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleEditModalOpen(item._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(item._id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Salary Template</h1>
              </article>
              <p>No salary template found .Please add a salary template.</p>
            </section>
          )}
        </div>
      </Setup>
     
      <SalaryInputFieldsModal
        id={organisationId}
        open={open}
        handleClose={handleClose}
      />
      <SalaryInputFieldsModal
        id={organisationId}
        open={editModalOpen}
        handleClose={handleClose}
        salaryId={salaryInputId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary template, as this
            action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </BoxComponent>
  );
};

export default SalaryInput;



// import { Info } from "@mui/icons-material";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import BasicButton from "../../../components/BasicButton";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import SalaryInputFieldsModal from "../../../components/Modal/SalaryInputFields/SalaryInputFieldsModal";
// import Setup from "../Setup";
// import SkeletonSalaryInput from "./SkeletonSalaryInput";

// const SalaryInput = () => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();
//   const { handleAlert } = useContext(TestContext);

//   const [open, setOpen] = React.useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [salaryInputId, setempTypeId] = useState(null);
//   // const [selectedTemplate, setSelectedTemplate] = useState(null);
//   // Handle PopOver
//   // const [anchorEl, setAnchorEl] = React.useState(null);
//   // const openPop = Boolean(anchorEl) && selectedTemplate !== null;
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);

//   // const Popid = openPop ? "simple-popover" : undefined;
//   const handleOpen = () => {
//     setOpen(true);
//     setempTypeId(null);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setempTypeId(null);
//     setEditModalOpen(false);
//   };

//   const handleEditModalOpen = (salaryInputId) => {
//     setEditModalOpen(true);
//     queryClient.invalidateQueries(["shift", salaryInputId]);
//     setempTypeId(salaryInputId);
//   };

//   // const handlePopClick = (event, template) => {
//   //   setAnchorEl(event.currentTarget);
//   //   setSelectedTemplate(template);
//   // };

//   // const handlePopClose = () => {
//   //   setAnchorEl(null);
//   // setSelectedTemplate(null);
//   // };

//   // Delete Query
//   const handleDeleteConfirmation = (id) => {
//     setDeleteConfirmation(id);
//   };

//   const handleCloseConfirmation = () => {
//     setDeleteConfirmation(null);
//   };

//   const handleDelete = (id) => {
//     deleteMutation.mutate(id);
//     handleCloseConfirmation();
//   };

//   // Delete Query
//   const deleteMutation = useMutation(
//     (id) =>
//       axios.delete(`${process.env.REACT_APP_API}/route/salary-template/${id}`, {
//         headers: {
//           Authorization: authToken,
//         },
//       }),
//     {
//       onSuccess: () => {
//         // Invalidate and refetch the data after successful deletion
//         queryClient.invalidateQueries("salaryTemplates");
//         handleAlert(true, "success", "Salary Template  deleted succesfully.");
//       },
//     }
//   );

//   // Get Query
//   const { data: salaryTemplate, isLoading } = useQuery(
//     ["salaryTemplates", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     }
//   );

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center ">
//             <HeadingOneLineInfo
//               className="!my-3" 
//               heading="Salary Template"
//               info="Create the salary templates which can be added while creating salary to define different salary components"
//             />
//             <BasicButton title="Add salary template" onClick={handleOpen} />
//           </div>
//           {isLoading ? (
//             <SkeletonSalaryInput />
//           ) : salaryTemplate?.salaryTemplates?.length > 0 ? (
//             <div className=" xs:mt-3 sm:mt-3 md:mt-0">
//               <table className="min-w-full bg-white  text-left !text-sm font-light">
//                 <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
//                   <tr className="!font-semibold">
//                     <th
//                       scope="col"
//                       className="whitespace-nowrap !text-left pl-8 py-3"
//                     >
//                       Sr. No
//                     </th>
//                     <th className="whitespace-nowrap !text-left pl-8 py-3">
//                       Template Name
//                     </th>
//                     <th className="whitespace-nowrap !text-left pl-8 py-3">
//                       Template Description
//                     </th>
//                     <th className="whitespace-nowrap !text-left pl-8 py-3">
//                       Employment Type
//                     </th>
//                     {/* <th className="whitespace-nowrap !text-left pl-8 py-3">Salary Structure</th> */}
//                     <th className="whitespace-nowrap !text-left pl-8 py-3">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {salaryTemplate?.salaryTemplates?.map((item, id) => (
//                     <tr
//                       className={`
//                       ${id % 2 === 0} 
//                       !font-medium border-b`}
//                       key={id}
//                     >
//                       <td className="whitespace-nowrap !text-left pl-8">
//                         {id + 1}
//                       </td>
//                       <td className="whitespace-nowrap pl-8">{item.name}</td>
//                       <td className="whitespace-nowrap pl-8">
//                         <h1 className="truncate w-[200px]">
//                           {!item?.desc ? "No description" : item.desc}
//                         </h1>
//                       </td>
//                       <td className="whitespace-nowrap pl-8">
//                         {item?.empType?.title}
//                       </td>
//                       {/* <td className="whitespace-nowrap pl-8">
//                         <Tooltip title="Click to get Salary structure">
//                           <IconButton
//                             aria-describedby={Popid}
//                             onClick={(event) => handlePopClick(event, item)}
//                           >
//                             <MoreHoriz className="!text-[19px] text-black" />
//                           </IconButton>
//                         </Tooltip>
//                       </td> */}
//                       <td className="whitespace-nowrap pl-8">
//                         <IconButton
//                           color="primary"
//                           aria-label="edit"
//                           onClick={() => handleEditModalOpen(item._id)}
//                         >
//                           <EditOutlinedIcon />
//                         </IconButton>
//                         <IconButton
//                           color="error"
//                           aria-label="delete"
//                           onClick={() => handleDeleteConfirmation(item._id)}
//                         >
//                           <DeleteOutlineIcon />
//                         </IconButton>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//               <article className="flex items-center mb-1 text-red-500 gap-2">
//                 <Info className="!text-2xl" />
//                 <h1 className="text-lg font-semibold">Add Salary Template</h1>
//               </article>
//               <p>No salary template found .Please add a salary template.</p>
//             </section>
//           )}
//         </div>
//       </Setup>
     
//       <SalaryInputFieldsModal
//         id={organisationId}
//         open={open}
//         handleClose={handleClose}
//       />
//       <SalaryInputFieldsModal
//         id={organisationId}
//         open={editModalOpen}
//         handleClose={handleClose}
//         salaryId={salaryInputId}
//       />

//       <Dialog
//         open={deleteConfirmation !== null}
//         onClose={handleCloseConfirmation}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <p>
//             Please confirm your decision to delete this salary template, as this
//             action cannot be undone.
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleCloseConfirmation}
//             variant="outlined"
//             color="primary"
//             size="small"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleDelete(deleteConfirmation)}
//             color="error"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </BoxComponent>
//   );
// };

// export default SalaryInput;
