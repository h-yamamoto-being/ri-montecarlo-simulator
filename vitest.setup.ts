import { vi } from 'vitest'

// Chart.js が要求する Canvas API のモック
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  canvas: { height: 0, width: 0 },
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  isPointInPath: vi.fn(() => false),
})

// Chart.js が要求する ResizeObserver のモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
