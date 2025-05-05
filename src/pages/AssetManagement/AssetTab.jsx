/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { UseContext } from "../../../State/UseState/UseContext";
import AssetList from "./AssetList";
import AssetManagement from "./AssetManagement";
import AddAssetModal from "./AddAssetModal";

const AssetTab = ({ employeeId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOpenAddAssetModal = () => {
    setOpenAddAssetModal(true);
  };
  const handleCloseAddAssetModal = () => {
    setOpenAddAssetModal(false);
  };
  return (
    <Box sx={{ width: "100%" }}>
      {" "}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <Tabs value={tabValue} onChange={handleTabChange}>
          {" "}
          <Tab label="Assets" /> <Tab label="Asset Management" />{" "}
        </Tabs>{" "}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddAssetModal}
          sx={{ marginRight: 2 }}
        >
          {" "}
          Add Asset{" "}
        </Button>{" "}
      </Box>{" "}
      {tabValue === 0 && <AssetList employeeId={employeeId} />}{" "}
      {tabValue === 1 && <AssetManagement />}{" "}
      <AddAssetModal
        open={openAddAssetModal}
        handleClose={handleCloseAddAssetModal}
        employeeId={employeeId}
      />{" "}
    </Box>
  );
};
export default AssetTab;
