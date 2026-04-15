import { useState } from 'react';
import { MENU_ITEMS, CATEGORIES } from '@/constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Our Menu</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of delicious Ghanaian dishes, prepared with fresh ingredients and authentic spices.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <TabsList className="bg-gray-100/50 p-1 rounded-full h-14 border border-gray-200">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-8 h-12 rounded-full text-sm font-bold data-[state=active]:bg-yellow-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-gray-100 vibrant-card-shadow transition-all duration-300 rounded-[32px]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {item.popular && (
                      <Badge className="absolute top-4 left-4 bg-orange-600 text-white border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-black text-gray-900">{item.name}</CardTitle>
                      <span className="text-lg font-black text-orange-600">GH₵{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </CardHeader>
                  <CardFooter className="pb-6 pt-2">
                    <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white rounded-full h-12 font-bold group transition-all">
                      Add to Cart
                      <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}
