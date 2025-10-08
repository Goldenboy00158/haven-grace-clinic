import React, { useState, useEffect } from 'react';
import { Package, Users, FileText, BarChart3, Menu, X, Settings as SettingsIcon, Stethoscope, Heart, Bot, TrendingDown, Activity } from 'lucide-react';
import InventoryManagement from './components/InventoryManagement';
import PatientManagement from './components/PatientManagement';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard';
import RealTimeShareableView from './components/RealTimeShareableView';
import Settings from './components/Settings';
import ServicesManagement from './components/ServicesManagement';
import FamilyPlanningServices from './components/FamilyPlanningServices';
import AIAssistant from './components/AIAssistant';
import DailyExpenses from './components/DailyExpenses';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ReviewModeToggle from './components/ReviewModeToggle';
import EnhancedShareLinkGenerator from './components/EnhancedShareLinkGenerator';
import QuickPrintButton from './components/QuickPrintButton';
import MedicalDocumentGenerator from './components/MedicalDocumentGenerator';
import QuickSaleButton from './components/QuickSaleButton';
import TCACalculator from './components/TCACalculator';
import EnhancedPatientServicesModal from './components/EnhancedPatientServicesModal';
import CombinedSalesModal from './components/CombinedSalesModal';
import EnhancedInvoicePrinter from './components/EnhancedInvoicePrinter';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);
  const [documentPatient, setDocumentPatient] = useState<any>(null);
  const [showPatientServices, setShowPatientServices] = useState<any>(null);
  const [showTCACalculator, setShowTCACalculator] = useState<any>(null);
  const [showCombinedSale, setShowCombinedSale] = useState<any>(null);
  const [showInvoicePrinter, setShowInvoicePrinter] = useState(false);

  // Check if this is a shared view
  const urlPath = window.location.pathname;
  const isSharedView = urlPath.startsWith('/share/');
  const shareId = isSharedView ? urlPath.split('/share/')[1].split('?')[0] : null;

  // If it's a shared view, render the RealTimeShareableView component
  if (isSharedView && shareId) {
    return <RealTimeShareableView shareId={shareId} />;
  }

  // Listen for navigation events from Settings
  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    return () => {
      window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    };
  }, []);

  // Listen for document generator events
  useEffect(() => {
    const handleOpenDocumentGenerator = (event: CustomEvent) => {
      setDocumentPatient(event.detail || null);
      setShowDocumentGenerator(true);
    };

    const handleOpenCombinedSale = (event: CustomEvent) => {
      setShowCombinedSale(event.detail || null);
    };

    window.addEventListener('open-document-generator', handleOpenDocumentGenerator as EventListener);
    window.addEventListener('open-combined-sale', handleOpenCombinedSale as EventListener);
    return () => {
      window.removeEventListener('open-document-generator', handleOpenDocumentGenerator as EventListener);
      window.removeEventListener('open-combined-sale', handleOpenCombinedSale as EventListener);
    };
  }, []);
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'services', name: 'Services', icon: Stethoscope },
    { id: 'family-planning', name: 'Family Planning', icon: Heart },
    { id: 'transactions', name: 'Transactions', icon: FileText },
    { id: 'expenses', name: 'Daily Expenses', icon: TrendingDown },
    { id: 'analytics', name: 'Analytics', icon: Activity },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Bot },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const getContextForPrint = () => {
    switch (activeTab) {
      case 'inventory': return 'inventory';
      case 'patients': return 'patients';
      case 'transactions': return 'transactions';
      case 'dashboard': return 'dashboard';
      default: return undefined;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} isReviewMode={isReviewMode} onShowShare={() => setShowShareModal(true)} />;
      case 'inventory':
        return <InventoryManagement isReviewMode={isReviewMode} />;
      case 'patients':
        return <PatientManagement isReviewMode={isReviewMode} />;
      case 'services':
        return <ServicesManagement isReviewMode={isReviewMode} />;
      case 'family-planning':
        return <FamilyPlanningServices isReviewMode={isReviewMode} />;
      case 'transactions':
        return <TransactionHistory isReviewMode={isReviewMode} />;
      case 'expenses':
        return <DailyExpenses isReviewMode={isReviewMode} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings isReviewMode={isReviewMode} />;
      default:
        return <Dashboard onNavigate={handleNavigate} isReviewMode={isReviewMode} onShowShare={() => setShowShareModal(true)} />;
    }
  };

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
                <p className="text-sm text-gray-600">Medical Inventory & Patient Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Invoice Printer Button */}
              <button
                onClick={() => setShowInvoicePrinter(true)}
                className="hidden md:flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
                title="Print Invoice/Receipt"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Print Invoice</span>
              </button>

              {/* Print Button */}
              <QuickPrintButton
                variant="icon"
                context={getContextForPrint()}
                className="hidden md:block"
              />

              {/* Review Mode Toggle */}
              <ReviewModeToggle
                isReviewMode={isReviewMode}
                onToggle={() => setIsReviewMode(!isReviewMode)}
                className="hidden md:flex"
              />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
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

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white rounded-lg shadow-lg mt-2">
              {/* Print Button for Mobile */}
              <div className="p-4 border-b">
                <QuickPrintButton 
                  variant="button" 
                  context={getContextForPrint()}
                  className="w-full justify-center"
                />
              </div>

              {/* Review Mode Toggle for Mobile */}
              <div className="p-4 border-b">
                <ReviewModeToggle 
                  isReviewMode={isReviewMode} 
                  onToggle={() => setIsReviewMode(!isReviewMode)}
                  className="w-full justify-center"
                />
              </div>
              
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>

      {/* Floating Print Button */}
      <QuickPrintButton 
        variant="fab" 
        context={getContextForPrint()}
      />

      {/* Floating Quick Sale Button */}
      <QuickSaleButton variant="fab" />

      {/* Enhanced Share Modal */}
      {showShareModal && (
        <EnhancedShareLinkGenerator onClose={() => setShowShareModal(false)} />
      )}

      {/* Medical Document Generator */}
      {showDocumentGenerator && (
        <MedicalDocumentGenerator 
          onClose={() => {
            setShowDocumentGenerator(false);
            setDocumentPatient(null);
          }}
          preselectedMethod={showTCACalculator?.preselectedMethod}
          administrationDate={showTCACalculator?.administrationDate}
          patient={showTCACalculator?.patient}
          preselectedPatient={documentPatient}
        />
      )}

      {/* Combined Sale Modal */}
      {showCombinedSale && (
        <CombinedSalesModal
          onClose={() => setShowCombinedSale(null)}
          onSaleComplete={(items, totalAmount, paymentMethod, customerInfo) => {
            // Handle sale completion
            console.log('Sale completed:', { items, totalAmount, paymentMethod, customerInfo });
            setShowCombinedSale(null);
          }}
          preselectedItems={showCombinedSale?.preselectedItems}
        />
      )}

      {/* Enhanced Invoice Printer */}
      {showInvoicePrinter && (
        <EnhancedInvoicePrinter
          onClose={() => setShowInvoicePrinter(false)}
        />
      )}
    </div>
  );
}

export default App;