import React from 'react';
import { ServiceCard } from '@/components/ServiceCard';
import { Layout } from '@/components/layout/Layout';

const ServiceCardDemo = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Cards Demo</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Clean, modern service cards designed for Indian service professionals. 
              Easy to understand for both workers and customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Electrician Services */}
            <ServiceCard 
              serviceName="Switch Repair" 
              description="Fix or replace faulty switches & sockets" 
              price={99}
              category="electrician"
              extraInfo="Material cost extra"
            />
            
            <ServiceCard 
              serviceName="Fan Installation" 
              description="Install ceiling fans and regulators" 
              price={199}
              category="electrician"
              extraInfo="Warranty included"
            />
            
            <ServiceCard 
              serviceName="Wiring Job" 
              description="Complete electrical wiring for rooms" 
              price={499}
              category="electrician"
              extraInfo="Labour cost included"
            />
            
            {/* Plumbing Services */}
            <ServiceCard 
              serviceName="Tap Repair" 
              description="Fix leaking taps and fittings" 
              price={149}
              category="plumber"
              extraInfo="Inspection included"
            />
            
            <ServiceCard 
              serviceName="Pipe Blockage" 
              description="Clear blocked pipes and drains" 
              price={299}
              category="plumber"
              extraInfo="Material cost extra"
            />
            
            <ServiceCard 
              serviceName="Water Heater" 
              description="Repair and maintenance" 
              price={399}
              category="plumber"
              extraInfo="Warranty provided"
            />
            
            {/* Appliance Services */}
            <ServiceCard 
              serviceName="AC Service" 
              description="Basic AC cleaning and inspection" 
              price={299}
              category="appliance repair"
              extraInfo="Material cost extra"
            />
            
            <ServiceCard 
              serviceName="Refrigerator Repair" 
              description="Fix cooling and electrical issues" 
              price={399}
              category="appliance repair"
              extraInfo="Warranty included"
            />
            
            <ServiceCard 
              serviceName="Washing Machine" 
              description="Repair and maintenance" 
              price={249}
              category="appliance repair"
              extraInfo="Labour cost included"
            />
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-500 text-2xl mb-2">✓</div>
                <h3 className="font-semibold text-gray-800 mb-2">Simple & Clear</h3>
                <p className="text-gray-600 text-sm">Easy to understand descriptions for workers and customers</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-green-500 text-2xl mb-2">₹</div>
                <h3 className="font-semibold text-gray-800 mb-2">Transparent Pricing</h3>
                <p className="text-gray-600 text-sm">Clear pricing with no hidden costs</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-purple-500 text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600 text-sm">Optimized for mobile devices used by workers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceCardDemo;