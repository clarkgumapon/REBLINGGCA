"use client"

import type React from "react"

import { useState } from "react"
import { QrCode, Save } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentSettings() {
  const { toast } = useToast()
  const [gcashSettings, setGcashSettings] = useState({
    accountName: "Niel's Fitness Gym",
    accountNumber: "09123456789",
    qrCode: null as File | null,
  })
  const [bankSettings, setBankSettings] = useState({
    bankName: "BPI",
    accountName: "Niel's Fitness Gym",
    accountNumber: "1234567890",
  })
  const [qrPreview, setQrPreview] = useState<string | null>(null)

  const handleGcashQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setGcashSettings({ ...gcashSettings, qrCode: file })

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setQrPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveGcashSettings = () => {
    // In a real app, this would be an API call
    toast({
      title: "GCash Settings Saved",
      description: "Your GCash payment settings have been updated successfully.",
    })
  }

  const saveBankSettings = () => {
    // In a real app, this would be an API call
    toast({
      title: "Bank Settings Saved",
      description: "Your bank payment settings have been updated successfully.",
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground">Configure your payment methods and settings.</p>
        </div>

        <Tabs defaultValue="gcash" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gcash">GCash</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="gcash">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>GCash Settings</CardTitle>
                <CardDescription>Configure your GCash account details for receiving payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gcash-name">Account Name</Label>
                  <Input
                    id="gcash-name"
                    value={gcashSettings.accountName}
                    onChange={(e) => setGcashSettings({ ...gcashSettings, accountName: e.target.value })}
                    placeholder="Enter GCash account name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gcash-number">Account Number</Label>
                  <Input
                    id="gcash-number"
                    value={gcashSettings.accountNumber}
                    onChange={(e) => setGcashSettings({ ...gcashSettings, accountNumber: e.target.value })}
                    placeholder="Enter GCash number (09XX-XXX-XXXX)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gcash-qr">QR Code</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="gcash-qr"
                        type="file"
                        accept="image/*"
                        onChange={handleGcashQrUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    {qrPreview && (
                      <div className="relative h-20 w-20 rounded-md border overflow-hidden">
                        <img
                          src={qrPreview || "/placeholder.svg"}
                          alt="GCash QR Code"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {!qrPreview && (
                      <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed">
                        <QrCode className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Upload your GCash QR code for easy payments.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveGcashSettings} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save GCash Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Bank Transfer Settings</CardTitle>
                <CardDescription>Configure your bank account details for receiving payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-account-name">Account Name</Label>
                  <Input
                    id="bank-account-name"
                    value={bankSettings.accountName}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                    placeholder="Enter account name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-account-number">Account Number</Label>
                  <Input
                    id="bank-account-number"
                    value={bankSettings.accountNumber}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveBankSettings} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Bank Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
