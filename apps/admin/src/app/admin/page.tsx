import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Users, Building2, BarChart3, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Total Users",
    value: "2,345",
    change: "+12.5%",
    icon: Users,
  },
  {
    name: "Organizations",
    value: "456",
    change: "+8.2%",
    icon: Building2,
  },
  {
    name: "Active Sessions",
    value: "1,234",
    change: "+23.1%",
    icon: BarChart3,
  },
  {
    name: "Growth Rate",
    value: "32%",
    change: "+4.5%",
    icon: TrendingUp,
  },
]

export default function AdminDashboard() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your platform's performance and metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and events across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No recent activity to display
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
