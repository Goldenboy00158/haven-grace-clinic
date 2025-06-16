import React, { useState } from 'react';
import { Link, Copy, Check, Share, Calendar, Clock } from 'lucide-react';

interface ShareLinkGeneratorProps {
  onClose: () => void;
}

export default function ShareLinkGenerator({ onClose }: ShareLinkGeneratorProps) {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiryDays, setExpiryDays] = useState(7);
  const [includePatients, setIncludePatients] = useState(true);
  const [includeInventory, setIncludeInventory] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);

  const generateShareLink = () => {
    const shareId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Store share configuration in localStorage
    const shareConfig = {
      id: shareId,
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      permissions: {
        patients: includePatients,
        inventory: includeInventory,
        transactions: includeTransactions
      }
    };
    
    localStorage.setItem(`share-${shareId}`, JSON.stringify(shareConfig));
    
    setLinkGenerated(true);
  };

  const shareUrl = linkGenerated 
    ? `${window.location.origin}/share/${Date.now().toString(36)}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Share className="h-5 w-5 mr-2 text-blue-600" />
            Generate Share Link
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {!linkGenerated ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Expiry
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>1 Week</option>
                  <option value={14}>2 Weeks</option>
                  <option value={30}>1 Month</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What to Include
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeInventory}
                    onChange={(e) => setIncludeInventory(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inventory & Stock Levels</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includePatients}
                    onChange={(e) => setIncludePatients(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Patient Records (Anonymized)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeTransactions}
                    onChange={(e) => setIncludeTransactions(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Transaction History</span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This link will provide read-only access to your clinic data. 
                    Recipients cannot modify any information.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={generateShareLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Link className="h-4 w-4" />
              <span>Generate Share Link</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Link Generated!</h4>
              <p className="text-gray-600 mt-2">
                Your shareable link is ready. It will expire in {expiryDays} day{expiryDays > 1 ? 's' : ''}.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Link Details:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Expires: {new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                <li>• Access: Read-only</li>
                <li>• Includes: {[
                  includeInventory && 'Inventory',
                  includePatients && 'Patients',
                  includeTransactions && 'Transactions'
                ].filter(Boolean).join(', ')}</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setLinkGenerated(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Generate New Link
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}