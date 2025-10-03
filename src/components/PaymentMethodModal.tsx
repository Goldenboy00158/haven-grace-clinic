import React, { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, CheckCircle, Plus, Calculator, AlertTriangle } from 'lucide-react';

interface PaymentDetails {
  method: 'cash' | 'mpesa' | 'card' | 'split' | 'partial';
  amount: number;
  transactionId?: string;
  splitPayments?: {
    method: 'cash' | 'mpesa' | 'card';
    amount: number;
    transactionId?: string;
  }[];
  partialPayment?: {
    amountPaid: number;
    amountRemaining: number;
    paymentMethod: 'cash' | 'mpesa' | 'card';
    transactionId?: string;
    notes?: string;
  };
}

interface PaymentMethodModalProps {
  totalAmount: number;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
  onClose: () => void;
}

export default function PaymentMethodModal({ totalAmount, onPaymentComplete, onClose }: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'mpesa' | 'card' | 'split' | 'partial'>('cash');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Split payment states
  const [splitPayments, setSplitPayments] = useState([
    { method: 'cash' as const, amount: 0, transactionId: '' },
    { method: 'mpesa' as const, amount: 0, transactionId: '' }
  ]);

  // Partial payment states
  const [partialPayment, setPartialPayment] = useState({
    amountPaid: 0,
    paymentMethod: 'cash' as const,
    transactionId: '',
    notes: ''
  });

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let paymentDetails: PaymentDetails;
    
    if (selectedMethod === 'split') {
      paymentDetails = {
        method: 'split',
        amount: totalAmount,
        splitPayments: splitPayments.filter(p => p.amount > 0).map(p => ({
          ...p,
          transactionId: p.method === 'mpesa' ? `MP${Date.now()}${Math.random().toString(36).substr(2, 4)}` :
                        p.method === 'card' ? `CD${Date.now()}${Math.random().toString(36).substr(2, 4)}` :
                        undefined
        }))
      };
    } else if (selectedMethod === 'partial') {
      paymentDetails = {
        method: 'partial',
        amount: totalAmount,
        partialPayment: {
          amountPaid: partialPayment.amountPaid,
          amountRemaining: totalAmount - partialPayment.amountPaid,
          paymentMethod: partialPayment.paymentMethod,
          transactionId: partialPayment.paymentMethod === 'mpesa' ? `MP${Date.now()}` :
                        partialPayment.paymentMethod === 'card' ? `CD${Date.now()}` :
                        undefined,
          notes: partialPayment.notes
        }
      };
    } else {
      let transactionId: string | undefined;
      
      if (selectedMethod === 'mpesa') {
        transactionId = `MP${Date.now()}`;
      } else if (selectedMethod === 'card') {
        transactionId = `CD${Date.now()}`;
      }
      
      paymentDetails = {
        method: selectedMethod,
        amount: totalAmount,
        transactionId
      };
    }
    
    onPaymentComplete(paymentDetails);
    setProcessing(false);
  };

  const isFormValid = () => {
    if (selectedMethod === 'cash') return true;
    if (selectedMethod === 'mpesa') return mpesaPhone.length >= 10;
    if (selectedMethod === 'card') return cardNumber.length >= 16 && expiryDate && cvv.length >= 3;
    if (selectedMethod === 'split') {
      const totalSplit = splitPayments.reduce((sum, p) => sum + p.amount, 0);
      return Math.abs(totalSplit - totalAmount) < 0.01; // Allow for small rounding differences
    }
    if (selectedMethod === 'partial') {
      return partialPayment.amountPaid > 0 && partialPayment.amountPaid < totalAmount;
    }
    return false;
  };

  const updateSplitPayment = (index: number, field: 'method' | 'amount', value: any) => {
    setSplitPayments(prev => prev.map((payment, i) => 
      i === index ? { ...payment, [field]: value } : payment
    ));
  };

  const addSplitPayment = () => {
    setSplitPayments(prev => [...prev, { method: 'cash', amount: 0, transactionId: '' }]);
  };

  const removeSplitPayment = (index: number) => {
    if (splitPayments.length > 1) {
      setSplitPayments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateRemaining = () => {
    const paid = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    return Math.max(0, totalAmount - paid);
  };

  const autoFillRemaining = (index: number) => {
    const remaining = calculateRemaining();
    updateSplitPayment(index, 'amount', remaining);
  };

  const calculatePartialRemaining = () => {
    return Math.max(0, totalAmount - partialPayment.amountPaid);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
                    <div className="text-sm text-gray-500">Pay full amount with cash</div>
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

              <button
                onClick={() => setSelectedMethod('partial')}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'partial'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Partial Payment</div>
                    <div className="text-sm text-gray-500">Pay part now, balance tracked for later</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('split')}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'split'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Calculator className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Split Payment</div>
                    <div className="text-sm text-gray-500">Combine cash, M-Pesa, and card payments</div>
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

          {selectedMethod === 'partial' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Partial Payment Setup</h4>
                <p className="text-sm text-orange-800">
                  Customer pays part now, remaining balance is tracked and can be collected later. 
                  Transaction status will show as "Partial" until fully paid.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Pay Now (KES)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalAmount - 1}
                    step="0.01"
                    value={partialPayment.amountPaid}
                    onChange={(e) => setPartialPayment(prev => ({ 
                      ...prev, 
                      amountPaid: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={partialPayment.paymentMethod}
                    onChange={(e) => setPartialPayment(prev => ({ 
                      ...prev, 
                      paymentMethod: e.target.value as any 
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              {partialPayment.paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={partialPayment.transactionId}
                    onChange={(e) => setPartialPayment(prev => ({ 
                      ...prev, 
                      transactionId: e.target.value 
                    }))}
                    placeholder="0712345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={partialPayment.notes}
                  onChange={(e) => setPartialPayment(prev => ({ 
                    ...prev, 
                    notes: e.target.value 
                  }))}
                  placeholder="Reason for partial payment, when balance will be paid, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Amount Paying Now:</span>
                    <span className="ml-2 font-medium text-green-600">
                      KES {partialPayment.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining Balance:</span>
                    <span className="ml-2 font-medium text-red-600">
                      KES {calculatePartialRemaining().toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-orange-700">
                  <strong>Note:</strong> Remaining balance will be tracked in transaction history for future collection.
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'split' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Split Payment Details</h4>
                <div className="text-sm text-gray-600">
                  Remaining: KES {calculateRemaining().toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-3">
                {splitPayments.map((payment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Payment {index + 1}</span>
                      {splitPayments.length > 1 && (
                        <button
                          onClick={() => removeSplitPayment(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={payment.method}
                        onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="cash">Cash</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="card">Card</option>
                      </select>
                      
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min="0"
                          max={totalAmount}
                          step="0.01"
                          value={payment.amount}
                          onChange={(e) => updateSplitPayment(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => autoFillRemaining(index)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-2 rounded-lg text-xs transition-colors"
                          title="Fill remaining amount"
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                    
                    {payment.method === 'mpesa' && payment.amount > 0 && (
                      <div className="mt-2">
                        <input
                          type="tel"
                          value={payment.transactionId}
                          onChange={(e) => updateSplitPayment(index, 'transactionId', e.target.value)}
                          placeholder="M-Pesa phone number"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={addSplitPayment}
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Payment Method</span>
                </button>
                
                <div className="text-sm">
                  <span className="text-gray-600">Total Split: </span>
                  <span className={`font-medium ${
                    Math.abs(splitPayments.reduce((sum, p) => sum + p.amount, 0) - totalAmount) < 0.01 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    KES {splitPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {Math.abs(calculateRemaining()) > 0.01 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Split payments must equal the total amount (KES {totalAmount.toLocaleString()}).
                    <br />Current difference: KES {calculateRemaining().toLocaleString()}
                    <br />Use "Auto" button to fill remaining amount automatically.
                  </p>
                </div>
              )}
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
                  <span>
                    {selectedMethod === 'split' ? 'Complete Split Payment' : 
                     selectedMethod === 'partial' ? 'Process Partial Payment' :
                     'Complete Payment'}
                  </span>
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