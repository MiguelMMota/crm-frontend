/**
 * Background service worker for the extension.
 * Handles WebSocket connection to backend and message routing.
 */

import { MessageTypes, WS_URL, StorageKeys } from '../shared/constants'

let wsConnection: WebSocket | null = null
let userId: string | null = null

// Initialize on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CRM Extension installed')
  loadUserSettings()
})

// Load user settings from storage
async function loadUserSettings() {
  const result = await chrome.storage.local.get([StorageKeys.USER_ID, StorageKeys.AUTH_TOKEN])
  userId = result[StorageKeys.USER_ID] || null
}

// Connect to WebSocket server
function connectWebSocket() {
  if (!userId) {
    console.error('No user ID available')
    return
  }

  chrome.storage.local.get([StorageKeys.AUTH_TOKEN], (result) => {
    const token = result[StorageKeys.AUTH_TOKEN]

    if (!token) {
      console.error('No auth token available')
      return
    }

    const wsUrl = `${WS_URL}/ws/call/${userId}/?token=${token}`
    wsConnection = new WebSocket(wsUrl)

    wsConnection.onopen = () => {
      console.log('WebSocket connected')
    }

    wsConnection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleWebSocketMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    wsConnection.onclose = () => {
      console.log('WebSocket disconnected')
      wsConnection = null
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000)
    }
  })
}

// Handle WebSocket messages from backend
function handleWebSocketMessage(message: any) {
  console.log('WebSocket message:', message)

  // Forward messages to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, message)
    }
  })
}

// Send message to WebSocket server
function sendWebSocketMessage(message: any) {
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify(message))
  } else {
    console.error('WebSocket not connected')
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message)

  switch (message.type) {
    case MessageTypes.CALL_STARTED:
      if (!wsConnection) {
        connectWebSocket()
      }
      sendWebSocketMessage({
        type: 'call_start',
        timestamp: Date.now(),
      })
      sendResponse({ success: true })
      break

    case MessageTypes.CALL_ENDED:
      sendWebSocketMessage({
        type: 'call_end',
        timestamp: Date.now(),
      })
      sendResponse({ success: true })
      break

    case MessageTypes.VIDEO_CHUNK:
      sendWebSocketMessage({
        type: 'video_chunk',
        video_data: message.data,
        timestamp: message.timestamp,
      })
      sendResponse({ success: true })
      break

    case MessageTypes.AUDIO_CHUNK:
      sendWebSocketMessage({
        type: 'audio_chunk',
        audio_data: message.data,
        timestamp: message.timestamp,
      })
      sendResponse({ success: true })
      break

    default:
      console.warn('Unknown message type:', message.type)
      sendResponse({ success: false, error: 'Unknown message type' })
  }

  return true // Keep the message channel open for async response
})

// Initialize user settings on startup
loadUserSettings()
