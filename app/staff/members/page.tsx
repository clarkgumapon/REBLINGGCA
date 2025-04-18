"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function MemberRegistration() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    plan: "monthly",
    startDate: new Date(),
    idFile: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        idFile: e.target.files[0],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.fullName || !formData.contactNumber || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      setIsSubmitting(false)
      return
    }

    // Generate a payment ID for verification
    const paymentId = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")

    // Create user data
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      plan: formData.plan,
      startDate: formData.startDate.toISOString(),
      registrationDate: new Date().toISOString(),
      role: "member", // Explicitly set role to "member"
      paymentStatus: "pending",
      paymentId: paymentId,
    }

    // Store user in localStorage
    localStorage.setItem(`user_${formData.email}`, JSON.stringify(userData))

    // Add payment to verification queue
    const paymentVerification = {
      id: paymentId,
      member: formData.fullName,
      email: formData.email,
      plan: formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1),
      amount: formData.plan === "monthly" ? 500 : formData.plan === "quarterly" ? 1300 : 5000,
      date: new Date().toISOString(),
      proofUrl: "/placeholder.svg?height=300&width=400",
      status: "Pending",
    }

    // Get existing payments or initialize empty array
    let existingPayments = []
    try {
      const storedPayments = localStorage.getItem("pendingPayments")
      if (storedPayments) {
        existingPayments = JSON.parse(storedPayments)
      }
    } catch (error) {
      console.error("Error parsing pending payments:", error)
    }

    // Add the new payment to the existing payments
    existingPayments.push(paymentVerification)

    // Save the updated payments back to localStorage
    localStorage.setItem("pendingPayments", JSON.stringify(existingPayments))

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Member Registered!",
        description: `${formData.fullName} has been successfully registered.`,
      })

      // Reset form
      setFormData({
        fullName: "",
        contactNumber: "",
        email: "",
        plan: "monthly",
        startDate: new Date(),
        idFile: null,
      })
    }, 1500)
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Registration</h1>
          <p className="text-muted-foreground">Register new walk-in members to the gym.</p>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>New Member Form</CardTitle>
            <CardDescription>Enter the details of the new member.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="09XX-XXX-XXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <RadioGroup
                  value={formData.plan}
                  onValueChange={(value) => setFormData({ ...formData, plan: value })}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div className="flex-1">
                      <Label htmlFor="monthly" className="cursor-pointer font-medium">
                        Monthly
                      </Label>
                      <p className="text-sm text-muted-foreground">₱500 / month</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <div className="flex-1">
                      <Label htmlFor="quarterly" className="cursor-pointer font-medium">
                        Quarterly
                      </Label>
                      <p className="text-sm text-muted-foreground">₱1,300 / 3 months</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="annual" id="annual" />
                    <div className="flex-1">
                      <Label htmlFor="annual" className="cursor-pointer font-medium">
                        Annual
                      </Label>
                      <p className="text-sm text-muted-foreground">₱5,000 / year</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idFile">Upload ID</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="idFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {formData.idFile && <div className="text-sm text-muted-foreground">{formData.idFile.name}</div>}
                </div>
                <p className="text-xs text-muted-foreground">Upload a valid ID for verification purposes.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full transition-all duration-300 hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Register Member
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
