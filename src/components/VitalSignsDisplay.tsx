import React from 'react';
import { Heart, Thermometer, Activity, Wind, Weight, Droplets, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { VitalSigns } from '../types';
import { getVitalSignsInterpretation, VitalSignAssessment } from '../utils/vitalSignsNormals';

interface VitalSignsDisplayProps {
  vitalSigns: VitalSigns;
  patientAge?: number;
  patientGender?: string;
  patientHeight?: number;
  showInterpretation?: boolean;
  compact?: boolean;
}

export default function VitalSignsDisplay({ 
  vitalSigns, 
  patientAge, 
  patientGender, 
  patientHeight,
  showInterpretation = true,
  compact = false 
}: VitalSignsDisplayProps) {
  
  const interpretations = showInterpretation 
    ? getVitalSignsInterpretation(vitalSigns, patientAge, patientGender, patientHeight)
    : {};

  const vitalSignItems = [
    {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      value: vitalSigns.bloodPressure,
      unit: 'mmHg',
      icon: Heart,
      iconColor: 'text-red-600'
    },
    {
      key: 'temperature',
      label: 'Temperature',
      value: vitalSigns.temperature,
      unit: '°C',
      icon: Thermometer,
      iconColor: 'text-orange-600'
    },
    {
      key: 'pulse',
      label: 'Pulse',
      value: vitalSigns.pulse,
      unit: 'bpm',
      icon: Activity,
      iconColor: 'text-green-600'
    },
    {
      key: 'respiratoryRate',
      label: 'Respiratory Rate',
      value: vitalSigns.respiratoryRate,
      unit: '/min',
      icon: Wind,
      iconColor: 'text-blue-600'
    },
    {
      key: 'weight',
      label: 'Weight',
      value: vitalSigns.weight,
      unit: 'kg',
      icon: Weight,
      iconColor: 'text-purple-600'
    },
    {
      key: 'height',
      label: 'Height',
      value: vitalSigns.height,
      unit: 'cm',
      icon: TrendingUp,
      iconColor: 'text-indigo-600'
    },
    {
      key: 'oxygenSaturation',
      label: 'Oxygen Saturation',
      value: vitalSigns.oxygenSaturation,
      unit: '%',
      icon: Droplets,
      iconColor: 'text-cyan-600'
    }
  ];

  const getStatusIcon = (assessment: VitalSignAssessment) => {
    switch (assessment.status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical_low':
      case 'critical_high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (assessment: VitalSignAssessment) => {
    if (assessment.status === 'low' || assessment.status === 'critical_low') {
      return <TrendingDown className="h-3 w-3" />;
    }
    if (assessment.status === 'high' || assessment.status === 'critical_high') {
      return <TrendingUp className="h-3 w-3" />;
    }
    return null;
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {vitalSignItems.filter(item => item.value).map((item) => {
          const Icon = item.icon;
          const assessment = interpretations[item.key] || interpretations.bmi;
          
          return (
            <div key={item.key} className={`p-3 rounded-lg border ${
              assessment ? assessment.bgColor : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
                {assessment && getStatusIcon(assessment)}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
              <div className={`font-semibold ${assessment ? assessment.color : 'text-gray-900'}`}>
                {item.value} {item.unit}
              </div>
              {assessment && (
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {assessment.normalRange}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitalSignItems.filter(item => item.value).map((item) => {
          const Icon = item.icon;
          const assessment = interpretations[item.key] || (item.key === 'weight' ? interpretations.bmi : null);
          
          return (
            <div key={item.key} className={`p-4 rounded-lg border-2 ${
              assessment ? assessment.bgColor : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {assessment && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(assessment)}
                    {getStatusIcon(assessment)}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${assessment ? assessment.color : 'text-gray-900'}`}>
                  {item.value} {item.unit}
                  {item.key === 'weight' && assessment && (
                    <span className="text-sm ml-2">
                      (BMI: {assessment.value})
                    </span>
                  )}
                </div>
                
                {assessment && (
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${assessment.color}`}>
                      {assessment.message}
                    </div>
                    <div className="text-xs text-gray-600">
                      Normal range: {assessment.normalRange}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BMI Display for Weight */}
      {vitalSigns.weight && patientHeight && interpretations.bmi && (
        <div className={`p-4 rounded-lg border-2 ${interpretations.bmi.bgColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Weight className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Body Mass Index (BMI)</span>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(interpretations.bmi)}
              {getStatusIcon(interpretations.bmi)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${interpretations.bmi.color}`}>
              {interpretations.bmi.value}
            </div>
            <div className={`text-sm font-medium ${interpretations.bmi.color}`}>
              {interpretations.bmi.message}
            </div>
            <div className="text-xs text-gray-600">
              Normal range: {interpretations.bmi.normalRange}
            </div>
            <div className="text-xs text-gray-500">
              Calculated from: {vitalSigns.weight}kg, {patientHeight}cm
            </div>
          </div>
        </div>
      )}

      {/* Overall Assessment */}
      {showInterpretation && Object.keys(interpretations).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Vital Signs Assessment
          </h4>
          <div className="space-y-1 text-sm">
            {Object.entries(interpretations).map(([key, assessment]) => {
              const abnormal = assessment.status !== 'normal';
              if (!abnormal) return null;
              
              return (
                <div key={key} className={`flex items-center space-x-2 ${assessment.color}`}>
                  <AlertTriangle className="h-3 w-3" />
                  <span>
                    {key === 'bmi' ? 'BMI' : key.charAt(0).toUpperCase() + key.slice(1)}: {assessment.message}
                  </span>
                </div>
              );
            })}
            
            {Object.values(interpretations).every(a => a.status === 'normal') && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>All vital signs within normal limits</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}