// Components/BarcodeGenerator.js
import React, { useContext, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JsBarcode from 'jsbarcode';
import Swal from 'sweetalert2';
import { ConfigContext } from '../Context/ConfigContext';

const BarcodeGenerator = ({ serialNumber, itemName, quantity, onClose, onQuantityChange }) => {
    const barcodeRef = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const { primaryColor } = useContext(ConfigContext)

    // Generate barcode when component mounts or serialNumber changes
    React.useEffect(() => {
        if (barcodeRef.current && serialNumber) {
            JsBarcode(barcodeRef.current, serialNumber, {
                format: "CODE128",
                displayValue: true,
                fontSize: 16,
                background: "#ffffff",
                lineColor: "#000000",
                margin: 10,
                width: 2,
                height: 80
            });
        }
    }, [serialNumber]);

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            // Create a printable document with multiple barcodes
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Print Barcodes - ${itemName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .barcode-container { 
                            display: grid; 
                            grid-template-columns: repeat(2, 1fr); 
                            gap: 20px; 
                            margin-bottom: 20px; 
                        }
                        .barcode-item { 
                            border: 1px solid #ddd; 
                            padding: 15px; 
                            text-align: center; 
                            page-break-inside: avoid; 
                        }
                        .item-name { 
                            font-weight: bold; 
                            margin-bottom: 10px; 
                            font-size: 14px; 
                        }
                        .serial-number { 
                            margin-top: 10px; 
                            font-size: 12px; 
                            color: #666; 
                        }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .barcode-container { gap: 15px; }
                        }
                    </style>
                    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                </head>
                <body>
                    <div class="barcode-container">
            `);

            // Add multiple barcodes based on quantity
            for (let i = 0; i < quantity; i++) {
                printWindow.document.write(`
                    <div class="barcode-item">
                        <div class="item-name">${itemName}</div>
                        <svg class="barcode-${i}"></svg>
                        <div class="serial-number">${serialNumber}</div>
                    </div>
                `);
            }

            printWindow.document.write(`
                    </div>
                    <script>
                        // Generate barcodes after the page loads
                        window.onload = function() {
                            for (let i = 0; i < ${quantity}; i++) {
                                JsBarcode(document.querySelector('.barcode-' + i), '${serialNumber}', {
                                    format: "CODE128",
                                    displayValue: true,
                                    fontSize: 14,
                                    background: "#ffffff",
                                    lineColor: "#000000",
                                    margin: 8,
                                    width: 1.5,
                                    height: 60
                                });
                            }
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();

            Swal.fire({
                icon: 'success',
                title: 'Printing',
                text: 'Barcodes sent to printer successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error printing barcodes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Print Error',
                text: 'Failed to print barcodes. Please try again.'
            });
        } finally {
            setIsPrinting(false);
        }
    };

    const downloadBarcode = async () => {
        try {
            if (barcodeRef.current) {
                const dataUrl = await toPng(barcodeRef.current, {
                    backgroundColor: '#ffffff',
                    quality: 1.0
                });

                const link = document.createElement('a');
                link.download = `${itemName}_${serialNumber}_barcode.png`;
                link.href = dataUrl;
                link.click();

                Swal.fire({
                    icon: 'success',
                    title: 'Downloaded',
                    text: 'Barcode downloaded successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error downloading barcode:', error);
            Swal.fire({
                icon: 'error',
                title: 'Download Error',
                text: 'Failed to download barcode. Please try again.'
            });
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header pb-3" style={{ backgroundColor: primaryColor }}>
                        <h5 className="modal-title text-white">Generate Barcode</h5>
                        <button type="button" className="btn-close text-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Item Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={itemName}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Serial Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={serialNumber}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Number of Barcodes to Print</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max="100"
                                        value={quantity}
                                        onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                                    />
                                    <div className="form-text">Enter the quantity of barcodes you want to print (1-100)</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="card-title mb-0">Barcode Preview</h6>
                                    </div>
                                    <div className="card-body text-center">
                                        <div className="barcode-preview p-3 border rounded bg-light">
                                            <div className="item-name mb-2 fw-bold">{itemName}</div>
                                            <svg ref={barcodeRef} className="barcode" />
                                            <div className="serial-number mt-2 text-muted small">{serialNumber}</div>
                                        </div>
                                        <button
                                            className="btn btn-outline-primary mt-3 btn-sm"
                                            onClick={downloadBarcode}
                                        >
                                            <i className="ri-download-line me-1"></i> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handlePrint}
                            disabled={isPrinting}
                        >
                            {isPrinting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <i className="ri-printer-line me-1"></i> Print Barcodes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;