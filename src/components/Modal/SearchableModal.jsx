import { Box, Modal } from "@mui/material";
import React from "react";

const SearchableModal = ({ className, open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box
        className={`border-none gap-2 shadow-md outline-none h-auto max-h-[600px] overflow-auto rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-[550px] md:w-[400px] sm:w-fit w-[95%] z-10  bg-white flex flex-col ${className}`}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default SearchableModal;
