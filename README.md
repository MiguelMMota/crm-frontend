# CRM Frontend

AI-enriched CRM frontend consisting of a Next.js dashboard and browser extension.

## Structure

- `dashboard/` - Next.js 14 web application for managing relationships and interactions
- `extension/` - Browser extension (Manifest V3) for real-time call monitoring

## Dashboard

### Setup

```bash
cd dashboard
npm install
cp .env.example .env
# Edit .env to configure backend URL
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

### Features

- View all relationships and their notes
- Browse interaction history (calls, meetings)
- Search and filter relationships
- Real-time updates via WebSocket

### Pages

- `/` - Dashboard home
- `/relationships` - All contacts
- `/relationships/[id]` - Individual contact details with notes
- `/interactions` - Call history
- `/settings` - Configuration

## Browser Extension

### Setup

```bash
cd extension
npm install
npm run build
```

### Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` directory

### How it Works

1. **Background Service Worker** - Maintains WebSocket connection to backend
2. **Content Scripts** - Injected into video call pages (WhatsApp Web, Google Meet, Zoom)
3. **Call Detection** - Automatically detects when a call starts
4. **Video Capture** - Captures frames every 2 seconds for face recognition
5. **Participant Identification** - Matches faces against stored signatures
6. **Note Display** - Shows overlay with participant info and recent notes
7. **Real-time Updates** - Receives new notes as they're generated

### Supported Platforms

- WhatsApp Web (web.whatsapp.com)
- Google Meet (meet.google.com)
- Zoom Web (zoom.us)

### Usage

1. Login through the extension popup
2. Join a video call on a supported platform
3. Grant permission when prompted
4. Participant overlays will appear automatically
5. After the call, notes are auto-generated and visible in the dashboard

## Development

### Dashboard Development

```bash
cd dashboard
npm run dev
```

### Extension Development

```bash
cd extension
npm run build:watch
```

Then reload the extension in Chrome after each build.

## API Integration

Both dashboard and extension connect to the Django backend:

- **REST API**: `http://localhost:8000/api/`
- **WebSocket**: `ws://localhost:8000/ws/call/{user_id}/`

Configure URLs in:
- Dashboard: `.env` file
- Extension: `src/shared/constants.ts`

## Tech Stack

### Dashboard
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios (HTTP client)
- date-fns (date formatting)

### Extension
- TypeScript
- React 18
- Webpack 5
- Chrome Extensions API (Manifest V3)
- WebSocket
