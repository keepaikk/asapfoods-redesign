import { useState } from 'react';
import { ShoppingCart, Menu, X, UtensilsCrossed, Download, Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '@/hooks/useSettings';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { settings } = useSettings();
  const { state, dispatch } = useCart();

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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

  const checkoutMessage = () => {
    if (state.items.length === 0) return '';
    const lines = state.items.map(
      (i) => `${i.name} x${i.quantity} - GH₵${i.price * i.quantity}`
    );
    return (
      `Hi Joviva Foods! I'd like to place an order:\n\n` +
      lines.join('\n') +
      `\n\nTotal: GH₵${totalPrice}\n\nPlease confirm my order. Thank you!`
    );
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
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 font-bold flex items-center gap-2 h-10 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart{totalItems > 0 && ` (${totalItems})`}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-6 w-6 text-orange-600" />
                    Your Cart
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <AnimatePresence>
                      {state.items.length === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-gray-500 py-8"
                        >
                          Your cart is empty
                        </motion.p>
                      )}
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 items-center bg-gray-50 rounded-2xl p-3"
                        >
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{item.name}</p>
                            <p className="text-xs text-orange-600 font-bold">GH₵{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dispatch({ type: 'UPDATE', id: item.id, quantity: item.quantity - 1 })}
                              className="h-8 w-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({ type: 'UPDATE', id: item.id, quantity: item.quantity + 1 })}
                              className="h-8 w-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                              className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 ml-2"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {state.items.length > 0 && (
                    <div className="border-t pt-4 pb-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-600">Total</span>
                        <span className="text-xl font-black text-orange-600">GH₵{totalPrice}</span>
                      </div>
                      <a
                        href={`https://wa.me/${settings?.phone || '233554984950'}?text=${encodeURIComponent(checkoutMessage())}`}
                        target="_blank"
                        rel="noopener"
                        onClick={() => {
                          dispatch({ type: 'CLEAR' });
                          setCartOpen(false);
                        }}
                        className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-full font-bold text-sm transition-all"
                      >
                        Checkout via WhatsApp
                      </a>
                      <button
                        onClick={() => dispatch({ type: 'CLEAR' })}
                        className="block w-full text-gray-500 text-center py-2 text-xs hover:text-red-500 transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[380px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-6 w-6 text-orange-600" />
                    Your Cart
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {state.items.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                    )}
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-gray-50 rounded-2xl p-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-orange-600 font-bold">GH₵{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE', id: item.id, quantity: item.quantity - 1 })}
                            className="h-8 w-8 rounded-full bg-white border flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE', id: item.id, quantity: item.quantity + 1 })}
                            className="h-8 w-8 rounded-full bg-white border flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                            className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center ml-1"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {state.items.length > 0 && (
                    <div className="border-t pt-4 pb-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-600">Total</span>
                        <span className="text-xl font-black text-orange-600">GH₵{totalPrice}</span>
                      </div>
                      <a
                        href={`https://wa.me/${settings?.phone || '233554984950'}?text=${encodeURIComponent(checkoutMessage())}`}
                        target="_blank"
                        rel="noopener"
                        onClick={() => {
                          dispatch({ type: 'CLEAR' });
                          setCartOpen(false);
                        }}
                        className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-full font-bold text-sm transition-all"
                      >
                        Checkout via WhatsApp
                      </a>
                      <button
                        onClick={() => dispatch({ type: 'CLEAR' })}
                        className="block w-full text-gray-500 text-center py-2 text-xs hover:text-red-500 transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
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
