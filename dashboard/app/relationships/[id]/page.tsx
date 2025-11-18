'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Relationship, Note } from '@/lib/types'
import { Mail, Phone, Calendar, StickyNote } from 'lucide-react'
import { format } from 'date-fns'
import ProtectedRoute from '@/components/protected-route'

export default function RelationshipDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelationshipData()
  }, [id])

  const loadRelationshipData = async () => {
    try {
      setLoading(true)
      const [relationshipData, notesData] = await Promise.all([
        api.getRelationship(Number(id)),
        api.getNotes({ relationship: id }),
      ])
      setRelationship(relationshipData)
      setNotes(notesData.results || notesData)
    } catch (err) {
      console.error('Failed to load relationship:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </ProtectedRoute>
    )
  }

  if (!relationship) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">Relationship not found</div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {relationship.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {relationship.relationship_type.replace('_', ' ')}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {relationship.email && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {relationship.email}
                  </dd>
                </div>
              )}
              {relationship.phone_number && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {relationship.phone_number}
                  </dd>
                </div>
              )}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Added
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {format(new Date(relationship.created_at), 'PPP')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Automatically generated from conversations
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <StickyNote className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No notes yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notes.map((note) => (
                  <li key={note.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{note.note_text}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Importance: {note.importance_score}/10</span>
                          <span className="mx-2">•</span>
                          <span>{format(new Date(note.created_at), 'PPp')}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
