export function fullFrameScanRegion(video) {
  const width = video.videoWidth || video.clientWidth || 640
  const height = video.videoHeight || video.clientHeight || 480
  const scale = Math.min(1, 800 / Math.max(width, height))

  return {
    x: 0,
    y: 0,
    width,
    height,
    downScaledWidth: Math.max(1, Math.round(width * scale)),
    downScaledHeight: Math.max(1, Math.round(height * scale))
  }
}

export async function enableContinuousFocus(video) {
  const track = video.srcObject?.getVideoTracks?.()[0]
  if (!track?.getCapabilities || !track?.applyConstraints) return
  const capabilities = track.getCapabilities()
  if (!capabilities?.focusMode?.includes?.('continuous')) return
  await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] })
}
