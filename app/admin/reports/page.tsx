"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, FileText, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function Reports() {
  const { toast } = useToast()
  const [timeFilter, setTimeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Function to get payment data for members only (not staff)
  const getPaymentData = () => {
    const realPayments = []

    // Get all registered users from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("user_")) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || "{}")

          // Only include members (not staff or admin)
          if (userData.role === "member" || !userData.role) {
            const planAmount =
              userData.plan === "monthly" || userData.plan === "Monthly"
                ? 500
                : userData.plan === "quarterly" || userData.plan === "Quarterly"
                  ? 1300
                  : 5000

            realPayments.push({
              id: userData.paymentId || `user_${realPayments.length + 1}`,
              member: userData.fullName || userData.email.split("@")[0],
              plan: userData.plan ? userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1) : "Monthly",
              amount: planAmount,
              status:
                userData.paymentStatus === "approved"
                  ? "Paid"
                  : userData.paymentStatus === "rejected"
                    ? "Failed"
                    : "Pending",
              date: userData.registrationDate || new Date().toISOString(),
            })
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    // If no real payments, return sample data for Neil and Reblingca
    if (realPayments.length === 0) {
      return [
        {
          id: 1,
          member: "Neil",
          plan: "Monthly",
          amount: 500,
          status: "Paid",
          date: "2023-04-15",
        },
        {
          id: 2,
          member: "Reblingca",
          plan: "Quarterly",
          amount: 1300,
          status: "Paid",
          date: "2023-04-14",
        },
      ]
    }

    return realPayments
  }

  const [paymentData, setPaymentData] = useState(() => getPaymentData())

  useEffect(() => {
    // This will ensure the reports are updated when the component mounts
    setPaymentData(getPaymentData())
  }, [])

  const filteredData = paymentData.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPlan = planFilter === "all" || payment.plan.toLowerCase() === planFilter.toLowerCase()

    // Time filtering logic would be more complex in a real app
    return matchesStatus && matchesPlan
  })

  const exportCSV = () => {
    toast({
      title: "Export Started",
      description: "Your CSV report is being generated and will download shortly.",
    })
    // In a real app, this would trigger a CSV download
  }

  const exportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF report is being generated and will download shortly.",
    })
    // In a real app, this would trigger a PDF download
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and export payment and membership reports.</p>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Payment Reports</CardTitle>
                <CardDescription>View and filter payment transactions.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <div>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Subscription Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="monthly">Monthly (₱500)</SelectItem>
                      <SelectItem value="quarterly">Quarterly (₱1,300)</SelectItem>
                      <SelectItem value="annual">Annual (₱5,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.member}</TableCell>
                        <TableCell>{payment.plan}</TableCell>
                        <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No payment records found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
