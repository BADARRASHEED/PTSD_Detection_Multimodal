import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DoctorDashboard from '../src/app/doctor-dashboard/page'

class MockMediaRecorder {
  static lastBlob: Blob | null = null
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  start = jest.fn()
  stop() {
    const blob = new Blob([`blob-${Date.now()}`], { type: 'video/webm' })
    MockMediaRecorder.lastBlob = blob
    this.ondataavailable?.({ data: blob })
    this.onstop?.()
  }
  constructor(_stream: MediaStream) {}
}

describe('video recording', () => {
  beforeEach(() => {
    class DummyStream {
      getTracks() {
        return [{ stop: jest.fn() }]
      }
    }
    ;(navigator.mediaDevices as any) = {
      getUserMedia: jest.fn().mockResolvedValue(new DummyStream() as any),
    }
    // @ts-expect-error - jsdom lacks MediaRecorder
    global.MediaRecorder = MockMediaRecorder
  })

  test('start/stop recording resets state and creates new blobs', async () => {
    render(<DoctorDashboard />)

    userEvent.click(screen.getByRole('button', { name: /Record Live Video/i }))
    const startBtn = await screen.findByRole('button', { name: /Start Recording/i })

    await act(async () => {
      await userEvent.click(startBtn)
    })
    const stopBtn = await screen.findByRole('button', { name: /Stop Recording/i })
    await act(async () => {
      await userEvent.click(stopBtn)
    })
    await screen.findByText(/Recording ready for submission/i)
    const firstBlob = MockMediaRecorder.lastBlob
    expect(firstBlob).toBeInstanceOf(Blob)

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Start Recording/i }))
    })
    expect(screen.queryByText(/Recording ready for submission/i)).toBeNull()
    const stopBtn2 = await screen.findByRole('button', { name: /Stop Recording/i })
    await act(async () => {
      await userEvent.click(stopBtn2)
    })
    await screen.findByText(/Recording ready for submission/i)
    const secondBlob = MockMediaRecorder.lastBlob
    expect(secondBlob).toBeInstanceOf(Blob)
    expect(secondBlob).not.toBe(firstBlob)
  })
})
