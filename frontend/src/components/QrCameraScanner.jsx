import { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'
import { enableContinuousFocus, fullFrameScanRegion } from '../lib/qrCamera'

export default function QrCameraScanner({
  active,
  cameraId = 'environment',
  onScan,
  onError,
  onReady,
  onCamerasChange
}) {
  const videoRef = useRef(null)
  const handledRef = useRef(false)
  const callbacksRef = useRef({ onScan, onError, onReady, onCamerasChange })

  useEffect(() => {
    callbacksRef.current = { onScan, onError, onReady, onCamerasChange }
  }, [onScan, onError, onReady, onCamerasChange])

  useEffect(() => {
    if (!active || !videoRef.current) return undefined

    let mounted = true
    handledRef.current = false

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        const value = result?.data?.trim()
        if (!value || handledRef.current) return
        handledRef.current = true
        void scanner.pause(true)
        callbacksRef.current.onScan?.(value)
      },
      {
        preferredCamera: cameraId || 'environment',
        maxScansPerSecond: 10,
        calculateScanRegion: fullFrameScanRegion,
        highlightScanRegion: false,
        highlightCodeOutline: true,
        returnDetailedScanResult: true
      }
    )

    scanner.setInversionMode('both')
    void scanner.start()
      .then(async () => {
        if (!mounted) return
        await enableContinuousFocus(videoRef.current).catch(() => {})
        callbacksRef.current.onReady?.()
        const cameras = await QrScanner.listCameras().catch(() => [])
        if (mounted) callbacksRef.current.onCamerasChange?.(cameras)
      })
      .catch((error) => {
        if (mounted) callbacksRef.current.onError?.(error)
      })

    return () => {
      mounted = false
      scanner.destroy()
    }
  }, [active, cameraId])

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        aria-label="Live QR code camera preview"
      />
      <div className="pointer-events-none absolute inset-0 border-[40px] border-black/30 sm:border-[70px]" />
      <div className="pointer-events-none absolute inset-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] sm:h-56 sm:w-56" />
      <p className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-black/65 px-3 py-2 text-center text-xs font-medium text-white">
        Hold the QR code steady inside the square
      </p>
    </div>
  )
}
