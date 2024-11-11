'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

// Mock data for paintings
const paintings = [
  {
    id: 1,
    title: 'Yaz Esintisi',
    image: '/assets/1111.jpeg',
    price: '₺2,500',
    description: 'Ege kıyılarından esinlenerek yapılmış bu tablo, yaz mevsiminin sıcaklığını ve denizin ferahlığını yansıtıyor.',
    story: "Bu tabloyu, geçen yaz Çeşme'de geçirdiğim bir hafta sonunda yaptım. Sahilde otururken gördüğüm manzara beni o kadar etkiledi ki, hemen tuvale aktarmak istedim."
  },
  {
    id: 2,
    title: 'Sonbahar Yaprakları',
    image: '/assets/1111.jpeg',
    price: '₺1,800',
    description: 'Sonbaharın sıcak renkleriyle bezeli bu tablo, mevsimin hüzünlü güzelliğini yansıtıyor.',
    story: "Belgrad Ormanı'nda yaptığım bir yürüyüş sırasında, yerdeki yaprakların renk cümbüşü beni büyüledi. Bu tabloyu yaparken o anın duygusunu tekrar yaşadım."
  },
  {
    id: 3,
    title: 'İstanbul Silueti',
    image: '/assets/1111.jpeg',
    price: '₺3,000',
    description: "İstanbul'un tarihi yarımadasının siluetini gün batımında resmeden bu tablo, şehrin büyüleyici atmosferini yansıtıyor.",
    story: "Üsküdar'da bir arkadaşımı ziyaret ettiğim bir akşam, pencereden gördüğüm manzara karşısında adeta büyülendim. O an, bu tabloyu yapma fikri doğdu."
  },
]

export default function Tablolar() {
  const [selectedPainting, setSelectedPainting] = useState(null)

  const openModal = (painting) => {
    setSelectedPainting(painting)
  }

  const closeModal = () => {
    setSelectedPainting(null)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-center text-gray-900 mb-12">Tablolar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paintings.map((painting) => (
          <motion.div
            key={painting.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal(painting)}
          >
            <Image
              src={painting.image}
              alt={painting.title}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{painting.title}</h2>
              <p className="text-gray-600">{painting.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPainting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Image
                    src={selectedPainting.image}
                    alt={selectedPainting.title}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-semibold mb-2">{selectedPainting.title}</h2>
                  <p className="text-xl text-gray-700 mb-4">{selectedPainting.price}</p>
                  <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                  <p className="text-gray-600 mb-4">{selectedPainting.description}</p>
                  <h3 className="text-lg font-semibold mb-2">Hikaye</h3>
                  <p className="text-gray-600 mb-6">{selectedPainting.story}</p>
                  <button
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                    onClick={() => alert(`${selectedPainting.title} satın alma işlemi başlatıldı.`)}
                  >
                    Satın Al
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}