import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import QRCode from "qrcode";
import jsPDF from "jspdf";

const GenerateQRCodeModal = ({ open, onClose, orgId, orgName, orgLogo }) => {
    console.log("orgLogo", orgLogo);

    const [qrCodeData, setQrCodeData] = useState(null);

    const generateQRCode = async () => {
        try {
            // Create a canvas element for the QR code
            const canvas = document.createElement("canvas");

            // Generate the QR code on the canvas using orgId
            await QRCode.toCanvas(canvas, orgId, {
                errorCorrectionLevel: "H",
                width: 300,
            });

            // Convert the canvas to a data URL for display and future use
            const qrCodeImage = canvas.toDataURL("image/png");
            setQrCodeData(qrCodeImage);

            console.log("QR Code generated successfully.");
        } catch (error) {
            console.error("Error generating QR Code:", error);
        }
    };


    const downloadQRCodePDF = () => {
        if (!qrCodeData) {
            console.error("No QR Code data available.");
            return;
        }

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const qrCodeSize = 100;

            const x = (pageWidth - qrCodeSize) / 2;
            const yText = 20;
            const yQRCode = yText + 10;

            doc.setFontSize(16);
            doc.text(`${orgName}`, pageWidth / 2, yText, { align: "center" });
            doc.addImage(qrCodeData, "PNG", x, yQRCode, qrCodeSize, qrCodeSize);
            doc.save(`${orgName}_QRCode.pdf`);
            onClose();
            console.log("PDF downloaded successfully.");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <Dialog
            className="flex justify-center items-center"
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    width: 400, // Set your desired width here
                    maxWidth: "none", // Ensures the dialog doesn't stretch beyond the width
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h5">QR Code Generator</Typography>
            </DialogTitle>
            <DialogContent>
                {!qrCodeData && (
                    <Button
                        className="flex w-full"
                        sx={{ textTransform: "none" }}
                        variant="contained"
                        onClick={generateQRCode}
                    >
                        Generate QR Code
                    </Button>
                )}
                <div className="flex justify-center items-center ">
                    {qrCodeData && (
                        <img
                            src={qrCodeData}
                            alt="Generated QR Code"
                            style={{ maxWidth: "100%" }}
                        />
                    )}
                </div>
                {qrCodeData && (
                    <div className="flex gap-2 mt-4 justify-center">
                        <Button
                            className="flex w-full"
                            sx={{ textTransform: "none" }}
                            variant="contained"
                            color="error"
                            onClick={downloadQRCodePDF}
                        >
                            Download PDF
                        </Button>
                        <Button
                            className="flex w-full"
                            sx={{ textTransform: "none" }}
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GenerateQRCodeModal;
