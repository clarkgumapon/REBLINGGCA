"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Dumbbell } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { login, storeMockUserRole } from "@/lib/auth"

const formSchema = z.object({
  emailOrUsername: z.string().min(1, {
    message: "Please enter your email or username.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  userType: z.enum(["admin", "staff", "member"], {
    required_error: "Please select a user type.",
  }).default("member"),
  rememberMe: z.boolean().default(false),
})

export function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [useMockAuth, setUseMockAuth] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: "admin", // Pre-fill with test account
      password: "admin123",    // Pre-fill with test password
      userType: "admin",      // Pre-select admin role
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setLoginError(null)
    
    console.log('Form submitted with values:', values);
    
    try {
      // Store the selected user role for mock auth
      storeMockUserRole(values.userType);
      
      // We need to determine if the input is an email or username
      // For now, we'll pass it directly to the login function which handles this internally
      const { user } = await login(values.emailOrUsername, values.password)
      
      console.log('Login successful, user:', user);
      
      // Check if the user role matches the selected role
      if (values.userType !== user.role) {
        const errorMsg = `You've selected ${values.userType} role but your account is a ${user.role} account.`;
        console.error(errorMsg);
        setLoginError(errorMsg);
        setIsLoading(false);
        return;
        }

        toast({
        title: "Login successful",
        description: `Welcome back, ${user.full_name}!`,
      })
      
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "staff") {
        router.push("/staff")
      } else {
        router.push("/member")
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to login. Please check your credentials.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handle toggle for mock authentication
  const toggleMockAuth = () => {
    setUseMockAuth(!useMockAuth);
    localStorage.setItem('useMockAuth', (!useMockAuth).toString());
    
    // Pre-fill the form based on mock user type
    if (!useMockAuth) {
      const selectedRole = form.getValues().userType;
      let username = 'member';
      let password = 'member123';
      
      if (selectedRole === 'admin') {
        username = 'admin';
        password = 'admin123';
      } else if (selectedRole === 'staff') {
        username = 'staff';
        password = 'staff123';
      }
      
      form.setValue('emailOrUsername', username);
      form.setValue('password', password);
    }
  };
  
  // Initialize useMockAuth from localStorage
  React.useEffect(() => {
    const storedValue = localStorage.getItem('useMockAuth');
    if (storedValue) {
      setUseMockAuth(storedValue === 'true');
    }
  }, []);

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg">
      <div className="flex flex-col space-y-4 text-center mb-6">
        <div className="mx-auto">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Niel's Fitness</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-end mb-2">
            <label className="text-xs text-muted-foreground mr-2">Use Mock Auth:</label>
            <input 
              type="checkbox" 
              checked={useMockAuth} 
              onChange={toggleMockAuth}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          
          <FormField
            control={form.control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com or username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                Forgot password?
              </Link>
            </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Login as</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (useMockAuth) {
                        // Update credentials based on selected role
                        let username = 'member';
                        let password = 'member123';
                        
                        if (value === 'admin') {
                          username = 'admin';
                          password = 'admin123';
                        } else if (value === 'staff') {
                          username = 'staff';
                          password = 'staff123';
                        }
                        
                        form.setValue('emailOrUsername', username);
                        form.setValue('password', password);
                      }
                    }}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                <RadioGroupItem value="admin" id="admin" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="admin">Admin</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                <RadioGroupItem value="staff" id="staff" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="staff">Staff</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                <RadioGroupItem value="member" id="member" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="member">Member</FormLabel>
                    </FormItem>
            </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="remember"
                  />
                </FormControl>
                <FormLabel className="font-normal text-sm" htmlFor="remember">
              Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          
          {loginError && (
            <div className="text-red-500 text-sm mt-2">
              {loginError}
          </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
      </form>
      </Form>
    </div>
  )
}
