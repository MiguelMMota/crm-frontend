/**
 * Content script injected into video call pages.
 * Detects calls, captures video/audio, and displays overlay with notes.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { MessageTypes } from '../shared/constants'
import { Participant } from '../shared/types'
import ParticipantOverlay from './overlay'

let isCallActive = false
let participants: Participant[] = []
let captureInterval: number | null = null

// Detect when a call starts (this will vary by platform)
function detectCallStart() {
  // For WhatsApp Web
  if (window.location.hostname.includes('whatsapp.com')) {
    const observer = new MutationObserver(() => {
      const callUI = document.querySelector('[data-testid="video-call-interface"]')
      if (callUI && !isCallActive) {
        handleCallStart()
      } else if (!callUI && isCallActive) {
        handleCallEnd()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // For Google Meet
  if (window.location.hostname.includes('meet.google.com')) {
    const observer = new MutationObserver(() => {
      const callUI = document.querySelector('[data-call-ended]')
      const participants = document.querySelectorAll('[data-participant-id]')

      if (participants.length > 0 && !isCallActive) {
        handleCallStart()
      } else if (callUI && isCallActive) {
        handleCallEnd()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
}

// Handle call start
function handleCallStart() {
  console.log('Call started')
  isCallActive = true

  // Notify background script
  chrome.runtime.sendMessage({
    type: MessageTypes.CALL_STARTED,
  })

  // Start capturing video frames
  startCapture()

  // Show permission overlay
  showPermissionOverlay()
}

// Handle call end
function handleCallEnd() {
  console.log('Call ended')
  isCallActive = false

  // Notify background script
  chrome.runtime.sendMessage({
    type: MessageTypes.CALL_ENDED,
  })

  // Stop capturing
  stopCapture()

  // Clear overlays
  participants = []
  updateOverlays()
}

// Show permission request overlay
function showPermissionOverlay() {
  const container = document.createElement('div')
  container.id = 'crm-permission-overlay'
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    max-width: 300px;
  `
  container.innerHTML = `
    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">CRM Extension</h3>
    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
      Allow the extension to monitor this call and identify participants?
    </p>
    <div style="display: flex; gap: 10px;">
      <button id="crm-allow-btn" style="flex: 1; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Allow
      </button>
      <button id="crm-deny-btn" style="flex: 1; padding: 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Deny
      </button>
    </div>
  `
  document.body.appendChild(container)

  document.getElementById('crm-allow-btn')?.addEventListener('click', () => {
    container.remove()
  })

  document.getElementById('crm-deny-btn')?.addEventListener('click', () => {
    container.remove()
    handleCallEnd()
  })
}

// Start capturing video frames
function startCapture() {
  if (captureInterval) return

  captureInterval = window.setInterval(() => {
    captureFrame()
  }, 2000) // Capture every 2 seconds
}

// Stop capturing
function stopCapture() {
  if (captureInterval) {
    clearInterval(captureInterval)
    captureInterval = null
  }
}

// Capture video frame
async function captureFrame() {
  try {
    // Get video elements
    const videos = document.querySelectorAll('video')

    for (const video of videos) {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)

          // Convert to base64
          const imageData = canvas.toDataURL('image/jpeg', 0.8)
          const base64Data = imageData.split(',')[1]

          // Send to background script
          chrome.runtime.sendMessage({
            type: MessageTypes.VIDEO_CHUNK,
            data: base64Data,
            timestamp: Date.now(),
          })
        }
      }
    }
  } catch (error) {
    console.error('Failed to capture frame:', error)
  }
}

// Update participant overlays
function updateOverlays() {
  // Remove existing overlays
  document.querySelectorAll('.crm-participant-overlay').forEach((el) => el.remove())

  // Create new overlays for each participant
  participants.forEach((participant, index) => {
    const container = document.createElement('div')
    container.className = 'crm-participant-overlay'
    container.style.cssText = `
      position: fixed;
      top: ${100 + index * 150}px;
      right: 20px;
      width: 280px;
      z-index: 10000;
    `
    document.body.appendChild(container)

    const root = ReactDOM.createRoot(container)
    root.render(<ParticipantOverlay participant={participant} />)
  })
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  console.log('Content script received:', message)

  switch (message.type) {
    case 'participant_identified':
      const existingIndex = participants.findIndex((p) => p.id === message.participant.id)
      if (existingIndex >= 0) {
        participants[existingIndex] = {
          ...message.participant,
          notes: message.notes,
        }
      } else {
        participants.push({
          ...message.participant,
          notes: message.notes,
        })
      }
      updateOverlays()
      break

    case 'new_participant':
      participants.push({
        name: 'Unknown Participant',
        isNew: true,
      })
      updateOverlays()
      break

    case 'note_generated':
      // Update notes for the relevant participant
      const participantIndex = participants.findIndex(
        (p) => p.id === message.note.relationship_id
      )
      if (participantIndex >= 0) {
        if (!participants[participantIndex].notes) {
          participants[participantIndex].notes = []
        }
        participants[participantIndex].notes!.unshift(message.note)
        updateOverlays()
      }
      break
  }
})

// Initialize
detectCallStart()
console.log('CRM extension content script loaded')
