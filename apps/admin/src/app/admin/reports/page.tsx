import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and view platform reports
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              System reports and exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reports interface coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
