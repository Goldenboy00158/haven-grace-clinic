import React, { useState, useMemo } from 'react';
import { Plus, DollarSign, Calendar, Receipt, Trash2, Edit, TrendingDown, AlertTriangle, PieChart, Filter, Download, Zap, Package, Utensils, Car, Wrench, Users, MoreHorizontal, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DailyExpense, Transaction } from '../types';

interface DailyExpensesProps {
  isReviewMode?: boolean;
}

export default function DailyExpenses({ isReviewMode = false }: DailyExpensesProps) {
  const [expenses, setExpenses] = useLocalStorage<DailyExpense[]>('clinic-expenses', []);
  const [transactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<DailyExpense | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMonthlyView, setShowMonthlyView] = useState(false);
  
  const [newExpense, setNewExpense] = useState({
    category: 'utilities' as DailyExpense['category'],
    description: '',
    amount: 0,
    paymentMethod: 'cash' as DailyExpense['paymentMethod'],
    receipt: '',
    notes: ''
  });

  const expenseCategories = [
    { 
      id: 'utilities', 
      name: 'Utilities', 
      description: 'Electricity, water, internet, phone',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Zap
    },
    { 
      id: 'supplies', 
      name: 'Medical Supplies', 
      description: 'Medical equipment, consumables, office supplies',
      color: 'bg-blue-100 text-blue-800',
      icon: Package
    },
    { 
      id: 'food', 
      name: 'Staff Food', 
      description: 'Meals, snacks, beverages for staff',
      color: 'bg-green-100 text-green-800',
      icon: Utensils
    },
    { 
      id: 'transport', 
      name: 'Transport', 
      description: 'Fuel, taxi, delivery costs',
      color: 'bg-purple-100 text-purple-800',
      icon: Car
    },
    { 
      id: 'maintenance', 
      name: 'Maintenance', 
      description: 'Equipment repair, facility maintenance',
      color: 'bg-orange-100 text-orange-800',
      icon: Wrench
    },
    { 
      id: 'staff', 
      name: 'Staff Expenses', 
      description: 'Allowances, training, uniforms',
      color: 'bg-indigo-100 text-indigo-800',
      icon: Users
    },
    { 
      id: 'other', 
      name: 'Other', 
      description: 'Miscellaneous operational expenses',
      color: 'bg-gray-100 text-gray-800',
      icon: MoreHorizontal
    }
  ];

  // Filter expenses by selected date and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesDate = expense.date === selectedDate;
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      return matchesDate && matchesCategory;
    });
  }, [expenses, selectedDate, selectedCategory]);

  // Calculate monthly expenses
  const monthlyExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses]);

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const dailyExpenses = expenses.filter(exp => exp.date === selectedDate);
    const dailyTransactions = transactions.filter(trans => {
      const transDate = new Date(trans.date).toISOString().split('T')[0];
      return transDate === selectedDate && trans.status === 'completed';
    });

    const totalExpenses = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = dailyTransactions.reduce((sum, trans) => sum + trans.totalAmount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Expenses by category
    const expensesByCategory = dailyExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      totalRevenue,
      netProfit,
      expensesByCategory,
      transactionCount: dailyTransactions.length,
      expenseCount: dailyExpenses.length
    };
  }, [expenses, transactions, selectedDate]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenseTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyTransactions = transactions.filter(trans => {
      const transDate = new Date(trans.date);
      return transDate.getMonth() === currentMonth && 
             transDate.getFullYear() === currentYear && 
             trans.status === 'completed';
    });
    
    const monthlyRevenue = monthlyTransactions.reduce((sum, trans) => sum + trans.totalAmount, 0);
    const monthlyNetProfit = monthlyRevenue - monthlyExpenseTotal;

    // Monthly expenses by category
    const monthlyExpensesByCategory = monthlyExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses: monthlyExpenseTotal,
      totalRevenue: monthlyRevenue,
      netProfit: monthlyNetProfit,
      expensesByCategory: monthlyExpensesByCategory,
      transactionCount: monthlyTransactions.length,
      expenseCount: monthlyExpenses.length
    };
  }, [monthlyExpenses, transactions]);

  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const expense: DailyExpense = {
      id: Date.now().toString(),
      date: selectedDate,
      category: newExpense.category,
      description: newExpense.description,
      amount: newExpense.amount,
      paymentMethod: newExpense.paymentMethod,
      receipt: newExpense.receipt,
      notes: newExpense.notes,
      addedBy: 'Current User', // In a real app, this would be the logged-in user
      addedAt: new Date().toISOString()
    };

    setExpenses(prev => [expense, ...prev]);
    resetForm();
  };

  const handleEditExpense = (expense: DailyExpense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      receipt: expense.receipt || '',
      notes: expense.notes || ''
    });
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingExpense) return;

    const updatedExpense: DailyExpense = {
      ...editingExpense,
      category: newExpense.category,
      description: newExpense.description,
      amount: newExpense.amount,
      paymentMethod: newExpense.paymentMethod,
      receipt: newExpense.receipt,
      notes: newExpense.notes
    };

    setExpenses(prev => prev.map(exp => 
      exp.id === editingExpense.id ? updatedExpense : exp
    ));
    resetForm();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    }
  };

  const resetForm = () => {
    setNewExpense({
      category: 'utilities',
      description: '',
      amount: 0,
      paymentMethod: 'cash',
      receipt: '',
      notes: ''
    });
    setEditingExpense(null);
    setShowAddModal(false);
  };

  const exportExpenses = () => {
    const dataToExport = showMonthlyView ? monthlyExpenses : filteredExpenses;
    const csvContent = [
      ['Date', 'Category', 'Description', 'Amount (KES)', 'Payment Method', 'Added By', 'Notes'],
      ...dataToExport.map(expense => [
        expense.date,
        expense.category,
        expense.description,
        expense.amount.toFixed(2),
        expense.paymentMethod,
        expense.addedBy,
        expense.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${showMonthlyView ? 'monthly' : selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category?.icon || MoreHorizontal;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gray-100 text-gray-800';
  };

  const currentTotals = showMonthlyView ? monthlyTotals : dailyTotals;
  const currentExpenses = showMonthlyView ? monthlyExpenses : filteredExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingDown className="h-6 w-6 mr-2 text-red-600" />
            Daily Expenses Management
          </h2>
          <p className="text-gray-600">Track daily operational expenses and calculate net profit</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMonthlyView(!showMonthlyView)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              showMonthlyView 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showMonthlyView ? 'Monthly View' : 'Daily View'}</span>
          </button>
          <button
            onClick={exportExpenses}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          {!isReviewMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Date and Category Filters */}
      {!showMonthlyView && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {expenseCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showMonthlyView ? 'Monthly Revenue' : 'Daily Revenue'}
              </p>
              <p className="text-2xl font-bold text-green-600">KES {currentTotals.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{currentTotals.transactionCount} transactions</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showMonthlyView ? 'Monthly Expenses' : 'Daily Expenses'}
              </p>
              <p className="text-2xl font-bold text-red-600">KES {currentTotals.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{currentTotals.expenseCount} expenses</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${currentTotals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {currentTotals.netProfit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {currentTotals.netProfit >= 0 ? 'Profit' : 'Loss'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${currentTotals.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <PieChart className={`h-6 w-6 ${currentTotals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className={`text-2xl font-bold ${currentTotals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentTotals.totalRevenue > 0 
                  ? `${((currentTotals.netProfit / currentTotals.totalRevenue) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
              <p className="text-sm text-gray-500">Revenue efficiency</p>
            </div>
            <div className={`p-3 rounded-lg ${currentTotals.netProfit >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <AlertTriangle className={`h-6 w-6 ${currentTotals.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expenses by Category {showMonthlyView ? '(This Month)' : `(${new Date(selectedDate).toLocaleDateString()})`}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {expenseCategories.map(category => {
            const Icon = category.icon;
            const amount = currentTotals.expensesByCategory[category.id] || 0;
            const percentage = currentTotals.totalExpenses > 0 
              ? ((amount / currentTotals.totalExpenses) * 100).toFixed(1)
              : '0';
            
            return (
              <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-flex p-3 rounded-lg mb-2 ${category.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-lg font-bold text-gray-900">KES {amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {showMonthlyView 
              ? `Monthly Expenses (${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`
              : `Expenses for ${new Date(selectedDate).toLocaleDateString()}`
            }
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Added By</th>
                {!isReviewMode && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentExpenses.map((expense) => {
                const Icon = getCategoryIcon(expense.category);
                return (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900 capitalize">
                          {expense.category.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        {expense.notes && (
                          <p className="text-sm text-gray-500">{expense.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      KES {expense.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-gray-600">{expense.paymentMethod}</span>
                      {expense.receipt && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Receipt className="h-3 w-3 mr-1" />
                          Receipt available
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div>
                        <p>{expense.addedBy}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(expense.addedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    {!isReviewMode && (
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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
        
        {currentExpenses.length === 0 && (
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No expenses recorded for this {showMonthlyView ? 'month' : 'date'}.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddModal && !isReviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Electricity token, Office supplies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={newExpense.receipt}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, receipt: e.target.value }))}
                  placeholder="Receipt or reference number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingExpense ? handleSaveEdit : handleAddExpense}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {editingExpense ? 'Save Changes' : 'Add Expense'}
                </button>
                <button
                  onClick={resetForm}
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