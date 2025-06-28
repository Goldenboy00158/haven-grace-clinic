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
  { 
    id: "21", 
    name: "MARA MOJA", 
    price: 20, 
    stock: 100, 
    category: "Analgesic", 
    costPrice: 12,
    formulations: ["Tablets"],
    manufacturer: "Cosmos"
  },
  { 
    id: "22", 
    name: "PARACETAMOL 500MG", 
    price: 5, 
    stock: 500, 
    category: "Analgesic", 
    costPrice: 3,
    formulations: ["Tablets 500mg"],
    manufacturer: "Generic"
  },
  { 
    id: "23", 
    name: "PARACETAMOL 250MG", 
    price: 3, 
    stock: 300, 
    category: "Analgesic", 
    costPrice: 2,
    formulations: ["Tablets 250mg"],
    manufacturer: "Generic"
  },
  { 
    id: "24", 
    name: "IBUPROFEN 400MG", 
    price: 8, 
    stock: 200, 
    category: "Anti-inflammatory", 
    costPrice: 5,
    formulations: ["Tablets 400mg"],
    manufacturer: "Generic"
  },
  { 
    id: "25", 
    name: "IBUPROFEN 200MG", 
    price: 5, 
    stock: 250, 
    category: "Anti-inflammatory", 
    costPrice: 3,
    formulations: ["Tablets 200mg"],
    manufacturer: "Generic"
  },
  { 
    id: "26", 
    name: "ASPIRIN 75MG", 
    price: 3, 
    stock: 150, 
    category: "Antiplatelet", 
    costPrice: 2,
    formulations: ["Tablets 75mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "27", 
    name: "ASPIRIN 300MG", 
    price: 5, 
    stock: 100, 
    category: "Analgesic", 
    costPrice: 3,
    formulations: ["Tablets 300mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "28", 
    name: "METFORMIN 500MG", 
    price: 15, 
    stock: 180, 
    category: "Antidiabetic", 
    costPrice: 10,
    formulations: ["Tablets 500mg"],
    manufacturer: "Teva"
  },
  { 
    id: "29", 
    name: "METFORMIN 850MG", 
    price: 20, 
    stock: 120, 
    category: "Antidiabetic", 
    costPrice: 12,
    formulations: ["Tablets 850mg"],
    manufacturer: "Teva"
  },
  { 
    id: "30", 
    name: "GLIBENCLAMIDE 5MG", 
    price: 12, 
    stock: 90, 
    category: "Antidiabetic", 
    costPrice: 8,
    formulations: ["Tablets 5mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "31", 
    name: "ATENOLOL 50MG", 
    price: 18, 
    stock: 80, 
    category: "Antihypertensive", 
    costPrice: 12,
    formulations: ["Tablets 50mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "32", 
    name: "ATENOLOL 25MG", 
    price: 12, 
    stock: 100, 
    category: "Antihypertensive", 
    costPrice: 8,
    formulations: ["Tablets 25mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "33", 
    name: "AMLODIPINE 5MG", 
    price: 15, 
    stock: 120, 
    category: "Antihypertensive", 
    costPrice: 10,
    formulations: ["Tablets 5mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "34", 
    name: "AMLODIPINE 10MG", 
    price: 25, 
    stock: 80, 
    category: "Antihypertensive", 
    costPrice: 15,
    formulations: ["Tablets 10mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "35", 
    name: "HYDROCHLOROTHIAZIDE 25MG", 
    price: 10, 
    stock: 150, 
    category: "Diuretic", 
    costPrice: 6,
    formulations: ["Tablets 25mg"],
    manufacturer: "Merck"
  },
  { 
    id: "36", 
    name: "FUROSEMIDE 40MG", 
    price: 8, 
    stock: 100, 
    category: "Diuretic", 
    costPrice: 5,
    formulations: ["Tablets 40mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "37", 
    name: "ENALAPRIL 10MG", 
    price: 20, 
    stock: 90, 
    category: "ACE Inhibitor", 
    costPrice: 12,
    formulations: ["Tablets 10mg"],
    manufacturer: "Merck"
  },
  { 
    id: "38", 
    name: "ENALAPRIL 5MG", 
    price: 15, 
    stock: 110, 
    category: "ACE Inhibitor", 
    costPrice: 9,
    formulations: ["Tablets 5mg"],
    manufacturer: "Merck"
  },
  { 
    id: "39", 
    name: "LOSARTAN 50MG", 
    price: 25, 
    stock: 70, 
    category: "ARB", 
    costPrice: 15,
    formulations: ["Tablets 50mg"],
    manufacturer: "Merck"
  },
  { 
    id: "40", 
    name: "SIMVASTATIN 20MG", 
    price: 30, 
    stock: 60, 
    category: "Statin", 
    costPrice: 18,
    formulations: ["Tablets 20mg"],
    manufacturer: "Merck"
  },
  { 
    id: "41", 
    name: "ATORVASTATIN 20MG", 
    price: 40, 
    stock: 50, 
    category: "Statin", 
    costPrice: 25,
    formulations: ["Tablets 20mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "42", 
    name: "PREDNISOLONE 5MG", 
    price: 12, 
    stock: 80, 
    category: "Corticosteroid", 
    costPrice: 8,
    formulations: ["Tablets 5mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "43", 
    name: "DEXAMETHASONE 0.5MG", 
    price: 8, 
    stock: 60, 
    category: "Corticosteroid", 
    costPrice: 5,
    formulations: ["Tablets 0.5mg"],
    manufacturer: "Merck"
  },
  { 
    id: "44", 
    name: "CHLORPHENIRAMINE 4MG", 
    price: 5, 
    stock: 200, 
    category: "Antihistamine", 
    costPrice: 3,
    formulations: ["Tablets 4mg"],
    manufacturer: "Generic"
  },
  { 
    id: "45", 
    name: "LORATADINE 10MG", 
    price: 15, 
    stock: 100, 
    category: "Antihistamine", 
    costPrice: 10,
    formulations: ["Tablets 10mg"],
    manufacturer: "Schering"
  },
  { 
    id: "46", 
    name: "CETIRIZINE 10MG", 
    price: 12, 
    stock: 120, 
    category: "Antihistamine", 
    costPrice: 8,
    formulations: ["Tablets 10mg"],
    manufacturer: "UCB"
  },
  { 
    id: "47", 
    name: "OMEPRAZOLE 20MG", 
    price: 25, 
    stock: 90, 
    category: "PPI", 
    costPrice: 15,
    formulations: ["Capsules 20mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "48", 
    name: "OMEPRAZOLE 40MG", 
    price: 40, 
    stock: 60, 
    category: "PPI", 
    costPrice: 25,
    formulations: ["Capsules 40mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "49", 
    name: "RANITIDINE 150MG", 
    price: 15, 
    stock: 80, 
    category: "H2 Blocker", 
    costPrice: 10,
    formulations: ["Tablets 150mg"],
    manufacturer: "GSK"
  },
  { 
    id: "50", 
    name: "DOMPERIDONE 10MG", 
    price: 10, 
    stock: 100, 
    category: "Prokinetic", 
    costPrice: 6,
    formulations: ["Tablets 10mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "51", 
    name: "LOPERAMIDE 2MG", 
    price: 8, 
    stock: 80, 
    category: "Antidiarrheal", 
    costPrice: 5,
    formulations: ["Capsules 2mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "52", 
    name: "ORS SACHETS", 
    price: 15, 
    stock: 200, 
    category: "Rehydration", 
    costPrice: 10,
    formulations: ["Sachets"],
    manufacturer: "WHO"
  },
  { 
    id: "53", 
    name: "ZINC SULPHATE 20MG", 
    price: 5, 
    stock: 150, 
    category: "Supplement", 
    costPrice: 3,
    formulations: ["Tablets 20mg"],
    manufacturer: "Generic"
  },
  { 
    id: "54", 
    name: "FOLIC ACID 5MG", 
    price: 3, 
    stock: 200, 
    category: "Vitamin", 
    costPrice: 2,
    formulations: ["Tablets 5mg"],
    manufacturer: "Generic"
  },
  { 
    id: "55", 
    name: "IRON TABLETS", 
    price: 8, 
    stock: 120, 
    category: "Supplement", 
    costPrice: 5,
    formulations: ["Tablets 200mg"],
    manufacturer: "Generic"
  },
  { 
    id: "56", 
    name: "VITAMIN B COMPLEX", 
    price: 12, 
    stock: 100, 
    category: "Vitamin", 
    costPrice: 8,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "57", 
    name: "MULTIVITAMIN", 
    price: 20, 
    stock: 80, 
    category: "Vitamin", 
    costPrice: 12,
    formulations: ["Tablets"],
    manufacturer: "Centrum"
  },
  { 
    id: "58", 
    name: "CALCIUM CARBONATE 500MG", 
    price: 15, 
    stock: 90, 
    category: "Supplement", 
    costPrice: 10,
    formulations: ["Tablets 500mg"],
    manufacturer: "Generic"
  },
  { 
    id: "59", 
    name: "MAGNESIUM OXIDE 400MG", 
    price: 12, 
    stock: 70, 
    category: "Supplement", 
    costPrice: 8,
    formulations: ["Tablets 400mg"],
    manufacturer: "Generic"
  },
  { 
    id: "60", 
    name: "VITAMIN D3 1000IU", 
    price: 25, 
    stock: 60, 
    category: "Vitamin", 
    costPrice: 15,
    formulations: ["Tablets 1000IU"],
    manufacturer: "Generic"
  },
  { 
    id: "61", 
    name: "CIPROFLOXACIN 500MG", 
    price: 30, 
    stock: 80, 
    category: "Antibiotics", 
    costPrice: 18,
    formulations: ["Tablets 500mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "62", 
    name: "CIPROFLOXACIN 250MG", 
    price: 20, 
    stock: 100, 
    category: "Antibiotics", 
    costPrice: 12,
    formulations: ["Tablets 250mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "63", 
    name: "DOXYCYCLINE 100MG", 
    price: 25, 
    stock: 70, 
    category: "Antibiotics", 
    costPrice: 15,
    formulations: ["Capsules 100mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "64", 
    name: "AZITHROMYCIN 500MG", 
    price: 50, 
    stock: 40, 
    category: "Antibiotics", 
    costPrice: 30,
    formulations: ["Tablets 500mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "65", 
    name: "AZITHROMYCIN 250MG", 
    price: 30, 
    stock: 60, 
    category: "Antibiotics", 
    costPrice: 18,
    formulations: ["Tablets 250mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "66", 
    name: "ERYTHROMYCIN 500MG", 
    price: 35, 
    stock: 50, 
    category: "Antibiotics", 
    costPrice: 20,
    formulations: ["Tablets 500mg"],
    manufacturer: "Abbott"
  },
  { 
    id: "67", 
    name: "CLOXACILLIN 500MG", 
    price: 25, 
    stock: 80, 
    category: "Antibiotics", 
    costPrice: 15,
    formulations: ["Capsules 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "68", 
    name: "FLUCONAZOLE 150MG", 
    price: 40, 
    stock: 30, 
    category: "Antifungal", 
    costPrice: 25,
    formulations: ["Capsules 150mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "69", 
    name: "NYSTATIN TABLETS", 
    price: 20, 
    stock: 50, 
    category: "Antifungal", 
    costPrice: 12,
    formulations: ["Tablets 500,000 units"],
    manufacturer: "Bristol Myers"
  },
  { 
    id: "70", 
    name: "METRONIDAZOLE 400MG", 
    price: 15, 
    stock: 100, 
    category: "Antiprotozoal", 
    costPrice: 10,
    formulations: ["Tablets 400mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "71", 
    name: "METRONIDAZOLE 200MG", 
    price: 10, 
    stock: 120, 
    category: "Antiprotozoal", 
    costPrice: 6,
    formulations: ["Tablets 200mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "72", 
    name: "ALBENDAZOLE 400MG", 
    price: 25, 
    stock: 60, 
    category: "Anthelmintic", 
    costPrice: 15,
    formulations: ["Tablets 400mg"],
    manufacturer: "GSK"
  },
  { 
    id: "73", 
    name: "MEBENDAZOLE 100MG", 
    price: 15, 
    stock: 80, 
    category: "Anthelmintic", 
    costPrice: 10,
    formulations: ["Tablets 100mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "74", 
    name: "ARTEMETHER-LUMEFANTRINE", 
    price: 80, 
    stock: 40, 
    category: "Antimalarial", 
    costPrice: 50,
    formulations: ["Tablets 20/120mg"],
    manufacturer: "Novartis"
  },
  { 
    id: "75", 
    name: "QUININE 300MG", 
    price: 30, 
    stock: 50, 
    category: "Antimalarial", 
    costPrice: 18,
    formulations: ["Tablets 300mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "76", 
    name: "CHLOROQUINE 250MG", 
    price: 20, 
    stock: 60, 
    category: "Antimalarial", 
    costPrice: 12,
    formulations: ["Tablets 250mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "77", 
    name: "SULFADOXINE-PYRIMETHAMINE", 
    price: 25, 
    stock: 40, 
    category: "Antimalarial", 
    costPrice: 15,
    formulations: ["Tablets 500/25mg"],
    manufacturer: "Roche"
  },
  { 
    id: "78", 
    name: "CODEINE 30MG", 
    price: 20, 
    stock: 30, 
    category: "Opioid Analgesic", 
    costPrice: 12,
    formulations: ["Tablets 30mg"],
    manufacturer: "Generic"
  },
  { 
    id: "79", 
    name: "TRAMADOL 50MG", 
    price: 15, 
    stock: 50, 
    category: "Analgesic", 
    costPrice: 10,
    formulations: ["Capsules 50mg"],
    manufacturer: "Grünenthal"
  },
  { 
    id: "80", 
    name: "MORPHINE 10MG", 
    price: 50, 
    stock: 20, 
    category: "Opioid Analgesic", 
    costPrice: 30,
    formulations: ["Tablets 10mg"],
    manufacturer: "Generic"
  },
  { 
    id: "81", 
    name: "DIAZEPAM 5MG", 
    price: 15, 
    stock: 40, 
    category: "Anxiolytic", 
    costPrice: 10,
    formulations: ["Tablets 5mg"],
    manufacturer: "Roche"
  },
  { 
    id: "82", 
    name: "LORAZEPAM 1MG", 
    price: 20, 
    stock: 30, 
    category: "Anxiolytic", 
    costPrice: 12,
    formulations: ["Tablets 1mg"],
    manufacturer: "Wyeth"
  },
  { 
    id: "83", 
    name: "PHENYTOIN 100MG", 
    price: 25, 
    stock: 40, 
    category: "Anticonvulsant", 
    costPrice: 15,
    formulations: ["Capsules 100mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "84", 
    name: "CARBAMAZEPINE 200MG", 
    price: 30, 
    stock: 35, 
    category: "Anticonvulsant", 
    costPrice: 18,
    formulations: ["Tablets 200mg"],
    manufacturer: "Novartis"
  },
  { 
    id: "85", 
    name: "SODIUM VALPROATE 200MG", 
    price: 35, 
    stock: 30, 
    category: "Anticonvulsant", 
    costPrice: 20,
    formulations: ["Tablets 200mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "86", 
    name: "HALOPERIDOL 5MG", 
    price: 25, 
    stock: 25, 
    category: "Antipsychotic", 
    costPrice: 15,
    formulations: ["Tablets 5mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "87", 
    name: "CHLORPROMAZINE 100MG", 
    price: 20, 
    stock: 30, 
    category: "Antipsychotic", 
    costPrice: 12,
    formulations: ["Tablets 100mg"],
    manufacturer: "Generic"
  },
  { 
    id: "88", 
    name: "AMITRIPTYLINE 25MG", 
    price: 15, 
    stock: 40, 
    category: "Antidepressant", 
    costPrice: 10,
    formulations: ["Tablets 25mg"],
    manufacturer: "Generic"
  },
  { 
    id: "89", 
    name: "FLUOXETINE 20MG", 
    price: 30, 
    stock: 35, 
    category: "Antidepressant", 
    costPrice: 18,
    formulations: ["Capsules 20mg"],
    manufacturer: "Eli Lilly"
  },
  { 
    id: "90", 
    name: "SERTRALINE 50MG", 
    price: 40, 
    stock: 25, 
    category: "Antidepressant", 
    costPrice: 25,
    formulations: ["Tablets 50mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "91", 
    name: "LEVOTHYROXINE 50MCG", 
    price: 20, 
    stock: 60, 
    category: "Thyroid Hormone", 
    costPrice: 12,
    formulations: ["Tablets 50mcg"],
    manufacturer: "Abbott"
  },
  { 
    id: "92", 
    name: "LEVOTHYROXINE 100MCG", 
    price: 30, 
    stock: 40, 
    category: "Thyroid Hormone", 
    costPrice: 18,
    formulations: ["Tablets 100mcg"],
    manufacturer: "Abbott"
  },
  { 
    id: "93", 
    name: "CARBIMAZOLE 5MG", 
    price: 25, 
    stock: 30, 
    category: "Antithyroid", 
    costPrice: 15,
    formulations: ["Tablets 5mg"],
    manufacturer: "Generic"
  },
  { 
    id: "94", 
    name: "WARFARIN 5MG", 
    price: 20, 
    stock: 40, 
    category: "Anticoagulant", 
    costPrice: 12,
    formulations: ["Tablets 5mg"],
    manufacturer: "Bristol Myers"
  },
  { 
    id: "95", 
    name: "HEPARIN INJECTION", 
    price: 100, 
    stock: 20, 
    category: "Anticoagulant", 
    costPrice: 60,
    formulations: ["Injection 5000 units/ml"],
    manufacturer: "Pfizer"
  },
  { 
    id: "96", 
    name: "DIGOXIN 0.25MG", 
    price: 15, 
    stock: 50, 
    category: "Cardiac Glycoside", 
    costPrice: 10,
    formulations: ["Tablets 0.25mg"],
    manufacturer: "GSK"
  },
  { 
    id: "97", 
    name: "ISOSORBIDE MONONITRATE 20MG", 
    price: 25, 
    stock: 40, 
    category: "Nitrate", 
    costPrice: 15,
    formulations: ["Tablets 20mg"],
    manufacturer: "Schwarz"
  },
  { 
    id: "98", 
    name: "GLYCERYL TRINITRATE SPRAY", 
    price: 150, 
    stock: 15, 
    category: "Nitrate", 
    costPrice: 90,
    formulations: ["Sublingual spray"],
    manufacturer: "Pfizer"
  },
  { 
    id: "99", 
    name: "ALLOPURINOL 100MG", 
    price: 20, 
    stock: 60, 
    category: "Antigout", 
    costPrice: 12,
    formulations: ["Tablets 100mg"],
    manufacturer: "GSK"
  },
  { 
    id: "100", 
    name: "COLCHICINE 0.5MG", 
    price: 30, 
    stock: 30, 
    category: "Antigout", 
    costPrice: 18,
    formulations: ["Tablets 0.5mg"],
    manufacturer: "Generic"
  },
  { 
    id: "101", 
    name: "PROBENECID 500MG", 
    price: 40, 
    stock: 25, 
    category: "Antigout", 
    costPrice: 25,
    formulations: ["Tablets 500mg"],
    manufacturer: "Generic"
  },
  { 
    id: "102", 
    name: "SPIRONOLACTONE 25MG", 
    price: 15, 
    stock: 50, 
    category: "Diuretic", 
    costPrice: 10,
    formulations: ["Tablets 25mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "103", 
    name: "INDAPAMIDE 2.5MG", 
    price: 20, 
    stock: 40, 
    category: "Diuretic", 
    costPrice: 12,
    formulations: ["Tablets 2.5mg"],
    manufacturer: "Servier"
  },
  { 
    id: "104", 
    name: "BISOPROLOL 5MG", 
    price: 25, 
    stock: 35, 
    category: "Beta Blocker", 
    costPrice: 15,
    formulations: ["Tablets 5mg"],
    manufacturer: "Merck"
  },
  { 
    id: "105", 
    name: "PROPRANOLOL 40MG", 
    price: 15, 
    stock: 60, 
    category: "Beta Blocker", 
    costPrice: 10,
    formulations: ["Tablets 40mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "106", 
    name: "NIFEDIPINE 10MG", 
    price: 20, 
    stock: 50, 
    category: "Calcium Channel Blocker", 
    costPrice: 12,
    formulations: ["Tablets 10mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "107", 
    name: "DILTIAZEM 60MG", 
    price: 30, 
    stock: 30, 
    category: "Calcium Channel Blocker", 
    costPrice: 18,
    formulations: ["Tablets 60mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "108", 
    name: "VERAPAMIL 80MG", 
    price: 25, 
    stock: 35, 
    category: "Calcium Channel Blocker", 
    costPrice: 15,
    formulations: ["Tablets 80mg"],
    manufacturer: "Abbott"
  },
  { 
    id: "109", 
    name: "CAPTOPRIL 25MG", 
    price: 15, 
    stock: 60, 
    category: "ACE Inhibitor", 
    costPrice: 10,
    formulations: ["Tablets 25mg"],
    manufacturer: "Bristol Myers"
  },
  { 
    id: "110", 
    name: "LISINOPRIL 10MG", 
    price: 25, 
    stock: 40, 
    category: "ACE Inhibitor", 
    costPrice: 15,
    formulations: ["Tablets 10mg"],
    manufacturer: "Merck"
  },
  { 
    id: "111", 
    name: "TELMISARTAN 40MG", 
    price: 35, 
    stock: 30, 
    category: "ARB", 
    costPrice: 20,
    formulations: ["Tablets 40mg"],
    manufacturer: "Boehringer"
  },
  { 
    id: "112", 
    name: "VALSARTAN 80MG", 
    price: 40, 
    stock: 25, 
    category: "ARB", 
    costPrice: 25,
    formulations: ["Tablets 80mg"],
    manufacturer: "Novartis"
  },
  { 
    id: "113", 
    name: "ROSUVASTATIN 10MG", 
    price: 50, 
    stock: 30, 
    category: "Statin", 
    costPrice: 30,
    formulations: ["Tablets 10mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "114", 
    name: "PRAVASTATIN 20MG", 
    price: 35, 
    stock: 25, 
    category: "Statin", 
    costPrice: 20,
    formulations: ["Tablets 20mg"],
    manufacturer: "Bristol Myers"
  },
  { 
    id: "115", 
    name: "FENOFIBRATE 160MG", 
    price: 45, 
    stock: 20, 
    category: "Fibrate", 
    costPrice: 27,
    formulations: ["Tablets 160mg"],
    manufacturer: "Abbott"
  },
  { 
    id: "116", 
    name: "GEMFIBROZIL 600MG", 
    price: 40, 
    stock: 25, 
    category: "Fibrate", 
    costPrice: 25,
    formulations: ["Tablets 600mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "117", 
    name: "INSULIN REGULAR", 
    price: 200, 
    stock: 15, 
    category: "Insulin", 
    costPrice: 120,
    formulations: ["Injection 100 units/ml"],
    manufacturer: "Novo Nordisk"
  },
  { 
    id: "118", 
    name: "INSULIN NPH", 
    price: 220, 
    stock: 12, 
    category: "Insulin", 
    costPrice: 130,
    formulations: ["Injection 100 units/ml"],
    manufacturer: "Novo Nordisk"
  },
  { 
    id: "119", 
    name: "GLICLAZIDE 80MG", 
    price: 25, 
    stock: 40, 
    category: "Antidiabetic", 
    costPrice: 15,
    formulations: ["Tablets 80mg"],
    manufacturer: "Servier"
  },
  { 
    id: "120", 
    name: "CPM TABS", 
    price: 30, 
    stock: 30, 
    category: "Antihistamine", 
    costPrice: 18,
    formulations: ["Tablets 4mg"],
    manufacturer: "Generic"
  },
  { 
    id: "121", 
    name: "PREGNANCY TEST", 
    price: 50, 
    stock: 17, 
    category: "Diagnostics", 
    costPrice: 30,
    formulations: ["Test Strips", "Digital Test"],
    manufacturer: "Clearblue"
  },
  { 
    id: "122", 
    name: "GLUCOPHAGE 850 TABS", 
    price: 100, 
    stock: 0, 
    category: "Antidiabetic", 
    costPrice: 60,
    formulations: ["Tablets 850mg"],
    manufacturer: "Merck"
  },
  { 
    id: "123", 
    name: "NOISIC", 
    price: 10, 
    stock: 0, 
    category: "Analgesic", 
    costPrice: 6,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "124", 
    name: "MALARIA DIAGNOSTIC TEST", 
    price: 200, 
    stock: 2, 
    category: "Diagnostics", 
    costPrice: 120,
    formulations: ["Rapid Test Strip"],
    manufacturer: "SD Biosensor"
  },
  { 
    id: "125", 
    name: "SALBUTAMOL 4MG TABS", 
    price: 30, 
    stock: 100, 
    category: "Bronchodilator", 
    costPrice: 18,
    formulations: ["Tablets 4mg"],
    manufacturer: "GSK"
  },
  { 
    id: "126", 
    name: "SALBUTAMOL SYRUP", 
    price: 100, 
    stock: 6, 
    category: "Bronchodilator", 
    costPrice: 60,
    formulations: ["Syrup 2mg/5ml 100ml"],
    manufacturer: "GSK"
  },
  { 
    id: "127", 
    name: "NICOF 60ML", 
    price: 150, 
    stock: 1, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 60ml"],
    manufacturer: "Cipla"
  },
  { 
    id: "128", 
    name: "NICOF 100ML", 
    price: 150, 
    stock: 1, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 100ml"],
    manufacturer: "Cipla"
  },
  { 
    id: "129", 
    name: "KOFGON 60ML", 
    price: 150, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 60ml"],
    manufacturer: "Lupin"
  },
  { 
    id: "130", 
    name: "KOFGON 100ML", 
    price: 150, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 100ml"],
    manufacturer: "Lupin"
  },
  { 
    id: "131", 
    name: "BENACOFF 60ML", 
    price: 150, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 60ml"],
    manufacturer: "Benaroya"
  },
  { 
    id: "132", 
    name: "BENACOFF 100ML", 
    price: 150, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 100ml"],
    manufacturer: "Benaroya"
  },
  { 
    id: "133", 
    name: "TRIDEX 60ML", 
    price: 150, 
    stock: 4, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 60ml"],
    manufacturer: "Cadila"
  },
  { 
    id: "134", 
    name: "TRIDEX 100ML", 
    price: 150, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90,
    formulations: ["Syrup 100ml"],
    manufacturer: "Cadila"
  },
  { 
    id: "135", 
    name: "FLEXOR CAPSULES", 
    price: 20, 
    stock: 50, 
    category: "Muscle Relaxant", 
    costPrice: 12,
    formulations: ["Capsules"],
    manufacturer: "Torrent"
  },
  { 
    id: "136", 
    name: "MYONAC MR", 
    price: 30, 
    stock: 19, 
    category: "Muscle Relaxant", 
    costPrice: 18,
    formulations: ["Caplets"],
    manufacturer: "Lupin"
  },
  { 
    id: "137", 
    name: "CELECOXIB 100MG", 
    price: 20, 
    stock: 59, 
    category: "Anti-inflammatory", 
    costPrice: 12,
    formulations: ["Capsules 100mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "138", 
    name: "TT", 
    price: 200, 
    stock: 19, 
    category: "Vaccine", 
    costPrice: 120,
    formulations: ["Injection"],
    manufacturer: "Serum Institute"
  },
  { 
    id: "139", 
    name: "CEFIXIME 400MG", 
    price: 350, 
    stock: 1, 
    category: "Antibiotics", 
    costPrice: 210,
    formulations: ["Tablets 400mg", "Capsules 400mg"],
    manufacturer: "Lupin"
  },
  { 
    id: "140", 
    name: "PANTOPRAZOLE 40MG", 
    price: 35, 
    stock: 45, 
    category: "PPI", 
    costPrice: 20,
    formulations: ["Tablets 40mg"],
    manufacturer: "Takeda"
  },
  { 
    id: "141", 
    name: "LANSOPRAZOLE 30MG", 
    price: 40, 
    stock: 35, 
    category: "PPI", 
    costPrice: 25,
    formulations: ["Capsules 30mg"],
    manufacturer: "Takeda"
  },
  { 
    id: "142", 
    name: "ESOMEPRAZOLE 40MG", 
    price: 50, 
    stock: 25, 
    category: "PPI", 
    costPrice: 30,
    formulations: ["Tablets 40mg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "143", 
    name: "RABEPRAZOLE 20MG", 
    price: 45, 
    stock: 30, 
    category: "PPI", 
    costPrice: 27,
    formulations: ["Tablets 20mg"],
    manufacturer: "Eisai"
  },
  { 
    id: "144", 
    name: "MONTELUKAST 10MG", 
    price: 60, 
    stock: 20, 
    category: "Leukotriene Antagonist", 
    costPrice: 35,
    formulations: ["Tablets 10mg"],
    manufacturer: "Merck"
  },
  { 
    id: "145", 
    name: "THEOPHYLLINE 200MG", 
    price: 25, 
    stock: 40, 
    category: "Bronchodilator", 
    costPrice: 15,
    formulations: ["Tablets 200mg"],
    manufacturer: "Generic"
  },
  { 
    id: "146", 
    name: "BUDESONIDE INHALER", 
    price: 300, 
    stock: 10, 
    category: "Corticosteroid", 
    costPrice: 180,
    formulations: ["Inhaler 200mcg"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "147", 
    name: "SALBUTAMOL INHALER", 
    price: 250, 
    stock: 15, 
    category: "Bronchodilator", 
    costPrice: 150,
    formulations: ["Inhaler 100mcg"],
    manufacturer: "GSK"
  },
  { 
    id: "148", 
    name: "BECLOMETHASONE INHALER", 
    price: 280, 
    stock: 12, 
    category: "Corticosteroid", 
    costPrice: 170,
    formulations: ["Inhaler 250mcg"],
    manufacturer: "GSK"
  },
  { 
    id: "149", 
    name: "IPRATROPIUM INHALER", 
    price: 320, 
    stock: 8, 
    category: "Bronchodilator", 
    costPrice: 190,
    formulations: ["Inhaler 20mcg"],
    manufacturer: "Boehringer"
  },
  { 
    id: "150", 
    name: "KETOCONAZOLE 200MG", 
    price: 30, 
    stock: 40, 
    category: "Antifungal", 
    costPrice: 18,
    formulations: ["Tablets 200mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "151", 
    name: "ITRACONAZOLE 100MG", 
    price: 50, 
    stock: 25, 
    category: "Antifungal", 
    costPrice: 30,
    formulations: ["Capsules 100mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "152", 
    name: "TERBINAFINE 250MG", 
    price: 60, 
    stock: 20, 
    category: "Antifungal", 
    costPrice: 35,
    formulations: ["Tablets 250mg"],
    manufacturer: "Novartis"
  },
  { 
    id: "153", 
    name: "ACYCLOVIR 400MG", 
    price: 40, 
    stock: 30, 
    category: "Antiviral", 
    costPrice: 25,
    formulations: ["Tablets 400mg"],
    manufacturer: "GSK"
  },
  { 
    id: "154", 
    name: "VALACYCLOVIR 500MG", 
    price: 80, 
    stock: 15, 
    category: "Antiviral", 
    costPrice: 50,
    formulations: ["Tablets 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "155", 
    name: "OSELTAMIVIR 75MG", 
    price: 120, 
    stock: 10, 
    category: "Antiviral", 
    costPrice: 70,
    formulations: ["Capsules 75mg"],
    manufacturer: "Roche"
  }
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

// Helper function to check if medication is in tablet/capsule form
export const isTabletOrCapsule = (medication: Medication): boolean => {
  if (!medication.formulations) return true; // Default to true if no formulations specified
  
  return medication.formulations.some(formulation => 
    formulation.toLowerCase().includes('tablet') || 
    formulation.toLowerCase().includes('capsule') ||
    formulation.toLowerCase().includes('pill') ||
    formulation.toLowerCase().includes('cap')
  );
};

// Get only medications that are tablets or capsules for prescription
export const getTabletCapsuleMedications = (): Medication[] => {
  return medications.filter(med => isTabletOrCapsule(med) && med.stock > 0);
};