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
    id: '1',
    name: 'Jumbo Strawberry Cat Squishy',
    price: 12.99,
    description: 'An adorable, jumbo-sized squishy combining a sweet kitty shape with a juicy strawberry design. Super squishy and slow-rising memory foam!',
    scent: 'Sweet Strawberry 🍓',
    riseTime: '10 - 12 seconds',
    rating: 5.0,
    image: require('@/assets/images/strawberry_cat.png'),
    category: 'Fruits & Animals',
    stock: 45,
  },
  {
    id: '2',
    name: 'Cute Panda Face Squishy Bun',
    price: 8.99,
    description: 'A classic, puffy panda bun squishy. Compact and lightweight, it comes with a handy keychain strap. Perfect for relieving stress on the go!',
    scent: 'Vanilla Cream 🍦',
    riseTime: '6 - 8 seconds',
    rating: 4.8,
    image: require('@/assets/images/panda_bun.png'),
    category: 'Bakery',
    stock: 8,
  },
  {
    id: '3',
    name: 'Rainbow Alpaca Llama Squishy',
    price: 14.99,
    description: 'A cute rainbow-striped alpaca squishy. Extremely colorful and fluffy, it is double-scented and brings instant joy to your collection.',
    scent: 'Sweet Grape 🍇',
    riseTime: '12 - 15 seconds',
    rating: 4.9,
    image: require('@/assets/images/alpaca_rainbow.png'),
    category: 'Animals',
    stock: 62,
  },
  {
    id: '4',
    name: 'Chocolate Donut Bear Squishy',
    price: 9.99,
    description: 'A delicious-looking chocolate-coated bear-shaped donut squishy complete with colorful pink sprinkles. Scented like fresh baked goods.',
    scent: 'Rich Chocolate 🍫',
    riseTime: '8 - 10 seconds',
    rating: 4.7,
    image: require('@/assets/images/donut_bear.png'),
    category: 'Bakery',
    stock: 3,
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
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products from GitHub:', error);
        // ถ้าดึงจาก GitHub ไม่สำเร็จ ให้ใช้ข้อมูลสำรองแทน
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