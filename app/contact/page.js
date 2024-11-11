'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Search } from 'lucide-react'

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newComment= {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toLocaleString('tr-TR')
    }
    setComments([newComment, ...comments])
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
  
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-serif text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          İletişim
        </motion.h1>

        <div className="max-w-4xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mesaj</label>
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
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Gönder
              </motion.button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  )
}