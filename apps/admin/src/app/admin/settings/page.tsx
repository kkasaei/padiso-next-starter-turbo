import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Platform configuration and settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>
              Configure platform-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Settings interface coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
