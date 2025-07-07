import { Medication } from '../types';

export const medications: Medication[] = [
  { 
    id: "1", 
    name: "A.P.C", 
    price: 5.00, 
    stock: 74, 
    category: "Analgesic", 
    costPrice: 3.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "2", 
    name: "ABZ", 
    price: 50.00, 
    stock: 9, 
    category: "Antiparasitic", 
    costPrice: 30.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "3", 
    name: "Action", 
    price: 5.00, 
    stock: 92, 
    category: "Pain Relief", 
    costPrice: 3.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "4", 
    name: "ADOL 250MG", 
    price: 150.00, 
    stock: 3, 
    category: "Pain Relief", 
    costPrice: 90.00,
    formulations: ["Tablets 250mg"],
    manufacturer: "Generic"
  },
  { 
    id: "5", 
    name: "AL", 
    price: 150.00, 
    stock: 2, 
    category: "Antimalaria", 
    costPrice: 90.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "6", 
    name: "ALTOA SUS", 
    price: 50.00, 
    stock: 3, 
    category: "Gastric", 
    costPrice: 30.00,
    formulations: ["Suspension"],
    manufacturer: "Altoa"
  },
  { 
    id: "7", 
    name: "AMOXCLAV TABS 625MG", 
    price: 600.00, 
    stock: 10.5, 
    category: "Antibiotics", 
    costPrice: 360.00,
    formulations: ["Tablets 625mg"],
    manufacturer: "GSK"
  },
  { 
    id: "8", 
    name: "AMOXYCILLIN 250MG", 
    price: 8.67, 
    stock: 250, 
    category: "Antibiotics", 
    costPrice: 5.00,
    formulations: ["Capsules 250mg", "Tablets 250mg"],
    manufacturer: "GSK"
  },
  { 
    id: "9", 
    name: "AMOXYCILLIN 500MG", 
    price: 10.00, 
    stock: 157, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Capsules 500mg", "Tablets 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "10", 
    name: "AMOXYCILLIN SYRUP 100ML", 
    price: 150.00, 
    stock: 11, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Syrup 125mg/5ml 100ml", "Syrup 250mg/5ml 100ml"],
    manufacturer: "GSK"
  },
  { 
    id: "11", 
    name: "AMOXYCILLIN SYRUP 60ML", 
    price: 50.00, 
    stock: 9, 
    category: "Antibiotics", 
    costPrice: 30.00,
    formulations: ["Syrup 125mg/5ml 60ml", "Syrup 250mg/5ml 60ml"],
    manufacturer: "GSK"
  },
  { 
    id: "12", 
    name: "AMOXYCLAV", 
    price: 350.00, 
    stock: 3, 
    category: "Antibiotics", 
    costPrice: 210.00,
    formulations: ["Tablets"],
    manufacturer: "GSK"
  },
  { 
    id: "13", 
    name: "AMPICLOX 500MG", 
    price: 10.00, 
    stock: 20, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Capsules 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "14", 
    name: "AMPICLOX SYRUP", 
    price: 150.00, 
    stock: 1, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Syrup"],
    manufacturer: "GSK"
  },
  { 
    id: "15", 
    name: "Ashton", 
    price: 10.00, 
    stock: 0, 
    category: "Teething powder", 
    costPrice: 6.00,
    formulations: ["Powder"],
    manufacturer: "Generic"
  },
  { 
    id: "16", 
    name: "ASPIRIN 75MG", 
    price: 10.00, 
    stock: 14, 
    category: "Cardiovascular", 
    costPrice: 6.00,
    formulations: ["Tablets 75mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "17", 
    name: "ATANOLO ONE 50MG", 
    price: 10.00, 
    stock: 38, 
    category: "Cardiovascular", 
    costPrice: 6.00,
    formulations: ["Tablets 50mg"],
    manufacturer: "Generic"
  },
  { 
    id: "18", 
    name: "Azithromycin syrup", 
    price: 150.00, 
    stock: 8, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Syrup"],
    manufacturer: "Pfizer"
  },
  { 
    id: "19", 
    name: "AZITHROMYCIN TABS 500MG", 
    price: 150.00, 
    stock: 3, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Tablets 500mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "20", 
    name: "BENACOFF", 
    price: 200.00, 
    stock: 2, 
    category: "Cough Expectorant", 
    costPrice: 120.00,
    formulations: ["Syrup"],
    manufacturer: "Benaroya"
  },
  { 
    id: "21", 
    name: "BENAFLU CAPS", 
    price: 20.00, 
    stock: 53, 
    category: "Respiratory", 
    costPrice: 12.00,
    formulations: ["Capsules"],
    manufacturer: "Benaroya"
  },
  { 
    id: "22", 
    name: "BETAMETHASONE", 
    price: 150.00, 
    stock: 3, 
    category: "Topical Steroids", 
    costPrice: 90.00,
    formulations: ["Cream", "Ointment"],
    manufacturer: "Generic"
  },
  { 
    id: "23", 
    name: "Bulkot", 
    price: 150.00, 
    stock: 2, 
    category: "Topical antifungal", 
    costPrice: 90.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "24", 
    name: "BULKOT-MIX", 
    price: 230.00, 
    stock: 2, 
    category: "Triple Action", 
    costPrice: 138.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "25", 
    name: "BURN CREAM", 
    price: 150.00, 
    stock: 0, 
    category: "Wound Care", 
    costPrice: 90.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "26", 
    name: "CADITAN H", 
    price: 20.00, 
    stock: 10, 
    category: "Cardiovascular", 
    costPrice: 12.00,
    formulations: ["Tablets"],
    manufacturer: "Cadila"
  },
  { 
    id: "27", 
    name: "CALPOL", 
    price: 450.00, 
    stock: 1, 
    category: "Analgesic", 
    costPrice: 270.00,
    formulations: ["Syrup"],
    manufacturer: "GSK"
  },
  { 
    id: "28", 
    name: "CANOID", 
    price: 400.00, 
    stock: 1, 
    category: "Topical", 
    costPrice: 240.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "29", 
    name: "CARBIMAZOLE", 
    price: 5.00, 
    stock: 31, 
    category: "Antithyroid", 
    costPrice: 3.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "30", 
    name: "CEFIXIME 400MG", 
    price: 350.00, 
    stock: 0, 
    category: "Antibiotics", 
    costPrice: 210.00,
    formulations: ["Tablets 400mg"],
    manufacturer: "Lupin"
  },
  { 
    id: "31", 
    name: "CEFTRIAXONE", 
    price: 400.00, 
    stock: 12, 
    category: "Antibiotics", 
    costPrice: 240.00,
    formulations: ["Injection 1g", "Injection 2g"],
    manufacturer: "Roche"
  },
  { 
    id: "32", 
    name: "CEFUROXIME 500MG", 
    price: 60.00, 
    stock: 10, 
    category: "Antibiotics", 
    costPrice: 36.00,
    formulations: ["Tablets 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "33", 
    name: "CELABET", 
    price: 20.00, 
    stock: 45, 
    category: "Antihistamine", 
    costPrice: 12.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "34", 
    name: "CELECOXIB CAPS", 
    price: 20.00, 
    stock: 57, 
    category: "Analgesic", 
    costPrice: 12.00,
    formulations: ["Capsules"],
    manufacturer: "Pfizer"
  },
  { 
    id: "35", 
    name: "CETIRIZINE SYRUP", 
    price: 50.00, 
    stock: 5, 
    category: "Antihistamine", 
    costPrice: 30.00,
    formulations: ["Syrup"],
    manufacturer: "UCB"
  },
  { 
    id: "36", 
    name: "CETIRIZINE TABS", 
    price: 10.00, 
    stock: 104, 
    category: "Antihistamine", 
    costPrice: 6.00,
    formulations: ["Tablets 10mg"],
    manufacturer: "UCB"
  },
  { 
    id: "37", 
    name: "CIPRO TABS 500MG", 
    price: 10.00, 
    stock: 185, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Tablets 500mg"],
    manufacturer: "Bayer"
  },
  { 
    id: "38", 
    name: "Clean Gloves", 
    price: 5.00, 
    stock: 86, 
    category: "Medical Supplies", 
    costPrice: 3.00,
    formulations: ["Disposable Gloves"],
    manufacturer: "Generic"
  },
  { 
    id: "39", 
    name: "CLOCOMAT", 
    price: 100.00, 
    stock: 2, 
    category: "Diabetes", 
    costPrice: 60.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "40", 
    name: "CLOSO B", 
    price: 100.00, 
    stock: 1, 
    category: "Topical", 
    costPrice: 60.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "41", 
    name: "CLOTRIMAZOLE", 
    price: 150.00, 
    stock: 2, 
    category: "Antifungal", 
    costPrice: 90.00,
    formulations: ["Cream", "Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "42", 
    name: "CLOTRIMAZOLE PESSARIES", 
    price: 100.00, 
    stock: 1, 
    category: "Antifungal", 
    costPrice: 60.00,
    formulations: ["Pessaries"],
    manufacturer: "Generic"
  },
  { 
    id: "43", 
    name: "COTRIMOXAZOLE 480MG", 
    price: 7.50, 
    stock: 110, 
    category: "Antibiotics", 
    costPrice: 4.50,
    formulations: ["Tablets 480mg"],
    manufacturer: "Generic"
  },
  { 
    id: "44", 
    name: "COTRIMOXAZOLE 960MG", 
    price: 15.00, 
    stock: 80, 
    category: "Antibiotics", 
    costPrice: 9.00,
    formulations: ["Tablets 960mg"],
    manufacturer: "Generic"
  },
  { 
    id: "45", 
    name: "COTRIMOXAZOLE SYRUP 100ML", 
    price: 150.00, 
    stock: 4, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "Generic"
  },
  { 
    id: "46", 
    name: "COTRIMOXAZOLE SYRUP 60ML", 
    price: 100.00, 
    stock: 2, 
    category: "Antibiotics", 
    costPrice: 60.00,
    formulations: ["Syrup 60ml"],
    manufacturer: "Generic"
  },
  { 
    id: "47", 
    name: "CPM SYRUP", 
    price: 50.00, 
    stock: 5, 
    category: "Antihistamine", 
    costPrice: 30.00,
    formulations: ["Syrup"],
    manufacturer: "Generic"
  },
  { 
    id: "48", 
    name: "CPM Tabs", 
    price: 3.00, 
    stock: 85, 
    category: "Antihistamine", 
    costPrice: 2.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "49", 
    name: "CREPE BANDAGES", 
    price: 50.00, 
    stock: 4, 
    category: "Surgical Supplies", 
    costPrice: 30.00,
    formulations: ["Bandages"],
    manufacturer: "Generic"
  },
  { 
    id: "50", 
    name: "CYPRO B", 
    price: 20.00, 
    stock: 25, 
    category: "Appetite Stimulant", 
    costPrice: 12.00,
    formulations: ["Tablets"],
    manufacturer: "Cipla"
  },
  { 
    id: "51", 
    name: "CYPRO B SYRUP", 
    price: 500.00, 
    stock: 1, 
    category: "Appetite Stimulant", 
    costPrice: 300.00,
    formulations: ["Syrup"],
    manufacturer: "Cipla"
  },
  { 
    id: "52", 
    name: "D10", 
    price: 400.00, 
    stock: 0, 
    category: "IV Fluids", 
    costPrice: 240.00,
    formulations: ["IV Fluid"],
    manufacturer: "Generic"
  },
  { 
    id: "53", 
    name: "D5", 
    price: 300.00, 
    stock: 2, 
    category: "IV Fluids", 
    costPrice: 180.00,
    formulations: ["IV Fluid"],
    manufacturer: "Generic"
  },
  { 
    id: "54", 
    name: "D50", 
    price: 400.00, 
    stock: 0, 
    category: "IV Fluids", 
    costPrice: 240.00,
    formulations: ["IV Fluid"],
    manufacturer: "Generic"
  },
  { 
    id: "55", 
    name: "DACOLD", 
    price: 200.00, 
    stock: 0, 
    category: "Cold & Flu", 
    costPrice: 120.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "56", 
    name: "DEPO PROVERA INJ.", 
    price: 250.00, 
    stock: 1, 
    category: "Injectable Contraceptives", 
    costPrice: 150.00,
    formulations: ["Injection"],
    manufacturer: "Pfizer"
  },
  { 
    id: "57", 
    name: "DICLOFENAC GEL", 
    price: 150.00, 
    stock: 3, 
    category: "Topical Pain Relief", 
    costPrice: 90.00,
    formulations: ["Gel"],
    manufacturer: "Novartis"
  },
  { 
    id: "58", 
    name: "DICLOFENAC INJ.", 
    price: 200.00, 
    stock: 9, 
    category: "Analgesic", 
    costPrice: 120.00,
    formulations: ["Injection"],
    manufacturer: "Novartis"
  },
  { 
    id: "59", 
    name: "DICLOFENAC TABS", 
    price: 10.00, 
    stock: 118, 
    category: "Pain Relief", 
    costPrice: 6.00,
    formulations: ["Tablets 50mg", "Tablets 75mg"],
    manufacturer: "Novartis"
  },
  { 
    id: "60", 
    name: "Diclomol", 
    price: 10.00, 
    stock: 45, 
    category: "Pain relief", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "61", 
    name: "DOXYCYCLINE 100MG", 
    price: 10.00, 
    stock: 104, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Capsules 100mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "62", 
    name: "EASYPLAN TABS", 
    price: 100.00, 
    stock: 0, 
    category: "Emergency Contraception", 
    costPrice: 60.00,
    formulations: ["Tablets"],
    manufacturer: "Cosmos"
  },
  { 
    id: "63", 
    name: "EFLARON PLUS", 
    price: 15.00, 
    stock: 30, 
    category: "Antibiotics", 
    costPrice: 9.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "64", 
    name: "ENALAPRIL 10MG", 
    price: 5.00, 
    stock: 33, 
    category: "Cardiovascular", 
    costPrice: 3.00,
    formulations: ["Tablets 10mg"],
    manufacturer: "Merck"
  },
  { 
    id: "65", 
    name: "ENALAPRIL 5MG", 
    price: 5.00, 
    stock: 70, 
    category: "Cardiovascular", 
    costPrice: 3.00,
    formulations: ["Tablets 5mg"],
    manufacturer: "Merck"
  },
  { 
    id: "66", 
    name: "Epiderm Cream", 
    price: 150.00, 
    stock: 0, 
    category: "Topical", 
    costPrice: 90.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "67", 
    name: "ESOMEPRAZOLE IV", 
    price: 300.00, 
    stock: 3, 
    category: "Injectable Gastric", 
    costPrice: 180.00,
    formulations: ["Injection"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "68", 
    name: "FEMIPLAN PILLS", 
    price: 100.00, 
    stock: 4, 
    category: "Contraception", 
    costPrice: 60.00,
    formulations: ["Pills"],
    manufacturer: "Organon"
  },
  { 
    id: "69", 
    name: "FERROUS SULPHATE", 
    price: 10.00, 
    stock: 25, 
    category: "Supplements", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "70", 
    name: "FLEXOR CAPS", 
    price: 20.00, 
    stock: 41, 
    category: "Analgesic", 
    costPrice: 12.00,
    formulations: ["Capsules"],
    manufacturer: "Torrent"
  },
  { 
    id: "71", 
    name: "FLUCLOXACILLIN 250MG", 
    price: 7.50, 
    stock: 100, 
    category: "Antibiotics", 
    costPrice: 4.50,
    formulations: ["Capsules 250mg"],
    manufacturer: "GSK"
  },
  { 
    id: "72", 
    name: "FLUCLOXACILLIN 500MG", 
    price: 10.00, 
    stock: 90, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Capsules 500mg"],
    manufacturer: "GSK"
  },
  { 
    id: "73", 
    name: "FLUCLOXACILLIN SYRUP 100ML", 
    price: 200.00, 
    stock: 2, 
    category: "Antibiotics", 
    costPrice: 120.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "GSK"
  },
  { 
    id: "74", 
    name: "Fluconazole 150mg", 
    price: 100.00, 
    stock: 16, 
    category: "Antifungal", 
    costPrice: 60.00,
    formulations: ["Capsules 150mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "75", 
    name: "FRAGYL 200MG", 
    price: 8.67, 
    stock: 120, 
    category: "Antibiotics", 
    costPrice: 5.00,
    formulations: ["Tablets 200mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "76", 
    name: "FRAGYL 400MG", 
    price: 10.00, 
    stock: 95, 
    category: "Antibiotics", 
    costPrice: 6.00,
    formulations: ["Tablets 400mg"],
    manufacturer: "Sanofi"
  },
  { 
    id: "77", 
    name: "GENTA EAR/EYE DROP", 
    price: 100.00, 
    stock: 1, 
    category: "Antibiotics", 
    costPrice: 60.00,
    formulations: ["Drops"],
    manufacturer: "Generic"
  },
  { 
    id: "78", 
    name: "GRIESOFULVIN 250MG", 
    price: 15.00, 
    stock: 90, 
    category: "Antifungal", 
    costPrice: 9.00,
    formulations: ["Tablets 250mg"],
    manufacturer: "Generic"
  },
  { 
    id: "79", 
    name: "GRIESOFULVIN 500MG", 
    price: 20.00, 
    stock: 80, 
    category: "Antifungal", 
    costPrice: 12.00,
    formulations: ["Tablets 500mg"],
    manufacturer: "Generic"
  },
  { 
    id: "80", 
    name: "HIV TEST KIT", 
    price: 200.00, 
    stock: 1, 
    category: "Diagnostics", 
    costPrice: 120.00,
    formulations: ["Test Kit"],
    manufacturer: "Abbott"
  },
  { 
    id: "81", 
    name: "HTCZ 25MG", 
    price: 3.00, 
    stock: 5, 
    category: "Diuretics", 
    costPrice: 2.00,
    formulations: ["Tablets 25mg"],
    manufacturer: "Generic"
  },
  { 
    id: "82", 
    name: "HTCZ 50MG", 
    price: 50.00, 
    stock: 12, 
    category: "Diuretics", 
    costPrice: 30.00,
    formulations: ["Tablets 50mg"],
    manufacturer: "Generic"
  },
  { 
    id: "83", 
    name: "HYDROCORTISONE CREAM", 
    price: 150.00, 
    stock: 5, 
    category: "Topical Steroids", 
    costPrice: 90.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "84", 
    name: "HYDROCORTISONE INJECTION", 
    price: 300.00, 
    stock: 4, 
    category: "Injectable Steroids", 
    costPrice: 180.00,
    formulations: ["Injection"],
    manufacturer: "Generic"
  },
  { 
    id: "85", 
    name: "HYDROGEN PEROXIDE", 
    price: 50.00, 
    stock: 2, 
    category: "Antiseptic", 
    costPrice: 30.00,
    formulations: ["Solution"],
    manufacturer: "Generic"
  },
  { 
    id: "86", 
    name: "HYOSCINE INJECTION", 
    price: 200.00, 
    stock: 9, 
    category: "Antispasmodic", 
    costPrice: 120.00,
    formulations: ["Injection"],
    manufacturer: "Boehringer"
  },
  { 
    id: "87", 
    name: "Hyoscine syrup", 
    price: 150.00, 
    stock: 2, 
    category: "Pain Relief", 
    costPrice: 90.00,
    formulations: ["Syrup"],
    manufacturer: "Boehringer"
  },
  { 
    id: "88", 
    name: "HYOSCINE TABS", 
    price: 10.00, 
    stock: 93, 
    category: "Antispasmodic", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Boehringer"
  },
  { 
    id: "89", 
    name: "IBUGESIC", 
    price: 300.00, 
    stock: 1, 
    category: "Antipyretic", 
    costPrice: 180.00,
    formulations: ["Syrup"],
    manufacturer: "Generic"
  },
  { 
    id: "90", 
    name: "IBUPROFEN 100ML", 
    price: 100.00, 
    stock: 2, 
    category: "Pain Relief", 
    costPrice: 60.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "Generic"
  },
  { 
    id: "91", 
    name: "IBUPROFEN 200MG", 
    price: 4.50, 
    stock: 198, 
    category: "Pain Relief", 
    costPrice: 3.00,
    formulations: ["Tablets 200mg"],
    manufacturer: "Generic"
  },
  { 
    id: "92", 
    name: "IBUPROFEN 400MG", 
    price: 5.00, 
    stock: 257, 
    category: "Pain Relief", 
    costPrice: 3.00,
    formulations: ["Tablets 400mg"],
    manufacturer: "Generic"
  },
  { 
    id: "93", 
    name: "IBUPROFEN 60ML", 
    price: 50.00, 
    stock: 1, 
    category: "Pain Relief", 
    costPrice: 30.00,
    formulations: ["Syrup 60ml"],
    manufacturer: "Generic"
  },
  { 
    id: "94", 
    name: "Implant insertion", 
    price: 800.00, 
    stock: 0, 
    category: "Long term Contraceptive", 
    costPrice: 480.00,
    formulations: ["Service"],
    manufacturer: "Service"
  },
  { 
    id: "95", 
    name: "Kaluma Lozagens", 
    price: 10.00, 
    stock: 96, 
    category: "Sore throat relievers", 
    costPrice: 6.00,
    formulations: ["Lozenges"],
    manufacturer: "Generic"
  },
  { 
    id: "96", 
    name: "KETOCONAZOLE CREAM", 
    price: 350.00, 
    stock: 1, 
    category: "Antifungal", 
    costPrice: 210.00,
    formulations: ["Cream"],
    manufacturer: "Janssen"
  },
  { 
    id: "97", 
    name: "KETOCONAZOLE TABS 200MG", 
    price: 7.50, 
    stock: 90, 
    category: "Antifungal", 
    costPrice: 4.50,
    formulations: ["Tablets 200mg"],
    manufacturer: "Janssen"
  },
  { 
    id: "98", 
    name: "KOFGON SYRUP", 
    price: 150.00, 
    stock: 2, 
    category: "Cough Syrup", 
    costPrice: 90.00,
    formulations: ["Syrup"],
    manufacturer: "Lupin"
  },
  { 
    id: "99", 
    name: "LOPERAMIDE", 
    price: 50.00, 
    stock: 3, 
    category: "Antidiarrheal", 
    costPrice: 30.00,
    formulations: ["Capsules"],
    manufacturer: "Janssen"
  },
  { 
    id: "100", 
    name: "MAGNACID", 
    price: 200.00, 
    stock: 1, 
    category: "Antacid", 
    costPrice: 120.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "101", 
    name: "MARA MOJA", 
    price: 10.00, 
    stock: 45, 
    category: "Analgesic", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Cosmos"
  },
  { 
    id: "102", 
    name: "Mediven", 
    price: 150.00, 
    stock: 3, 
    category: "Topical cortisol", 
    costPrice: 90.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "103", 
    name: "MEFANAMIC ACID", 
    price: 10.00, 
    stock: 75, 
    category: "Pain Relief", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "104", 
    name: "MELONAC 7.5MG TABS", 
    price: 10.00, 
    stock: 48, 
    category: "Pain Relief", 
    costPrice: 6.00,
    formulations: ["Tablets 7.5mg"],
    manufacturer: "Generic"
  },
  { 
    id: "105", 
    name: "Metformin 500mg", 
    price: 100.00, 
    stock: 2, 
    category: "Antidiabetic", 
    costPrice: 60.00,
    formulations: ["Tablets 500mg"],
    manufacturer: "Teva"
  },
  { 
    id: "106", 
    name: "Metronidazole cream 20mg", 
    price: 400.00, 
    stock: 2, 
    category: "Topical antibiotic", 
    costPrice: 240.00,
    formulations: ["Cream"],
    manufacturer: "Sanofi"
  },
  { 
    id: "107", 
    name: "METRONIDAZOLE IV", 
    price: 300.00, 
    stock: 4, 
    category: "Injectable Antibiotics", 
    costPrice: 180.00,
    formulations: ["Injection"],
    manufacturer: "Sanofi"
  },
  { 
    id: "108", 
    name: "METRONIDAZOLE SYRUP 50ML", 
    price: 50.00, 
    stock: 6, 
    category: "Antibiotics", 
    costPrice: 30.00,
    formulations: ["Syrup 50ml"],
    manufacturer: "Sanofi"
  },
  { 
    id: "109", 
    name: "MOUTHWASH BESTDINE", 
    price: 200.00, 
    stock: 4, 
    category: "Oral Care", 
    costPrice: 120.00,
    formulations: ["Mouthwash"],
    manufacturer: "Generic"
  },
  { 
    id: "110", 
    name: "MOUTHWASH PEARDINE", 
    price: 200.00, 
    stock: 1, 
    category: "Oral Care", 
    costPrice: 120.00,
    formulations: ["Mouthwash"],
    manufacturer: "Generic"
  },
  { 
    id: "111", 
    name: "MOUTHWASH REMIDIN", 
    price: 650.00, 
    stock: 1, 
    category: "Oral Care", 
    costPrice: 390.00,
    formulations: ["Mouthwash"],
    manufacturer: "Generic"
  },
  { 
    id: "112", 
    name: "MYONAC MR", 
    price: 30.00, 
    stock: 0, 
    category: "Strong Analgesic and Muscle Relaxant", 
    costPrice: 18.00,
    formulations: ["Tablets"],
    manufacturer: "Lupin"
  },
  { 
    id: "113", 
    name: "MYOSPAZ TABS", 
    price: 30.00, 
    stock: 38, 
    category: "Muscle Relaxant", 
    costPrice: 18.00,
    formulations: ["Tablets"],
    manufacturer: "Lupin"
  },
  { 
    id: "114", 
    name: "NASAL DROPS", 
    price: 50.00, 
    stock: 5, 
    category: "Respiratory", 
    costPrice: 30.00,
    formulations: ["Drops"],
    manufacturer: "Generic"
  },
  { 
    id: "115", 
    name: "NEBANOL PODWER", 
    price: 150.00, 
    stock: 5, 
    category: "Topical", 
    costPrice: 90.00,
    formulations: ["Powder"],
    manufacturer: "Generic"
  },
  { 
    id: "116", 
    name: "NICOF 60ML", 
    price: 60.00, 
    stock: 5, 
    category: "Expectorant", 
    costPrice: 36.00,
    formulations: ["Syrup 60ml"],
    manufacturer: "Cipla"
  },
  { 
    id: "117", 
    name: "NICOF SYRUP", 
    price: 100.00, 
    stock: 1, 
    category: "Cough Expectorant", 
    costPrice: 60.00,
    formulations: ["Syrup"],
    manufacturer: "Cipla"
  },
  { 
    id: "118", 
    name: "NIFEDIPINE", 
    price: 30.00, 
    stock: 259, 
    category: "Cardiovascular", 
    costPrice: 18.00,
    formulations: ["Tablets"],
    manufacturer: "Bayer"
  },
  { 
    id: "119", 
    name: "NOSIC", 
    price: 40.00, 
    stock: 20, 
    category: "Antivomiting", 
    costPrice: 24.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "120", 
    name: "NS", 
    price: 300.00, 
    stock: 3, 
    category: "IV Fluids", 
    costPrice: 180.00,
    formulations: ["IV Fluid"],
    manufacturer: "Generic"
  },
  { 
    id: "121", 
    name: "NYLON 2RC", 
    price: 100.00, 
    stock: 11, 
    category: "Surgical Supplies", 
    costPrice: 60.00,
    formulations: ["Suture"],
    manufacturer: "Generic"
  },
  { 
    id: "122", 
    name: "NYSTATIN 12ML", 
    price: 50.00, 
    stock: 11, 
    category: "Antifungal", 
    costPrice: 30.00,
    formulations: ["Drops 12ml"],
    manufacturer: "Bristol Myers"
  },
  { 
    id: "123", 
    name: "OMEPRAZOLE", 
    price: 10.00, 
    stock: 17, 
    category: "Gastric", 
    costPrice: 6.00,
    formulations: ["Capsules"],
    manufacturer: "AstraZeneca"
  },
  { 
    id: "124", 
    name: "ONECID", 
    price: 200.00, 
    stock: 4, 
    category: "Gastric", 
    costPrice: 120.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "125", 
    name: "ORS", 
    price: 50.00, 
    stock: 1, 
    category: "Rehydration", 
    costPrice: 30.00,
    formulations: ["Sachets"],
    manufacturer: "WHO"
  },
  { 
    id: "126", 
    name: "P2", 
    price: 200.00, 
    stock: 0, 
    category: "Emergency Contraception", 
    costPrice: 120.00,
    formulations: ["Tablet"],
    manufacturer: "Gedeon Richter"
  },
  { 
    id: "127", 
    name: "PANADOL EXTRA", 
    price: 10.00, 
    stock: 104, 
    category: "Pain Relief", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "GSK"
  },
  { 
    id: "128", 
    name: "Paracetamol", 
    price: 5.00, 
    stock: 187, 
    category: "Pain Relief", 
    costPrice: 3.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "129", 
    name: "PCM 100", 
    price: 100.00, 
    stock: 4, 
    category: "Pain Relief", 
    costPrice: 60.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "Generic"
  },
  { 
    id: "130", 
    name: "PCM 60ML", 
    price: 50.00, 
    stock: 2, 
    category: "Pain Relief", 
    costPrice: 30.00,
    formulations: ["Syrup 60ml"],
    manufacturer: "Generic"
  },
  { 
    id: "131", 
    name: "PCM IV", 
    price: 300.00, 
    stock: 1, 
    category: "Injectable Pain Relief", 
    costPrice: 180.00,
    formulations: ["Injection"],
    manufacturer: "Generic"
  },
  { 
    id: "132", 
    name: "PDL SYRUP", 
    price: 150.00, 
    stock: 1, 
    category: "Steroids", 
    costPrice: 90.00,
    formulations: ["Syrup"],
    manufacturer: "Generic"
  },
  { 
    id: "133", 
    name: "PDT", 
    price: 50.00, 
    stock: 8, 
    category: "Diagnostic test", 
    costPrice: 30.00,
    formulations: ["Test"],
    manufacturer: "Generic"
  },
  { 
    id: "134", 
    name: "PIROXICAM", 
    price: 10.00, 
    stock: 48, 
    category: "Pain Relief", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "135", 
    name: "POLYBENVITE 100MLS", 
    price: 200.00, 
    stock: 2, 
    category: "Supplements", 
    costPrice: 120.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "Generic"
  },
  { 
    id: "136", 
    name: "PREDNISOLONE TABS 5MG", 
    price: 30.00, 
    stock: 16, 
    category: "Steroids", 
    costPrice: 18.00,
    formulations: ["Tablets 5mg"],
    manufacturer: "Pfizer"
  },
  { 
    id: "137", 
    name: "PROMEZINE SYRUP", 
    price: 70.00, 
    stock: 8, 
    category: "Antihistamine", 
    costPrice: 42.00,
    formulations: ["Syrup"],
    manufacturer: "Generic"
  },
  { 
    id: "138", 
    name: "PROMEZINE TABLETS 10MG", 
    price: 10.00, 
    stock: 275, 
    category: "Antihistamine", 
    costPrice: 6.00,
    formulations: ["Tablets 10mg"],
    manufacturer: "Generic"
  },
  { 
    id: "139", 
    name: "PROMIVIT 100MLS", 
    price: 200.00, 
    stock: 2, 
    category: "Supplements", 
    costPrice: 120.00,
    formulations: ["Syrup 100ml"],
    manufacturer: "Generic"
  },
  { 
    id: "140", 
    name: "PROMIVIT 60MLS", 
    price: 100.00, 
    stock: 3, 
    category: "Supplements", 
    costPrice: 60.00,
    formulations: ["Syrup 60ml"],
    manufacturer: "Generic"
  },
  { 
    id: "141", 
    name: "RANFERON", 
    price: 600.00, 
    stock: 1, 
    category: "Supplements", 
    costPrice: 360.00,
    formulations: ["Syrup"],
    manufacturer: "Generic"
  },
  { 
    id: "142", 
    name: "RL", 
    price: 300.00, 
    stock: 1, 
    category: "IV Fluids", 
    costPrice: 180.00,
    formulations: ["IV Fluid"],
    manufacturer: "Generic"
  },
  { 
    id: "143", 
    name: "Safe - 72", 
    price: 100.00, 
    stock: 6, 
    category: "Emergency Contraceptive", 
    costPrice: 60.00,
    formulations: ["Tablet"],
    manufacturer: "Generic"
  },
  { 
    id: "144", 
    name: "Seclofen MR", 
    price: 20.00, 
    stock: 68, 
    category: "analgesic and muscle relaxant", 
    costPrice: 12.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "145", 
    name: "SENIDOL", 
    price: 100.00, 
    stock: 5, 
    category: "Anti amoeba", 
    costPrice: 60.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "146", 
    name: "SSD", 
    price: 100.00, 
    stock: 2, 
    category: "Wound Care", 
    costPrice: 60.00,
    formulations: ["Cream"],
    manufacturer: "Generic"
  },
  { 
    id: "147", 
    name: "Steron", 
    price: 30.00, 
    stock: 4, 
    category: "Hormone", 
    costPrice: 18.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "148", 
    name: "Tamsulosin 0.4mg", 
    price: 20.00, 
    stock: 30, 
    category: "Bleeding disorders", 
    costPrice: 12.00,
    formulations: ["Tablets 0.4mg"],
    manufacturer: "Generic"
  },
  { 
    id: "149", 
    name: "TEO", 
    price: 70.00, 
    stock: 5, 
    category: "Bronchodilator", 
    costPrice: 42.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "150", 
    name: "TINIDAZOLE", 
    price: 50.00, 
    stock: 15, 
    category: "Antibiotics", 
    costPrice: 30.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "151", 
    name: "TRAMADOL", 
    price: 200.00, 
    stock: 8, 
    category: "Pain Relief", 
    costPrice: 120.00,
    formulations: ["Tablets"],
    manufacturer: "Grünenthal"
  },
  { 
    id: "152", 
    name: "TRAMADOL 50mg", 
    price: 10.00, 
    stock: 0, 
    category: "Analgesic", 
    costPrice: 6.00,
    formulations: ["Tablets 50mg"],
    manufacturer: "Grünenthal"
  },
  { 
    id: "153", 
    name: "TRIDEX", 
    price: 70.00, 
    stock: 0, 
    category: "Cough Mixture", 
    costPrice: 42.00,
    formulations: ["Syrup"],
    manufacturer: "Cadila"
  },
  { 
    id: "154", 
    name: "TRIDEX", 
    price: 100.00, 
    stock: 5, 
    category: "Cough Mixture", 
    costPrice: 60.00,
    formulations: ["Syrup"],
    manufacturer: "Cadila"
  },
  { 
    id: "155", 
    name: "TRUST", 
    price: 50.00, 
    stock: 0, 
    category: "Contraception", 
    costPrice: 30.00,
    formulations: ["Condoms"],
    manufacturer: "Trust"
  },
  { 
    id: "156", 
    name: "TRUST STRANDED", 
    price: 100.00, 
    stock: 0, 
    category: "Contraceptive", 
    costPrice: 60.00,
    formulations: ["Condoms"],
    manufacturer: "Trust"
  },
  { 
    id: "157", 
    name: "TT 20DOSES", 
    price: 200.00, 
    stock: 18, 
    category: "Vaccines", 
    costPrice: 120.00,
    formulations: ["Injection"],
    manufacturer: "Serum Institute"
  },
  { 
    id: "158", 
    name: "Tumbocid", 
    price: 10.00, 
    stock: 44, 
    category: "Antacid", 
    costPrice: 6.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "159", 
    name: "VIT C", 
    price: 50.00, 
    stock: 9, 
    category: "Supplements", 
    costPrice: 30.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
  },
  { 
    id: "160", 
    name: "X PEN", 
    price: 150.00, 
    stock: 5, 
    category: "Antibiotics", 
    costPrice: 90.00,
    formulations: ["Injection"],
    manufacturer: "Generic"
  },
  { 
    id: "161", 
    name: "ZOMEP ES 20MG", 
    price: 10.00, 
    stock: 110, 
    category: "Gastric", 
    costPrice: 6.00,
    formulations: ["Tablets 20mg"],
    manufacturer: "Zydus"
  },
  { 
    id: "162", 
    name: "ZOMEP ES 40MG", 
    price: 20.00, 
    stock: 116, 
    category: "Gastric", 
    costPrice: 12.00,
    formulations: ["Tablets 40mg"],
    manufacturer: "Zydus"
  },
  { 
    id: "163", 
    name: "ZULU MR", 
    price: 50.00, 
    stock: 5, 
    category: "Muscle Relaxant", 
    costPrice: 30.00,
    formulations: ["Tablets"],
    manufacturer: "Generic"
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