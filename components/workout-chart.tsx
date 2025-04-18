"use client"

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface WorkoutEntry {
  check_in_time: string
  check_out_time: string
}

interface WorkoutChartProps {
  data: WorkoutEntry[]
}

export default function WorkoutChart({ data }: WorkoutChartProps) {
  // Memoize the chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    return data.map(entry => {
      const checkIn = new Date(entry.check_in_time)
      const checkOut = new Date(entry.check_out_time)
      const duration = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60) // Duration in minutes
      
      return {
        date: format(checkIn, 'MMM dd'),
        duration: Math.round(duration)
      }
    }).slice(-14) // Show last 14 days
  }, [data])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Duration (minutes)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '12px' }
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 