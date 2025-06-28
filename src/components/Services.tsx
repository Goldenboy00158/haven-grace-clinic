import React, { useState, useMemo } from 'react';
import { Users, Ban as Bandage, Stethoscope, Activity, Scissors, Droplets, Pill, Search, Filter, Download, AlertTriangle, TrendingUp, Package, Plus, Heart, Baby, Shield } from 'lucide-react';
import { medications, getStockStatus, getMedicationCategories, type Medication } from '../data/medications';
import { services } from '../data/services';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Service } from '../types';
import AddServiceModal from './AddServiceModal';

export default function Services() {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [medicationData, setMedicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [servicesData, setServicesData] = useLocalStorage<Service[]>('clinic-services', services);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const clinicServices = [
    {
      icon: Users,
      title: "Family Planning",
      description: "Comprehensive reproductive health services and family planning counseling.",
      features: ["Contraceptive Counseling", "Pregnancy Testing", "Reproductive Health", "STI Screening"],
      price: "KES 500 - 1,500",
      category: "family_planning"
    },
    {
      icon: Bandage,
      title: "Wound Dressing",
      description: "Professional wound care and dressing services for optimal healing.",
      features: ["Wound Assessment", "Sterile Dressing", "Infection Prevention", "Healing Monitoring"],
      price: "KES 300 - 800",
      category: "procedures"
    },
    {
      icon: Stethoscope,
      title: "Blood Pressure Monitoring",
      description: "Regular BP monitoring and hypertension management services.",
      features: ["24-Hour Monitoring", "Hypertension Management", "Lifestyle Counseling", "Medication Adjustment"],
      price: "KES 200 - 500",
      category: "diagnostics"
    },
    {
      icon: Activity,
      title: "Blood Sugar Monitoring",
      description: "Comprehensive diabetes care and blood glucose monitoring services.",
      features: ["HbA1c Testing", "Glucose Monitoring", "Diabetes Education", "Dietary Counseling"],
      price: "KES 300 - 700",
      category: "diagnostics"
    },
    {
      icon: Scissors,
      title: "Suturing Services",
      description: "Professional wound closure and suturing for cuts and surgical procedures.",
      features: ["Wound Closure", "Surgical Suturing", "Cosmetic Repair", "Post-Op Care"],
      price: "KES 800 - 2,000",
      category: "procedures"
    },
    {
      icon: Droplets,
      title: "Laboratory Services",
      description: "On-site laboratory testing for quick and accurate diagnostic results.",
      features: ["Blood Tests", "Urine Analysis", "Rapid Testing", "Health Screenings"],
      price: "KES 400 - 1,200",
      category: "diagnostics"
    }
  ];

  // Enhanced Family Planning Services
  const familyPlanningServices = [
    {
      icon: Shield,
      title: "Contraceptive Implant Services",
      description: "Long-term contraceptive protection with subdermal implants.",
      features: [
        "Implant Insertion (3-year protection)",
        "Implant Removal",
        "Pre & Post-insertion Counseling",
        "Follow-up Care"
      ],
      price: "Insertion: KES 2,500 | Removal: KES 1,500",
      category: "family_planning",
      details: {
        insertion: {
          duration: "20 minutes",
          requirements: ["Contraceptive implant", "Local anesthetic", "Sterile insertion kit"],
          effectiveness: "99.9% effective for 3 years"
        },
        removal: {
          duration: "15 minutes", 
          requirements: ["Local anesthetic", "Surgical instruments", "Antiseptic"],
          notes: "Safe removal with minimal scarring"
        }
      }
    },
    {
      icon: Heart,
      title: "IUD Services",
      description: "Intrauterine device insertion and removal services.",
      features: [
        "Copper T IUD (10-year protection)",
        "Hormonal IUD (5-year protection)", 
        "IUD Removal",
        "Comprehensive Counseling"
      ],
      price: "Copper T: KES 3,000 | Hormonal: KES 8,000 | Removal: KES 1,200",
      category: "family_planning",
      details: {
        copperT: {
          duration: "25 minutes",
          effectiveness: "99.2% effective for 10 years",
          requirements: ["Copper T IUD", "Speculum", "Tenaculum", "Uterine sound"]
        },
        hormonal: {
          duration: "25 minutes",
          effectiveness: "99.8% effective for 5 years",
          requirements: ["Hormonal IUD", "Speculum", "Tenaculum", "Uterine sound"]
        }
      }
    },
    {
      icon: Baby,
      title: "Injectable Contraceptives",
      description: "3-monthly contraceptive injections for reliable protection.",
      features: [
        "Depo-Provera Injection",
        "3-month Protection",
        "Counseling & Education",
        "Side Effect Management"
      ],
      price: "KES 800 per injection",
      category: "family_planning",
      details: {
        injection: {
          duration: "10 minutes",
          effectiveness: "99% effective for 3 months",
          requirements: ["Depo-Provera injection", "Syringe", "Antiseptic"]
        }
      }
    },
    {
      icon: Pill,
      title: "Emergency Contraception",
      description: "Emergency contraceptive services and counseling.",
      features: [
        "Emergency Contraceptive Pills",
        "Immediate Counseling",
        "Follow-up Care",
        "Future Planning"
      ],
      price: "KES 300",
      category: "family_planning",
      details: {
        emergency: {
          duration: "10 minutes",
          effectiveness: "85% effective within 72 hours",
          requirements: ["Emergency contraceptive pill", "Patient education materials"]
        }
      }
    },
    {
      icon: Users,
      title: "Family Planning Counseling",
      description: "Comprehensive reproductive health counseling and education.",
      features: [
        "Contraceptive Method Selection",
        "Reproductive Health Education",
        "Partner Counseling",
        "Future Planning"
      ],
      price: "KES 500",
      category: "family_planning",
      details: {
        counseling: {
          duration: "30 minutes",
          requirements: ["Educational materials", "Contraceptive samples", "Privacy"],
          benefits: "Informed decision making for reproductive health"
        }
      }
    }
  ];

  const categories = getMedicationCategories();

  const filteredAndSortedMedications = useMemo(() => {
    let filtered = medicationData.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort medications
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'status':
          aValue = getStockStatus(a.stock).priority;
          bValue = getStockStatus(b.stock).priority;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [medicationData, searchTerm, selectedCategory, sortBy, sortOrder]);

  const stockStats = useMemo(() => {
    const total = medicationData.length;
    const inStock = medicationData.filter(m => m.stock > 15).length;
    const lowStock = medicationData.filter(m => m.stock > 5 && m.stock <= 15).length;
    const critical = medicationData.filter(m => m.stock > 0 && m.stock <= 5).length;
    const outOfStock = medicationData.filter(m => m.stock === 0).length;
    const totalValue = medicationData.reduce((sum, med) => sum + (med.price * med.stock), 0);

    return { total, inStock, lowStock, critical, outOfStock, totalValue };
  }, [medicationData]);

  const updateStock = (medicationId: string, newStock: number) => {
    setMedicationData(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, stock: Math.max(0, newStock) } : med
      )
    );
  };

  const handleAddService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      id: Date.now().toString(),
      ...newService
    };
    setServicesData(prev => [service, ...prev]);
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Category', 'Price (KES)', 'Stock', 'Status', 'Value (KES)'],
      ...filteredAndSortedMedications.map(med => [
        med.name,
        med.category || 'Uncategorized',
        med.price.toFixed(2),
        med.stock.toString(),
        getStockStatus(med.stock).label,
        (med.price * med.stock).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            Our Services
          </div>
          <h2 className="text-4xl font-bold text-gray-900">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From primary healthcare to specialized services and pharmacy, we offer complete medical care 
            to meet all your healthcare needs under one roof.
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Clinical Services
            </button>
            <button
              onClick={() => setActiveTab('family-planning')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'family-planning'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Family Planning
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'pharmacy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Pharmacy Inventory
            </button>
          </div>
        </div>

        {/* Clinical Services Grid */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            {/* Add Service Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Default Services */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clinicServices.filter(service => service.category !== 'family_planning').map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                  >
                    <div className="space-y-6">
                      {/* Icon */}
                      <div className="bg-blue-100 group-hover:bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center transition-colors duration-300">
                        <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                          <p className="text-green-700 font-semibold text-sm">{service.price}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button className="w-full bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white py-3 rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg">
                        Book Service
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Services */}
            {servicesData.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Services</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesData.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-gray-600">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">KES {service.price}</span>
                          <span className="text-sm text-gray-500 capitalize">{service.category.replace('_', ' ')}</span>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Family Planning Services */}
        {activeTab === 'family-planning' && (
          <div className="space-y-12">
            {/* Family Planning Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Users className="h-8 w-8 text-pink-600" />
                <h3 className="text-3xl font-bold text-gray-900">Family Planning Services</h3>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive reproductive health services designed to help you make informed decisions 
                about your reproductive future. Our experienced healthcare providers offer personalized 
                care and support for all your family planning needs.
              </p>
            </div>

            {/* Family Planning Services Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {familyPlanningServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-l-4 border-pink-500"
                  >
                    <div className="space-y-6">
                      {/* Icon and Title */}
                      <div className="flex items-start space-x-4">
                        <div className="bg-pink-100 group-hover:bg-pink-600 w-16 h-16 rounded-xl flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                          <Icon className="h-8 w-8 text-pink-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mt-2">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-pink-50 px-4 py-3 rounded-lg">
                        <p className="text-pink-700 font-semibold">{service.price}</p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Services Include:</h4>
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Service Details */}
                      {service.details && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <h4 className="font-semibold text-gray-900">Service Details:</h4>
                          {Object.entries(service.details).map(([key, detail]) => (
                            <div key={key} className="text-sm">
                              <p className="font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                              <ul className="ml-4 space-y-1 text-gray-600">
                                {detail.duration && <li>• Duration: {detail.duration}</li>}
                                {detail.effectiveness && <li>• Effectiveness: {detail.effectiveness}</li>}
                                {detail.benefits && <li>• Benefits: {detail.benefits}</li>}
                                {detail.notes && <li>• Notes: {detail.notes}</li>}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg">
                        Schedule Consultation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Family Planning Information */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Why Choose Our Family Planning Services?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Safe & Effective</h4>
                    <p className="text-gray-600 text-sm">
                      All procedures performed by qualified healthcare professionals using sterile techniques and quality materials.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Personalized Care</h4>
                    <p className="text-gray-600 text-sm">
                      Comprehensive counseling to help you choose the best contraceptive method for your lifestyle and needs.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Ongoing Support</h4>
                    <p className="text-gray-600 text-sm">
                      Follow-up care and support throughout your family planning journey with regular check-ups.
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Book Family Planning Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pharmacy Section */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-8">
            {/* Pharmacy Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Pill className="h-8 w-8 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">Pharmacy Inventory Management</h3>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real-time inventory tracking with stock monitoring, search functionality, and automated alerts.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stockStats.total}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stockStats.inStock}</div>
                <div className="text-sm text-gray-600">Well Stocked</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{stockStats.lowStock}</div>
                <div className="text-sm text-gray-600">Low Stock</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{stockStats.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <AlertTriangle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-600">{stockStats.outOfStock}</div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <div className="text-lg font-bold text-blue-600">KES {stockStats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Controls Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Medication Inventory</h4>
                    <p className="text-blue-100">Real-time stock management system</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-64"
                      />
                    </div>
                    
                    {/* Export Button */}
                    <button
                      onClick={exportData}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white text-gray-900 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white text-gray-900 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock</option>
                      <option value="status">Status</option>
                    </select>
                    
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="bg-white text-gray-900 px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Medication</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Category</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Price (KES)</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Stock</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Value (KES)</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAndSortedMedications.map((medication) => {
                        const status = getStockStatus(medication.stock);
                        const totalValue = medication.price * medication.stock;
                        return (
                          <tr key={medication.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 font-medium text-gray-900">{medication.name}</td>
                            <td className="py-4 px-4 text-gray-600 text-sm">{medication.category || 'Uncategorized'}</td>
                            <td className="py-4 px-4 text-gray-700 font-semibold">{medication.price.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateStock(medication.id, medication.stock - 1)}
                                  className="bg-red-100 hover:bg-red-200 text-red-600 w-6 h-6 rounded text-sm font-bold transition-colors"
                                  disabled={medication.stock === 0}
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-medium">{medication.stock}</span>
                                <button
                                  onClick={() => updateStock(medication.id, medication.stock + 1)}
                                  className="bg-green-100 hover:bg-green-200 text-green-600 w-6 h-6 rounded text-sm font-bold transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`${status.color} px-3 py-1 rounded-full text-xs font-medium`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700 font-semibold">{totalValue.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {filteredAndSortedMedications.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No medications found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-center space-y-4">
                <h5 className="text-xl font-bold text-gray-900">Inventory Management</h5>
                <p className="text-gray-600">
                  Need to restock or add new medications? Use our quick action buttons below.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Add New Medication
                  </button>
                  <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Generate Restock Report
                  </button>
                  <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Bulk Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {showAddServiceModal && (
          <AddServiceModal
            onSave={handleAddService}
            onClose={() => setShowAddServiceModal(false)}
          />
        )}
      </div>
    </section>
  );
}