'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Search } from 'lucide-react'
import { fetchAboutData } from '../../services/firebaseService'

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutContent, setAboutContent] = useState('')
  const [aboutImage, setAboutImage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutData = await fetchAboutData()
        if (aboutData.length > 0) {
          const { title, content, image } = aboutData[0]
          setAboutTitle(title || 'Hakkımda')
          setAboutContent(content || '')
          setAboutImage(image || null)
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-serif text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {aboutTitle}
        </motion.h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={aboutImage}
                alt="Gözde Erdem"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-4 text-gray-600">
                <p>{aboutContent}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
 </div> )}