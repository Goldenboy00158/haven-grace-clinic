import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, DollarSign, Calendar, User, Package, CheckCircle, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Transaction, Patient } from '../types';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'patient' | 'general'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'confirmed'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.id.includes(searchTerm);
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDate = transactionDate >= startDate && transactionDate <= endDate;
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterStatus, dateRange]);

  const stats = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
    const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;
    const confirmedTransactions = filteredTransactions.filter(t => t.status === 'confirmed').length;
    const patientTransactions = filteredTransactions.filter(t => t.type === 'patient').length;
    const generalTransactions = filteredTransactions.filter(t => t.type === 'general').length;

    return {
      totalRevenue,
      completedTransactions,
      pendingTransactions,
      confirmedTransactions,
      patientTransactions,
      generalTransactions
    };
  }, [filteredTransactions]);

  const confirmPayment = (transactionId: string) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === transactionId 
        ? { 
            ...transaction, 
            status: 'confirmed',
            paymentConfirmed: true,
            confirmedBy: 'Admin', // In a real app, this would be the current user
            confirmedAt: new Date().toISOString()
          }
        : transaction
    ));
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Patient/Customer', 'Items', 'Amount (KES)', 'Payment Method', 'Status', 'Confirmed By', 'Confirmed At'],
      ...filteredTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString(),
        transaction.type,
        transaction.patientName || 'General Customer',
        transaction.items.length.toString(),
        transaction.totalAmount.toFixed(2),
        transaction.paymentMethod,
        transaction.status,
        transaction.confirmedBy || '',
        transaction.confirmedAt ? new Date(transaction.confirmedAt).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600">Track all sales and patient transactions</p>
        </div>
        <button
          onClick={exportData}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">KES {stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{stats.completedTransactions}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{stats.confirmedTransactions}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{stats.patientTransactions}</div>
          <div className="text-sm text-gray-600">Patient Sales</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <Package className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-indigo-600">{stats.generalTransactions}</div>
          <div className="text-sm text-gray-600">General Sales</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="patient">Patient</option>
            <option value="general">General</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
              setDateRange({ start: '', end: '' });
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Items</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
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
                    <div className="text-sm text-gray-500">
                      {transaction.items.slice(0, 2).map(item => item.medicationName).join(', ')}
                      {transaction.items.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    KES {transaction.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600 capitalize">
                    {transaction.paymentMethod}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                    {transaction.confirmedBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        By: {transaction.confirmedBy}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {transaction.status === 'completed' && !transaction.paymentConfirmed && (
                      <button
                        onClick={() => confirmPayment(transaction.id)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Confirm Payment</span>
                      </button>
                    )}
                    {transaction.status === 'confirmed' && (
                      <span className="text-green-600 text-sm font-medium">✓ Confirmed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}