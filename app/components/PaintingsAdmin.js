'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { fetchPaintings, addPainting, updatePainting, deletePainting, uploadPaintingImage } from '../../services/firebaseService'

export default function PaintingsAdmin() {
  const [paintings, setPaintings] = useState([])
  const [newPainting, setNewPainting] = useState({
    title: '',
    image: '',
    priceEUR: '',
    priceTRY: '',
    description: '',
    story: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const paintingsData = await fetchPaintings()
        setPaintings(paintingsData)
      } catch (error) {
        console.error('Error fetching paintings:', error)
        setPaintings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddPainting = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const paintingId = await addPainting(newPainting)
      
      setPaintings(prevPaintings => [...prevPaintings, { id: paintingId, ...newPainting }])
      
      setNewPainting({
        title: '',
        image: '',
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
    if (!window.confirm('Bu tabloyu silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsUploading(true)
    
    try {
      await deletePainting(paintingId)
      
      setPaintings(prevPaintings => prevPaintings.filter(painting => painting.id !== paintingId))
      
      alert('Tablo başarıyla silindi!')
    } catch (error) {
      console.error('Tablo silinirken hata oluştu:', error)
      alert('Tablo silinirken bir hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadPaintingImage(file)
      setNewPainting(prev => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error('Görsel yüklenirken hata oluştu:', error)
      alert('Görsel yüklenirken bir hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Yeni Tablo</h2>
      <form onSubmit={handleAddPainting} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Başlık</label>
          <input
            type="text"
            value={newPainting.title}
            onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Görsel</label>
          <div className="mt-1 flex items-center">
            {newPainting.image && (
              <div className="relative w-32 h-32 mr-4">
                <Image 
                  src={newPainting.image} 
                  alt="Yeni tablo görseli" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fiyat (EUR)</label>
            <input
              type="text"
              value={newPainting.priceEUR}
              onChange={(e) => setNewPainting({ ...newPainting, priceEUR: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fiyat (TRY)</label>
            <input
              type="text"
              value={newPainting.priceTRY}
              onChange={(e) => setNewPainting({ ...newPainting, priceTRY: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            value={newPainting.description}
            onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hikaye</label>
          <textarea
            value={newPainting.story}
            onChange={(e) => setNewPainting({ ...newPainting, story: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isUploading ? 'Ekleniyor...' : 'Tablo Ekle'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Mevcut Tablolar</h3>
        {paintings.length === 0 ? (
          <p>Henüz tablo bulunmuyor.</p>
        ) : (
          <div className="grid gap-6">
            {paintings.map((painting) => (
              <div key={painting.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{painting.title}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <p className="text-gray-700">
                        <span className="font-medium">EUR:</span> {painting.priceEUR}€
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">TRY:</span> {painting.priceTRY}₺
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Açıklama:</span> {painting.description}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Hikaye:</span> {painting.story}
                      </p>
                    </div>
                  </div>
                  {painting.image && (
                    <div className="relative w-40 h-40 ml-4 flex-shrink-0">
                      <Image
                        src={painting.image}
                        alt={painting.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDeletePainting(painting.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      )}
    </div>
  )
}