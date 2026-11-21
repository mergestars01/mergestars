// MERGE mobile PWA static security and packaging acceptance checks.
// Node standard library only. Does not contact production or require credentials.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(root, file))

const manifest = JSON.parse(read('frontend/public/manifest.webmanifest'))
assert.equal(manifest.id, '/')
assert.equal(manifest.start_url, '/')
assert.equal(manifest.scope, '/')
assert.equal(manifest.display, 'standalone')
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0)
for (const icon of manifest.icons) {
  assert.ok(icon.src.startsWith('/') && !icon.src.startsWith('//'))
  assert.ok(exists('frontend/public' + icon.src), `Missing app icon: ${icon.src}`)
  assert.equal(icon.type, 'image/png')
}

const html = read('frontend/index.html')
assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/)
assert.match(html, /name="theme-color"/)
assert.match(html, /name="viewport"[^>]*viewport-fit=cover/)
assert.match(html, /rel="apple-touch-icon"/)
assert.ok(exists('frontend/public/apple-touch-icon.png'))

const entry = read('frontend/src/main.tsx')
assert.match(entry, /import\.meta\.env\.PROD/)
assert.match(entry, /navigator\.serviceWorker\.register\('\/sw\.js'/)

const sw = read('frontend/public/sw.js')
assert.match(sw, /const OFFLINE_URL = '\/offline\.html'/)
assert.match(sw, /request\.mode !== 'navigate'/)
assert.match(sw, /request\.method !== 'GET'/)
assert.match(sw, /fetch\(request\)\.catch/)
assert.doesNotMatch(sw, /cache\.put\s*\(/)
assert.doesNotMatch(sw, /caches\.open\([\s\S]*\.addAll\s*\(/)
assert.ok(exists('frontend/public/offline.html'))
const offline = read('frontend/public/offline.html')
assert.match(offline, /Internet connection required/)
assert.match(offline, /merge-master-logo-canonical\.png/)
assert.doesNotMatch(offline, /localStorage|indexedDB|Authorization|Bearer/)

console.log('PASS: MERGE PWA metadata, official assets, and offline-only privacy guard')
