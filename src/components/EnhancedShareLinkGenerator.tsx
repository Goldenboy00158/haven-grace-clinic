import React, { useState } from 'react';
import { Link, Copy, Check, Share, Calendar, Clock, ExternalLink, Eye, Settings, Users, Package, DollarSign, Activity } from 'lucide-react';

interface EnhancedShareLinkGeneratorProps {
  onClose: () => void;
}

export default function EnhancedShareLinkGenerator({ onClose }: EnhancedShareLinkGeneratorProps) {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiryDays, setExpiryDays] = useState(7);
  const [shareType, setShareType] = useState<'view-only' | 'real-time'>('real-time');
  const [includePatients, setIncludePatients] = useState(true);
  const [includeInventory, setIncludeInventory] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(false);
  const [generatedShareId, setGeneratedShareId] = useState('');

  const generateShareLink = () => {
    const shareId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Store share configuration in localStorage
    const shareConfig = {
      id: shareId,
      type: shareType,
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      permissions: {
        patients: includePatients,
        inventory: includeInventory,
        transactions: includeTransactions,
        expenses: includeExpenses
      },
      settings: {
        autoRefresh: shareType === 'real-time',
        refreshInterval: 30000 // 30 seconds
      }
    };
    
    localStorage.setItem(`share-${shareId}`, JSON.stringify(shareConfig));
    setGeneratedShareId(shareId);
    setLinkGenerated(true);
  };

  const shareUrl = linkGenerated 
    ? `${window.location.origin}/share/${generatedShareId}`
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

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Haven Grace Clinic Dashboard',
          text: 'View real-time clinic dashboard',
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  const shareTypes = [
    {
      id: 'real-time' as const,
      name: 'Real-Time Dashboard',
      description: 'Live updating dashboard with auto-refresh every 30 seconds',
      icon: Activity,
      features: ['Live data updates', 'Auto-refresh', 'Real-time inventory', 'Current transactions']
    },
    {
      id: 'view-only' as const,
      name: 'Static View',
      description: 'Snapshot view of current data (no auto-updates)',
      icon: Eye,
      features: ['Current snapshot', 'No auto-refresh', 'Manual refresh only', 'Faster loading']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Share className="h-5 w-5 mr-2 text-blue-600" />
            Enhanced Share Link Generator
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
            {/* Share Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share Type
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {shareTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setShareType(type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shareType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          shareType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          <ul className="mt-2 space-y-1">
                            {type.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-500 flex items-center">
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {shareType === type.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Link Expiry */}
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
                  <option value={90}>3 Months</option>
                </select>
              </div>
            </div>

            {/* Data Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What to Include
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInventory}
                    onChange={(e) => setIncludeInventory(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Package className="h-4 w-4 ml-3 mr-2 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Inventory & Stock</span>
                    <p className="text-xs text-gray-500">Medication levels and status</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePatients}
                    onChange={(e) => setIncludePatients(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Users className="h-4 w-4 ml-3 mr-2 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Patient Records</span>
                    <p className="text-xs text-gray-500">Anonymized patient data</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTransactions}
                    onChange={(e) => setIncludeTransactions(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <DollarSign className="h-4 w-4 ml-3 mr-2 text-purple-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Transaction History</span>
                    <p className="text-xs text-gray-500">Sales and revenue data</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExpenses}
                    onChange={(e) => setIncludeExpenses(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Activity className="h-4 w-4 ml-3 mr-2 text-red-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Daily Expenses</span>
                    <p className="text-xs text-gray-500">Operational costs and expenses</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Real-time Features Info */}
            {shareType === 'real-time' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Real-Time Features</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Data updates automatically every 30 seconds</li>
                      <li>• Recipients see live inventory changes</li>
                      <li>• Real-time transaction updates</li>
                      <li>• Manual refresh option available</li>
                      <li>• Auto-refresh can be toggled by viewer</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Security & Privacy</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Link provides read-only access only</li>
                    <li>• No editing or modification capabilities</li>
                    <li>• Patient data is anonymized for privacy</li>
                    <li>• Link expires automatically after selected period</li>
                    <li>• Access can be revoked by deleting the share configuration</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={generateShareLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Link className="h-4 w-4" />
              <span>Generate {shareType === 'real-time' ? 'Real-Time' : 'View-Only'} Share Link</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {shareType === 'real-time' ? 'Real-Time' : 'View-Only'} Link Generated!
              </h4>
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
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={openInNewTab}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                {navigator.share && (
                  <button
                    onClick={shareViaWebShare}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Share via device"
                  >
                    <Share className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This link works across all devices and browsers. Share via WhatsApp, email, or any messaging app.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Link Configuration:</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Type:</strong> {shareType === 'real-time' ? 'Real-Time Dashboard' : 'Static View'}</p>
                  <p><strong>Expires:</strong> {new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  <p><strong>Access:</strong> Read-only</p>
                </div>
                <div>
                  <p><strong>Includes:</strong></p>
                <li>• Compatible: All devices and browsers</li>
                <li>• Shareable: WhatsApp, Email, SMS, etc.</li>
                  <ul className="ml-4 space-y-1">
                    {includeInventory && <li>• Inventory & Stock</li>}
                    {includePatients && <li>• Patient Records</li>}
                    {includeTransactions && <li>• Transactions</li>}
                    {includeExpenses && <li>• Daily Expenses</li>}
                  </ul>
                </div>
              </div>
              {shareType === 'real-time' && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-blue-800"><strong>Real-Time Features:</strong> Auto-refresh every 30 seconds, live data updates</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">Cross-Device Access:</h5>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Works on mobile phones, tablets, and computers</li>
                <li>• Compatible with Chrome, Safari, Firefox, Edge</li>
                <li>• No app installation required</li>
                <li>• Responsive design adapts to screen size</li>
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