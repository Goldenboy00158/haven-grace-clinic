import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Download, Upload, Trash2, RefreshCw, Package, Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppSettings } from '../types';

interface SettingsProps {
  isReviewMode?: boolean;
}

export default function Settings({ isReviewMode = false }: SettingsProps) {
  const [settings, setSettings] = useLocalStorage<AppSettings>('clinic-settings', {
    clinicName: 'Haven Grace Medical Clinic',
    clinicAddress: 'Zimmerman, Nairobi',
    clinicPhone: ['0719307605', '0725488740'],
    clinicEmail: 'info@havengraceclinic.com',
    currency: 'KES',
    taxRate: 0,
    lowStockThreshold: 15,
    criticalStockThreshold: 5,
    autoBackup: true,
    offlineMode: false
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = () => {
    setSettings(tempSettings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      clinicName: 'Haven Grace Medical Clinic',
      clinicAddress: 'Zimmerman, Nairobi',
      clinicPhone: ['0719307605', '0725488740'],
      clinicEmail: 'info@havengraceclinic.com',
      currency: 'KES',
      taxRate: 0,
      lowStockThreshold: 15,
      criticalStockThreshold: 5,
      autoBackup: true,
      offlineMode: false
    };
    setTempSettings(defaultSettings);
    setSettings(defaultSettings);
    setShowConfirmReset(false);
    alert('Settings reset to default!');
  };

  const exportData = () => {
    const allData = {
      settings,
      medications: localStorage.getItem('clinic-medications'),
      patients: localStorage.getItem('clinic-patients'),
      transactions: localStorage.getItem('clinic-transactions'),
      expenses: localStorage.getItem('clinic-expenses'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) setSettings(data.settings);
        if (data.medications) localStorage.setItem('clinic-medications', data.medications);
        if (data.patients) localStorage.setItem('clinic-patients', data.patients);
        if (data.transactions) localStorage.setItem('clinic-transactions', data.transactions);
        if (data.expenses) localStorage.setItem('clinic-expenses', data.expenses);
        
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Quick navigation functions
  const navigateToTab = (tabName: string) => {
    // This would be connected to the main app navigation
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: tabName }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2 text-blue-600" />
            System Settings
          </h2>
          <p className="text-gray-600">Configure your clinic management system</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          {!isReviewMode && (
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigateToTab('inventory')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
          >
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-600">Inventory Management</p>
            <p className="text-xs text-gray-500">Manage medications & stock</p>
          </button>
          <button
            onClick={() => navigateToTab('patients')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group"
          >
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-green-600">Patient Records</p>
            <p className="text-xs text-gray-500">View & manage patients</p>
          </button>
          <button
            onClick={() => navigateToTab('expenses')}
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors group"
          >
            <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-red-600">Daily Expenses</p>
            <p className="text-xs text-gray-500">Track operational costs</p>
          </button>
          <button
            onClick={() => navigateToTab('transactions')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group"
          >
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-purple-600">Transactions</p>
            <p className="text-xs text-gray-500">View sales & revenue</p>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Clinic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
              <input
                type="text"
                value={tempSettings.clinicName}
                onChange={(e) => setTempSettings(prev => ({ ...prev, clinicName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={tempSettings.clinicAddress}
                onChange={(e) => setTempSettings(prev => ({ ...prev, clinicAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
              <div className="space-y-2">
                {tempSettings.clinicPhone.map((phone, index) => (
                  <input
                    key={index}
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...tempSettings.clinicPhone];
                      newPhones[index] = e.target.value;
                      setTempSettings(prev => ({ ...prev, clinicPhone: newPhones }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isReviewMode}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={tempSettings.clinicEmail}
                onChange={(e) => setTempSettings(prev => ({ ...prev, clinicEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={tempSettings.currency}
                onChange={(e) => setTempSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              >
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={tempSettings.taxRate}
                onChange={(e) => setTempSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                min="1"
                value={tempSettings.lowStockThreshold}
                onChange={(e) => setTempSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 5 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Critical Stock Threshold</label>
              <input
                type="number"
                min="1"
                value={tempSettings.criticalStockThreshold}
                onChange={(e) => setTempSettings(prev => ({ ...prev, criticalStockThreshold: parseInt(e.target.value) || 2 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReviewMode}
              />
            </div>
            {!isReviewMode && (
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.autoBackup}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Auto Backup</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.offlineMode}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, offlineMode: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Offline Mode</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isReviewMode && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </button>
              <button
                onClick={() => setTempSettings(settings)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset Changes</span>
              </button>
            </div>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirm Reset Modal */}
      {showConfirmReset && !isReviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Reset</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all settings to default? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}