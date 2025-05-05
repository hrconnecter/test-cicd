// import React from "react";
// import { MoreVert, MyLocation } from "@mui/icons-material";
// import { Button, IconButton, Menu, MenuItem } from "@mui/material";
// import FullskapeViewDelete from "./FullskapeViewDelete";
// import useFullskapeMutation from "./useFullskapeCard";
// import useGetStudents from "./hooks/useGetStudents";
// import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
// import useGetRevGeo from "../Geo-Fence/useGetRevGeo";
// import ReusableModal from "../../components/Modal/component";
// import AddFullskapeZone from "./AddFullskapeZone";

// const FullskapeCard = ({ item }) => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [openManage, setOpenManage] = React.useState(false);
//   const [view, setView] = React.useState(false);
//   const [zoneId, setZoneId] = React.useState(false);
//   const { students } = useGetStudents(zoneId);

//   const studentCount = students?.length || 0;

//   const { data: locationData } = useGetCurrentLocation();

//   const { data } = useGetRevGeo({
//     lat: item?.center?.lat,
//     lng: item?.center?.lng,
//   });

//   const { deleteFullskapeMutate } = useFullskapeMutation();

//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div className="mb-4 w-full h-full">
//       <div className="bg-white w-max h-max rounded-lg shadow-lg p-4 flex items-center justify-between gap-14">
//         <div className="flex items-center gap-2">
//           <MyLocation className="text-blue-500" />
//           <abbr title={data ? data[0]?.formatted_address : "Loading..."}>
//             <h4 className="text-base font-medium text-gray-700 truncate w-40">
//               {data ? data[0]?.formatted_address : "Loading..."}
//             </h4>
//           </abbr>
//         </div>
//         <div className="flex items-center gap-14">
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold">Student count:</span> {studentCount}
//           </p>
//           <Button
//             onClick={() => setOpenManage(!openManage)}
//             variant="contained"
//             size="small"
//             className="bg-blue-600 text-white hover:bg-blue-700"
//           >
//             {openManage ? "Close" : "Manage Students"}
//           </Button>
//           <IconButton onClick={handleClick}>
//             <MoreVert />
//           </IconButton>
//           <Menu
//             id="basic-menu"
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             MenuListProps={{
//               "aria-labelledby": "basic-button",
//             }}
//           >
//             <MenuItem
//               onClick={() => {
//                 setZoneId(item?._id);
//                 setView(true);
//                 handleClose();
//               }}
//             >
//               View
//             </MenuItem>
//             <MenuItem
//               onClick={() => {
//                 deleteFullskapeMutate({ zoneId: item?._id });
//                 handleClose();
//               }}
//             >
//               Delete
//             </MenuItem>
//           </Menu>
//         </div>
//       </div>

//       {openManage && (
//         <div className="mt-4">
//           <FullskapeViewDelete
//             zoneId={item?._id}
//             onClose={() => setOpenManage(false)}
//           />
//         </div>
//       )}

//       {/* Add ReusableModal for viewing Fullskape zone */}
//       <ReusableModal
//         open={view}
//         heading={"View Fullskape Zone"}
//         subHeading={"You can view details of this Fullskape zone"}
//         onClose={() => setView(false)}
//         modalWidth="lg"
//       >
//         <AddFullskapeZone
//           onClose={() => setView(false)}
//           data={locationData}
//           zoneId={zoneId}
//         />
//       </ReusableModal>
//     </div>
//   );
// };

// export default FullskapeCard;

import React, { useEffect, useState } from "react";
import { MoreVert, MyLocation } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import FullskapeViewDelete from "./FullskapeViewDelete";
import useFullskapeMutation from "./useFullskapeCard";
import useGetStudents from "./hooks/useGetStudents";
import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
import useGetRevGeo from "../Geo-Fence/useGetRevGeo";
import ReusableModal from "../../components/Modal/component";
import AddFullskapeZone from "./AddFullskapeZone";

const FullskapeCard = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openManage, setOpenManage] = useState(false);
  const [view, setView] = useState(false);
  const [zoneId, setZoneId] = useState(item?._id || null); // Initialize with item's zoneId

  const { students } = useGetStudents(zoneId);

  const studentCount = students?.length || 0;

  const { data: locationData } = useGetCurrentLocation();

  const { data } = useGetRevGeo({
    lat: item?.center?.lat,
    lng: item?.center?.lng,
  });

  const { deleteFullskapeMutate } = useFullskapeMutation();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Ensure zoneId is set when the component initializes
  useEffect(() => {
    if (!zoneId && item?._id) {
      setZoneId(item._id);
    }
  }, [item?._id, zoneId]);

  return (
    <div className="mb-4 w-full h-full">
      <div className="bg-white w-max h-max rounded-lg shadow-lg p-4 flex items-center justify-between gap-14">
        <div className="flex items-center gap-2">
          <MyLocation className="text-blue-500" />
          <abbr title={data ? data[0]?.formatted_address : "Loading..."}>
            <h4 className="text-base font-medium text-gray-700 truncate w-40">
              {data ? data[0]?.formatted_address : "Loading..."}
            </h4>
          </abbr>
        </div>
        <div className="flex items-center gap-14">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Student count:</span> {studentCount}
          </p>
          <Button
            onClick={() => setOpenManage(!openManage)}
            variant="contained"
            size="small"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {openManage ? "Close" : "Manage Students"}
          </Button>
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setZoneId(item?._id);
                setView(true);
                handleClose();
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                deleteFullskapeMutate({ zoneId: item?._id });
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>

      {openManage && (
        <div className="mt-4">
          <FullskapeViewDelete
            zoneId={item?._id}
            onClose={() => setOpenManage(false)}
          />
        </div>
      )}

      <ReusableModal
        open={view}
        heading={"View Fullskape Zone"}
        subHeading={"You can view details of this Fullskape zone"}
        onClose={() => setView(false)}
        modalWidth="lg"
      >
        <AddFullskapeZone
          onClose={() => setView(false)}
          data={locationData}
          zoneId={zoneId}
        />
      </ReusableModal>
    </div>
  );
};

export default FullskapeCard;
