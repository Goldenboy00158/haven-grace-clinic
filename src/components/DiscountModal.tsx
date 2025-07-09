import React, { useState } from 'react';
import { X, Percent, DollarSign } from 'lucide-react';
import { ServiceItem } from '../types';

interface DiscountModalProps {
  item: ServiceItem;
  onApplyDiscount: (itemId: string, discountType: 'percentage' | 'fixed', discountValue: number) => void;
  onClose: () => void;
}

export default function DiscountModal({ item, onApplyDiscount, onClose }: DiscountModalProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [reason, setReason] = useState('');

  const originalPrice = item.originalPrice || item.price;
  const maxDiscount = discountType === 'percentage' ? 100 : originalPrice;

  const calculateDiscountedPrice = () => {
    const value = parseFloat(discountValue) || 0;
    if (discountType === 'percentage') {
      return originalPrice - (originalPrice * value / 100);
    } else {
      return Math.max(0, originalPrice - value);
    }
  };

  const handleApply = () => {
    const value = parseFloat(discountValue) || 0;
    if (value > 0 && value <= maxDiscount) {
      onApplyDiscount(item.id, discountType, value);
      onClose();
    }
  };

  const discountedPrice = calculateDiscountedPrice();
  const savings = originalPrice - discountedPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Apply Discount</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Original Price:</span>
              <span className="font-medium text-gray-900">KES {originalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDiscountType('percentage')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  discountType === 'percentage'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Percent className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Percentage</span>
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  discountType === 'fixed'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DollarSign className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Fixed Amount</span>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <div className="relative">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max={maxDiscount}
                step={discountType === 'percentage' ? '1' : '0.01'}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {discountType === 'percentage' ? '%' : 'KES'}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {discountType === 'percentage' ? '100%' : `KES ${maxDiscount.toLocaleString()}`}
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Senior citizen, Staff discount, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          {discountValue && (
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Original Price:</span>
                <span className="text-gray-900">KES {originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="text-red-600">
                  - KES {savings.toLocaleString()}
                  {discountType === 'percentage' && ` (${discountValue}%)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-medium border-t pt-2">
                <span className="text-gray-900">Final Price:</span>
                <span className="text-green-600">KES {discountedPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={handleApply}
              disabled={!discountValue || parseFloat(discountValue) <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Discount
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