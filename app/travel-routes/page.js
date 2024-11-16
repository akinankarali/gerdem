'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Loader from '../components/Loader'
import { ChevronDown, MapPin } from 'lucide-react'
import { fetchTravelRoutes } from '../../services/firebaseService'

export default function GeziRotalari() {
  const [expandedRoute, setExpandedRoute] = useState(null)
  const [travelRoutes, setTravelRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTravelRoutes() {
      try {
        const routes = await fetchTravelRoutes()
        setTravelRoutes(routes[0]?.item || [])
      } catch (error) {
        console.error('Error fetching travel routes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTravelRoutes()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl font-serif text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Gezi Rotalarım
          </motion.h1>

          <div className="relative overflow-hidden">
            <svg className="w-full" height={travelRoutes.length * 250} viewBox={`0 0 400 ${travelRoutes.length * 250}`}>
              <path
                d={`M 200 0 ${travelRoutes.map((_, index) => 
                    `Q ${index % 2 ? 350 : 50} ${125 + index * 250} 200 ${250 + index * 250}`
                ).join(' ')}`}
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="6,6"
              />
            </svg>
          </div>

          <div className="relative" style={{ marginTop: `-${travelRoutes.length * 250}px` }}>
            {travelRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                className="mb-16 relative"
                initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`flex items-center ${index % 2 ? 'justify-end' : 'justify-start'}`}>
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                  >
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </motion.div>
                </div>

                <div className={`mt-2 ${index % 2 ? 'text-right mr-16' : 'ml-16'}`}>
                  <h2 className="text-xl font-serif text-gray-900">{route.title}</h2>
                  <p className="text-gray-600">{route.year}</p>
                </div>

                <AnimatePresence>
                  {expandedRoute === route.id && (
                    <motion.div 
                      className={`mt-4 bg-white rounded-lg shadow-lg overflow-hidden ${index % 2 ? 'mr-16' : 'ml-16'}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6">
                        <div className="relative mb-4" style={{ height: "32rem" }}>
                          <Image
                            src={route.image}
                            alt={route.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-gray-600">{route.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={`flex items-center ${index % 2 ? 'justify-end mr-16' : 'justify-start ml-16'}`}>
                  <motion.button
                    className="mt-2 flex items-center text-gray-600 hover:text-gray-900"
                    onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {expandedRoute === route.id ? 'Gizle' : 'Detayları Gör'}
                    <ChevronDown className={`ml-1 transform transition-transform ${expandedRoute === route.id ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}