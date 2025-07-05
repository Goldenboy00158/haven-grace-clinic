import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Activity, AlertTriangle, PieChart } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Transaction, Medication } from '../types';
import { medications } from '../data/medications';

interface DiagnosisAnalytics {
  diagnosis: string;
  count: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastMonth: number;
  thisMonth: number;
}

interface InventoryAnalytics {
  medicationId: string;
  medicationName: string;
  totalSold: number;
  revenue: number;
  profitMargin: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  category: string;
  stockTurnover: number;
}

export default function AnalyticsDashboard() {
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [medicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);

  // Calculate common diagnoses
  const diagnosisAnalytics = useMemo((): DiagnosisAnalytics[] => {
    const diagnosisCount: Record<string, { total: number; thisMonth: number; lastMonth: number }> = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Count diagnoses from all patient records
    patients.forEach(patient => {
      patient.medicalHistory.forEach(record => {
        if (record.diagnosis) {
          const diagnosis = record.diagnosis.toLowerCase().trim();
          if (!diagnosisCount[diagnosis]) {
            diagnosisCount[diagnosis] = { total: 0, thisMonth: 0, lastMonth: 0 };
          }
          diagnosisCount[diagnosis].total++;

          const recordDate = new Date(record.date);
          if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
            diagnosisCount[diagnosis].thisMonth++;
          }
          if (recordDate.getMonth() === lastMonth && recordDate.getFullYear() === lastMonthYear) {
            diagnosisCount[diagnosis].lastMonth++;
          }
        }
      });
    });

    const totalDiagnoses = Object.values(diagnosisCount).reduce((sum, count) => sum + count.total, 0);

    return Object.entries(diagnosisCount)
      .map(([diagnosis, counts]) => {
        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (counts.thisMonth > counts.lastMonth) trend = 'increasing';
        else if (counts.thisMonth < counts.lastMonth) trend = 'decreasing';

        return {
          diagnosis: diagnosis.charAt(0).toUpperCase() + diagnosis.slice(1),
          count: counts.total,
          percentage: totalDiagnoses > 0 ? (counts.total / totalDiagnoses) * 100 : 0,
          trend,
          lastMonth: counts.lastMonth,
          thisMonth: counts.thisMonth
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [patients]);

  // Calculate top-selling medications
  const inventoryAnalytics = useMemo((): InventoryAnalytics[] => {
    const medicationSales: Record<string, { 
      totalSold: number; 
      revenue: number; 
      thisMonth: number; 
      lastMonth: number;
      name: string;
      category: string;
      costPrice: number;
    }> = {};

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Analyze transaction data
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      
      transaction.items.forEach(item => {
        if (!medicationSales[item.medicationId]) {
          const medication = medicationData.find(med => med.id === item.medicationId);
          medicationSales[item.medicationId] = {
            totalSold: 0,
            revenue: 0,
            thisMonth: 0,
            lastMonth: 0,
            name: medication?.name || item.medicationName,
            category: medication?.category || 'Unknown',
            costPrice: medication?.costPrice || 0
          };
        }

        medicationSales[item.medicationId].totalSold += item.quantity;
        medicationSales[item.medicationId].revenue += item.totalCost;

        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          medicationSales[item.medicationId].thisMonth += item.quantity;
        }
        if (transactionDate.getMonth() === lastMonth && transactionDate.getFullYear() === lastMonthYear) {
          medicationSales[item.medicationId].lastMonth += item.quantity;
        }
      });
    });

    return Object.entries(medicationSales)
      .map(([medicationId, sales]) => {
        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (sales.thisMonth > sales.lastMonth) trend = 'increasing';
        else if (sales.thisMonth < sales.lastMonth) trend = 'decreasing';

        const medication = medicationData.find(med => med.id === medicationId);
        const currentStock = medication?.stock || 0;
        const stockTurnover = currentStock > 0 ? sales.totalSold / currentStock : 0;
        
        const profitMargin = sales.costPrice > 0 
          ? ((sales.revenue - (sales.costPrice * sales.totalSold)) / sales.revenue) * 100 
          : 0;

        return {
          medicationId,
          medicationName: sales.name,
          totalSold: sales.totalSold,
          revenue: sales.revenue,
          profitMargin,
          trend,
          category: sales.category,
          stockTurnover
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [transactions, medicationData]);

  // Calculate revenue analytics
  const revenueAnalytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const dailyRevenue = transactions
      .filter(t => {
        const today = new Date().toDateString();
        return new Date(t.date).toDateString() === today;
      })
      .reduce((sum, t) => sum + t.totalAmount, 0);

    // Calculate weekly revenue for the last 7 days
    const weeklyRevenue = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return transactionDate >= weekAgo;
      })
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      daily: dailyRevenue,
      weekly: weeklyRevenue,
      monthly: monthlyRevenue
    };
  }, [transactions]);

  // Calculate patient analytics
  const patientAnalytics = useMemo(() => {
    const totalPatients = patients.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newPatientsThisMonth = patients.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    const averageAge = patients.length > 0 
      ? patients.reduce((sum, p) => sum + p.age, 0) / patients.length 
      : 0;

    const genderDistribution = patients.reduce((acc, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPatients,
      newPatientsThisMonth,
      averageAge: Math.round(averageAge),
      genderDistribution: {
        male: genderDistribution.male || 0,
        female: genderDistribution.female || 0,
        other: genderDistribution.other || 0
      }
    };
  }, [patients]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
          Analytics Dashboard
        </h2>
        <p className="text-gray-600">Comprehensive insights into clinic performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
              <p className="text-2xl font-bold text-green-600">KES {revenueAnalytics.daily.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
              <p className="text-2xl font-bold text-blue-600">KES {revenueAnalytics.weekly.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-600">KES {revenueAnalytics.monthly.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Patients</p>
              <p className="text-2xl font-bold text-indigo-600">{patientAnalytics.newPatientsThisMonth}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Common Diagnoses */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Most Common Diagnoses
            </h3>
            <p className="text-sm text-gray-600">Auto-updating based on patient records</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {diagnosisAnalytics.map((diagnosis, index) => (
                <div key={diagnosis.diagnosis} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{diagnosis.diagnosis}</p>
                      <p className="text-sm text-gray-600">{diagnosis.count} cases ({diagnosis.percentage.toFixed(1)}%)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(diagnosis.trend)}
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getTrendColor(diagnosis.trend)}`}>
                        {diagnosis.thisMonth} this month
                      </p>
                      <p className="text-xs text-gray-500">{diagnosis.lastMonth} last month</p>
                    </div>
                  </div>
                </div>
              ))}
              {diagnosisAnalytics.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No diagnosis data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top-Selling Medications */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Top-Selling Medications
            </h3>
            <p className="text-sm text-gray-600">Most marketable items by revenue</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {inventoryAnalytics.map((item, index) => (
                <div key={item.medicationId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.medicationName}</p>
                      <p className="text-sm text-gray-600">
                        {item.totalSold} units sold • {item.category}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        KES {item.revenue.toLocaleString()} revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(item.trend)}
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                        {item.profitMargin.toFixed(1)}% margin
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.stockTurnover.toFixed(1)}x turnover
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {inventoryAnalytics.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sales data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Patient Demographics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{patientAnalytics.totalPatients}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{patientAnalytics.averageAge}</p>
              <p className="text-sm text-gray-600">Average Age</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{patientAnalytics.genderDistribution.male}</p>
              <p className="text-sm text-gray-600">Male Patients</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-pink-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{patientAnalytics.genderDistribution.female}</p>
              <p className="text-sm text-gray-600">Female Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Update Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Auto-Updating Analytics</h4>
            <p className="text-sm text-blue-800 mt-1">
              All analytics data automatically updates as you add new patients, record diagnoses, and process sales. 
              The system tracks trends month-over-month to help you identify patterns in your clinic's operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}