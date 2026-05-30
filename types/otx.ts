export interface IOC {
  indicator: string
  type: string
  description: string | null
  created: string
  title?: string
}

export interface Pulse {
  id: string
  name: string
  description: string
  created: string
  modified: string
  tags: string[]
  tlp: string
  indicators: IOC[]
  references: string[]
  author_name: string
  targeted_countries: string[]
}

export interface PulsesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pulse[]
}