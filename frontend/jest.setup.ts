import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

// Mock MediaStream for components that rely on it during cleanup
if (typeof globalThis.MediaStream === 'undefined') {
  // @ts-ignore
  globalThis.MediaStream = function () {}
}
