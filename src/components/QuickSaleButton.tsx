import React, { useState } from 'react';
import { ShoppingCart, Package, Stethoscope, Heart, Plus } from 'lucide-react';
import CombinedSalesModal from './CombinedSalesModal';

interface QuickSaleButtonProps {
  variant?: 'button' | 'fab' | 'card';
  className?: string;
  preselectedType?: 'medications' | 'clinical' | 'family_planning';
  patient?: any;
}

export default function QuickSaleButton({ 
  variant = 'button', 
  className = '',
  preselectedType,
  patient 
}: QuickSaleButtonProps) {
  const [showSalesModal, setShowSalesModal] = useState(false);

  const handleSaleComplete = (items: any[], totalAmount: number, paymentMethod: string, customerInfo: any) => {
    // Handle sale completion
    console.log('Sale completed:', { items, totalAmount, paymentMethod, customerInfo });
    setShowSalesModal(false);
  };

  if (variant === 'fab') {
    return (
      <>
        <button
          onClick={() => setShowSalesModal(true)}
          className={`fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 ${className}`}
          title="Quick Sale"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>
        {showSalesModal && (
          <CombinedSalesModal
            patient={patient}
            onClose={() => setShowSalesModal(false)}
            onSaleComplete={handleSaleComplete}
          />
        )}
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <div className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${className}`}>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Sale</h3>
            <p className="text-gray-600 text-sm mb-4">
              Sell medications, services, and family planning items
            </p>
            <button
              onClick={() => setShowSalesModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Start Sale</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-orange-50 rounded">
              <Package className="h-4 w-4 text-orange-600 mx-auto mb-1" />
              <span className="text-xs text-orange-600">Medications</span>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <Stethoscope className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-blue-600">Clinical</span>
            </div>
            <div className="text-center p-2 bg-pink-50 rounded">
              <Heart className="h-4 w-4 text-pink-600 mx-auto mb-1" />
              <span className="text-xs text-pink-600">Family Planning</span>
            </div>
          </div>
        </div>
        
        {showSalesModal && (
          <CombinedSalesModal
            patient={patient}
            onClose={() => setShowSalesModal(false)}
            onSaleComplete={handleSaleComplete}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowSalesModal(true)}
        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${className}`}
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Quick Sale</span>
      </button>
      
      {showSalesModal && (
        <CombinedSalesModal
          patient={patient}
          onClose={() => setShowSalesModal(false)}
          onSaleComplete={handleSaleComplete}
        />
      )}
    </>
  );
}