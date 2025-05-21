
import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-pharmacy-text text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Pill className="h-6 w-6" />
              <span className="text-xl font-bold">MediCart</span>
            </div>
            <p className="text-sm text-gray-300">
              Your trusted online pharmacy for all your medication needs. 
              We deliver quality healthcare products right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products?category=Pain Relief" className="hover:text-white transition-colors">Pain Relief</Link></li>
              <li><Link to="/products?category=Allergy" className="hover:text-white transition-colors">Allergy</Link></li>
              <li><Link to="/products?category=Vitamins & Supplements" className="hover:text-white transition-colors">Vitamins & Supplements</Link></li>
              <li><Link to="/products?category=Digestive Health" className="hover:text-white transition-colors">Digestive Health</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>123 Pharmacy Street</li>
              <li>Healthville, HV 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: support@medicart.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} MediCart. All rights reserved.</p>
          <p className="mt-2">This is a demo website. Not for actual medical use.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
