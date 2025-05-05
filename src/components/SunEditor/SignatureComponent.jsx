import React, { useRef } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import SignaturePad from 'react-signature-canvas';
import { getSignedUrlForOrgDocs, uploadFile } from '../../services/docManageS3';

const SignatureComponent = ({ 
  open, 
  onClose, 
  authToken, 
  editor, 
  setAppAlert, 
  setLoading 
}) => {
  const signaturePadRef = useRef(null);

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const saveSignature = async () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      try {
        setLoading(true);
        
        // Get signature as data URL
        const signatureDataUrl = signaturePadRef.current.toDataURL('image/png');
        
        // Convert data URL to blob
        const blob = await fetch(signatureDataUrl).then(res => res.blob());
        
        // Get signed URL for signature upload
        const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
          documentName: `signature_${Date.now()}.png`,
        });
        
        // Upload the signature
        await uploadFile(signedUrlResponse.url, blob);
        
        // Get the clean URL (without query parameters)
        const signatureUrl = signedUrlResponse.url.split("?")[0];
        
        // Insert the signature into the editor
        if (editor) {
          const imgTag = `<div class="signature-container" style="margin: 10px 0; display: inline-block;">
            <img src="${signatureUrl}" alt="Digital Signature" style="max-width: 200px; height: auto;"/>
            <div style="border-top: 1px solid #000; margin-top: 5px; font-style: italic; color: #666; font-size: 12px;">Digital Signature</div>
          </div>`;
          
          editor.insertHTML(imgTag);
        }
        
        // Close the dialog
        onClose();
        setLoading(false);
        
        // Show success message
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Signature added successfully",
        });
      } catch (error) {
        console.error("Error saving signature:", error);
        setLoading(false);
        
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error adding signature: " + error.message,
        });
      }
    } else {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Please draw a signature first",
      });
    }
  };

  // Handle signature file upload
  const handleSignatureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      // Get signed URL for signature upload
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `signature_${Date.now()}_${file.name}`,
      });
      
      // Upload the signature
      await uploadFile(signedUrlResponse.url, file);
      
      // Get the clean URL (without query parameters)
      const signatureUrl = signedUrlResponse.url.split("?")[0];
      
      // Insert the signature into the editor
      if (editor) {
        const imgTag = `<div class="signature-container" style="margin: 10px 0; display: inline-block;">
          <img src="${signatureUrl}" alt="Digital Signature" style="max-width: 200px; height: auto;"/>
          <div style="border-top: 1px solid #000; margin-top: 5px; font-style: italic; color: #666; font-size: 12px;">Digital Signature</div>
        </div>`;
        
        editor.insertHTML(imgTag);
      }
      
      // Close the dialog
      onClose();
      setLoading(false);
      
      // Show success message
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Signature added successfully",
      });
    } catch (error) {
      console.error("Error uploading signature:", error);
      setLoading(false);
      
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error adding signature: " + error.message,
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Digital Signature</DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <Typography variant="subtitle2" className="mb-2">
            Draw your signature below:
          </Typography>
          <div className="border border-gray-300 rounded-md" style={{ touchAction: 'none' }}>
            <SignaturePad
              ref={signaturePadRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas w-full border border-gray-300 rounded-md"
              }}
              backgroundColor="rgb(255, 255, 255)"
            />
          </div>
          <div className="flex justify-between mt-2">
            <Button 
              variant="outlined" 
              size="small" 
              onClick={clearSignature}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={saveSignature}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Signature
            </Button>
          </div>
        </div>
        
        <Typography variant="subtitle2" className="mt-4 mb-2">
          Or upload a signature image:
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignatureComponent;
