import React, { useState } from 'react';
import { CreditCard, Smartphone, DollarSign, X, CheckCircle } from 'lucide-react';

interface PaymentMethodModalProps {
  totalAmount: number;
  onPaymentComplete: (paymentMethod: 'cash' | 'mpesa' | 'card', transactionId?: string) => void;
  onClose: () => void;
}

export default function PaymentMethodModal({ totalAmount, onPaymentComplete, onClose }: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'cash' as const,
      name: 'Cash Payment',
      icon: DollarSign,
      description: 'Pay with cash',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'mpesa' as const,
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay via M-Pesa mobile money',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'card' as const,
      name: 'Card Payment',
      icon: CreditCard,
      description: 'Pay with debit/credit card',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalTransactionId = selectedMethod === 'mpesa' ? transactionId : 
                              selectedMethod === 'card' ? `CARD_${Date.now()}` :
                              `CASH_${Date.now()}`;
    
    onPaymentComplete(selectedMethod, finalTransactionId);
    setIsProcessing(false);
  };

  const isFormValid = () => {
    if (selectedMethod === 'mpesa') {
      return mpesaNumber.length >= 10 && transactionId.length > 0;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Amount */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-sm text-blue-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-blue-900">KES {totalAmount.toLocaleString()}</div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${method.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* M-Pesa Details */}
          {selectedMethod === 'mpesa' &pochi& (
            <div className="space-y-4 bg-green-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Number</label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., QHX12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-green-700 bg-green-100 p-3 rounded">
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Go to M-Pesa menu on your phone</li>
                  <li>Select "Lipa na M-Pesa"</li>
                  <li>Select "Pay Bill"</li>
                  <li>Enter Business Number: 123456</li>
                  <li>Enter Amount: KES {totalAmount}</li>
                  <li>Enter your M-Pesa PIN</li>
                  <li>Copy the transaction ID and paste above</li>
                </ol>
              </div>
            </div>
          )}

          {/* Card Payment Info */}
          {selectedMethod === 'card' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>Card Payment:</strong> Please present your card to the cashier for processing.
                A receipt will be provided upon successful payment.
              </div>
            </div>
          )}

          {/* Cash Payment Info */}
          {selectedMethod === 'cash' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-700">
                <strong>Cash Payment:</strong> Please provide exact amount or change will be given.
                A receipt will be issued upon payment completion.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handlePayment}
              disabled={!isFormValid() || isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay KES ${totalAmount.toLocaleString()}`}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}