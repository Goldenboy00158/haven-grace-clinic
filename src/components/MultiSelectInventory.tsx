import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, ShoppingCart, Check, X, Plus, Minus, DollarSign } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { medications, getStockStatus, getMedicationCategories } from '../data/medications';
import { Medication } from '../types';

interface MultiSelectInventoryProps {
  onClose: () => void;
  onSaleComplete: (selectedItems: any[]) => void;
}

export default function MultiSelectInventory({ onClose, onSaleComplete }: MultiSelectInventoryProps) {
  const [medicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItems, setSelectedItems] = useState<{[key: string]: { medication: Medication, quantity: number }}>({});

  const categories = getMedicationCategories();

  const filteredMedications = useMemo(() => {
    return medicationData.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || med.category === selectedCategory;
      const hasStock = med.stock > 0;
      return matchesSearch && matchesCategory && hasStock;
    });
  }, [medicationData, searchTerm, selectedCategory]);

  const toggleItemSelection = (medication: Medication) => {
    setSelectedItems(prev => {
      if (prev[medication.id]) {
        const { [medication.id]: removed, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [medication.id]: { medication, quantity: 0.5 }
        };
      }
    });
  };

  const updateQuantity = (medicationId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(prev => {
        const { [medicationId]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [medicationId]: {
          ...prev[medicationId],
          quantity
        }
      }));
    }
  };

  const getTotalValue = () => {
    return Object.values(selectedItems).reduce((sum, item) => 
      sum + (item.medication.price * item.quantity), 0
    );
  };

  const handleProceedToSale = () => {
    const items = Object.values(selectedItems).map(item => ({
      id: item.medication.id,
      name: item.medication.name,
      price: item.medication.price,
      quantity: item.quantity,
      totalCost: item.medication.price * item.quantity,
      category: item.medication.category || 'medications',
      description: item.medication.description || item.medication.name,
      type: 'medication',
      stock: item.medication.stock
    }));
    
    onSaleComplete(items);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Multi-Select Inventory Sale</h3>
              <p className="text-orange-100 text-sm mt-1">
                Select multiple medications for bulk sale
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Found {filteredMedications.length} medications
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Available Medications */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-4">
                Available Medications ({filteredMedications.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMedications.map((medication) => {
                  const status = getStockStatus(medication.stock);
                  const isSelected = selectedItems[medication.id];
                  
                  return (
                    <div key={medication.id} className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h5 className="font-medium text-gray-900">{medication.name}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              Stock: {medication.stock}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {medication.category || 'Uncategorized'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="font-medium text-green-600">KES {medication.price.toLocaleString()}</span>
                            </div>
                            {medication.description && (
                              <span className="text-gray-600">{medication.description}</span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleItemSelection(medication)}
                          className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4 inline mr-1" />
                              Selected
                            </>
                          ) : (
                            'Select'
                          )}
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(medication.id, isSelected.quantity - 0.5)}
                                className="bg-red-100 hover:bg-red-200 text-red-600 w-6 h-6 rounded text-xs flex items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max={medication.stock}
                                value={isSelected.quantity}
                                onChange={(e) => updateQuantity(medication.id, parseFloat(e.target.value) || 0.5)}
                                className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                              <button
                                onClick={() => updateQuantity(medication.id, Math.min(medication.stock, isSelected.quantity + 0.5))}
                                className="bg-green-100 hover:bg-green-200 text-green-600 w-6 h-6 rounded text-xs flex items-center justify-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium text-green-600">
                              KES {(medication.price * isSelected.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {filteredMedications.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No medications found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Items Summary */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Selected Items ({Object.keys(selectedItems).length})
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {Object.keys(selectedItems).length > 0 ? (
                  <div className="space-y-3">
                    {Object.values(selectedItems).map((item) => (
                      <div key={item.medication.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.medication.name}</span>
                          <button
                            onClick={() => toggleItemSelection(item.medication)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium text-green-600">
                              KES {(item.medication.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                          KES {getTotalValue().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No items selected</p>
                    <p className="text-gray-400 text-xs">Select medications from the left</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t mt-6">
            <button
              onClick={handleProceedToSale}
              disabled={Object.keys(selectedItems).length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Proceed to Sale - KES {getTotalValue().toLocaleString()}</span>
            </button>
            <button
              onClick={() => setSelectedItems({})}
              disabled={Object.keys(selectedItems).length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}