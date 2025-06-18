import React, { useState } from 'react';
import { Save, X, Plus, Minus } from 'lucide-react';
import { Medication } from '../types';

interface AddMedicationModalProps {
  onSave: (medication: Omit<Medication, 'id'>) => void;
  onClose: () => void;
}

export default function AddMedicationModal({ onSave, onClose }: AddMedicationModalProps) {
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    costPrice: 0,
    formulations: [''],
    manufacturer: '',
    expiryDate: '',
    batchNumber: ''
  });

  const handleSave = () => {
    if (!newMedication.name || newMedication.price <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(newMedication);
    onClose();
  };

  const addFormulation = () => {
    setNewMedication(prev => ({
      ...prev,
      formulations: [...(prev.formulations || []), '']
    }));
  };

  const removeFormulation = (index: number) => {
    setNewMedication(prev => ({
      ...prev,
      formulations: prev.formulations?.filter((_, i) => i !== index) || []
    }));
  };

  const updateFormulation = (index: number, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      formulations: prev.formulations?.map((form, i) => i === index ? value : form) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Medication</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newMedication.category || ''}
                onChange={(e) => setNewMedication(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (KES)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newMedication.costPrice || 0}
                onChange={(e) => setNewMedication(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (KES) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newMedication.price}
                onChange={(e) => setNewMedication(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={newMedication.stock}
                onChange={(e) => setNewMedication(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={newMedication.manufacturer || ''}
                onChange={(e) => setNewMedication(prev => ({ ...prev, manufacturer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                type="text"
                value={newMedication.batchNumber || ''}
                onChange={(e) => setNewMedication(prev => ({ ...prev, batchNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newMedication.expiryDate || ''}
              onChange={(e) => setNewMedication(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newMedication.description || ''}
              onChange={(e) => setNewMedication(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Available Formulations</label>
              <button
                type="button"
                onClick={addFormulation}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-2">
              {newMedication.formulations?.map((formulation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formulation}
                    onChange={(e) => updateFormulation(index, e.target.value)}
                    placeholder="e.g., Tablets 500mg, Syrup 100ml"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeFormulation(index)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Add Medication</span>
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