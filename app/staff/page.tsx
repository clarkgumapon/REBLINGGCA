"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users, CreditCard, Activity, ClipboardCheck, UserPlus, Clock, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DashboardStats {
  totalMembers: number
  pendingVerifications: number
  todayCheckIns: number
  newRegistrations: number
  memberGrowth: { month: string; members: number }[]
  revenueData: { month: string; revenue: number }[]
  memberEngagement: { day: string; visits: number }[]
}

// Function to get real stats from localStorage
const getRealStats = (): DashboardStats => {
  const stats: DashboardStats = {
    totalMembers: 0,
    pendingVerifications: 0,
    todayCheckIns: 0,
    newRegistrations: 0,
    memberGrowth: [],
    revenueData: [],
    memberEngagement: []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Iterate through localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
    if (key?.startsWith('user_')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}')
        
        // Count total members (excluding staff/admin)
        if (userData.role === 'member') {
          stats.totalMembers++

            // Count pending verifications
          if (userData.status === 'pending') {
            stats.pendingVerifications++
            }

            // Count new registrations today
              const regDate = new Date(userData.registrationDate)
          if (regDate >= today) {
            stats.newRegistrations++
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    } else if (key?.startsWith('checkin_')) {
      try {
        const checkInData = JSON.parse(localStorage.getItem(key) || '{}')
        const checkInDate = new Date(checkInData.check_in_time)
        
        // Count today's check-ins
        if (checkInDate >= today) {
          stats.todayCheckIns++
        }
      } catch (error) {
        console.error('Error parsing check-in data:', error)
      }
    }
  }

  return stats
}

// Function to get real analytics data
const getAnalyticsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const currentMonth = new Date().getMonth()
  const memberGrowth: { month: string; members: number }[] = []
  const revenueData: { month: string; revenue: number }[] = []
  const memberEngagement: { day: string; visits: number }[] = []

  // Initialize data arrays
  months.forEach((month) => {
    memberGrowth.push({ month, members: 0 })
    revenueData.push({ month, revenue: 0 })
  })
  days.forEach((day) => {
    memberEngagement.push({ day, visits: 0 })
  })

  // Process user data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('user_')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}')
        if (userData.role === 'member') {
          // Process member growth
          const regDate = new Date(userData.registrationDate)
          const monthIndex = regDate.getMonth()
          for (let j = monthIndex; j <= currentMonth; j++) {
            memberGrowth[j].members++
          }

          // Process revenue
          if (userData.paymentStatus === 'approved') {
            const planPrices = {
              'Monthly': 500,
              'Quarterly': 1300,
              'Annual': 5000
            }
            const price = planPrices[userData.plan as keyof typeof planPrices] || 0
            revenueData[monthIndex].revenue += price
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    } else if (key?.startsWith('checkin_')) {
      try {
        // Process member engagement (visits per day)
        const checkInData = JSON.parse(localStorage.getItem(key) || '{}')
        const checkInDate = new Date(checkInData.check_in_time)
        const dayIndex = checkInDate.getDay()
        memberEngagement[dayIndex].visits++
      } catch (error) {
        console.error('Error parsing check-in data:', error)
      }
    }
      }

      return {
    memberGrowth,
    revenueData,
    memberEngagement
  }
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats & {
    memberGrowth: { month: string; members: number }[]
    revenueData: { month: string; revenue: number }[]
    memberEngagement: { day: string; visits: number }[]
  }>({
    totalMembers: 0,
    pendingVerifications: 0,
    todayCheckIns: 0,
    newRegistrations: 0,
    memberGrowth: [],
    revenueData: [],
    memberEngagement: []
  })

  useEffect(() => {
    // Get real stats and analytics from localStorage
    const realStats = getRealStats()
    const analyticsData = getAnalyticsData()
    setStats({
      ...realStats,
      ...analyticsData
    })

    // Set up interval to refresh stats every minute
    const interval = setInterval(() => {
      const updatedStats = getRealStats()
      const updatedAnalytics = getAnalyticsData()
      setStats({
        ...updatedStats,
        ...updatedAnalytics
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Today's classes
  const todayClasses = [
    { time: "06:00 AM", name: "Morning Yoga", trainer: "Sarah Johnson", attendees: 8 },
    { time: "09:30 AM", name: "Spin Class", trainer: "Mike Thompson", attendees: 12 },
    { time: "12:00 PM", name: "Lunch HIIT", trainer: "Alex Rodriguez", attendees: 10 },
    { time: "05:30 PM", name: "Evening Pilates", trainer: "Emma Wilson", attendees: 15 },
    { time: "07:00 PM", name: "Strength Training", trainer: "David Chen", attendees: 9 },
  ]

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">{stats.newRegistrations} new today</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Requires your attention</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Check-ins</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
              <p className="text-xs text-muted-foreground">Members visited today</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newRegistrations}</div>
              <p className="text-xs text-muted-foreground">New members today</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for staff members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="flex items-center justify-start gap-2 h-auto py-4" variant="outline">
                      <ClipboardCheck className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Verify Payments</div>
                        <div className="text-xs text-muted-foreground">
                          {stats.pendingVerifications} pending verification{stats.pendingVerifications !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </Button>
                    <Button className="flex items-center justify-start gap-2 h-auto py-4" variant="outline">
                      <UserPlus className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Register New Member</div>
                        <div className="text-xs text-muted-foreground">Add a new gym member</div>
                      </div>
                    </Button>
                    <Button className="flex items-center justify-start gap-2 h-auto py-4" variant="outline">
                      <Clock className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Check-in Member</div>
                        <div className="text-xs text-muted-foreground">Record member attendance</div>
                      </div>
                    </Button>
                    <Button className="flex items-center justify-start gap-2 h-auto py-4" variant="outline">
                      <Calendar className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Manage Classes</div>
                        <div className="text-xs text-muted-foreground">Update class schedule</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Today&apos;s Schedule</CardTitle>
                  <CardDescription>Classes for {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayClasses.map((cls, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-50">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{cls.name}</p>
                            <p className="text-xs text-muted-foreground">{cls.time}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {cls.trainer} • {cls.attendees} attendees
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Growth</CardTitle>
                  <CardDescription>Monthly membership growth over the past year</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.memberGrowth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} members`, "Members"]} />
                      <Legend />
                      <Line type="monotone" dataKey="members" stroke="#0088FE" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Member Engagement</CardTitle>
                <CardDescription>Weekly activity patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.memberEngagement}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} visits`, "Visits"]} />
                    <Legend />
                    <Bar dataKey="visits" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Class Schedule</CardTitle>
                <CardDescription>Manage and view upcoming classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Time</th>
                        <th className="py-3 px-4 text-left font-medium">Class</th>
                        <th className="py-3 px-4 text-left font-medium">Trainer</th>
                        <th className="py-3 px-4 text-left font-medium">Capacity</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayClasses.map((cls, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-3 px-4">{cls.time}</td>
                          <td className="py-3 px-4">{cls.name}</td>
                          <td className="py-3 px-4">{cls.trainer}</td>
                          <td className="py-3 px-4">{cls.attendees}/20</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
