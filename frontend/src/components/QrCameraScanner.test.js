import assert from 'node:assert/strict'
import test from 'node:test'
import { fullFrameScanRegion } from '../lib/qrCamera.js'

test('scans the complete camera frame while preserving its aspect ratio', () => {
  assert.deepEqual(fullFrameScanRegion({ videoWidth: 1920, videoHeight: 1080 }), {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    downScaledWidth: 800,
    downScaledHeight: 450
  })
})

test('does not enlarge small camera frames', () => {
  assert.deepEqual(fullFrameScanRegion({ videoWidth: 640, videoHeight: 480 }), {
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    downScaledWidth: 640,
    downScaledHeight: 480
  })
})
