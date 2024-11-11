'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { fetchHomeData, fetchBlogs } from '../services/firebaseService' 
import { Instagram, Facebook, Twitter, Search, ChevronDown } from 'lucide-react'

export default function HomePage() {
  const [homeData, setHomeData] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await fetchHomeData()
        if (homeData.length > 0) {
          setHomeData(homeData[0]) // İlk belgeyi kullanıyoruz
        }
        
        const blogs = await fetchBlogs()
        setBlogPosts(blogs[0].items.slice(0, 3)) // İlk 3 blog yazısını al
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  if (!homeData) {
    return <p className="text-center">Yükleniyor...</p>
  }

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="initial"
      animate="animate"
      variants={pageTransition}
    >
      {/* Hero Section */}
      <motion.section 
        className="relative h-[64vh] overflow-hidden"
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={homeData.heroImage || '/placeholder-hero.jpg'} // Varsayılan görsel yedeği
          alt="Hero Image"
          fill
          priority
          className="object-cover w-full h-full"
        />
      </motion.section>

      {/* Introduction Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-4xl mb-6">{homeData.title}</h1>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{homeData.content}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[250px] md:h-[300px] overflow-hidden rounded-lg"
            >
              <Image
                src={homeData.summaryImage || '/placeholder-summary.jpg'} // Varsayılan görsel yedeği
                alt="Summary Image"
                fill
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="font-serif text-3xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Son Yazılarım
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link href={`/blog/${post.title.replace(/\s+/g, '-').toLowerCase()}`} key={post.id || index} className="cursor-pointer">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
                >
                  <motion.div 
                    className="relative h-64"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={post.image || '/placeholder-image.jpg'} // Varsayılan görsel yedeği
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.description || 'Detay bulunmuyor.'}</p>
                    <span className="text-sm font-semibold hover:text-gray-600 transition-colors duration-300">
                      DEVAMINI OKU →
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}