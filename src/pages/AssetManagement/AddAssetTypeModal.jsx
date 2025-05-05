import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Box
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";

const AddAssetTypeModal = ({ open, handleClose }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [newAssetType, setNewAssetType] = useState("");

  // Fetch asset types
  const { data: assetTypes, isLoading } = useQuery(
    ["assetTypes"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assets/types`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.types;
    }
  );

  // Add asset type mutation
  const addAssetTypeMutation = useMutation(
    (typeName) => 
      axios.post(
        `${process.env.REACT_APP_API}/route/assets/types`,
        { name: typeName },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["assetTypes"]);
        queryClient.invalidateQueries(["assetStats"]);
        setNewAssetType("");
        handleAlert(true, "success", "Asset type added successfully");
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to add asset type");
      },
    }
  );

  // Delete asset type mutation
  const deleteAssetTypeMutation = useMutation(
    (typeId) => 
      axios.delete(`${process.env.REACT_APP_API}/route/assets/types/${typeId}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["assetTypes"]);
        queryClient.invalidateQueries(["assetStats"]);

        handleAlert(true, "success", "Asset type deleted successfully");
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to delete asset type");
      },
    }
  );

  const handleAddAssetType = () => {
    if (!newAssetType.trim()) {
      handleAlert(true, "error", "Asset type name cannot be empty");
      return;
    }
    
    addAssetTypeMutation.mutate(newAssetType.trim());
  };

  const handleDeleteAssetType = (typeId) => {
    if (window.confirm("Are you sure you want to delete this asset type?")) {
      deleteAssetTypeMutation.mutate(typeId);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Asset Types</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <TextField
            label="New Asset Type"
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddAssetType}
                  disabled={addAssetTypeMutation.isLoading}
                  variant="contained"
                  size="small"
                >
                  Add
                </Button>
              ),
            }}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 2 }}>Loading asset types...</Box>
        ) : (
          <List>
            {assetTypes?.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 2 }}>No asset types defined yet</Box>
            ) : (
              assetTypes?.map((type) => (
                <ListItem key={type._id}>
                  <ListItemText 
                    primary={type.name} 
                    secondary={`${type.count || 0} assets`} 
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteAssetType(type._id)}
                      disabled={deleteAssetTypeMutation.isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetTypeModal;
