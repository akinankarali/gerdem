'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { fetchBlogs } from '../../services/firebaseService'

function generateSlug(title) {
  if (!title) {
    return 'untitled'
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
    .replace(/^-+|-+$/g, '')
}

export default function BlogContent() {
  const [blogPosts, setBlogPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const searchParams = useSearchParams()
  const city = searchParams.get('city')

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

  useEffect(() => {
    if (city) {
      const filtered = blogPosts.filter(post => post.city === city)
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(blogPosts)
    }
  }, [city, blogPosts])

  return (
    <>
      <motion.h1 
        className="text-4xl font-serif text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {city ? `${city}` : 'Blog'}
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id || index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${generateSlug(post.title)}`} className="block group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage || '/placeholder-image.jpg'}
                  alt={post.title || 'Untitled'}
                  fill
                  priority={index < 6}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-xl font-serif mb-2 group-hover:text-gray-600 transition-colors duration-300">
                {post.title || 'Untitled'}
              </h2>
              <p className="text-gray-600 mb-2 break-words overflow-hidden" style={{ overflowWrap: 'anywhere', wordWrap: 'break-word' }}>{post.description || 'No description available.'}</p>
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <span>{post.city}</span>
                {post.city && post.continent && <span>•</span>}
                <span>{post.continent}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{post.date || 'No date available'}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  )
}