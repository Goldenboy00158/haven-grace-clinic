import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Minus, Package, AlertTriangle, TrendingUp, ShoppingCart, User, Users, Edit } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { medications, getStockStatus, getMedicationCategories } from '../data/medications';
import { Medication, Patient, Transaction, SaleItem } from '../types';
import EditMedicationModal from './EditMedicationModal';

export default function InventoryManagement() {
  const [medicationData, setMedicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Sale modal states
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleType, setSaleType] = useState<'general' | 'patient'>('general');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');
  const [customerName, setCustomerName] = useState('');

  const categories = getMedicationCategories();

  const filteredAndSortedMedications = useMemo(() => {
    let filtered = medicationData.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'status':
          aValue = getStockStatus(a.stock).priority;
          bValue = getStockStatus(b.stock).priority;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [medicationData, searchTerm, selectedCategory, sortBy, sortOrder]);

  const stockStats = useMemo(() => {
    const total = medicationData.length;
    const inStock = medicationData.filter(m => m.stock > 15).length;
    const lowStock = medicationData.filter(m => m.stock > 5 && m.stock <= 15).length;
    const critical = medicationData.filter(m => m.stock > 0 && m.stock <= 5).length;
    const outOfStock = medicationData.filter(m => m.stock === 0).length;
    const totalValue = medicationData.reduce((sum, med) => sum + (med.price * med.stock), 0);

    return { total, inStock, lowStock, critical, outOfStock, totalValue };
  }, [medicationData]);

  const updateStock = (medicationId: string, newStock: number) => {
    setMedicationData(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, stock: Math.max(0, newStock) } : med
      )
    );
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowEditModal(true);
  };

  const handleSaveMedication = (updatedMedication: Medication) => {
    setMedicationData(prev => 
      prev.map(med => 
        med.id === updatedMedication.id ? updatedMedication : med
      )
    );
  };

  const addToSale = (medication: Medication) => {
    if (medication.stock === 0) return;
    
    const existingItem = saleItems.find(item => item.medicationId === medication.id);
    if (existingItem) {
      setSaleItems(prev => prev.map(item => 
        item.medicationId === medication.id 
          ? { ...item, quantity: item.quantity + 1, totalCost: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setSaleItems(prev => [...prev, {
        medicationId: medication.id,
        medicationName: medication.name,
        quantity: 1,
        price: medication.price,
        totalCost: medication.price
      }]);
    }
  };

  const updateSaleItemQuantity = (medicationId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSaleItems(prev => prev.filter(item => item.medicationId !== medicationId));
    } else {
      setSaleItems(prev => prev.map(item => 
        item.medicationId === medicationId 
          ? { ...item, quantity: newQuantity, totalCost: newQuantity * item.price }
          : item
      ));
    }
  };

  const completeSale = () => {
    if (saleItems.length === 0) return;

    const totalAmount = saleItems.reduce((sum, item) => sum + item.totalCost, 0);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: saleType,
      patientId: selectedPatient?.id,
      patientName: saleType === 'patient' ? selectedPatient?.name : customerName || 'General Customer',
      items: saleItems.map(item => ({
        medicationId: item.medicationId,
        medicationName: item.medicationName,
        quantity: item.quantity,
        dosage: '',
        frequency: '',
        duration: 0,
        instructions: '',
        price: item.price,
        totalCost: item.totalCost
      })),
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod,
      status: 'completed'
    };

    // Update stock
    setMedicationData(prev => prev.map(med => {
      const saleItem = saleItems.find(item => item.medicationId === med.id);
      if (saleItem) {
        return { ...med, stock: Math.max(0, med.stock - saleItem.quantity) };
      }
      return med;
    }));

    // Save transaction
    setTransactions(prev => [transaction, ...prev]);

    // Reset sale
    setSaleItems([]);
    setSelectedPatient(null);
    setCustomerName('');
    setShowSaleModal(false);
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Category', 'Price (KES)', 'Cost Price (KES)', 'Stock', 'Status', 'Value (KES)', 'Profit Margin (%)'],
      ...filteredAndSortedMedications.map(med => [
        med.name,
        med.category || 'Uncategorized',
        med.price.toFixed(2),
        (med.costPrice || 0).toFixed(2),
        med.stock.toString(),
        getStockStatus(med.stock).label,
        (med.price * med.stock).toFixed(2),
        med.costPrice ? (((med.price - med.costPrice) / med.costPrice) * 100).toFixed(1) : '0'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalSaleAmount = saleItems.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your medication stock and process sales</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSaleModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>New Sale</span>
          </button>
          <button
            onClick={exportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stockStats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{stockStats.inStock}</div>
          <div className="text-sm text-gray-600">Well Stocked</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{stockStats.lowStock}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{stockStats.critical}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <AlertTriangle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-600">{stockStats.outOfStock}</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-lg font-bold text-blue-600">KES {stockStats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
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
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="status">Status</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border border-gray-300 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Medication</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Price (KES)</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Value (KES)</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedMedications.map((medication) => {
                const status = getStockStatus(medication.stock);
                const totalValue = medication.price * medication.stock;
                return (
                  <tr key={medication.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{medication.name}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{medication.category || 'Uncategorized'}</td>
                    <td className="py-4 px-6 text-gray-700 font-semibold">{medication.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateStock(medication.id, medication.stock - 1)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 w-8 h-8 rounded-full text-sm font-bold transition-colors flex items-center justify-center"
                          disabled={medication.stock === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{medication.stock}</span>
                        <button
                          onClick={() => updateStock(medication.id, medication.stock + 1)}
                          className="bg-green-100 hover:bg-green-200 text-green-600 w-8 h-8 rounded-full text-sm font-bold transition-colors flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${status.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-semibold">{totalValue.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditMedication(medication)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => addToSale(medication)}
                          disabled={medication.stock === 0}
                          className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Sale
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedMedications.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No medications found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit Medication Modal */}
      {showEditModal && editingMedication && (
        <EditMedicationModal
          medication={editingMedication}
          onSave={handleSaveMedication}
          onClose={() => {
            setShowEditModal(false);
            setEditingMedication(null);
          }}
        />
      )}

      {/* Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">New Sale</h3>
                <button
                  onClick={() => setShowSaleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Sale Type Selection */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => setSaleType('general')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    saleType === 'general' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>General Sale</span>
                </button>
                <button
                  onClick={() => setSaleType('patient')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    saleType === 'patient' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Patient Sale</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer/Patient Selection */}
              {saleType === 'patient' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                  <select
                    value={selectedPatient?.id || ''}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === e.target.value);
                      setSelectedPatient(patient || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Sale Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sale Items</h4>
                {saleItems.length > 0 ? (
                  <div className="space-y-3">
                    {saleItems.map((item) => (
                      <div key={item.medicationId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.medicationName}</p>
                          <p className="text-sm text-gray-600">KES {item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateSaleItemQuantity(item.medicationId, item.quantity - 1)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 w-8 h-8 rounded-full text-sm font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateSaleItemQuantity(item.medicationId, item.quantity + 1)}
                              className="bg-green-100 hover:bg-green-200 text-green-600 w-8 h-8 rounded-full text-sm font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">KES {item.totalCost}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-blue-600">KES {totalSaleAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No items added to sale. Add items from the inventory table above.</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  {(['cash', 'mpesa', 'card'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        paymentMethod === method 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={completeSale}
                  disabled={saleItems.length === 0 || (saleType === 'patient' && !selectedPatient)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Sale - KES {totalSaleAmount.toLocaleString()}
                </button>
                <button
                  onClick={() => {
                    setSaleItems([]);
                    setSelectedPatient(null);
                    setCustomerName('');
                    setShowSaleModal(false);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}