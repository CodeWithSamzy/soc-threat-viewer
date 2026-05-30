import { PulsesResponse } from '@/types/otx'
import StatCard from '@/app/components/StatCard'
import PulseTable from '@/app/components/PulseTable'

async function getPulses(): Promise<PulsesResponse> {
  const res = await fetch(
    'https://otx.alienvault.com/api/v1/pulses/subscribed?page=1&limit=20',
    {
      headers: {
        'X-OTX-API-KEY': process.env.OTX_API_KEY!,
      },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) throw new Error('Failed to fetch pulses')
  return res.json()
}

export default async function Home() {
  const data = await getPulses()

  const totalIOCs = data.results.reduce(
    (acc, pulse) => acc + (pulse.indicators?.length ?? 0), 0
  )

  const uniqueTags = new Set(data.results.flatMap((p) => p.tags)).size

  const tlpBreakdown = data.results.reduce((acc, pulse) => {
    const tlp = pulse.tlp?.toLowerCase() || 'unknown'
    acc[tlp] = (acc[tlp] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">🛡️</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">
                SOC Threat Feed
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Powered by AlienVault OTX
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-zinc-400">Live Feed</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Pulses"
            value={data.results.length}
            icon="📡"
            description="Active threat pulses"
          />
          <StatCard
            title="Total IOCs"
            value={totalIOCs}
            icon="🔍"
            description="Indicators of compromise"
          />
          <StatCard
            title="Unique Tags"
            value={uniqueTags}
            icon="🏷️"
            description="Threat categories"
          />
          <StatCard
            title="TLP: Red"
            value={tlpBreakdown['red'] ?? 0}
            icon="🔴"
            description="High sensitivity pulses"
          />
        </div>

        {/* Pulse Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Threat Pulses
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Click any row to view full IOC breakdown
            </p>
          </div>
          <PulseTable pulses={data.results} />
        </div>
      </div>
    </main>
  )
}