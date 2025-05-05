/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import AddAssetTypeModal from "./AddAssetTypeModal";

const AssetManagement = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [openAddAssetTypeModal, setOpenAddAssetTypeModal] = useState(false);
  
  // Fetch all assets for the organization
  const { data: assetStats, isLoading, error } = useQuery(
    ["assetStats"],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/assets/stats`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (err) {
        console.error("Error fetching asset stats:", err);
        // handleAlert(true, "error", "Failed to load asset statistics");
        throw err;
      }
    }
  );

  // Fetch recent asset assignments
  const { data: recentAssignments } = useQuery(
    ["recentAssetAssignments"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assets/recent-assignments`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.assignments;
    }
  );

  // Fetch asset types
  const { data: assetTypes } = useQuery(
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

  const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"];

  const handleOpenAddAssetTypeModal = () => {
    setOpenAddAssetTypeModal(true);
  };

  const handleCloseAddAssetTypeModal = () => {
    setOpenAddAssetTypeModal(false);
  };

  if (isLoading) return <Box p={3}>Loading asset statistics...</Box>;
  if (error) return <Box p={3}>Error loading asset statistics: {error.message}</Box>;

  const pieData = [
    { name: "Active", value: assetStats?.active || 0 },
    { name: "Expiring Soon", value: assetStats?.expiringSoon || 0 },
    { name: "Expired", value: assetStats?.expired || 0 },
    { name: "Unassigned", value: assetStats?.unassigned || 0 }
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Asset Overview
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={handleOpenAddAssetTypeModal}
        >
          Manage Asset Types
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Asset Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Assets
              </Typography>
              <Typography variant="h4">
                {assetStats?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Assets
              </Typography>
              <Typography variant="h4" style={{ color: "#4CAF50" }}>
                {assetStats?.active || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expiring Soon
              </Typography>
              <Typography variant="h4" style={{ color: "#FFC107" }}>
                {assetStats?.expiringSoon || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expired Assets
              </Typography>
              <Typography variant="h4" style={{ color: "#F44336" }}>
                {assetStats?.expired || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Types */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Types
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetTypes?.map((type) => (
                      <TableRow key={type.name}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell align="right">{type.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Asset Assignments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Asset Assignments
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Assigned Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAssignments?.length > 0 ? (
                      recentAssignments.map((assignment) => (
                        <TableRow key={assignment._id}>
                          <TableCell>{assignment.assetName}</TableCell>
                          <TableCell>{assignment.assetType}</TableCell>
                          <TableCell>{assignment.employeeName}</TableCell>
                          <TableCell>
                            {new Date(assignment.assignedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={assignment.status} 
                              color={
                                assignment.status === "Active" ? "success" : 
                                assignment.status === "Expiring Soon" ? "warning" : 
                                assignment.status === "Expired" ? "error" : "default"
                              } 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No recent asset assignments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AddAssetTypeModal 
        open={openAddAssetTypeModal} 
        handleClose={handleCloseAddAssetTypeModal} 
      />
    </Box>
  );
};

export default AssetManagement;
