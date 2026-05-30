'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pulse } from '@/types/otx'

interface PulseTableProps {
  pulses: Pulse[]
}

const tlpColors: Record<string, string> = {
  white: 'bg-zinc-600 text-white',
  green: 'bg-green-700 text-white',
  amber: 'bg-yellow-600 text-white',
  red: 'bg-red-700 text-white',
}

export default function PulseTable({ pulses }: PulseTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = pulses.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
    p.author_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search pulses, tags, authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 max-w-md"
      />

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Pulse Name</TableHead>
              <TableHead className="text-zinc-400">TLP</TableHead>
              <TableHead className="text-zinc-400">Tags</TableHead>
              <TableHead className="text-zinc-400">IOCs</TableHead>
              <TableHead className="text-zinc-400">Author</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500 py-10">
                  No pulses found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((pulse) => (
                <TableRow
                  key={pulse.id}
                  className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/pulses/${pulse.id}`)}
                >
                  <TableCell className="text-white font-medium max-w-[250px] truncate">
                    {pulse.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${tlpColors[pulse.tlp?.toLowerCase()] || 'bg-zinc-700 text-white'} uppercase text-xs`}>
                      {pulse.tlp || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {pulse.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-zinc-700 text-zinc-300">
                          {tag}
                        </Badge>
                      ))}
                      {pulse.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
                          +{pulse.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-400 font-mono">
                    {pulse.indicators?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {pulse.author_name}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {new Date(pulse.created).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}