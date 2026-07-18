import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  scent: string;
  riseTime: string;
  rating: number;
  image: any;
  category: string;
  stock: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

interface CartContextType {
  // Cart state
  cart: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image: any }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Products inventory state
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'image'>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, amount: number) => void;
  setStock: (id: string, quantity: number) => void;
}

// URL ของไฟล์ products.json บน GitHub (Raw content)
const PRODUCTS_URL =
  'https://raw.githubusercontent.com/PhakamasChaichana/squishy-shop/master/products.json';

// ใช้เป็น fallback กรณี fetch จาก GitHub ไม่สำเร็จ (เช่น ไม่มีอินเทอร์เน็ต)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sq-001',
    name: 'Sleepy Panda Squishy',
    price: 129,
    description: 'A chubby, super soft panda squishy with a light vanilla scent. Squeeze it to relax after a long day.',
    scent: 'Vanilla 🍦',
    riseTime: '8 - 10 seconds',
    rating: 4.8,
    image: 'https://m.media-amazon.com/images/I/61XLi7-EdhL._SL1254_.jpg',
    category: 'Animals',
    stock: 42,
  },
  {
    id: 'sq-002',
    name: 'Strawberry Cake Slice Squishy',
    price: 149,
    description: 'A realistic strawberry cake slice squishy with a sweet strawberry fragrance. Looks almost good enough to eat.',
    scent: 'Sweet Strawberry 🍓',
    riseTime: '10 - 12 seconds',
    rating: 4.6,
    image: 'https://picsum.photos/seed/cake-squishy/400/400',
    category: 'Bakery',
    stock: 30,
  },
  {
    id: 'sq-003',
    name: 'Fluffy Cloud Bun Squishy',
    price: 99,
    description: 'An extra soft, slow-rising bread bun shaped like a fluffy cloud. Perfect for gentle stress relief.',
    scent: 'Fresh Bread 🍞',
    riseTime: '6 - 8 seconds',
    rating: 4.5,
    image: 'https://picsum.photos/seed/cloud-bun/400/400',
    category: 'Bakery',
    stock: 55,
  },
  {
    id: 'sq-004',
    name: 'Mini Avocado Squishy',
    price: 89,
    description: "A tiny, cute avocado squishy that's easy to carry around. Great as a bag charm or keychain accessory.",
    scent: 'Fresh Avocado 🥑',
    riseTime: '4 - 6 seconds',
    rating: 4.3,
    image: 'https://picsum.photos/seed/avocado-squishy/400/400',
    category: 'Fruits & Animals',
    stock: 60,
  },
  {
    id: 'sq-005',
    name: 'Galaxy Unicorn Squishy',
    price: 189,
    description: 'A beautifully colored unicorn squishy with a galaxy print design that glows faintly in the dark.',
    scent: 'Sweet Grape 🍇',
    riseTime: '12 - 15 seconds',
    rating: 4.9,
    image: 'https://picsum.photos/seed/unicorn-squishy/400/400',
    category: 'Fantasy',
    stock: 20,
  },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // ดึงข้อมูลสินค้าจาก GitHub Raw URL ตอนแอปเปิด
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products from GitHub:', error);
        setProducts(INITIAL_PRODUCTS);
      }
    }

    loadProducts();
  }, []);

  const addToCart = (product: { id: string; name: string; price: number; image: any }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'rating' | 'image'>) => {
    setProducts((prevProducts) => {
      const nextId = (Math.max(...prevProducts.map((p) => parseInt(p.id) || 0)) + 1).toString();
      const productToAdd: Product = {
        ...newProduct,
        id: nextId,
        rating: 5.0, // Default rating for new products
        image: require('@/assets/images/favicon.png'), // Default fallback image for new products
      };
      return [...prevProducts, productToAdd];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    // Also remove from cart if it's there
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateStock = (id: string, amount: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
      )
    );
  };

  const setStock = (id: string, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, quantity) } : p
      )
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        products,
        addProduct,
        deleteProduct,
        updateStock,
        setStock
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}