/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useState, useContext } from "react";
// import { Box, Tabs, Tab, Button, Typography } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useQueryClient } from "react-query";
// import AssetList from "./AssetList";
// import AssetManagement from "./AssetManagement";
// import AddAssetModal from "./AddAssetModal";

// const AssetMain = ({ employeeId }) => {
//   const [tabValue, setTabValue] = useState(0);
//   const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleOpenAddAssetModal = () => {
//     setOpenAddAssetModal(true);
//   };

//   const handleCloseAddAssetModal = () => {
//     setOpenAddAssetModal(false);
//     refreshData();
//   };

//   const refreshData = () => {
//     // Invalidate all relevant queries to refresh data
//     queryClient.invalidateQueries("allAssets");
//     if (isEmployeeContext) {
//       queryClient.invalidateQueries(["employeeAssets", employeeId]);
//     }
//     queryClient.invalidateQueries("assetStats");
//     queryClient.invalidateQueries("assetTypes");
//     queryClient.invalidateQueries("recentAssetAssignments");
//   };

//   // Determine if we're in employee context or general context
//   const isEmployeeContext = employeeId && employeeId !== 'undefined';

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box
//         sx={{
//           borderBottom: 1,
//           borderColor: "divider",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           p: 2
//         }}
//       >
//         <Tabs value={tabValue} onChange={handleTabChange}>
//           <Tab label={isEmployeeContext ? "Employee Assets" : "All Assets"} />
//           <Tab label="Asset Management" />
//         </Tabs>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleOpenAddAssetModal}
//           sx={{ marginRight: 2 }}
//         >
//           Add Asset
//         </Button>
//       </Box>

//       {tabValue === 0 && <AssetList employeeId={employeeId} />}
//       {tabValue === 1 && <AssetManagement />}

//       <AddAssetModal
//         open={openAddAssetModal}
//         handleClose={handleCloseAddAssetModal}
//         employeeId={employeeId}
//       />
//     </Box>
//   );
// };

// export default AssetMain;

//MODERN
import React, { useState, useContext } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Paper,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { UseContext } from "../../State/UseState/UseContext";
import { useQueryClient } from "react-query";
import AssetList from "./AssetList";
import AssetManagement from "./AssetManagement";
import AddAssetModal from "./AddAssetModal";

const AssetMain = ({ employeeId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // Default search by name
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
 
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenAddAssetModal = () => {
    setOpenAddAssetModal(true);
  };

  const handleCloseAddAssetModal = () => {
    setOpenAddAssetModal(false);
    refreshData();
  };

  const refreshData = () => {
    // Invalidate all relevant queries to refresh data
    queryClient.invalidateQueries("allAssets");
    if (isEmployeeContext) {
      queryClient.invalidateQueries(["employeeAssets", employeeId]);
    }
    queryClient.invalidateQueries("assetStats");
    queryClient.invalidateQueries("assetTypes");
    queryClient.invalidateQueries("recentAssetAssignments");
  };

  // Handle search input with debounce
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search field change
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  // Determine if we're in employee context or general context
  const isEmployeeContext = employeeId && employeeId !== "undefined";

  

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="" sx={{ mb: 1 }}>
          {isEmployeeContext
            ? "Employee Asset Management"
            : " Asset Management"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEmployeeContext
            ? "View and manage assets assigned to this employee"
            : "Track, manage, and analyze all assets across your organisation"}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ mb: 3, borderRadius: "10px", overflow: "hidden" }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            backgroundColor: "#f8f9fa",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                minWidth: "auto",
                px: 3,
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
            }}
          >
            <Tab label={isEmployeeContext ? "Employee Assets" : "All Assets"} />
            <Tab label="Asset Management" />
          </Tabs>
          <Button
            variant="contained"
            // startIcon={<AddIcon />}
            onClick={handleOpenAddAssetModal}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontWeight: 600,
            }}
          >
            Add Asset
          </Button>
        </Box>
      </Paper>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: "flex", mb: 3, gap: 2 }}>
            <TextField
              placeholder="Search assets..."
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                maxWidth: "500px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              value={searchField}
              onChange={handleSearchFieldChange}
              size="small"
              sx={{
                minWidth: "150px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="name">Asset Name</option>
              <option value="type">Asset Type</option>
              <option value="serialNumber">Serial Number</option>
            </TextField>
          </Box>
          <AssetList
            employeeId={employeeId}
            searchTerm={searchTerm}
            searchField={searchField}
          />
        </>
      )}
      {tabValue === 1 && <AssetManagement />}

      <AddAssetModal
        open={openAddAssetModal}
        handleClose={handleCloseAddAssetModal}
        employeeId={employeeId}
      />
    </Box>
  );
};

export default AssetMain;



