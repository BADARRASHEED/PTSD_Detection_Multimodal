import '@testing-library/jest-dom'

// Mock MediaStream for components that rely on it during cleanup
if (typeof globalThis.MediaStream === 'undefined') {
  // @ts-ignore
  globalThis.MediaStream = function () {}
}
