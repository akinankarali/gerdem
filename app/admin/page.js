'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { X, Plus, Image as ImageIcon, Loader2, Check } from 'lucide-react'
import { fetchAboutData, fetchPaintings, fetchBlogs, fetchHomeData, addData, updateData, deleteData } from '../../services/firebaseService'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('homepage')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Homepage state
  const [heroImage, setHeroImage] = useState(null)
  const [introTitle, setIntroTitle] = useState('')
  const [introContent, setIntroContent] = useState('')
  const [introImage, setIntroImage] = useState(null)

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState([])
  const [newBlogPost, setNewBlogPost] = useState({ title: '', content: [], coverImage: null })
  const [currentContentInput, setCurrentContentInput] = useState('')

  // Paintings state
  const [paintings, setPaintings] = useState([])
  const [newPainting, setNewPainting] = useState({ title: '', image: null, price: '', description: '', story: '' })

  // About page state
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutContent, setAboutContent] = useState('')
  const [aboutImage, setAboutImage] = useState(null)

  useEffect(() => {
    // Firebase'den verileri çekme
    async function fetchData() {
      try {
        const blogs = await fetchBlogs();
        const paintingsData = await fetchPaintings();
        const aboutData = await fetchAboutData();
        const homeData = await fetchHomeData();

        setBlogPosts(blogs);
        setPaintings(paintingsData);
        if (aboutData.length > 0) {
          setAboutTitle(aboutData[0].title);
          setAboutContent(aboutData[0].content);
          setAboutImage(aboutData[0].image);
        }
        if (homeData.length > 0) {
          setHeroImage(homeData[0].heroImage);
          setIntroTitle(homeData[0].introTitle);
          setIntroContent(homeData[0].introContent);
          setIntroImage(homeData[0].introImage);
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    }

    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Yanlış şifre!');
    }
  };

  const handleAddBlogPost = async (e) => {
    e.preventDefault();
    try {
      await addData('blogs', newBlogPost);
      setBlogPosts([...blogPosts, { ...newBlogPost, id: Date.now() }]);
      setNewBlogPost({ title: '', content: [], coverImage: null });
      alert('Blog yazısı başarıyla eklendi!');
    } catch (error) {
      console.error('Blog eklenirken hata oluştu:', error);
    }
  };

  const handleUpdateBlogPost = async (blogId, updatedData) => {
    try {
      await updateData('blogs', blogId, updatedData);
      setBlogPosts(blogPosts.map(b => (b.id === blogId ? { ...b, ...updatedData } : b)));
      alert('Blog yazısı başarıyla güncellendi!');
    } catch (error) {
      console.error('Blog güncellenirken hata oluştu:', error);
    }
  };

  const handleDeleteBlogPost = async (blogId) => {
    try {
      await deleteData('blogs', blogId);
      setBlogPosts(blogPosts.filter(b => b.id !== blogId));
      alert('Blog yazısı başarıyla silindi!');
    } catch (error) {
      console.error('Blog silinirken hata oluştu:', error);
    }
  };

  const handleAddPainting = async (e) => {
    e.preventDefault();
    try {
      await addData('paintings', newPainting);
      setPaintings([...paintings, { ...newPainting, id: Date.now() }]);
      setNewPainting({ title: '', image: null, price: '', description: '', story: '' });
      alert('Tablo başarıyla eklendi!');
    } catch (error) {
      console.error('Tablo eklenirken hata oluştu:', error);
    }
  };

  const handleUpdatePainting = async (paintingId, updatedData) => {
    try {
      await updateData('paintings', paintingId, updatedData);
      setPaintings(paintings.map(p => (p.id === paintingId ? { ...p, ...updatedData } : p)));
      alert('Tablo başarıyla güncellendi!');
    } catch (error) {
      console.error('Tablo güncellenirken hata oluştu:', error);
    }
  };

  const handleDeletePainting = async (paintingId) => {
    try {
      await deleteData('paintings', paintingId);
      setPaintings(paintings.filter(p => p.id !== paintingId));
      alert('Tablo başarıyla silindi!');
    } catch (error) {
      console.error('Tablo silinirken hata oluştu:', error);
    }
  };

  const handleAddAbout = async (e) => {
    e.preventDefault();
    try {
      const aboutData = { title: aboutTitle, content: aboutContent, image: aboutImage };
      await addData('about', aboutData);
      alert('Hakkımda sayfası başarıyla eklendi/güncellendi!');
    } catch (error) {
      console.error('Hakkımda sayfası eklenirken hata oluştu:', error);
    }
  };

  const handleUpdateAbout = async (aboutId, updatedData) => {
    try {
      await updateData('about', aboutId, updatedData);
      alert('Hakkımda sayfası başarıyla güncellendi!');
    } catch (error) {
      console.error('Hakkımda sayfası güncellenirken hata oluştu:', error);
    }
  };

  const handleDeleteAbout = async (aboutId) => {
    try {
      await deleteData('about', aboutId);
      alert('Hakkımda sayfası başarıyla silindi!');
    } catch (error) {
      console.error('Hakkımda sayfası silinirken hata oluştu:', error);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Paneli</h1>
      <div className="flex justify-center mb-8 space-x-4">
        <button
          className={`px-4 py-2 ${activeTab === 'homepage' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('homepage')}
        >
          Ana Sayfa
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'blog' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Yazıları
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'paintings' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('paintings')}
        >
          Tablolar
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'about' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('about')}
          > Hakkımda
          </button>
        </div>
  
        {activeTab === 'homepage' && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Ana Sayfa Düzenleme</h2>
            <form onSubmit={handleAddAbout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Görseli</label>
                {heroImage && (
                  <div className="relative w-32 h-32 mb-4">
                    <Image src={heroImage} alt="Hero" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'hero')}
                  className="block w-full text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanıtım Başlığı</label>
                <input
                  type="text"
                  value={introTitle}
                  onChange={(e) => setIntroTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanıtım İçeriği</label>
                <textarea
                  value={introContent}
                  onChange={(e) => setIntroContent(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              {introImage && (
                <div className="relative w-32 h-32 mb-4">
                  <Image src={introImage} alt="Intro" layout="fill" objectFit="cover" className="rounded" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'intro')}
                className="block w-full text-sm text-gray-500"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Ana Sayfa Güncelle
              </button>
            </form>
          </div>
        )}
  
        {activeTab === 'blog' && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Yeni Blog Yazısı</h2>
            <form onSubmit={handleAddBlogPost} className="space-y-4">
              <input
                type="text"
                value={newBlogPost.title}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                placeholder="Başlık"
                className="w-full p-2 border rounded"
              />
              <div className="border p-4 rounded">
                <h3 className="font-bold mb-2">İçerik</h3>
                {newBlogPost.content.map((item, index) => (
                  <div key={index} className="flex items-start mb-2">
                    {item.type === 'text' ? (
                      <p className="whitespace-pre-wrap break-words">{item.content}</p>
                    ) : (
                      <div className="relative w-20 h-20">
                        <Image src={item.url} alt="Blog içerik resmi" layout="fill" objectFit="cover" className="rounded" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeContentItem(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <textarea
                  value={currentContentInput}
                  onChange={(e) => setCurrentContentInput(e.target.value)}
                  placeholder="Metin ekle..."
                  className="w-full p-2 border rounded h-32"
                />
                <button
                  type="button"
                  onClick={() => handleAddContentItem('text')}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mt-2"
                >
                  Metin Ekle
                </button>
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Blog Yazısı Ekle
              </button>
            </form>
          </div>
        )}
  
        {activeTab === 'paintings' && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Yeni Tablo</h2>
            <form onSubmit={handleAddPainting} className="space-y-4">
              <input
                type="text"
                value={newPainting.title}
                onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
                placeholder="Başlık"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'painting')}
                className="block w-full text-sm text-gray-500"
              />
              <input
                type="text"
                value={newPainting.price}
                onChange={(e) => setNewPainting({ ...newPainting, price: e.target.value })}
                placeholder="Fiyat"
                className="w-full p-2 border rounded"
              />
              <textarea
                value={newPainting.description}
                onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
                placeholder="Açıklama"
                className="w-full p-2 border rounded h-32"
              />
              <textarea
                value={newPainting.story}
                onChange={(e) => setNewPainting({ ...newPainting, story: e.target.value })}
                placeholder="Hikaye"
                className="w-full p-2 border rounded h-32"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Tablo Ekle
              </button>
            </form>
          </div>
        )}
  
        {activeTab === 'about' && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Hakkımda Sayfası Düzenleme</h2>
            <form onSubmit={handleAddAbout} className="space-y-4">
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                placeholder="Başlık"
                className="w-full p-2 border rounded"
              />
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="İçerik"
                className="w-full p-2 border rounded h-32"
              />
              {aboutImage && (
                <div className="relative w-32 h-32 mb-4">
                  <Image src={aboutImage} alt="Profil" layout="fill" objectFit="cover" className="rounded" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'about')}
                className="block w-full text-sm text-gray-500"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Hakkımda Güncelle
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }