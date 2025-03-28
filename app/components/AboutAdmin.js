'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { fetchAboutData, updateAboutPage, uploadAboutImage } from '../../services/firebaseService'

export default function AboutAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: '',
    content: '',
    image: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await fetchAboutData()
      if (data.length > 0) {
        setAboutData({
          title: data[0].title || '',
          content: data[0].content || '',
          image: data[0].image || ''
        })
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsLoading(true)
    try {
      const imageUrl = await uploadAboutImage(file)
      setAboutData(prev => ({ ...prev, image: imageUrl }))
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('An error occurred while uploading the image.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateAboutPage(aboutData)
      alert('About page updated!')
    } catch (error) {
      console.error('Error updating about page:', error)
      alert('Error updating about page.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6">Edit About Page</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={aboutData.title}
            onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={aboutData.content}
            onChange={(e) => setAboutData(prev => ({ ...prev, content: e.target.value }))}
            rows={10}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profil Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profileImage"
            />
            <label
              htmlFor="profileImage"
              className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Select Image
            </label>
            {aboutData.image && (
              <div className="relative w-32 h-32">
                <Image
                  src={aboutData.image}
                  alt="Profil görseli"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Updating...
            </span>
          ) : (
            'Update About Page'
          )}
        </button>
      </form>
    </div>
  )
}