import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, MapPin, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Hero() {
  const { settings } = useSettings();
  const [location, setLocation] = useState('');
  const [finding, setFinding] = useState(false);
  const [result, setResult] = useState<{ distance: number; address: string } | null>(null);
  const [error, setError] = useState('');

  const handleFindFood = () => {
    setError('');
    setResult(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setFinding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const restLat = settings?.restaurantLat ?? 5.6891;
        const restLng = settings?.restaurantLng ?? -0.1869;
        const distance = haversine(userLat, userLng, restLat, restLng);
        setResult({
          distance: Math.round(distance * 10) / 10,
          address: settings?.restaurantAddress || 'Kwabenya, Accra, Ghana',
        });
        setFinding(false);
      },
      () => {
        setError('Unable to get your location. Please enable location permissions.');
        setFinding(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-16 overflow-hidden bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.95] mb-8">
              Hungry? Order <span className="text-orange-600">Joviva</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-medium">
              The fastest food delivery in Ghana. Freshly prepared meals from your favorite local restaurants delivered right to your doorstep.
            </p>

            <div className="vibrant-shadow bg-white p-2 rounded-full border border-orange-100 flex items-center max-w-md mb-4">
              <MapPin className="h-5 w-5 text-orange-600 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your area or click Find Food..."
                className="flex-1 px-4 bg-transparent border-none outline-none text-gray-900 font-medium"
              />
              <Button
                onClick={handleFindFood}
                disabled={finding}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 font-bold"
              >
                {finding ? 'Finding...' : 'Find Food'}
              </Button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 text-sm font-bold mb-4 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {error}
                </motion.p>
              )}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 max-w-md"
                >
                  <p className="text-green-800 font-bold text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    You are {result.distance} km from Joviva Foods
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    Restaurant: {result.address}
                  </p>
                  <p className="text-green-700 text-xs mt-1 font-bold">
                    Estimated delivery: {Math.max(15, Math.round(result.distance * 3 + 10))} min
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${settings?.phone || '233554984950'}?text=${encodeURIComponent(settings?.whatsappMessage || "Hi Joviva Foods! I'd like to place an order.")}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-600 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp (24/7)
              </a>
              <a
                href="#menu"
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                View Menu
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-square bg-orange-600 rounded-[40px] overflow-hidden flex items-center justify-center p-6 md:p-10">
              <img
                src={settings?.heroImage || '/images/hero.jpg'}
                alt="Delicious Jollof Rice"
                className="w-full h-full object-cover rounded-[30px] shadow-2xl"
                loading="eager"
              />

              {/* Floating Food Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-12 -right-8 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 w-60 border border-orange-50"
              >
                <div className="h-14 w-14 rounded-2xl bg-yellow-100" />
                <div>
                  <p className="text-sm font-black text-gray-900">Jollof & Chicken</p>
                  <p className="text-xs font-bold text-orange-600">GH₵ 45.00</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-12 -left-8 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 w-60 border border-orange-50"
              >
                <div className="h-14 w-14 rounded-2xl bg-orange-100" />
                <div>
                  <p className="text-sm font-black text-gray-900">Red Red Special</p>
                  <p className="text-xs font-bold text-orange-600">GH₵ 35.00</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
