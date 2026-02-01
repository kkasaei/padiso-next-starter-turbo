'use client'

interface TypographySectionProps {
  componentId: string | null
}

export function TypographySection({ componentId }: TypographySectionProps) {
  return (
    <div className="flex flex-col gap-y-8">
      {/* Font Family */}
      {(!componentId || componentId === 'font-family') && (
        <section id="font-family" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Font Family</h2>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Primary Font</p>
              <p className="text-4xl font-normal">Inter</p>
              <p className="text-sm text-muted-foreground font-mono">font-family: &apos;Inter&apos;, sans-serif</p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="text-lg">abcdefghijklmnopqrstuvwxyz</p>
              <p className="text-lg">0123456789</p>
            </div>
          </div>
        </section>
      )}

      {/* Font Weights */}
      {(!componentId || componentId === 'font-weights') && (
        <section id="font-weights" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Font Weights</h2>
          <div className="grid gap-4">
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="font-normal text-xl">Regular (400)</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">font-normal</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="font-medium text-xl">Medium (500)</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">font-medium</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="font-semibold text-xl">Semibold (600)</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">font-semibold</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="font-bold text-xl">Bold (700)</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">font-bold</code>
            </div>
          </div>
        </section>
      )}

      {/* Type Scale */}
      {(!componentId || componentId === 'type-scale') && (
        <section id="type-scale" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Type Scale</h2>
          <div className="grid gap-4">
            {[
              { size: 'text-xs', label: '12px' },
              { size: 'text-sm', label: '14px' },
              { size: 'text-base', label: '16px' },
              { size: 'text-lg', label: '18px' },
              { size: 'text-xl', label: '20px' },
              { size: 'text-2xl', label: '24px' },
              { size: 'text-3xl', label: '30px' },
            ].map((item) => (
              <div key={item.size} className="rounded-xl border border-border p-4 space-y-2">
                <p className="text-xs text-muted-foreground">{item.size} ({item.label})</p>
                <p className={item.size}>The quick brown fox jumps over the lazy dog.</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Text Colors */}
      {(!componentId || componentId === 'text-colors') && (
        <section id="text-colors" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Text Colors</h2>
          <div className="grid gap-4">
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="text-foreground">Foreground</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">text-foreground</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="text-muted-foreground">Muted Foreground</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">text-muted-foreground</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="text-gray-500 dark:text-polar-500">Gray 500 / Polar 500</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">text-gray-500 dark:text-polar-500</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="text-primary">Primary</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">text-primary</code>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center justify-between">
              <span className="text-destructive">Destructive</span>
              <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">text-destructive</code>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

