import React, { useState, useMemo } from 'react';
import { Users, Ban as Bandage, Stethoscope, Activity, Scissors, Droplets, Pill, Search, Filter, Download, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { medications, getStockStatus, getMedicationCategories, type Medication } from '../data/medications';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Services() {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [medicationData, setMedicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);

  const clinicServices = [
    {
      icon: Users,
      title: "Family Planning",
      description: "Comprehensive reproductive health services and family planning counseling.",
      features: ["Contraceptive Counseling", "Pregnancy Testing", "Reproductive Health", "STI Screening"],
      price: "KES 500 - 1,500"
    },
    {
      icon: Bandage,
      title: "Wound Dressing",
      description: "Professional wound care and dressing services for optimal healing.",
      features: ["Wound Assessment", "Sterile Dressing", "Infection Prevention", "Healing Monitoring"],
      price: "KES 300 - 800"
    },
    {
      icon: Stethoscope,
      title: "Blood Pressure Monitoring",
      description: "Regular BP monitoring and hypertension management services.",
      features: ["24-Hour Monitoring", "Hypertension Management", "Lifestyle Counseling", "Medication Adjustment"],
      price: "KES 200 - 500"
    },
    {
      icon: Activity,
      title: "Blood Sugar Monitoring",
      description: "Comprehensive diabetes care and blood glucose monitoring services.",
      features: ["HbA1c Testing", "Glucose Monitoring", "Diabetes Education", "Dietary Counseling"],
      price: "KES 300 - 700"
    },
    {
      icon: Scissors,
      title: "Suturing Services",
      description: "Professional wound closure and suturing for cuts and surgical procedures.",
      features: ["Wound Closure", "Surgical Suturing", "Cosmetic Repair", "Post-Op Care"],
      price: "KES 800 - 2,000"
    },
    {
      icon: Droplets,
      title: "Laboratory Services",
      description: "On-site laboratory testing for quick and accurate diagnostic results.",
      features: ["Blood Tests", "Urine Analysis", "Rapid Testing", "Health Screenings"],
      price: "KES 400 - 1,200"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clinicServices.map((service, index) => {
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
      </div>
    </section>
  );
}