import React, { useState, useEffect } from 'react';
import { Package, Users, DollarSign, TrendingUp, AlertTriangle, Activity, Eye, Calendar, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { medications, getStockStatus, getMedicationCategories } from '../data/medications';
import { Patient, Transaction, Medication } from '../types';

interface ShareableViewProps {
  shareId: string;
}

export default function ShareableView({ shareId }: ShareableViewProps) {
  const [medicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">H</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Haven Grace Clinic</h1>
                <p className="text-sm text-gray-600">Read-Only Dashboard View</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">View Only</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
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

              {/* Clinic Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">(555) 123-4567</p>
                        <p className="text-sm text-gray-600">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">info@havengraceclinic.com</p>
                        <p className="text-sm text-gray-600">Response within 24 hours</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">123 Healthcare Avenue</p>
                        <p className="text-sm text-gray-600">Medical District, City 12345</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Mon-Fri: 8AM-6PM</p>
                        <p className="text-sm text-gray-600">Sat: 9AM-4PM | Sun: Emergency Only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
          <p>This is a read-only view of Haven Grace Clinic's dashboard.</p>
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}