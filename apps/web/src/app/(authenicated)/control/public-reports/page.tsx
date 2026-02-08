"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { trpc } from "@/lib/trpc/client"
import {
  FileText,
  Mail,
  Users,
  RefreshCw,
  Loader2,
  ExternalLink,
  CheckCircle,
  Clock,
  Globe,
  Eye,
} from "lucide-react"

type Tab = "reports" | "contacts" | "waitlist"

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    COMPLETED: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Completed" },
    PENDING: { bg: "bg-yellow-100 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-400", label: "Pending" },
    PROCESSING: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Processing" },
    FAILED: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Failed" },
    EXPIRED: { bg: "bg-gray-100 dark:bg-gray-950", text: "text-gray-700 dark:text-gray-400", label: "Expired" },
  }

  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export default function PublicReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("reports")

  const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = trpc.admin.getStats.useQuery()
  const { data: reports, isLoading: isLoadingReports, refetch: refetchReports } = trpc.admin.getPublicReports.useQuery()
  const { data: contacts, isLoading: isLoadingContacts, refetch: refetchContacts } = trpc.admin.getContactRequests.useQuery()
  const { data: waitlist, isLoading: isLoadingWaitlist, refetch: refetchWaitlist } = trpc.admin.getWaitlistRequests.useQuery()

  const isLoading = isLoadingStats || isLoadingReports || isLoadingContacts || isLoadingWaitlist

  const refetchAll = () => {
    refetchStats()
    refetchReports()
    refetchContacts()
    refetchWaitlist()
  }

  const tabs = [
    { id: "reports" as Tab, label: "Public Reports", icon: FileText, count: stats?.publicReports ?? 0 },
    { id: "contacts" as Tab, label: "Contact Requests", icon: Mail, count: stats?.contactRequests ?? 0 },
    { id: "waitlist" as Tab, label: "Waitlist", icon: Users, count: stats?.waitlistRequests ?? 0 },
  ]

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Public Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage public reports, contact requests, and waitlist
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refetchAll}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.publicReports ?? 0}</p>
                <p className="text-sm text-muted-foreground">Public Reports</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.contactRequests ?? 0}</p>
                <p className="text-sm text-muted-foreground">Contact Requests</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.waitlistRequests ?? 0}</p>
                <p className="text-sm text-muted-foreground">Waitlist Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {/* Reports Tab */}
          {activeTab === "reports" && (
            <>
              {isLoadingReports ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !reports?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="h-10 w-10 mb-3 opacity-50" />
                  <p>No public reports found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Domain</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Views</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Created</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Expires</th>
                        <th className="px-4 py-4 text-right text-sm font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{report.domain}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              {report.viewCount}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {new Date(report.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {report.pdfUrl && (
                              <a
                                href={report.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                              >
                                PDF <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <>
              {isLoadingContacts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !contacts?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Mail className="h-10 w-10 mb-3 opacity-50" />
                  <p>No contact requests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Message</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                          </td>
                          <td className="px-4 py-4">
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                              {contact.email}
                            </a>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                              {contact.message}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            {contact.responded ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                                <CheckCircle className="h-4 w-4" />
                                Responded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                                <Clock className="h-4 w-4" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Waitlist Tab */}
          {activeTab === "waitlist" && (
            <>
              {isLoadingWaitlist ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !waitlist?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="h-10 w-10 mb-3 opacity-50" />
                  <p>No waitlist requests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Company</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Domain</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {waitlist.map((request) => (
                        <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium">{request.firstName} {request.lastName}</span>
                          </td>
                          <td className="px-4 py-4">
                            <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                              {request.email}
                            </a>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {request.companyName}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              {request.domain}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {request.unlocked ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                                <CheckCircle className="h-4 w-4" />
                                Unlocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                                <Clock className="h-4 w-4" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
