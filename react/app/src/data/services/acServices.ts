export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  serviceCharge: number;
  laborCharge: number;
  totalCharge: number;
  category: string;
  acType?: 'split' | 'window' | 'inverter' | 'all';
  tonnage?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  items: ServiceItem[];
}

export const AC_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrical-parts',
    name: 'Electrical Parts',
    description: 'PCB repairs, capacitors, sensors, and contactors',
    items: [
      {
        id: 'ep-001',
        name: 'Non-Inverter PCB Repaired',
        description: 'Repair of non-inverter printed circuit board',
        serviceCharge: 1500,
        laborCharge: 0,
        totalCharge: 1500,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-002',
        name: 'Inverter PCB Repaired',
        description: 'Repair of inverter printed circuit board',
        serviceCharge: 4500,
        laborCharge: 0,
        totalCharge: 4500,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-003',
        name: 'Replace LVT',
        description: 'Low voltage transformer replacement',
        serviceCharge: 900,
        laborCharge: 349,
        totalCharge: 1249,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-004',
        name: 'Capacitor 2-5 mfd',
        description: 'Capacitor replacement for 2-5 microfarad capacity',
        serviceCharge: 250,
        laborCharge: 349,
        totalCharge: 599,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-005',
        name: 'Capacitor 10-25 mfd',
        description: 'Capacitor replacement for 10-25 microfarad capacity',
        serviceCharge: 400,
        laborCharge: 349,
        totalCharge: 749,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-006',
        name: 'Capacitor 35-50 mfd',
        description: 'Capacitor replacement for 35-50 microfarad capacity',
        serviceCharge: 400,
        laborCharge: 349,
        totalCharge: 749,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-007',
        name: 'Capacitor 50-60 mfd',
        description: 'Capacitor replacement for 50-60 microfarad capacity',
        serviceCharge: 400,
        laborCharge: 349,
        totalCharge: 749,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-008',
        name: 'Replace Sensor',
        description: 'Temperature or other sensor replacement',
        serviceCharge: 350,
        laborCharge: 499,
        totalCharge: 849,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-009',
        name: 'Contactor Replaced',
        description: 'Electrical contactor replacement',
        serviceCharge: 500,
        laborCharge: 499,
        totalCharge: 999,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-010',
        name: 'Contactor Daikin/O-General',
        description: 'Specialized contactor for Daikin or O-General brands',
        serviceCharge: 1500,
        laborCharge: 449,
        totalCharge: 1949,
        category: 'Electrical Parts'
      },
      {
        id: 'ep-011',
        name: 'Convert PCB with Remote',
        description: 'PCB conversion with remote control integration',
        serviceCharge: 1500,
        laborCharge: 0,
        totalCharge: 1500,
        category: 'Electrical Parts'
      }
    ]
  },
  {
    id: 'fan-motors',
    name: 'Fan Motors',
    description: 'Various motor types and repairs for AC units',
    items: [
      {
        id: 'fm-001',
        name: 'Fan Motor - Split AC',
        description: 'Fan motor replacement for split AC units',
        serviceCharge: 1800,
        laborCharge: 499,
        totalCharge: 2299,
        category: 'Fan Motors',
        acType: 'split'
      },
      {
        id: 'fm-002',
        name: 'Blower Motor - Split AC',
        description: 'Blower motor replacement for split AC units',
        serviceCharge: 2200,
        laborCharge: 499,
        totalCharge: 2699,
        category: 'Fan Motors',
        acType: 'split'
      },
      {
        id: 'fm-003',
        name: 'Blower Replaced',
        description: 'Complete blower unit replacement',
        serviceCharge: 1100,
        laborCharge: 499,
        totalCharge: 1599,
        category: 'Fan Motors'
      },
      {
        id: 'fm-004',
        name: 'Replace Flap/Swing Motor',
        description: 'Motor for air direction control flap',
        serviceCharge: 400,
        laborCharge: 499,
        totalCharge: 899,
        category: 'Fan Motors'
      },
      {
        id: 'fm-005',
        name: 'Motor Bearing Change',
        description: 'Replacement of motor bearings',
        serviceCharge: 1000,
        laborCharge: 0,
        totalCharge: 1000,
        category: 'Fan Motors'
      },
      {
        id: 'fm-006',
        name: 'Fan Motor - Window AC',
        description: 'Fan motor replacement for window AC units',
        serviceCharge: 2600,
        laborCharge: 499,
        totalCharge: 3099,
        category: 'Fan Motors',
        acType: 'window'
      },
      {
        id: 'fm-007',
        name: 'Noise Issue Repair',
        description: 'Repair for motor noise issues',
        serviceCharge: 0,
        laborCharge: 499,
        totalCharge: 499,
        category: 'Fan Motors'
      }
    ]
  },
  {
    id: 'gas-charging',
    name: 'Gas Charging',
    description: 'Refrigerant charging and compressor services',
    items: [
      {
        id: 'gc-001',
        name: 'Gas Charging',
        description: 'Complete AC gas refill service',
        serviceCharge: 2800,
        laborCharge: 0,
        totalCharge: 2800,
        category: 'Gas Charging'
      },
      {
        id: 'gc-002',
        name: 'Replacement Compressor (1 Ton)',
        description: 'Compressor replacement for 1-ton AC units',
        serviceCharge: 4000,
        laborCharge: 0,
        totalCharge: 4000,
        category: 'Gas Charging',
        tonnage: '1 Ton'
      },
      {
        id: 'gc-003',
        name: 'Replacement Compressor (1.5 Ton)',
        description: 'Compressor replacement for 1.5-ton AC units',
        serviceCharge: 4500,
        laborCharge: 0,
        totalCharge: 4500,
        category: 'Gas Charging',
        tonnage: '1.5 Ton'
      },
      {
        id: 'gc-004',
        name: 'Replacement Compressor (2 Ton)',
        description: 'Compressor replacement for 2-ton AC units',
        serviceCharge: 5000,
        laborCharge: 0,
        totalCharge: 5000,
        category: 'Gas Charging',
        tonnage: '2 Ton'
      },
      {
        id: 'gc-005',
        name: 'Flair Nut Replaced',
        description: 'Replacement of flair nut connection',
        serviceCharge: 150,
        laborCharge: 0,
        totalCharge: 150,
        category: 'Gas Charging'
      },
      {
        id: 'gc-006',
        name: 'Cooling Coil / Condenser Coil Repair',
        description: 'Repair of cooling or condenser coils',
        serviceCharge: 899,
        laborCharge: 0,
        totalCharge: 899,
        category: 'Gas Charging'
      },
      {
        id: 'gc-007',
        name: 'Copper Coil Condenser 1 Ton Split',
        description: 'Copper condenser coil for 1-ton split AC',
        serviceCharge: 4000,
        laborCharge: 0,
        totalCharge: 4000,
        category: 'Gas Charging',
        acType: 'split',
        tonnage: '1 Ton'
      },
      {
        id: 'gc-008',
        name: 'Copper Coil Condenser 1.5 Ton Split',
        description: 'Copper condenser coil for 1.5-ton split AC',
        serviceCharge: 4800,
        laborCharge: 0,
        totalCharge: 4800,
        category: 'Gas Charging',
        acType: 'split',
        tonnage: '1.5 Ton'
      },
      {
        id: 'gc-009',
        name: 'Copper Coil Condenser 2 Ton Split',
        description: 'Copper condenser coil for 2-ton split AC',
        serviceCharge: 5300,
        laborCharge: 0,
        totalCharge: 5300,
        category: 'Gas Charging',
        acType: 'split',
        tonnage: '2 Ton'
      }
    ]
  }
];

// Additional categories would be added similarly...
export const getAllACServices = (): ServiceItem[] => {
  return AC_SERVICE_CATEGORIES.flatMap(category => category.items);
};

export const getServicesByCategory = (categoryId: string): ServiceItem[] => {
  const category = AC_SERVICE_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.items : [];
};

export const searchServices = (query: string): ServiceItem[] => {
  const allServices = getAllACServices();
  const searchTerm = query.toLowerCase();
  return allServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm) ||
    service.description.toLowerCase().includes(searchTerm) ||
    service.category.toLowerCase().includes(searchTerm)
  );
};