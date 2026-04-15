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
    image: '/images/menu-fried-rice.jpg',
    featured: true,
    popular: true,
  },
  {
    id: 'jollof-1',
    name: 'Jollof Rice',
    description: 'Classic Ghanaian Jollof rice, spicy and flavorful.',
    price: 40,
    category: 'Jollof',
    image: 'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
  },
  {
    id: 'wakye-1',
    name: 'Wakye',
    description: 'Traditional rice and beans dish served with shito and sides.',
    price: 40,
    category: 'Wakye',
    image: 'https://images.pexels.com/photos/32612769/pexels-photo-32612769.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
  },
  {
    id: 'spaghetti-1',
    name: 'Spaghetti with Chicken',
    description: 'Delicious spaghetti served with well-seasoned chicken.',
    price: 40,
    category: 'Offers',
    image: 'https://images.pexels.com/photos/9814666/pexels-photo-9814666.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'plain-rice-1',
    name: 'Plain Rice',
    description: 'Steamed plain rice served with stew or gravy.',
    price: 35,
    category: 'Plain Rice',
    image: 'https://images.pexels.com/photos/8994586/pexels-photo-8994586.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'ampesi-1',
    name: 'Ampesi',
    description: 'Boiled yam or plantain served with garden egg stew or palava sauce.',
    price: 45,
    category: 'Ampesi',
    image: 'https://images.pexels.com/photos/27556971/pexels-photo-27556971.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const HERO_IMAGE = '/images/hero.jpg';
export const LOGO_IMAGE = '/images/logo.jpg';
export const EVENT_BANNER = '/images/event-banner.jpg';

export const CATEGORIES = ['All', 'Fried Rice', 'Plain Rice', 'Ampesi', 'Jollof', 'Wakye', 'Offers'];

export const PHOTO_CREDITS = [
  { name: 'J KREATOR', url: 'https://www.pexels.com/@jkreat0r' },
  { name: "Keesha's Kitchen", url: 'https://www.pexels.com/@keesha-s-kitchen-22731136' },
  { name: 'Merkhat Amangeldinov', url: 'https://www.pexels.com/@merkhat-amangeldinov-2301120' },
  { name: 'Carlos Lopez', url: 'https://www.pexels.com/@carlos-lopez-117694035' },
  { name: 'I Own My Food Art', url: 'https://www.pexels.com/@i-own-my-food-art-76108785' },
  { name: 'Snappr', url: 'https://www.pexels.com/@snappr' },
];