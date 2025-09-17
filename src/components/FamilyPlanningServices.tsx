import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Heart, Baby, Shield, Users, Pill, Save, X, Clock, Activity, Calculator } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FamilyPlanningService {
  id: string;
  name: string;
  price: number;
  category: 'contraceptive_implant' | 'iud' | 'injection' | 'emergency' | 'counseling';
  description: string;
  duration?: number; // in minutes
  effectiveness?: string;
  protection?: string;
  requirements?: string[];
}

export default function FamilyPlanningServices({ isReviewMode = false }: FamilyPlanningServicesProps) {
  const [services, setServices] = useLocalStorage<FamilyPlanningService[]>('clinic-fp-services', [
    {
      id: "1",
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
      id: "2",
      name: "Contraceptive Implant Removal",
      price: 1500,
      category: "contraceptive_implant",
      description: "Safe removal of contraceptive implant",
      duration: 15,
      effectiveness: "Safe removal procedure",
      requirements: ["Local anesthetic", "Surgical instruments", "Antiseptic"]
    },
    {
      id: "3",
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
      id: "4",
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
      id: "5",
      name: "IUD Removal",
      price: 1200,
      category: "iud",
      description: "Safe removal of intrauterine device",
      duration: 15,
      effectiveness: "Safe removal procedure",
      requirements: ["Speculum", "IUD removal forceps", "Antiseptic"]
    },
    {
      id: "6",
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
      id: "7",
      name: "Emergency Contraception",
      price: 300,
      category: "emergency",
      description: "Emergency contraceptive pill administration and counseling",
      duration: 10,
      effectiveness: "85% effective within 72 hours",
      requirements: ["Emergency contraceptive pill", "Patient education materials"]
    },
    {
      id: "8",
      name: "Family Planning Counseling",
      price: 500,
      category: "counseling",
      description: "Comprehensive contraceptive counseling and education",
      duration: 30,
      effectiveness: "Informed decision making",
      requirements: ["Educational materials", "Contraceptive samples", "Privacy"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<FamilyPlanningService | null>(null);
  const [newService, setNewService] = useState<Omit<FamilyPlanningService, 'id'>>({
    name: '',
    price: 0,
    category: 'counseling',
    description: '',
    duration: 30,
    effectiveness: '',
    protection: '',
    requirements: []
  });

  const categories = [
    { value: 'contraceptive_implant', label: 'Contraceptive Implants' },
    { value: 'iud', label: 'IUD Services' },
    { value: 'injection', label: 'Injectable Contraceptives' },
    { value: 'emergency', label: 'Emergency Contraception' },
    { value: 'counseling', label: 'Counseling & Education' }
  ];

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'contraceptive_implant': return Shield;
      case 'iud': return Heart;
      case 'injection': return Activity;
      case 'emergency': return Pill;
      case 'counseling': return Users;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contraceptive_implant': return 'bg-purple-100 text-purple-800';
      case 'iud': return 'bg-pink-100 text-pink-800';
      case 'injection': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'counseling': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddService = () => {
    const service: FamilyPlanningService = {
      id: Date.now().toString(),
      ...newService,
      requirements: newService.requirements || []
    };
    setServices(prev => [service, ...prev]);
    resetForm();
  };

  const handleEditService = (service: FamilyPlanningService) => {
    setEditingService(service);
    setNewService(service);
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    setServices(prev => prev.map(service => 
      service.id === editingService.id ? { ...newService, id: editingService.id } : service
    ));
    resetForm();
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setNewService({
      name: '',
      price: 0,
      category: 'counseling',
      description: '',
      duration: 30,
      effectiveness: '',
      protection: '',
      requirements: []
    });
    setShowAddModal(false);
  };

  const addRequirement = () => {
    setNewService(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setNewService(prev => ({
      ...prev,
      requirements: prev.requirements?.map((req, i) => i === index ? value : req) || []
    }));
  };

  const removeRequirement = (index: number) => {
    setNewService(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  // Group services by category
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, FamilyPlanningService[]>);

  const categoryNames = categories.reduce((acc, cat) => {
    acc[cat.value] = cat.label;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Heart className="h-6 w-6 mr-2 text-pink-600" />
            Family Planning Services
          </h2>
          <p className="text-gray-600">Comprehensive reproductive health services and contraceptive care</p>
        </div>
        {!isReviewMode && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search family planning services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {categoryNames[category] || category}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
              {categoryServices.length} services
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service) => {
              const Icon = getServiceIcon(service.category);
              return (
                <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow border-l-4 border-pink-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex space-x-2">
                      {!isReviewMode && (
                        <>
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-pink-600">KES {service.price.toLocaleString()}</span>
                      {service.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{service.duration} min</span>
                        </div>
                      )}
                    </div>

                    {service.effectiveness && (
                      <div className="bg-green-50 p-2 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">{service.effectiveness}</p>
                      </div>
                    )}

                    {service.protection && (
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Protection:</strong> {service.protection}
                        </p>
                      </div>
                    )}

                    {service.requirements && service.requirements.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Requirements:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {service.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {req}
                            </li>
                          ))}
                          {service.requirements.length > 3 && (
                            <li className="text-gray-500">+{service.requirements.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No family planning services found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddModal && !isReviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Family Planning Service'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newService.duration || 30}
                    onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effectiveness</label>
                  <input
                    type="text"
                    value={newService.effectiveness || ''}
                    onChange={(e) => setNewService(prev => ({ ...prev, effectiveness: e.target.value }))}
                    placeholder="e.g., 99% effective"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protection Duration</label>
                  <input
                    type="text"
                    value={newService.protection || ''}
                    onChange={(e) => setNewService(prev => ({ ...prev, protection: e.target.value }))}
                    placeholder="e.g., 3 years, 3 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newService.requirements?.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="e.g., Contraceptive implant, Local anesthetic"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingService ? handleSaveEdit : handleAddService}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingService ? 'Save Changes' : 'Add Service'}</span>
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}