import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function OrganizationsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage organizations and their settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organizations List</CardTitle>
            <CardDescription>
              All organizations on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organization management interface coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
