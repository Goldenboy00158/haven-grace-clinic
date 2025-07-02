import React from 'react';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface ReviewModeToggleProps {
  isReviewMode: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ReviewModeToggle({ isReviewMode, onToggle, className = '' }: ReviewModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
        isReviewMode
          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
          : 'bg-green-100 text-green-700 hover:bg-green-200'
      } ${className}`}
    >
      {isReviewMode ? (
        <>
          <Lock className="h-4 w-4" />
          <span>Review Mode</span>
        </>
      ) : (
        <>
          <Unlock className="h-4 w-4" />
          <span>Edit Mode</span>
        </>
      )}
    </button>
  );
}</parameter>