"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Trash2, User } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

// Interface for Staff member
interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  status: string
}

// Function to get staff from localStorage
const getStaffFromStorage = (): StaffMember[] => {
  const staff: StaffMember[] = []
  
  // Iterate through localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('user_')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}')
        // Only include users with staff or admin roles
        if (userData.role === 'staff' || userData.role === 'admin') {
          staff.push({
            id: parseInt(key.replace('user_', '')),
            name: userData.fullName || 'Unknown',
            email: userData.email || 'No email',
            role: userData.staffRole || 'Staff Member',
            status: userData.status || 'Active'
          })
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }

  return staff
}

// Function to save staff to localStorage
const saveStaffToStorage = (staff: StaffMember) => {
  const key = `user_${staff.id}`
  const userData = {
    fullName: staff.name,
    email: staff.email,
    role: 'staff',
    staffRole: staff.role,
    status: staff.status
  }
  localStorage.setItem(key, JSON.stringify(userData))
}

export default function StaffManagement() {
  const { toast } = useToast()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null)
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    email: '',
    role: '',
    status: 'Active'
  })

  // Load staff data on component mount
  useEffect(() => {
    setStaff(getStaffFromStorage())
  }, [])

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    const newId = Date.now()
    const staffMember: StaffMember = {
      id: newId,
      ...newStaff
    }

    // Save to localStorage
    saveStaffToStorage(staffMember)

    // Update state
    setStaff(prev => [...prev, staffMember])
    setIsAddDialogOpen(false)
    setNewStaff({
      name: '',
      email: '',
      role: '',
      status: 'Active'
    })

    toast({
      title: 'Staff Added',
      description: 'New staff member has been added successfully.'
    })
  }

  const handleEditStaff = () => {
    if (!currentStaff) return

    // Save to localStorage
    saveStaffToStorage(currentStaff)

    // Update state
    setStaff(prev =>
      prev.map(s => (s.id === currentStaff.id ? currentStaff : s))
    )
    setIsEditDialogOpen(false)

    toast({
      title: 'Staff Updated',
      description: 'Staff member information has been updated successfully.'
    })
  }

  const handleDeleteStaff = () => {
    if (!currentStaff) return

    // Remove from localStorage
    localStorage.removeItem(`user_${currentStaff.id}`)

    // Update state
    setStaff(prev => prev.filter(s => s.id !== currentStaff.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: 'Staff Deleted',
      description: 'Staff member has been removed successfully.'
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">Manage your gym staff members and their roles.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all duration-300 hover:scale-[1.02]">
                <Plus className="mr-2 h-4 w-4" /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details of the new staff member.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="juan@niels.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Nutritionist">Nutritionist</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Staff Member">Staff Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newStaff.status}
                    onValueChange={(value) => setNewStaff({ ...newStaff, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStaff}>Add Staff</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              You have {staff.filter((s) => s.status === "Active").length} active staff members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.role}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          staffMember.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {staffMember.status}
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
                              setCurrentStaff(staffMember)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCurrentStaff(staffMember)
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update the details of the staff member.</DialogDescription>
          </DialogHeader>
          {currentStaff && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentStaff.name}
                  onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentStaff.email}
                  onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentStaff.role}
                  onValueChange={(value) => setCurrentStaff({ ...currentStaff, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Nutritionist">Nutritionist</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Staff Member">Staff Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentStaff.status}
                  onValueChange={(value) => setCurrentStaff({ ...currentStaff, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentStaff && (
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-full bg-gray-100 p-2">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{currentStaff.name}</p>
                <p className="text-sm text-muted-foreground">{currentStaff.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              Delete Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
