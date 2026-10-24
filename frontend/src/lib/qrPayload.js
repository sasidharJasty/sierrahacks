import { BarcodeDetector, prepareZXingModule } from 'barcode-detector/ponyfill'

const decoderReady = typeof window === 'undefined'
  ? Promise.resolve()
  : Promise.resolve(prepareZXingModule({
      overrides: {
        locateFile: (path, prefix) => path.endsWith('.wasm') ? '/zxing_reader.wasm' : `${prefix}${path}`
      }
    }))

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const LUMA_CHECKIN_PATTERN = /^https:\/\/luma\.com\/check-in\//i

export function parseQrPayload(payload) {
  const raw = typeof payload === 'string' ? payload.trim() : String(payload ?? '').trim()
  if (!raw) return { kind: 'invalid', message: 'The QR code is empty.' }
  if (LUMA_CHECKIN_PATTERN.test(raw)) return { kind: 'luma', value: raw }

  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = null
  }

  const candidate = parsed && typeof parsed === 'object'
    ? parsed.id ?? parsed.user_id ?? parsed.profile_id
    : raw
  const id = typeof candidate === 'string' ? candidate.trim() : ''

  if (UUID_PATTERN.test(id)) return { kind: 'profile', id }
  return { kind: 'invalid', message: 'This is not a Sierra Hacks profile or Luma check-in QR code.' }
}

export function scannerErrorMessage(error) {
  const name = error?.name || ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') return 'Camera access was denied. Allow camera access in your browser settings and try again.'
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'No camera was found on this device.'
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'The camera is already in use by another app or browser tab.'
  if (!window.isSecureContext) return 'Camera scanning requires HTTPS or localhost.'
  return error?.message || 'Unable to start the camera.'
}

export async function decodeQrImage(file, detector = null) {
  if (!file) throw new Error('Choose a photo containing a QR code.')
  await decoderReady
  const activeDetector = detector || new BarcodeDetector({ formats: ['qr_code'] })
  const detected = await activeDetector.detect(file)
  const rawValue = detected?.[0]?.rawValue?.trim()
  if (!rawValue) throw new Error('No QR code was found in that photo. Try a closer, sharper picture.')
  return rawValue
}
