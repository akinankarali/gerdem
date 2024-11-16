'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Loader from '../../components/Loader'
import { ArrowLeft } from 'lucide-react'
import { fetchBlogs, addComment, fetchCommentsByBlogId } from '../../../services/firebaseService'

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

export default function BlogDetailPage() {
  const params = useParams()
  const [blogPost, setBlogPost] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await fetchBlogs()
        const slug = params?.slug
        const foundPost = blogs[0].items.find((post) => generateSlug(post.title) === slug)
        if (foundPost) {
          setBlogPost(foundPost)
          const blogComments = await fetchCommentsByBlogId(foundPost.id)
          setComments(blogComments)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
      }
    }

    if (params?.slug) {
      fetchData()
    }
  }, [params?.slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newComment = {
        blogId: blogPost.id,
        name,
        email,
        message,
        date: new Date().toLocaleString('tr-TR'),
        isApproved: false
      }

      await addComment(newComment)
      
      setName('')
      setEmail('')
      setMessage('')
      alert('Yorumunuz gönderildi ve onay bekliyor. Teşekkür ederiz!')
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!blogPost) {
    return <Loader />
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Blog&apos;a Dön
          </Link>
        </div>

        <motion.h1 
          className="text-4xl font-serif text-gray-900 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blogPost.title}
        </motion.h1>

        <div className="flex items-center text-gray-600 mb-8 gap-2">
          <span>{blogPost.city}</span>
          {blogPost.city && blogPost.continent && <span>•</span>}
          <span>{blogPost.continent}</span>
          <span>•</span>
          <span>{blogPost.date}</span>
        </div>

        {blogPost.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-96 mb-8 rounded-lg overflow-hidden"
          >
            <Image
              src={blogPost.coverImage}
              alt={blogPost.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-8"
        >
          {blogPost.content && blogPost.content.map((item, index) => (
            <div key={index} className="mb-6">
              {item.type === 'text' ? (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{item.content}</p>
              ) : item.type === 'image' ? (
                <div className="relative h-96 rounded-lg overflow-hidden my-8">
                  <Image
                    src={item.content}
                    alt={`Blog content image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-serif mb-4">Yorumlar</h2>
          {comments.filter(comment => comment.isApproved).length === 0 ? (
            <p className="text-gray-600">Henüz onaylanmış yorum bulunmuyor.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {comments
                .filter(comment => comment.isApproved)
                .map((comment) => (
                  <div key={comment.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-gray-800">{comment.name}</h3>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">İsim</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-posta</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Yorum</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}