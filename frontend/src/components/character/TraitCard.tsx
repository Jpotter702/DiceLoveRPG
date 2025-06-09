interface TraitCardProps {
  name: string
  value: number
  description: string
  isSecondary?: boolean
  isTertiary?: boolean
}

export function TraitCard({ 
  name, 
  value, 
  description, 
  isSecondary = false,
  isTertiary = false 
}: TraitCardProps) {
  // Calculate the bonus value (trait_score // 10)
  const bonus = Math.floor(value / 10)
  
  // Determine background color based on trait type
  const bgColorClass = isSecondary
    ? 'bg-secondary/30'
    : isTertiary
      ? 'bg-primary/20'
      : 'bg-background'

  return (
    <div className={`
      rounded-lg p-4 border border-border
      ${bgColorClass} transition-colors duration-200
      hover:border-primary/50
    `}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{value}</span>
          <span className="text-sm text-primary">{bonus > 0 ? `+${bonus}` : bonus}</span>
        </div>
      </div>
      <p className="text-sm text-secondary-foreground/80">{description}</p>
    </div>
  )
} 