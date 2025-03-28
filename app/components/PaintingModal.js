import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function PaintingModal({ painting, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <div className="relative h-64 md:h-96">
                <Image
                  src={painting.image || '/placeholder-painting.jpg'}
                  alt={painting.title}
                  layout="fill"
                  objectFit="cover"
                  onLoadingComplete={() => setIsLoading(false)}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-serif mb-4">{painting.title}</h2>
                <p className="text-gray-600 mb-4">{painting.description}</p>
                <p className="text-gray-800 mb-4">{painting.story}</p>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">{painting.priceTRY} TL</span>
                  <span className="text-lg text-gray-500">{painting.priceEUR} EUR</span>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}