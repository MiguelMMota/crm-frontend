'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Interaction } from '@/lib/types'
import { MessageSquare, Video, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import ProtectedRoute from '@/components/protected-route'

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInteractions()
  }, [])

  const loadInteractions = async () => {
    try {
      const data = await api.getInteractions()
      setInteractions(data.results || data)
    } catch (err) {
      console.error('Failed to load interactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL':
        return <Video className="h-5 w-5" />
      case 'PHONE_CALL':
        return <Phone className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading interactions...</div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Interactions</h1>

        {interactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interactions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Interactions will appear here after your video calls.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {interactions.map((interaction) => (
                <li key={interaction.id}>
                  <Link
                    href={`/interactions/${interaction.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 text-primary-600">
                            {getInteractionIcon(interaction.interaction_type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {interaction.interaction_type.replace('_', ' ')}
                              {interaction.duration_minutes && (
                                <span className="text-gray-500 ml-2">
                                  ({interaction.duration_minutes} min)
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              With:{' '}
                              {interaction.relationships_data
                                .map((r) => r.name)
                                .join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(interaction.interaction_date), 'PPp')}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
