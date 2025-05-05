import React, { useContext } from 'react';
import { Box, Typography, Button, Chip, Divider } from '@mui/material';
import { format } from 'date-fns';
import { Inventory2 as InventoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AssetReturnModal from '../Modal/AssetReturnModal/AssetReturnModal';
import { TestContext } from '../../State/Function/Main';

const AssetReturnNotification = ({ notification, onAccept, onClose }) => {
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);

  const handleAccept = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (onClose) onClose();
  };

  const handleViewAssets = () => {
    navigate('/asset-management');
    if (onClose) onClose();
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <InventoryIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Asset Return Request
            </Typography>
            <Chip 
              label={notification.status} 
              color={
                notification.status === "Pending" ? "warning" : 
                notification.status === "Approved" ? "success" : 
                "default"
              }
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Return by: {formatDate(notification.returnDate)}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        You need to return {notification.assets.length} asset{notification.assets.length > 1 ? 's' : ''}.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleViewAssets}
        >
          View Assets
        </Button>
        
        {notification.status === "Pending" && (
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={handleAccept}
          >
            Confirm Return
          </Button>
        )}
      </Box>
      
      {/* Asset Return Modal */}
      {openModal && (
        <AssetReturnModal 
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default AssetReturnNotification;
