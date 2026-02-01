import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function UsersPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all platform users
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              All registered users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              User management interface coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
