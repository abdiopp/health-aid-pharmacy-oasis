
// Medicine product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  dosage: string;
  brand: string;
  requiresPrescription: boolean;
}

// Dummy data for medicines
const MEDICINES: Product[] = [
  {
    id: '1',
    name: 'Ibuprofen 200mg',
    description: 'Relieves pain and reduces inflammation. Commonly used for headaches, muscle aches, menstrual cramps, and other minor pain.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Pain Relief',
    inStock: true,
    dosage: '200mg',
    brand: 'MediPharm',
    requiresPrescription: false
  },
  {
    id: '2',
    name: 'Acetaminophen 500mg',
    description: 'Reduces fever and relieves pain. Commonly used for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1550572017-a0589083a8c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Pain Relief',
    inStock: true,
    dosage: '500mg',
    brand: 'HealthPlus',
    requiresPrescription: false
  },
  {
    id: '3',
    name: 'Aspirin 325mg',
    description: 'Reduces pain, fever, and inflammation. Also used to reduce the risk of heart attack and stroke.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Pain Relief',
    inStock: true,
    dosage: '325mg',
    brand: 'MediPharm',
    requiresPrescription: false
  },
  {
    id: '4',
    name: 'Loratadine 10mg',
    description: 'Antihistamine that reduces the effects of natural chemical histamine in the body. Used to treat sneezing, runny nose, and other allergy symptoms.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b4220984?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Allergy',
    inStock: true,
    dosage: '10mg',
    brand: 'AllerCare',
    requiresPrescription: false
  },
  {
    id: '5',
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic used to treat a wide variety of bacterial infections. Works by stopping the growth of bacteria.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Antibiotics',
    inStock: true,
    dosage: '500mg',
    brand: 'MedCure',
    requiresPrescription: true
  },
  {
    id: '6',
    name: 'Omeprazole 20mg',
    description: 'Reduces the amount of acid in your stomach. Used to treat heartburn, a damaged esophagus, stomach ulcers, and gastroesophageal reflux disease.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Digestive Health',
    inStock: true,
    dosage: '20mg',
    brand: 'GastroEase',
    requiresPrescription: false
  },
  {
    id: '7',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine that reduces the effects of natural chemical histamine in the body. Used to treat hay fever and allergy symptoms.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1576073719676-aa95576db207?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Allergy',
    inStock: true,
    dosage: '10mg',
    brand: 'AllerCare',
    requiresPrescription: false
  },
  {
    id: '8',
    name: 'Simvastatin 20mg',
    description: 'Lowers cholesterol and triglycerides in the blood. Used to reduce the risk of stroke, heart attack, and other heart complications.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1626716493137-b67fe178d2c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Cardiovascular',
    inStock: true,
    dosage: '20mg',
    brand: 'CardioHealth',
    requiresPrescription: true
  },
  {
    id: '9',
    name: 'Multivitamin Daily',
    description: 'Provides essential vitamins and minerals to support overall health and well-being.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Vitamins & Supplements',
    inStock: true,
    dosage: 'Daily',
    brand: 'VitaWell',
    requiresPrescription: false
  }
];

// API methods simulating backend calls
export const api = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    return MEDICINES;
  },
  
  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MEDICINES.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },
  
  // Get single product by ID
  getProduct: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MEDICINES.find(product => product.id === id);
  },
  
  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return MEDICINES.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },
  
  // Get product categories
  getCategories: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = MEDICINES.map(product => product.category);
    return [...new Set(categories)]; // Remove duplicates
  }
};
