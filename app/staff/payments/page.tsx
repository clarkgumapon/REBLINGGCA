"use client"

import { useState, useEffect } from "react"
import { Check, Eye, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentVerification() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<any[]>([])
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false)

  // Load payments from localStorage on component mount
  useEffect(() => {
    loadPayments()
  }, []) // Empty dependency array means this runs once on mount

  // Function to load payments from localStorage
  const loadPayments = () => {
    // Get pending payments from localStorage
    let pendingPayments = []
    try {
      const storedPayments = localStorage.getItem("pendingPayments")
      if (storedPayments) {
        pendingPayments = JSON.parse(storedPayments)
      }
    } catch (error) {
      console.error("Error parsing pending payments:", error)
    }

    // Sample payments for Neil and Reblingca if no pending payments
    const samplePayments = [
      {
        id: "123456",
        member: "Neil",
        email: "neil@example.com",
        plan: "Monthly",
        amount: 500,
        date: new Date().toISOString(),
        proofUrl: "/placeholder.svg?height=300&width=400",
        status: "Pending",
      },
      {
        id: "789012",
        member: "Reblingca",
        email: "reblingca@example.com",
        plan: "Quarterly",
        amount: 1300,
        date: new Date().toISOString(),
        proofUrl: "/placeholder.svg?height=300&width=400",
        status: "Pending",
      },
    ]

    // Set the payments state with real pending payments first, then add sample data if needed
    if (pendingPayments.length > 0) {
      setPayments(pendingPayments)
    } else {
      setPayments(samplePayments)
    }
  }

  const handleApprove = (id: number | string) => {
    // Update payment status in state
    const updatedPayments = payments.map((payment) =>
      payment.id === id ? { ...payment, status: "Approved" } : payment,
    )
    setPayments(updatedPayments)

    // Update user's payment status in localStorage if it's a real user
    const paymentToApprove = payments.find((p) => p.id === id)
    if (paymentToApprove && paymentToApprove.email) {
      const userKey = `user_${paymentToApprove.email}`
      const userData = localStorage.getItem(userKey)

      if (userData) {
        const user = JSON.parse(userData)
        user.paymentStatus = "approved"
        localStorage.setItem(userKey, JSON.stringify(user))
      }
    }

    // Update pending payments in localStorage - remove the approved payment
    const pendingPayments = updatedPayments.filter((p) => p.status === "Pending")
    localStorage.setItem("pendingPayments", JSON.stringify(pendingPayments))

    toast({
      title: "Payment Approved",
      description: "The payment has been successfully verified and approved.",
    })
  }

  const handleReject = (id: number | string) => {
    // Update payment status in state
    const updatedPayments = payments.map((payment) =>
      payment.id === id ? { ...payment, status: "Rejected" } : payment,
    )
    setPayments(updatedPayments)

    // Update user's payment status in localStorage if it's a real user
    const paymentToReject = payments.find((p) => p.id === id)
    if (paymentToReject && paymentToReject.email) {
      const userKey = `user_${paymentToReject.email}`
      const userData = localStorage.getItem(userKey)

      if (userData) {
        const user = JSON.parse(userData)
        user.paymentStatus = "rejected"
        localStorage.setItem(userKey, JSON.stringify(user))
      }
    }

    // Update pending payments in localStorage - remove the rejected payment
    const pendingPayments = updatedPayments.filter((p) => p.status === "Pending")
    localStorage.setItem("pendingPayments", JSON.stringify(pendingPayments))

    toast({
      variant: "destructive",
      title: "Payment Rejected",
      description: "The payment has been rejected.",
    })
  }

  const viewProof = (payment: any) => {
    setSelectedPayment(payment)
    setIsProofDialogOpen(true)
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Verification</h1>
          <p className="text-muted-foreground">Verify and approve member payment submissions.</p>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>
              {payments.filter((p) => p.status === "Pending").length} payments waiting for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.member}</TableCell>
                    <TableCell>{payment.plan}</TableCell>
                    <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payment.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewProof(payment)}
                          disabled={payment.status !== "Pending"}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Proof</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(payment.id)}
                          disabled={payment.status !== "Pending"}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(payment.id)}
                          disabled={payment.status !== "Pending"}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {payments.filter((p) => p.status === "Pending").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No pending payments to verify.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Payment Proof Dialog */}
      <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <>
                  {selectedPayment.member} - {selectedPayment.plan} Plan (₱{selectedPayment.amount})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {selectedPayment && (
              <img
                src={selectedPayment.proofUrl || "/placeholder.svg"}
                alt="Payment Proof"
                className="max-h-[400px] rounded-md border"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedPayment) handleReject(selectedPayment.id)
                setIsProofDialogOpen(false)
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => {
                if (selectedPayment) handleApprove(selectedPayment.id)
                setIsProofDialogOpen(false)
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
