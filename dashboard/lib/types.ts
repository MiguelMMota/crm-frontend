/**
 * Shared TypeScript types for the CRM application
 */

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  created_at: string
}

export interface Relationship {
  id: number
  user: number
  name: string
  email?: string
  phone_number?: string
  relationship_type: 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'BUSINESS' | 'OTHER'
  notes_summary: string
  created_at: string
  updated_at: string
  notes_count?: number
  recent_interactions_count?: number
}

export interface Interaction {
  id: number
  user: number
  relationships_data: Relationship[]
  relationship_ids?: number[]
  interaction_type: 'VIDEO_CALL' | 'PHONE_CALL' | 'LIVE_CHAT' | 'TEXT_MESSAGE' | 'IN_PERSON' | 'USER_RECORD' | 'OTHER'
  interaction_date: string
  duration_minutes?: number
  transcription: string
  summary: string
  video_path?: string
  audio_path?: string
  created_at: string
  updated_at: string
  notes_count?: number
}

export interface Note {
  id: number
  user: number
  relationship_data: Relationship
  relationship_id?: number
  interaction?: number
  note_text: string
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
  importance_score: number
  created_at: string
  updated_at: string
}

// WebSocket message types
export interface WSMessage {
  type: string
  [key: string]: any
}

export interface ParticipantIdentified extends WSMessage {
  type: 'participant_identified'
  participant: {
    id: number
    name: string
    relationship_type: string
  }
  notes: Array<{
    id: number
    text: string
    importance: number
    created_at: string
  }>
}

export interface NewParticipant extends WSMessage {
  type: 'new_participant'
  participant: {
    face_embedding: number[]
    timestamp: string
  }
}

export interface NoteGenerated extends WSMessage {
  type: 'note_generated'
  note: {
    id: number
    relationship_id: number
    text: string
    importance: number
  }
}
