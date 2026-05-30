import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  description?: string
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-400 text-sm font-medium">{title}</span>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-zinc-500 text-xs mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}