'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import BlogAdmin from '../components/BlogAdmin'
import TravelRoutesAdmin from '../components/TravelRoutesAdmin'
import CommentsAdmin from '../components/CommentsAdmin'
import PaintingsAdmin from '../components/PaintingsAdmin'
import AboutAdmin from '../components/AboutAdmin'
import { fetchPaintings, fetchHomeData, uploadImageAndSaveUrl, updateHomepageData, getContactMessages } from '../../services/firebaseService'
import { auth, signInWithEmailAndPassword } from '../../firebase'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('homepage')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [heroImage, setHeroImage] = useState('')
  const [introTitle, setIntroTitle] = useState('')
  const [introContent, setIntroContent] = useState('')
  const [introImage, setIntroImage] = useState('')

  const [paintings, setPaintings] = useState({ items: [] })
  const [contactMessages, setContactMessages] = useState([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (user) {
        fetchInitialData()
      } else {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const [homeData, paintingsData, messagesData] = await Promise.all([
        fetchHomeData(),
        fetchPaintings(),
        getContactMessages()
      ])

      if (homeData && homeData.length > 0) {
        setHeroImage(homeData[0].heroImage || '')
        setIntroTitle(homeData[0].title || '')
        setIntroContent(homeData[0].content || '')
        setIntroImage(homeData[0].summaryImage || '')
      }

      setPaintings(paintingsData[0] || { items: [] })
      setContactMessages(messagesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      console.log('Giriş başarılı:', userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      alert('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
    }
  };

  const handleImageUpload = async (file, type) => {
    if (file instanceof File) {
      setIsUploading(true)
      try {
        const url = await uploadImageAndSaveUrl(file, 'home', 'rsMZqPLMdUOF93CijUwu')
        console.log(`${type} image uploaded URL:`, url)
        if (type === 'hero') {
          setHeroImage(url)
        } else if (type === 'intro') {
          setIntroImage(url)
        }
        
        const updateData = type === 'hero' ? { heroImage: url } : { summaryImage: url }
        await updateHomepageData(updateData, 'home', 'rsMZqPLMdUOF93CijUwu')
        
        console.log(`${type} image updated in Firestore`)
        return url
      } catch (error) {
        console.error('Görsel yüklenirken bir hata oluştu: ', error)
        throw error
      } finally {
        setIsUploading(false)
      }
    } else {
      console.error('Geçersiz dosya objesi')
      return null
    }
  }
  
  const handleUpdateHomepage = async (e) => {
    e.preventDefault()
  
    try {
      const dataToUpdate = {
        title: introTitle,
        content: introContent,
      }
  
      await updateHomepageData(dataToUpdate, 'home', 'rsMZqPLMdUOF93CijUwu')
      console.log("Ana sayfa başarıyla güncellendi.")
    } catch (error) {
      console.error('Veri güncellenirken bir hata oluştu:', error)
    }
  }

  const handleAddPainting = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const paintingData = {
        title: newPainting.title,
        image: newPainting.image,
        priceEUR: newPainting.priceEUR,
        priceTRY: newPainting.priceTRY,
        description: newPainting.description,
        story: newPainting.story
      }
      
      await addData('paintings', 'K8q02F4um0lM5yco6dPl', {
        items: [...paintings.items, paintingData]
      })
      
      setPaintings({
        items: [...paintings.items, paintingData]
      })
      
      setNewPainting({
        title: '',
        image: null,
        priceEUR: '',
        priceTRY: '',
        description: '',
        story: ''
      })
      
      alert('Tablo başarıyla eklendi!')
    } catch (error) {
      console.error('Tablo eklenirken hata oluştu:', error)
      alert('Tablo eklenirken bir hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDeletePainting = async (paintingId) => {
    setIsUploading(true)
    
    try {
      const updatedItems = paintings.items.filter((painting) => painting.id !== paintingId)
      await updateData('paintings', 'K8q02F4um0lM5yco6dPl', {
        items: updatedItems
      })
      
      setPaintings({
        items: updatedItems
      })
      
      alert('Tablo başarıyla silindi!')
    } catch (error) {
      console.error('Tablo silinirken hata oluştu:', error)
      alert('Tablo silinirken bir hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Girişi</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full p-2 mb-4 border rounded"
            />
            <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">
              Giriş
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Paneli</h1>
      <div className="flex justify-center mb-8 space-x-4">
        <button
          className={`px-4 py-2 ${activeTab === 'homepage' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('homepage')}
        >
          Home Page
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'blog' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Posts
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'paintings' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('paintings')}
        >
          My Paintings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'travel' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('travel')}
        >
          Travel Routes
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'about' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'comments' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'contact' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Messages
        </button>
      </div>

      {activeTab === 'homepage' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Home Page Edit</h2>
          <form onSubmit={handleUpdateHomepage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hero Image</label>
              <div className="mt-1 flex items-center">
                {heroImage && (
                  <div className="relative w-32 h-32 mr-4">
                    <Image src={heroImage} alt="Hero" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'hero')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Introductory Title</label>
              <input
                type="text"
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Introductory Content</label>
              <textarea
                value={introContent}
                onChange={(e) => setIntroContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Introductory Image</label>
              <div className="mt-1 flex items-center">
                {introImage && (
                  <div className="relative w-32 h-32 mr-4">
                    <Image src={introImage} alt="Intro" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'intro')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Home Page Update
            </button>
          </form>
        </div>
      )}

      {activeTab === 'blog' && <BlogAdmin />}
      {activeTab === 'paintings' && <PaintingsAdmin paintings={paintings} setPaintings={setPaintings} />}
      {activeTab === 'travel' && <TravelRoutesAdmin />}
      {activeTab === 'about' && <AboutAdmin />}
      {activeTab === 'comments' && <CommentsAdmin />}

      {activeTab === 'contact' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
          {contactMessages.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="grid gap-4">
              {contactMessages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 bg-white shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{message.name}</h3>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}