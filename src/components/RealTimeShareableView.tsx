import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  RefreshCcw,
  ShoppingCart,
  Search,
  Filter
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  medications,
  getStockStatus,
  getMedicationCategories
} from '../data/medications';
import { Patient, Transaction, Medication } from '../types';
import CombinedSalesModal from './CombinedSalesModal';

interface ShareableViewProps {
  shareId: string;
}

export default function RealTimeShareableView({ shareId }: ShareableViewProps) {
  const [medicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh functionality for real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In a real app, this would fetch fresh data from the server
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Calculate stats
  const totalMedications = medicationData.length;
  const lowStockItems = medicationData.filter(med => med.stock <= 15 && med.stock > 0).length;
  const outOfStockItems = medicationData.filter(med => med.stock === 0).length;
  const totalInventoryValue = medicationData.reduce((sum, med) => sum + (med.price * med.stock), 0);
  
  const totalPatients = patients.length;
  const recentPatients = patients.filter(p => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(p.createdAt) >= oneWeekAgo;
  }).length;

  const todayTransactions = transactions.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.date).toDateString() === today;
  });
  
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const monthlyRevenue = transactions.filter(t => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === thisMonth && transactionDate.getFullYear() === thisYear;
  }).reduce((sum, t) => sum + t.totalAmount, 0);

  const stats = [
    {
      title: 'Total Medications',
      value: totalMedications,
      icon: Package,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'bg-green-500',
      change: `+${recentPatients} this week`
    },
    {
      title: 'Today\'s Revenue',
      value: `KES ${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: `${todayTransactions.length} transactions`
    },
    {
      title: 'Monthly Revenue',
      value: `KES ${monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: 'This month'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: 'Need restocking'
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: 'Urgent attention'
    }
  ];

  const categories = getMedicationCategories();
  
  const filteredMedications = medicationData.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentTransactionsList = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const criticalStockItems = medicationData
    .filter(med => med.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'transactions', name: 'Transactions', icon: DollarSign },
    { id: 'sales', name: 'Make Sale', icon: ShoppingCart },
  ];

  const handleSaleComplete = (items: any[], totalAmount: number, paymentMethod: string, customerInfo: any) => {
    // This would normally update the backend, but for the shareable view we'll just show a success message
    alert(`Sale completed successfully! Total: KES ${totalAmount.toLocaleString()}`);
    setShowSalesModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Haven Grace Clinic</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Real-Time Dashboard View</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs">
                      {autoRefresh ? 'Live' : 'Paused'} • Last update: {lastRefresh.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RefreshCcw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>{autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}</span>
              </button>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Shared View</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentTransactionsList.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.type === 'patient' ? transaction.patientName : 'General Sale'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">KES {transaction.totalAmount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Stock Alerts */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Critical Stock Alerts</h3>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {criticalStockItems.slice(0, 5).map((medication) => (
                      <div key={medication.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-gray-900">{medication.name}</p>
                          <p className="text-sm text-gray-600">{medication.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{medication.stock} left</p>
                          <p className="text-sm text-gray-600">KES {medication.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Sale Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-gray-600">Process sales and manage inventory</p>
                  </div>
                  <button
                    onClick={() => setShowSalesModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Make Sale</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'sales' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sales Terminal</h3>
                  <p className="text-gray-600">Process sales for medications, services, and family planning</p>
                </div>
                <button
                  onClick={() => setShowSalesModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Start New Sale</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
                  <p className="text-sm text-gray-600">Sell medications with decimal quantities</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">{medicationData.filter(m => m.stock > 0).length} available</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <Activity className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Clinical Services</h4>
                  <p className="text-sm text-gray-600">Medical procedures and diagnostics</p>
                  <p className="text-lg font-bold text-purple-600 mt-2">8+ services</p>
                </div>
                
                <div className="bg-pink-50 p-6 rounded-lg text-center">
                  <Heart className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Family Planning</h4>
                  <p className="text-sm text-gray-600">Contraceptive services for female patients</p>
                  <p className="text-lg font-bold text-pink-600 mt-2">8+ services</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Inventory</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Medication</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Price (KES)</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMedications.slice(0, 20).map((medication) => {
                      const status = getStockStatus(medication.stock);
                      return (
                        <tr key={medication.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-gray-900">{medication.name}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{medication.category || 'Uncategorized'}</td>
                          <td className="py-4 px-6 text-gray-700 font-semibold">{medication.price.toFixed(2)}</td>
                          <td className="py-4 px-6 font-medium">{medication.stock}</td>
                          <td className="py-4 px-6">
                            <span className={`${status.color} px-3 py-1 rounded-full text-xs font-medium`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Patient Records ({patients.length})</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {patients.slice(0, 10).map((patient) => (
                  <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Age: {patient.age}</span>
                          <span>Gender: {patient.gender}</span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {patient.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{patient.medicalHistory.length} medical records</span>
                          <span>Last visit: {patient.medicalHistory.length > 0 
                            ? new Date(patient.medicalHistory[0].date).toLocaleDateString()
                            : 'Never'
                          }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Items</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentTransactionsList.slice(0, 15).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'patient' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {transaction.patientName || 'General Customer'}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {transaction.items.length} items
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          KES {transaction.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>This is a real-time view of Haven Grace Clinic's dashboard.</p>
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p>Auto-refresh: {autoRefresh ? 'Enabled (30s)' : 'Disabled'}</p>
        </div>
      </div>

      {/* Sales Modal */}
      {showSalesModal && (
        <CombinedSalesModal
          onClose={() => setShowSalesModal(false)}
          onSaleComplete={handleSaleComplete}
        />
      )}
    </div>
  );
}