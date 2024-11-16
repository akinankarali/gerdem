'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, ChevronDown } from 'lucide-react';
import { fetchPaintings } from '../../services/firebaseService'; // Assuming this function exists

export default function Layout({ children, blogs }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [continents, setContinents] = useState({});
  const [hasPaintings, setHasPaintings] = useState(false);

  useEffect(() => {
    const continentMap = {};

    blogs.forEach(item => {
      const continent = item.continent;
      const city = item.city;

      if (continent && city) {
        if (!continentMap[continent]) {
          continentMap[continent] = new Set();
        }
        continentMap[continent].add(city);
      }
    });

    const formattedContinents = {};
    for (const [continent, cities] of Object.entries(continentMap)) {
      formattedContinents[continent] = Array.from(cities);
    }

    setContinents(formattedContinents);

    const checkPaintings = async () => {
      const paintings = await fetchPaintings();
      setHasPaintings(paintings.length > 0);
    };
    checkPaintings();
  }, [blogs]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center md:items-end">
            <div className="hidden md:block w-1/4">
              <nav className="flex space-x-6 text-sm">
                <Link href="/" className="hover:text-gray-600 transition-colors duration-300">ANA SAYFA</Link>
                <Link href="/about" className="hover:text-gray-600 transition-colors duration-300">HAKKIMDA</Link>
              </nav>
            </div>

            <Link href="/" className="text-center">
              <motion.div 
                className="font-serif text-3xl font-normal tracking-wide"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Gözde Erdem
              </motion.div>
            </Link>

            <div className="hidden md:block w-1/4">
              <nav className="flex justify-end space-x-6 text-sm">
                <Link href="/travel-routes" className="hover:text-gray-600 transition-colors duration-300">GEZİ ROTALARI</Link>
                <Link href="/contact" className="hover:text-gray-600 transition-colors duration-300">İLETİŞİM</Link>
              </nav>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <div className="space-y-2">
                <div className="w-8 h-0.5 bg-black"></div>
                <div className="w-8 h-0.5 bg-black"></div>
                <div className="w-8 h-0.5 bg-black"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="hidden md:block border-t">
          <div className="container mx-auto px-4">
            <nav className="flex justify-center space-x-8 py-4 text-sm">
              <AnimatePresence>
                {Object.entries(continents).map(([continent, cities]) => (
                  <motion.div 
                    key={continent}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(continent)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="hover:text-gray-600 transition-colors duration-300 flex items-center">
                      {continent} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {openDropdown === continent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 top-full w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      >
                        <div className="py-1">
                          {cities.map(city => (
                           <Link
                            key={city}
                            href={`/blog?city=${encodeURIComponent(city)}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {city}
                          </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                <Link href="/blog" className="hover:text-gray-600 transition-colors duration-300">Blog</Link>
                {hasPaintings && (
                  <Link href="/paintings" className="hover:text-gray-600 transition-colors duration-300">Tablolarım</Link>
                )}
              </AnimatePresence>
            </nav>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <motion.div 
          className="md:hidden border-b"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/" className="hover:text-gray-600 transition-colors duration-300">ANA SAYFA</Link>
              <Link href="/about" className="hover:text-gray-600 transition-colors duration-300">HAKKIMDA</Link>
              <Link href="/travel-routes" className="hover:text-gray-600 transition-colors duration-300">GEZİ ROTALARI</Link>
              <Link href="/blog" className="hover:text-gray-600 transition-colors duration-300">BLOG</Link>
              {hasPaintings && (
                <Link href="/paintings" className="hover:text-gray-600 transition-colors duration-300">TABLOLARIM</Link>
              )}
              <Link href="/contact" className="hover:text-gray-600 transition-colors duration-300">İLETİŞİM</Link>
            </div>
          </nav>
        </motion.div>
      )}

      <main className="flex-grow">{children}</main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-8">
            <motion.a 
              href="https://instagram.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
            <motion.a 
              href="https://facebook.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Facebook className="h-5 w-5" />
            </motion.a>
            <motion.a 
              href="https://twitter.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Gözde Erdem. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}