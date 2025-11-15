/**
 * Shared types for the extension
 */

export interface Participant {
  id?: number
  name: string
  relationship_type?: string
  notes?: Note[]
  isNew?: boolean
}

export interface Note {
  id: number
  text: string
  importance: number
  created_at: string
}

export interface WSMessage {
  type: string
  [key: string]: any
}

export interface CallState {
  isActive: boolean
  participants: Participant[]
  startTime?: number
}
