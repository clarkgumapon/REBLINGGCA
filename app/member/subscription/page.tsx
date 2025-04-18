"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function MemberSubscription() {
  const { toast } = useToast()
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(new Date(2023, 4, 15))
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleRenewal = () => {
    if (!paymentProof) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload payment proof to continue.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Renewal Submitted",
        description: "Your subscription renewal is under review.",
      })
      setPaymentProof(null)
    }, 1500)
  }

  return (
    <DashboardLayout role="member">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
          <p className="text-muted-foreground">Manage your gym membership subscription.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Details of your active membership plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan:</span>
                <span>Monthly (₱500)</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Start Date:</span>
                <span>April 15, 2023</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Renewal Date:</span>
                <span>May 15, 2023</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>GCash</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Renew Subscription</CardTitle>
              <CardDescription>Extend your membership by renewing your subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Plan</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 gap-4">
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
                {paymentProof && <p className="text-xs text-muted-foreground">File selected: {paymentProof.name}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleRenewal}
                className="w-full transition-all duration-300 hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Submit Renewal
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent subscription payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Monthly Plan</p>
                  <p className="text-sm text-muted-foreground">April 15, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱500</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Monthly Plan</p>
                  <p className="text-sm text-muted-foreground">March 15, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱500</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Monthly Plan</p>
                  <p className="text-sm text-muted-foreground">February 15, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱500</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
