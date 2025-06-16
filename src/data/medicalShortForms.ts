export const medicalShortForms = [
  { code: 'OD', description: 'Once daily', timesPerDay: 1 },
  { code: 'BD', description: 'Twice daily', timesPerDay: 2 },
  { code: 'TDS', description: 'Three times daily', timesPerDay: 3 },
  { code: 'QID', description: 'Four times daily', timesPerDay: 4 },
  { code: 'Q6H', description: 'Every 6 hours', timesPerDay: 4 },
  { code: 'Q8H', description: 'Every 8 hours', timesPerDay: 3 },
  { code: 'Q12H', description: 'Every 12 hours', timesPerDay: 2 },
  { code: 'PRN', description: 'As needed', timesPerDay: 0 },
  { code: 'STAT', description: 'Immediately', timesPerDay: 1 },
  { code: 'NOCTE', description: 'At night', timesPerDay: 1 },
  { code: 'MANE', description: 'In the morning', timesPerDay: 1 },
  { code: 'AC', description: 'Before meals', timesPerDay: 3 },
  { code: 'PC', description: 'After meals', timesPerDay: 3 },
  { code: 'HS', description: 'At bedtime', timesPerDay: 1 },
  { code: 'Q4H', description: 'Every 4 hours', timesPerDay: 6 },
  { code: 'Q2H', description: 'Every 2 hours', timesPerDay: 12 },
  { code: 'WEEKLY', description: 'Once weekly', timesPerDay: 0.14 },
  { code: 'MONTHLY', description: 'Once monthly', timesPerDay: 0.033 }
];

export const calculateTotalQuantity = (frequency: string, duration: number): number => {
  const shortForm = medicalShortForms.find(sf => sf.code === frequency);
  if (!shortForm) return duration;
  
  if (frequency === 'PRN') return Math.ceil(duration / 2); // Estimate for PRN
  if (frequency === 'WEEKLY') return Math.ceil(duration / 7);
  if (frequency === 'MONTHLY') return Math.ceil(duration / 30);
  
  return Math.ceil(shortForm.timesPerDay * duration);
};