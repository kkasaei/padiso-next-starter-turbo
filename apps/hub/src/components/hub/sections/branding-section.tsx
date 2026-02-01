'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Logo } from '@workspace/ui/components/logo'
import { APP_NAME } from '@workspace/common/constants'

interface BrandingSectionProps {
  componentId: string | null
}

export function BrandingSection({ componentId }: BrandingSectionProps) {
  return (
    <div className="space-y-12">
      <div id="logo" className="scroll-mt-8">
        <LogoSection />
      </div>
    </div>
  )
}

// ============================================================
// Logo Section
// ============================================================

function LogoSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const logoImportCode = `import { Logo } from '@/components/ui/logo'`
  
  const logoUsageCode = `// Full logo (symbol + wordmark)
<Logo />

// Symbol only
<Logo hideWordmark />

// Wordmark only
<Logo hideSymbol />

// With custom className
<Logo className="scale-125" />`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold">Logo</h2>
          <Badge variant="outline" className="text-xs">
            Brand Identity
          </Badge>
        </div>
        <p className="text-muted-foreground">
          The {APP_NAME} logo component with customizable symbol and wordmark display options.
        </p>
      </div>

      {/* Logo Variants */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Logo Variants</h3>
        
        {/* Light Background */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-polar-700 dark:bg-polar-900">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Full Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-50 dark:bg-polar-800">
                <Logo />
              </div>
              <div className="text-center">
                <p className="font-medium">Full Logo</p>
                <p className="text-sm text-muted-foreground">Symbol + Wordmark</p>
              </div>
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {'<Logo />'}
              </code>
            </div>

            {/* Symbol Only */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-50 dark:bg-polar-800">
                <Logo hideWordmark />
              </div>
              <div className="text-center">
                <p className="font-medium">Symbol Only</p>
                <p className="text-sm text-muted-foreground">Icon mark</p>
              </div>
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {'<Logo hideWordmark />'}
              </code>
            </div>

            {/* Wordmark Only */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-50 dark:bg-polar-800">
                <Logo hideSymbol />
              </div>
              <div className="text-center">
                <p className="font-medium">Wordmark Only</p>
                <p className="text-sm text-muted-foreground">Text only</p>
              </div>
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {'<Logo hideSymbol />'}
              </code>
            </div>
          </div>
        </div>

        {/* Logo on Dark Background */}
        <h3 className="text-lg font-medium">On Dark Background</h3>
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Full Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-900">
                <div className="text-white">
                  <Logo />
                </div>
              </div>
              <p className="text-sm text-gray-400">Full Logo</p>
            </div>

            {/* Symbol Only */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-900">
                <div className="text-white">
                  <Logo hideWordmark />
                </div>
              </div>
              <p className="text-sm text-gray-400">Symbol Only</p>
            </div>

            {/* Wordmark Only */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-900">
                <div className="text-white">
                  <Logo hideSymbol />
                </div>
              </div>
              <p className="text-sm text-gray-400">Wordmark Only</p>
            </div>
          </div>
        </div>

        {/* Logo Sizes */}
        <h3 className="text-lg font-medium">Size Variations</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-polar-700 dark:bg-polar-900">
          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="scale-75">
                <Logo />
              </div>
              <span className="text-xs text-muted-foreground">scale-75</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo />
              <span className="text-xs text-muted-foreground">default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="scale-125">
                <Logo />
              </div>
              <span className="text-xs text-muted-foreground">scale-125</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="scale-150">
                <Logo />
              </div>
              <span className="text-xs text-muted-foreground">scale-150</span>
            </div>
          </div>
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Props</h3>
        <div className="rounded-xl border border-gray-200 dark:border-polar-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Prop</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Default</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">hideSymbol</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">false</td>
                <td className="px-4 py-3 text-muted-foreground">Hide the logo symbol/icon</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">hideWordmark</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">false</td>
                <td className="px-4 py-3 text-muted-foreground">Hide the text wordmark</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">-</td>
                <td className="px-4 py-3 text-muted-foreground">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage</h3>
        
        {/* Import */}
        <div className="relative">
          <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 bg-muted/50 px-4 py-2 dark:border-polar-700">
            <span className="text-sm font-medium">Import</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(logoImportCode, 'import')}
            >
              {copiedCode === 'import' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <pre className="rounded-b-lg border border-gray-200 bg-gray-950 p-4 dark:border-polar-700">
            <code className="text-sm text-gray-300">{logoImportCode}</code>
          </pre>
        </div>

        {/* Usage */}
        <div className="relative">
          <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 bg-muted/50 px-4 py-2 dark:border-polar-700">
            <span className="text-sm font-medium">Examples</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(logoUsageCode, 'usage')}
            >
              {copiedCode === 'usage' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <pre className="rounded-b-lg border border-gray-200 bg-gray-950 p-4 dark:border-polar-700">
            <code className="text-sm text-gray-300">{logoUsageCode}</code>
          </pre>
        </div>
      </div>

      {/* Brand Guidelines */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Brand Guidelines</h3>
        <div className="rounded-xl border border-gray-200 bg-muted/30 p-6 dark:border-polar-700">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">✓ Do</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use the full logo when space permits</li>
                <li>• Maintain adequate clear space around the logo</li>
                <li>• Use symbol-only for small UI elements (favicon, app icon)</li>
                <li>• Ensure proper contrast against backgrounds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">✗ Don&apos;t</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Stretch or distort the logo</li>
                <li>• Change the logo colors arbitrarily</li>
                <li>• Add effects like shadows or gradients</li>
                <li>• Place on busy backgrounds without contrast</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

