'use client'

import Link from 'next/link'
import { Users, MessageSquare, FileText } from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome to Your AI-Enriched CRM
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/relationships" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Relationships
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      View all contacts
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/interactions" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Interactions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Call history
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/settings" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Settings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Configure app
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How it works
          </h2>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-3">
                1
              </span>
              <span>Install the browser extension from the extension directory</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-3">
                2
              </span>
              <span>Join a video call (WhatsApp Web, Google Meet, Zoom, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-3">
                3
              </span>
              <span>The extension identifies participants and shows their notes in real-time</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mr-3">
                4
              </span>
              <span>After the call, AI automatically generates notes from the conversation</span>
            </li>
          </ol>
        </div>
      </div>
    </ProtectedRoute>
  )
}
