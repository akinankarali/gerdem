'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { X, Plus, Image as ImageIcon, Loader2, Check } from 'lucide-react'
import { fetchAboutData, fetchPaintings, fetchBlogs, fetchHomeData, fetchTravelRoutes, fetchComments, addData, updateData, deleteData, uploadImageAndSaveUrl } from '../../services/firebaseService'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('homepage')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Homepage state
  const [heroImage, setHeroImage] = useState(null);
  const [introTitle, setIntroTitle] = useState('');
  const [introContent, setIntroContent] = useState('');
  const [introImage, setIntroImage] = useState('');

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState([])
  const [newBlogPost, setNewBlogPost] = useState({ title: '', content: [], coverImage: null })
  const [currentContentInput, setCurrentContentInput] = useState('')

  // Paintings state
  const [paintings, setPaintings] = useState([])
  const [newPainting, setNewPainting] = useState({ title: '', image: null, price: '', description: '', story: '' })

  // Travel routes state
  const [travelRoutes, setTravelRoutes] = useState([])
  const [newTravelRoute, setNewTravelRoute] = useState({ city: '', country: '', year: '', image: null, description: '' })

  // About page state
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutContent, setAboutContent] = useState('')
  const [aboutImage, setAboutImage] = useState(null)

  // Comments state
  const [comments, setComments] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data...")
        const [blogs, paintingsData, aboutData, homeData, travelRoutesData, commentsData] = await Promise.all([
          fetchBlogs(),
          fetchPaintings(),
          fetchAboutData(),
          fetchHomeData(),
          fetchTravelRoutes(),
          fetchComments(),
        ]);

        setBlogPosts(blogs[0]);
        setPaintings(paintingsData[0]);
        setTravelRoutes(travelRoutesData[0]);
        setComments(commentsData);

        if (aboutData && aboutData.length > 0) {
          setAboutTitle(aboutData[0].title || '');
          setAboutContent(aboutData[0].content || '');
          setAboutImage(aboutData[0].image || null);
        } else {
          console.warn("About data is empty or undefined")
        }
        if (homeData && homeData.length > 0) {
          setHeroImage(homeData[0].heroImage || '')
          setIntroTitle(homeData[0].title || '')
          setIntroContent(homeData[0].content || '')
          setIntroImage(homeData[0].summaryImage || '')
          
        } else {
          console.warn("Home data is empty or undefined")
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleImageUpload = async (file, type) => {
    setIsUploading(true);
    try {
      let collectionName, docId;
      
      switch(type) {
        case 'hero':
          collectionName = 'home';
          docId = 'rsMZqPLMdUOF93CijUwu';
          break;
        default:
          throw new Error('Invalid image type');
      }
  
      const imageUrl = await uploadImageAndSaveUrl(file, collectionName, docId);
      console.log("Image uploaded URL:", imageUrl);
  
      if (type === 'hero') {
        setHeroImage(imageUrl);
      }
  
      console.log(`${type} image updated successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUpdateHomepage = async (e) => {
    e.preventDefault();
    try {

      const imageUrl = await uploadImageAndSaveUrl(file, collectionName, docId)

      if (imageType === 'hero') {
        setHeroImage(imageUrl);
      } else if (imageType === 'intro') {
        setIntroImage(imageUrl);
      }

      await updateData('home', 'rsMZqPLMdUOF93CijUwu', {
        heroImage,
        title: introTitle,
        content: introContent,
        summaryImage: introImage
      });
      alert('Ana sayfa başarıyla güncellendi!');
    } catch (error) {
      console.error('Ana sayfa güncellenirken hata oluştu:', error);
    }
  };

  // Blog CRUD
  const handleAddBlogPost = async (e) => {
    e.preventDefault();
    try {
      const newPost = await addData('blogPosts', newBlogPost);
      setBlogPosts([...blogPosts, newPost]);
      setNewBlogPost({ title: '', content: [], coverImage: null });
      alert('Blog yazısı başarıyla eklendi!');
    } catch (error) {
      console.error('Blog yazısı eklenirken hata oluştu:', error);
    }
  };

  const handleDeleteBlogPost = async (postId) => {
    try {
      await deleteData('blogPosts', postId);
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
      alert('Blog yazısı başarıyla silindi!');
    } catch (error) {
      console.error('Blog yazısı silinirken hata oluştu:', error);
    }
  };

  // Paintings CRUD
  const handleAddPainting = async (e) => {
    e.preventDefault();
    try {
      const newPaintingData = await addData('paintings', newPainting);
      setPaintings([...paintings, newPaintingData]);
      setNewPainting({ title: '', image: null, price: '', description: '', story: '' });
      alert('Tablo başarıyla eklendi!');
    } catch (error) {
      console.error('Tablo eklenirken hata oluştu:', error);
    }
  };

  const handleDeletePainting = async (paintingId) => {
    try {
      await deleteData('paintings', paintingId);
      setPaintings(paintings.filter(painting => painting.id !== paintingId));
      alert('Tablo başarıyla silindi!');
    } catch (error) {
      console.error('Tablo silinirken hata oluştu:', error);
    }
  };

  // Travel Routes CRUD
  const handleAddTravelRoute = async (e) => {
    e.preventDefault();
    try {
      const newRouteData = await addData('travelRoutes', newTravelRoute);
      setTravelRoutes([...travelRoutes, newRouteData]);
      setNewTravelRoute({ city: '', country: '', year: '', image: null, description: '' });
      alert('Gezi rotası başarıyla eklendi!');
    } catch (error) {
    }
  };

  const handleDeleteTravelRoute = async (routeId) => {
    try {
      await deleteData('travelRoutes', routeId);
      setTravelRoutes(travelRoutes.filter(route => route.id !== routeId));
      alert('Gezi rotası başarıyla silindi!');
    } catch (error) {
      console.error('Gezi rotası silinirken hata oluştu:', error);
    }
  };

  // About Page CRUD
  const handleUpdateAboutPage = async (e) => {
    e.preventDefault();
    try {
      await updateData('about', 'aboutPage', {
        title: aboutTitle,
        content: aboutContent,
        image: aboutImage
      });
      alert('Hakkımda sayfası başarıyla güncellendi!');
    } catch (error) {
      console.error('Hakkımda sayfası güncellenirken hata oluştu:', error);
    }
  };

  // Comments CRUD
  const handleApproveComment = async (commentId) => {
    try {
      await updateData('comments', commentId, { isApproved: true });
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, isApproved: true } : comment
      ));
      alert('Yorum onaylandı!');
    } catch (error) {
      console.error('Yorum onaylanırken hata oluştu:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteData('comments', commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      alert('Yorum başarıyla silindi!');
    } catch (error) {
      console.error('Yorum silinirken hata oluştu:', error);
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
    );
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
          className={`px-4 py-2 ${activeTab === 'travel' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('travel')}
        >
          Gezi Rotaları
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'about' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('about')}
        >
          Hakkımda
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'comments' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('comments')}
        >
          Yorumlar
        </button>
      </div>

      {activeTab === 'homepage' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Ana Sayfa Düzenleme</h2>
          <form onSubmit={handleUpdateHomepage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hero Görseli</label>
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
              <label className="block text-sm font-medium text-gray-700">Tanıtım Başlığı</label>
              <input
                type="text"
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanıtım İçeriği</label>
              <textarea
                value={introContent}
                onChange={(e) => setIntroContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanıtım Görseli</label>
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
                <div key={index} className="flex items-start mb-2 w-full">
                  {item.type === 'text' ? (
                    <div className="flex-grow overflow-hidden">
                      <p className="whitespace-pre-wrap break-words">{item.content}</p>
                    </div>
                  ) : (
                    <div className="relative w-20 h-20">
                      <Image src={item.url} alt="Blog içerik resmi" layout="fill" objectFit="cover" className="rounded" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setNewBlogPost({
                        ...newBlogPost,
                        content: newBlogPost.content.filter((_, i) => i !== index)
                      });
                    }}
                    className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <div className="flex flex-col mt-4">
                <textarea
                  value={currentContentInput}
                  onChange={(e) => setCurrentContentInput(e.target.value)}
                  placeholder="Metin ekle..."
                  className="w-full p-2 border rounded mr-2 h-32 resize-y"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentContentInput.trim()) {
                        setNewBlogPost({
                          ...newBlogPost,
                          content: [...newBlogPost.content, { type: 'text', content: currentContentInput.trim() }]
                        });
                        setCurrentContentInput('');
                      }
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
                  >
                    Metin Ekle
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'blog')}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    <ImageIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Blog Yazısı Ekle
            </button>
          </form>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Mevcut Blog Yazıları</h3>
            {blogPosts.items.map((post) => (
              <div key={post.id} className="border p-4 rounded mb-4">
                <h4 className="font-bold">{post.title}</h4>
                {post.image && (
                  <div className="relative w-32 h-32 mb-2">
                    <span>image:</span>
                    <Image src={post.image} alt="Blog kapak resmi" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                 {post.city && (
                  <div className="relative mb-2 flex items-center">
                    <span>city and continent:</span>
                    <p className='whitespace-break-spaces break-words p-4'>{post.city}, {post.continent}</p>
                  </div>
                )}
                
                 {post.date && (
                  <div className="relative mb-2 flex items-center">
                    <span>date:</span>
                    <p className='whitespace-break-spaces break-words p-4'>{post.date}</p>
                  </div>
                )}
                {post.description && (
                  <div className="relative mb-2 flex items-center">
                    <span>description:</span>
                    <p className='whitespace-break-spaces break-words p-4'>{post.description}</p>
                  </div>
                )}
                {post.content && (
                  <div className="relative mb-2 flex items-center">
                    <span>content:</span>
                    <p className='whitespace-break-spaces break-all p-4'>{post.content}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteBlogPost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
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
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'painting')}
                className="hidden"
                id="paintingImageUpload"
              />
              <label
                htmlFor="paintingImageUpload"
                className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Tablo Resmi Yükle
              </label>
              {newPainting.image && (
                <div className="relative w-20 h-20">
                  <Image src={newPainting.image} alt="Tablo resmi" layout="fill" objectFit="cover" className="rounded" />
                </div>
              )}
            </div>
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
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Mevcut Tablolar</h3>
            {paintings.items.map((painting) => (
              <div key={painting.id} className="border p-4 rounded mb-4">
                <h4 className="font-bold">{painting.title}</h4>
                <p className="text-gray-700 mb-2">{painting.priceEUR} EURO</p>
                <p className="text-gray-700 mb-2">{painting.priceTRY} TRY</p>
                <p className="text-gray-700 mb-2">story: {painting.story}</p>
                <p className="text-gray-700 mb-2">description: {painting.description}</p>

                {painting.image && (
                  <div className="relative w-32 h-32 mb-2">
                    <Image src={painting.image} alt="Tablo resmi" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <button
                  onClick={() => handleDeletePainting(painting.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'travel' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Yeni Gezi Rotası</h2>
          <form onSubmit={handleAddTravelRoute} className="space-y-4">
            <input
              type="text"
              value={newTravelRoute.city}
              onChange={(e) => setNewTravelRoute({ ...newTravelRoute, city: e.target.value })}
              placeholder="Şehir"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={newTravelRoute.country}
              onChange={(e) => setNewTravelRoute({ ...newTravelRoute, country: e.target.value })}
              placeholder="Ülke"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={newTravelRoute.year}
              onChange={(e) => setNewTravelRoute({ ...newTravelRoute, year: e.target.value })}
              placeholder="Yıl"
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'travel')}
                className="hidden"
                id="travelImageUpload"
              />
              <label
                htmlFor="travelImageUpload"
                className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Gezi Resmi Yükle
              </label>
              {newTravelRoute.image && (
                <div className="relative w-20 h-20">
                  <Image src={newTravelRoute.image} alt="Gezi resmi" layout="fill" objectFit="cover" className="rounded" />
                </div>
              )}
            </div>
            <textarea
              value={newTravelRoute.description}
              onChange={(e) => setNewTravelRoute({ ...newTravelRoute, description: e.target.value })}
              placeholder="Açıklama"
              className="w-full p-2 border rounded h-32"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Gezi Rotası Ekle
            </button>
          </form>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Mevcut Gezi Rotaları</h3>
            {travelRoutes.item.map((route) => (
              <div key={route.id} className="border p-4 rounded mb-4">
                <h4 className="font-bold">{route.title}, ({route.year})</h4>
                <p className="text-gray-700 mb-2">{route.description}</p>
                {route.image && (
                  <div className="relative w-32 h-32 mb-2">
                    <Image src={route.image} alt="Gezi resmi" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <button
                  onClick={() => handleDeleteTravelRoute(route.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Hakkımda Sayfası Düzenleme</h2>
          <form onSubmit={handleUpdateAboutPage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Başlık</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">İçerik</label>
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profil Görseli</label>
              <div className="mt-1 flex items-center">
                {aboutImage && (
                  <div className="relative w-32 h-32 mr-4">
                    <Image src={aboutImage} alt="Profil" layout="fill" objectFit="cover" className="rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'about')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Hakkımda Sayfasını Güncelle
            </button>
          </form>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Yorum Yönetimi</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{comment.name}</h3>
                    <p className="text-sm text-gray-500">{comment.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{comment.message}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleApproveComment(comment.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      )}
    </div>
  );
}