'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fetchPaintings } from '../../services/firebaseService'
import { Loader2 } from 'lucide-react'
import PaintingModal from '../components/PaintingModal'

export default function PaintingsPage() {
  const [paintings, setPaintings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const paintingsData = await fetchPaintings()
        setPaintings(paintingsData)
      } catch (error) {
        console.error('Error fetching paintings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePaintingClick = (painting) => {
    setSelectedPainting(painting)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif text-center mb-12">My Paintings</h1>
      {paintings.length === 0 ? (
        <p className="text-center text-gray-600">No paintings available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paintings.map((painting, index) => (
            <motion.div
              key={painting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => handlePaintingClick(painting)}
            >
              <div className="relative h-64">
                <Image
                  src={painting.image || '/placeholder-painting.jpg'}
                  alt={painting.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-serif text-xl mb-2">{painting.title}</h2>
                <p className="text-gray-600 mb-4">{painting.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{painting.priceTRY} TL</span>
                  <span className="text-sm text-gray-500">{painting.priceEUR} EUR</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {selectedPainting && (
        <PaintingModal
          painting={selectedPainting}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}