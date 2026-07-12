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
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jumbo Strawberry Cat Squishy',
    price: 12.99,
    description: 'An adorable, jumbo-sized squishy combining a sweet kitty shape with a juicy strawberry design. Super squishy and slow-rising memory foam!',
    scent: 'Sweet Strawberry 🍓',
    riseTime: '10 - 12 seconds',
    rating: 5,
    image: require('@/assets/images/strawberry_cat.png'),
    category: 'Fruits & Animals',
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
  },
];
