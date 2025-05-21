
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, ArrowRight, ShoppingCart, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-pharmacy-blue to-blue-700 text-white rounded-xl overflow-hidden">
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Health, Delivered</h1>
          <p className="text-lg mb-8">Get your medications delivered straight to your door with MediCart. Fast, reliable, and secure.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products">
              <Button className="bg-white text-pharmacy-blue hover:bg-gray-100">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Pills */}
      <div className="absolute top-20 right-20 opacity-10 rotate-12">
        <Pill className="w-20 h-20" />
      </div>
      <div className="absolute bottom-10 right-40 opacity-10 -rotate-12">
        <Pill className="w-16 h-16" />
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-pharmacy-text">Why Choose MediCart?</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-pharmacy-gray text-center">
          <div className="bg-pharmacy-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-pharmacy-blue h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
          <p className="text-muted-foreground">Quick and simple way to order your medications online from anywhere.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-pharmacy-gray text-center">
          <div className="bg-pharmacy-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Pill className="text-pharmacy-blue h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quality Medications</h3>
          <p className="text-muted-foreground">All our products are sourced from trusted manufacturers and suppliers.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-pharmacy-gray text-center">
          <div className="bg-pharmacy-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-pharmacy-blue h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Expert Assistance</h3>
          <p className="text-muted-foreground">Get answers to your medical questions with our AI chatbot assistant.</p>
        </div>
      </div>
    </section>
  );
};

const PopularProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pharmacy-text">Popular Products</h2>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </section>
    );
  }

  // Show only first 3 products on homepage
  const popularProducts = products?.slice(0, 3) || [];

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pharmacy-text">Popular Products</h2>
        <p className="text-muted-foreground">Our most popular medications and supplements</p>
      </div>
      
      <div className="product-grid mb-8">
        {popularProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center">
        <Link to="/products">
          <Button variant="outline" className="border-pharmacy-blue text-pharmacy-blue hover:bg-pharmacy-blue hover:text-white">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="space-y-12">
      <Hero />
      <Features />
      <PopularProducts />
    </div>
  );
};

export default Index;
