import { UtensilsCrossed, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { PHOTO_CREDITS } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <UtensilsCrossed className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold tracking-tighter">JOVIVA FOODS</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Bringing the authentic flavors of Ghana to your doorstep. Quality ingredients, traditional recipes, and fast delivery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/jovivafoods" target="_blank" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@jovivafoods" target="_blank" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all text-xs font-bold">
                Tik
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-orange-500 transition-colors">Our Menu</a></li>
              <li><a href="#offers" className="hover:text-orange-500 transition-colors">Special Offers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Opening Hours</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white">7am - 12am</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white">5pm - 12am</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white">9am - 12am</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                <span>Kwabenya, Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <a href="tel:+233554984950" className="hover:text-orange-500 transition-colors">0554984950 / 0245897533</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <a href="mailto:jovivafoods@gmail.com" className="hover:text-orange-500 transition-colors">jovivafoods@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-top border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Asap Foods. All Rights Reserved.</p>
          <p>Food photos by {PHOTO_CREDITS.slice(0, 3).map((p, i) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener" className="text-orange-500 hover:text-orange-400">{p.name}</a>
          )).reduce((acc: any[], x) => acc === null ? [x] : [...acc, ', ', x], null)} on <a href="https://www.pexels.com" target="_blank" rel="noopener" className="text-orange-500 hover:text-orange-400">Pexels</a></p>
        </div>
      </div>
    </footer>
  );
}
