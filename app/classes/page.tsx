"use client"

import { useState } from "react"
import Link from "next/link"
import { Dumbbell, Calendar, Clock, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Mock class data
const classData = [
  {
    id: 1,
    name: "Morning Yoga",
    instructor: "Maria Santos",
    time: "6:00 AM - 7:00 AM",
    days: ["Monday", "Wednesday", "Friday"],
    level: "Beginner",
    capacity: 15,
    enrolled: 8,
    description: "Start your day with energizing yoga poses and mindful breathing techniques.",
    image: "/placeholder.svg?height=200&width=400&text=Yoga",
  },
  {
    id: 2,
    name: "HIIT Training",
    instructor: "Carlos Tan",
    time: "9:00 AM - 10:00 AM",
    days: ["Tuesday", "Thursday"],
    level: "Intermediate",
    capacity: 12,
    enrolled: 10,
    description: "High-intensity interval training to boost your metabolism and build strength.",
    image: "/placeholder.svg?height=200&width=400&text=HIIT",
  },
  {
    id: 3,
    name: "Zumba",
    instructor: "Ana Gomez",
    time: "5:30 PM - 6:30 PM",
    days: ["Monday", "Wednesday", "Friday"],
    level: "All Levels",
    capacity: 20,
    enrolled: 15,
    description: "Dance your way to fitness with this fun and energetic workout.",
    image: "/placeholder.svg?height=200&width=400&text=Zumba",
  },
  {
    id: 4,
    name: "Boxing",
    instructor: "Pedro Reyes",
    time: "7:00 PM - 8:00 PM",
    days: ["Tuesday", "Thursday"],
    level: "Intermediate",
    capacity: 10,
    enrolled: 7,
    description: "Learn boxing techniques while getting a full-body workout.",
    image: "/placeholder.svg?height=200&width=400&text=Boxing",
  },
  {
    id: 5,
    name: "Pilates",
    instructor: "Maria Santos",
    time: "10:00 AM - 11:00 AM",
    days: ["Monday", "Friday"],
    level: "All Levels",
    capacity: 15,
    enrolled: 9,
    description: "Focus on core strength, posture, and flexibility with controlled movements.",
    image: "/placeholder.svg?height=200&width=400&text=Pilates",
  },
  {
    id: 6,
    name: "Spin Class",
    instructor: "Carlos Tan",
    time: "6:00 PM - 7:00 PM",
    days: ["Monday", "Wednesday", "Friday"],
    level: "All Levels",
    capacity: 15,
    enrolled: 12,
    description: "High-energy indoor cycling workout with music and motivation.",
    image: "/placeholder.svg?height=200&width=400&text=Spin",
  },
]

export default function ClassesPage() {
  const { toast } = useToast()
  const [levelFilter, setLevelFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const [classes, setClasses] = useState(classData)

  // Apply filters
  const filteredClasses = classes.filter((cls) => {
    const matchesLevel = levelFilter === "all" || cls.level.toLowerCase().includes(levelFilter.toLowerCase())
    const matchesDay = dayFilter === "all" || cls.days.some((day) => day.toLowerCase() === dayFilter.toLowerCase())
    return matchesLevel && matchesDay
  })

  const handleJoinClass = (classId: number) => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser")

    if (!loggedInUser) {
      toast({
        title: "Login Required",
        description: "Please log in to join classes.",
        action: (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        ),
      })
      return
    }

    // Update enrolled count
    setClasses(
      classes.map((cls) =>
        cls.id === classId && cls.enrolled < cls.capacity ? { ...cls, enrolled: cls.enrolled + 1 } : cls,
      ),
    )

    toast({
      title: "Class Joined!",
      description: "You have successfully joined this class.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <Link href="/" className="text-xl font-bold">
              Niel's Fitness
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/classes" className="text-sm text-primary font-medium">
              Classes
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Our Classes</h1>
          <p className="text-gray-600 mt-2">Discover our wide range of fitness classes for all levels</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={dayFilter} onValueChange={setDayFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img src={cls.image || "/placeholder.svg"} alt={cls.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                <CardDescription>Instructor: {cls.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{cls.days.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {cls.enrolled}/{cls.capacity} spots filled
                  </span>
                </div>
                <p className="text-sm text-gray-600">{cls.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Level:</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      cls.level === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : cls.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : cls.level === "Advanced"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {cls.level}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={cls.enrolled >= cls.capacity}
                  onClick={() => handleJoinClass(cls.id)}
                >
                  {cls.enrolled >= cls.capacity ? "Class Full" : "Join Class"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No classes match your filters. Please try different criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setLevelFilter("all")
                setDayFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
