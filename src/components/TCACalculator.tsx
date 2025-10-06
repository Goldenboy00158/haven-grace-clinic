import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Calculator, Heart, Activity } from 'lucide-react';

interface TCACalculatorProps {
  onClose: () => void;
  onSchedule: (tcaDate: string, method: string, nextDue: string, administrationDate: string) => void;
  preselectedMethod?: string;
  administrationDate?: string;
}

export default function TCACalculator({ onClose, onSchedule, preselectedMethod, administrationDate }: TCACalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState(preselectedMethod || '');
  const [clientVisitDate, setClientVisitDate] = useState(administrationDate || new Date().toISOString().split('T')[0]);
  const [calculatedTCA, setCalculatedTCA] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [showCalculation, setShowCalculation] = useState(false);

  const familyPlanningMethods = [
    { 
      id: 'depo', 
      name: 'Depo-Provera Injection', 
      duration: 90, 
      unit: 'days',
      description: '3-monthly contraceptive injection',
      effectiveness: '99% effective'
    },
    { 
      id: 'implant', 
      name: 'Contraceptive Implant', 
      duration: 3, 
      unit: 'years',
      description: 'Subdermal contraceptive implant',
      effectiveness: '99.9% effective'
    },
    { 
      id: 'copper_iud', 
      name: 'Copper T IUD', 
      duration: 10, 
      unit: 'years',
      description: 'Copper intrauterine device',
      effectiveness: '99.2% effective'
    },
    { 
      id: 'hormonal_iud', 
      name: 'Hormonal IUD (Mirena)', 
      duration: 5, 
      unit: 'years',
      description: 'Hormonal intrauterine device',
      effectiveness: '99.8% effective'
    },
    { 
      id: 'pills', 
      name: 'Oral Contraceptive Pills', 
      duration: 30, 
      unit: 'days',
      description: 'Daily contraceptive pills',
      effectiveness: '91% effective with typical use'
    },
    { 
      id: 'patch', 
      name: 'Contraceptive Patch', 
      duration: 7, 
      unit: 'days',
      description: 'Weekly contraceptive patch',
      effectiveness: '91% effective with typical use'
    },
    { 
      id: 'ring', 
      name: 'Vaginal Ring', 
      duration: 21, 
      unit: 'days',
      description: 'Monthly vaginal contraceptive ring',
      effectiveness: '91% effective with typical use'
    }
  ];

  // Auto-calculate when method or date changes
  React.useEffect(() => {
    if (selectedMethod && clientVisitDate) {
      calculateTCA();
    }
  }, [selectedMethod, clientVisitDate]);

  const calculateTCA = () => {
    if (!selectedMethod || !clientVisitDate) return;

    const method = familyPlanningMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    const visitDate = new Date(clientVisitDate);
    let nextDue = new Date(visitDate);

    // Calculate next due date based on method duration from visit date
    if (method.unit === 'days') {
      nextDue.setDate(nextDue.getDate() + method.duration);
    } else if (method.unit === 'years') {
      nextDue.setFullYear(nextDue.getFullYear() + method.duration);
    }

    // TCA is always 3 days before the actual due date for convenience
    const tcaDate = new Date(nextDue);
    tcaDate.setDate(tcaDate.getDate() - 3);

    setCalculatedTCA(tcaDate.toISOString().split('T')[0]);
    setNextDueDate(nextDue.toISOString().split('T')[0]);
    setShowCalculation(true);
  };

  const handleSchedule = () => {
    if (calculatedTCA && selectedMethod && nextDueDate) {
      const method = familyPlanningMethods.find(m => m.id === selectedMethod);
      onSchedule(calculatedTCA, method?.name || selectedMethod, nextDueDate, clientVisitDate);
      onClose();
    }
  };

  const getDaysUntilTCA = () => {
    if (!calculatedTCA) return null;
    const today = new Date();
    const tca = new Date(calculatedTCA);
    const diffTime = tca.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysFromVisit = () => {
    if (!clientVisitDate || !nextDueDate) return null;
    const visit = new Date(clientVisitDate);
    const due = new Date(nextDueDate);
    const diffTime = due.getTime() - visit.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilTCA = getDaysUntilTCA();
  const daysFromVisit = getDaysFromVisit();
  const selectedMethodData = familyPlanningMethods.find(m => m.id === selectedMethod);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-pink-600" />
            Auto TCA Calculator
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Planning Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select method</option>
              {familyPlanningMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name} ({method.duration} {method.unit})
                </option>
              ))}
            </select>
            
            {selectedMethodData && (
              <div className="mt-2 p-3 bg-pink-50 rounded-lg">
                <p className="text-sm text-pink-800">
                  <strong>{selectedMethodData.name}</strong>
                </p>
                <p className="text-xs text-pink-700">{selectedMethodData.description}</p>
                <p className="text-xs text-pink-600 font-medium">{selectedMethodData.effectiveness}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Administration Date (When Service Was Provided)
            </label>
            <input
              type="date"
              value={clientVisitDate}
              onChange={(e) => setClientVisitDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the date the client received the contraceptive service
            </p>
          </div>

          {showCalculation && calculatedTCA && selectedMethodData && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-pink-900">Auto-Calculated TCA Results</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Administration:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(clientVisitDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method Duration:</span>
                    <span className="font-medium text-gray-900">
                      {selectedMethodData.duration} {selectedMethodData.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protection Days:</span>
                    <span className="font-medium text-blue-600">
                      {daysFromVisit} days
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">TCA Date:</span>
                    <span className="font-medium text-pink-600">
                      {new Date(calculatedTCA).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method Expires:</span>
                    <span className="font-medium text-red-600">
                      {new Date(nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {daysUntilTCA !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days to TCA:</span>
                      <span className={`font-medium ${
                        daysUntilTCA < 0 ? 'text-red-600' : 
                        daysUntilTCA <= 7 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {daysUntilTCA < 0 ? `${Math.abs(daysUntilTCA)} overdue` : 
                         daysUntilTCA === 0 ? 'Due today' : `${daysUntilTCA} days`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {daysUntilTCA !== null && daysUntilTCA <= 7 && (
                <div className="flex items-start space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-medium">
                      {daysUntilTCA < 0 ? 'Patient is overdue for follow-up!' : 
                       daysUntilTCA <= 3 ? 'TCA is due soon - contact patient immediately' : 
                       'TCA approaching - prepare reminder call'}
                    </p>
                    <p className="mt-1">
                      Contraceptive protection expires on {new Date(nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
                <div className="flex items-start space-x-2">
                  <Activity className="h-3 w-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Auto-Calculation Logic:</p>
                    <p>
                      From administration date ({new Date(clientVisitDate).toLocaleDateString()}) + 
                      {selectedMethodData.duration} {selectedMethodData.unit} = 
                      expiry ({new Date(nextDueDate).toLocaleDateString()}) - 3 days = 
                      TCA ({new Date(calculatedTCA).toLocaleDateString()})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            {calculatedTCA && (
              <button
                onClick={handleSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule TCA</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div className="flex items-start space-x-2">
            <Calculator className="h-3 w-3 mt-0.5" />
            <div>
              <p className="font-medium">How TCA is Calculated:</p>
              <p>
                1. Start with administration date (when contraceptive was given)<br/>
                2. Add the method's protection duration<br/>
                3. Subtract 3 days for appointment convenience<br/>
                4. Result is the optimal TCA (To Come Again) date
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}