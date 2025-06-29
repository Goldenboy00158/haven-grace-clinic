export interface VitalSignsNormal {
  parameter: string;
  normalRange: {
    min?: number;
    max?: number;
    optimal?: string;
    unit: string;
  };
  ageGroup?: 'adult' | 'child' | 'elderly';
  gender?: 'male' | 'female' | 'both';
}

export const vitalSignsNormals: VitalSignsNormal[] = [
  // Blood Pressure
  {
    parameter: 'systolic',
    normalRange: { min: 90, max: 120, unit: 'mmHg', optimal: '90-120' },
    ageGroup: 'adult'
  },
  {
    parameter: 'diastolic', 
    normalRange: { min: 60, max: 80, unit: 'mmHg', optimal: '60-80' },
    ageGroup: 'adult'
  },
  // Temperature
  {
    parameter: 'temperature',
    normalRange: { min: 36.1, max: 37.2, unit: '°C', optimal: '36.1-37.2' },
    ageGroup: 'adult'
  },
  // Pulse/Heart Rate
  {
    parameter: 'pulse',
    normalRange: { min: 60, max: 100, unit: 'bpm', optimal: '60-100' },
    ageGroup: 'adult'
  },
  // Respiratory Rate
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 12, max: 20, unit: '/min', optimal: '12-20' },
    ageGroup: 'adult'
  },
  // Weight (BMI categories will be calculated)
  {
    parameter: 'weight',
    normalRange: { min: 18.5, max: 24.9, unit: 'BMI', optimal: '18.5-24.9' },
    ageGroup: 'adult'
  },
  // Oxygen Saturation
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'adult'
  }
];

export interface VitalSignAssessment {
  value: number | string;
  status: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';
  message: string;
  color: string;
  bgColor: string;
  normalRange: string;
}

export const assessVitalSign = (
  parameter: string, 
  value: string | number, 
  age?: number, 
  gender?: string,
  height?: number
): VitalSignAssessment => {
  
  // Handle blood pressure specially (format: "120/80")
  if (parameter === 'bloodPressure' && typeof value === 'string') {
    return assessBloodPressure(value);
  }

  // Handle BMI calculation for weight
  if (parameter === 'weight' && height && typeof value === 'number') {
    return assessBMI(value, height);
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return {
      value,
      status: 'normal',
      message: 'Invalid value',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: 'N/A'
    };
  }

  const normal = vitalSignsNormals.find(n => n.parameter === parameter);
  if (!normal) {
    return {
      value,
      status: 'normal',
      message: 'No reference range available',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: 'N/A'
    };
  }

  const { min, max, optimal } = normal.normalRange;
  
  let status: VitalSignAssessment['status'] = 'normal';
  let message = 'Normal';
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';

  if (min !== undefined && numericValue < min) {
    if (numericValue < min * 0.8) { // Critical low (20% below minimum)
      status = 'critical_low';
      message = 'Critically Low';
      color = 'text-red-800';
      bgColor = 'bg-red-200';
    } else {
      status = 'low';
      message = 'Below Normal';
      color = 'text-yellow-700';
      bgColor = 'bg-yellow-100';
    }
  } else if (max !== undefined && numericValue > max) {
    if (numericValue > max * 1.2) { // Critical high (20% above maximum)
      status = 'critical_high';
      message = 'Critically High';
      color = 'text-red-800';
      bgColor = 'bg-red-200';
    } else {
      status = 'high';
      message = 'Above Normal';
      color = 'text-orange-700';
      bgColor = 'bg-orange-100';
    }
  }

  return {
    value: numericValue,
    status,
    message,
    color,
    bgColor,
    normalRange: optimal || 'N/A'
  };
};

const assessBloodPressure = (bpValue: string): VitalSignAssessment => {
  const bpMatch = bpValue.match(/(\d+)\/(\d+)/);
  if (!bpMatch) {
    return {
      value: bpValue,
      status: 'normal',
      message: 'Invalid format',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: '90-120/60-80 mmHg'
    };
  }

  const systolic = parseInt(bpMatch[1]);
  const diastolic = parseInt(bpMatch[2]);

  let status: VitalSignAssessment['status'] = 'normal';
  let message = 'Normal';
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';

  // Blood pressure categories (AHA guidelines)
  if (systolic >= 180 || diastolic >= 120) {
    status = 'critical_high';
    message = 'Hypertensive Crisis';
    color = 'text-red-800';
    bgColor = 'bg-red-200';
  } else if (systolic >= 140 || diastolic >= 90) {
    status = 'high';
    message = 'Stage 2 Hypertension';
    color = 'text-red-700';
    bgColor = 'bg-red-100';
  } else if (systolic >= 130 || diastolic >= 80) {
    status = 'high';
    message = 'Stage 1 Hypertension';
    color = 'text-orange-700';
    bgColor = 'bg-orange-100';
  } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    status = 'high';
    message = 'Elevated';
    color = 'text-yellow-700';
    bgColor = 'bg-yellow-100';
  } else if (systolic < 90 || diastolic < 60) {
    status = 'low';
    message = 'Hypotension';
    color = 'text-blue-700';
    bgColor = 'bg-blue-100';
  }

  return {
    value: bpValue,
    status,
    message,
    color,
    bgColor,
    normalRange: '90-120/60-80 mmHg'
  };
};

const assessBMI = (weight: number, height: number): VitalSignAssessment => {
  // Height should be in meters, weight in kg
  const heightInMeters = height > 3 ? height / 100 : height; // Convert cm to m if needed
  const bmi = weight / (heightInMeters * heightInMeters);

  let status: VitalSignAssessment['status'] = 'normal';
  let message = 'Normal Weight';
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';

  if (bmi < 16) {
    status = 'critical_low';
    message = 'Severely Underweight';
    color = 'text-red-800';
    bgColor = 'bg-red-200';
  } else if (bmi < 18.5) {
    status = 'low';
    message = 'Underweight';
    color = 'text-blue-700';
    bgColor = 'bg-blue-100';
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'normal';
    message = 'Normal Weight';
    color = 'text-green-600';
    bgColor = 'bg-green-100';
  } else if (bmi >= 25 && bmi < 30) {
    status = 'high';
    message = 'Overweight';
    color = 'text-yellow-700';
    bgColor = 'bg-yellow-100';
  } else if (bmi >= 30 && bmi < 35) {
    status = 'high';
    message = 'Obesity Class I';
    color = 'text-orange-700';
    bgColor = 'bg-orange-100';
  } else if (bmi >= 35 && bmi < 40) {
    status = 'critical_high';
    message = 'Obesity Class II';
    color = 'text-red-700';
    bgColor = 'bg-red-100';
  } else {
    status = 'critical_high';
    message = 'Obesity Class III';
    color = 'text-red-800';
    bgColor = 'bg-red-200';
  }

  return {
    value: parseFloat(bmi.toFixed(1)),
    status,
    message,
    color,
    bgColor,
    normalRange: '18.5-24.9 BMI'
  };
};

export const getVitalSignsInterpretation = (vitalSigns: any, age?: number, gender?: string, height?: number) => {
  const interpretations: Record<string, VitalSignAssessment> = {};

  if (vitalSigns.bloodPressure) {
    interpretations.bloodPressure = assessVitalSign('bloodPressure', vitalSigns.bloodPressure, age, gender);
  }

  if (vitalSigns.temperature) {
    interpretations.temperature = assessVitalSign('temperature', vitalSigns.temperature, age, gender);
  }

  if (vitalSigns.pulse) {
    interpretations.pulse = assessVitalSign('pulse', vitalSigns.pulse, age, gender);
  }

  if (vitalSigns.respiratoryRate) {
    interpretations.respiratoryRate = assessVitalSign('respiratoryRate', vitalSigns.respiratoryRate, age, gender);
  }

  if (vitalSigns.weight && height) {
    interpretations.bmi = assessVitalSign('weight', vitalSigns.weight, age, gender, height);
  }

  if (vitalSigns.oxygenSaturation) {
    interpretations.oxygenSaturation = assessVitalSign('oxygenSaturation', vitalSigns.oxygenSaturation, age, gender);
  }

  return interpretations;
};