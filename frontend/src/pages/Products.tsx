
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [prescriptionOnly, setPrescriptionOnly] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Get all products
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  // Get categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Apply filters and search
  const filteredProducts = React.useMemo(() => {
    if (!allProducts) return [];
    
    return allProducts.filter(product => {
      // Search term filter
      const matchesSearch = searchTerm 
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      // Category filter
      const matchesCategory = selectedCategory 
        ? product.category === selectedCategory 
        : true;
      
      // Price filter
      let matchesPrice = true;
      if (priceFilter === 'under10') {
        matchesPrice = product.price < 10;
      } else if (priceFilter === '10to15') {
        matchesPrice = product.price >= 10 && product.price <= 15;
      } else if (priceFilter === 'over15') {
        matchesPrice = product.price > 15;
      }
      
      // Prescription filter
      const matchesPrescription = prescriptionOnly 
        ? product.requiresPrescription 
        : true;
      
      return matchesSearch && matchesCategory && matchesPrice && 
        (prescriptionOnly ? product.requiresPrescription : true);
    });
  }, [allProducts, searchTerm, selectedCategory, priceFilter, prescriptionOnly]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [searchTerm, selectedCategory, navigate, location.pathname]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceFilter('');
    setPrescriptionOnly(false);
    navigate('/products');
  };

  // Toggle mobile filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pharmacy-text mb-2">Products</h1>
        <p className="text-muted-foreground">
          Browse our selection of high-quality medications and health products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button 
            onClick={toggleFilter} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Filters - Desktop always visible, mobile conditional */}
        <div 
          className={`lg:w-1/4 ${isFilterOpen || 'hidden lg:block'} 
            bg-white rounded-lg shadow-sm border border-pharmacy-gray p-4`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm text-muted-foreground"
            >
              Clear All
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Search</h3>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {categories?.map((category) => (
                <div key={category} className="flex items-center">
                  <Button
                    variant="ghost"
                    className={`justify-start text-sm p-2 w-full ${
                      selectedCategory === category
                        ? 'bg-pharmacy-light text-pharmacy-blue font-medium'
                        : 'text-pharmacy-text'
                    }`}
                    onClick={() => 
                      setSelectedCategory(
                        selectedCategory === category ? '' : category
                      )
                    }
                  >
                    {category}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className={`justify-start text-sm p-2 w-full ${
                    priceFilter === 'under10'
                      ? 'bg-pharmacy-light text-pharmacy-blue font-medium'
                      : 'text-pharmacy-text'
                  }`}
                  onClick={() => 
                    setPriceFilter(priceFilter === 'under10' ? '' : 'under10')
                  }
                >
                  Under $10
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className={`justify-start text-sm p-2 w-full ${
                    priceFilter === '10to15'
                      ? 'bg-pharmacy-light text-pharmacy-blue font-medium'
                      : 'text-pharmacy-text'
                  }`}
                  onClick={() => 
                    setPriceFilter(priceFilter === '10to15' ? '' : '10to15')
                  }
                >
                  $10 - $15
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className={`justify-start text-sm p-2 w-full ${
                    priceFilter === 'over15'
                      ? 'bg-pharmacy-light text-pharmacy-blue font-medium'
                      : 'text-pharmacy-text'
                  }`}
                  onClick={() => 
                    setPriceFilter(priceFilter === 'over15' ? '' : 'over15')
                  }
                >
                  Over $15
                </Button>
              </div>
            </div>
          </div>

          {/* Prescription Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Prescription Status</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prescription"
                checked={prescriptionOnly}
                onCheckedChange={() => setPrescriptionOnly(!prescriptionOnly)}
              />
              <label
                htmlFor="prescription"
                className="text-sm font-medium text-pharmacy-text cursor-pointer"
              >
                Prescription Only
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-pharmacy-gray p-6">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
