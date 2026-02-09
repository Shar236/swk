import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AC_SERVICE_CATEGORIES, 
  ServiceItem, 
  ServiceCategory,
  getAllACServices,
  searchServices 
} from '@/data/services/acServices';

export function ACServiceCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [services, setServices] = useState<ServiceItem[]>(getAllACServices());

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setServices(searchServices(query));
    } else {
      setServices(getAllACServices());
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setServices(searchQuery ? searchServices(searchQuery) : getAllACServices());
    } else {
      const categoryServices = AC_SERVICE_CATEGORIES.find(cat => cat.id === categoryId)?.items || [];
      setServices(categoryServices);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AC Service Catalog</h1>
        <p className="text-muted-foreground mb-6">
          Transparent pricing for all your AC service needs. No hidden charges.
        </p>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategoryFilter('all')}
            >
              All Services
            </Button>
            {AC_SERVICE_CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Display */}
      <div className="grid gap-6">
        {selectedCategory === 'all' ? (
          AC_SERVICE_CATEGORIES.map(category => (
            <CategorySection 
              key={category.id} 
              category={category} 
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <CategorySection 
            category={AC_SERVICE_CATEGORIES.find(cat => cat.id === selectedCategory) || AC_SERVICE_CATEGORIES[0]}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Service Summary</h3>
        <p className="text-sm text-muted-foreground">
          Total services available: {services.length} | 
          Categories: {AC_SERVICE_CATEGORIES.length}
        </p>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: ServiceCategory;
  formatCurrency: (amount: number) => string;
}

function CategorySection({ category, formatCurrency }: CategorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{category.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {category.items.length} services
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {category.items.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ServiceCardProps {
  service: ServiceItem;
  formatCurrency: (amount: number) => string;
}

function ServiceCard({ service, formatCurrency }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{service.name}</h4>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(service.totalCharge)}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          {service.description}
        </p>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Service Charge:</span>
            <span>{formatCurrency(service.serviceCharge)}</span>
          </div>
          {service.laborCharge > 0 && (
            <div className="flex justify-between">
              <span>Labor Charge:</span>
              <span>{formatCurrency(service.laborCharge)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-1">
            <span>Total:</span>
            <span>{formatCurrency(service.totalCharge)}</span>
          </div>
        </div>
        
        {service.acType && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs bg-secondary rounded-full">
              {service.acType.toUpperCase()}
            </span>
          </div>
        )}
        
        {service.tonnage && (
          <div className="mt-1">
            <span className="inline-block px-2 py-1 text-xs bg-accent rounded-full">
              {service.tonnage}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}