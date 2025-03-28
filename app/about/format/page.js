'use client'

import { useState, useEffect } from 'react'
import { fetchAboutData, updateAboutPage } from '../../../services/firebaseService'

export default function FormatAboutContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: '',
    content: '',
    image: ''
  })
  
  // Original text with paragraphs
  const paragraphedText = `I was born in 1993 in Eskişehir, Turkey — a quiet, cozy city that once built a tiny artificial sea and proudly celebrated it like we'd just gained a coastline. (Okay yes, I'm being sarcastic — but honestly, it was kind of a great move. Respect, Eskişehir.) Eventually, I moved to Istanbul, because that's what you do when you want chaos, crowds, and the best food in the world all at once.

I'm now a 32-year-old white-collar survivor living in Amsterdam — aka the city I wouldn't shut up about after one weekend trip, so I moved here five years ago and never looked back.

This blog is basically my digital escape from the madness of work life. When I'm not in front of a screen pretending to understand financial reports, I love to share the bits of life that actually make me feel alive: traveling, eating at places that make me go "wow" (or occasionally "never again"), trying out random hobbies with far too much initial enthusiasm, and writing about it all.

One thing that really frustrates me in many blogs is the constant pressure to make life look perfect. Perfect routines, perfect outfits, perfect mornings, perfect skin — and somehow everyone's always sipping matcha in beige sweaters? No thanks. This blog isn't about fitting into a box or pretending life is always polished and aesthetic. It's about sharing the messy, real, joyful, and sometimes ridiculous journey of just… being human.

You'll find posts here about the places I visit (and when I say I love to travel, I mean I literally count down the days until my next trip like it's a national holiday), the food I obsess over, the hobbies I start (and maybe never finish), and the honest bits of life as a Turkish expat in the Netherlands. The good, the bad, the awkward language barrier moments — all of it.

So yeah… I don't really know where this blog will go, but if you're up for some honest stories, a bit of sarcasm, and the occasional overshare — welcome. Pull up a chair (or just scroll on your phone like the rest of us), and let's see where this thing takes us.`

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

  const handleUpdate = async () => {
    setIsLoading(true)

    try {
      // Update with the paragraphed text
      await updateAboutPage({
        ...aboutData,
        content: paragraphedText
      })
      setSuccess(true)
    } catch (error) {
      console.error('Error updating about page:', error)
      alert('Error updating content.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Format About Content</h1>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Content updated successfully with proper paragraph formatting! 
          <a href="/about" className="underline ml-2">View the About page</a>
        </div>
      ) : (
        <>
          <p className="mb-4">This page will update your About content with properly formatted paragraphs.</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Current content (without proper formatting):</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              {aboutData.content}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">New content (with proper paragraph formatting):</h2>
            <div className="bg-gray-100 p-4 rounded-md whitespace-pre-line">
              {paragraphedText}
            </div>
          </div>
          
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Updating...' : 'Update Content with Proper Formatting'}
          </button>
        </>
      )}
    </div>
  )
} 