
// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom"; 
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { PulseLoader } from "react-spinners"; // Importing the loader component

// const MenuList = () => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false); // State to track loading status
//   const { empId } = useParams();
//   const authToken = useAuthToken();
//   const navigate = useNavigate(); 
//  const { orgId } = useParams();
//   const fetchList = useCallback(async () => {
//     setLoading(true); // Start loading
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authToken,
//         },
//       });

//       if (response.data.success) {
//         setList(response.data.data);
//       } else {
//         // toast.error(response.data.error || "Error fetching menu items.");
//       }
//     } catch (error) {
//       // toast.error("Failed to fetch the menu list");
//       console.error(error);
//     } finally {
//       setLoading(false); // Stop loading once the fetch is complete
//     }
//   }, [empId, authToken]);

//   const handleDelete = async (menuItemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (confirmDelete) {
//       try {
//         const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${menuItemId}`, {
//           headers: {
//             Authorization: authToken,
//           },
//         });
//         if (response.data.success) {
//           toast.success("Item deleted successfully");
//           setList((prevList) => prevList.filter(item => item._id !== menuItemId));
//         } else {
//           toast.error(response.data.error || "Error deleting item.");
//         }
//       } catch (error) {
//         toast.error("Failed to delete item");
//         console.error(error);
//       }
//     }
//   };

//   const handleUpdateClick = (item) => {
//     navigate(`/update-menu/${orgId}/${item._id}`, { state: { item } });
//   };

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//   <BoxComponent>
//   <HeadingOneLineInfo heading={"Menu Items"} info={"Exclusive menu items added by you."} />

//   {/* Show loading spinner if the list is being fetched */}
//   {loading ? (
//     <div className="flex justify-center items-center py-8">
//       <PulseLoader color="#3498db" size={15} />
//     </div>
//   ) : (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//       {list.length > 0 ? (
//         list.map((item) => (
//           <div
//             key={item?._id}
//             className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col relative overflow-hidden group"
//           >
//             <div className="relative">
//               <img
//                 src={item?.image}
//                 alt={item?.name}
//                 className="w-full h-40 object-cover rounded-lg mb-4 transition-transform duration-300 transform group-hover:scale-105"
//               />
//               <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-br-lg">
//                 <span className="font-semibold">₹{item?.price?.toFixed(2)}</span>
//               </div>
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
//             <p className="text-gray-600 mb-2">{item?.category}</p>
//             <button
//               onClick={() => handleUpdateClick(item)}
//               className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//             >
//               Update
//             </button>


//             <button
//               onClick={() => handleDelete(item?._id)}
//               className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
//             >
//               Delete
//             </button>
//           </div>
//         ))
//       ) : (
//         <div className="col-span-full flex flex-col items-center justify-center py-8 bg-white rounded-lg">
//           <p className="text-2xl font-semibold text-gray-600">🍽️ No Menu Items Found</p>
//           <p className="text-sm text-gray-400 mt-2">
//             Looks like the menu is empty. Start adding delicious options now!
//           </p>
//         </div>
//       )}
//     </div>
//   )}
// </BoxComponent>

//   );
// };

// export default MenuList;




import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom"; 
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { PulseLoader } from "react-spinners"; // Importing the loader component
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import BasicButton from "../../../components/BasicButton";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const MenuList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [selectedItem, setSelectedItem] = useState(null); // State to store item to be deleted
  const { empId, orgId } = useParams();
  const authToken = useAuthToken();
  const navigate = useNavigate();

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.error || "Error fetching menu items.");
      }
    } catch (error) {
      toast.error("Failed to fetch the menu list");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [empId, authToken]);

  const handleAddMenu = () => {
    navigate(`/vendor/${orgId}/${empId}/add-menu`);
  };


  const handleDeleteClick = (item) => {
    setSelectedItem(item);  // Store item to be deleted
    setOpenDialog(true);     // Open the confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${selectedItem._id}`, {
          headers: {
            Authorization: authToken,
          },
        });
        if (response.data.success) {
          toast.success("Item deleted successfully");
          setList((prevList) => prevList.filter(item => item._id !== selectedItem._id));
          setOpenDialog(false);  // Close the dialog after deletion
        } else {
          toast.error(response.data.error || "Error deleting item.");
        }
      } catch (error) {
        toast.error("Failed to delete item");
        console.error(error);
      }
    }
  };

  const handleUpdateClick = (item) => {
    navigate(`/update-menu/${orgId}/${item._id}`, { state: { item } });
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
     <BoxComponent>
    {/* <HeadingOneLineInfo heading={"Menu Items"} info={"Exclusive menu items added by you."} /> */}
    <div className="flex justify-between items-center mb-4">
      {/* <div>
        <h1 className="text-2xl font-semibold text-gray-700">Menu Items</h1>
        <p className="text-gray-500 text-sm">Exclusive menu items added by you.</p>
      </div> */}
       <HeadingOneLineInfo heading={"Menu Items"} info={"Exclusive menu items added by you."} /> 
      < BasicButton    title="Add Menu" onClick={handleAddMenu} />
    </div>
    
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <PulseLoader color="#3498db" size={15} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item?._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col relative overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-full h-40 object-cover rounded-lg mb-4 transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-br-lg">
                    <span className="font-semibold">₹{item?.price?.toFixed(2)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item?.category}</p>
                <button
                  onClick={() => handleUpdateClick(item)}
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDeleteClick(item)} // Trigger delete confirmation
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 bg-white rounded-lg">
              <p className="text-2xl font-semibold text-gray-600">🍽️ No Menu Items Found</p>
              <p className="text-sm text-gray-400 mt-2">
                Looks like the menu is empty. Start adding delicious options now!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Please confirm your decision to delete this Menu item. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color="primary" size="small">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" size="small">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </BoxComponent>
  );
};

export default MenuList;
