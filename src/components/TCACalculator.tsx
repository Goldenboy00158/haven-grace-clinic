import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Calculator } from 'lucide-react';

interface TCACalculatorProps {
  onClose: () => void;
  onSchedule: (tcaDate: string, method: string, nextDue: string) => void;
}

export default function TCACalculator({ onClose, onSchedule }: TCACalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [clientVisitDate, setClientVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculatedTCA, setCalculatedTCA] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [showCalculation, setShowCalculation] = useState(false);

  const familyPlanningMethods = [
    { id: 'depo', name: 'Depo-Provera Injection', duration: 90, unit: 'days' },
    { id: 'implant', name: 'Contraceptive Implant', duration: 3, unit: 'years' },
    { id: 'copper_iud', name: 'Copper T IUD', duration: 10, unit: 'years' },
    { id: 'hormonal_iud', name: 'Hormonal IUD (Mirena)', duration: 5, unit: 'years' },
    { id: 'pills', name: 'Oral Contraceptive Pills', duration: 30, unit: 'days' },
    { id: 'patch', name: 'Contraceptive Patch', duration: 7, unit: 'days' },
    { id: 'ring', name: 'Vaginal Ring', duration: 21, unit: 'days' }
  ];

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
      onSchedule(calculatedTCA, method?.name || selectedMethod, nextDueDate);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-pink-600" />
            TCA Calculator
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Visit Date (Starting Point)
            </label>
            <input
              type="date"
              value={clientVisitDate}
              onChange={(e) => setClientVisitDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the date the client visited/received the service
            </p>
          </div>

          <button
            onClick={calculateTCA}
            disabled={!selectedMethod || !clientVisitDate}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate TCA
          </button>

          {showCalculation && calculatedTCA && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-pink-900">TCA Results</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visit Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(clientVisitDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method Duration:</span>
                  <span className="font-medium text-gray-900">
                    {daysFromVisit} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TCA Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(calculatedTCA).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Due:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(nextDueDate).toLocaleDateString()}
                  </span>
                </div>
                {daysUntilTCA !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Until TCA:</span>
                    <span className={`font-medium ${
                      daysUntilTCA < 0 ? 'text-red-600' : 
                      daysUntilTCA <= 7 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {daysUntilTCA < 0 ? `${Math.abs(daysUntilTCA)} days overdue` : 
                       daysUntilTCA === 0 ? 'Due today' : `${daysUntilTCA} days`}
                    </span>
                  </div>
                )}
              </div>

              {daysUntilTCA !== null && daysUntilTCA <= 7 && (
                <div className="flex items-start space-x-2 bg-yellow-50 p-2 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    {daysUntilTCA < 0 ? 'Patient is overdue for follow-up' : 
                     daysUntilTCA <= 3 ? 'TCA is due soon - contact patient' : 
                     'TCA approaching - prepare reminder'}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                <strong>Calculation Logic:</strong> TCA is set 3 days before the actual due date 
                ({new Date(nextDueDate).toLocaleDateString()}) for appointment scheduling convenience.
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            {calculatedTCA && (
              <button
                onClick={handleSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Schedule TCA
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

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>How it works:</strong> Enter the date the client visited/received the service. 
          The system calculates when the method expires and sets the TCA 3 days before for convenience.
        </div>
      </div>
    </div>
  );
}