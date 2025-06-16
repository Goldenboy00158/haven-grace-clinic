import { Medication } from '../types';

export const medications: Medication[] = [
  { 
    id: "1", 
    name: "NASAL DROPS", 
    price: 50, 
    stock: 5, 
    category: "Respiratory", 
    costPrice: 30,
    formulations: ["Drops 10ml", "Drops 15ml"],
    manufacturer: "Generic Pharma"
  },
  { 
    id: "2", 
    name: "CEFTRIAXONE", 
    price: 400, 
    stock: 12, 
    category: "Antibiotics", 
    costPrice: 250,
    formulations: ["Injection 1g", "Injection 2g"],
    manufacturer: "Roche"
  },
  { 
    id: "3", 
    name: "ZOMEP ES 20MG", 
    price: 20, 
    stock: 140, 
    category: "Gastric", 
    costPrice: 12,
    formulations: ["Tablets 20mg", "Capsules 20mg"],
    manufacturer: "Zydus"
  },
  { 
    id: "4", 
    name: "ZOMEP ES 40MG", 
    price: 20, 
    stock: 148, 
    category: "Gastric", 
    costPrice: 12,
    formulations: ["Tablets 40mg", "Capsules 40mg"],
    manufacturer: "Zydus"
  },
  { 
    id: "5", 
    name: "BENAFLI CAPS", 
    price: 20, 
    stock: 100, 
    category: "Respiratory", 
    costPrice: 12,
    formulations: ["Capsules", "Syrup 100ml"],
    manufacturer: "Benaroya"
  },
  { 
    id: "6", 
    name: "ALTOA SUS", 
    price: 50, 
    stock: 10, 
    category: "Gastric", 
    costPrice: 30,
    formulations: ["Suspension 200ml"],
    manufacturer: "Altoa"
  },
  { 
    id: "7", 
    name: "P2", 
    price: 200, 
    stock: 5, 
    category: "Emergency Contraception", 
    costPrice: 120,
    formulations: ["Tablet 1.5mg"],
    manufacturer: "Gedeon Richter"
  },
  { 
    id: "8", 
    name: "EASYPLAN TABS", 
    price: 100, 
    stock: 13, 
    category: "Contraception", 
    costPrice: 60,
    formulations: ["Tablets 28s"],
    manufacturer: "Cosmos"
  },
  { 
    id: "9", 
    name: "HYOSCINE INJECTION", 
    price: 200, 
    stock: 10, 
    category: "Antispasmodic", 
    costPrice: 120,
    formulations: ["Injection 20mg/ml"],
    manufacturer: "Boehringer"
  },
  { 
    id: "10", 
    name: "HYOSCINE TABS", 
    price: 10, 
    stock: 120, 
    category: "Antispasmodic", 
    costPrice: 6,
    formulations: ["Tablets 10mg", "Tablets 20mg"],
    manufacturer: "Boehringer"
  },
  { 
    id: "11", 
    name: "FEMIPLAN PILLS", 
    price: 100, 
    stock: 12, 
    category: "Contraception", 
    costPrice: 60,
    formulations: ["Pills 21s", "Pills 28s"],
    manufacturer: "Organon"
  },
  { 
    id: "12", 
    name: "CYPRO B", 
    price: 20, 
    stock: 28, 
    category: "Appetite Stimulant", 
    costPrice: 12,
    formulations: ["Tablets", "Syrup 100ml"],
    manufacturer: "Cipla"
  },
  { 
    id: "13", 
    name: "AMOXYCILLIN 500MG", 
    price: 10, 
    stock: 240, 
    category: "Antibiotics", 
    costPrice: 6,
    formulations: ["Capsules 500mg", "Tablets 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "14", 
    name: "AMOXYCILLIN 250MG", 
    price: 8.67, 
    stock: 250, 
    category: "Antibiotics", 
    costPrice: 5,
    formulations: ["Capsules 250mg", "Tablets 250mg"],
    manufacturer: "GSK"
  },
  { 
    id: "15", 
    name: "AMOXYCILLIN SYRUP 60ML", 
    price: 50, 
    stock: 11, 
    category: "Antibiotics", 
    costPrice: 30,
    formulations: ["Syrup 125mg/5ml 60ml", "Syrup 250mg/5ml 60ml"],
    manufacturer: "GSK"
  },
  { 
    id: "16", 
    name: "AMOXYCILLIN SYRUP 100ML", 
    price: 150, 
    stock: 14, 
    category: "Antibiotics", 
    costPrice: 90,
    formulations: ["Syrup 125mg/5ml 100ml", "Syrup 250mg/5ml 100ml"],
    manufacturer: "GSK"
  },
  { 
    id: "17", 
    name: "HIV TEST KIT", 
    price: 200, 
    stock: 8, 
    category: "Diagnostics", 
    costPrice: 120,
    formulations: ["Rapid Test Kit"],
    manufacturer: "Abbott"
  },
  { 
    id: "18", 
    name: "TRUST", 
    price: 50, 
    stock: 23, 
    category: "Contraception", 
    costPrice: 30,
    formulations: ["Condoms 3s", "Condoms 12s"],
    manufacturer: "Trust"
  },
  { 
    id: "19", 
    name: "DICLOFENAC TABS", 
    price: 20, 
    stock: 90, 
    category: "Pain Relief", 
    costPrice: 12,
    formulations: ["Tablets 50mg", "Tablets 75mg", "Injection 75mg/3ml"],
    manufacturer: "Novartis"
  },
  { 
    id: "20", 
    name: "MYOSPAZ TABS", 
    price: 30, 
    stock: 50, 
    category: "Muscle Relaxant", 
    costPrice: 18,
    formulations: ["Tablets"],
    manufacturer: "Lupin"
  },
  // Continue with enhanced medication data...
  { 
    id: "120", 
    name: "PREGNANCY TEST STRIPS", 
    price: 50, 
    stock: 18, 
    category: "Diagnostics", 
    costPrice: 8,
    formulations: ["Test Strips", "Digital Test"],
    manufacturer: "Clearblue"
  },
  { 
    id: "121", 
    name: "MDT STRIP", 
    price: 200, 
    stock: 15, 
    category: "Diagnostics", 
    costPrice: 30,
    formulations: ["Multi-drug Test Strip"],
    manufacturer: "Abon"
  },
  { 
    id: "122", 
    name: "H. PYLORI TEST KIT", 
    price: 350, 
    stock: 10, 
    category: "Diagnostics", 
    costPrice: 69,
    formulations: ["Rapid Test Kit", "Stool Antigen Test"],
    manufacturer: "Meridian"
  }
  // Add remaining medications with similar enhancements...
];

export const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', priority: 4 };
  if (stock <= 5) return { label: 'Critical', color: 'bg-red-100 text-red-800', priority: 3 };
  if (stock <= 15) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', priority: 2 };
  return { label: 'In Stock', color: 'bg-green-100 text-green-800', priority: 1 };
};

export const getMedicationCategories = () => {
  const categories = new Set(medications.map(med => med.category).filter(Boolean));
  return Array.from(categories).sort();
};