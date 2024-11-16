'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ImageIcon, Loader2, ArrowUp, ArrowDown, Edit, Trash } from 'lucide-react'
import { uploadImage, addBlogPost, fetchBlogs, deleteBlogPost, updateBlogPost } from '../../services/firebaseService'

export default function BlogAdmin() {
  const [isUploading, setIsUploading] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    coverImage: '',
    city: '',
    continent: '',
    date: '',
    description: '',
    content: []
  })
  const [currentText, setCurrentText] = useState('')
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const blogs = await fetchBlogs()
      setBlogPosts(blogs[0]?.items || [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }
  }

  const handleCoverImageUpload = async (file) => {
    if (!file) return
    setIsUploading(true)
    try {
      const url = await uploadImage(file, 'covers')
      setNewBlogPost(prev => ({ ...prev, coverImage: url }))
    } catch (error) {
      console.error('Cover image upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleContentImageUpload = async (file, index) => {
    if (!file) return
    setIsUploading(true)
    try {
      const url = await uploadImage(file, 'content')
      const newContent = [...newBlogPost.content]
      if (typeof index === 'number') {
        newContent.splice(index + 1, 0, { type: 'image', content: url })
      } else {
        newContent.push({ type: 'image', content: url })
      }
      setNewBlogPost(prev => ({ ...prev, content: newContent }))
    } catch (error) {
      console.error('Content image upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddText = (index) => {
    if (!currentText.trim()) return
    const newContent = [...newBlogPost.content]
    if (typeof index === 'number') {
      newContent.splice(index + 1, 0, { type: 'text', content: currentText.trim() })
    } else {
      newContent.push({ type: 'text', content: currentText.trim() })
    }
    setNewBlogPost(prev => ({ ...prev, content: newContent }))
    setCurrentText('')
  }

  const handleRemoveContent = (index) => {
    setNewBlogPost(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }))
  }

  const moveContent = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === newBlogPost.content.length - 1)
    ) return

    const newContent = [...newBlogPost.content]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const [removed] = newContent.splice(index, 1)
    newContent.splice(newIndex, 0, removed)
    setNewBlogPost(prev => ({ ...prev, content: newContent }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const postData = {
        ...newBlogPost,
        date: new Date().toLocaleDateString()
      }

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData)
        setBlogPosts(prevPosts => prevPosts.map(post => 
          post.id === editingPost.id ? { ...post, ...postData } : post
        ))
        alert('Blog yazısı başarıyla güncellendi!')
      } else {
        const newPost = await addBlogPost(postData)
        setBlogPosts(prevPosts => [...prevPosts, newPost])
        alert('Blog yazısı başarıyla eklendi!')
      }

      setNewBlogPost({
        title: '',
        coverImage: '',
        city: '',
        continent: '',
        date: '',
        description: '',
        content: []
      })
      setEditingPost(null)
    } catch (error) {
      console.error('Blog yazısı işlemi sırasında hata oluştu:', error)
      alert('Blog yazısı işlemi sırasında bir hata oluştu.')
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setNewBlogPost({
      title: post.title,
      coverImage: post.coverImage,
      city: post.city,
      continent: post.continent,
      date: post.date,
      description: post.description,
      content: post.content
    })
  }

  const handleDelete = async (postId) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBlogPost(postId)
        setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
        alert('Blog yazısı başarıyla silindi!')
      } catch (error) {
        console.error('Blog yazısı silinirken hata oluştu:', error)
        alert('Blog yazısı silinirken bir hata oluştu.')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Başlık"
            value={newBlogPost.title}
            onChange={(e) => setNewBlogPost(prev => ({ ...prev, title: e.target.value }))}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Şehir"
            value={newBlogPost.city}
            onChange={(e) => setNewBlogPost(prev => ({ ...prev, city: e.target.value }))}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Kıta"
            value={newBlogPost.continent}
            onChange={(e) => setNewBlogPost(prev => ({ ...prev, continent: e.target.value }))}
            className="p-2 border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Kapak Fotoğrafı</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverImageUpload(e.target.files[0])}
              className="hidden"
              id="coverImage"
            />
            <label
              htmlFor="coverImage"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <ImageIcon className="w-5 h-5" />
              Kapak Fotoğrafı Seç
            </label>
            {newBlogPost.coverImage && (
              <div className="relative w-20 h-20">
                <Image
                  src={newBlogPost.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <textarea
          placeholder="Kısa Açıklama"
          value={newBlogPost.description}
          onChange={(e) => setNewBlogPost(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border rounded-lg h-24"
        />

        <div className="space-y-4">
          <h3 className="font-medium">İçerik</h3>
          <div className="space-y-4">
            {newBlogPost.content.map((item, index) => (
              <div key={index} className="flex items-start gap-2 group relative">
                <div className="flex flex-col items-center absolute -left-8">
                  <button
                    type="button"
                    onClick={() => moveContent(index, 'up')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveContent(index, 'down')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    disabled={index === newBlogPost.content.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                
                {item.type === 'text' ? (
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                    {item.content}
                  </div>
                ) : (
                  <div className="relative w-40 h-40">
                    <Image
                      src={item.content}
                      alt={`Content ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveContent(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleContentImageUpload(e.target.files[0], index)}
                    className="hidden"
                    id={`contentImage${index}`}
                  />
                  <label
                    htmlFor={`contentImage${index}`}
                    className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Metin ekle..."
                className="w-full p-2 border rounded-lg h-24"
              />
              <button
                type="button"
                onClick={() => handleAddText()}
                className="mt-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Metin Ekle
              </button>
            </div>
            <div className="flex items-start">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleContentImageUpload(e.target.files[0])}
                className="hidden"
                id="newContentImage"
              />
              <label
                htmlFor="newContentImage"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                <ImageIcon className="w-5 h-5" />
                Fotoğraf Ekle
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Yükleniyor...
            </span>
          ) : (
            editingPost ? 'Blog Yazısını Güncelle' : 'Blog Yazısı Ekle'
          )}
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Mevcut Blog Yazıları</h3>
        {blogPosts.map((post) => (
          <div key={post.id} className="border p-4 rounded mb-4">
            <h4 className="font-bold">{post.title}</h4>
            {post.coverImage && (
              <div className="relative w-32 h-32 mb-2">
                <Image src={post.coverImage} alt="Blog kapak resmi" layout="fill" objectFit="cover" className="rounded" />
              </div>
            )}
            <p>Şehir ve Kıta: {post.city}, {post.continent}</p>
            <p>Tarih: {post.date}</p>
            <p>Açıklama: {post.description}</p>
            <div className="mt-4 space-y-4">
              {post.content.slice(0, 2).map((item, index) => (
                <div key={index}>
                  {item.type === 'text' ? (
                    <p>{item.content.substring(0, 100)}...</p>
                  ) : (
                    <div className="relative w-32 h-32">
                      <Image src={item.content} alt={`Content ${index + 1}`} layout="fill" objectFit="cover" className="rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}