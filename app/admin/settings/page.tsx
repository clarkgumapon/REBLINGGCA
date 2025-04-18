"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettings() {
  const { toast } = useToast()

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    gymName: "Niel's Fitness Gym",
    address: "123 Fitness Street, Manila, Philippines",
    phone: "(02) 8123-4567",
    email: "info@nielsfitness.com",
    logo: null as File | null,
    description: "Your premier fitness destination with state-of-the-art equipment and expert trainers.",
  })

  // Business hours
  const [businessHours, setBusinessHours] = useState({
    mondayToFriday: "5:00 AM - 10:00 PM",
    saturday: "6:00 AM - 8:00 PM",
    sunday: "8:00 AM - 6:00 PM",
    holidayHours: "10:00 AM - 4:00 PM",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newMemberAlert: true,
    paymentAlert: true,
    lowAttendanceAlert: false,
    maintenanceAlert: true,
  })

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetentionDays: "90",
    debugMode: false,
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedGeneralSettings = localStorage.getItem("adminGeneralSettings")
      const savedBusinessHours = localStorage.getItem("adminBusinessHours")
      const savedNotificationSettings = localStorage.getItem("adminNotificationSettings")
      const savedSystemSettings = localStorage.getItem("adminSystemSettings")

      if (savedGeneralSettings) {
        const parsedSettings = JSON.parse(savedGeneralSettings)
        setGeneralSettings((prev) => ({ ...prev, ...parsedSettings }))
      }

      if (savedBusinessHours) {
        setBusinessHours(JSON.parse(savedBusinessHours))
      }

      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings))
      }

      if (savedSystemSettings) {
        setSystemSettings(JSON.parse(savedSystemSettings))
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error)
    }
  }, []) // Empty dependency array means this runs once on mount

  // Handle input changes for general settings
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGeneralSettings((prev) => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  // Handle business hours changes
  const handleBusinessHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusinessHours((prev) => ({ ...prev, [name]: value }))
  }

  // Handle notification settings toggle
  const handleNotificationToggle = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  // Handle system settings changes
  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSystemSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle system settings toggle
  const handleSystemToggle = (setting: string, value: boolean) => {
    setSystemSettings((prev) => ({ ...prev, [setting]: value }))
  }

  // Save general settings
  const saveGeneralSettings = () => {
    // Save to localStorage (in a real app, this would be an API call)
    const settingsToSave = { ...generalSettings }
    delete settingsToSave.logo // Don't save the file object
    localStorage.setItem("adminGeneralSettings", JSON.stringify(settingsToSave))

    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated successfully.",
    })
  }

  // Save business hours
  const saveBusinessHours = () => {
    localStorage.setItem("adminBusinessHours", JSON.stringify(businessHours))

    toast({
      title: "Business Hours Saved",
      description: "Your business hours have been updated successfully.",
    })
  }

  // Save notification settings
  const saveNotificationSettings = () => {
    localStorage.setItem("adminNotificationSettings", JSON.stringify(notificationSettings))

    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  // Save system settings
  const saveSystemSettings = () => {
    localStorage.setItem("adminSystemSettings", JSON.stringify(systemSettings))

    toast({
      title: "System Settings Saved",
      description: "Your system settings have been updated successfully.",
    })

    if (systemSettings.maintenanceMode) {
      toast({
        variant: "destructive",
        title: "Maintenance Mode Enabled",
        description: "The system is now in maintenance mode. Users will see a maintenance message.",
      })
    }
  }

  // Clear all data (for demo purposes)
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      // Clear only the gym-related data, not the settings
      const keysToKeep = [
        "adminGeneralSettings",
        "adminBusinessHours",
        "adminNotificationSettings",
        "adminSystemSettings",
      ]

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && !keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      }

      toast({
        title: "Data Cleared",
        description: "All gym data has been cleared successfully.",
      })
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">Configure your gym's settings and preferences.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your gym's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gymName">Gym Name</Label>
                  <Input
                    id="gymName"
                    name="gymName"
                    value={generalSettings.gymName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={generalSettings.email}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Gym Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    {generalSettings.logo && (
                      <p className="text-xs text-muted-foreground">File selected: {generalSettings.logo.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={generalSettings.description}
                    onChange={handleGeneralSettingsChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveGeneralSettings} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save General Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Business Hours */}
          <TabsContent value="business-hours">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set your gym's operating hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mondayToFriday">Monday to Friday</Label>
                  <Input
                    id="mondayToFriday"
                    name="mondayToFriday"
                    value={businessHours.mondayToFriday}
                    onChange={handleBusinessHoursChange}
                    placeholder="e.g., 5:00 AM - 10:00 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saturday">Saturday</Label>
                  <Input
                    id="saturday"
                    name="saturday"
                    value={businessHours.saturday}
                    onChange={handleBusinessHoursChange}
                    placeholder="e.g., 6:00 AM - 8:00 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sunday">Sunday</Label>
                  <Input
                    id="sunday"
                    name="sunday"
                    value={businessHours.sunday}
                    onChange={handleBusinessHoursChange}
                    placeholder="e.g., 8:00 AM - 6:00 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holidayHours">Holiday Hours</Label>
                  <Input
                    id="holidayHours"
                    name="holidayHours"
                    value={businessHours.holidayHours}
                    onChange={handleBusinessHoursChange}
                    placeholder="e.g., 10:00 AM - 4:00 PM"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveBusinessHours} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Business Hours
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Member Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when new members register</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newMemberAlert}
                    onCheckedChange={(checked) => handleNotificationToggle("newMemberAlert", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified about payment activities</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentAlert}
                    onCheckedChange={(checked) => handleNotificationToggle("paymentAlert", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Low Attendance Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when class attendance is low</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowAttendanceAlert}
                    onCheckedChange={(checked) => handleNotificationToggle("lowAttendanceAlert", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified about system maintenance</p>
                  </div>
                  <Switch
                    checked={notificationSettings.maintenanceAlert}
                    onCheckedChange={(checked) => handleNotificationToggle("maintenanceAlert", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSystemToggle("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Backups</h3>
                    <p className="text-sm text-muted-foreground">Enable automatic system backups</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => handleSystemToggle("autoBackup", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    name="backupFrequency"
                    value={systemSettings.backupFrequency}
                    onChange={handleSystemSettingsChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                  <Input
                    id="dataRetentionDays"
                    name="dataRetentionDays"
                    type="number"
                    value={systemSettings.dataRetentionDays}
                    onChange={handleSystemSettingsChange}
                    min="1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Debug Mode</h3>
                    <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                  </div>
                  <Switch
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => handleSystemToggle("debugMode", checked)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                  <Button variant="destructive" onClick={handleClearData}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSystemSettings} className="transition-all duration-300 hover:scale-[1.02]">
                  <Save className="mr-2 h-4 w-4" />
                  Save System Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
