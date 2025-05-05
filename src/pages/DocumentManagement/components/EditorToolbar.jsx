// import React, { useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

// const EditorToolbar = ({ id, onImageUpload, onSignatureAdd, onWatermarkAdd }) => {
//   const [imageDialog, setImageDialog] = useState(false);
//   const [signatureDialog, setSignatureDialog] = useState(false);
//   const [watermarkDialog, setWatermarkDialog] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [watermarkText, setWatermarkText] = useState('');
//   const [signatureCanvas, setSignatureCanvas] = useState(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//     }
//   };

//   const insertImage = () => {
//     if (imageFile) {
//       onImageUpload(imageFile);
//       setImageDialog(false);
//       setImageFile(null);
//     }
//   };

//   const insertWatermark = () => {
//     if (watermarkText) {
//       onWatermarkAdd(watermarkText);
//       setWatermarkDialog(false);
//       setWatermarkText('');
//     }
//   };

//   const insertSignature = () => {
//     if (signatureCanvas) {
//       const signatureData = signatureCanvas.toDataURL();
//       onSignatureAdd(signatureData);
//       setSignatureDialog(false);
//     }
//   };

//   return (
//     <div id={id}>
//       {/* Image Dialog */}
//       <Dialog open={imageDialog} onClose={() => setImageDialog(false)}>
//         <DialogTitle>Insert Image</DialogTitle>
//         <DialogContent>
//           <input type="file" accept="image/*" onChange={handleImageUpload} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setImageDialog(false)}>Cancel</Button>
//           <Button onClick={insertImage} disabled={!imageFile}>Insert</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Signature Dialog */}
//       <Dialog open={signatureDialog} onClose={() => setSignatureDialog(false)}>
//         <DialogTitle>Add Digital Signature</DialogTitle>
//         <DialogContent>
//           <div className="signature-canvas-container" style={{ border: '1px solid #ccc', height: '200px' }}>
//             {/* We'll use a canvas for signature */}
//             <canvas 
//               ref={(canvas) => {
//                 if (canvas) {
//                   const ctx = canvas.getContext('2d');
//                   ctx.fillStyle = 'white';
//                   ctx.fillRect(0, 0, canvas.width, canvas.height);
//                   setSignatureCanvas(canvas);
                  
//                   // Simple drawing implementation
//                   let drawing = false;
//                   canvas.onmousedown = (e) => {
//                     drawing = true;
//                     ctx.beginPath();
//                     ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
//                   };
//                   canvas.onmousemove = (e) => {
//                     if (drawing) {
//                       ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
//                       ctx.stroke();
//                     }
//                   };
//                   canvas.onmouseup = () => {
//                     drawing = false;
//                   };
//                 }
//               }}
//               width={400}
//               height={200}
//             />
//           </div>
//           <Button onClick={() => {
//             const canvas = signatureCanvas;
//             const ctx = canvas.getContext('2d');
//             ctx.fillStyle = 'white';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//           }}>Clear</Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSignatureDialog(false)}>Cancel</Button>
//           <Button onClick={insertSignature}>Add Signature</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Watermark Dialog */}
//       <Dialog open={watermarkDialog} onClose={() => setWatermarkDialog(false)}>
//         <DialogTitle>Add Watermark</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Watermark Text"
//             fullWidth
//             value={watermarkText}
//             onChange={(e) => setWatermarkText(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setWatermarkDialog(false)}>Cancel</Button>
//           <Button onClick={insertWatermark}>Add Watermark</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EditorToolbar;
// import React, { useEffect, useRef, useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tabs, Tab, Box } from '@mui/material';
// import SignatureCanvas from 'react-signature-canvas';

// const EditorToolbar = ({ id, onImageUpload, onSignatureAdd, onWatermarkAdd, onTableAdd }) => {
//   const [imageDialog, setImageDialog] = useState(false);
//   const [signatureDialog, setSignatureDialog] = useState(false);
//   const [watermarkDialog, setWatermarkDialog] = useState(false);
//   const [tableDialog, setTableDialog] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [watermarkText, setWatermarkText] = useState('');
//   const [watermarkType, setWatermarkType] = useState('text');
//   const [watermarkImage, setWatermarkImage] = useState(null);
//   const [rows, setRows] = useState(2);
//   const [columns, setColumns] = useState(2);
//   const [signatureTab, setSignatureTab] = useState(0);
//   const signatureRef = useRef(null);
//   const [savedSignatures, setSavedSignatures] = useState([]);

//   useEffect(() => {
//     // Add event listeners for custom toolbar buttons
//     const toolbar = document.getElementById(id);
//     if (toolbar) {
//       toolbar.addEventListener('open-image-dialog', () => setImageDialog(true));
//       toolbar.addEventListener('open-signature-dialog', () => setSignatureDialog(true));
//       toolbar.addEventListener('open-watermark-dialog', () => setWatermarkDialog(true));
//       toolbar.addEventListener('open-table-dialog', () => setTableDialog(true));
      
//       // Load saved signatures from localStorage
//       const saved = localStorage.getItem('savedSignatures');
//       if (saved) {
//         setSavedSignatures(JSON.parse(saved));
//       }
//     }
    
//     return () => {
//       // Clean up event listeners
//       const toolbar = document.getElementById(id);
//       if (toolbar) {
//         toolbar.removeEventListener('open-image-dialog', () => setImageDialog(true));
//         toolbar.removeEventListener('open-signature-dialog', () => setSignatureDialog(true));
//         toolbar.removeEventListener('open-watermark-dialog', () => setWatermarkDialog(true));
//         toolbar.removeEventListener('open-table-dialog', () => setTableDialog(true));
//       }
//     };
//   }, [id]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//     }
//   };

//   const insertImage = () => {
//     if (imageFile) {
//       onImageUpload(imageFile);
//       setImageDialog(false);
//       setImageFile(null);
//     }
//   };

//   const insertWatermark = () => {
//     if (watermarkType === 'text' && watermarkText) {
//       onWatermarkAdd({ type: 'text', content: watermarkText });
//       setWatermarkDialog(false);
//       setWatermarkText('');
//     } else if (watermarkType === 'image' && watermarkImage) {
//       onWatermarkAdd({ type: 'image', content: watermarkImage });
//       setWatermarkDialog(false);
//       setWatermarkImage(null);
//     }
//   };

//   const insertSignature = () => {
//     if (signatureTab === 0 && signatureRef.current) {
//       if (!signatureRef.current.isEmpty()) {
//         const signatureData = signatureRef.current.toDataURL();
//         onSignatureAdd(signatureData);
        
//         // Save signature for future use
//         const newSavedSignatures = [...savedSignatures, signatureData];
//         setSavedSignatures(newSavedSignatures);
//         localStorage.setItem('savedSignatures', JSON.stringify(newSavedSignatures));
        
//         setSignatureDialog(false);
//         signatureRef.current.clear();
//       }
//     } else if (signatureTab === 1 && imageFile) {
//       onSignatureAdd(URL.createObjectURL(imageFile));
//       setSignatureDialog(false);
//       setImageFile(null);
//     } else if (signatureTab === 2 && savedSignatures.length > 0) {
//       const selectedSignature = document.querySelector('input[name="saved-signature"]:checked');
//       if (selectedSignature) {
//         onSignatureAdd(selectedSignature.value);
//         setSignatureDialog(false);
//       }
//     }
//   };

//   const insertTable = () => {
//     onTableAdd({ rows, columns });
//     setTableDialog(false);
//   };

//   const handleWatermarkImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setWatermarkImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div id={id}>
//       {/* Image Dialog */}
//       <Dialog open={imageDialog} onClose={() => setImageDialog(false)}>
//         <DialogTitle>Insert Image</DialogTitle>
//         <DialogContent>
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleImageUpload} 
//             className="mt-2 block w-full"
//           />
//           {imageFile && (
//             <div className="mt-4">
//               <p>Preview:</p>
//               <img 
//                 src={URL.createObjectURL(imageFile)} 
//                 alt="Preview" 
//                 className="mt-2 max-w-full h-auto max-h-64"
//               />
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setImageDialog(false)}>Cancel</Button>
//           <Button onClick={insertImage} disabled={!imageFile} color="primary">
//             Insert
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Signature Dialog */}
//       <Dialog 
//         open={signatureDialog} 
//         onClose={() => setSignatureDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Add Digital Signature</DialogTitle>
//         <DialogContent>
//           <Tabs 
//             value={signatureTab} 
//             onChange={(e, newValue) => setSignatureTab(newValue)}
//             variant="fullWidth"
//             className="mb-4"
//           >
//             <Tab label="Draw" />
//             <Tab label="Upload" />
//             <Tab label="Saved" disabled={savedSignatures.length === 0} />
//           </Tabs>

//           {signatureTab === 0 && (
//             <div>
//               <div className="signature-canvas-container" style={{ border: '1px solid #ccc', backgroundColor: '#fff' }}>
//                 <SignatureCanvas
//                   ref={signatureRef}
//                   canvasProps={{
//                     width: 500,
//                     height: 200,
//                     className: 'signature-canvas'
//                   }}
//                   backgroundColor="white"
//                 />
//               </div>
//               <Button 
//                 onClick={() => signatureRef.current.clear()}
//                 variant="outlined"
//                 className="mt-2"
//               >
//                 Clear
//               </Button>
//             </div>
//           )}

//           {signatureTab === 1 && (
//             <div>
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleImageUpload} 
//                 className="mt-2 block w-full"
//               />
//               {imageFile && (
//                 <div className="mt-4">
//                   <p>Preview:</p>
//                   <img 
//                     src={URL.createObjectURL(imageFile)} 
//                     alt="Signature Preview" 
//                     className="mt-2 max-w-full h-auto max-h-64"
//                   />
//                 </div>
//               )}
//             </div>
//           )}

//           {signatureTab === 2 && (
//             <div className="saved-signatures-container">
//               <div className="grid grid-cols-2 gap-4">
//                 {savedSignatures.map((sig, index) => (
//                   <div key={index} className="signature-option">
//                     <input
//                       type="radio"
//                       id={`sig-${index}`}
//                       name="saved-signature"
//                       value={sig}
//                       className="mr-2"
//                     />
//                     <label htmlFor={`sig-${index}`}>
//                       <img 
//                         src={sig} 
//                         alt={`Saved signature ${index + 1}`} 
//                         className="border border-gray-300 p-2 max-h-24"
//                       />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSignatureDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={insertSignature} 
//             color="primary"
//             disabled={(signatureTab === 0 && signatureRef.current?.isEmpty()) || 
//                      (signatureTab === 1 && !imageFile) ||
//                      (signatureTab === 2 && !document.querySelector('input[name="saved-signature"]:checked'))}
//           >
//             Add Signature
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Watermark Dialog */}
//       <Dialog 
//         open={watermarkDialog} 
//         onClose={() => setWatermarkDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Add Watermark</DialogTitle>
//         <DialogContent>
//           <Tabs 
//             value={watermarkType === 'text' ? 0 : 1} 
//             onChange={(e, newValue) => setWatermarkType(newValue === 0 ? 'text' : 'image')}
//             variant="fullWidth"
//             className="mb-4"
//           >
//             <Tab label="Text Watermark" />
//             <Tab label="Image Watermark" />
//           </Tabs>

//           {watermarkType === 'text' && (
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Watermark Text"
//               fullWidth
//               value={watermarkText}
//               onChange={(e) => setWatermarkText(e.target.value)}
//               helperText="This text will appear as a watermark across your document"
//             />
//           )}

//           {watermarkType === 'image' && (
//             <div>
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleWatermarkImageUpload} 
//                 className="mt-2 block w-full"
//               />
//               {watermarkImage && (
//                 <div className="mt-4">
//                   <p>Preview:</p>
//                   <img 
//                     src={watermarkImage} 
//                     alt="Watermark Preview" 
//                     className="mt-2 max-w-full h-auto max-h-64 opacity-30"
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setWatermarkDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={insertWatermark} 
//             color="primary"
//             disabled={(watermarkType === 'text' && !watermarkText) || 
//                      (watermarkType === 'image' && !watermarkImage)}
//           >
//             Add Watermark
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Table Dialog */}
//       <Dialog 
//         open={tableDialog} 
//         onClose={() => setTableDialog(false)}
//       >
//         <DialogTitle>Insert Table</DialogTitle>
//         <DialogContent>
//           <div className="grid grid-cols-2 gap-4">
//             <TextField
//               label="Rows"
//               type="number"
//               value={rows}
//               onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
//               inputProps={{ min: 1, max: 10 }}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Columns"
//               type="number"
//               value={columns}
//               onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
//               inputProps={{ min: 1, max: 10 }}
//               fullWidth
//               margin="normal"
//             />
//           </div>
          
//           <div className="table-preview mt-4">
//             <p>Preview:</p>
//             <div className="border border-gray-300 p-2 mt-2 overflow-auto">
//               <table className="border-collapse w-full">
//                 <tbody>
//                   {[...Array(rows)].map((_, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {[...Array(columns)].map((_, colIndex) => (
//                         <td key={colIndex} className="border border-gray-300 p-2 text-center">
//                           {rowIndex === 0 ? `Header ${colIndex + 1}` : `Cell ${rowIndex},${colIndex}`}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setTableDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={insertTable} 
//             color="primary"
//           >
//             Insert Table
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EditorToolbar;

import React, { useState, useRef } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Tabs, Tab, Box,
  Grid, IconButton, Typography
} from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { TableIcon, SignatureIcon, WatermarkIcon } from './EditorIcons';

const EditorToolbar = ({ onImageUpload, onSignatureAdd, onWatermarkAdd, onTableAdd }) => {
  const [imageDialog, setImageDialog] = useState(false);
  const [signatureDialog, setSignatureDialog] = useState(false);
  const [watermarkDialog, setWatermarkDialog] = useState(false);
  const [tableDialog, setTableDialog] = useState(false);
  const [signatureTab, setSignatureTab] = useState(0);
  const [watermarkTab, setWatermarkTab] = useState(0);
  const [tableRows, setTableRows] = useState(3);
  const [tableColumns, setTableColumns] = useState(3);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const sigCanvas = useRef({});
  const fileInputRef = useRef(null);

  // Handle signature clear
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  // Handle signature save
  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first');
      return;
    }
    
    const signatureData = sigCanvas.current.toDataURL('image/png');
    onSignatureAdd(signatureData);
    setSignatureDialog(false);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
      setImageDialog(false);
    }
  };

  // Handle watermark add
  const addWatermark = () => {
    if (watermarkTab === 0) {
      // Text watermark
      if (!watermarkText.trim()) {
        alert('Please enter watermark text');
        return;
      }
      onWatermarkAdd({ type: 'text', content: watermarkText });
    } else {
      // Image watermark
      if (!fileInputRef.current.files[0]) {
        alert('Please select an image');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        onWatermarkAdd({ type: 'image', content: e.target.result });
      };
      reader.readAsDataURL(fileInputRef.current.files[0]);
    }
    setWatermarkDialog(false);
  };

  // Handle table insert
//   const insertTable = () => {
//     onTableAdd({ rows: tableRows, columns: tableColumns });
//     setTableDialog(false);
//   };

// In the EditorToolbar component, update the insertTable function:

const insertTable = () => {
    // Make sure we have valid values
    const rows = Math.max(1, parseInt(tableRows) || 2);
    const columns = Math.max(1, parseInt(tableColumns) || 2);
    
    // Call the onTableAdd function with the table configuration
    onTableAdd({ rows, columns });
    
    // Close the dialog
    setTableDialog(false);
  };
  

  return (
    <div className="editor-toolbar">
      {/* Image Upload Dialog */}
      <Dialog open={imageDialog} onClose={() => setImageDialog(false)}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Signature Dialog */}
      <Dialog 
        open={signatureDialog} 
        onClose={() => setSignatureDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>Add Signature</DialogTitle>
        <DialogContent>
          <Tabs 
            value={signatureTab} 
            onChange={(e, newValue) => setSignatureTab(newValue)}
            centered
          >
            <Tab label="Draw Signature" />
            <Tab label="Upload Signature" />
          </Tabs>
          
          {signatureTab === 0 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Draw your signature below:
              </Typography>
              <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas'
                  }}
                  backgroundColor="#f5f5f5"
                />
              </div>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={clearSignature}
                style={{ marginTop: '10px' }}
              >
                Clear
              </Button>
            </Box>
          )}
          
          {signatureTab === 1 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Upload a signature image:
              </Typography>
              <input
                type="file"
                accept="image/*"
                style={{ marginTop: '10px' }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      onSignatureAdd(event.target.result);
                      setSignatureDialog(false);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignatureDialog(false)}>Cancel</Button>
          {signatureTab === 0 && (
            <Button onClick={saveSignature} color="primary">
              Add Signature
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Watermark Dialog */}
      <Dialog 
        open={watermarkDialog} 
        onClose={() => setWatermarkDialog(false)}
      >
        <DialogTitle>Add Watermark</DialogTitle>
        <DialogContent>
          <Tabs 
            value={watermarkTab} 
            onChange={(e, newValue) => setWatermarkTab(newValue)}
            centered
          >
            <Tab label="Text Watermark" />
            <Tab label="Image Watermark" />
          </Tabs>
          
          {watermarkTab === 0 && (
            <Box mt={2}>
              <TextField
                label="Watermark Text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                fullWidth
                margin="normal"
              />
              <div 
                style={{ 
                  height: '100px', 
                  border: '1px solid #ccc', 
                  position: 'relative',
                  overflow: 'hidden',
                  marginTop: '10px'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-45deg)',
                  fontSize: '24px',
                  opacity: 0.2,
                  color: '#888',
                  whiteSpace: 'nowrap'
                }}>
                  {watermarkText}
                </div>
              </div>
            </Box>
          )}
          
          {watermarkTab === 1 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Upload a watermark image:
              </Typography>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ marginTop: '10px' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWatermarkDialog(false)}>Cancel</Button>
          <Button onClick={addWatermark} color="primary">
            Add Watermark
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Dialog */}
      <Dialog 
        open={tableDialog} 
        onClose={() => setTableDialog(false)}
      >
        <DialogTitle>Insert Table</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Rows"
                type="number"
                value={tableRows}
                onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 10 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Columns"
                type="number"
                value={tableColumns}
                onChange={(e) => setTableColumns(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 10 } }}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom style={{ marginTop: '10px' }}>
            Preview:
          </Typography>
          <div className="table-preview" style={{ overflowX: 'auto' }}>
            <table>
              <tbody>
                {Array.from({ length: Math.min(tableRows, 5) }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: Math.min(tableColumns, 5) }).map((_, colIndex) => (
                      rowIndex === 0 
                        ? <th key={colIndex}>Header {colIndex+1}</th>
                        : <td key={colIndex}>Cell {rowIndex},{colIndex}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableDialog(false)}>Cancel</Button>
          <Button onClick={insertTable} color="primary">
            Insert Table
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toolbar Buttons */}
      <div className="editor-extra-controls mt-2 flex flex-wrap gap-2">
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<TableIcon />}
          onClick={() => setTableDialog(true)}
        >
          Table
        </Button>
        
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<SignatureIcon />}
          onClick={() => setSignatureDialog(true)}
        >
          Signature
        </Button>
        
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<WatermarkIcon />}
          onClick={() => setWatermarkDialog(true)}
        >
          Watermark
        </Button>
        
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setImageDialog(true)}
        >
          Image
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
