'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, Heart, Settings, LogIn, UserPlus, ChevronRight, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [activeSection, setActiveSection] = useState('profile')

  // Registration & Auth Form States
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // Logged-in user profile details
  const [loggedInUser, setLoggedInUser] = useState({
    name: '',
    email: ''
  })

  // Fixed static data placeholder for features like orders/wishlist
  const [userState, setUserState] = useState({
    orders: [
      { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 1299 },
      { id: 'ORD-002', date: '2024-02-20', status: 'In Transit', total: 649 }
    ],
    wishlist: ['nordica-sofa', 'aurora-armchair']
  })

  // Sync auth state and values from localStorage safely on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedName = localStorage.getItem('username')
    const savedEmail = localStorage.getItem('userEmail')

    if (token) {
      setIsLoggedIn(true)
      setLoggedInUser({
        name: savedName || 'User Account',
        email: savedEmail || ''
      })
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage('')

    try {
      const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword
        })
      })

      if (response.ok) {
        const data = await response.json()

        localStorage.setItem('token', data.token)
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('username', data.username)
        localStorage.setItem('userEmail', data.email)

        setLoggedInUser({
          name: data.username,
          email: data.email
        })

        setStatusMessage('Welcome back! Logging you in... 🎉')
        setIsLoggedIn(true)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setStatusMessage(errorData.message || 'Invalid credentials. Please try again.')
      }
    } catch (error) {
      setStatusMessage('Network error. Could not reach backend authentication server.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match!")
      return
    }

    setLoading(true)
    setStatusMessage('')

    try {
      const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          phoneNum: phoneNumber,
          password
        })
      })

      if (response.ok) {
        setStatusMessage('Successfully registered! Please log in. 🎉')
        setUsername('')
        setEmail('')
        setPhoneNumber('')
        setPassword('')
        setConfirmPassword('')
        setActiveTab('login')
      } else {
        const errorData = await response.json().catch(() => ({}))
        setStatusMessage(errorData.message || `Registration failed: ${response.status}`)
      }
    } catch (error) {
      setStatusMessage('Network error. Could not reach backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveWishlist = (itemToRemove: string) => {
    setUserState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((item) => item !== itemToRemove)
    }))
  }

  const handleResetPassword = () => {
    alert(`A password reset link has been sent to ${loggedInUser.email || 'your email'}`)
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    setStatusMessage('')
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('https://ar-app-back-end.onrender.com/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: loggedInUser.name,
          email: loggedInUser.email
        })
      })

      if (response.ok) {
        localStorage.setItem('username', loggedInUser.name)
        localStorage.setItem('userEmail', loggedInUser.email)
        alert('Profile saved successfully!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.message || 'Failed to update profile settings.')
      }
    } catch (error) {
      alert('Network error. Could not sync profile changes to server.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    router.push('/account')
  }

  // Common Sections Mapping with matching Custom Icon styling wrappers
  const navigationItems = [
    { id: 'profile', label: 'My Profile', icon: User, desc: 'Personal details' },
    { id: 'orders', label: 'Recent Orders', icon: Package, desc: 'History & tracking' },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, desc: 'Items you love' },
    { id: 'settings', label: 'Account Settings', icon: Settings, desc: 'Security & options' },
  ]

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-6 sm:py-12 px-4">
          <div className="container mx-auto max-w-md">
            <Card className="w-full">
              <CardHeader className="text-center px-4 sm:px-6">
                <CardTitle className="font-serif text-2xl sm:text-3xl">Welcome to ARFURN</CardTitle>
                <CardDescription>Sign in to your account or create a new one</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="flex items-center justify-center gap-2 text-sm sm:text-base">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center justify-center gap-2 text-sm sm:text-base">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="identifier">Email or Phone Number</Label>
                        <Input
                          id="identifier"
                          name="identifier"
                          type="text"
                          placeholder="username@email.com or 0555123456"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          required
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="w-full"
                        />
                      </div>

                      <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                      </Button>

                      {statusMessage && (
                        <p className={`text-sm font-medium mt-2 text-center ${statusMessage.includes('🎉') ? 'text-green-600' : 'text-red-500'}`}>
                          {statusMessage}
                        </p>
                      )}

                      <p className="text-center text-sm text-muted-foreground mt-4">
                        <a href="#" className="text-accent hover:underline">Forgot your password?</a>
                      </p>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-phone">Phone Number</Label>
                        <Input
                          id="reg-phone"
                          type="tel"
                          placeholder="0555123456"
                          value={phoneNumber}
                          maxLength={10}
                          onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, '')
                            setPhoneNumber(onlyDigits)
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>

                      {statusMessage && (
                        <p className={`text-sm font-medium mt-2 text-center ${statusMessage.includes('🎉') ? 'text-green-600' : 'text-red-500'}`}>
                          {statusMessage}
                        </p>
                      )}
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-sm text-muted-foreground mb-4">Or continue with</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 w-full" asChild>
                      <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="justify-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0d0a0a] text-zinc-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Custom Premium Side Window Navigation */}
            <div className="lg:col-span-1 w-full flex flex-col bg-[#141111] rounded-2xl border border-zinc-800/60 overflow-hidden shadow-xl">
              
              {/* Header Label inside Window */}
              <div className="p-5 border-b border-zinc-800/60">
                <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Dashboard</p>
                <h2 className="text-lg font-medium text-zinc-200 mt-1">{loggedInUser.name}</h2>
              </div>

              {/* Navigation List Area */}
              <nav className="p-3 space-y-1.5 flex-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  const isSelected = activeSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left group ${
                        isSelected 
                          ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' 
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Rounded Luxury Styled Icon Container matching reference design */}
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors overflow-hidden ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:border-zinc-700'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-zinc-500 font-normal mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      
                      <ChevronRight className={`h-4 w-4 text-zinc-600 transition-transform ${
                        isSelected ? 'transform translate-x-0.5 text-amber-400' : 'group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  )
                })}
              </nav>

              {/* Drawer Box Custom Footer Area */}
              <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40 mt-auto">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl py-6 px-4 border border-zinc-800/80 hover:border-red-500/20 transition-all gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Sign Out Account</span>
                </Button>
              </div>

            </div>

            {/* Dashboard Workspace Views */}
            <div className="lg:col-span-3 space-y-6 w-full">
              {activeSection === 'profile' && (
                <Card className="bg-[#141111] border-zinc-800/60 text-zinc-100">
                  <CardHeader className="p-6 border-b border-zinc-800/40">
                    <CardTitle className="text-xl font-serif tracking-wide text-zinc-100">Profile Information</CardTitle>
                    <CardDescription className="text-zinc-400">Manage your verified account details</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Full Name</Label>
                        <Input
                          value={loggedInUser.name}
                          onChange={(e) => setLoggedInUser({ ...loggedInUser, name: e.target.value })}
                          className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Email Address</Label>
                        <Input
                          value={loggedInUser.email}
                          onChange={(e) => setLoggedInUser({ ...loggedInUser, email: e.target.value })}
                          className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-amber-500/50"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={loading} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-5 rounded-xl">
                      {loading ? 'Saving Changes...' : 'Save Profile'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'orders' && (
                <Card className="bg-[#141111] border-zinc-800/60 text-zinc-100">
                  <CardHeader className="p-6 border-b border-zinc-800/40">
                    <CardTitle className="text-xl font-serif tracking-wide text-zinc-100">Recent Orders</CardTitle>
                    <CardDescription className="text-zinc-400">Track and view purchase history</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {userState.orders.map(order => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/20 gap-4">
                          <div className="flex flex-col">
                            <p className="font-medium text-zinc-200 text-base">{order.id}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{order.date}</p>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                            <p className="font-medium text-base sm:text-lg text-zinc-100">${order.total}</p>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'wishlist' && (
                <Card className="bg-[#141111] border-zinc-800/60 text-zinc-100">
                  <CardHeader className="p-6 border-b border-zinc-800/40">
                    <CardTitle className="text-xl font-serif tracking-wide text-zinc-100">My Wishlist</CardTitle>
                    <CardDescription className="text-zinc-400">Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {userState.wishlist.length > 0 ? (
                        userState.wishlist.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/20 gap-4">
                            <p className="font-medium capitalize text-sm sm:text-base text-zinc-200">{item.replace('-', ' ')}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg shrink-0"
                              onClick={() => handleRemoveWishlist(item)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-zinc-500 py-8 text-sm sm:text-base">Your wishlist is empty.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'settings' && (
                <Card className="bg-[#141111] border-zinc-800/60 text-zinc-100">
                  <CardHeader className="p-6 border-b border-zinc-800/40">
                    <CardTitle className="text-xl font-serif tracking-wide text-zinc-100">Account Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Manage security settings and system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 border border-zinc-800/80 rounded-xl bg-zinc-900/30">
                      <h3 className="font-medium text-zinc-200 mb-1 text-sm sm:text-base">Security</h3>
                      <p className="text-xs sm:text-sm text-zinc-500 mb-4">Update your password to keep your account safe.</p>
                      <Button variant="outline" size="sm" onClick={handleResetPassword} className="border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white rounded-lg">Reset Password</Button>
                    </div>
                    <div className="p-4 border border-red-950/40 rounded-xl bg-red-950/10">
                      <h3 className="font-medium text-red-400 mb-1 text-sm sm:text-base">Danger Zone</h3>
                      <p className="text-xs sm:text-sm text-zinc-500 mb-4">Permanently wipe your account data and configurations.</p>
                      <Button variant="destructive" size="sm" className="bg-red-900/80 hover:bg-red-800 text-white rounded-lg">Delete Account</Button>
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