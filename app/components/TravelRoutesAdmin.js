'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, X } from 'lucide-react'
import { fetchTravelRoutes, addTravelRoute, deleteTravelRoute, uploadTravelImage } from '../../services/firebaseService'

export default function TravelRoutesAdmin() {
  const [isUploading, setIsUploading] = useState(false)
  const [travelRoutes, setTravelRoutes] = useState({ item: [] })
  const [newTravelRoute, setNewTravelRoute] = useState({
    title: '',
    description: '',
    year: '',
    image: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const routes = await fetchTravelRoutes()
      setTravelRoutes(routes[0] || { item: [] })
    } catch (error) {
      console.error('Error fetching travel routes:', error)
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return
    setIsUploading(true)
    try {
      const url = await uploadTravelImage(file)
      setNewTravelRoute(prev => ({ ...prev, image: url }))
    } catch (error) {
      console.error('Image upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addTravelRoute(newTravelRoute)
      setNewTravelRoute({
        title: '',
        description: '',
        year: '',
        image: ''
      })
      await fetchData()
      alert('Gezi rotası başarıyla eklendi!')
    } catch (error) {
      console.error('Error adding travel route:', error)
      alert('Gezi rotası eklenirken bir hata oluştu.')
    }
  }

  const handleDelete = async (routeId) => {
    if (window.confirm('Bu gezi rotasını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTravelRoute(routeId)
        await fetchData()
        alert('Gezi rotası başarıyla silindi!')
      } catch (error) {
        console.error('Error deleting travel route:', error)
        alert('Gezi rotası silinirken bir hata oluştu.')
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Yeni Gezi Rotası</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlık (Şehir, Ülke)
            </label>
            <input
              type="text"
              value={newTravelRoute.title}
              onChange={(e) => setNewTravelRoute(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Örn: Amsterdam, Hollanda"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yıl
            </label>
            <input
              type="text"
              value={newTravelRoute.year}
              onChange={(e) => setNewTravelRoute(prev => ({ ...prev, year: e.target.value }))}
              placeholder="Örn: 2024"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={newTravelRoute.description}
              onChange={(e) => setNewTravelRoute(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Gezi rotası hakkında kısa bir açıklama..."
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gezi Görseli
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="hidden"
                id="travelImage"
              />
              <label
                htmlFor="travelImage"
                className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Görsel Seç
              </label>
              {newTravelRoute.image && (
                <div className="relative w-20 h-20">
                  <Image
                    src={newTravelRoute.image}
                    alt="Seçilen görsel"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Yükleniyor...
              </span>
            ) : (
              'Gezi Rotası Ekle'
            )}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Mevcut Gezi Rotaları</h2>
        <div className="grid gap-6">
          {travelRoutes.item.map((route) => (
            <div key={route.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{route.title}</h3>
                  <p className="text-gray-600">{route.year}</p>
                </div>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {route.image && (
                <div className="relative h-48 my-4 rounded-lg overflow-hidden">
                  <Image
                    src={route.image}
                    alt={route.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <p className="text-gray-700">{route.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}