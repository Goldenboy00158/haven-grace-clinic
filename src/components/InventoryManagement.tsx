import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Minus, Package, AlertTriangle, TrendingUp, ShoppingCart, User, Users, Edit, Percent } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { medications, getStockStatus, getMedicationCategories } from '../data/medications';
import { Medication, Patient, Transaction, SaleItem } from '../types';
import EditMedicationModal from './EditMedicationModal';
import AddMedicationModal from './AddMedicationModal';
import CombinedSalesModal from './CombinedSalesModal';
import QuickSaleButton from './QuickSaleButton';

interface InventoryManagementProps {
  isReviewMode?: boolean;
}

export default function InventoryManagement({ isReviewMode = false }: InventoryManagementProps) {
  const [medicationData, setMedicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Sale modal states
  const [showSaleModal, setShowSaleModal] = useState(false);

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

  const handleAddMedication = (newMedication: Omit<Medication, 'id'>) => {
    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication
    };
    setMedicationData(prev => [medication, ...prev]);
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

  const handleSaleComplete = (items: SaleItem[], totalAmount: number, paymentMethod: string, customerInfo: any) => {
    // Update medication stock for medication items
    setMedicationData(prev => prev.map(med => {
      const saleItem = items.find(item => item.id === med.id && item.type === 'medication');
      if (saleItem) {
        return { ...med, stock: Math.max(0, med.stock - saleItem.quantity) };
      }
      return med;
    }));
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: customerInfo.type,
      patientId: customerInfo.patientId,
      patientName: customerInfo.patientName,
      items: items.map(item => ({
        medicationId: item.id,
        medicationName: item.name,
        quantity: item.quantity,
        dosage: '',
        frequency: '',
        duration: 0,
        instructions: item.description,
        price: item.price,
        totalCost: item.totalCost
      })),
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod,
      status: 'completed'
    };

    // Save transaction
    setTransactions(prev => [transaction, ...prev]);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your medication stock and process sales with decimal quantities</p>
        </div>
        <div className="flex space-x-3">
          {!isReviewMode && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
              <button
                onClick={() => setShowSaleModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Combined Sale</span>
              </button>
              <QuickSaleButton className="bg-purple-600 hover:bg-purple-700" />
            </>
          )}
          <button
            onClick={exportData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
                {!isReviewMode && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                )}
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
                        {!isReviewMode && (
                          <>
                            <button
                              onClick={() => updateStock(medication.id, medication.stock - 0.5)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 w-8 h-8 rounded-full text-sm font-bold transition-colors flex items-center justify-center"
                              disabled={medication.stock === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-16 text-center font-medium">{medication.stock}</span>
                            <button
                              onClick={() => updateStock(medication.id, medication.stock + 0.5)}
                              className="bg-green-100 hover:bg-green-200 text-green-600 w-8 h-8 rounded-full text-sm font-bold transition-colors flex items-center justify-center"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {isReviewMode && (
                          <span className="w-16 text-center font-medium">{medication.stock}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${status.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-semibold">{totalValue.toFixed(2)}</td>
                    {!isReviewMode && (
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditMedication(medication)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    )}
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

      {/* Add Medication Modal */}
      {showAddModal && !isReviewMode && (
        <AddMedicationModal
          onSave={handleAddMedication}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Medication Modal */}
      {showEditModal && editingMedication && !isReviewMode && (
        <EditMedicationModal
          medication={editingMedication}
          onSave={handleSaveMedication}
          onClose={() => {
            setShowEditModal(false);
            setEditingMedication(null);
          }}
        />
      )}

      {/* Combined Sale Modal */}
      {showSaleModal && !isReviewMode && (
        <CombinedSalesModal
          onClose={() => setShowSaleModal(false)}
          onSaleComplete={handleSaleComplete}
        />
      )}
    </div>
  );
}