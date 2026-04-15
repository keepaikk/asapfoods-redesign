export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  featured?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'fried-rice-1',
    name: 'Fried Rice',
    description: 'Savory fried rice with vegetables and your choice of protein.',
    price: 40,
    category: 'Fried Rice',
    image: 'https://picsum.photos/seed/friedrice/800/600',
    featured: true,
    popular: true,
  },
  {
    id: 'jollof-1',
    name: 'Jollof Rice',
    description: 'Classic Ghanaian Jollof rice, spicy and flavorful.',
    price: 40,
    category: 'Jollof',
    image: 'https://picsum.photos/seed/jollof-dish-menu/800/600',
    popular: true,
  },
  {
    id: 'wakye-1',
    name: 'Wakye',
    description: 'Traditional rice and beans dish served with shito and sides.',
    price: 40,
    category: 'Wakye',
    image: 'https://picsum.photos/seed/wakye/800/600',
    popular: true,
  },
  {
    id: 'spaghetti-1',
    name: 'Spaghetti with Chicken',
    description: 'Delicious spaghetti served with well-seasoned chicken.',
    price: 40,
    category: 'Offers',
    image: 'https://picsum.photos/seed/spaghetti/800/600',
  },
  {
    id: 'plain-rice-1',
    name: 'Plain Rice',
    description: 'Steamed plain rice served with stew or gravy.',
    price: 35,
    category: 'Plain Rice',
    image: 'https://picsum.photos/seed/plainrice/800/600',
  },
  {
    id: 'ampesi-1',
    name: 'Ampesi',
    description: 'Boiled yam or plantain served with garden egg stew or palava sauce.',
    price: 45,
    category: 'Ampesi',
    image: 'https://picsum.photos/seed/ampesi/800/600',
  },
];

export const CATEGORIES = ['All', 'Fried Rice', 'Plain Rice', 'Ampesi', 'Jollof', 'Wakye', 'Offers'];
