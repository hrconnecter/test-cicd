import { useRef } from 'react';
import { getSignedUrlForOrgDocs, uploadFile } from "../../../services/docManageS3";

export default function useDocumentEditor(authToken, setAppAlert, setLoading) {
  const quillRef = useRef(null);
  
  // Function to handle image uploads
  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      
      // Get a signed URL for the image
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `image-${Date.now()}-${file.name}`,
      });
      
      // Upload the image
      await uploadFile(signedUrlResponse.url, file);
      
      // Get the image URL (without query parameters)
      const imageUrl = signedUrlResponse.url.split("?")[0];
      
      // Insert the image into the editor
      if (quillRef.current && quillRef.current.getEditor) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range ? range.index : 0, 'image', imageUrl);
      }
      
      setLoading(false);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to upload image",
      });
      return null;
    }
  };

  // Function to add digital signature
  const handleSignatureAdd = (signatureData) => {
    if (quillRef.current && quillRef.current.getEditor) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      
      // Create a signature container
      const signatureHTML = `
        <div class="signature-container" contenteditable="false">
          <img src="${signatureData}" alt="Digital Signature" style="max-height: 100px;" />
        </div>
      `;
      
      editor.clipboard.dangerouslyPasteHTML(
        range ? range.index : 0,
        signatureHTML
      );
    }
  };

  // Function to add watermark
  const handleWatermarkAdd = (watermarkData) => {
    if (quillRef.current && quillRef.current.getEditor) {
      const editor = quillRef.current.getEditor();
      
      let watermarkHTML = '';
      
      if (watermarkData.type === 'text') {
        // Create a text watermark
        watermarkHTML = `
          <div class="watermark-container" contenteditable="false">
            <div class="watermark-text">
              ${watermarkData.content}
            </div>
          </div>
        `;
      } else if (watermarkData.type === 'image') {
        // Create an image watermark
        watermarkHTML = `
          <div class="watermark-container" contenteditable="false">
            <img src="${watermarkData.content}" alt="Watermark" class="watermark-image" />
          </div>
        `;
      }
      
      // Insert the watermark
      const range = editor.getSelection();
      editor.clipboard.dangerouslyPasteHTML(
        range ? range.index : 0,
        watermarkHTML
      );
    }
  };

  // Function to add table
  const handleTableAdd = (tableConfig) => {
    if (quillRef.current && quillRef.current.getEditor) {
      const editor = quillRef.current.getEditor();
      
      // Create table HTML
      let tableHTML = '<table><tbody>';
      for (let r = 0; r < tableConfig.rows; r++) {
        tableHTML += '<tr>';
        for (let c = 0; c < tableConfig.columns; c++) {
          if (r === 0) {
            // First row as headers
            tableHTML += `<th>Header ${c+1}</th>`;
          } else {
            tableHTML += `<td>Cell ${r},${c}</td>`;
          }
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table>';
      
      // Insert the table
      const range = editor.getSelection();
      editor.clipboard.dangerouslyPasteHTML(
        range ? range.index : 0,
        tableHTML
      );
    }
  };
  
  return {
    quillRef,
    handleImageUpload,
    handleSignatureAdd,
    handleWatermarkAdd,
    handleTableAdd
  };
}
