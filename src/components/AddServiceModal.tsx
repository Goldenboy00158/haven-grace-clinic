import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Service } from '../types';

interface AddServiceModalProps {
  onSave: (service: Omit<Service, 'id'>) => void;
  onClose: () => void;
}

export default function AddServiceModal({ onSave, onClose }: AddServiceModalProps) {
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    price: 0,
    category: 'general_medicine',
    description: ''
  });

  const handleSave = () => {
    if (!newService.name || newService.price <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Service</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newService.price}
              onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newService.category}
              onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general_medicine">General Medicine</option>
              <option value="diagnostics">Diagnostics</option>
              <option value="procedures">Procedures</option>
              <option value="consultations">Consultations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Add Service</span>
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