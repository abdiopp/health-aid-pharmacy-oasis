
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

enum CheckoutStep {
  SHIPPING = 'shipping',
  PAYMENT = 'payment',
  REVIEW = 'review',
  COMPLETE = 'complete',
}

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    saveInfo: false,
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [orderNotes, setOrderNotes] = useState('');
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(CheckoutStep.PAYMENT);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(CheckoutStep.REVIEW);
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment and order processing
    setTimeout(() => {
      setCurrentStep(CheckoutStep.COMPLETE);
      clearCart();
    }, 1500);
  };
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };
  
  if (currentStep === CheckoutStep.COMPLETE) {
    return (
      <div className="py-8 text-center bg-white rounded-lg shadow-sm p-8 max-w-xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="bg-pharmacy-light p-6 rounded-full">
            <svg className="h-12 w-12 text-pharmacy-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-pharmacy-text">Order Complete!</h2>
        <p className="mb-2 text-muted-foreground">
          Your order has been placed successfully.
        </p>
        <p className="mb-6 text-muted-foreground">
          Order #MED-{Math.floor(Math.random() * 10000)}
        </p>
        <p className="mb-6 text-pharmacy-text">
          We've sent a confirmation email to {shippingInfo.email}. 
          Your order will be processed and shipped soon.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="py-8 text-center bg-white rounded-lg shadow-sm p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-pharmacy-text">Please Sign In</h2>
        <p className="mb-6 text-muted-foreground">
          You need to be signed in to complete your purchase.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="outline" onClick={() => navigate('/register')}>
            Create Account
          </Button>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="py-8 text-center bg-white rounded-lg shadow-sm p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-pharmacy-text">Your Cart is Empty</h2>
        <p className="mb-6 text-muted-foreground">
          You need to add items to your cart before checking out.
        </p>
        <Button onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }
  
  const renderOrderSummary = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium">
                {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
              </span>
            </div>
            <span className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
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
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${(getCartTotal() + 5 + getCartTotal() * 0.08).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-pharmacy-text mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 bg-pharmacy-blue text-white flex justify-between">
              <div 
                className={`flex items-center ${currentStep === CheckoutStep.SHIPPING ? 'font-bold' : ''}`}
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-pharmacy-blue text-sm font-bold mr-2">
                  1
                </span>
                Shipping
              </div>
              <div 
                className={`flex items-center ${currentStep === CheckoutStep.PAYMENT ? 'font-bold' : ''}`}
              >
                <span className={`flex items-center justify-center h-6 w-6 rounded-full text-sm font-bold mr-2 ${
                  currentStep === CheckoutStep.SHIPPING ? 'bg-gray-200 text-gray-500' : 'bg-white text-pharmacy-blue'
                }`}>
                  2
                </span>
                Payment
              </div>
              <div 
                className={`flex items-center ${currentStep === CheckoutStep.REVIEW ? 'font-bold' : ''}`}
              >
                <span className={`flex items-center justify-center h-6 w-6 rounded-full text-sm font-bold mr-2 ${
                  currentStep === CheckoutStep.SHIPPING || currentStep === CheckoutStep.PAYMENT ? 
                  'bg-gray-200 text-gray-500' : 'bg-white text-pharmacy-blue'
                }`}>
                  3
                </span>
                Review
              </div>
            </div>
            
            <div className="p-6">
              {currentStep === CheckoutStep.SHIPPING && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox
                      id="saveInfo"
                      checked={shippingInfo.saveInfo}
                      onCheckedChange={(checked) => 
                        setShippingInfo({
                          ...shippingInfo,
                          saveInfo: checked as boolean
                        })
                      }
                    />
                    <Label htmlFor="saveInfo">Save this information for next time</Label>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                    <Textarea
                      id="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Special delivery instructions or notes for your order"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}
              
              {currentStep === CheckoutStep.PAYMENT && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">Credit / Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'credit' && (
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveCard"
                          checked={paymentInfo.saveCard}
                          onCheckedChange={(checked) => 
                            setPaymentInfo({
                              ...paymentInfo,
                              saveCard: checked as boolean
                            })
                          }
                        />
                        <Label htmlFor="saveCard">Save this card for future purchases</Label>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(CheckoutStep.SHIPPING)}
                    >
                      Back
                    </Button>
                    <Button type="submit">
                      Review Order
                    </Button>
                  </div>
                </form>
              )}
              
              {currentStep === CheckoutStep.REVIEW && (
                <form onSubmit={handleReviewSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                      <div className="bg-pharmacy-light p-4 rounded-md">
                        <p><strong>{shippingInfo.fullName}</strong></p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                      <div className="bg-pharmacy-light p-4 rounded-md">
                        {paymentMethod === 'credit' && (
                          <p>
                            Credit Card ending in {paymentInfo.cardNumber.slice(-4)}
                          </p>
                        )}
                        {paymentMethod === 'paypal' && <p>PayPal</p>}
                        {paymentMethod === 'cod' && <p>Cash on Delivery</p>}
                      </div>
                    </div>
                    
                    {orderNotes && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Order Notes</h3>
                        <div className="bg-pharmacy-light p-4 rounded-md">
                          <p>{orderNotes}</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Items</h3>
                      <div className="bg-pharmacy-light p-4 rounded-md space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(CheckoutStep.PAYMENT)}
                    >
                      Back
                    </Button>
                    <Button type="submit">
                      Place Order
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
