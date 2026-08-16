import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TeamPage from '@/app/(dashboard)/team/page'

vi.mock('@/actions/auth.actions', () => ({
  requireAuth: vi.fn(),
}))

vi.mock('@/components/layout/PageHeader', () => ({
  PageHeader: ({ title, description }: { title: string; description?: string }) => (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  ),
}))

// group all automated tests relating to the team page
describe('Team Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

// test 1: check that the main Team Page heading and description are displayed
  it('renders the team page heading', async () => {
    render(await TeamPage())

    expect(screen.getByText('Meet the Team!')).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
  })

// test 2: check that the required team name and project name are displayed
  it('renders the team name and project name', async () => {
    render(await TeamPage())

    expect(screen.getByText('Team Name')).toBeInTheDocument()
    expect(screen.getByText('Team 44')).toBeInTheDocument()

    expect(screen.getByText('Project Name')).toBeInTheDocument()
    expect(screen.getByText('TidyLens')).toBeInTheDocument()
  })

// test 3: check that the About the Team section and its blurb are displayed
  it('renders the about-the-team section', async () => {
    render(await TeamPage())

    expect(screen.getByText('About the team')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Extend a mixed reality demonstrator for the Meta Quest 3 which assists the wearer with searching, sorting or tidying-related tasks via cloud-based computer vision. For example, while the user is sorting equipment wearing the headset in passthrough mode, the system identifies and categorises items it sees, recalling the location for later retrieval. The system should maintain an inventory of known items with rough locations and respond to user queries about the location of objects by name.'
      )
    ).toBeInTheDocument()
  })

// test 4: check that every team member is represented on the page
  it('renders all four team members', async () => {
    render(await TeamPage())

    expect(screen.getByText('Kaiyang')).toBeInTheDocument()
    expect(screen.getByText('Sabah')).toBeInTheDocument()
    expect(screen.getByText('Zeeshan')).toBeInTheDocument()
    expect(screen.getByText('Karmanya')).toBeInTheDocument()
  })
// test 5: check that the correct role is displayed for each team member.
  it('renders each team member role', async () => {
    render(await TeamPage())

    expect(screen.getByText('Project Manager')).toBeInTheDocument()
    expect(screen.getByText('Business Analyst')).toBeInTheDocument()
    expect(screen.getByText('UX Designer')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })
// test 6: check that each team member has a non-empty personal blurb
it('renders a blurb for each team member', async () => {
  render(await TeamPage())

  const members = ['Kaiyang', 'Sabah', 'Zeeshan', 'Karmanya']

  members.forEach((name) => {
    const memberName = screen.getByText(name)

    // find the member card containing this member's details
    const memberCard = memberName.closest('.group')

    expect(memberCard).toBeInTheDocument()

    // find the blurb paragraph within the member's card
    const blurb = memberCard?.querySelector('p')

    expect(blurb).toBeInTheDocument()
    expect(blurb?.textContent?.trim()).not.toBe('')
  })
})

// test 7: check that members with supplied photo paths display the correct images
  it('renders member photos where photo paths exist', async () => {
    render(await TeamPage())

    expect(screen.getByAltText('Sabah')).toHaveAttribute(
      'src',
      '/team/sabah.jpg'
    )

    expect(screen.getByAltText('Zeeshan')).toHaveAttribute(
      'src',
      '/team/zeeshan.jpg'
    )

    expect(screen.getByAltText('Karmanya')).toHaveAttribute(
      'src',
      '/team/karmanya.jpg'
    )
  })

// test 8: check the missing-photo edge case.
  it('renders initials as a placeholder when a member has no photo', async () => {
    render(await TeamPage())

    expect(screen.getByText('K')).toBeInTheDocument()
    expect(screen.queryByAltText('Kaiyang')).not.toBeInTheDocument()
  })

// test 9: check that the section containing the team members is displayed
  it('renders the Our Team section', async () => {
    render(await TeamPage())

    expect(screen.getByText('Our Team')).toBeInTheDocument()
  })
})