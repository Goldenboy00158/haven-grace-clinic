import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Activity, Heart, Bandage, Scissors, Droplets, Stethoscope, Eye, Save, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Service } from '../types';

interface ClinicalService extends Service {
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: number; // in minutes
  requirements?: string[];
}

export default function ServicesManagement() {
  const [services, setServices] = useLocalStorage<ClinicalService[]>('clinic-clinical-services', [
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
      name: "Wound Dressing - Severe",
      price: 1000,
      category: "procedures",
      description: "Advanced wound care for severe or infected wounds",
      severity: "severe", 
      duration: 45,
      requirements: ["Sterile gauze", "Antiseptic", "Medical tape", "Saline solution", "Antibiotics", "Pain medication"]
    },
    {
      id: "6",
      name: "Suturing - Simple",
      price: 800,
      category: "procedures",
      description: "Simple suturing for minor lacerations",
      severity: "mild",
      duration: 20,
      requirements: ["Suture material", "Needle holder", "Forceps", "Local anesthetic"]
    },
    {
      id: "7",
      name: "Suturing - Complex",
      price: 1500,
      category: "procedures",
      description: "Complex suturing for deep or extensive lacerations",
      severity: "severe",
      duration: 45,
      requirements: ["Suture material", "Needle holder", "Forceps", "Local anesthetic", "Surgical instruments"]
    },
    {
      id: "8",
      name: "Suture Removal",
      price: 300,
      category: "procedures",
      description: "Safe removal of sutures",
      duration: 10,
      requirements: ["Suture removal kit", "Antiseptic"]
    },
    {
      id: "9",
      name: "Incision & Drainage (I&D) - Simple",
      price: 1200,
      category: "procedures",
      description: "Simple incision and drainage of abscesses",
      severity: "moderate",
      duration: 30,
      requirements: ["Surgical blade", "Local anesthetic", "Drainage materials", "Antibiotics"]
    },
    {
      id: "10",
      name: "Incision & Drainage (I&D) - Complex",
      price: 2000,
      category: "procedures",
      description: "Complex incision and drainage procedures",
      severity: "severe",
      duration: 60,
      requirements: ["Surgical instruments", "Local anesthetic", "Drainage materials", "Antibiotics", "Surgical sutures"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ClinicalService | null>(null);
  const [newService, setNewService] = useState<Omit<ClinicalService, 'id'>>({
    name: '',
    price: 0,
    category: 'procedures',
    description: '',
    severity: 'mild',
    duration: 15,
    requirements: []
  });

  const categories = ['diagnostics', 'procedures', 'consultations'];
  const severityLevels = ['mild', 'moderate', 'severe'];

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('blood pressure') || serviceName.toLowerCase().includes('bp')) return Heart;
    if (serviceName.toLowerCase().includes('blood sugar') || serviceName.toLowerCase().includes('rbs')) return Droplets;
    if (serviceName.toLowerCase().includes('wound')) return Bandage;
    if (serviceName.toLowerCase().includes('sutur')) return Scissors;
    if (serviceName.toLowerCase().includes('i&d') || serviceName.toLowerCase().includes('incision')) return Scissors;
    return Stethoscope;
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddService = () => {
    const service: ClinicalService = {
      id: Date.now().toString(),
      ...newService,
      requirements: newService.requirements || []
    };
    setServices(prev => [service, ...prev]);
    setNewService({
      name: '',
      price: 0,
      category: 'procedures',
      description: '',
      severity: 'mild',
      duration: 15,
      requirements: []
    });
    setShowAddModal(false);
  };

  const handleEditService = (service: ClinicalService) => {
    setEditingService(service);
    setNewService(service);
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    setServices(prev => prev.map(service => 
      service.id === editingService.id ? { ...newService, id: editingService.id } : service
    ));
    setEditingService(null);
    setNewService({
      name: '',
      price: 0,
      category: 'procedures',
      description: '',
      severity: 'mild',
      duration: 15,
      requirements: []
    });
    setShowAddModal(false);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinical Services Management</h2>
          <p className="text-gray-600">Manage clinical procedures and diagnostic services</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = getServiceIcon(service.name);
          return (
            <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex space-x-2">
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
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">KES {service.price}</span>
                  {service.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(service.severity)}`}>
                      {service.severity}
                    </span>
                  )}
                </div>

                {service.duration && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="h-4 w-4 mr-1" />
                    <span>{service.duration} minutes</span>
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

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No services found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingService(null);
                  setNewService({
                    name: '',
                    price: 0,
                    category: 'procedures',
                    description: '',
                    severity: 'mild',
                    duration: 15,
                    requirements: []
                  });
                }}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={newService.severity || 'mild'}
                    onChange={(e) => setNewService(prev => ({ ...prev, severity: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {severityLevels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newService.duration || 15}
                    onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
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
                        placeholder="e.g., Sterile gauze, Antiseptic"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingService ? 'Save Changes' : 'Add Service'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                    setNewService({
                      name: '',
                      price: 0,
                      category: 'procedures',
                      description: '',
                      severity: 'mild',
                      duration: 15,
                      requirements: []
                    });
                  }}
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