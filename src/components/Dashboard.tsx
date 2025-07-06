import React from 'react';
import { Package, Users, TrendingUp, AlertTriangle, DollarSign, Activity, Share, TrendingDown, Printer } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { medications } from '../data/medications';
import { Patient, Transaction, Medication, DailyExpense } from '../types';
import QuickPrintButton from './QuickPrintButton';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
  isReviewMode?: boolean;
  onShowShare?: () => void;
}

export default function Dashboard({ onNavigate, isReviewMode, onShowShare }: DashboardProps) {
  const [medicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [expenses] = useLocalStorage<DailyExpense[]>('clinic-expenses', []);

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

  // Calculate today's expenses and net profit
  const todayExpenses = expenses.filter(exp => {
    const today = new Date().toDateString();
    return new Date(exp.date).toDateString() === today;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const todayNetProfit = todayRevenue - todayExpenses;

  const stats = [
    {
      title: 'Total Medications',
      value: totalMedications,
      icon: Package,
      color: 'bg-blue-500',
      change: '+2 this week',
      onClick: () => onNavigate?.('inventory')
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'bg-green-500',
      change: `+${recentPatients} this week`,
      onClick: () => onNavigate?.('patients')
    },
    {
      title: 'Today\'s Revenue',
      value: `KES ${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: `${todayTransactions.length} transactions`,
      onClick: () => onNavigate?.('transactions')
    },
    {
      title: 'Today\'s Expenses',
      value: `KES ${todayExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'bg-red-500',
      change: 'Operational costs',
      onClick: () => onNavigate?.('expenses')
    },
    {
      title: 'Today\'s Net Profit',
      value: `KES ${todayNetProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: todayNetProfit >= 0 ? 'bg-green-500' : 'bg-red-500',
      change: todayNetProfit >= 0 ? 'Profitable day' : 'Loss today',
      onClick: () => onNavigate?.('expenses')
    },
    {
      title: 'Monthly Revenue',
      value: `KES ${monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: 'This month',
      onClick: () => onNavigate?.('transactions')
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: 'Need restocking',
      onClick: () => onNavigate?.('inventory')
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: 'Urgent attention',
      onClick: () => onNavigate?.('inventory')
    }
  ];

  const recentTransactionsList = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const criticalStockItems = medicationData
    .filter(med => med.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header with Share and Print Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor your clinic's performance and key metrics</p>
        </div>
        <div className="flex space-x-3">
          <QuickPrintButton 
            variant="button" 
            context="dashboard"
            className="hidden md:flex"
          />
          {!isReviewMode && onShowShare && (
            <button
              onClick={onShowShare}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Share className="h-4 w-4" />
              <span>Real-time Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.onClick}
            >
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

      {/* Profit Analysis Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Financial Summary</h3>
          <QuickPrintButton 
            variant="icon" 
            context="dashboard"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-green-600">KES {todayRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-2xl font-bold text-red-600">KES {todayExpenses.toLocaleString()}</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${todayNetProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${todayNetProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className={`text-2xl font-bold ${todayNetProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              KES {todayNetProfit.toLocaleString()}
            </p>
          </div>
        </div>
        {todayRevenue > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Profit Margin: <span className={`font-semibold ${todayNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {((todayNetProfit / todayRevenue) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex space-x-2">
              <QuickPrintButton variant="icon" context="transactions" />
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-3">
            {recentTransactionsList.length > 0 ? (
              recentTransactionsList.map((transaction) => (
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
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Critical Stock Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Critical Stock Alerts</h3>
            <div className="flex space-x-2">
              <QuickPrintButton variant="icon" context="inventory" />
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="space-y-3">
            {criticalStockItems.length > 0 ? (
              criticalStockItems.map((medication) => (
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
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">All medications well stocked</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <QuickPrintButton variant="icon" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button 
            onClick={() => onNavigate?.('inventory')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
          >
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">Manage Inventory</p>
          </button>
          <button 
            onClick={() => onNavigate?.('patients')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Patient Records</p>
          </button>
          <button 
            onClick={() => onNavigate?.('expenses')}
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors"
          >
            <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-600">Daily Expenses</p>
          </button>
          <button 
            onClick={() => onNavigate?.('inventory')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">New Sale</p>
          </button>
          <button 
            onClick={() => onNavigate?.('transactions')}
            className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-indigo-600">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}