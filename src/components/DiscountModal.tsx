import React, { useState } from 'react';
import { Percent, DollarSign, X, Save } from 'lucide-react';

interface DiscountModalProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    totalCost: number;
  };
  onApplyDiscount: (itemId: string, discountType: 'percentage' | 'fixed', discountValue: number) => void;
  onClose: () => void;
}

export default function DiscountModal({ item, onApplyDiscount, onClose }: DiscountModalProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [reason, setReason] = useState('');

  const calculateDiscountedPrice = () => {
    if (discountType === 'percentage') {
      return item.totalCost - (item.totalCost * discountValue / 100);
    } else {
      return Math.max(0, item.totalCost - discountValue);
    }
  };

  const handleApply = () => {
    if (discountValue > 0) {
      onApplyDiscount(item.id, discountType, discountValue);
      onClose();
    }
  };

  const discountedPrice = calculateDiscountedPrice();
  const savings = item.totalCost - discountedPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Apply Discount</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Item Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <div className="text-sm text-gray-600">
              Quantity: {item.quantity} × KES {item.price} = KES {item.totalCost}
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setDiscountType('percentage')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  discountType === 'percentage' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <Percent className="h-4 w-4" />
                <span>Percentage</span>
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  discountType === 'fixed' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Fixed Amount</span>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount {discountType === 'percentage' ? 'Percentage' : 'Amount (KES)'}
            </label>
            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? 100 : item.totalCost}
              step={discountType === 'percentage' ? 1 : 0.01}
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Discount</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Senior citizen discount, Bulk purchase, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {/* Preview */}
          {discountValue > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span>KES {item.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-KES {savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-600 border-t pt-2">
                  <span>Final Price:</span>
                  <span>KES {discountedPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleApply}
              disabled={discountValue <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Apply Discount</span>
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
}</parameter>