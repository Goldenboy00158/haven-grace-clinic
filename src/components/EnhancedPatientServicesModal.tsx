import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingCart, Heart, Stethoscope, Activity, Users, Pill, Shield, Baby, Filter, DollarSign, Percent, CreditCard, Smartphone, Clock, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Transaction } from '../types';
import DiscountModal from './DiscountModal';
import PaymentMethodModal from './PaymentMethodModal';

interface ClinicalService {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  duration?: number;
  requirements?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

interface FamilyPlanningService {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  duration?: number;
  effectiveness?: string;
  protection?: string;
  requirements?: string[];
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalCost: number;
  originalPrice?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountReason?: string;
  category: string;
  description: string;
}

interface EnhancedPatientServicesModalProps {
  patient: Patient;
  onClose: () => void;
  onChargePatient: (services: any[], totalAmount: number, paymentMethod: string, transactionId?: string) => void;
}

export default function EnhancedPatientServicesModal({ patient, onClose, onChargePatient }: EnhancedPatientServicesModalProps) {
  const [clinicalServices] = useLocalStorage<ClinicalService[]>('clinic-clinical-services', [
    {
      id: "1",
      name: "Random Blood Sugar (RBS)",
      price: 300,
      category: "diagnostics",
      description: "Point-of-care blood glucose testing",
      duration: 5,
      requirements: ["Glucometer", "Test strips", "Lancets"]
    },
    {
      id: "2", 
      name: "Blood Pressure Monitoring",
      price: 200,
      category: "diagnostics",
      description: "Blood pressure measurement and assessment",
      duration: 10,
      requirements: ["Sphygmomanometer", "Stethoscope"]
    },
    {
      id: "3",
      name: "Wound Dressing - Minor",
      price: 400,
      category: "procedures",
      description: "Basic wound cleaning and dressing for minor wounds",
      severity: "mild",
      duration: 15,
      requirements: ["Sterile gauze", "Antiseptic", "Medical tape"]
    },
    {
      id: "4",
      name: "Wound Dressing - Moderate",
      price: 600,
      category: "procedures", 
      description: "Comprehensive wound care for moderate wounds",
      severity: "moderate",
      duration: 25,
      requirements: ["Sterile gauze", "Antiseptic", "Medical tape", "Saline solution"]
    },
    {
      id: "5",
      name: "Suturing - Simple",
      price: 800,
      category: "procedures",
      description: "Simple suturing for minor lacerations",
      severity: "mild",
      duration: 20,
      requirements: ["Suture material", "Needle holder", "Forceps", "Local anesthetic"]
    },
    {
      id: "6",
      name: "Suturing - Complex",
      price: 1500,
      category: "procedures",
      description: "Complex suturing for deep or extensive lacerations",
      severity: "severe",
      duration: 45,
      requirements: ["Suture material", "Needle holder", "Forceps", "Local anesthetic", "Surgical instruments"]
    },
    {
      id: "7",
      name: "Incision & Drainage (I&D)",
      price: 1200,
      category: "procedures",
      description: "Incision and drainage of abscesses",
      severity: "moderate",
      duration: 30,
      requirements: ["Surgical blade", "Local anesthetic", "Drainage materials", "Antibiotics"]
    },
    {
      id: "8",
      name: "General Consultation",
      price: 500,
      category: "consultations",
      description: "Comprehensive medical examination and consultation",
      duration: 30
    }
  ]);
  
  const [fpServices] = useLocalStorage<FamilyPlanningService[]>('clinic-fp-services', [
    {
      id: "fp1",
      name: "Contraceptive Implant Insertion",
      price: 2500,
      category: "contraceptive_implant",
      description: "Insertion of subdermal contraceptive implant (3-year protection)",
      duration: 20,
      effectiveness: "99.9% effective",
      protection: "3 years",
      requirements: ["Contraceptive implant", "Local anesthetic", "Sterile insertion kit", "Antiseptic"]
    },
    {
      id: "fp2",
      name: "Contraceptive Implant Removal",
      price: 1500,
      category: "contraceptive_implant",
      description: "Safe removal of contraceptive implant",
      duration: 15,
      effectiveness: "Safe removal procedure",
      requirements: ["Local anesthetic", "Surgical instruments", "Antiseptic"]
    },
    {
      id: "fp3",
      name: "IUD Insertion - Copper T",
      price: 3000,
      category: "iud",
      description: "Insertion of Copper T IUD (10-year protection)",
      duration: 25,
      effectiveness: "99.2% effective",
      protection: "10 years",
      requirements: ["Copper T IUD", "Speculum", "Tenaculum", "Uterine sound", "Antiseptic"]
    },
    {
      id: "fp4",
      name: "IUD Insertion - Hormonal (Mirena)",
      price: 8000,
      category: "iud",
      description: "Insertion of hormonal IUD (5-year protection)",
      duration: 25,
      effectiveness: "99.8% effective",
      protection: "5 years",
      requirements: ["Hormonal IUD", "Speculum", "Tenaculum", "Uterine sound", "Antiseptic"]
    },
    {
      id: "fp5",
      name: "IUD Removal",
      price: 1200,
      category: "iud",
      description: "Safe removal of intrauterine device",
      duration: 15,
      effectiveness: "Safe removal procedure",
      requirements: ["Speculum", "IUD removal forceps", "Antiseptic"]
    },
    {
      id: "fp6",
      name: "Depo-Provera Injection",
      price: 800,
      category: "injection",
      description: "3-monthly contraceptive injection",
      duration: 10,
      effectiveness: "99% effective",
      protection: "3 months",
      requirements: ["Depo-Provera injection", "Syringe", "Antiseptic"]
    },
    {
      id: "fp7",
      name: "Emergency Contraception",
      price: 300,
      category: "emergency",
      description: "Emergency contraceptive pill administration and counseling",
      duration: 10,
      effectiveness: "85% effective within 72 hours",
      requirements: ["Emergency contraceptive pill", "Patient education materials"]
    },
    {
      id: "fp8",
      name: "Family Planning Counseling",
      price: 500,
      category: "counseling",
      description: "Comprehensive contraceptive counseling and education",
      duration: 30,
      effectiveness: "Informed decision making",
      requirements: ["Educational materials", "Contraceptive samples", "Privacy"]
    }
  ]);
  
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountModal, setShowDiscountModal] = useState<ServiceItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<'clinical' | 'family_planning'>('clinical');

  // Combine all services based on patient gender and active tab
  const allServices = useMemo(() => {
    let services: any[] = [];
    
    if (activeServiceTab === 'clinical') {
      services = clinicalServices.map(service => ({
        ...service,
        serviceType: 'clinical'
      }));
    } else if (activeServiceTab === 'family_planning') {
      // Only show family planning services for female patients
      if (patient.gender === 'female') {
        services = fpServices.map(fp => ({
          ...fp,
          serviceType: 'family_planning'
        }));
      }
    }
    
    return services;
  }, [clinicalServices, fpServices, patient.gender, activeServiceTab]);

  // Get unique categories for current tab
  const categories = useMemo(() => {
    const cats = new Set(allServices.map(service => service.category));
    return Array.from(cats).sort();
  }, [allServices]);

  // Filter services
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange.min && service.price < parseFloat(priceRange.min)) matchesPrice = false;
      if (priceRange.max && service.price > parseFloat(priceRange.max)) matchesPrice = false;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allServices, searchTerm, selectedCategory, priceRange]);

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'contraceptive_implant': return Shield;
      case 'iud': return Heart;
      case 'injection': return Activity;
      case 'emergency': return Pill;
      case 'counseling': return Users;
      case 'diagnostics': return Activity;
      case 'procedures': return Stethoscope;
      case 'consultations': return Users;
      default: return Stethoscope;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contraceptive_implant': return 'bg-purple-100 text-purple-800';
      case 'iud': return 'bg-pink-100 text-pink-800';
      case 'injection': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'counseling': return 'bg-green-100 text-green-800';
      case 'diagnostics': return 'bg-blue-100 text-blue-800';
      case 'procedures': return 'bg-purple-100 text-purple-800';
      case 'consultations': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addServiceToSelection = (service: any) => {
    const existingService = selectedServices.find(s => s.id === service.id);
    if (!existingService) {
      setSelectedServices(prev => [...prev, {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        totalCost: service.price,
        category: service.category,
        description: service.description
      }]);
    }
  };

  const removeServiceFromSelection = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeServiceFromSelection(serviceId);
    } else {
      setSelectedServices(prev => prev.map(service => 
        service.id === serviceId ? { 
          ...service, 
          quantity, 
          totalCost: (service.originalPrice || service.price) * quantity 
        } : service
      ));
    }
  };

  const applyDiscount = (serviceId: string, discountType: 'percentage' | 'fixed', discountValue: number) => {
    setSelectedServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const originalPrice = service.originalPrice || service.price;
        let discountedPrice = originalPrice;
        
        if (discountType === 'percentage') {
          discountedPrice = originalPrice - (originalPrice * discountValue / 100);
        } else {
          discountedPrice = Math.max(0, originalPrice - discountValue);
        }
        
        return {
          ...service,
          originalPrice: originalPrice,
          price: discountedPrice,
          totalCost: discountedPrice * service.quantity,
          discountType,
          discountValue
        };
      }
      return service;
    }));
  };

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.totalCost, 0);
  const totalSavings = selectedServices.reduce((sum, service) => {
    if (service.originalPrice) {
      return sum + ((service.originalPrice - service.price) * service.quantity);
    }
    return sum;
  }, 0);

  const handlePaymentComplete = (paymentMethod: 'cash' | 'mpesa' | 'card', transactionId?: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'patient',
      patientId: patient.id,
      patientName: patient.name,
      items: selectedServices.map(service => ({
        medicationId: service.id,
        medicationName: service.name,
        quantity: service.quantity,
        dosage: '',
        frequency: '',
        duration: 0,
        instructions: service.description,
        price: service.price,
        totalCost: service.totalCost
      })),
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod,
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);
    onChargePatient(selectedServices, totalAmount, paymentMethod, transactionId);
    setShowPaymentModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Available Services for {patient.name}
              </h3>
              <div className="flex items-center space-x-4 text-blue-100 text-sm mt-1">
                <span>Age: {patient.age}</span>
                <span>Gender: {patient.gender}</span>
                {patient.gender === 'female' && (
                  <span className="bg-pink-500 px-2 py-1 rounded-full text-xs">
                    <Heart className="h-3 w-3 inline mr-1" />
                    Family Planning Available
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Service Type Tabs */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveServiceTab('clinical')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center ${
                  activeServiceTab === 'clinical'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                <span>Clinical Services</span>
              </button>
              {patient.gender === 'female' && (
                <button
                  onClick={() => setActiveServiceTab('family_planning')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center ${
                    activeServiceTab === 'family_planning'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Family Planning</span>
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price (KES)"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Max Price (KES)"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Found {filteredServices.length} services</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange({ min: '', max: '' });
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Available Services */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-4">
                Available {activeServiceTab === 'family_planning' ? 'Family Planning' : 'Clinical'} Services
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => {
                  const Icon = getServiceIcon(service.category);
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  
                  return (
                    <div key={service.id} className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <h5 className="font-medium text-gray-900">{service.name}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                              {service.category.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="font-medium text-green-600">KES {service.price.toLocaleString()}</span>
                            </div>
                            {service.duration && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{service.duration} min</span>
                              </div>
                            )}
                            {service.effectiveness && (
                              <div className="text-green-600 font-medium">
                                {service.effectiveness}
                              </div>
                            )}
                          </div>

                          {service.requirements && service.requirements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Requirements: {service.requirements.slice(0, 2).join(', ')}
                                {service.requirements.length > 2 && '...'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => addServiceToSelection(service)}
                          disabled={isSelected}
                          className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isSelected ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {filteredServices.length === 0 && (
                  <div className="text-center py-8">
                    <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {patient.gender !== 'female' && activeServiceTab === 'family_planning' 
                        ? 'Family planning services are only available for female patients.'
                        : 'No services found matching your criteria.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Services */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">Selected Services</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedServices.length > 0 ? (
                  <div className="space-y-3">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{service.name}</span>
                          <button
                            onClick={() => removeServiceFromSelection(service.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateServiceQuantity(service.id, service.quantity - 1)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded text-xs"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{service.quantity}</span>
                              <button
                                onClick={() => updateServiceQuantity(service.id, service.quantity + 1)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded text-xs"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              {service.originalPrice && (
                                <div className="text-xs text-gray-500 line-through">
                                  KES {(service.originalPrice * service.quantity).toLocaleString()}
                                </div>
                              )}
                              <span className="font-medium text-green-600">
                                KES {service.totalCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setShowDiscountModal(service)}
                              className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                              <Percent className="h-3 w-3" />
                              <span>Discount</span>
                            </button>
                          </div>
                          
                          {service.discountValue && (
                            <div className="text-xs text-green-600 bg-green-50 p-1 rounded">
                              {service.discountType === 'percentage' ? `${service.discountValue}% off` : `KES ${service.discountValue} off`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3 space-y-2">
                      {totalSavings > 0 && (
                        <div className="flex justify-between items-center text-sm text-green-600">
                          <span>Total Savings:</span>
                          <span>KES {totalSavings.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                          KES {totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No services selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t mt-6">
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={selectedServices.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Proceed to Payment - KES {totalAmount.toLocaleString()}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Discount Modal */}
        {showDiscountModal && (
          <DiscountModal
            item={showDiscountModal}
            onApplyDiscount={applyDiscount}
            onClose={() => setShowDiscountModal(null)}
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentMethodModal
            totalAmount={totalAmount}
            onPaymentComplete={handlePaymentComplete}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </div>
  );
}