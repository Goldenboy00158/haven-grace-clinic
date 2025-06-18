import { Service } from '../types';

export const services: Service[] = [
  {
    id: "1",
    name: "General Consultation",
    price: 500,
    category: "general_medicine",
    description: "Comprehensive medical examination and consultation"
  },
  {
    id: "2", 
    name: "Blood Pressure Check",
    price: 200,
    category: "general_medicine",
    description: "Blood pressure monitoring and assessment"
  },
  {
    id: "3",
    name: "Blood Sugar Test",
    price: 300,
    category: "diagnostics", 
    description: "Blood glucose level testing"
  },
  {
    id: "4",
    name: "Wound Dressing",
    price: 400,
    category: "procedures",
    description: "Professional wound cleaning and dressing"
  },
  {
    id: "5",
    name: "Injection Administration",
    price: 250,
    category: "procedures",
    description: "Safe administration of prescribed injections"
  },
  {
    id: "6",
    name: "Basic Laboratory Tests",
    price: 800,
    category: "diagnostics",
    description: "Basic blood and urine tests"
  },
  {
    id: "7",
    name: "ECG",
    price: 1000,
    category: "diagnostics",
    description: "Electrocardiogram for heart monitoring"
  },
  {
    id: "8",
    name: "X-Ray",
    price: 1500,
    category: "diagnostics",
    description: "Digital X-ray imaging services"
  },
  {
    id: "9",
    name: "Ultrasound",
    price: 2000,
    category: "diagnostics",
    description: "Ultrasound imaging and diagnostics"
  },
  {
    id: "10",
    name: "Minor Surgery",
    price: 5000,
    category: "procedures",
    description: "Minor surgical procedures and interventions"
  }
];