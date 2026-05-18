"use client"

import React, { useState, useEffect } from 'react'

// --- Mock UI Components (Replace these with your actual shadcn/ui or component imports) ---
interface CardProps { children: React.ReactNode }
const Card = ({ children }: CardProps) => <div className="border bg-card text-card-foreground rounded-xl shadow-sm">{children}</div>
const CardHeader = ({ children }: CardProps) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>
const CardTitle = ({ children }: CardProps) => <h3 className="font-semibold leading-none tracking-tight text-xl">{children}</h3>
const CardDescription = ({ children }: CardProps) => <p className="text-sm text-muted-foreground">{children}</p>
const CardContent = ({ children }: CardProps) => <div className="p-6 pt-0">{children}</div>

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive'
  children: React.ReactNode
}
const Button = ({ variant = 'default', children, ...props }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  }
  return <button className={`${baseStyles} ${variants[variant]}`} {...props}>{children}</button>
}

const Footer = () => <footer className="border-t py-6 text-center text-sm text-muted-foreground">© 2026 Your Company. All rights reserved.</footer>
// -----------------------------------------------------------------------------------------

// Define types for our application
type Section = 'profile' | 'settings' | 'billing'
type UserRole = 'USER' | 'ADMIN' | 'STOCK' // Added 'STOCK' as a valid system role

interface User {
  email: string
  role: UserRole
}

export default function AccountPage() {
  // Authentication & Form States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoginView, setIsLoginView] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  // Active Dashboard Section
  const [activeSection, setActiveSection] = useState<Section>('settings')
  
  // Current logged-in user profile state
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Simulated login/register process
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields.")
      setLoading(false)
      return
    }

    try {
      // Mocking a response. In production, replace this with your Supabase / Firebase / NextAuth call.
      // E.g., if you are testing a "STOCK" user, we assign that role here:
      const mockUserRole: UserRole = email.includes('stock') ? 'STOCK' : 'USER'

      setCurrentUser({
        email: email,
        role: mockUserRole
      })
      setIsLoggedIn(true)
    } catch (err) {
      setError("Authentication failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  // Dashboard Settings Action Handlers
  const handleResetPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    alert("Password reset request submitted!")
  }

  const handleLogOut = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setEmail('')
    setPassword('')
  }

  // --- CRITICAL GATEWAY FIXED HERE ---
  // If the user is logged in, we explicitly check their roles. 
  // We added 'STOCK' to the whitelist alongside 'USER' and 'ADMIN' so they don't get blocked.
  const allowedRoles: UserRole[] = ['USER', 'ADMIN', 'STOCK']
  const isAuthorized = currentUser && allowedRoles.includes(currentUser.role)

  // 1. IF NOT LOGGED IN: Render the Unified Login / Register Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-md bg-background border rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {isLoginView ? "Account Login" : "Register Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoginView ? "Sign in to manage your stocks & settings" : "Create an account to get started"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="stockuser@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLoginView ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <button
              type="button"
              onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
              className="font-medium text-primary underline underline-offset-4"
            >
              {isLoginView ? "Need an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. IF LOGGED IN BUT ROLE IS BLOCKED (Safety Guardrail)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm border rounded-xl p-6 bg-destructive/5 border-destructive/20">
          <h2 className="text-lg font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your current account role ({currentUser?.role}) does not have permission to view this section.
          </p>
          <Button variant="outline" onClick={handleLogOut}>Return to Login</Button>
        </div>
      </div>
    )
  }

  // 3. IF LOGGED IN & AUTHORIZED (Your original UI code continues here)
  return (
    <>
      <main className="min-h-screen bg-background p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account</h1>
              <p className="text-xs text-muted-foreground mt-1">Logged in as: {currentUser?.email} ({currentUser?.role})</p>
            </div>
            <Button variant="outline" onClick={handleLogOut}>Log out</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="space-y-1">
              <button 
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === 'profile' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveSection('settings')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === 'settings' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                Settings
              </button>
            </aside>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {activeSection === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your details based on your {currentUser?.role} account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Welcome to your dashboard panel.</p>
                  </CardContent>
                </Card>
              )}

              {/* Your exact original snippet from prompt #1 */}
              {activeSection === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage security and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-1">Security</h3>
                        <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure.</p>
                        <Button variant="outline" onClick={handleResetPassword}>Reset Password</Button>
                      </div>
                      <div className="p-4 border rounded-lg bg-destructive/5">
                        <h3 className="font-medium text-destructive mb-1">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}