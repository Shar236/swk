import { Droplets, Zap, Hammer, Paintbrush } from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  nameHi?: string;
  description?: string;
  price: number;
  category: string;
}

export const PLUMBING_SERVICES: ServiceItem[] = [
  // Tap & Mixer
  { id: 'tap-repair', name: 'Tap repair', price: 99, category: 'Tap & Mixer' },
  { id: 'tap-accessory', name: 'Tap accessory installation', price: 79, category: 'Tap & Mixer' },
  { id: 'tap-replacement', name: 'Tap installation / replacement', price: 99, category: 'Tap & Mixer' },
  
  // Toilet
  { id: 'jet-spray', name: 'Jet spray repair / replacement', price: 99, category: 'Toilet' },
  { id: 'toilet-seat', name: 'Toilet seat cover installation', price: 99, category: 'Toilet' },
  { id: 'flush-tank-repair', name: 'Flush tank repair', price: 149, category: 'Toilet' },
  { id: 'flush-tank-replacement', name: 'External flush tank replacement', price: 449, category: 'Toilet' },
  { id: 'indian-toilet', name: 'Indian toilet repair / installation', price: 699, category: 'Toilet' },
  { id: 'western-toilet-wall', name: 'Western toilet repair (wall-mounted)', price: 699, category: 'Toilet' },
  { id: 'western-toilet-floor', name: 'Western toilet repair (floor-mounted)', price: 699, category: 'Toilet' },

  // Bath & Shower
  { id: 'shower-mixer', name: 'Shower mixer tap installation', price: 228, category: 'Bath & Shower' },
  { id: 'shower-inst', name: 'Shower installation', price: 99, category: 'Bath & Shower' },
  { id: 'shower-filter', name: 'Shower filter installation', price: 99, category: 'Bath & Shower' },
  { id: 'shower-repair', name: 'Shower repair', price: 99, category: 'Bath & Shower' },

  // Basin & Sink
  { id: 'basin-leakage', name: 'Wash basin leakage repair', price: 99, category: 'Basin & Sink' },
  { id: 'basin-blockage', name: 'Wash basin blockage removal', price: 199, category: 'Basin & Sink' },
  { id: 'basin-inst', name: 'Wash basin installation', price: 469, category: 'Basin & Sink' },

  // Water Tank & Motor
  { id: 'tank-inst', name: 'Overhead water tank installation', price: 699, category: 'Water Tank & Motor' },
  { id: 'motor-inst', name: 'Motor installation', price: 449, category: 'Water Tank & Motor' },
  
  // Consultation
  { id: 'plumbing-cons', name: 'Plumber consultation (assessment & quote)', price: 49, category: 'Consultation' },
];

export const ELECTRICAL_SERVICES: ServiceItem[] = [
  // Switch & Socket
  { id: 'switch-replace', name: 'Switch/socket repair & replacement', price: 69, category: 'Switch & Socket' },
  { id: 'switchboard-repair', name: 'Switchboard repair & replacement', price: 99, category: 'Switch & Socket' },
  { id: 'plug-replace', name: 'Plug replacement', price: 69, category: 'Switch & Socket' },

  // Fan
  { id: 'fan-repair', name: 'Fan repair', price: 149, category: 'Fan' },
  { id: 'fan-inst', name: 'Regular ceiling fan installation', price: 99, category: 'Fan' },

  // Lighting
  { id: 'light-inst', name: 'Fancy light installation/replacement', price: 149, category: 'Lighting' },
  { id: 'tubelight-work', name: 'Tubelight repair & installation', price: 99, category: 'Lighting' },

  // Inverter
  { id: 'inverter-inst', name: 'Inverter installation', price: 485, category: 'Inverter' },
  { id: 'inverter-servicing', name: 'Inverter servicing', price: 249, category: 'Inverter' },

  // Consultation
  { id: 'elec-cons', name: 'Electrician consultation (assessment & quote)', price: 49, category: 'Consultation' },
];

export const CARPENTRY_SERVICES: ServiceItem[] = [
  { id: 'cupboard-repair', name: 'Cupboard repair', price: 89, category: 'Cupboard & Drawer' },
  { id: 'door-repair', name: 'Door repair', price: 199, category: 'Wooden Door Services' },
  { id: 'drill-hole', name: 'Drill (per hole)', price: 49, category: 'Furniture Repair' },
  { id: 'carp-cons', name: 'Carpenters consultation (visit + quote)', price: 49, category: 'Consultation' },
];

export const PAINTING_SERVICES: ServiceItem[] = [
  { id: 'one-wall', name: '1 wall painting', price: 2499, category: 'Few walls' },
  { id: 'full-home-1bhk', name: 'Unfurnished 1 BHK', price: 8999, category: 'Unfurnished' },
  { id: 'wall-waterproofing', name: 'Wall waterproofing', price: 4998, category: 'Waterproofing' },
];

export const AC_SERVICES: ServiceItem[] = [
  // Service & Installation
  { id: 'ac-install', name: 'Split AC Installation', price: 1499, category: 'Service & Installation' },
  { id: 'ac-uninstall', name: 'Split AC Uninstallation', price: 899, category: 'Service & Installation' },
  { id: 'ac-service-power', name: 'Power Jet AC Service (Split)', price: 499, category: 'Service & Installation' },
  { id: 'ac-service-window', name: 'Power Jet AC Service (Window)', price: 449, category: 'Service & Installation' },
  { id: 'ac-antirust', name: 'Anti-rust deep clean AC service', price: 949, category: 'Service & Installation' },

  // Gas Charging
  { id: 'ac-gas-charge', name: 'Full Gas Charging', price: 2800, category: 'Gas Charging' },
  { id: 'ac-compressor-1-5', name: 'Compressor Replacement (1.5 Ton)', price: 4500, category: 'Gas Charging' },

  // Repairs
  { id: 'ac-pcb-repair', name: 'Non-Inverter PCB Repair', price: 1500, category: 'Repairs' },
  { id: 'ac-pcb-inverter', name: 'Inverter PCB Repair', price: 4500, category: 'Repairs' },
  { id: 'ac-leakage', name: 'Water Leakage Repair', price: 599, category: 'Repairs' },
  { id: 'ac-fan-motor', name: 'Fan Motor Replacement', price: 1800, category: 'Repairs' },
];

export const THEKEDAR_SERVICES: ServiceItem[] = [
  { id: 'house-renovation', name: 'House Renovation', price: 299, category: 'Renovation' },
  { id: 'wiring-setup', name: 'Wiring / Electrical Setup', price: 199, category: 'Electrical' },
  { id: 'plumbing-multi', name: 'Plumbing (Multiple Points)', price: 199, category: 'Plumbing' },
  { id: 'tiles-flooring', name: 'Tiles / Flooring', price: 299, category: 'Civil Work' },
  { id: 'custom-work', name: 'Custom Work', price: 299, category: 'Consultation' },
];

export const SERVICE_DATA_MAP: Record<string, ServiceItem[]> = {
  plumbing: PLUMBING_SERVICES,
  electrical: ELECTRICAL_SERVICES,
  carpentry: CARPENTRY_SERVICES,
  painting: PAINTING_SERVICES,
  'ac-repair': AC_SERVICES,
  'ac-services': AC_SERVICES,
  thekedar: THEKEDAR_SERVICES,
};
