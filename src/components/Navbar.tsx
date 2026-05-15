import { useState } from 'react';
import { ShoppingCart, Menu, X, UtensilsCrossed, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '@/hooks/useSettings';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Menu', href: '#menu' },
    { name: 'Offers', href: '#offers' },
  ];

  const handleDownloadMenu = async () => {
    const bannerUrl = settings?.eventBanner || '/images/event-banner.jpg';
    try {
      const response = await fetch(bannerUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'joviva-menu.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(bannerUrl, '_blank');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-1">
            <img src={settings?.logoImage || '/images/logo.jpg'} alt="Joviva Foods" className="h-12 w-auto object-contain" />
            <span className="text-2xl font-black tracking-tighter text-orange-600">Joviva</span>
            <span className="text-2xl font-black tracking-tighter text-yellow-500">Foods</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleDownloadMenu}
              className="text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Download Menu
            </button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 font-bold flex items-center gap-2 h-10">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart (0)</span>
            </Button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                    Joviva Foods
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleDownloadMenu();
                    }}
                    className="text-lg font-medium text-gray-900 hover:text-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Menu
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
