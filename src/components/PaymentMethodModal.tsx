import React, { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, CheckCircle } from 'lucide-react';

interface PaymentMethodModalProps {
  totalAmount: number;
  onPaymentComplete: (paymentMethod: 'cash' | 'mpesa' | 'card', transactionId?: string) => void;
  onClose: () => void;
}

export default function PaymentMethodModal({ totalAmount, onPaymentComplete, onClose }: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let transactionId: string | undefined;
    
    if (selectedMethod === 'mpesa') {
      transactionId = `MP${Date.now()}`;
    } else if (selectedMethod === 'card') {
      transactionId = `CD${Date.now()}`;
    }
    
    onPaymentComplete(selectedMethod, transactionId);
    setProcessing(false);
  };

  const isFormValid = () => {
    if (selectedMethod === 'cash') return true;
    if (selectedMethod === 'mpesa') return mpesaPhone.length >= 10;
    if (selectedMethod === 'card') return cardNumber.length >= 16 && expiryDate && cvv.length >= 3;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod('cash')}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'cash'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Cash Payment</div>
                    <div className="text-sm text-gray-500">Pay with cash at counter</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('mpesa')}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'mpesa'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Smartphone className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">M-Pesa</div>
                    <div className="text-sm text-gray-500">Pay via M-Pesa mobile money</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Pay with card</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="e.g., 0712345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You will receive a payment prompt on your phone
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={handlePayment}
              disabled={!isFormValid() || processing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Payment</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}