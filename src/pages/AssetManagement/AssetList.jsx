/* eslint-disable no-unused-vars */

import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Card,
  Tooltip
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import AddAssetModal from "./AddAssetModal";

// Custom debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AssetList = ({ employeeId, searchTerm = "", searchField = "name" }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtered assets state
  const [filteredAssets, setFilteredAssets] = useState([]);
  
  // Use our custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Determine if we should fetch all assets or employee-specific assets
  const isAllAssets = !employeeId || employeeId === 'undefined';

  // Fetch assets based on context
  const { data, isLoading, error } = useQuery(
    [isAllAssets ? "allAssets" : "employeeAssets", employeeId],
    async () => {
      const url = isAllAssets 
        ? `${process.env.REACT_APP_API}/route/assets` 
        : `${process.env.REACT_APP_API}/route/assets/employee/${employeeId}`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
      return response.data.assets;
    },
    {
      enabled: isAllAssets || (employeeId && employeeId !== 'undefined'),
      onError: (err) => {
        console.error("Error fetching assets:", err);
        handleAlert(true, "error", "Failed to load assets");
      }
    }
  );

  // Filter assets when search term changes
  useEffect(() => {
    if (!data) return;
    
    if (!debouncedSearchTerm) {
      setFilteredAssets(data);
      return;
    }
    
    
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    const filtered = data.filter(asset => {
      if (searchField === "name") {
        return asset.name.toLowerCase().includes(lowercasedTerm);
      } else if (searchField === "type") {
        return asset.type.toLowerCase().includes(lowercasedTerm);
      } else if (searchField === "serialNumber") {
        return asset.serialNumber.toLowerCase().includes(lowercasedTerm);
      }
      return true;
    });
    
    setFilteredAssets(filtered);
    // Reset to first page when search results change
    setPage(0);
  }, [data, debouncedSearchTerm, searchField]);


  
  // Delete asset mutation
  const deleteAssetMutation = useMutation(
    (assetId) => {
      console.log("Deleting asset with ID:", assetId);
      return axios.delete(`${process.env.REACT_APP_API}/route/assets/${assetId}`, {
        headers: {
          Authorization: authToken,
        },
      });
    },
    {
      onSuccess: () => {
        // Invalidate both queries to ensure data consistency
        queryClient.invalidateQueries("allAssets");
        if (employeeId && employeeId !== 'undefined') {
          queryClient.invalidateQueries(["employeeAssets", employeeId]);
        }
        handleAlert(true, "success", "Asset deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting asset:", error);
        handleAlert(
          true, 
          "error", 
          error.response?.data?.error || error.response?.data?.message || "Failed to delete asset"
        );
      },
    }
  ); 

  const handleDeleteAsset = (assetId) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      deleteAssetMutation.mutate(assetId);
    }
  };

  const handleEditAsset = (asset) => {
    console.log("Editing asset:", asset);
    setSelectedAsset(asset);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedAsset(null);
    // Refresh the data after editing
    queryClient.invalidateQueries(isAllAssets ? "allAssets" : ["employeeAssets", employeeId]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expired":
        return "error";
      case "Expiring Soon":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) return (
    <Box p={3} display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box p={3}>
      <Typography color="error">Error loading assets: {error.message}</Typography>
    </Box>
  );
  
  if (!filteredAssets || filteredAssets.length === 0) return (
    <Card sx={{ p: 3, borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <Typography align="center" color="text.secondary">
        {debouncedSearchTerm 
          ? "No assets match your search criteria." 
          : isAllAssets 
            ? "No assets found in the system." 
            : "No assets assigned to this employee."}
      </Typography>
    </Card>
  );

  // Apply pagination
  const paginatedAssets = filteredAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card sx={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Asset Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Asset Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Serial Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Recertification Required</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Valid Until</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assignment</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.map((asset) => (
              <TableRow 
                key={asset._id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                  } 
                }}
              >
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.serialNumber}</TableCell>
                <TableCell>{asset.recertificationRequired ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {asset.recertificationRequired && asset.recertificationDate
                    ? new Date(asset.recertificationDate).toLocaleDateString()
                    : asset.validityDate 
                      ? new Date(asset.validityDate).toLocaleDateString()
                      : "N/A"}
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={asset.status}
                    color={getStatusColor(asset.status)}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: '6px'
                    }}
                  />
                </TableCell>
                <TableCell>
        <Chip
          label={asset.employeeId ? "Assigned" : "Unassigned"}
          color={asset.employeeId ? "primary" : "default"}
          size="small"
          sx={{ 
            fontWeight: 500,
            borderRadius: '6px'
          }}
        />
                 </TableCell>

                <TableCell>
                  <Tooltip title="Edit Asset">
                    <IconButton 
                      size="small"
                      color="primary"
                      onClick={() => handleEditAsset(asset)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Asset">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAsset(asset._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid rgba(224, 224, 224, 1)',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            margin: 0
          }
        }}
      />

      {/* Edit Asset Modal */}
      {openEditModal && (
        <AddAssetModal
          open={openEditModal}
          handleClose={handleCloseEditModal}
          employeeId={employeeId}
          assetToEdit={selectedAsset}
        />
      )}
    </Card>
  );
};

export default AssetList;
