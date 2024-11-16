import { Suspense } from 'react'
import BlogContent from './BlogContent'

export default function BlogPage() {
  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-4xl font-serif text-center text-gray-900 mb-12">Loading...</div>}>
        <BlogContent />
      </Suspense>
    </main>
  )
}