/**
 * Shared constants for the extension
 */

export const API_URL = 'http://localhost:8000'
export const WS_URL = 'ws://localhost:8000'

// Message types for communication between extension components
export const MessageTypes = {
  CALL_STARTED: 'CALL_STARTED',
  CALL_ENDED: 'CALL_ENDED',
  VIDEO_CHUNK: 'VIDEO_CHUNK',
  AUDIO_CHUNK: 'AUDIO_CHUNK',
  PARTICIPANT_IDENTIFIED: 'PARTICIPANT_IDENTIFIED',
  NEW_PARTICIPANT: 'NEW_PARTICIPANT',
  NOTE_GENERATED: 'NOTE_GENERATED',
  UPDATE_OVERLAY: 'UPDATE_OVERLAY',
}

// Storage keys
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  SETTINGS: 'settings',
}
