/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { UseContext } from '../../State/UseState/UseContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import AssetReturnNotification from './AssetReturnNotification';
import AssetReturnModal from '../Modal/AssetReturnModal/AssetReturnModal';
import AssetReturnApprovalModal from '../Modal/AssetReturnModal/AssetReturnApprovalModal';

const NotificationComponent = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openAssetReturnModal, setOpenAssetReturnModal] = useState(false);
  const [openAssetApprovalModal, setOpenAssetApprovalModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [role, setRole] = useState('');
  
  // Get user role
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/profile`,
          {
            headers: { Authorization: authToken }
          }
        );
        setRole(response.data.employee.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    
    if (authToken) {
      getUserRole();
    }
  }, [authToken]);
  
  // Fetch asset return notifications count
  const { data: assetReturnData } = useQuery(
    ["assetReturnNotificationCount"],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/notification/asset-return/count`,
          {
            headers: { Authorization: authToken }
          }
        );
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { count: 0 };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken,
      refetchInterval: 60000,
      refetchOnWindowFocus: true
    }
  );
  
  // Fetch all notifications
  const { data: allNotifications } = useQuery(
    ["allNotifications"],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/notification/all`,
          {
            headers: { Authorization: authToken }
          }
        );
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { notifications: [] };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken,
      refetchInterval: 60000,
      refetchOnWindowFocus: true
    }
  );
  
  // Update notification count
  useEffect(() => {
    let count = 0;
    
    // Add asset return notification count
    if (assetReturnData && assetReturnData.count) {
      count += assetReturnData.count;
    }
    
    // Add other notification counts here
    
    setNotificationCount(count);
  }, [assetReturnData]);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    
    // Handle different notification types
    if (notification.type === 'asset-return') {
      if (role === 'Employee') {
        setOpenAssetReturnModal(true);
      } else {
        setOpenAssetApprovalModal(true);
      }
    }
    
    handleClose();
  };
  
  const handleCloseNotificationDialog = () => {
    setSelectedNotification(null);
  };
  
  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {notificationCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {notificationCount} unread
            </Typography>
          )}
        </Box>
        
        <Divider />
        
        {notificationCount === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {/* Asset Return Notifications */}
            {assetReturnData && assetReturnData.count > 0 && (
              <ListItem 
                button 
                onClick={() => handleNotificationClick({ type: 'asset-return' })}
                sx={{ 
                  backgroundColor: '#f0f7ff',
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <InventoryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Asset Return Request"
                  secondary={
                    role === 'Employee'
                      ? "You have assets to return"
                      : "Assets pending approval"
                  }
                />
                <Badge badgeContent={assetReturnData.count} color="error" />
              </ListItem>
            )}
            
            {/* Add other notification types here */}
            
            <Divider />
            
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Button size="small" onClick={handleClose}>
                View All
              </Button>
            </Box>
          </List>
        )}
      </Menu>
      
      {/* Asset Return Modal for Employees */}
      <Dialog 
        open={openAssetReturnModal} 
        onClose={() => setOpenAssetReturnModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Asset Return Request
          <IconButton
            aria-label="close"
            onClick={() => setOpenAssetReturnModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AssetReturnModal />
        </DialogContent>
      </Dialog>
      
      {/* Asset Return Approval Modal for Managers */}
      <Dialog 
        open={openAssetApprovalModal} 
        onClose={() => setOpenAssetApprovalModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Asset Return Approvals
          <IconButton
            aria-label="close"
            onClick={() => setOpenAssetApprovalModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AssetReturnApprovalModal onClose={() => setOpenAssetApprovalModal(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Individual Notification Dialog */}
      {selectedNotification && selectedNotification.type === 'asset-return-individual' && (
        <Dialog 
          open={!!selectedNotification} 
          onClose={handleCloseNotificationDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Notification
            <IconButton
              aria-label="close"
              onClick={handleCloseNotificationDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AssetReturnNotification 
              notification={selectedNotification} 
              onClose={handleCloseNotificationDialog} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default NotificationComponent;
