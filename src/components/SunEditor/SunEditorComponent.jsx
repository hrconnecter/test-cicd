import React, { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';
import { Button } from '@mui/material';
import { getSignedUrlForOrgDocs, uploadFile } from '../../services/docManageS3';

// Import our custom components
import SignatureComponent from './SignatureComponent';
import WatermarkComponent from './WatermarkComponent';

const SunEditorComponent = ({
  initialContent = '',
  onChange,
  authToken,
  setAppAlert,
  height = '400px',
  placeholder = 'Enter content here...',
}) => {
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [watermarkDialogOpen, setWatermarkDialogOpen] = useState(false);

  // SunEditor configuration
  const getSunEditorOptions = () => ({
    plugins: plugins,
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['fontColor', 'hiliteColor'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'image', 'link'],
      ['fullScreen', 'showBlocks'],
    ],
    height: height,
    width: '100%',
    minHeight: '300px',
    maxHeight: '600px',
    imageUploadSizeLimit: 5242880, // 5MB
    imageAccept: '.jpg, .jpeg, .png, .gif',
    
    // Enhanced image handling
    imageFileInput: true,
    imageUrlInput: true,
    imageResizing: true,
    imageWidth: '100%',
    imageSizeOnlyPercentage: false,
    
    // Table settings
    table: {
      maxWidth: '100%',
      defaultWidth: '100%',
      defaultHeight: 100,
      defaultAttributes: {
        width: '100%',
        border: '1px solid #ddd',
        borderCollapse: 'collapse'
      },
      defaultCellAttributes: {
        style: 'border: 1px solid #ddd; padding: 8px;'
      }
    },
    
    // Improved editor performance
    historyStackDelayTime: 400,
    charCounter: true,
    charCounterType: 'char',
    charCounterLabel: 'Characters: ',
  });

  // Handle editor initialization
  const handleEditorInitialized = (sunEditor) => {
    setEditor(sunEditor);
    console.log("SunEditor initialized successfully");
  };

  // Handle image upload for SunEditor
  const handleImageUploadBefore = async (files, info, uploadHandler) => {
    try {
      if (!files || files.length === 0) {
        console.error("No files to upload");
        return false;
      }
      
      setLoading(true); // Show loading indicator during upload
      
      // Get signed URL for image upload
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `image_${Date.now()}_${files[0].name}`, // Ensure unique name
      });

      if (!signedUrlResponse || !signedUrlResponse.url) {
        console.error("Failed to get signed URL for upload");
        setLoading(false);
        return false;
      }

      // Upload the image
      const uploadResult = await uploadFile(signedUrlResponse.url, files[0]);
      
      if (!uploadResult) {
        console.error("Failed to upload image");
        setLoading(false);
        return false;
      }

      // Get the clean URL (without query parameters)
      const imageUrl = signedUrlResponse.url.split("?")[0];
      
      console.log("Image uploaded successfully:", imageUrl);

      // Tell SunEditor the upload is complete and provide the URL
      const response = {
        result: [
          {
            url: imageUrl,
            name: files[0].name,
            size: files[0].size
          }
        ]
      };

      setLoading(false);
      uploadHandler(response);
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      
      // Show error alert
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error uploading image: " + error.message,
      });
      
      return false;
    }
  };

  return (
    <div className="sun-editor-container">
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Custom toolbar buttons for signature and watermark */}
      <div className="flex space-x-2 mb-2">
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setSignatureDialogOpen(true)}
          className="text-xs"
        >
          ✍️ Add Signature
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setWatermarkDialogOpen(true)}
          className="text-xs"
        >
          🔒 Add Watermark
        </Button>
      </div>
      
      {/* SunEditor Component */}
      <SunEditor
        setContents={initialContent}
        onChange={onChange}
        setOptions={getSunEditorOptions()}
        onImageUploadBefore={handleImageUploadBefore}
        getSunEditorInstance={handleEditorInitialized}
        setDefaultStyle="font-family: Arial; font-size: 14px;"
        placeholder={placeholder}
      />
      
      {/* Signature Dialog */}
      <SignatureComponent
        open={signatureDialogOpen}
        onClose={() => setSignatureDialogOpen(false)}
        authToken={authToken}
        editor={editor}
        setAppAlert={setAppAlert}
        setLoading={setLoading}
      />
      
      {/* Watermark Dialog */}
      <WatermarkComponent
        open={watermarkDialogOpen}
        onClose={() => setWatermarkDialogOpen(false)}
        authToken={authToken}
        editor={editor}
        setAppAlert={setAppAlert}
        setLoading={setLoading}
      />
    </div>
  );
};

export default SunEditorComponent;
