'use client'

import { useState, useEffect } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { fetchCommentsByBlogId, updateCommentApproval, deleteComment } from '../../services/firebaseService'

export default function CommentsAdmin() {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingComments, setProcessingComments] = useState(new Set())

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const allComments = await fetchCommentsByBlogId(null);
      console.log('Fetched comments:', allComments);
      setComments(allComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApprove = async (commentId) => {
    setProcessingComments(prev => new Set(prev).add(commentId))
    try {
      await updateCommentApproval(commentId, true)
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, isApproved: true } : comment
      ))
    } catch (error) {
      console.error('Error approving comment:', error)
    } finally {
      setProcessingComments(prev => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return

    setProcessingComments(prev => new Set(prev).add(commentId))
    try {
      await deleteComment(commentId)
      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setProcessingComments(prev => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Yorum Yönetimi</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">Henüz yorum bulunmuyor.</p>
      ) : (
        <div className="grid gap-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`border rounded-lg p-4 ${
                comment.isApproved ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{comment.name}</h3>
                  <p className="text-sm text-gray-500">{comment.email}</p>
                </div>
                <span className="text-sm text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-700 mb-4">{comment.message}</p>
              <div className="flex justify-end gap-2">
                {!comment.isApproved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    disabled={processingComments.has(comment.id)}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={processingComments.has(comment.id)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}