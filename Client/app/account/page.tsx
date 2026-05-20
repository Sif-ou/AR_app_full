"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { toast } from 'sonner';

// Placeholder Footer component - replace with your actual import path if needed
const Footer = () => (
  <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-background">
    <p>&copy; {new Date().getFullYear()} Smart Retail Platform. All rights reserved.</p>
  </footer>
);

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'STOCK' | 'DELIVERY' | 'MARKETING MANAGER';
  joinedDate?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/account');
          return;
        }

        // Your existing API logic goes here to populate 'user'
      } catch (error) {
        console.error("Auth verification failed:", error);
        toast.error("Session expired. Please log in again.");
        router.push('/account');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleRoleRedirect = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'ADMIN':
        router.push('/admin');
        break;
      case 'STOCK':
        router.push('/stock');
        break;
      case 'DELIVERY':
        router.push('/delivery');
        break;
      case 'MARKETING MANAGER':
        router.push('/marketing'); // Typo fixed from '/maketing'
        break;
      default:
        toast.error("No dedicated dashboard found for this role.");
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    setIsResettingPassword(true);
    try {
      // Your password reset api action here
      toast.success("Password reset instructions have been sent to your email!");
    } catch (error) {
      toast.error("Failed to send reset link.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Your account deletion api action here
      toast.success("Account permanently deleted.");
      localStorage.removeItem('token');
      router.push('/account');
    } catch (error) {
      toast.error("An error occurred while deleting your account.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully.");
    router.push('/account');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 space-y-2">
              <div className="p-4 bg-muted/40 rounded-lg mb-4 border">
                <h2 className="font-semibold text-lg truncate">{user?.name}</h2>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-primary/10 text-primary">
                  {user?.role}
                </span>
              </div>

              <nav className="space-y-1">
                <Button 
                  variant={activeSection === 'dashboard' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection('dashboard')}
                >
                  <User className="h-4 w-4" />
                  Overview
                </Button>
                <Button 
                  variant={activeSection === 'orders' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection('orders')}
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Orders
                </Button>
                <Button 
                  variant={activeSection === 'settings' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection('settings')}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>

                {user && user.role !== 'USER' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 border-dashed mt-4 text-primary hover:bg-primary/5"
                    onClick={handleRoleRedirect}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Management Console
                  </Button>
                )}

                <hr className="my-4 border-muted" />

                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </nav>
            </aside>

            {/* Dynamic Section Viewer */}
            <div className="flex-1 space-y-6">
              
              {activeSection === 'dashboard' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overview Dashboard</CardTitle>
                    <CardDescription>Review your recent activity and system status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="border p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Account Status</p>
                        <p className="text-lg font-medium mt-1 text-emerald-600">Active Authorized</p>
                      </div>
                      <div className="border p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Member Since</p>
                        <p className="text-lg font-medium mt-1">{user?.joinedDate || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'orders' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Track shipping updates and past purchases.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 border border-dashed rounded-lg bg-muted/20">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">No processing transactions found</p>
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
                        <Button 
                          variant="outline" 
                          onClick={handleResetPassword}
                          disabled={isResettingPassword}
                        >
                          {isResettingPassword ? "Sending Email..." : "Reset Password"}
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg bg-destructive/5">
                        <h3 className="font-medium text-destructive mb-1">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                              handleDeleteAccount();
                            }
                          }}
                        >
                          Delete Account
                        </Button>
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
  );
}