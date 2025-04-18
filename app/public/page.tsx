"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { CalendarIcon, Dumbbell, Flame, Upload, Users } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function PublicPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    plan: "monthly",
    startDate: new Date(),
    paymentProof: null as File | null,
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
        paymentProof: e.target.files[0],
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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Registration Submitted",
        description: "Your registration is under review. We'll contact you soon.",
      })

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        contactNumber: "",
        plan: "monthly",
        startDate: new Date(),
        paymentProof: null,
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Niel&apos;s Fitness</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link href="/">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Join Niel&apos;s Fitness — <span className="text-primary">Transform Yourself!</span>
            </h1>
            <p className="text-xl text-gray-300">
              Start your fitness journey today with our state-of-the-art facilities and expert trainers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="transition-all duration-300 hover:scale-[1.05]">
                View Plans
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.05]"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Gym Interior"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Niel&apos;s Fitness?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <CardHeader>
              <Dumbbell className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Modern Equipment</CardTitle>
              <CardDescription className="text-gray-300">
                State-of-the-art fitness equipment for all your workout needs.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Expert Trainers</CardTitle>
              <CardDescription className="text-gray-300">
                Certified fitness professionals to guide your fitness journey.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <CardHeader>
              <Flame className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Diverse Classes</CardTitle>
              <CardDescription className="text-gray-300">
                From HIIT to yoga, we offer a wide range of fitness classes.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Registration Form */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white text-gray-900">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Register Now</CardTitle>
              <CardDescription>Fill out the form below to join Niel&apos;s Fitness Gym.</CardDescription>
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
                  <Label>Payment Instructions</Label>
                  <div className="rounded-md bg-gray-50 p-4 text-sm">
                    <p className="font-medium">GCash Payment Details:</p>
                    <p>Account Name: Niel&apos;s Fitness Gym</p>
                    <p>Number: 09123456789</p>
                    <p className="mt-2 text-muted-foreground">
                      Please upload your payment receipt after sending the payment.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentProof">Upload Payment Proof</Label>
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {formData.paymentProof && (
                    <p className="text-xs text-muted-foreground">File selected: {formData.paymentProof.name}</p>
                  )}
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
                      Submit Registration
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold">Niel&apos;s Fitness</h2>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2023 Niel&apos;s Fitness Gym. All rights reserved.</p>
              <p className="text-gray-400">123 Fitness Street, Manila, Philippines</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
