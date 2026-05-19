'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, Settings, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'

export default function AccountPage() {
  const { clearCart } = useCart()
  const { clearWishlist } = useWishlist()
  const [verificationCode, setVerificationCode] = useState('');
const [isVerifying, setIsVerifying] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [activeSection, setActiveSection] = useState('profile') 
const [registeredEmail, setRegisteredEmail] = useState('');
const [registeredPassword, setRegisteredPassword] = useState('');
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
  const [isCheckingRole, setIsCheckingRole] = useState(true)

  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // State to hold active logged-in user profile details dynamically
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
  })

  const handleRoleRedirect = (role: string) => {
    if (role === 'ADMIN') {
      router.push('/admin')
    } 
    else if ( role == 'STOCK' ) {
      router.push('/stock')
    }
    else if ( role == 'DELIVERY' ) {
      router.push('/delivery')
    }
    else if ( role == 'MARKETING MANAGER' ) {
      router.push('/maketing')
    }
    else {
      router.push('/')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedName = localStorage.getItem('username')
    const savedEmail = localStorage.getItem('userEmail')
    const savedRole = localStorage.getItem('userRole')

    if (savedRole === 'ADMIN') {
      router.push('/admin')
      return;
    }
    else if (savedRole === 'STOCK') {
      router.push('/stock')
      return;
    }
    else if (savedRole === 'DELIVERY') {
      router.push('/delivery')
      return;
    }
        else if (savedRole === 'MARKETING MANAGER') {
      router.push('/maketing')
      return;
    }

    if (token) {
      setIsLoggedIn(true)
      setLoggedInUser({
        name: savedName || 'User Account',
        email: savedEmail || ''
      })
    }

    setIsCheckingRole(false) 
  }, [])

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


 const handleResendCode = async () => {
const targetEmail = registeredEmail; // Direct point to the saved snapshot

if (!targetEmail) {
  setStatusMessage('Error: Verification email target missing.');
  setIsVerifying(false);
  return;
}

  setLoading(true);
  setStatusMessage('');

  try {
    const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/resend-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: targetEmail }) // Sends the exact registration email safely
    });

    if (response.ok) {
      setStatusMessage('A new verification code has been dispatched! 🎉');
    } else {
      const errorData = await response.json().catch(() => ({}));
      setStatusMessage(errorData.message || 'Failed to send a new code.');
    }
  } catch (error) {
    setStatusMessage('Network error. Unable to reach backend to resend code.');
  } finally {
    setLoading(false);
  }
};

const handleVerifyCode = async () => {
  setIsVerifying(true);
  setStatusMessage('');

  const targetEmail = registeredEmail || email;

  try {
    // 1. Verify the OTP Code
    const verifyResponse = await fetch('https://ar-app-back-end.onrender.com/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        email: targetEmail, 
        code: verificationCode 
      })
    });

    if (verifyResponse.ok) {
      setStatusMessage('Code verified! Logging you into your dashboard... 🚀');

      // 2. Run background automatic login using the registered snapshot credentials
      const loginResponse = await fetch('https://ar-app-back-end.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          identifier: targetEmail, 
          password: registeredPassword // Uses saved password snapshot
        })
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();

        // 3. Save auth credentials to log the user in completely
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('username', data.username); 
        localStorage.setItem('userEmail', data.email);

        

        setLoggedInUser({
          name: data.username,
          email: data.email
        });

        setStatusMessage('Account verified and logged in successfully! Redirecting... 🎉');

        // 4. Reset views and clear code states before sending home
        setTimeout(() => {
          setShowConfirmationMessage(false);
          setVerificationCode('');
          setRegisteredPassword(''); // Clear security state
          handleRoleRedirect(data.role);
        }, 2000);

      } else {
        // Fallback if background login failed for unexpected reasons
        setStatusMessage('Account verified successfully! Please log in manually on the Sign In tab.');
        setTimeout(() => {
          setActiveTab('login');
          setShowConfirmationMessage(false);
          setVerificationCode('');
        }, 2500);
      }
    } else {
      const errorData = await verifyResponse.json().catch(() => ({}));
      setStatusMessage(errorData.message || 'Invalid or expired verification code.');
    }
  } catch (error) {
    setStatusMessage('Network error during verification processing.');
  } finally {
    setIsVerifying(false);
  }
};

  if (isCheckingRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12">
          <div className="container mx-auto px-4 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-serif text-2xl">Welcome to ARFURN</CardTitle>
                <CardDescription>Sign in to your account or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form 
                      onSubmit={async (e) => { 
                        e.preventDefault(); 
                        setLoading(true);
                        setStatusMessage('');

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
                          });

                          if (response.ok) {
                            const data = await response.json(); 

                            localStorage.setItem('token', data.token);
                            localStorage.setItem('userRole', data.role);
                            localStorage.setItem('username', data.username); 
                            localStorage.setItem('userEmail', data.email);

                            // 1. Check for admin instantly and return early to stop execution context
                            if (data.role === 'ADMIN') {
                              router.push('/admin');
                              return; 
                            }
    else if (data.role === 'STOCK') {
      router.push('/stock')
      return;
    }
    else if (data.role === 'DELIVERY') {
      router.push('/delivery')
      return;
    }
        else if (data.role === 'MARKETING MANAGER') {
      router.push('/maketing')
      return;
    }

                            setLoggedInUser({
                              name: data.username,
                              email: data.email
                            });

                            setStatusMessage('Welcome back! Logging you in... 🎉');
                            setIsLoggedIn(true);

                            handleRoleRedirect(data.role);
                            
                          } else {
                            const errorData = await response.json().catch(() => ({}));
                            setStatusMessage(errorData.message || 'Invalid credentials. Please try again.');
                          }
                        } catch (error) {
                          setStatusMessage('Network error. Could not reach backend authentication server.');
                        } finally {
                          setLoading(false);
                        }
                      }} 
                      className="space-y-4"
                    >
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            name="password" 
                            type={showLoginPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required 
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                      </Button>

                      {statusMessage && (
                        <p className={`text-sm font-medium mt-2 text-center ${statusMessage.includes('🎉') ? 'text-green-600' : 'text-red-500'}`}>
                          {statusMessage}
                        </p>
                      )}

                      <p className="text-center text-sm text-muted-foreground">
                        <a href="#" className="text-accent hover:underline">Forgot your password?</a>
                      </p>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form 
                      onSubmit={async (e) => { 
                        e.preventDefault(); 
      
                        if (password !== confirmPassword) {
                          setStatusMessage("Passwords do not match!");
                          return;
                        }
                        
                        setLoading(true);
                        setStatusMessage('');

                        try {
                          const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/register', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                            },
                            body: JSON.stringify({ 
                              username: username,
                              email: email,
                              phoneNum: phoneNumber,
                              password: password 
                            })
                          });

if (response.ok) {
  // 1. Capture the email value safely first
  setRegisteredEmail(email);
  setRegisteredPassword(password);
  setShowConfirmationMessage(true);
  setStatusMessage('Successfully registered! Please verify your account. 🎉');
  
  // 2. Safe to clear form inputs now
  setUsername(''); setEmail(''); setPhoneNumber(''); setPassword(''); setConfirmPassword('');
}
                          
                          else {
                            const errorData = await response.json().catch(() => ({}));
                            setStatusMessage(errorData.message || `Registration failed: ${response.status}`);
                          }
                        } catch (error) {
                          setStatusMessage('Network error. Could not reach backend.');
                        } finally {
                          setLoading(false);
                        }
                      }} 
                      className="space-y-4"
                    >
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
                            const onlyDigits = e.target.value.replace(/\D/g, '');
                            setPhoneNumber(onlyDigits);
                          }}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                          <Input 
                            id="reg-password" 
                            type={showRegPassword ? "text" : "password"} 
                            placeholder="Create a password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirm-password" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
<Button type="submit" className="w-full" disabled={loading || showConfirmationMessage}>
  {loading ? 'Creating Account...' : 'Create Account'}
</Button>

{/* The dynamic confirmation panel */}
{showConfirmationMessage && (
  <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-4 text-center animate-fade-in">
    <p className="text-sm font-medium text-green-600">
      Confirm: a verification code was sent to your real email.
    </p>
    
    {/* Verification Code Input Field */}
    <div className="space-y-2 text-left">
      <Label htmlFor="verification-code" className="text-xs font-semibold">Enter Verification Code</Label>
      <div className="flex gap-2">
        <Input 
          id="verification-code"
          type="text"
          maxLength={6} // Adjust if your OTP code layout length differs
          placeholder="Enter code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="text-center font-mono tracking-widest text-lg"
        />
<Button 
  type="button" 
  onClick={() => handleVerifyCode()} // This will now clear perfectly without errors
  disabled={isVerifying || !verificationCode}
  className="bg-accent hover:bg-accent/90"
>
  {isVerifying ? 'Verifying...' : 'Verify'}
</Button>
      </div>
    </div>
    
    {/* Resend Code paragraph */}
    <p className="text-xs text-muted-foreground pt-1 border-t">
      Didn't get the code?{' '}
      <button
        type="button"
        disabled={loading}
        onClick={handleResendCode}
        className="text-accent font-semibold hover:underline cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend code'}
      </button>
    </p>
  </div>
)}

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
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-bold mb-8">My Account</h1>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {[
                      { id: 'profile', label: 'Profile', icon: User },
                      { id: 'orders', label: 'Orders', icon: Package },
                      { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          activeSection === item.id 
                            ? 'bg-accent/10 text-accent font-medium' 
                            : 'hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
              <Button
  variant="outline"
  className="w-full mt-4"
  onClick={() => {
    // 1. Clear authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    
    // 2. Clear the cart state instantly
    clearCart()
clearWishlist()
    // 3. Update login view state and redirect
    setIsLoggedIn(false)
    router.push('/account')
  }}
>
  Sign Out
</Button>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {activeSection === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          value={loggedInUser.name} 
                          onChange={(e) => setLoggedInUser({ ...loggedInUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          value={loggedInUser.email} 
                          onChange={(e) => setLoggedInUser({ ...loggedInUser, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={loading}>
                      {loading ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'orders' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Track your order history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userState.orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total}</p>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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