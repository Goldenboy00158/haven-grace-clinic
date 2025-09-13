import React from 'react';
import { Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isEnabled: boolean;
  lastSaveTime: Date | null;
  hasUnsavedChanges: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export default function AutoSaveIndicator({ 
  isEnabled, 
  lastSaveTime, 
  hasUnsavedChanges, 
  onToggle, 
  className = '' 
}: AutoSaveIndicatorProps) {
  const getStatusIcon = () => {
    if (!isEnabled) return <Save className="h-3 w-3 text-gray-400" />;
    if (hasUnsavedChanges) return <Clock className="h-3 w-3 text-yellow-500" />;
    if (lastSaveTime) return <CheckCircle className="h-3 w-3 text-green-500" />;
    return <AlertCircle className="h-3 w-3 text-blue-500" />;
  };

  const getStatusText = () => {
    if (!isEnabled) return 'Auto-save disabled';
    if (hasUnsavedChanges) return 'Saving...';
    if (lastSaveTime) return `Saved ${lastSaveTime.toLocaleTimeString()}`;
    return 'Auto-save enabled';
  };

  const getStatusColor = () => {
    if (!isEnabled) return 'text-gray-500';
    if (hasUnsavedChanges) return 'text-yellow-600';
    if (lastSaveTime) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Auto-save</span>
      </label>
      
      <div className={`flex items-center space-x-1 text-xs ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    </div>
  );
}