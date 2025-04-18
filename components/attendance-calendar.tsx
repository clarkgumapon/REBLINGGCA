"use client"

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface WorkoutEntry {
  check_in_time: string
}

interface AttendanceCalendarProps {
  data: WorkoutEntry[]
}

export default function AttendanceCalendar({ data }: AttendanceCalendarProps) {
  // Memoize calendar data to prevent unnecessary recalculations
  const calendarData = useMemo(() => {
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    
    // Get all days in current month
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Create a Set of attendance dates for O(1) lookup
    const attendanceDates = new Set(
      data.map(entry => format(new Date(entry.check_in_time), 'yyyy-MM-dd'))
    )
    
    return days.map(day => ({
      date: day,
      isToday: format(today, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'),
      hasAttendance: attendanceDates.has(format(day, 'yyyy-MM-dd'))
    }))
  }, [data])

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day labels */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div
          key={day}
          className="text-center text-sm font-medium text-muted-foreground p-2"
        >
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarData.map((day, index) => (
        <div
          key={index}
          className={`
            aspect-square p-2 text-center
            ${day.isToday ? 'border-2 border-primary' : ''}
            ${day.hasAttendance ? 'bg-primary/10' : ''}
            rounded-md
          `}
        >
          <span className={`
            text-sm
            ${day.isToday ? 'font-bold text-primary' : ''}
            ${day.hasAttendance ? 'font-medium' : ''}
          `}>
            {format(day.date, 'd')}
          </span>
        </div>
      ))}
    </div>
  )
} 