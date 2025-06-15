import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DoctorDashboard from '../page'

test('renders initial dashboard options', () => {
  render(<DoctorDashboard />)
  expect(screen.getByText(/Choose an Action/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Upload Recorded File/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Record Live Video/i })).toBeInTheDocument()
})

async function renderWithPrediction(prediction: string) {
  const fetchMock = jest
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ prediction }),
    } as Response)
  // @ts-expect-error - jsdom does not provide fetch
  global.fetch = fetchMock

  const { container } = render(<DoctorDashboard />)
  userEvent.click(screen.getByRole('button', { name: /Upload Recorded File/i }))

  await waitFor(() => {
    expect(container.querySelector('input[type="file"]')).not.toBeNull()
  })
  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
  const file = new File(['dummy'], 'video.mp4', { type: 'video/mp4' })
  await userEvent.upload(fileInput, file)

  userEvent.click(screen.getByRole('button', { name: /Analyze PTSD/i }))

  await waitFor(() => expect(fetchMock).toHaveBeenCalled())
  // @ts-expect-error - cleanup mocked fetch
  delete global.fetch
}

test('renders "No PTSD Detected" when prediction is "NO PTSD"', async () => {
  await renderWithPrediction('NO PTSD')
  expect(await screen.findByText(/No PTSD Detected/i)).toBeInTheDocument()
})

test('renders "PTSD Detected" when prediction is "PTSD"', async () => {
  await renderWithPrediction('PTSD')
  expect(await screen.findByText(/PTSD Detected/i)).toBeInTheDocument()
})
