import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pulse } from '@/types/otx'
import Link from 'next/link'

async function getPulse(id: string): Promise<Pulse> {
  const res = await fetch(
    `https://otx.alienvault.com/api/v1/pulses/${id}`,
    {
      headers: {
        'X-OTX-API-KEY': process.env.OTX_API_KEY!,
      },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) throw new Error('Failed to fetch pulse')
  return res.json()
}

const tlpColors: Record<string, string> = {
  white: 'bg-zinc-600 text-white',
  green: 'bg-green-700 text-white',
  amber: 'bg-yellow-600 text-white',
  red: 'bg-red-700 text-white',
}

const iocTypeColors: Record<string, string> = {
  'IPv4': 'text-blue-400',
  'IPv6': 'text-blue-300',
  'domain': 'text-purple-400',
  'hostname': 'text-purple-300',
  'URL': 'text-yellow-400',
  'FileHash-MD5': 'text-green-400',
  'FileHash-SHA1': 'text-green-400',
  'FileHash-SHA256': 'text-green-400',
  'email': 'text-orange-400',
}

export default async function PulseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pulse = await getPulse(id)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors text-sm shrink-0"
          >
            ← Back
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-sm text-zinc-300 truncate">{pulse.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Pulse Header Card */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Title & TLP */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {pulse.name}
                </h1>
                <p className="text-zinc-400 text-sm">
                  by {pulse.author_name} ·{' '}
                  {new Date(pulse.created).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={`${
                  tlpColors[pulse.tlp?.toLowerCase()] || 'bg-zinc-700 text-white'
                } uppercase text-xs self-start shrink-0`}
              >
                TLP: {pulse.tlp || 'N/A'}
              </Badge>
            </div>

            {/* Description */}
            {pulse.description && (
              <p className="text-zinc-300 text-sm leading-relaxed">
                {pulse.description}
              </p>
            )}

            {/* Tags */}
            {pulse.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pulse.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <p className="text-zinc-500 text-xs">Total IOCs</p>
                <p className="text-green-400 font-mono font-bold text-xl">
                  {pulse.indicators?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Countries Targeted</p>
                <p className="text-white font-bold text-xl">
                  {pulse.targeted_countries?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">References</p>
                <p className="text-white font-bold text-xl">
                  {pulse.references?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Last Modified</p>
                <p className="text-white text-sm font-medium">
                  {new Date(pulse.modified).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IOC Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-white text-base">
              Indicators of Compromise
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">

            {/* Mobile IOC Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
              {pulse.indicators?.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-10 col-span-full">
                  No indicators found
                </p>
              ) : (
                pulse.indicators?.map((ioc, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 space-y-2"
                  >
                    <p className="font-mono text-xs text-white break-all">
                      {ioc.indicator}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium ${
                          iocTypeColors[ioc.type] || 'text-zinc-400'
                        }`}
                      >
                        {ioc.type}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {new Date(ioc.created).toLocaleDateString()}
                      </span>
                    </div>
                    {ioc.description && (
                      <p className="text-zinc-400 text-xs">{ioc.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Desktop IOC Table */}
            <div className="hidden lg:block rounded-lg border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Indicator</TableHead>
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-400">Description</TableHead>
                    <TableHead className="text-zinc-400">Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pulse.indicators?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-zinc-500 py-10"
                      >
                        No indicators found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pulse.indicators?.map((ioc, index) => (
                      <TableRow
                        key={index}
                        className="border-zinc-800 hover:bg-zinc-800/50"
                      >
                        <TableCell className="font-mono text-sm text-white max-w-[300px] truncate">
                          {ioc.indicator}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-medium ${
                              iocTypeColors[ioc.type] || 'text-zinc-400'
                            }`}
                          >
                            {ioc.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-zinc-400 text-sm">
                          {ioc.description || '—'}
                        </TableCell>
                        <TableCell className="text-zinc-500 text-sm">
                          {new Date(ioc.created).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        {pulse.references?.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-white text-base">References</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-2">
                {pulse.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-2 break-all"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}