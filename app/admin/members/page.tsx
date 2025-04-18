"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Trash2, User, Search, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function MemberManagement() {
  const { toast } = useToast()
  const [members, setMembers] = useState<any[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Fix the useEffect hook to properly load member data with only Neil and Reblingca
  useEffect(() => {
    // Get all registered users from localStorage
    const registeredMembers = []

    // Our two specific sample members
    const sampleMembers = [
      {
        id: 1,
        name: "Neil",
        email: "neil@example.com",
        plan: "Monthly",
        startDate: "2023-04-15",
        status: "Active",
        contactNumber: "09123456789",
      },
      {
        id: 2,
        name: "Reblingca",
        email: "reblingca@example.com",
        plan: "Quarterly",
        startDate: "2023-03-10",
        status: "Active",
        contactNumber: "09234567890",
      },
    ]

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("user_")) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || "{}")
            // Only include members (not staff or admin)
            if (userData.role === "member" || !userData.role) {
              registeredMembers.push({
                id: `reg_${i}`,
                name: userData.fullName || userData.email.split("@")[0],
                email: userData.email,
                plan: userData.plan ? userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1) : "Monthly",
                startDate: userData.startDate ? new Date(userData.startDate).toLocaleDateString() : "N/A",
                status:
                  userData.paymentStatus === "approved"
                    ? "Active"
                    : userData.paymentStatus === "rejected"
                      ? "Inactive"
                      : "Pending",
                contactNumber: userData.contactNumber || "N/A",
              })
            }
          } catch (error) {
            console.error("Error parsing user data:", error)
          }
        }
      }

      // Set members with the combined data
      if (registeredMembers.length > 0) {
        setMembers(registeredMembers)
      } else {
        setMembers(sampleMembers)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Fallback to sample data if localStorage access fails
      setMembers(sampleMembers)
    }
  }, []) // Empty dependency array means this runs once on mount

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || member.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPlan = planFilter === "all" || member.plan.toLowerCase() === planFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleEditMember = () => {
    if (!currentMember.name || !currentMember.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    setMembers(members.map((m) => (m.id === currentMember.id ? currentMember : m)))
    setIsEditDialogOpen(false)

    // Update user data in localStorage if it exists
    const userKey = `user_${currentMember.email}`
    const userData = localStorage.getItem(userKey)
    if (userData) {
      const user = JSON.parse(userData)
      user.fullName = currentMember.name
      user.contactNumber = currentMember.contactNumber
      user.plan = currentMember.plan.toLowerCase()
      user.paymentStatus =
        currentMember.status === "Active" ? "approved" : currentMember.status === "Inactive" ? "rejected" : "pending"
      localStorage.setItem(userKey, JSON.stringify(user))
    }

    toast({
      title: "Member Updated",
      description: `${currentMember.name}'s information has been updated.`,
    })
  }

  const handleDeleteMember = () => {
    setMembers(members.filter((m) => m.id !== currentMember.id))
    setIsDeleteDialogOpen(false)

    // Remove user data from localStorage if it exists
    const userKey = `user_${currentMember.email}`
    if (localStorage.getItem(userKey)) {
      localStorage.removeItem(userKey)
    }

    toast({
      title: "Member Removed",
      description: `${currentMember.name} has been removed from the system.`,
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
            <p className="text-muted-foreground">Manage your gym members and their subscriptions.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              You have {members.filter((m) => m.status === "Active").length} active members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.plan}</TableCell>
                      <TableCell>{member.startDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            member.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : member.status === "Inactive"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentMember(member)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentMember(member)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No members found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update the details of the member.</DialogDescription>
          </DialogHeader>
          {currentMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentMember.email}
                  onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Number</Label>
                <Input
                  id="edit-contact"
                  value={currentMember.contactNumber}
                  onChange={(e) => setCurrentMember({ ...currentMember, contactNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select
                  value={currentMember.plan}
                  onValueChange={(value) => setCurrentMember({ ...currentMember, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentMember.status}
                  onValueChange={(value) => setCurrentMember({ ...currentMember, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentMember && (
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-full bg-gray-100 p-2">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{currentMember.name}</p>
                <p className="text-sm text-muted-foreground">{currentMember.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
