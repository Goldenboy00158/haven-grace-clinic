import React, { useState } from 'react';
import { Bot, Calculator, Pill, Heart, Activity, Send, Lightbulb, FileText, Users, Weight, Ruler } from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your simplified medical AI assistant. I can help you with:\n\n• Quick BMI calculations\n• Basic dosage guidance\n• Simple medical references\n• Clinical decision support\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // BMI Calculator State
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [bmiData, setBmiData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'adult'
  });

  const quickActions = [
    {
      icon: Calculator,
      title: 'BMI Calculator',
      description: 'Quick BMI calculation',
      action: () => setShowBMICalculator(true)
    },
    {
      icon: Pill,
      title: 'Dosage Guide',
      description: 'Basic dosage guidance',
      prompt: 'Help me with medication dosage'
    },
    {
      icon: Heart,
      title: 'Vital Signs',
      description: 'Normal ranges guide',
      prompt: 'What are normal vital sign ranges?'
    },
    {
      icon: Activity,
      title: 'Quick Reference',
      description: 'Medical references',
      prompt: 'I need medical reference information'
    }
  ];

  const calculateBMI = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height);
    
    if (!weight || !height) {
      alert('Please enter valid weight and height');
      return;
    }

    const heightInMeters = height > 3 ? height / 100 : height;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    let recommendation = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      recommendation = 'Consider nutritional counseling and weight gain strategies.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      recommendation = 'Maintain current healthy lifestyle and diet.';
    } else if (bmi < 30) {
      category = 'Overweight';
      recommendation = 'Consider lifestyle modifications and dietary changes.';
    } else {
      category = 'Obese';
      recommendation = 'Recommend medical evaluation and weight management program.';
    }

    const result = `**BMI Calculation Result:**

**Patient Details:**
• Weight: ${weight} kg
• Height: ${height > 3 ? height + ' cm' : height + ' m'}
• BMI: ${bmi.toFixed(1)}

**Category:** ${category}

**Clinical Recommendation:**
${recommendation}

**Normal BMI Range:** 18.5 - 24.9

Would you like me to provide more specific guidance based on this BMI result?`;

    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: result,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setShowBMICalculator(false);
    setBmiData({ weight: '', height: '', age: '', gender: 'adult' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateSimpleAIResponse(message);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateSimpleAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple dosage guidance
    if (lowerMessage.includes('dosage') || lowerMessage.includes('dose')) {
      return `**Simple Dosage Guidelines:**

**Common Adult Dosages:**
• Paracetamol: 500-1000mg every 4-6 hours (Max: 4g/day)
• Ibuprofen: 200-400mg every 6-8 hours (Max: 1.2g/day)
• Amoxicillin: 250-500mg every 8 hours

**Pediatric Dosing:**
• Usually calculated by weight (mg/kg)
• Always verify with pediatric guidelines
• Consider age-appropriate formulations

**Remember:** Always check patient allergies and contraindications.`;
    }

    // Vital signs
    if (lowerMessage.includes('vital') || lowerMessage.includes('normal')) {
      return `**Normal Vital Signs (Adults):**

• **Blood Pressure:** 90-120/60-80 mmHg
• **Heart Rate:** 60-100 bpm
• **Temperature:** 36.1-37.2°C
• **Respiratory Rate:** 12-20/min
• **Oxygen Saturation:** 95-100%

**Pediatric ranges vary by age - always use age-specific charts.**

**Red Flags:**
• BP >180/120 or <90/60
• Temp >38.5°C or <35°C
• O2 Sat <90%`;
    }

    // BMI related
    if (lowerMessage.includes('bmi') || lowerMessage.includes('weight')) {
      return `**BMI Quick Reference:**

**Categories:**
• Underweight: <18.5
• Normal: 18.5-24.9
• Overweight: 25-29.9
• Obese: ≥30

**Use the BMI Calculator above for quick calculations!**

**Clinical Notes:**
• BMI doesn't account for muscle mass
• Consider waist circumference for additional assessment
• Age and ethnicity may affect interpretation`;
    }

    // Default simple response
    return `I can help with basic medical guidance. Try asking about:

• **Dosage calculations** - "What's the dose for paracetamol?"
• **Normal ranges** - "What are normal vital signs?"
• **BMI calculations** - Use the calculator above
• **Basic references** - "Normal blood pressure range?"

Keep questions simple and specific for best results!`;
  };

  const handleQuickAction = (action: any) => {
    if (action.action) {
      action.action();
    } else if (action.prompt) {
      setInputMessage(action.prompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Simple AI Medical Assistant</h2>
          <p className="text-gray-600">Quick calculations and basic medical guidance</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tools</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 h-[500px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">AI Assistant Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                  placeholder="Ask about dosages, normal ranges, or use tools above..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BMI Calculator Modal */}
      {showBMICalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                BMI Calculator
              </h3>
              <button
                onClick={() => setShowBMICalculator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={bmiData.weight}
                  onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="number"
                  value={bmiData.height}
                  onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="170 (cm) or 1.7 (m)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Enter in cm (170) or meters (1.7)</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={calculateBMI}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Calculate BMI
                </button>
                <button
                  onClick={() => setShowBMICalculator(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> This simplified AI assistant provides basic guidance only. 
            Always verify with current clinical guidelines and consult with senior medical professionals 
            for patient care decisions.
          </div>
        </div>
      </div>
    </div>
  );
}