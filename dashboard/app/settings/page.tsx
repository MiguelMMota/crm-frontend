'use client'

export default function SettingsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Extension Configuration
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Configure the browser extension to enable call monitoring and automatic note generation.
            </p>
          </div>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    Backend API URL
                  </div>
                  <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Privacy & Data
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              All video and audio processing happens locally or through your configured AI services.
              Face and voice signatures are stored securely in your database.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
