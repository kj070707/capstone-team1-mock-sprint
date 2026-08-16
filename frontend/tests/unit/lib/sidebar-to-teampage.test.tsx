import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/layout/Sidebar'

describe('Sidebar Team Navigation', () => {
  // check that the Team option exists and links to the Team page
  it('links to the Team page from the sidebar', () => {
    render(<Sidebar />)

    const teamLink = screen.getByRole('link', { name: /team/i })

    expect(teamLink).toBeInTheDocument()
    expect(teamLink).toHaveAttribute('href', '/team')
  })
})