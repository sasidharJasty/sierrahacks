import assert from 'node:assert/strict'
import test from 'node:test'
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
  const scanner = { scanImage: async (received, options) => {
    assert.equal(received, file)
    assert.equal(options.returnDetailedScanResult, true)
    return { data: `  ${PROFILE_ID}  ` }
  } }
  assert.equal(await decodeQrImage(file, scanner), PROFILE_ID)
})

test('reports when a captured photo has no QR code', async () => {
  const file = new Blob(['fake-image'], { type: 'image/png' })
  await assert.rejects(
    decodeQrImage(file, { scanImage: async () => { throw new Error('No QR code found') } }),
    /No QR code was found/
  )
})

test('requires a photo before decoding', async () => {
  await assert.rejects(decodeQrImage(null, { scanImage: async () => '' }), /Choose a photo/)
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
