import React from 'react';
import { 
  Droplets, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Grid3X3, 
  Settings, 
  HardHat, 
  Tent, 
  Sparkles,
  IndianRupee,
  Info,
  CheckCircle 
} from 'lucide-react';

interface ServiceCardProps {
  serviceName: string;
  description: string;
  price: number;
  category: string;
  extraInfo?: string;
  language?: 'en' | 'hi';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceName,
  description,
  price,
  category,
  extraInfo = "Material cost extra",
  language = 'en'
}) => {
  // Mapping category to icons
  const getIcon = (cat: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'plumber': Droplets,
      'electrician': Zap,
      'carpenter': Hammer,
      'painter': Paintbrush,
      'tiles installer': Grid3X3,
      'appliance repair': Settings,
      'construction mazdoor': HardHat,
      'tent house': Tent,
      'cleaning': Sparkles,
      'ac service': Settings,
      'default': Settings
    };
    
    const IconComponent = iconMap[cat.toLowerCase()] || iconMap.default;
    return <IconComponent className="h-16 w-16 text-blue-500" />;
  };

  // Translations
  const translations = {
    en: {
      startsAt: "Starts at",
      inspectionIncluded: "Inspection included",
      materialCostExtra: "Material cost extra"
    },
    hi: {
      startsAt: "शुरू होता है",
      inspectionIncluded: "निरीक्षण शामिल",
      materialCostExtra: "सामग्री लागत अतिरिक्त"
    }
  };

  const t = translations[language];

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top section with icon */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full p-4 shadow-md">
            {getIcon(category)}
          </div>
        </div>
        
        {/* Service name */}
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
          {serviceName}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-center text-sm mb-4">
          {description}
        </p>
      </div>
      
      {/* Price section */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-green-100 rounded-full p-3">
            <IndianRupee className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="text-center mb-1">
          <span className="text-gray-500 text-sm font-medium">{t.startsAt}</span>
        </div>
        
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-green-700">₹{price}</span>
        </div>
      </div>
      
      {/* Extra info section */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Info className="h-3 w-3 mr-1" />
          {extraInfo}
        </div>
      </div>
      
      {/* Bottom action */}
      <div className="p-4 bg-white">
        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium text-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
          Book Now
        </button>
      </div>
    </div>
  );
};

// Example usage
const ServiceCardExample = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            serviceName="Switch Repair" 
            description="Fix or replace faulty switches & sockets" 
            price={99}
            category="electrician"
            extraInfo="Material cost extra"
          />
          
          <ServiceCard 
            serviceName="Tap Repair" 
            description="Fix leaking taps and fittings" 
            price={149}
            category="plumber"
            extraInfo="Inspection included"
          />
          
          <ServiceCard 
            serviceName="AC Service" 
            description="Basic AC cleaning and inspection" 
            price={299}
            category="appliance repair"
            extraInfo="Material cost extra"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;