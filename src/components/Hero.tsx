import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

export default function Hero() {
  const categories = [
    { name: 'Jollof', icon: '🍛', active: true },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Soup', icon: '🍲' },
  ];

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
              Hungry? Order <span className="text-orange-600">ASAP</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-medium">
              The fastest food delivery in Ghana. Freshly prepared meals from your favorite local restaurants delivered right to your doorstep.
            </p>
            
            <div className="vibrant-shadow bg-white p-2 rounded-full border border-orange-100 flex items-center max-w-md mb-10">
              <input 
                type="text" 
                placeholder="Enter your delivery location..." 
                className="flex-1 px-6 bg-transparent border-none outline-none text-gray-900 font-medium"
              />
              <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 font-bold">
                Find Food
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.name}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                    cat.active 
                      ? 'bg-yellow-400 border-yellow-400 text-white shadow-lg shadow-yellow-200' 
                      : 'bg-white border-gray-100 text-gray-600 hover:border-orange-200'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  {cat.name}
                </div>
              ))}
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
                src="https://picsum.photos/seed/jollof-rice-asap/1000/1000" 
                alt="Delicious Jollof Rice" 
                className="w-full h-full object-cover rounded-[30px] shadow-2xl"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              
              {/* Floating Food Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
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
