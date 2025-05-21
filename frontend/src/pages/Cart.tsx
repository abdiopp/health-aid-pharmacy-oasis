
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Trash, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="py-8 text-center bg-white rounded-lg shadow-sm p-8 max-w-xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="bg-pharmacy-light p-6 rounded-full">
            <ShoppingCart className="h-12 w-12 text-pharmacy-blue" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-pharmacy-text">Your Cart is Empty</h2>
        <p className="mb-6 text-muted-foreground">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/products">
          <Button>
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-pharmacy-text mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold text-pharmacy-text">
                  Items ({items.length})
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  Clear Cart
                </Button>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <Link to={`/products/${item.id}`} className="font-medium text-pharmacy-text hover:text-pharmacy-blue line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-pharmacy-blue font-medium mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-pharmacy-gray rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-none"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-none"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-pharmacy-text">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(getCartTotal() + 5 + getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="flex-grow"
                />
                <Button variant="outline">Apply</Button>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <Link to="/products">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
