import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { BarcodeDetector, prepareZXingModule } from 'barcode-detector/ponyfill'
import { decodeQrImage, parseQrPayload, scannerErrorMessage } from './qrPayload.js'

const PROFILE_ID = 'd2a58a07-2362-41bf-bf13-8288aa821db5'

test('parses a Sierra Hacks profile QR payload', () => {
  assert.deepEqual(
    parseQrPayload(JSON.stringify({ type: 'sierrahacks-profile', id: PROFILE_ID })),
    { kind: 'profile', id: PROFILE_ID }
  )
})

test('accepts supported profile id aliases and plain UUIDs', () => {
  assert.deepEqual(parseQrPayload(JSON.stringify({ profile_id: PROFILE_ID })), { kind: 'profile', id: PROFILE_ID })
  assert.deepEqual(parseQrPayload(JSON.stringify({ user_id: PROFILE_ID })), { kind: 'profile', id: PROFILE_ID })
  assert.deepEqual(parseQrPayload(PROFILE_ID), { kind: 'profile', id: PROFILE_ID })
})

test('parses an imported Luma check-in QR link', () => {
  const value = 'https://luma.com/check-in/evt-test?pk=abc123'
  assert.deepEqual(parseQrPayload(value), { kind: 'luma', value })
})

test('rejects empty, malformed, and unrelated QR values', () => {
  assert.equal(parseQrPayload('').kind, 'invalid')
  assert.equal(parseQrPayload('{broken-json').kind, 'invalid')
  assert.equal(parseQrPayload('https://example.com/qr').kind, 'invalid')
  assert.equal(parseQrPayload(JSON.stringify({ id: 'not-a-uuid' })).kind, 'invalid')
})

test('returns the decoded QR value from a captured photo', async () => {
  const file = new Blob(['fake-image'], { type: 'image/png' })
  const detector = { detect: async (received) => {
    assert.equal(received, file)
    return [{ rawValue: `  ${PROFILE_ID}  ` }]
  } }
  assert.equal(await decodeQrImage(file, detector), PROFILE_ID)
})

test('reports when a captured photo has no QR code', async () => {
  const file = new Blob(['fake-image'], { type: 'image/png' })
  await assert.rejects(
    decodeQrImage(file, { detect: async () => [] }),
    /No QR code was found/
  )
})

test('decodes a real QR PNG with the bundled ZXing engine', async () => {
  globalThis.DOMRectReadOnly = class DOMRectReadOnly {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      Object.assign(this, { x, y, width, height, top: y, right: x + width, bottom: y + height, left: x })
    }
    static fromRect(rect = {}) { return new this(rect.x, rect.y, rect.width, rect.height) }
  }
  const wasm = new Uint8Array(readFileSync(new URL('../../node_modules/zxing-wasm/dist/reader/zxing_reader.wasm', import.meta.url)))
  const png = readFileSync(new URL('../../node_modules/barcode-detector/dist/es/barcode-detector.png', import.meta.url))
  prepareZXingModule({ overrides: { wasmBinary: wasm } })
  const detector = new BarcodeDetector({ formats: ['qr_code'] })
  assert.equal(await decodeQrImage(new Blob([png], { type: 'image/png' }), detector), 'barcode-detector')
  delete globalThis.DOMRectReadOnly
})

test('requires a photo before decoding', async () => {
  await assert.rejects(decodeQrImage(null, { detect: async () => [] }), /Choose a photo/)
})

test('maps common camera failures to useful instructions', () => {
  globalThis.window = { isSecureContext: true }
  assert.match(scannerErrorMessage({ name: 'NotAllowedError' }), /denied/i)
  assert.match(scannerErrorMessage({ name: 'NotFoundError' }), /No camera/i)
  assert.match(scannerErrorMessage({ name: 'NotReadableError' }), /already in use/i)
  globalThis.window = { isSecureContext: false }
  assert.match(scannerErrorMessage(new Error('failed')), /HTTPS or localhost/i)
  delete globalThis.window
})
