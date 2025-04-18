"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getUserProfile, updateUserProfile } from "@/lib/api"
import { requireAuth } from "@/lib/auth"

interface Profile {
  full_name: string
  email: string
  phone: string
  address: string
  emergency_contact: string
  emergency_phone: string
}

export default function MemberProfile() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    emergency_phone: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!requireAuth()) {
      return
    }
    
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile()
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserProfile(profile)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <DashboardLayout role="member">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="member">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    name="emergency_contact"
                    value={profile.emergency_contact}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_phone"
                    name="emergency_phone"
                    value={profile.emergency_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
