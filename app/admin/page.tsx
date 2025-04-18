"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CreditCard, TrendingUp, DollarSign } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Function to get real analytics data
const getAnalyticsData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const currentMonth = new Date().getMonth()
  const memberGrowth: { month: string; members: number }[] = []
  const revenueData: { month: string; revenue: number }[] = []
  const memberEngagement: { day: string; visits: number }[] = []
  const planDistribution: { plan: string; count: number }[] = [
    { plan: "Monthly", count: 0 },
    { plan: "Quarterly", count: 0 },
    { plan: "Annual", count: 0 }
  ]

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

          // Process revenue and plan distribution
          if (userData.paymentStatus === 'approved') {
            const planPrices = {
              'Monthly': 500,
              'Quarterly': 1300,
              'Annual': 5000
            }
            const price = planPrices[userData.plan as keyof typeof planPrices] || 0
            revenueData[monthIndex].revenue += price

            // Update plan distribution
            const planIndex = planDistribution.findIndex(p => p.plan === userData.plan)
            if (planIndex !== -1) {
              planDistribution[planIndex].count++
            }
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
    memberEngagement,
    planDistribution
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    memberGrowth: [] as { month: string; members: number }[],
    revenueData: [] as { month: string; revenue: number }[],
    memberEngagement: [] as { day: string; visits: number }[],
    planDistribution: [] as { plan: string; count: number }[]
  })

  useEffect(() => {
    try {
      // Get real stats and analytics from localStorage
      const analyticsData = getAnalyticsData()
      
      // Calculate summary stats
      const totalMembers = analyticsData.memberGrowth[analyticsData.memberGrowth.length - 1]?.members || 0
      const totalRevenue = analyticsData.revenueData.reduce((sum, data) => sum + data.revenue, 0)
      const activeMembers = analyticsData.planDistribution.reduce((sum, plan) => sum + plan.count, 0)
      
      // Count pending payments
      let pendingPayments = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
        if (key?.startsWith('user_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || '{}')
            if (userData.role === 'member' && userData.paymentStatus === 'pending') {
              pendingPayments++
            }
          } catch (error) {
            console.error('Error parsing user data:', error)
          }
        }
      }

      setStats({
        totalMembers,
        activeMembers,
        totalRevenue,
        pendingPayments,
        ...analyticsData
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }

    // Set up interval to refresh stats every minute
    const interval = setInterval(() => {
      const updatedAnalytics = getAnalyticsData()
      const updatedTotalMembers = updatedAnalytics.memberGrowth[updatedAnalytics.memberGrowth.length - 1]?.members || 0
      const updatedTotalRevenue = updatedAnalytics.revenueData.reduce((sum, data) => sum + data.revenue, 0)
      const updatedActiveMembers = updatedAnalytics.planDistribution.reduce((sum, plan) => sum + plan.count, 0)
      
      let updatedPendingPayments = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('user_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || '{}')
            if (userData.role === 'member' && userData.paymentStatus === 'pending') {
              updatedPendingPayments++
            }
          } catch (error) {
            console.error('Error parsing user data:', error)
          }
        }
      }

      setStats({
        totalMembers: updatedTotalMembers,
        activeMembers: updatedActiveMembers,
        totalRevenue: updatedTotalRevenue,
        pendingPayments: updatedPendingPayments,
        ...updatedAnalytics
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your gym&apos;s performance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">{stats.activeMembers} active members</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all memberships</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMembers}</div>
              <p className="text-xs text-muted-foreground">Current paid memberships</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Membership Growth</CardTitle>
                  <CardDescription>Monthly membership growth over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.memberGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="members" stroke="#0088FE" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Membership Distribution</CardTitle>
                  <CardDescription>Distribution by plan type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.planDistribution}
                        dataKey="count"
                        nameKey="plan"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {stats.planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Member Engagement</CardTitle>
                <CardDescription>Weekly activity patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.memberEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
