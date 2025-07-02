import React, { useState } from 'react';
import { Bot, Calculator, Pill, Heart, Activity, Send, Lightbulb, FileText, Users } from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'User';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your medical AI assistant. I can help you with:\n\n• Dosage calculations\n• Drug interactions\n• BMI calculations\n• Medical reference information\n• Clinical decision support\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const quickActions = [
    {
      icon: Calculator,
      title: 'Dosage Calculator',
      description: 'Calculate medication dosages',
      prompt: 'Help me calculate dosage for a patient'
    },
    {
      icon: Pill,
      title: 'Drug Interactions',
      description: 'Check drug interactions',
      prompt: 'Check drug interactions between medications'
    },
    {
      icon: Heart,
      title: 'BMI Calculator'include in patient page,
      description: 'Calculate BMI and assess',
      prompt: 'Calculate BMI for a patient'
    },
    {
      icon: Activity,
      title: 'Vital Signs',
      description: 'Interpret vital signs',
      prompt: 'Help me interpret these vital signs'
    },
    {
      icon: FileText,
      title: 'Clinical Guidelines',
      description: 'Get clinical guidelines',
      prompt: 'Provide clinical guidelines for'
    },
    {
      icon: Users,
      title: 'Patient Assessment',
      description: 'Patient assessment help',
      prompt: 'Help me assess a patient with'
    }
  ];

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
      const aiResponse = generateAIResponse(message);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Dosage calculations
    if (lowerMessage.includes('dosage') || lowerMessage.includes('dose')) {
      return `**Dosage Calculation Guidelines:**

For accurate dosage calculations, I need:
• Patient weight (kg)
• Patient age
• Medication name
• Indication

**Common Formulas:**
• Pediatric: mg/kg/day
• Adult: Standard adult dose
• Elderly: Often 50-75% of adult dose

**Example:**
Paracetamol for children: 10-15 mg/kg every 4-6 hours
Max: 60 mg/kg/day

Please provide specific patient details for precise calculations.`;
    }

    // BMI calculations
    if (lowerMessage.includes('bmi')) {
      return `**BMI Calculation:**

Formula: BMI = Weight (kg) ÷ Height² (m²)

**BMI Categories:**
• Underweight: < 18.5
• Normal: 18.5 - 24.9
• Overweight: 25.0 - 29.9
• Obese Class I: 30.0 - 34.9
• Obese Class II: 35.0 - 39.9
• Obese Class III: ≥ 40.0

**Example:**
Weight: 70kg, Height: 1.75m
BMI = 70 ÷ (1.75)² = 22.9 (Normal)

Provide weight and height for calculation.`;
    }

    // Drug interactions
    if (lowerMessage.includes('interaction') || lowerMessage.includes('drug')) {
      return `**Drug Interaction Checker:**

**Major Interactions to Watch:**
• Warfarin + Aspirin (bleeding risk)
• ACE inhibitors + NSAIDs (kidney function)
• Digoxin + Diuretics (electrolyte imbalance)
• Metformin + Contrast agents (lactic acidosis)

**Always Check:**
• Liver metabolism (CYP450)
• Kidney excretion
• Protein binding
• Therapeutic window

Please specify the medications you want to check for interactions.`;
    }

    // Vital signs
    if (lowerMessage.includes('vital') || lowerMessage.includes('blood pressure') || lowerMessage.includes('temperature')) {
      return `**Vital Signs Reference:**

**Normal Adult Ranges:**
• Blood Pressure: 90-120/60-80 mmHg
• Heart Rate: 60-100 bpm
• Respiratory Rate: 12-20/min
• Temperature: 36.1-37.2°C
• Oxygen Saturation: 95-100%

**Pediatric Ranges Vary by Age:**
• Infants: Higher HR, RR
• Children: Age-adjusted BP

**Red Flags:**
• BP >180/120 (hypertensive crisis)
• Temp >38.5°C (high fever)
• O2 Sat <90% (hypoxemia)

Provide specific values for interpretation.`;
    }

    // Clinical guidelines
    if (lowerMessage.includes('guideline') || lowerMessage.includes('protocol')) {
      return `**Clinical Guidelines Available:**

**Common Conditions:**
• Hypertension Management
• Diabetes Care
• Antibiotic Stewardship
• Pain Management
• Emergency Protocols

**Family Planning:**
• Contraceptive Selection
• IUD Insertion Guidelines
• Emergency Contraception

**Pediatric Care:**
• Vaccination Schedules
• Growth Monitoring
• Fever Management

Please specify the condition or procedure for detailed guidelines.`;
    }

    // Default response
    return `I understand you're asking about "${user}". 

I can help with:
• **Medical Calculations** - Dosages, BMI, fluid requirements
• **Drug Information** - Interactions, contraindications
• **Clinical Guidelines** - Evidence-based protocols
• **Vital Signs** - Normal ranges and interpretation
• **Patient Assessment** - Systematic approaches

Please be more specific about what you need help with, and I'll provide detailed, clinically relevant information.

**Note:** This is for educational purposes. Always verify with current clinical guidelines and consult senior colleagues for patient care decisions.`;
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Medical Assistant</h2>
          <p className="text-gray-600">Get help with calculations, guidelines, and clinical decisions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
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
          <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
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
                  placeholder="Ask me about dosages, drug interactions, guidelines..."
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

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> This AI assistant provides educational information and calculation support. 
            Always verify information with current clinical guidelines and consult with senior medical professionals 
            for patient care decisions. Not a substitute for professional medical judgment.
          </div>
        </div>
      </div>
    </div>
  );
}