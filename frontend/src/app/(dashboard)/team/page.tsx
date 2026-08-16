import type { Metadata } from 'next'
import { requireAuth } from '@/actions/auth.actions'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Team' }

const TEAM_NAME = 'Team 1'
const PROJECT_NAME = 'Capstone Project 1'
const ABOUT =
  'A four-person capstone team turning the client brief into a working product across three sprints.'

type Member = {
  name: string
  role: string
  blurb: string
  photo?: string
}

const members: Member[] = [
  {
    name: 'Kaiyang',
    role: 'Project Manager',
    blurb: 'Coordinates the team, owns the board, and signs off on delivery.',
  },
  {
    name: 'Sabah',
    role: 'Business Analyst',
    blurb: 'Turns client conversations into clear requirements for the team.',
    photo: '/team/sabah.jpg',
  },
  {
    name: 'Zeeshan',
    role: 'UX Designer',
    blurb: 'Designs the interface and the flow from login into the team page.',
    photo: '/team/zeeshan.jpg',
  },
  {
    name: 'Karmanya',
    role: 'Developer',
    blurb: 'Builds the features and ships them through the git workflow.',
    photo: '/team/karmanya.jpg',
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

      <section className="space-y-4 rounded-lg border border-indigo-100 bg-indigo-50/40 p-6 dark:border-indigo-950 dark:bg-indigo-950/20">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Team Name</h2>
          <p className="text-lg">{TEAM_NAME}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Project Name</h2>
          <p className="text-lg">{PROJECT_NAME}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">About the team</h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{ABOUT}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Our Team</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {members.map((m) => (
            <div key={m.name} className="group flex gap-4 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-300 dark:border-zinc-800">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700 transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-950 dark:text-indigo-300">
                  {initials(m.name)}
                </div>
              )}
              <div className="space-y-1">
                <h3 className="font-medium">{m.name}</h3>
                <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
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
