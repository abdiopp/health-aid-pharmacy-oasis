
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/products" className="text-pharmacy-blue hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover aspect-square"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-pharmacy-text">{product.name}</h1>
            {product.requiresPrescription && (
              <Badge className="bg-pharmacy-blue">
                Prescription Required
              </Badge>
            )}
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold text-pharmacy-blue">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-pharmacy-text mb-6">{product.description}</p>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pharmacy-light p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Brand</span>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div className="bg-pharmacy-light p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Dosage</span>
                <p className="font-medium">{product.dosage}</p>
              </div>
              <div className="bg-pharmacy-light p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Category</span>
                <p className="font-medium">{product.category}</p>
              </div>
              <div className="bg-pharmacy-light p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Availability</span>
                <p className="font-medium">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-pharmacy-text mr-4">Quantity:</span>
              <div className="flex items-center border border-pharmacy-gray rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity} 
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock || (product.requiresPrescription)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            {product.requiresPrescription && (
              <Button variant="outline" className="flex-1">
                Upload Prescription
              </Button>
            )}
          </div>
          
          {product.requiresPrescription && (
            <p className="text-sm text-muted-foreground mt-4">
              This medication requires a valid prescription from a healthcare provider.
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="usage">Usage & Dosage</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <p>
            {product.description} This medication is manufactured by {product.brand} and is 
            categorized as a {product.category.toLowerCase()} product. It comes in a dosage of {product.dosage}.
          </p>
        </TabsContent>
        <TabsContent value="usage" className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Usage & Dosage</h3>
          <p>
            The recommended dosage for {product.name} is {product.dosage}, or as prescribed by your healthcare provider.
            Please read the product packaging for complete usage instructions. Never exceed the recommended dose.
          </p>
        </TabsContent>
        <TabsContent value="warnings" className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Warnings & Side Effects</h3>
          <p>
            As with any medication, {product.name} may cause side effects in some individuals. 
            Common side effects may include nausea, dizziness, or headache. If you experience severe side effects, 
            discontinue use and consult a healthcare professional immediately.
          </p>
          <p className="mt-4">
            Do not use if you are allergic to any of the ingredients. Consult with a healthcare 
            provider before use if you have any medical conditions or are taking other medications.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
