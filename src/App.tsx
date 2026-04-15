import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';
import Footer from '@/components/Footer';
import { EVENT_BANNER } from '@/constants';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <main>
        <Hero />
        
        {/* Featured Section (Stats Bar Style) */}
        <section className="py-16 bg-[#1A1A1A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-4xl font-black text-yellow-400">500+</span>
                <span className="text-[10px] font-bold uppercase tracking-[2px] opacity-60">Restaurants</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-4xl font-black text-yellow-400">15k+</span>
                <span className="text-[10px] font-bold uppercase tracking-[2px] opacity-60">Happy Users</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-4xl font-black text-yellow-400">25min</span>
                <span className="text-[10px] font-bold uppercase tracking-[2px] opacity-60">Avg Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-4xl font-black text-yellow-400">4.8/5</span>
                <span className="text-[10px] font-bold uppercase tracking-[2px] opacity-60">User Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Event Banner */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[24px] overflow-hidden shadow-xl max-w-2xl mx-auto"
            >
              <img 
                src={EVENT_BANNER} 
                alt="ASAP Foods Event" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

        <MenuSection />

        {/* Call to Action Section */}
        <section id="offers" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#FF5C00]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 skew-x-12 translate-x-1/4" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[40px] p-12 md:p-20 text-center text-white">
              <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
                Hungry? Order <span className="text-yellow-400">Joviva</span>.
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-bold">
                The fastest food delivery in Ghana. Freshly prepared meals from your favorite local restaurants delivered right to your doorstep.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-white text-orange-600 px-10 py-5 rounded-full text-lg font-black hover:bg-yellow-400 hover:text-white transition-all shadow-2xl shadow-black/20">
                  Find Food
                </button>
                <button className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full text-lg font-black hover:bg-white/10 transition-all">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Floating WhatsApp 24/7 Agent Button */}
      <a 
        href="https://wa.me/233554984950?text=Hi%20Joviva%20Foods!%20I'd%20like%20to%20place%20an%20order."
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl shadow-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 group"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="hidden group-hover:block text-sm font-bold whitespace-nowrap">24/7 AI Agent</span>
      </a>
    </div>
  );
}

