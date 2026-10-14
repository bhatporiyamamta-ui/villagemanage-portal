import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../data')
const dbFile = path.resolve(dataDir, 'db.json')

function setupApiMiddleware(server) {
  server.middlewares.use((req, res, next) => {
    const url = req.url?.split('?')[0]

    // GET /api/data - Fetch latest database from disk
    if (url === '/api/data' && req.method === 'GET') {
      try {
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }
        if (!fs.existsSync(dbFile)) {
          const initial = { villagers: [], households: [], villageMeta: {}, lastUpdated: new Date().toISOString() }
          fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2), 'utf-8')
        }
        const content = fs.readFileSync(dbFile, 'utf-8')
        res.setHeader('Content-Type', 'application/json')
        res.end(content)
      } catch (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message }))
      }
      return
    }

    // POST /api/save - Save updated database to disk in real-time
    if (url === '/api/save' && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true })
          }
          const payload = {
            villagers: Array.isArray(data.villagers) ? data.villagers : [],
            households: Array.isArray(data.households) ? data.households : [],
            villageMeta: data.villageMeta || {},
            lastUpdated: new Date().toISOString()
          }
          fs.writeFileSync(dbFile, JSON.stringify(payload, null, 2), 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, count: payload.villagers.length }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
      return
    }

    next()
  })
}

function jsonDbPlugin() {
  return {
    name: 'json-db-api',
    configureServer(server) {
      setupApiMiddleware(server)
    },
    configurePreviewServer(server) {
      setupApiMiddleware(server)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonDbPlugin()],
})
