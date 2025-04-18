"use client"

import { useCallback, useMemo, useState, Suspense, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { 
  Activity, 
  Calendar, 
  CreditCard, 
  Dumbbell, 
  LogOut, 
  User,
  Home,
  UserCircle,
  CreditCard as CreditCardIcon,
  LineChart,
  Flame,
  Clock
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import LoadingSpinner from "@/components/loading-spinner"

interface WorkoutEntry {
  check_in_time: string
  check_out_time: string
}

export default function MemberDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('workoutHistory')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalWorkouts: workoutHistory.length,
      totalDuration: workoutHistory.reduce((acc: number, curr: WorkoutEntry) => {
        const checkIn = new Date(curr.check_in_time)
        const checkOut = new Date(curr.check_out_time)
        return acc + (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
      }, 0),
      averageDuration: workoutHistory.length > 0 
        ? workoutHistory.reduce((acc: number, curr: WorkoutEntry) => {
            const checkIn = new Date(curr.check_in_time)
            const checkOut = new Date(curr.check_out_time)
            return acc + (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
          }, 0) / workoutHistory.length
        : 0
    }
  }, [workoutHistory])

  const handleCheckIn = () => {
    const now = new Date().toISOString()
    setIsCheckedIn(true)
    setCheckInTime(now)
    toast({
      title: "Checked In",
      description: "Your workout session has started.",
    })
  }

  const handleCheckOut = () => {
    if (!checkInTime) return

    const now = new Date().toISOString()
    const newWorkout = {
      check_in_time: checkInTime,
      check_out_time: now
    }

    const updatedHistory = [...workoutHistory, newWorkout]
    setWorkoutHistory(updatedHistory)
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory))
    
    setIsCheckedIn(false)
    setCheckInTime(null)
    
    toast({
      title: "Checked Out",
      description: "Your workout session has been recorded.",
    })
  }

  return (
    <DashboardLayout role="member">
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">Track your fitness journey</p>
          </div>
          <Button
            size="lg"
            className={isCheckedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          >
            <Activity className="mr-2 h-5 w-5" />
            {isCheckedIn ? "Check Out" : "Check In"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">sessions recorded</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.totalDuration)} mins</div>
              <p className="text-xs text-muted-foreground">time spent working out</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Average Session</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.averageDuration)} mins</div>
              <p className="text-xs text-muted-foreground">per workout</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutHistory.slice(-5).reverse().map((workout, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">
                      {format(new Date(workout.check_in_time), "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(workout.check_in_time), "h:mm a")} - {format(new Date(workout.check_out_time), "h:mm a")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {Math.round((new Date(workout.check_out_time).getTime() - new Date(workout.check_in_time).getTime()) / (1000 * 60))} mins
                    </p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
              ))}
              {workoutHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No workouts recorded yet</p>
                  <p className="text-sm">Check in to start tracking your sessions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
