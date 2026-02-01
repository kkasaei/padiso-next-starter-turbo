import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Platform analytics and insights
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              Detailed metrics and performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analytics dashboard coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
