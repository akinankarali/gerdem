'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogs } from '../../services/firebaseService' // Firebase veri çekme fonksiyonunu import et

function generateSlug(title) {
  if (!title) {
    return 'untitled'; // title değeri boş veya undefined ise 'untitled' döner
  }
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await fetchBlogs()
        setBlogPosts(blogs[0].items || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <motion.h1 
        className="text-4xl font-serif text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blog
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id || index} // id alanı yoksa index kullanılır
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${generateSlug(post.title)}`} className="block group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.image || '/placeholder-image.jpg'} // image boşsa placeholder kullanılır
                  alt={post.title || 'Untitled'}
                  fill
                  priority={index < 6}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-xl font-serif mb-2 group-hover:text-gray-600 transition-colors duration-300">{post.title || 'Untitled'}</h2>
              <p className="text-gray-600 mb-2">{post.description || 'No description available.'}</p>
              <p className="text-sm text-gray-500">{post.date || 'No date available'}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  )
}