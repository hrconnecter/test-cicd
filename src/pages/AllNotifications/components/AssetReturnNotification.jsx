/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";
import { useParams } from "react-router-dom";

const AssetReturnNotification = () => {
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  // Fetch asset return notifications
  const { data, isLoading, error } = useQuery(
    ["assetReturnNotificationsForEmployee"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/employee/notifications`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      enabled: !!authToken,
      refetchInterval: 30000,
    }
  );

  // Confirm asset return mutation
  const confirmMutation = useMutation(
    async ({ notificationId, returnDate }) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/employee/confirm/${notificationId}`,
        { returnDate, acknowledged },
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Asset return confirmed successfully");
        setSelectedNotification(null);
        setAcknowledged(false);
        queryClient.invalidateQueries("assetReturnNotificationsForEmployee");
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Failed to confirm asset return"
        );
      },
    }
  );

  const handleConfirm = () => {
    if (selectedNotification && acknowledged) {
      confirmMutation.mutate({
        notificationId: selectedNotification._id,
        returnDate: selectedNotification.returnDate,
      });
    } else {
      handleAlert(true, "error", "Please acknowledge the asset return");
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading asset return notifications: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!data?.notifications || data.notifications.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No asset return notifications found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Asset Return Notifications
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assets</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.notifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell>{notification.assets.length} asset(s)</TableCell>
                <TableCell>{formatDate(notification.returnDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={notification.status}
                    color={
                      notification.status === "Pending"
                        ? "warning"
                        : notification.status === "Approved"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setSelectedNotification(notification)}
                  >
                    View Details
                  </Button>
                  {!notification.employeeRead && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setSelectedNotification(notification)}
                      sx={{ ml: 1 }}
                    >
                      Confirm
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Asset Details Dialog */}
      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        <DialogTitle>Asset Return Details</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Return Date: {formatDate(selectedNotification.returnDate)}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Status:
                <Chip
                  label={selectedNotification.status}
                  color={
                    selectedNotification.status === "Pending"
                      ? "warning"
                      : selectedNotification.status === "Approved"
                      ? "success"
                      : "default"
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">Assets to Return:</Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Serial Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedNotification.assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {!selectedNotification.employeeRead && (
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                      />
                    }
                    label="I acknowledge that I need to return these assets by the specified date"
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNotification(null)}>Close</Button>
          {selectedNotification && !selectedNotification.employeeRead && (
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              disabled={!acknowledged || confirmMutation.isLoading}
            >
              {confirmMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Confirm"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetReturnNotification;
