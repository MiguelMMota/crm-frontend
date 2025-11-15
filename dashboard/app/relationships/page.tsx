'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Relationship } from '@/lib/types'
import { Users, Mail, Phone } from 'lucide-react'

export default function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRelationships()
  }, [])

  const loadRelationships = async () => {
    try {
      setLoading(true)
      const data = await api.getRelationships()
      setRelationships(data.results || data)
    } catch (err: any) {
      setError(err.message || 'Failed to load relationships')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading relationships...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Relationships</h1>
      </div>

      {relationships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No relationships</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start a video call with the extension to automatically create relationship profiles.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {relationships.map((relationship) => (
              <li key={relationship.id}>
                <Link
                  href={`/relationships/${relationship.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-lg">
                              {relationship.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-primary-600">
                            {relationship.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {relationship.relationship_type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {relationship.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {relationship.email}
                          </div>
                        )}
                        {relationship.phone_number && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {relationship.phone_number}
                          </div>
                        )}
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
  )
}
