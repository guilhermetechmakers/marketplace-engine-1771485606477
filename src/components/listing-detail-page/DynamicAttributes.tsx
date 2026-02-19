import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AttributeGroup } from '@/types/listing-detail'

export interface DynamicAttributesProps {
  attributeGroups: AttributeGroup[]
  className?: string
}

function formatValue(value: string | number | boolean): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export function DynamicAttributes({ attributeGroups, className }: DynamicAttributesProps) {
  if (!attributeGroups?.length) {
    return (
      <Card className={cn('border-border bg-card', className)}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">No attributes defined for this listing.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {attributeGroups.map((group, i) => (
        <Card
          key={group.label + i}
          className="animate-fade-in border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:border-accent/30"
        >
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <dl className="grid gap-3 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatValue(field.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
