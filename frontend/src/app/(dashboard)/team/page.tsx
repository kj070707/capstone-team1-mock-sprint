import type { Metadata } from 'next'
import { requireAuth } from '@/actions/auth.actions'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Team' }

const TEAM_NAME = 'TeamX1'
const PROJECT_NAME = 'Capstone Project 1'
const ABOUT =
  'A four-person capstone team turning the client brief into a working product across three sprints.'

const members = [
  {
    name: 'Kaiyang',
    role: 'Project Manager',
    blurb: 'Coordinates the team, owns the board, and signs off on delivery.',
  },
  {
    name: 'Sabah',
    role: 'Business Analyst',
    blurb: 'Turns client conversations into clear requirements for the team.',
  },
  {
    name: 'Zeeshan',
    role: 'UX Designer',
    blurb: 'Designs the interface and the flow from login into the team page.',
  },
  {
    name: 'Karmanya',
    role: 'Developer',
    blurb: 'Builds the features and ships them through the git workflow.',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default async function TeamPage() {
  await requireAuth()
  return (
    <div className="space-y-8">
      <PageHeader title="Meet the Team!" description="About us" />

      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Team Name</h2>
          <p className="text-lg">{TEAM_NAME}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Project Name</h2>
          <p className="text-lg">{PROJECT_NAME}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">About the team</h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{ABOUT}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Our Team</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {members.map((m) => (
            <div key={m.name} className="flex gap-4 rounded-lg border p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-lg font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {initials(m.name)}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{m.name}</h3>
                <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {m.role}
                </span>
                <p className="text-sm text-zinc-500">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
