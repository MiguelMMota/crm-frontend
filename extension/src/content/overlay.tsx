/**
 * Participant overlay component
 * Displays relationship information and notes during a call
 */

import React from 'react'
import { Participant } from '../shared/types'

interface Props {
  participant: Participant
}

const ParticipantOverlay: React.FC<Props> = ({ participant }) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '12px',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: participant.isNew ? '#ef4444' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginRight: '12px',
            }}
          >
            {participant.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {participant.name}
            </div>
            {participant.relationship_type && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {participant.relationship_type.replace('_', ' ')}
              </div>
            )}
            {participant.isNew && (
              <div style={{ fontSize: '12px', color: '#ef4444' }}>
                New Contact
              </div>
            )}
          </div>
        </div>
      </div>

      {participant.notes && participant.notes.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
            Recent Notes:
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {participant.notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                style={{
                  fontSize: '12px',
                  padding: '8px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  marginBottom: '6px',
                }}
              >
                <div style={{ marginBottom: '4px' }}>{note.text}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                  Importance: {note.importance}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!participant.notes || participant.notes.length === 0) && !participant.isNew && (
        <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
          No notes yet
        </div>
      )}
    </div>
  )
}

export default ParticipantOverlay
