import React, { useState } from 'react';
import { Eye, X, Printer, Download, Receipt, User, Calendar, DollarSign, Package, FileText } from 'lucide-react';
import { SaleItem, Patient } from '../types';

interface SalesPreviewModalProps {
  items: SaleItem[];
  customer: {
    type: 'patient' | 'general';
    name: string;
    phone?: string;
    patientId?: string;
  };
  totalAmount: number;
  totalSavings: number;
  onClose: () => void;
  onPrint: () => void;
  onProceedToPayment: () => void;
}

export default function SalesPreviewModal({
  items,
  customer,
  totalAmount,
  totalSavings,
  onClose,
  onPrint,
  onProceedToPayment
}: SalesPreviewModalProps) {
  const [receiptNumber] = useState(`RCP${Date.now()}`);
  const [saleDate] = useState(new Date());

  const generateReceiptContent = () => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Receipt - ${receiptNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.4;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .clinic-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .clinic-details {
              font-size: 12px;
              margin: 2px 0;
            }
            .receipt-title {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
              text-transform: uppercase;
            }
            .receipt-info {
              margin: 10px 0;
              font-size: 12px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .items-table th,
            .items-table td {
              text-align: left;
              padding: 5px 2px;
              font-size: 11px;
            }
            .items-table th {
              border-bottom: 1px solid #000;
              font-weight: bold;
            }
            .item-row {
              border-bottom: 1px dotted #ccc;
            }
            .total-section {
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 15px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
              font-size: 12px;
            }
            .grand-total {
              font-weight: bold;
              font-size: 14px;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <div class="clinic-name">${clinicSettings.clinicName || 'HAVEN GRACE MEDICAL CLINIC'}</div>
            <div class="clinic-details">${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</div>
            <div class="clinic-details">Tel: ${clinicSettings.clinicPhone?.join(', ') || '0719307605, 0725488740'}</div>
            <div class="clinic-details">Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</div>
          </div>
          
          <div class="receipt-title">SALES RECEIPT</div>
          
          <div class="receipt-info">
            <div>Receipt No: ${receiptNumber}</div>
            <div>Date: ${saleDate.toLocaleDateString()} ${saleDate.toLocaleTimeString()}</div>
            <div>Customer: ${customer.name}</div>
            ${customer.phone ? `<div>Phone: ${customer.phone}</div>` : ''}
            <div>Type: ${customer.type === 'patient' ? 'Patient Sale' : 'General Sale'}</div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr class="item-row">
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.totalCost.toFixed(2)}</td>
                </tr>
                ${item.originalPrice && item.originalPrice !== item.price ? `
                  <tr>
                    <td colspan="4" style="font-size: 10px; color: #666; padding-left: 10px;">
                      Discount: ${item.discountType === 'percentage' ? `${item.discountValue}%` : `KES ${item.discountValue}`} off
                    </td>
                  </tr>
                ` : ''}
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>KES ${(totalAmount + totalSavings).toFixed(2)}</span>
            </div>
            ${totalSavings > 0 ? `
              <div class="total-row" style="color: #16a34a;">
                <span>Total Savings:</span>
                <span>-KES ${totalSavings.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>TOTAL:</span>
              <span>KES ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="receipt-footer">
            <div>Thank you for choosing our services!</div>
            <div>This is an official receipt for items purchased.</div>
            <div>For inquiries, please contact us using the details above.</div>
          </div>
        </body>
      </html>
    `;
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(generateReceiptContent());
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Sales Preview</h3>
                <p className="text-green-100 text-sm">Review before payment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{customer.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  customer.type === 'patient' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {customer.type === 'patient' ? 'Patient' : 'General Customer'}
                </span>
              </div>
              {customer.phone && (
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{customer.phone}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{saleDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Items Summary ({items.length} items)
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Unit Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          {item.originalPrice && item.originalPrice !== item.price && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500 line-through">
                                KES {item.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {item.discountType === 'percentage' 
                                  ? `${item.discountValue}% off` 
                                  : `KES ${item.discountValue} off`
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-700">KES {item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">KES {item.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">KES {(totalAmount + totalSavings).toLocaleString()}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Total Savings:</span>
                  <span className="font-medium">-KES {totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-2">
                <span>Grand Total:</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Receipt Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
              <Receipt className="h-4 w-4 mr-2" />
              Receipt Details
            </h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Receipt Number:</span>
                <span className="ml-2 font-medium">{receiptNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Date & Time:</span>
                <span className="ml-2 font-medium">{saleDate.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={printReceipt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onProceedToPayment}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <DollarSign className="h-4 w-4" />
              <span>Proceed to Payment</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}