import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendIconProps {
  trend: 'up' | 'down' | 'stable'
}

export function TrendIcon({ trend }: TrendIconProps) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}
