import { render, screen } from '@testing-library/react'
import DoctorDashboard from '../page'

test('renders initial dashboard options', () => {
  render(<DoctorDashboard />)
  expect(screen.getByText(/Choose an Action/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Upload Recorded File/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Record Live Video/i })).toBeInTheDocument()
})
