export interface VitalSignsNormal {
  parameter: string;
  normalRange: {
    min?: number;
    max?: number;
    optimal?: string;
    unit: string;
  };
  ageGroup: 'infant' | 'child' | 'adolescent' | 'adult' | 'elderly';
  ageRange: { min: number; max: number };
  gender?: 'male' | 'female' | 'both';
}

export const vitalSignsNormals: VitalSignsNormal[] = [
  // Blood Pressure - Age-based ranges
  // Infants (0-1 years)
  {
    parameter: 'systolic',
    normalRange: { min: 70, max: 100, unit: 'mmHg', optimal: '70-100' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  {
    parameter: 'diastolic',
    normalRange: { min: 50, max: 70, unit: 'mmHg', optimal: '50-70' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  // Children (2-12 years)
  {
    parameter: 'systolic',
    normalRange: { min: 80, max: 110, unit: 'mmHg', optimal: '80-110' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  {
    parameter: 'diastolic',
    normalRange: { min: 50, max: 75, unit: 'mmHg', optimal: '50-75' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  // Adolescents (13-17 years)
  {
    parameter: 'systolic',
    normalRange: { min: 90, max: 120, unit: 'mmHg', optimal: '90-120' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  {
    parameter: 'diastolic',
    normalRange: { min: 60, max: 80, unit: 'mmHg', optimal: '60-80' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  // Adults (18-64 years)
  {
    parameter: 'systolic',
    normalRange: { min: 90, max: 120, unit: 'mmHg', optimal: '90-120' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  {
    parameter: 'diastolic',
    normalRange: { min: 60, max: 80, unit: 'mmHg', optimal: '60-80' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  // Elderly (65+ years)
  {
    parameter: 'systolic',
    normalRange: { min: 90, max: 140, unit: 'mmHg', optimal: '90-140' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  },
  {
    parameter: 'diastolic',
    normalRange: { min: 60, max: 90, unit: 'mmHg', optimal: '60-90' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  },

  // Temperature - Age-based ranges
  // Infants
  {
    parameter: 'temperature',
    normalRange: { min: 36.4, max: 37.5, unit: '°C', optimal: '36.4-37.5' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  // Children
  {
    parameter: 'temperature',
    normalRange: { min: 36.1, max: 37.2, unit: '°C', optimal: '36.1-37.2' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  // Adolescents & Adults
  {
    parameter: 'temperature',
    normalRange: { min: 36.1, max: 37.2, unit: '°C', optimal: '36.1-37.2' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  {
    parameter: 'temperature',
    normalRange: { min: 36.1, max: 37.2, unit: '°C', optimal: '36.1-37.2' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  // Elderly
  {
    parameter: 'temperature',
    normalRange: { min: 36.0, max: 37.0, unit: '°C', optimal: '36.0-37.0' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  },

  // Pulse/Heart Rate - Age-based ranges
  // Infants
  {
    parameter: 'pulse',
    normalRange: { min: 100, max: 160, unit: 'bpm', optimal: '100-160' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  // Children
  {
    parameter: 'pulse',
    normalRange: { min: 80, max: 120, unit: 'bpm', optimal: '80-120' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  // Adolescents
  {
    parameter: 'pulse',
    normalRange: { min: 60, max: 100, unit: 'bpm', optimal: '60-100' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  // Adults
  {
    parameter: 'pulse',
    normalRange: { min: 60, max: 100, unit: 'bpm', optimal: '60-100' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  // Elderly
  {
    parameter: 'pulse',
    normalRange: { min: 60, max: 100, unit: 'bpm', optimal: '60-100' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  },

  // Respiratory Rate - Age-based ranges
  // Infants
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 30, max: 60, unit: '/min', optimal: '30-60' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  // Children
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 20, max: 30, unit: '/min', optimal: '20-30' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  // Adolescents
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 12, max: 20, unit: '/min', optimal: '12-20' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  // Adults
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 12, max: 20, unit: '/min', optimal: '12-20' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  // Elderly
  {
    parameter: 'respiratoryRate',
    normalRange: { min: 12, max: 24, unit: '/min', optimal: '12-24' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  },

  // Oxygen Saturation - All ages
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'infant',
    ageRange: { min: 0, max: 1 }
  },
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'child',
    ageRange: { min: 2, max: 12 }
  },
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'adolescent',
    ageRange: { min: 13, max: 17 }
  },
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'adult',
    ageRange: { min: 18, max: 64 }
  },
  {
    parameter: 'oxygenSaturation',
    normalRange: { min: 95, max: 100, unit: '%', optimal: '95-100' },
    ageGroup: 'elderly',
    ageRange: { min: 65, max: 120 }
  }
];

export interface VitalSignAssessment {
  value: number | string;
  status: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';
  message: string;
  color: string;
  bgColor: string;
  normalRange: string;
  ageGroup?: string;
}

const getAgeGroup = (age: number): string => {
  if (age < 2) return 'infant';
  if (age < 13) return 'child';
  if (age < 18) return 'adolescent';
  if (age < 65) return 'adult';
  return 'elderly';
};

export const assessVitalSign = (
  parameter: string, 
  value: string | number, 
  age?: number, 
  gender?: string,
  height?: number
): VitalSignAssessment => {
  
  // Handle blood pressure specially (format: "120/80")
  if (parameter === 'bloodPressure' && typeof value === 'string') {
    return assessBloodPressure(value, age);
  }

  // Handle BMI calculation for weight
  if (parameter === 'weight' && height && typeof value === 'number') {
    return assessBMI(value, height, age);
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

  // Find age-appropriate normal range
  const ageGroup = age ? getAgeGroup(age) : 'adult';
  const normal = vitalSignsNormals.find(n => 
    n.parameter === parameter && 
    (!age || (age >= n.ageRange.min && age <= n.ageRange.max))
  );

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
    normalRange: optimal || 'N/A',
    ageGroup: `${ageGroup} (${normal.ageRange.min}-${normal.ageRange.max} years)`
  };
};

const assessBloodPressure = (bpValue: string, age?: number): VitalSignAssessment => {
  const bpMatch = bpValue.match(/(\d+)\/(\d+)/);
  if (!bpMatch) {
    return {
      value: bpValue,
      status: 'normal',
      message: 'Invalid format',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: 'Invalid format'
    };
  }

  const systolic = parseInt(bpMatch[1]);
  const diastolic = parseInt(bpMatch[2]);
  const ageGroup = age ? getAgeGroup(age) : 'adult';

  // Get age-appropriate ranges
  const systolicNormal = vitalSignsNormals.find(n => 
    n.parameter === 'systolic' && 
    (!age || (age >= n.ageRange.min && age <= n.ageRange.max))
  );
  const diastolicNormal = vitalSignsNormals.find(n => 
    n.parameter === 'diastolic' && 
    (!age || (age >= n.ageRange.min && age <= n.ageRange.max))
  );

  if (!systolicNormal || !diastolicNormal) {
    return {
      value: bpValue,
      status: 'normal',
      message: 'No reference range available',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      normalRange: 'N/A'
    };
  }

  let status: VitalSignAssessment['status'] = 'normal';
  let message = 'Normal';
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';

  // Age-specific blood pressure assessment
  if (ageGroup === 'infant' || ageGroup === 'child') {
    // Pediatric BP assessment
    if (systolic > systolicNormal.normalRange.max! || diastolic > diastolicNormal.normalRange.max!) {
      status = 'high';
      message = 'Elevated for Age';
      color = 'text-orange-700';
      bgColor = 'bg-orange-100';
    } else if (systolic < systolicNormal.normalRange.min! || diastolic < diastolicNormal.normalRange.min!) {
      status = 'low';
      message = 'Low for Age';
      color = 'text-blue-700';
      bgColor = 'bg-blue-100';
    }
  } else {
    // Adult/Elderly BP assessment (AHA guidelines with age adjustments)
    const maxSystolic = ageGroup === 'elderly' ? 140 : 120;
    const maxDiastolic = ageGroup === 'elderly' ? 90 : 80;

    if (systolic >= 180 || diastolic >= 120) {
      status = 'critical_high';
      message = 'Hypertensive Crisis';
      color = 'text-red-800';
      bgColor = 'bg-red-200';
    } else if (systolic >= 140 || diastolic >= 90) {
      status = 'high';
      message = ageGroup === 'elderly' ? 'Stage 2 Hypertension' : 'Stage 2 Hypertension';
      color = 'text-red-700';
      bgColor = 'bg-red-100';
    } else if (systolic >= 130 || diastolic >= 80) {
      status = ageGroup === 'elderly' ? 'normal' : 'high';
      message = ageGroup === 'elderly' ? 'Acceptable for Age' : 'Stage 1 Hypertension';
      color = ageGroup === 'elderly' ? 'text-green-600' : 'text-orange-700';
      bgColor = ageGroup === 'elderly' ? 'bg-green-100' : 'bg-orange-100';
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
  }

  return {
    value: bpValue,
    status,
    message,
    color,
    bgColor,
    normalRange: `${systolicNormal.normalRange.optimal}/${diastolicNormal.normalRange.optimal} mmHg`,
    ageGroup: `${ageGroup} (${systolicNormal.ageRange.min}-${systolicNormal.ageRange.max} years)`
  };
};

const assessBMI = (weight: number, height: number, age?: number): VitalSignAssessment => {
  // Height should be in meters, weight in kg
  const heightInMeters = height > 3 ? height / 100 : height; // Convert cm to m if needed
  const bmi = weight / (heightInMeters * heightInMeters);
  const ageGroup = age ? getAgeGroup(age) : 'adult';

  let status: VitalSignAssessment['status'] = 'normal';
  let message = 'Normal Weight';
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';

  // Age-specific BMI assessment
  if (ageGroup === 'child' || ageGroup === 'adolescent') {
    // For children/adolescents, BMI percentiles would be more appropriate
    // This is a simplified assessment
    if (bmi < 16) {
      status = 'critical_low';
      message = 'Severely Underweight for Age';
      color = 'text-red-800';
      bgColor = 'bg-red-200';
    } else if (bmi < 18) {
      status = 'low';
      message = 'Underweight for Age';
      color = 'text-blue-700';
      bgColor = 'bg-blue-100';
    } else if (bmi >= 18 && bmi < 25) {
      status = 'normal';
      message = 'Normal Weight for Age';
      color = 'text-green-600';
      bgColor = 'bg-green-100';
    } else if (bmi >= 25 && bmi < 30) {
      status = 'high';
      message = 'Overweight for Age';
      color = 'text-yellow-700';
      bgColor = 'bg-yellow-100';
    } else {
      status = 'high';
      message = 'Obesity for Age';
      color = 'text-orange-700';
      bgColor = 'bg-orange-100';
    }
  } else {
    // Adult BMI assessment
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
  }

  return {
    value: parseFloat(bmi.toFixed(1)),
    status,
    message,
    color,
    bgColor,
    normalRange: ageGroup === 'child' || ageGroup === 'adolescent' ? 'Age-specific percentiles' : '18.5-24.9 BMI',
    ageGroup: `${ageGroup} assessment`
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